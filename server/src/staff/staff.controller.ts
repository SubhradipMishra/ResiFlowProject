import { Request, Response } from "express";
import StaffModel from "./staff.model";
import ResidenceModel from "../residence/residence.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { generateAccessToken, generateRefreshToken, setAuthCookies, clearAuthCookies } from "../utils/jwt.util";
import { AuthenticatedRequest } from "../middleware/gaurd.middleware";
import { sendAccountCredentialsMail, sendOtpMail } from "../utils/mail.util";

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Admin Action: Create Staff
export const CreateStaff = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.user?.id;
    const { name, email, phone, role, department, employeeId, joiningDate, salary, address, emergencyContact, password } = req.body;

    if (!name || !phone || !role || !employeeId) {
        throw new ApiError(400, "Name, phone, role, and employeeId are required");
    }

    const residence = await ResidenceModel.findOne({ admin: adminId, isActive: true });
    if (!residence) {
        throw new ApiError(400, "No active residence found for your admin account");
    }

    const existingStaff = await StaffModel.findOne({ residence: residence._id, employeeId });
    if (existingStaff) {
        throw new ApiError(400, `Staff with Employee ID ${employeeId} already exists in this residence`);
    }

    const newStaff = await StaffModel.create({
        name,
        email: email ? email.toLowerCase() : undefined,
        phone,
        password, // Optional, only if they need login
        role,
        department,
        employeeId,
        residence: residence._id,
        joiningDate,
        salary,
        address,
        emergencyContact,
        isActive: true,
    });

    // If email and password provided, send credentials
    if (email && password) {
        await sendAccountCredentialsMail({
            email: newStaff.email as string,
            name: newStaff.name,
            role: `Staff (${role})`,
            password,
            societyName: residence.name,
        });
    }

    return res.status(201).json(new ApiResponse(201, newStaff, "Staff created successfully"));
});

// Admin Action: Get All Staff
export const GetAllStaff = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.user?.id;
    const { role, department, search } = req.query;

    const residence = await ResidenceModel.findOne({ admin: adminId });
    if (!residence) {
        return res.status(200).json(new ApiResponse(200, [], "No residence found"));
    }

    const filter: any = { residence: residence._id };
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (search) {
        filter.$or = [
            { name: { $regex: search as string, $options: "i" } },
            { employeeId: { $regex: search as string, $options: "i" } },
            { phone: { $regex: search as string, $options: "i" } },
        ];
    }

    const staff = await StaffModel.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, staff, "Staff fetched successfully"));
});

// Admin Action: Update Staff
export const UpdateStaff = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const adminId = req.user?.id;

    const residence = await ResidenceModel.findOne({ admin: adminId });
    if (!residence) throw new ApiError(404, "Residence not found");

    const staff = await StaffModel.findOneAndUpdate(
        { _id: id, residence: residence._id },
        req.body,
        { new: true }
    );

    if (!staff) throw new ApiError(404, "Staff not found or not in your residence");

    return res.status(200).json(new ApiResponse(200, staff, "Staff updated successfully"));
});

// Admin Action: Toggle Staff Status
export const ToggleStaffStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const adminId = req.user?.id;

    const residence = await ResidenceModel.findOne({ admin: adminId });
    if (!residence) throw new ApiError(404, "Residence not found");

    const staff = await StaffModel.findOne({ _id: id, residence: residence._id });
    if (!staff) throw new ApiError(404, "Staff not found");

    staff.isActive = !staff.isActive;
    await staff.save();

    return res.status(200).json(new ApiResponse(200, staff, `Staff ${staff.isActive ? "activated" : "deactivated"} successfully`));
});

// Staff Action: Login (Step 1: Verify Password & Send OTP)
export const LoginStaff = asyncHandler(async (req: Request, res: Response) => {
    const { email, phone, password } = req.body;
    
    if ((!email && !phone) || !password) {
        throw new ApiError(400, "Email/Phone and password are required");
    }

    const filter = email ? { email: email.toLowerCase() } : { phone };

    const staff: any = await StaffModel.findOne(filter).select("+password");
    if (!staff) throw new ApiError(401, "Invalid credentials");

    if (!staff.isActive) throw new ApiError(403, "Account inactive");

    const bcrypt = require("bcrypt");
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    // Generate OTP
    const otp = generateOTP();
    staff.otp = otp;
    staff.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await staff.save();

    // Send OTP via email (if email is available, otherwise this logic might need SMS later)
    if (staff.email) {
        await sendOtpMail({ email: staff.email, name: staff.name, otp });
    } else {
        // Fallback or log if only phone is used
        console.log(`[Mock SMS] OTP for ${staff.phone} is ${otp}`);
    }

    return res.status(200).json(
        new ApiResponse(200, {
            requiresOtp: true,
            email: staff.email,
            phone: staff.phone,
        }, "OTP sent. Please verify to login.")
    );
});

// Staff Action: Verify OTP (Step 2: Issue Tokens)
export const VerifyOtpStaff = asyncHandler(async (req: Request, res: Response) => {
    const { email, phone, otp } = req.body;
    
    if ((!email && !phone) || !otp) {
        throw new ApiError(400, "Email/Phone and OTP are required");
    }

    const filter: any = email ? { email: email.toLowerCase() } : { phone };
    filter.otp = otp;
    filter.otpExpires = { $gt: new Date() };

    const staff: any = await StaffModel.findOne(filter);

    if (!staff) {
        throw new ApiError(401, "Invalid or expired OTP");
    }

    // Clear OTP
    staff.otp = null;
    staff.otpExpires = null;
    staff.lastLoginAt = new Date();
    staff.lastLoginIP = req.ip || req.socket.remoteAddress;
    await staff.save();

    const payload = {
        id: staff._id.toString(),
        email: staff.email || staff.phone,
        role: "staff" as const,
        name: staff.name,
        residenceId: staff.residence.toString(),
        department: staff.department,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json(
        new ApiResponse(200, {
            user: {
                id: staff._id,
                name: staff.name,
                role: staff.role,
                department: staff.department,
            },
            accessToken,
            refreshToken,
        }, "Staff logged in successfully")
    );
});

// Staff Action: Logout
export const LogoutStaff = asyncHandler(async (req: Request, res: Response) => {
    clearAuthCookies(res);
    return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

// Staff Dashboard Stats
export const GetStaffDashboard = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const staffId = req.user?.id;
    const staff: any = await StaffModel.findById(staffId).populate("residence", "name city");
    if (!staff) throw new ApiError(404, "Staff not found");

    const residenceId = staff.residence._id;

    const [
        assignedComplaints,
        resolvedComplaints,
        todayVisitors,
        activeNotices
    ] = await Promise.all([
        (await import("../complaint/complaint.model")).default.countDocuments({ assignedTo: staffId, status: { $in: ["assigned", "in_progress"] } }),
        (await import("../complaint/complaint.model")).default.countDocuments({ assignedTo: staffId, status: "resolved" }),
        (await import("../visitor/visitor.model")).default.countDocuments({
            residence: residenceId,
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lte: new Date(new Date().setHours(23, 59, 59, 999)),
            },
        }),
        (await import("../notice/notice.model")).default.countDocuments({ residence: residenceId, isPublished: true }),
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            staff: {
                name: staff.name,
                role: staff.role,
                department: staff.department,
            },
            residence: staff.residence,
            stats: {
                assignedComplaints,
                resolvedComplaints,
                todayVisitors,
                activeNotices
            }
        }, "Staff dashboard fetched")
    );
});
