import { Router } from "express";
import {
    CreateResidence,
    GetMyResidence,
    UpdateResidence,
    GetResidenceById,
} from "./residence.controller";
import { AdminGuard, AnyAuthGuard } from "../middleware/gaurd.middleware";

const ResidenceRouter = Router();

// Admin-managed routes
ResidenceRouter.post("/", AdminGuard, CreateResidence);
ResidenceRouter.get("/my-residence", AdminGuard, GetMyResidence);
ResidenceRouter.put("/:id", AdminGuard, UpdateResidence);

// General viewing for authenticated members
ResidenceRouter.get("/:id", AnyAuthGuard, GetResidenceById);

export default ResidenceRouter;
