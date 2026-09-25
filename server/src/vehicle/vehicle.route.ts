import { Router } from "express";
import {
    RegisterVehicle,
    GetMyVehicles,
    DeleteVehicle,
    SearchVehicle,
    GetAllVehicles,
} from "./vehicle.controller";
import { AdminGuard, ResidentGuard, AdminStaffGuard } from "../middleware/gaurd.middleware";

const VehicleRouter = Router();

// Resident Routes
VehicleRouter.post("/", ResidentGuard, RegisterVehicle);
VehicleRouter.get("/my-vehicles", ResidentGuard, GetMyVehicles);
VehicleRouter.delete("/:id", ResidentGuard, DeleteVehicle);

// Security / Admin Routes
VehicleRouter.get("/search", AdminStaffGuard, SearchVehicle);
VehicleRouter.get("/", AdminGuard, GetAllVehicles);

export default VehicleRouter;
