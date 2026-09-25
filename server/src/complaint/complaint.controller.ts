import { Request, Response } from "express";
import ComplaintModel from "./complaint.model";
import ResidentModel from "../resident/resident.model";
import ResidenceModel from "../residence/residence.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AuthenticatedRequest } from "../middleware/gaurd.middleware";
import { sendComplaintUpdateMail } from "../utils/mail.util";

// Resident Action: Create Complaint
export const CreateComplaint = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const residentId = req.user?.id;
    const { title, description, category, priority, attachments } = req.body;

    if (!title || !description || !category) {
        throw new ApiError(400, "Title, description, and category are required");
    }

    const resident: any = await ResidentModel.findById(residentId).populate('flat');
    if (!resident || !resident.flat) {
        throw new ApiError(400, "Resident or flat information not found");
    }

    const buildingId = resident.flat.building;
    const building: any = await (await import('../building/building.schema')).default.findById(buildingId);

    const complaint = await ComplaintModel.create({
        title,
        description,
        resident: residentId,
        flat: resident.flat._id,
        residence: building.residence,
        category: category.toLowerCase().trim(),
        priority: priority ? priority.toLowerCase().trim() : "medium",
        attachments: attachments || [],
    });

    return res.status(201).json(new ApiResponse(201, complaint, "Complaint registered successfully"));
});

// Resident Action: Get My Complaints
export const GetMyComplaints = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const residentId = req.user?.id;
    const complaints = await ComplaintModel.find({ resident: residentId }).sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, complaints, "Complaints fetched successfully"));
});

// Admin/Staff Action: Get All Complaints
export const GetAllComplaints = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { status, category, priority } = req.query;
    
    // In a real app, scope to residence (from admin or staff profile)
    // For simplicity, we just filter
    let filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const complaints = await ComplaintModel.find(filter)
        .populate("resident", "name phone flat")
        .populate("assignedTo", "name phone department")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, complaints, "Complaints fetched successfully"));
});

// Admin Action: Assign Complaint
export const AssignComplaint = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { staffId } = req.body;
    const adminId = req.user?.id;

    if (!staffId) throw new ApiError(400, "Staff ID is required to assign");

    const complaint = await ComplaintModel.findByIdAndUpdate(
        id,
        { status: "assigned", assignedTo: staffId, assignedBy: adminId },
        { new: true }
    ).populate("resident", "name email");

    if (!complaint) throw new ApiError(404, "Complaint not found");

    // Send email notification to resident
    const resident: any = complaint.resident;
    if (resident && resident.email) {
        sendComplaintUpdateMail({
            email: resident.email,
            residentName: resident.name,
            title: complaint.title,
            status: "Assigned",
            note: "A staff member has been assigned to your complaint."
        }).catch(console.error);
    }

    return res.status(200).json(new ApiResponse(200, complaint, "Complaint assigned successfully"));
});

// Staff Action: Update Status
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
    }

    await complaint.save();

    // Notify resident
    const resident: any = complaint.resident;
    if (resident && resident.email) {
        sendComplaintUpdateMail({
            email: resident.email,
            residentName: resident.name,
            title: complaint.title,
            status: complaint.status,
            note: status === "resolved" ? resolutionNote : staffNote
        }).catch(console.error);
    }

    return res.status(200).json(new ApiResponse(200, complaint, "Complaint status updated successfully"));
});