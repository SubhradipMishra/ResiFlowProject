import { model, Schema } from "mongoose";

const FlatSchema = new Schema(
    {
        flatNumber: {
            type: String,
            required: true,
            trim: true,
        },

        building: {
            type: Schema.Types.ObjectId,
            ref: "Building",
            required: true,
            index: true,
        },

        floor: {
            type: Number,
            required: true,
            min: 0,
        },

        type: {
            type: String,
            enum: ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK", "Studio", "Other"],
            required: true,
        },

        area: {
            type: Number,
            required: true,
            min: 0,
        },

        facing: {
            type: String,
            enum: [
                "North",
                "South",
                "East",
                "West",
                "North-East",
                "North-West",
                "South-East",
                "South-West",
            ],
            default: null,
        },

        status: {
            type: String,
            enum: ["occupied", "vacant", "under_maintenance"],
            default: "vacant",
            index: true,
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: "Resident",
            default: null,
        },

        tenant: {
            type: Schema.Types.ObjectId,
            ref: "Resident",
            default: null,
        },

        monthlyMaintenance: {
            type: Number,
            default: 0,
            min: 0,
        },

        parkingSpaces: {
            type: Number,
            default: 0,
            min: 0,
        },

        amenities: {
            type: [String],
            default: [],
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

FlatSchema.index(
    { building: 1, flatNumber: 1 },
    { unique: true }
);

const FlatModel = model("Flat", FlatSchema);

export default FlatModel;