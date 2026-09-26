import { Response } from "express";
import ComplaintModel from "./complaint.model";
import ResidentModel from "../resident/resident.model";
import StaffModel from "../staff/staff.model";
import StaffSlotModel from "../staff/staff-slot.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AuthenticatedRequest } from "../middleware/gaurd.middleware";
import { sendComplaintUpdateMail } from "../utils/mail.util";
import { analyzeComplaintWithGemini } from "../utils/gemini.util";
import { getAIStaffRecommendations, checkSlotConflict } from "../staff/staff-scheduling.service";
import { generateJobSheetNumber, getJobSheetDetails } from "./job-sheet.service";
import { uploadBufferToCloudinary } from "../utils/cloudinary.util";

// Resident/Admin Action: Scan / Preview AI Analysis on draft complaint description
export const AnalyzeComplaintDraft = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { description, title } = req.body;

    if (!description || description.trim().length === 0) {
        throw new ApiError(400, "Description is required for AI analysis");
    }

    const aiResult = await analyzeComplaintWithGemini(description, title);
    return res.status(200).json(new ApiResponse(200, aiResult, "AI Analysis completed successfully"));
});

// Resident Action: Create Complaint (Auto-scans with Gemini AI)
export const CreateComplaint = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const residentId = req.user?.id;
    const { description, title, attachments, preferredDate } = req.body;

    if (!description || description.trim().length === 0) {
        throw new ApiError(400, "Description is required to file a complaint");
    }

    const resident: any = await ResidentModel.findById(residentId).populate("flat");
    if (!resident || !resident.flat) {
        throw new ApiError(400, "Resident or flat information not found");
    }

    const buildingId = resident.flat.building;
    const building: any = await (await import("../building/building.schema")).default.findById(buildingId);
    if (!building) {
        throw new ApiError(404, "Building not found for resident");
    }

    // 1. Run Google Gemini AI Analysis
    const aiAnalysis = await analyzeComplaintWithGemini(description, title);

    const finalTitle = title && title.trim().length > 0 ? title.trim() : aiAnalysis.title;
    const finalCategory = aiAnalysis.category || "maintenance";
    const finalPriority = aiAnalysis.priority || "medium";

    // 2. Create Complaint with rich AI metadata
    const complaint = await ComplaintModel.create({
        title: finalTitle,
        description,
        resident: residentId,
        flat: resident.flat._id,
        residence: building.residence,
        category: finalCategory,
        priority: finalPriority,
        attachments: attachments || [],
        aiAnalysis: {
            rawSummary: aiAnalysis.title,
            suggestedCategory: aiAnalysis.category,
            suggestedPriority: aiAnalysis.priority,
            requiredSkill: aiAnalysis.requiredSkill,
            suggestedDepartment: aiAnalysis.department,
            reasoning: aiAnalysis.reasoning,
            estimatedDurationHours: aiAnalysis.estimatedDurationHours,
            analyzedAt: new Date(),
        },
        scheduledDate: preferredDate || new Date().toISOString().split("T")[0],
    });

    return res.status(201).json(new ApiResponse(201, complaint, "Complaint filed and analyzed by AI successfully"));
});

// Admin Action: Get AI Staff Slot Recommendations for a Complaint
export const GetStaffRecommendationsForComplaint = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { targetDate } = req.query;

    const complaint: any = await ComplaintModel.findById(id);
    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }

    const dateStr = (targetDate as string) || complaint.scheduledDate || new Date().toISOString().split("T")[0];

    const recommendations = await getAIStaffRecommendations({
        residenceId: complaint.residence,
        requiredSkill: complaint.aiAnalysis?.requiredSkill,
        category: complaint.category,
        targetDate: dateStr,
    });

    return res.status(200).json(new ApiResponse(200, {
        complaintId: complaint._id,
        aiAnalysis: complaint.aiAnalysis,
        category: complaint.category,
        priority: complaint.priority,
        targetDate: dateStr,
        recommendations,
    }, "AI staff recommendations fetched successfully"));
});

// Admin Action: Assign Complaint with Time Slot & Generate Job Sheet
export const AssignComplaintWithSlot = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { staffId, date, startTime, endTime, adminNote } = req.body;
    const adminId = req.user?.id;

    if (!staffId || !date || !startTime || !endTime) {
        throw new ApiError(400, "staffId, date, startTime, and endTime are required");
    }

    const complaint = await ComplaintModel.findById(id).populate("resident", "name email");
    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }

    // Check for schedule conflict
    const hasConflict = await checkSlotConflict(staffId, date, startTime, endTime, complaint._id.toString());
    if (hasConflict) {
        throw new ApiError(409, `Staff member is already booked for ${date} between ${startTime} and ${endTime}. Please pick another slot or staff member.`);
    }

    // 1. Create or update the StaffSlot entry
    const slot = await StaffSlotModel.create({
        staff: staffId,
        residence: complaint.residence,
        complaint: complaint._id,
        date,
        startTime,
        endTime,
        status: "booked",
        notes: `Assigned for Ticket #${complaint._id.toString().slice(-6).toUpperCase()}`,
    });

    // 2. Generate unique printable Job Sheet Number
    const jobSheetNum = generateJobSheetNumber();

    // 3. Update Complaint
    complaint.status = "assigned";
    complaint.assignedTo = staffId as any;
    complaint.assignedBy = adminId as any;
    complaint.scheduledDate = date;
    complaint.scheduledSlot = { startTime, endTime };
    complaint.slotId = slot._id as any;
    complaint.jobSheetNumber = jobSheetNum;
    complaint.jobSheetGeneratedAt = new Date();
    if (adminNote) complaint.adminNote = adminNote;

    await complaint.save();

    // 4. Increment Staff activeTasksCount and set availability to busy if needed
    await StaffModel.findByIdAndUpdate(staffId, {
        $inc: { activeTasksCount: 1 },
    });

    // 5. Send notification email to resident
    const resident: any = complaint.resident;
    if (resident && resident.email) {
        sendComplaintUpdateMail({
            email: resident.email,
            residentName: resident.name,
            title: complaint.title,
            status: "Assigned",
            note: `Assigned for ${date} between ${startTime} - ${endTime}. Job Sheet #${jobSheetNum} created.`,
        }).catch(console.error);
    }

    return res.status(200).json(new ApiResponse(200, complaint, "Complaint assigned and slot booked successfully"));
});

