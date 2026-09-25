
import { model, Schema } from "mongoose";

const ResidenceSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 150,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        addressLine: {
            type: String,
            required: true,
            trim: true,
            maxlength: 250,
        },

        city: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 100,
        },

        state: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 100,
        },

        pincode: {
            type: String,
            required: true,
            trim: true,
            match: [/^[0-9]{5,6}$/, "Invalid pincode"],
        },

        admin: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: false,
            default: null,
            index: true,
        },

        latitude: {
            type: Number,
            required: false,
            default: 0,
            min: -90,
            max: 90,
        },

        longitude: {
            type: Number,
            required: false,
            default: 0,
            min: -180,
            max: 180,
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },

        totalBuildings: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalFlats: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalResidents: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalArea: {
            type: Number,
            default: 0,
            min: 0,
        },

        establishedYear: {
            type: Number,
            min: 1800,
            max: new Date().getFullYear(),
        },

        specialFeatures: {
            type: [String],
            default: [],
        },

        amenities: {
            type: [String],
            default: [],
        },

        contact: {
            phone: {
                type: String,
                trim: true,
            },

            email: {
                type: String,
                trim: true,
                lowercase: true,
            },
        },

        logo: {
            type: String,
            default: null,
        },

        images: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// ResidenceSchema.index({ admin: 1, isActive: 1 });
// ResidenceSchema.index({ city: 1, state: 1 });

const ResidenceModel = model("Residence", ResidenceSchema);

export default ResidenceModel;
