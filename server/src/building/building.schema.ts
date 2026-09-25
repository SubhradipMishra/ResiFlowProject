import { model, Schema } from "mongoose";

export const BuildingSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Building name is required"],
            trim: true,
        },
        buildingNumber: {
            type: String,
            required: [true, "Building number / tower code is required"],
            trim: true,
        },
        residence: {
            type: Schema.Types.ObjectId,
            ref: "Residence",
            required: [true, "Residence association is required"],
            index: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: null,
        },
        totalFloors: {
            type: Number,
            required: [true, "Total floors count is required"],
            min: 1,
        },
        totalFlats: {
            type: Number,
            default: 0,
            min: 0,
        },
        yearBuilt: {
            type: Number,
            min: 1800,
            max: new Date().getFullYear(),
            default: null,
        },
        amenities: {
            type: [String],
            default: [],
        },
        image: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    { timestamps: true }
);

BuildingSchema.index({ residence: 1, buildingNumber: 1 }, { unique: true });

const BuildingModel = model("Building", BuildingSchema);

export default BuildingModel;