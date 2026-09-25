import { Request, Response } from "express";
import SuperAdminModel from "./super-admin.schema";
import AdminModel from "../admin/admin.schema";
import ResidenceModel from "../residence/residence.model";
import BuildingModel from "../building/building.schema";
import FlatModel from "../flat/flat.model";
import ResidentModel from "../resident/resident.model";
import StaffModel from "../staff/staff.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { generateAccessToken, generateRefreshToken, setAuthCookies, clearAuthCookies } from "../utils/jwt.util";
import { AuthenticatedRequest } from "../middleware/gaurd.middleware";
import { sendAccountCredentialsMail, sendOtpMail } from "../utils/mail.util";

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Seed / Setup Initial SuperAdmin (only if none exists)
export const SeedSuperAdmin = asyncHandler(async (req: Request, res: Response) => {
    const existing = await SuperAdminModel.findOne();
    if (existing) {
        throw new ApiError(400, "SuperAdmin already exists in system. Please log in.");
    }

    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email, and password are required");
    }

    const superAdmin = await SuperAdminModel.create({
        name,
        email,
        password,
        phone,
        isEmailVerified: true,
    });

    const accessToken = generateAccessToken({
        id: superAdmin._id.toString(),
        email: superAdmin.email,
        role: "super_admin",
        name: superAdmin.name,
    });
    const refreshToken = generateRefreshToken({
        id: superAdmin._id.toString(),
        email: superAdmin.email,
        role: "super_admin",
        name: superAdmin.name,
    });

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json(
        new ApiResponse(201, {
            user: {
                id: superAdmin._id,
                name: superAdmin.name,
                email: superAdmin.email,
                role: superAdmin.role,
            },
            accessToken,
            refreshToken,
        }, "Initial SuperAdmin initialized successfully")
    );
});

// SuperAdmin Login (Step 1: Verify Password & Send OTP)
export const LoginSuperAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const superAdmin: any = await SuperAdminModel.findOne({ email: email.toLowerCase() }).select("+password");
    if (!superAdmin) {
        throw new ApiError(401, "Invalid email or password");
    }

    if (!superAdmin.isActive) {
        throw new ApiError(403, "Your SuperAdmin account is disabled. Contact system support.");
    }

    const isMatch = await superAdmin.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate OTP
    const otp = generateOTP();
    superAdmin.otp = otp;
    superAdmin.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await superAdmin.save();

    // Send OTP via email
    await sendOtpMail({ email: superAdmin.email, name: superAdmin.name, otp });

    return res.status(200).json(
        new ApiResponse(200, {
            requiresOtp: true,
            email: superAdmin.email,
        }, "OTP sent to your email. Please verify to login.")
    );
});

// SuperAdmin Verify OTP (Step 2: Issue Tokens)
export const VerifyOtpSuperAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const superAdmin: any = await SuperAdminModel.findOne({
        email: email.toLowerCase(),
        otp,
        otpExpires: { $gt: new Date() }
    });

    if (!superAdmin) {
        throw new ApiError(401, "Invalid or expired OTP");
    }

    // Clear OTP
    superAdmin.otp = null;
    superAdmin.otpExpires = null;
    superAdmin.lastLoginAt = new Date();
    superAdmin.lastLoginIP = req.ip || req.socket.remoteAddress;
    await superAdmin.save();

    const payload = {
        id: superAdmin._id.toString(),
        email: superAdmin.email,
        role: "super_admin" as const,
        name: superAdmin.name,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json(
        new ApiResponse(200, {
            user: {
                id: superAdmin._id,
                name: superAdmin.name,
                email: superAdmin.email,
                role: superAdmin.role,
                avatar: superAdmin.avatar,
            },
            accessToken,
            refreshToken,
        }, "SuperAdmin logged in successfully")
    );
});

// Logout SuperAdmin
export const LogoutSuperAdmin = asyncHandler(async (req: Request, res: Response) => {
    clearAuthCookies(res);
    return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

// Get Current SuperAdmin Profile
export const GetSuperAdminProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const superAdmin = await SuperAdminModel.findById(req.user?.id);
    if (!superAdmin) throw new ApiError(404, "SuperAdmin not found");

    return res.status(200).json(new ApiResponse(200, superAdmin, "Profile fetched"));
});

