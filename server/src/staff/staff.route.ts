import { Router } from "express";
import {
    CreateStaff,
    GetAllStaff,
    UpdateStaff,
    ToggleStaffStatus,
    LoginStaff,
    VerifyOtpStaff,
    LogoutStaff,
    GetStaffDashboard,
} from "./staff.controller";
import { AdminGuard, StaffGuard } from "../middleware/gaurd.middleware";

const StaffRouter = Router();

// Staff Login / Auth Routes
StaffRouter.post("/login", LoginStaff);
StaffRouter.post("/verify-otp", VerifyOtpStaff);
StaffRouter.post("/logout", LogoutStaff);

// Staff Dashboard
StaffRouter.get("/dashboard", StaffGuard, GetStaffDashboard);

// Admin Management Routes
StaffRouter.post("/", AdminGuard, CreateStaff);
StaffRouter.get("/", AdminGuard, GetAllStaff);
StaffRouter.put("/:id", AdminGuard, UpdateStaff);
StaffRouter.patch("/:id/status", AdminGuard, ToggleStaffStatus);

export default StaffRouter;