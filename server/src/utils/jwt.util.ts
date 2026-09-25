import jwt from "jsonwebtoken";
import { Response } from "express";

export interface TokenPayload {
    id: string;
    email: string;
    role: "super_admin" | "admin" | "resident" | "staff";
    residenceId?: string;
    flatId?: string;
    department?: string;
    name?: string;
}

const getJwtSecret = (): string => process.env.JWT_SECRET || process.env.AUTH_SECRET || "resiflow_super_secret_jwt_key_2026";
const getRtSecret = (): string => process.env.RT_SECRET || process.env.JWT_REFRESH_SECRET || "resiflow_super_secret_rt_key_2026";

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: "1d",
    });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, getRtSecret(), {
        expiresIn: "7d",
    });
};

export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, getRtSecret()) as TokenPayload;
};

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    const isProd = process.env.NODE_ENV === "production";
    
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export const clearAuthCookies = (res: Response) => {
    const isProd = process.env.NODE_ENV === "production";
    const opts = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" as const : "lax" as const,
        maxAge: 0,
    };
    res.cookie("accessToken", "", opts);
    res.cookie("refreshToken", "", opts);
};
