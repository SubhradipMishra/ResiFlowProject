import { Types } from "mongoose";
import ComplaintModel from "./complaint.model";
import ResidenceModel from "../residence/residence.model";
import ResidentModel from "../resident/resident.model";
import StaffModel from "../staff/staff.model";
import { ApiError } from "../utils/api-error";

export const generateJobSheetNumber = (): string => {
    const today = new Date();
    const datePart = today.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `JS-${datePart}-${randomSuffix}`;
};

export const getJobSheetDetails = async (complaintId: string | Types.ObjectId) => {
    const complaint: any = await ComplaintModel.findById(complaintId)
        .populate({
            path: "resident",
            select: "name email phone",
        })
        .populate({
            path: "flat",
            select: "flatNumber floor",
            populate: {
                path: "building",
                select: "name block",
            },
        })
        .populate({
            path: "residence",
            select: "name address city state zipCode",
        })
        .populate({
            path: "assignedTo",
            select: "name phone employeeId role department",
        });

    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }

    return {
        jobSheetNumber: complaint.jobSheetNumber || `JS-${complaint._id.toString().slice(-6).toUpperCase()}`,
        complaintId: complaint._id,
        createdAt: complaint.createdAt,
        scheduledDate: complaint.scheduledDate || new Date().toISOString().split("T")[0],
        scheduledSlot: complaint.scheduledSlot || { startTime: "09:00", endTime: "11:00" },
        status: complaint.status,
        category: complaint.category,
        priority: complaint.priority,
        title: complaint.title,
        description: complaint.description,
        aiReasoning: complaint.aiAnalysis?.reasoning || "Standard property maintenance",
        
        residence: {
            name: complaint.residence?.name || "Smart Residence Community",
            address: complaint.residence?.address || "",
            city: complaint.residence?.city || "",
            state: complaint.residence?.state || "",
        },
        
        resident: {
            name: complaint.resident?.name || "Resident",
            phone: complaint.resident?.phone || "N/A",
            email: complaint.resident?.email || "",
            flatNumber: complaint.flat?.flatNumber || "N/A",
            floor: complaint.flat?.floor || "N/A",
            building: complaint.flat?.building?.name || "Main Wing",
        },

        assignedStaff: complaint.assignedTo ? {
            name: complaint.assignedTo.name,
            phone: complaint.assignedTo.phone,
            employeeId: complaint.assignedTo.employeeId,
            role: complaint.assignedTo.role,
            department: complaint.assignedTo.department,
        } : null,
    };
};
