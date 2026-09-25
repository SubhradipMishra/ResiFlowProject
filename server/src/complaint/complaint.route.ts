import { Router } from "express";
import {
    CreateComplaint,
    GetMyComplaints,
    GetAllComplaints,
    AssignComplaint,
    UpdateComplaintStatus,
} from "./complaint.controller";
import { AdminGuard, ResidentGuard, StaffGuard, AdminStaffGuard } from "../middleware/gaurd.middleware";

const ComplaintRouter = Router();

// Resident Routes
ComplaintRouter.post("/", ResidentGuard, CreateComplaint);
ComplaintRouter.get("/my-complaints", ResidentGuard, GetMyComplaints);

// Admin / Staff Management Routes
ComplaintRouter.get("/", AdminStaffGuard, GetAllComplaints);
ComplaintRouter.patch("/:id/assign", AdminGuard, AssignComplaint);
ComplaintRouter.patch("/:id/status", AdminStaffGuard, UpdateComplaintStatus);

export default ComplaintRouter;