// Platform Statistics Overview
export const GetPlatformStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const [
        totalResidences,
        totalAdmins,
        totalBuildings,
        totalFlats,
        totalResidents,
        totalStaff,
    ] = await Promise.all([
        ResidenceModel.countDocuments({ isActive: true }),
        AdminModel.countDocuments({ isActive: true }),
        BuildingModel.countDocuments({ isActive: true }),
        FlatModel.countDocuments({ isActive: true }),
        ResidentModel.countDocuments({ isActive: true }),
        StaffModel.countDocuments({ isActive: true }),
    ]);

    const stats = {
        totalResidences,
        totalAdmins,
        totalBuildings,
        totalFlats,
        totalResidents,
        totalStaff,
    };

    return res.status(200).json(new ApiResponse(200, stats, "Platform statistics fetched"));
});

// SuperAdmin: Create Residence Instance
export const CreateResidenceBySuperAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { name, description, addressLine, city, state, pincode, contactPhone, contactEmail, establishedYear } = req.body;
    if (!name || !addressLine || !city || !state || !pincode) {
        throw new ApiError(400, "Residence name, address, city, state, and pincode are required");
    }

    const newResidence = await ResidenceModel.create({
        name: name.toLowerCase().trim(),
        description,
        addressLine,
        city: city.toLowerCase().trim(),
        state: state.toLowerCase().trim(),
        pincode,
        establishedYear: establishedYear ? Number(establishedYear) : undefined,
        contact: {
            phone: contactPhone,
            email: contactEmail,
        },
        admin: null,
    });

    return res.status(201).json(
        new ApiResponse(201, newResidence, "Residence instance created successfully")
    );
});

// SuperAdmin: Get All Residences
export const GetAllResidencesForSuperAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const residences = await ResidenceModel.find().populate("admin", "name email phone role").sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, residences, "Residences fetched successfully"));
});

// SuperAdmin: Create Admin Account & Assign Residence
export const CreateAdminBySuperAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { name, email, password, phone, residenceId } = req.body;
    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email, and temporary password are required");
    }

    const exist = await AdminModel.findOne({ email: email.toLowerCase() });
    if (exist) {
        throw new ApiError(400, "An admin with this email already exists");
    }

    let assignedResidence: any = null;
    if (residenceId) {
        assignedResidence = await ResidenceModel.findById(residenceId);
        if (!assignedResidence) {
            throw new ApiError(404, "Selected residence not found");
        }
    }

    const newAdmin = await AdminModel.create({
        name,
        email: email.toLowerCase(),
        password,
        phone,
        residence: residenceId || null,
        createdBy: req.user?.id,
        isActive: true,
    });

    // If residenceId provided, link bidirectional residence.admin = newAdmin._id
    if (assignedResidence) {
        assignedResidence.admin = newAdmin._id;
        await assignedResidence.save();
    }

    // Send credentials & activation notice via Brevo
    await sendAccountCredentialsMail({
        email: newAdmin.email,
        name: newAdmin.name,
        role: "admin",
        password,
        societyName: assignedResidence ? assignedResidence.name : undefined,
    });

    return res.status(201).json(
        new ApiResponse(201, {
            id: newAdmin._id,
            name: newAdmin.name,
            email: newAdmin.email,
            phone: newAdmin.phone,
            role: newAdmin.role,
            residence: assignedResidence,
            isActive: newAdmin.isActive,
        }, "Admin account created, assigned to residence, and activation email sent.")
    );
});

// SuperAdmin: Assign / Reassign Residence to Admin
export const AssignResidenceToAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { adminId, residenceId } = req.body;
    if (!adminId || !residenceId) {
        throw new ApiError(400, "Admin ID and Residence ID are required");
    }

    const admin = await AdminModel.findById(adminId);
    if (!admin) throw new ApiError(404, "Admin not found");

    const residence = await ResidenceModel.findById(residenceId);
    if (!residence) throw new ApiError(404, "Residence not found");

    admin.residence = residence._id;
    await admin.save();

    residence.admin = admin._id;
    await residence.save();

    await sendAccountCredentialsMail({
        email: admin.email,
        name: admin.name,
        role: "admin",
        societyName: residence.name,
    });

    return res.status(200).json(
        new ApiResponse(200, { admin, residence }, "Residence successfully assigned to Admin.")
    );
});

// SuperAdmin: Get All Admins (Populate Residence)
export const GetAllAdmins = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const admins = await AdminModel.find().populate("residence", "name city state pincode").sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, admins, "Admins fetched successfully"));
});

// SuperAdmin: Toggle Admin Active Status
export const ToggleAdminStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const admin = await AdminModel.findById(id);
    if (!admin) throw new ApiError(404, "Admin not found");

    admin.isActive = !admin.isActive;
    await admin.save();

    return res.status(200).json(
        new ApiResponse(200, admin, `Admin account ${admin.isActive ? "activated" : "deactivated"} successfully`)
    );
});