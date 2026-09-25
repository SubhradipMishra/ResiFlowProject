import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";

const StaffSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            sparse: true,
            index: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        password: {
            type: String,
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
            enum: [
                "security",
                "cleaner",
                "electrician",
                "plumber",
                "gardener",
                "receptionist",
                "maintenance",
                "other",
            ],
            required: true,
        },

        residence: {
            type: Schema.Types.ObjectId,
            ref: "Residence",
            required: true,
            index: true,
        },

        department: {
            type: String,
            trim: true,
            default: null,
        },

        employeeId: {
            type: String,
            required: true,
            trim: true,
        },

        joiningDate: {
            type: Date,
            default: null,
        },

        salary: {
            type: Number,
            min: 0,
            default: null,
        },

        address: {
            type: String,
            trim: true,
            maxlength: 300,
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

        isVerified: {
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

        refreshToken: {
            type: String,
            select: false,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

StaffSchema.index(
    { residence: 1, employeeId: 1 },
    { unique: true }
);

StaffSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;

    this.password = await bcrypt.hash(this.password, 10);
});

StaffSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const StaffModel = model("Staff", StaffSchema);

export default StaffModel;