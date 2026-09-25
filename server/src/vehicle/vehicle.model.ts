import { model, Schema } from "mongoose";

const VehicleSchema = new Schema(
    {
        resident: {
            type: Schema.Types.ObjectId,
            ref: "Resident",
            required: true,
            index: true,
        },

        vehicleType: {
            type: String,
            enum: ["car", "bike", "scooter", "bicycle", "other"],
            required: true,
        },

        make: {
            type: String,
            trim: true,
            default: null,
        },

        model: {
            type: String,
            trim: true,
            default: null,
        },

        color: {
            type: String,
            trim: true,
            default: null,
        },

        registrationNumber: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
            unique: true,
            index: true,
        },

        parkingSlot: {
            type: String,
            trim: true,
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

const VehicleModel = model("Vehicle", VehicleSchema);

export default VehicleModel;