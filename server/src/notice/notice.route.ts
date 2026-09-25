import { Router } from "express";
import {
    CreateNotice,
    UpdateNotice,
    DeleteNotice,
    GetNoticeFeed,
} from "./notice.controller";
import { AdminGuard, AnyAuthGuard } from "../middleware/gaurd.middleware";

const NoticeRouter = Router();

// Feed is viewable by residents, admin, staff
NoticeRouter.get("/feed", AnyAuthGuard, GetNoticeFeed);

// Management routes
NoticeRouter.post("/", AdminGuard, CreateNotice);
NoticeRouter.put("/:id", AdminGuard, UpdateNotice);
NoticeRouter.delete("/:id", AdminGuard, DeleteNotice);

export default NoticeRouter;
