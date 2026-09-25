import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

import AuthRouter from "./auth/auth.route";
import SuperAdminRouter from "./super-admin/super-admin.route";
import ResidenceRouter from "./residence/residence.route";
import AdminRouter from "./admin/admin.route";
import BuildingRouter from "./building/building.route";
import FlatRouter from "./flat/flat.route";
import ResidentRouter from "./resident/resident.route";
import StaffRouter from "./staff/staff.route";
import VehicleRouter from "./vehicle/vehicle.route";
import ComplaintRouter from "./complaint/complaint.route";
import VisitorRouter from "./visitor/visitor.route";
import NoticeRouter from "./notice/notice.route";
import { ApiError } from "./utils/api-error";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
console.log(process.env.DB_URL as string);
// Database
mongoose.connect(process.env.DB_URL as string)
    .then(() => console.log("DB Connected Sucessfully!"))
    .catch((err: any) => console.log(`DB failed to connect due to ${err.message}`));

// Routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/super-admin", SuperAdminRouter);
app.use("/api/v1/residence", ResidenceRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/building", BuildingRouter);
app.use("/api/v1/flat", FlatRouter);
app.use("/api/v1/resident", ResidentRouter);
app.use("/api/v1/staff", StaffRouter);
app.use("/api/v1/vehicle", VehicleRouter);
app.use("/api/v1/complaint", ComplaintRouter);
app.use("/api/v1/visitor", VisitorRouter);
app.use("/api/v1/notice", NoticeRouter);

// Global Error Handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }

    console.error("Unhandled Error:", err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
