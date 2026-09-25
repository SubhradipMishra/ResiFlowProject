import { model, Schema } from "mongoose";

const NoticeSchema = new Schema(
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

        residence: {
            type: Schema.Types.ObjectId,
            ref: "Residence",
            required: true,
            index: true,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: [
                "general",
                "maintenance",
                "event",
                "emergency",
                "security",
                "parking",
                "meeting",
                "other",
            ],
            default: "general",
            index: true,
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },

        targetType: {
            type: String,
            enum: ["all", "building", "flat"],
            default: "all",
        },

        targetBuildings: [
            {
                type: Schema.Types.ObjectId,
                ref: "Building",
            },
        ],

        targetFlats: [
            {
                type: Schema.Types.ObjectId,
                ref: "Flat",
            },
        ],

        attachment: {
            type: String,
            default: null,
        },

        publishAt: {
            type: Date,
            default: Date.now,
        },

        expiresAt: {
            type: Date,
            default: null,
        },

        isPublished: {
            type: Boolean,
            default: true,
            index: true,
        },

        isPinned: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

NoticeSchema.index({
    residence: 1,
    isPublished: 1,
    publishAt: -1,
});

const NoticeModel = model("Notice", NoticeSchema);

export default NoticeModel;