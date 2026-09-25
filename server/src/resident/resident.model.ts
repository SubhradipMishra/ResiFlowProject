import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";

const ResidentSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Resident name is required"],
            trim: true,
            maxlength: 100,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
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
            enum: ["resident"],
            default: "resident",
        },

        flat: {
            type: Schema.Types.ObjectId,
            ref: "Flat",
            required: [true, "Flat assignment is required"],
            index: true,
        },

        residentType: {
            type: String,
            enum: ["owner", "tenant", "family_member"],
            default: "family_member",
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
            default: null,
        },

        dateOfBirth: {
            type: Date,
            default: null,
        },

        emergencyContact: {
            name: {
                type: String,
                trim: true,
                default: null,
            },
            phone: {
                type: String,
                trim: true,
                default: null,
            },
            relation: {
                type: String,
                trim: true,
                default: null,
            },
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
    {
        timestamps: true,
    }
);

ResidentSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
});

ResidentSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const ResidentModel = model("Resident", ResidentSchema);

export default ResidentModel;