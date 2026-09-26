import { model, Schema } from "mongoose";

const ComplaintSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
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

        category: {
            type: String,
            set: (v: string) => v ? v.toLowerCase().trim() : v,
            enum: [
                "plumbing",
                "electrical",
                "cleaning",
                "security",
                "parking",
                "lift",
                "water",
                "noise",
                "maintenance",
                "other",
            ],
            required: true,
            index: true,
        },

        priority: {
            type: String,
            set: (v: string) => v ? v.toLowerCase().trim() : v,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
            index: true,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "assigned",
                "in_progress",
                "resolved",
                "rejected",
                "closed",
            ],
            default: "pending",
            index: true,
        },

        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "Staff",
            default: null,
            index: true,
        },

        assignedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            default: null,
        },

        attachments: {
            type: [String],
            default: [],
        },

        adminNote: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: null,
        },

        staffNote: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: null,
        },

        // AI Intelligence Fields
        aiAnalysis: {
            rawSummary: { type: String, default: null },
            suggestedCategory: { type: String, default: null },
            suggestedPriority: { type: String, default: null },
            requiredSkill: { type: String, default: null },
            suggestedDepartment: { type: String, default: null },
            reasoning: { type: String, default: null },
            estimatedDurationHours: { type: Number, default: 1 },
            analyzedAt: { type: Date, default: null },
        },

        // Staff Time Slot & Scheduling
        scheduledDate: {
            type: String,
            default: null,
            index: true,
        },

        scheduledSlot: {
            startTime: { type: String, default: null },
            endTime: { type: String, default: null },
        },

        slotId: {
            type: Schema.Types.ObjectId,
            ref: "StaffSlot",
            default: null,
        },

        // Printable Offline Job Sheet
        jobSheetNumber: {
            type: String,
            default: null,
            sparse: true,
            index: true,
        },

        jobSheetGeneratedAt: {
            type: Date,
            default: null,
        },

        // Cloudinary Resolution Multi-Photo Proofs
        resolutionProof: {
            signedFormUrl: { type: String, default: null },
            resolvedWorkUrl: { type: String, default: null },
            staffProofUrl: { type: String, default: null },
            uploadedAt: { type: Date, default: null },
            verifiedByResident: { type: Boolean, default: false },
            residentFeedback: { type: String, default: null },
        },

        resolutionNote: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: null,
        },

        resolvedAt: {
            type: Date,
            default: null,
        },

        closedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

ComplaintSchema.index({
    residence: 1,
    status: 1,
    createdAt: -1,
});

ComplaintSchema.index({
    resident: 1,
    createdAt: -1,
});

const ComplaintModel = model("Complaint", ComplaintSchema);

export default ComplaintModel;