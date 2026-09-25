import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../utils/jwt.util";

export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}

const isDev = () => process.env.NODE_ENV !== "production";

const getAuthSecret = () => process.env.JWT_SECRET || process.env.AUTH_SECRET || "resiflow_super_secret_jwt_key_2026";
const getRtSecret = () => process.env.RT_SECRET || process.env.JWT_REFRESH_SECRET || "resiflow_super_secret_rt_key_2026";

export const expireSession = (res: Response, message: string = "Session expired or unauthorized") => {
    const opts = {
        maxAge: 0,
        httpOnly: true,
        secure: !isDev(),
        sameSite: isDev() ? ("lax" as const) : ("none" as const),
    };
    res.cookie("accessToken", "", opts);
    res.cookie("refreshToken", "", opts);

    return res.status(401).json({ success: false, message });
};

const extractAccessToken = (req: Request): string | null => {
    if (req.cookies && req.cookies.accessToken) {
        return req.cookies.accessToken;
    }
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.substring(7);
    }
    return null;
};

const extractRefreshToken = (req: Request): string | null => {
    if (req.cookies && req.cookies.refreshToken) {
        return req.cookies.refreshToken;
    }
    const rtHeader = req.headers["x-refresh-token"] as string;
    if (rtHeader) {
        return rtHeader;
    }
    return null;
};

// 1. Any Authenticated User Guard
export const AnyAuthGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = extractAccessToken(req);
        if (!token) return expireSession(res, "Authentication required. Please log in.");

        const payload = jwt.verify(token, getAuthSecret()) as TokenPayload;
        req.user = payload;
        next();
    } catch (error: any) {
        return expireSession(res, "Invalid or expired token. Please log in again.");
    }
};

// 2. SuperAdmin Only Guard
export const SuperAdminGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = extractAccessToken(req);
        if (!token) return expireSession(res, "SuperAdmin authentication required");

        const payload = jwt.verify(token, getAuthSecret()) as TokenPayload;
        if (payload.role !== "super_admin") {
            return res.status(403).json({ success: false, message: "Forbidden: SuperAdmin access only" });
        }

        req.user = payload;
        next();
    } catch (error: any) {
        return expireSession(res, "Invalid or expired session");
    }
};

// 3. Admin Only Guard
export const AdminGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = extractAccessToken(req);
        if (!token) return expireSession(res, "Admin authentication required");

        const payload = jwt.verify(token, getAuthSecret()) as TokenPayload;
        if (payload.role !== "admin") {
            return res.status(403).json({ success: false, message: "Forbidden: Admin access only" });
        }

        req.user = payload;
        next();
    } catch (error: any) {
        return expireSession(res, "Invalid or expired session");
    }
};

// 4. Resident Guard
export const ResidentGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = extractAccessToken(req);
        if (!token) return expireSession(res, "Resident authentication required");

        const payload = jwt.verify(token, getAuthSecret()) as TokenPayload;
        if (payload.role !== "resident") {
            return res.status(403).json({ success: false, message: "Forbidden: Resident access only" });
        }

        req.user = payload;
        next();
    } catch (error: any) {
        return expireSession(res, "Invalid or expired session");
    }
};

// 5. Staff Guard
export const StaffGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = extractAccessToken(req);
        if (!token) return expireSession(res, "Staff authentication required");

        const payload = jwt.verify(token, getAuthSecret()) as TokenPayload;
        if (payload.role !== "staff") {
            return res.status(403).json({ success: false, message: "Forbidden: Staff access only" });
        }

        req.user = payload;
        next();
    } catch (error: any) {
        return expireSession(res, "Invalid or expired session");
    }
};

// 6. SuperAdmin or Admin Guard
export const AdminSuperAdminGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = extractAccessToken(req);
        if (!token) return expireSession(res, "Authentication required");

        const payload = jwt.verify(token, getAuthSecret()) as TokenPayload;
        if (payload.role !== "super_admin" && payload.role !== "admin") {
            return res.status(403).json({ success: false, message: "Forbidden: Elevated privileges required" });
        }

        req.user = payload;
        next();
    } catch (error: any) {
        return expireSession(res, "Invalid or expired session");
    }
};

// 7. Admin or Resident Guard
export const AdminResidentGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = extractAccessToken(req);
        if (!token) return expireSession(res, "Authentication required");

        const payload = jwt.verify(token, getAuthSecret()) as TokenPayload;
        if (payload.role !== "admin" && payload.role !== "resident") {
            return res.status(403).json({ success: false, message: "Forbidden: Admin or Resident access required" });
        }

        req.user = payload;
        next();
    } catch (error: any) {
        return expireSession(res, "Invalid or expired session");
    }
};

// 8. Admin or Staff Guard (for complaints & visitors management)
export const AdminStaffGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = extractAccessToken(req);
        if (!token) return expireSession(res, "Authentication required");

        const payload = jwt.verify(token, getAuthSecret()) as TokenPayload;
        if (payload.role !== "admin" && payload.role !== "staff") {
            return res.status(403).json({ success: false, message: "Forbidden: Staff or Admin access required" });
        }

        req.user = payload;
        next();
    } catch (error: any) {
        return expireSession(res, "Invalid or expired session");
    }
};

// 9. Refresh Token Guard
export const RefreshTokenGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = extractRefreshToken(req);
        if (!token) return expireSession(res, "Refresh token required");

        const payload = jwt.verify(token, getRtSecret()) as TokenPayload;
        req.user = payload;
        next();
    } catch (error: any) {
        return expireSession(res, "Invalid or expired refresh token");
    }
};