// Admin/Staff Action: Get Printable Job Sheet Details
export const GetJobSheet = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const jobSheetData = await getJobSheetDetails(id as string);
    return res.status(200).json(new ApiResponse(200, jobSheetData, "Job sheet details retrieved successfully"));
});

// Staff Action: Resolve Complaint with 3 Mandatory Cloudinary Proof Photos
export const ResolveComplaintWithProof = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = rawId as string;
    const { resolutionNote, staffNote } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    const complaint = await ComplaintModel.findById(id).populate("resident", "name email");
    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }

    const signedFormFile = files?.["signedForm"]?.[0];
    const resolvedWorkFile = files?.["resolvedWork"]?.[0];
    const staffProofFile = files?.["staffProof"]?.[0];

    // Check if files or existing URLs are present
    const existingProof: any = complaint.resolutionProof || {};
    const signedFormUrl = signedFormFile 
        ? (await uploadBufferToCloudinary(signedFormFile.buffer, "smart_residence/signed_forms", `signed_${id}`)).url
        : (req.body.signedFormUrl || existingProof.signedFormUrl);

    const resolvedWorkUrl = resolvedWorkFile 
        ? (await uploadBufferToCloudinary(resolvedWorkFile.buffer, "smart_residence/resolved_works", `work_${id}`)).url
        : (req.body.resolvedWorkUrl || existingProof.resolvedWorkUrl);

    const staffProofUrl = staffProofFile 
        ? (await uploadBufferToCloudinary(staffProofFile.buffer, "smart_residence/staff_proofs", `staff_${id}`)).url
        : (req.body.staffProofUrl || existingProof.staffProofUrl);

    if (!signedFormUrl || !resolvedWorkUrl || !staffProofUrl) {
        throw new ApiError(400, "All 3 resolution proofs are mandatory: (1) Signed Physical Job Sheet, (2) Solved Work Photo, (3) Staff on-site Photo.");
    }

    // Update Complaint
    complaint.status = "resolved";
    complaint.resolvedAt = new Date();
    if (resolutionNote) complaint.resolutionNote = resolutionNote;
    if (staffNote) complaint.staffNote = staffNote;

    complaint.resolutionProof = {
        signedFormUrl,
        resolvedWorkUrl,
        staffProofUrl,
        uploadedAt: new Date(),
        verifiedByResident: false,
        residentFeedback: null,
    };

    await complaint.save();

    // Release Staff Slot & Decrement workload
    if (complaint.slotId) {
        await StaffSlotModel.findByIdAndUpdate(complaint.slotId, { status: "completed" });
    }

    if (complaint.assignedTo) {
        await StaffModel.findByIdAndUpdate(complaint.assignedTo, {
            $inc: { activeTasksCount: -1 },
        });
    }

    // Send email to resident
    const resident: any = complaint.resident;
    if (resident && resident.email) {
        sendComplaintUpdateMail({
            email: resident.email,
            residentName: resident.name,
            title: complaint.title,
            status: "Resolved",
            note: resolutionNote || "Work completed and verified with signed job sheet.",
        }).catch(console.error);
    }

    return res.status(200).json(new ApiResponse(200, complaint, "Complaint resolved and verified with proofs successfully"));
});

// Resident Action: Get My Complaints
export const GetMyComplaints = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const residentId = req.user?.id;
    const complaints = await ComplaintModel.find({ resident: residentId })
        .populate("assignedTo", "name phone role department")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, complaints, "Complaints fetched successfully"));
});

// Staff Action: Get Tasks Assigned to Logged-in Staff
export const GetStaffAssignedComplaints = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const staffId = req.user?.id;
    const { status, date } = req.query;

    const filter: any = { assignedTo: staffId };
    if (status) filter.status = status;
    if (date) filter.scheduledDate = date;

    const complaints = await ComplaintModel.find(filter)
        .populate("resident", "name phone")
        .populate("flat", "flatNumber floor")
        .sort({ scheduledDate: 1, createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, complaints, "Assigned tasks fetched successfully"));
});

// Admin Action: Get All Complaints
export const GetAllComplaints = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { status, category, priority, date } = req.query;

    let filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (date) filter.scheduledDate = date;

    const complaints = await ComplaintModel.find(filter)
        .populate("resident", "name phone flat")
        .populate("assignedTo", "name phone role department avatar availabilityStatus")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, complaints, "Complaints fetched successfully"));
});

// Staff/Admin Action: Update Complaint Status
export const UpdateComplaintStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { status, staffNote, resolutionNote } = req.body;

    const complaint = await ComplaintModel.findById(id).populate("resident", "name email");
    if (!complaint) throw new ApiError(404, "Complaint not found");

    if (status) complaint.status = status;
    if (staffNote) complaint.staffNote = staffNote;
    if (resolutionNote) complaint.resolutionNote = resolutionNote;

    if (status === "resolved") {
        complaint.resolvedAt = new Date();
    } else if (status === "closed") {
        complaint.closedAt = new Date();
    }

    await complaint.save();

    return res.status(200).json(new ApiResponse(200, complaint, "Complaint status updated successfully"));
});