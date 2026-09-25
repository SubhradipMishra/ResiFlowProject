import { Request, Response } from "express";
import AdminModel from "./admin.schema";
import ResidenceModel from "../residence/residence.model";
import BuildingModel from "../building/building.schema";
import FlatModel from "../flat/flat.model";
import ResidentModel from "../resident/resident.model";
import StaffModel from "../staff/staff.model";
import ComplaintModel from "../complaint/complaint.model";
import NoticeModel from "../notice/notice.model";
import VisitorModel from "../visitor/visitor.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { generateAccessToken, generateRefreshToken, setAuthCookies, clearAuthCookies } from "../utils/jwt.util";
import { AuthenticatedRequest } from "../middleware/gaurd.middleware";
import { sendOtpMail } from "../utils/mail.util";

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Admin Login (Step 1: Verify Password & Send OTP)
export const LoginAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const admin: any = await AdminModel.findOne({ email: email.toLowerCase() }).select("+password");
    if (!admin) {
        throw new ApiError(401, "Invalid email or password");
    }

    if (!admin.isActive) {
        throw new ApiError(403, "Your admin account is inactive. Please contact SuperAdmin.");
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate OTP
    const otp = generateOTP();
    admin.otp = otp;
    admin.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await admin.save();

    // Send OTP via email
    await sendOtpMail({ email: admin.email, name: admin.name, otp });

    return res.status(200).json(
        new ApiResponse(200, {
            requiresOtp: true,
            email: admin.email,
        }, "OTP sent to your email. Please verify to login.")
    );
});

// Admin Verify OTP (Step 2: Issue Tokens)
export const VerifyOtpAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const admin: any = await AdminModel.findOne({
        email: email.toLowerCase(),
        otp,
        otpExpires: { $gt: new Date() }
    });

    if (!admin) {
        throw new ApiError(401, "Invalid or expired OTP");
    }

    // Find assigned residence
    const residence = await ResidenceModel.findOne({ admin: admin._id, isActive: true });

    // Clear OTP
    admin.otp = null;
    admin.otpExpires = null;
    admin.lastLoginAt = new Date();
    admin.lastLoginIP = req.ip || req.socket.remoteAddress;
    await admin.save();

    const payload = {
        id: admin._id.toString(),
        email: admin.email,
        role: "admin" as const,
        name: admin.name,
        residenceId: residence ? residence._id.toString() : undefined,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json(
        new ApiResponse(200, {
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                role: admin.role,
                avatar: admin.avatar,
                residence: residence ? {
                    id: residence._id,
                    name: residence.name,
                    city: residence.city,
                    state: residence.state,
                } : null,
            },
            accessToken,
            refreshToken,
        }, "Admin logged in successfully")
    );
});

// Admin Logout
export const LogoutAdmin = asyncHandler(async (req: Request, res: Response) => {
    clearAuthCookies(res);
    return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

// Get Admin Profile
export const GetAdminProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const admin = await AdminModel.findById(req.user?.id);
    if (!admin) throw new ApiError(404, "Admin profile not found");

    const residence = await ResidenceModel.findOne({ admin: admin._id });

    return res.status(200).json(
        new ApiResponse(200, {
            ...admin.toObject(),
            residence,
        }, "Admin profile fetched")
    );
});

// Update Admin Profile
export const UpdateAdminProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { name, phone, avatar, oldPassword, newPassword } = req.body;
    const admin: any = await AdminModel.findById(req.user?.id).select("+password");
    if (!admin) throw new ApiError(404, "Admin not found");

    if (name) admin.name = name;
    if (phone) admin.phone = phone;
    if (avatar !== undefined) admin.avatar = avatar;

    if (newPassword) {
        if (!oldPassword) throw new ApiError(400, "Current password required to set new password");
        const isMatch = await admin.comparePassword(oldPassword);
        if (!isMatch) throw new ApiError(400, "Current password does not match");
        admin.password = newPassword;
        admin.passwordChangedAt = new Date();
    }

    await admin.save();

    return res.status(200).json(
        new ApiResponse(200, {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            avatar: admin.avatar,
        }, "Profile updated successfully")
    );
});

// Society Admin Dashboard Statistics
export const GetAdminDashboardStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.user?.id;
    const residence = await ResidenceModel.findOne({ admin: adminId });

    if (!residence) {
        return res.status(200).json(
            new ApiResponse(200, {
                hasResidence: false,
                message: "No residence created yet. Please create your residence first.",
            }, "Dashboard stats")
        );
    }

    const residenceId = residence._id;

    // Run parallel aggregation metrics
    const [
        totalBuildings,
        totalFlats,
        occupiedFlats,
        vacantFlats,
        totalResidents,
        totalStaff,
        activeNotices,
        openComplaints,
        todayVisitors,
    ] = await Promise.all([
        BuildingModel.countDocuments({ residence: residenceId, isActive: true }),
        FlatModel.countDocuments({ building: { $in: await BuildingModel.find({ residence: residenceId }).distinct("_id") }, isActive: true }),
        FlatModel.countDocuments({ building: { $in: await BuildingModel.find({ residence: residenceId }).distinct("_id") }, status: "occupied", isActive: true }),
        FlatModel.countDocuments({ building: { $in: await BuildingModel.find({ residence: residenceId }).distinct("_id") }, status: "vacant", isActive: true }),
        ResidentModel.countDocuments({ flat: { $in: await FlatModel.find({ building: { $in: await BuildingModel.find({ residence: residenceId }).distinct("_id") } }).distinct("_id") }, isActive: true }),
        StaffModel.countDocuments({ residence: residenceId, isActive: true }),
        NoticeModel.countDocuments({ residence: residenceId, isPublished: true }),
        ComplaintModel.countDocuments({ residence: residenceId, status: { $in: ["pending", "assigned", "in_progress"] } }),
        VisitorModel.countDocuments({
            residence: residenceId,
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lte: new Date(new Date().setHours(23, 59, 59, 999)),
            },
        }),
    ]);

    const stats = {
        hasResidence: true,
        residence: {
            id: residence._id,
            name: residence.name,
            city: residence.city,
            state: residence.state,
            addressLine: residence.addressLine,
            establishedYear: residence.establishedYear,
        },
        counts: {
            totalBuildings,
            totalFlats,
            occupiedFlats,
            vacantFlats,
            occupancyRate: totalFlats > 0 ? Math.round((occupiedFlats / totalFlats) * 100) : 0,
            totalResidents,
            totalStaff,
            activeNotices,
            openComplaints,
            todayVisitors,
        },
    };

    return res.status(200).json(new ApiResponse(200, stats, "Admin dashboard statistics fetched"));
});