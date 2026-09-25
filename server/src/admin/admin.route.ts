import { Router } from "express";
import {
    LoginAdmin,
    LogoutAdmin,
    GetAdminProfile,
    UpdateAdminProfile,
    GetAdminDashboardStats,
    VerifyOtpAdmin,
} from "./admin.controller";
import { AdminGuard } from "../middleware/gaurd.middleware";

const AdminRouter = Router();

// Public routes
AdminRouter.post("/login", LoginAdmin);
AdminRouter.post("/verify-otp", VerifyOtpAdmin);
AdminRouter.post("/logout", LogoutAdmin);

// Guarded Admin routes
AdminRouter.get("/profile", AdminGuard, GetAdminProfile);
AdminRouter.put("/profile", AdminGuard, UpdateAdminProfile);
AdminRouter.get("/dashboard", AdminGuard, GetAdminDashboardStats);

export default AdminRouter;