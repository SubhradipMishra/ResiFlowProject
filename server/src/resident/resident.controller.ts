import { Request, Response } from "express";
import ResidentModel from "./resident.model";
import FlatModel from "../flat/flat.model";
import BuildingModel from "../building/building.schema";
import ResidenceModel from "../residence/residence.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { generateAccessToken, generateRefreshToken, setAuthCookies, clearAuthCookies } from "../utils/jwt.util";
import { AuthenticatedRequest } from "../middleware/gaurd.middleware";
import { sendAccountCredentialsMail, sendOtpMail } from "../utils/mail.util";

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Create Resident (Admin Action)
export const CreateResident = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const {
        name,
        email,
        phone,
        password,
        flatId,
        residentType,
        gender,
        dateOfBirth,
        emergencyContact,
    } = req.body;

    if (!name || !email || !phone || !password || !flatId) {
        throw new ApiError(400, "Name, email, phone, password, and flat assignment are required");
    }

    const flat = await FlatModel.findById(flatId).populate("building");
    if (!flat) throw new ApiError(404, "Flat not found");

    const existingResident = await ResidentModel.findOne({ email: email.toLowerCase() });
    if (existingResident) {
        throw new ApiError(400, `Resident with email ${email} already exists`);
    }

    const newResident = await ResidentModel.create({
        name,
        email: email.toLowerCase(),
        phone,
        password,
        flat: flatId,
        residentType: residentType || "family_member",
        gender,
        dateOfBirth,
        emergencyContact,
        isActive: true,
    });

    // If owner or tenant, link to Flat and mark occupied
    if (residentType === "owner") {
        await FlatModel.findByIdAndUpdate(flatId, {
            owner: newResident._id,
            status: "occupied",
        });
    } else if (residentType === "tenant") {
        await FlatModel.findByIdAndUpdate(flatId, {
            tenant: newResident._id,
            status: "occupied",
        });
    } else {
        // Family member - ensure flat is occupied
        await FlatModel.findByIdAndUpdate(flatId, { status: "occupied" });
    }

    // Get building & residence name for email
    const building: any = await BuildingModel.findById(flat.building);
    let societyName = "ResiFlow Society";
    if (building?.residence) {
        const residence = await ResidenceModel.findByIdAndUpdate(building.residence, {
            $inc: { totalResidents: 1 },
        });
        if (residence) societyName = residence.name;
    }

    // Send credentials via Brevo
    await sendAccountCredentialsMail({
        email: newResident.email,
        name: newResident.name,
        role: "resident",
        password,
        societyName,
    });

    return res.status(201).json(
        new ApiResponse(201, {
            id: newResident._id,
            name: newResident.name,
            email: newResident.email,
            phone: newResident.phone,
            residentType: newResident.residentType,
            flat: flat.flatNumber,
        }, "Resident created successfully and credentials dispatched via email")
    );
});

// Resident Login (Step 1: Verify Password & Send OTP)
export const LoginResident = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const resident: any = await ResidentModel.findOne({ email: email.toLowerCase() }).select("+password");
    if (!resident) {
        throw new ApiError(401, "Invalid email or password");
    }

    if (!resident.isActive) {
        throw new ApiError(403, "Your resident account is inactive. Contact society administration.");
    }

    const isMatch = await resident.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate OTP
    const otp = generateOTP();
    resident.otp = otp;
    resident.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await resident.save();

    // Send OTP via email
    await sendOtpMail({ email: resident.email, name: resident.name, otp });

    return res.status(200).json(
        new ApiResponse(200, {
            requiresOtp: true,
            email: resident.email,
        }, "OTP sent to your email. Please verify to login.")
    );
});

// Resident Verify OTP (Step 2: Issue Tokens)
export const VerifyOtpResident = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const resident: any = await ResidentModel.findOne({ 
        email: email.toLowerCase(),
        otp,
        otpExpires: { $gt: new Date() }
    });

    if (!resident) {
        throw new ApiError(401, "Invalid or expired OTP");
    }

    // Clear OTP
    resident.otp = null;
    resident.otpExpires = null;
    resident.lastLoginAt = new Date();
    resident.lastLoginIP = req.ip || req.socket.remoteAddress;
    await resident.save();

    // Fetch flat and building for token context
    const flat: any = await FlatModel.findById(resident.flat).populate("building");
    const building: any = flat?.building;

    const payload = {
        id: resident._id.toString(),
        email: resident.email,
        role: "resident" as const,
        name: resident.name,
        flatId: resident.flat.toString(),
        residenceId: building?.residence?.toString(),
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json(
        new ApiResponse(200, {
            user: {
                id: resident._id,
                name: resident.name,
                email: resident.email,
                phone: resident.phone,
                role: resident.role,
                residentType: resident.residentType,
                avatar: resident.avatar,
                flat: {
                    id: flat?._id,
                    flatNumber: flat?.flatNumber,
                    floor: flat?.floor,
                    type: flat?.type,
                    buildingName: building?.name,
                    buildingNumber: building?.buildingNumber,
                },
            },
            accessToken,
            refreshToken,
        }, "Resident logged in successfully")
    );
});

