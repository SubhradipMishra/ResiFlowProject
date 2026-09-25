import { Response } from "express";
import ResidenceModel from "./residence.model";
import AdminModel from "../admin/admin.schema";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AuthenticatedRequest } from "../middleware/gaurd.middleware";

// Create Residence (Admin only)
export const CreateResidence = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throw new ApiError(401, "Admin authentication required");

    const existingResidence = await ResidenceModel.findOne({ admin: adminId, isActive: true });
    if (existingResidence) {
        throw new ApiError(400, "You have already created a residence society. You can manage and update it.");
    }

    const {
        name,
        description,
        addressLine,
        city,
        state,
        pincode,
        latitude,
        longitude,
        establishedYear,
        specialFeatures,
        amenities,
        contact,
        logo,
        images,
    } = req.body;

    if (!name || !addressLine || !city || !state || !pincode) {
        throw new ApiError(400, "Name, address, city, state, and pincode are required");
    }

    const newResidence = await ResidenceModel.create({
        name,
        description,
        addressLine,
        city,
        state,
        pincode,
        latitude: latitude || 0,
        longitude: longitude || 0,
        establishedYear,
        specialFeatures: specialFeatures || [],
        amenities: amenities || [],
        contact: contact || {},
        logo,
        images: images || [],
        admin: adminId,
    });

    // Link residence to Admin document
    await AdminModel.findByIdAndUpdate(adminId, { residence: newResidence._id });

    return res.status(201).json(
        new ApiResponse(201, newResidence, "Residence society created successfully")
    );
});

// Get My Residence (Admin's assigned residence)
export const GetMyResidence = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.user?.id;
    const residence = await ResidenceModel.findOne({ admin: adminId });
    if (!residence) {
        return res.status(200).json(new ApiResponse(200, null, "No residence found for this admin"));
    }

    return res.status(200).json(new ApiResponse(200, residence, "Residence details fetched"));
});

// Update Residence
export const UpdateResidence = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const adminId = req.user?.id;

    const residence = await ResidenceModel.findOne({ _id: id, admin: adminId });
    if (!residence) {
        throw new ApiError(404, "Residence not found or you are not authorized to edit this residence");
    }

    const updatedResidence = await ResidenceModel.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(200).json(
        new ApiResponse(200, updatedResidence, "Residence updated successfully")
    );
});

// Get Residence Info by ID (Guarded for Residents, Staff, Admin)
export const GetResidenceById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const residence = await ResidenceModel.findById(id).populate("admin", "name email phone");
    if (!residence) throw new ApiError(404, "Residence not found");

    return res.status(200).json(new ApiResponse(200, residence, "Residence details fetched"));
});