import { Router } from "express";
import {
    SeedSuperAdmin,
    LoginSuperAdmin,
    LogoutSuperAdmin,
    GetSuperAdminProfile,
    GetPlatformStats,
    CreateAdminBySuperAdmin,
    GetAllAdmins,
    ToggleAdminStatus,
    VerifyOtpSuperAdmin,
    CreateResidenceBySuperAdmin,
    GetAllResidencesForSuperAdmin,
    AssignResidenceToAdmin,
} from "./super-admin.controller";
import { SuperAdminGuard } from "../middleware/gaurd.middleware";

const SuperAdminRouter = Router();

// Public / Bootstrap routes
SuperAdminRouter.post("/seed", SeedSuperAdmin);
SuperAdminRouter.post("/login", LoginSuperAdmin);
SuperAdminRouter.post("/verify-otp", VerifyOtpSuperAdmin);
SuperAdminRouter.post("/logout", LogoutSuperAdmin);

// Guarded SuperAdmin routes
SuperAdminRouter.get("/profile", SuperAdminGuard, GetSuperAdminProfile);
SuperAdminRouter.get("/stats", SuperAdminGuard, GetPlatformStats);
SuperAdminRouter.post("/create-admin", SuperAdminGuard, CreateAdminBySuperAdmin);
SuperAdminRouter.get("/admins", SuperAdminGuard, GetAllAdmins);
SuperAdminRouter.patch("/admins/:id/status", SuperAdminGuard, ToggleAdminStatus);

// Residence Management & Assignment
SuperAdminRouter.post("/create-residence", SuperAdminGuard, CreateResidenceBySuperAdmin);
SuperAdminRouter.get("/residences", SuperAdminGuard, GetAllResidencesForSuperAdmin);
SuperAdminRouter.post("/assign-residence", SuperAdminGuard, AssignResidenceToAdmin);

export default SuperAdminRouter;