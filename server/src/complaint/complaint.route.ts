import { Router } from "express";
import {
    CreateComplaint,
    AnalyzeComplaintDraft,
    GetMyComplaints,
    GetAllComplaints,
    GetStaffAssignedComplaints,
    GetStaffRecommendationsForComplaint,
    AssignComplaintWithSlot,
    GetJobSheet,
    ResolveComplaintWithProof,
    UpdateComplaintStatus,
} from "./complaint.controller";
import { AdminGuard, ResidentGuard, StaffGuard, AdminStaffGuard } from "../middleware/gaurd.middleware";
import { upload } from "../utils/cloudinary.util";

const ComplaintRouter = Router();

// Draft AI Analysis (preview before submission)
ComplaintRouter.post("/analyze-draft", ResidentGuard, AnalyzeComplaintDraft);

// Resident Routes
ComplaintRouter.post("/", ResidentGuard, CreateComplaint);
ComplaintRouter.get("/my-complaints", ResidentGuard, GetMyComplaints);

// Staff Specific Routes
ComplaintRouter.get("/staff-tasks", StaffGuard, GetStaffAssignedComplaints);
ComplaintRouter.post(
    "/:id/resolve-proof",
    AdminStaffGuard,
    upload.fields([
        { name: "signedForm", maxCount: 1 },
        { name: "resolvedWork", maxCount: 1 },
        { name: "staffProof", maxCount: 1 },
    ]),
    ResolveComplaintWithProof
);

// Job Sheet (Printable Work Order)
ComplaintRouter.get("/:id/job-sheet", AdminStaffGuard, GetJobSheet);

// Admin AI Recommendation & Slot Assignment
ComplaintRouter.get("/:id/recommendations", AdminGuard, GetStaffRecommendationsForComplaint);
ComplaintRouter.patch("/:id/assign-slot", AdminGuard, AssignComplaintWithSlot);
ComplaintRouter.patch("/:id/assign", AdminGuard, AssignComplaintWithSlot); // Backwards compatibility

// General Complaint Management
ComplaintRouter.get("/", AdminStaffGuard, GetAllComplaints);
ComplaintRouter.patch("/:id/status", AdminStaffGuard, UpdateComplaintStatus);

export default ComplaintRouter;