// Resident Logout
export const LogoutResident = asyncHandler(async (req: Request, res: Response) => {
    clearAuthCookies(res);
    return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

// Get Current Resident Profile (Me)
export const GetResidentMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const resident: any = await ResidentModel.findById(req.user?.id)
        .populate({
            path: "flat",
            populate: {
                path: "building",
                populate: {
                    path: "residence",
                    select: "name addressLine city state amenities contact logo",
                },
            },
        });

    if (!resident) throw new ApiError(404, "Resident not found");

    let activeComplaints = 0;
    let unreadNotices = 0; // Keeping simple as just published notices count for now
    let todayVisitors = 0;

    if (resident.flat && resident.flat.building && resident.flat.building.residence) {
        const residenceId = resident.flat.building.residence._id;
        [activeComplaints, unreadNotices, todayVisitors] = await Promise.all([
            (await import("../complaint/complaint.model")).default.countDocuments({ resident: resident._id, status: { $ne: "resolved" } }),
            (await import("../notice/notice.model")).default.countDocuments({ residence: residenceId, isPublished: true }),
            (await import("../visitor/visitor.model")).default.countDocuments({ 
                resident: resident._id,
                createdAt: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    $lte: new Date(new Date().setHours(23, 59, 59, 999)),
                }
            })
        ]);
    }

    return res.status(200).json(new ApiResponse(200, {
        ...resident.toObject(),
        stats: {
            activeComplaints,
            unreadNotices,
            todayVisitors
        }
    }, "Profile fetched"));
});

// Update Resident Self Profile
export const UpdateResidentMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { name, phone, avatar, gender, emergencyContact, oldPassword, newPassword } = req.body;
    const resident: any = await ResidentModel.findById(req.user?.id).select("+password");
    if (!resident) throw new ApiError(404, "Resident not found");

    if (name) resident.name = name;
    if (phone) resident.phone = phone;
    if (avatar !== undefined) resident.avatar = avatar;
    if (gender) resident.gender = gender;
    if (emergencyContact) resident.emergencyContact = emergencyContact;

    if (newPassword) {
        if (!oldPassword) throw new ApiError(400, "Current password is required to change password");
        const isMatch = await resident.comparePassword(oldPassword);
        if (!isMatch) throw new ApiError(400, "Current password does not match");
        resident.password = newPassword;
        resident.passwordChangedAt = new Date();
    }

    await resident.save();

    return res.status(200).json(new ApiResponse(200, resident, "Profile updated successfully"));
});

// Get All Residents (Admin View)
export const GetAllResidents = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { buildingId, flatId, search, residentType } = req.query;
    const filter: any = { isActive: true };

    if (flatId) filter.flat = flatId;
    if (residentType) filter.residentType = residentType;
    if (search) {
        filter.$or = [
            { name: { $regex: search as string, $options: "i" } },
            { email: { $regex: search as string, $options: "i" } },
            { phone: { $regex: search as string, $options: "i" } },
        ];
    }

    let query = ResidentModel.find(filter)
        .populate({
            path: "flat",
            populate: { path: "building", select: "name buildingNumber" },
        })
        .sort({ createdAt: -1 });

    const residents = await query.exec();

    // If filtered by buildingId, filter in-memory or subquery
    let results = residents;
    if (buildingId) {
        results = residents.filter((r: any) => r.flat?.building?._id?.toString() === buildingId);
    }

    return res.status(200).json(new ApiResponse(200, results, "Residents fetched successfully"));
});

// Toggle Resident Status
export const ToggleResidentStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const resident = await ResidentModel.findById(id);
    if (!resident) throw new ApiError(404, "Resident not found");

    resident.isActive = !resident.isActive;
    await resident.save();

    return res.status(200).json(
        new ApiResponse(200, resident, `Resident account ${resident.isActive ? "activated" : "deactivated"} successfully`)
    );
});

// Update Resident By Admin
export const UpdateResidentByAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const resident = await ResidentModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!resident) throw new ApiError(404, "Resident not found");

    return res.status(200).json(new ApiResponse(200, resident, "Resident profile updated successfully"));
});

// Delete Resident By Admin (Soft delete)
export const DeleteResidentByAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const resident = await ResidentModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!resident) throw new ApiError(404, "Resident not found");

    return res.status(200).json(new ApiResponse(200, null, "Resident account deactivated successfully"));
});