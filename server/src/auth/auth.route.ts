import { Router } from "express";
import { unifiedLogin, unifiedVerifyOtp, getMe, unifiedLogout } from "./auth.controller";
import { AnyAuthGuard } from "../middleware/gaurd.middleware";

const AuthRouter = Router();

AuthRouter.post("/login", unifiedLogin);
AuthRouter.post("/verify-otp", unifiedVerifyOtp);
AuthRouter.get("/me", AnyAuthGuard, getMe);
AuthRouter.post("/logout", unifiedLogout);

export default AuthRouter;
