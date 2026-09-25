import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const SuperAdminSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        phone: {
            type: String,
            trim: true,
            default: null,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        otp: {
            type: String,
            default: null,
            select: false,
        },
        otpExpires: {
            type: Date,
            default: null,
            select: false,
        },
        avatar: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ["super_admin"],
            default: "super_admin",
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        lastLoginAt: {
            type: Date,
            default: null,
        },
        lastLoginIP: {
            type: String,
            default: null,
        },
        passwordChangedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

SuperAdminSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
});

SuperAdminSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const SuperAdminModel = model("SuperAdmin", SuperAdminSchema);

export default SuperAdminModel;