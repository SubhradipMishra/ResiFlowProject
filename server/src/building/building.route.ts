import { Router } from "express";
import {
    CreateBuilding,
    GetBuildings,
    GetBuildingById,
    UpdateBuilding,
    DeleteBuilding,
} from "./building.controller";
import { AdminGuard, AnyAuthGuard } from "../middleware/gaurd.middleware";

const BuildingRouter = Router();

BuildingRouter.post("/", AdminGuard, CreateBuilding);
BuildingRouter.get("/", AnyAuthGuard, GetBuildings);
BuildingRouter.get("/:id", AnyAuthGuard, GetBuildingById);
BuildingRouter.put("/:id", AdminGuard, UpdateBuilding);
BuildingRouter.delete("/:id", AdminGuard, DeleteBuilding);

export default BuildingRouter;
