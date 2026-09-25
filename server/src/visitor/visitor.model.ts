import { model, Schema } from "mongoose";

const VisitorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: null,
        },

        resident: {
            type: Schema.Types.ObjectId,
            ref: "Resident",
            required: true,
            index: true,
        },

        flat: {
            type: Schema.Types.ObjectId,
            ref: "Flat",
            required: true,
            index: true,
        },

        residence: {
            type: Schema.Types.ObjectId,
            ref: "Residence",
            required: true,
            index: true,
        },

        visitorType: {
            type: String,
            enum: [
                "guest",
                "delivery",
                "cab",
                "service",
                "vendor",
                "other",
            ],
            default: "guest",
            index: true,
        },

        purpose: {
            type: String,
            trim: true,
            maxlength: 300,
            default: null,
        },

        vehicleNumber: {
            type: String,
            trim: true,
            uppercase: true,
            default: null,
        },

        vehicleType: {
            type: String,
            enum: ["car", "bike", "scooter", "auto", "other"],
            default: null,
        },

        entryTime: {
            type: Date,
            default: null,
        },

        exitTime: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
                "checked_in",
                "checked_out",
                "cancelled",
            ],
            default: "pending",
            index: true,
        },

        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: "Resident",
            default: null,
        },

        checkedInBy: {
            type: Schema.Types.ObjectId,
            ref: "Staff",
            default: null,
        },

        checkedOutBy: {
            type: Schema.Types.ObjectId,
            ref: "Staff",
            default: null,
        },

        idProofType: {
            type: String,
            enum: ["aadhaar", "driving_license", "passport", "voter_id", "other"],
            default: null,
        },

        idProofNumber: {
            type: String,
            trim: true,
            default: null,
        },

        photo: {
            type: String,
            default: null,
        },

        notes: {
            type: String,
            trim: true,
            maxlength: 500,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

VisitorSchema.index({
    residence: 1,
    status: 1,
    createdAt: -1,
});

VisitorSchema.index({
    resident: 1,
    createdAt: -1,
});

const VisitorModel = model("Visitor", VisitorSchema);

export default VisitorModel;