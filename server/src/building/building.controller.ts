import { Response } from "express";
import BuildingModel from "./building.schema";
import ResidenceModel from "../residence/residence.model";
import FlatModel from "../flat/flat.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AuthenticatedRequest } from "../middleware/gaurd.middleware";

// Create Building (Tower / Block)
export const CreateBuilding = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.user?.id;
    const { name, buildingNumber, residenceId, description, totalFloors, yearBuilt, amenities, image } = req.body;

    if (!name || !buildingNumber || !totalFloors) {
        throw new ApiError(400, "Building name, building number, and total floors are required");
    }

    // Determine residence
    let targetResidenceId = residenceId;
    if (!targetResidenceId) {
        const residence = await ResidenceModel.findOne({ admin: adminId, isActive: true });
        if (!residence) {
            throw new ApiError(400, "No active residence found for your admin account. Please create a residence first.");
        }
        targetResidenceId = residence._id;
    }

    const existingBuilding = await BuildingModel.findOne({
        residence: targetResidenceId,
        buildingNumber: buildingNumber.trim(),
    });

    if (existingBuilding) {
        throw new ApiError(400, `Building with number/code '${buildingNumber}' already exists in this residence`);
    }

    const building = await BuildingModel.create({
        name,
        buildingNumber: buildingNumber.trim(),
        residence: targetResidenceId,
        description,
        totalFloors,
        yearBuilt,
        amenities: amenities || [],
        image,
    });

    // Update Residence totalBuildings count
    await ResidenceModel.findByIdAndUpdate(targetResidenceId, {
        $inc: { totalBuildings: 1 },
    });

    return res.status(201).json(new ApiResponse(201, building, "Building created successfully"));
});

// Get All Buildings for Residence
export const GetBuildings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.user?.id;
    let residenceId = req.query.residenceId as string;

    if (!residenceId && req.user?.role === "admin") {
        const residence = await ResidenceModel.findOne({ admin: adminId });
        if (residence) residenceId = residence._id.toString();
    }

    const filter: any = { isActive: true };
    if (residenceId) {
        filter.residence = residenceId;
    }

    const buildings = await BuildingModel.find(filter).sort({ buildingNumber: 1 });

    // Populate actual live flat count for each building
    const buildingsWithCounts = await Promise.all(
        buildings.map(async (b) => {
            const flatCount = await FlatModel.countDocuments({ building: b._id, isActive: true });
            const occupiedCount = await FlatModel.countDocuments({ building: b._id, status: "occupied", isActive: true });
            return {
                ...b.toObject(),
                actualFlatCount: flatCount,
                occupiedFlatCount: occupiedCount,
            };
        })
    );

    return res.status(200).json(new ApiResponse(200, buildingsWithCounts, "Buildings fetched successfully"));
});

// Get Building By ID
export const GetBuildingById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const building = await BuildingModel.findById(id).populate("residence", "name city state addressLine");
    if (!building) throw new ApiError(404, "Building not found");

    const flats = await FlatModel.find({ building: building._id, isActive: true }).sort({ floor: 1, flatNumber: 1 });

    return res.status(200).json(
        new ApiResponse(200, {
            building,
            flats,
        }, "Building details fetched")
    );
});

// Update Building
export const UpdateBuilding = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const building = await BuildingModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!building) throw new ApiError(404, "Building not found");

    return res.status(200).json(new ApiResponse(200, building, "Building updated successfully"));
});

// Delete Building (Soft Delete)
export const DeleteBuilding = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const occupiedFlats = await FlatModel.countDocuments({ building: id, status: "occupied", isActive: true });
    if (occupiedFlats > 0) {
        throw new ApiError(400, `Cannot delete building with ${occupiedFlats} occupied flats. Reassign residents first.`);
    }

    const building = await BuildingModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!building) throw new ApiError(404, "Building not found");

    if (building.residence) {
        await ResidenceModel.findByIdAndUpdate(building.residence, {
            $inc: { totalBuildings: -1 },
        });
    }

    return res.status(200).json(new ApiResponse(200, null, "Building deactivated successfully"));
});