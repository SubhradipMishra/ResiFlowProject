import { Router } from "express";
import {
    CreateResident,
    LoginResident,
    LogoutResident,
    GetResidentMe,
    UpdateResidentMe,
    GetAllResidents,
    ToggleResidentStatus,
    UpdateResidentByAdmin,
    DeleteResidentByAdmin,
} from "./resident.controller";
import { AdminGuard, ResidentGuard } from "../middleware/gaurd.middleware";

const ResidentRouter = Router();

// Public routes
ResidentRouter.post("/login", LoginResident);
ResidentRouter.post("/logout", LogoutResident);

// Resident Self-Service routes
ResidentRouter.get("/me", ResidentGuard, GetResidentMe);
ResidentRouter.put("/me", ResidentGuard, UpdateResidentMe);

// Admin Resident Management routes
ResidentRouter.post("/", AdminGuard, CreateResident);
ResidentRouter.get("/", AdminGuard, GetAllResidents);
ResidentRouter.put("/:id", AdminGuard, UpdateResidentByAdmin);
ResidentRouter.delete("/:id", AdminGuard, DeleteResidentByAdmin);
ResidentRouter.patch("/:id/status", AdminGuard, ToggleResidentStatus);

export default ResidentRouter;