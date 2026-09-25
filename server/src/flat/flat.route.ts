import { Router } from "express";
import {
    CreateFlat,
    GetFlats,
    GetFlatById,
    UpdateFlat,
    DeleteFlat,
} from "./flat.controller";
import { AdminGuard, AnyAuthGuard } from "../middleware/gaurd.middleware";

const FlatRouter = Router();

FlatRouter.post("/", AdminGuard, CreateFlat);
FlatRouter.get("/", AnyAuthGuard, GetFlats);
FlatRouter.get("/:id", AnyAuthGuard, GetFlatById);
FlatRouter.put("/:id", AdminGuard, UpdateFlat);
FlatRouter.delete("/:id", AdminGuard, DeleteFlat);

export default FlatRouter;