import { Router } from "express";
import {
    PreApproveVisitor,
    GetMyVisitors,
    CheckInVisitor,
    CheckOutVisitor,
    GetAllVisitors,
} from "./visitor.controller";
import { AdminGuard, ResidentGuard, AdminStaffGuard } from "../middleware/gaurd.middleware";

const VisitorRouter = Router();

// Resident Routes
VisitorRouter.post("/pre-approve", ResidentGuard, PreApproveVisitor);
VisitorRouter.get("/my-visitors", ResidentGuard, GetMyVisitors);

// Security / Admin Routes
VisitorRouter.post("/check-in", AdminStaffGuard, CheckInVisitor);
VisitorRouter.patch("/:id/check-out", AdminStaffGuard, CheckOutVisitor);
VisitorRouter.get("/", AdminStaffGuard, GetAllVisitors);

export default VisitorRouter;