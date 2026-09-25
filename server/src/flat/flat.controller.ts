import { Response } from "express";
import FlatModel from "./flat.model";
import BuildingModel from "../building/building.schema";
import ResidenceModel from "../residence/residence.model";
import ResidentModel from "../resident/resident.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AuthenticatedRequest } from "../middleware/gaurd.middleware";

// Create Flat
export const CreateFlat = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const {
        flatNumber,
        buildingId,
        floor,
        type,
        area,
        facing,
        status,
        monthlyMaintenance,
        parkingSpaces,
        amenities,
        description,
    } = req.body;

    if (!flatNumber || !buildingId || floor === undefined || !type || !area) {
        throw new ApiError(400, "Flat number, building, floor, type, and area are required");
    }

    const building = await BuildingModel.findById(buildingId);
    if (!building) throw new ApiError(404, "Building not found");

    // Check unique flatNumber in building
    const existing = await FlatModel.findOne({ building: buildingId, flatNumber: flatNumber.trim() });
    if (existing) {
        throw new ApiError(400, `Flat '${flatNumber}' already exists in building '${building.name}'`);
    }

    const flat = await FlatModel.create({
        flatNumber: flatNumber.trim(),
        building: buildingId,
        floor: Number(floor),
        type,
        area: Number(area),
        facing,
        status: status || "vacant",
        monthlyMaintenance: monthlyMaintenance ? Number(monthlyMaintenance) : 0,
        parkingSpaces: parkingSpaces ? Number(parkingSpaces) : 0,
        amenities: amenities || [],
        description,
    });

    // Increment Building totalFlats
    await BuildingModel.findByIdAndUpdate(buildingId, { $inc: { totalFlats: 1 } });
    if (building.residence) {
        await ResidenceModel.findByIdAndUpdate(building.residence, { $inc: { totalFlats: 1 } });
    }

    return res.status(201).json(new ApiResponse(201, flat, "Flat created successfully"));
});

// Get Flats (with extensive filters)
export const GetFlats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { buildingId, floor, type, status, search } = req.query;
    const filter: any = { isActive: true };

    if (buildingId) filter.building = buildingId;
    if (floor !== undefined) filter.floor = Number(floor);
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (search) {
        filter.flatNumber = { $regex: search as string, $options: "i" };
    }

    const flats = await FlatModel.find(filter)
        .populate("building", "name buildingNumber residence")
        .populate("owner", "name email phone avatar")
        .populate("tenant", "name email phone avatar")
        .sort({ floor: 1, flatNumber: 1 });

    return res.status(200).json(new ApiResponse(200, flats, "Flats fetched successfully"));
});

// Get Flat By ID
export const GetFlatById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const flat = await FlatModel.findById(id)
        .populate("building", "name buildingNumber residence")
        .populate("owner", "name email phone avatar residentType")
        .populate("tenant", "name email phone avatar residentType");

    if (!flat) throw new ApiError(404, "Flat not found");

    // Fetch all residents living in this flat
    const residents = await ResidentModel.find({ flat: flat._id, isActive: true });

    return res.status(200).json(
        new ApiResponse(200, {
            flat,
            residents,
        }, "Flat details fetched")
    );
});

// Update Flat
export const UpdateFlat = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const flat = await FlatModel.findByIdAndUpdate(id, req.body, { new: true })
        .populate("building", "name buildingNumber")
        .populate("owner", "name email phone")
        .populate("tenant", "name email phone");

    if (!flat) throw new ApiError(404, "Flat not found");

    return res.status(200).json(new ApiResponse(200, flat, "Flat updated successfully"));
});

// Delete Flat (Soft delete)
export const DeleteFlat = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const activeResidents = await ResidentModel.countDocuments({ flat: id, isActive: true });
    if (activeResidents > 0) {
        throw new ApiError(400, `Cannot delete flat with ${activeResidents} active residents. Reassign or remove residents first.`);
    }

    const flat = await FlatModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!flat) throw new ApiError(404, "Flat not found");

    await BuildingModel.findByIdAndUpdate(flat.building, { $inc: { totalFlats: -1 } });
    const building = await BuildingModel.findById(flat.building);
    if (building?.residence) {
        await ResidenceModel.findByIdAndUpdate(building.residence, { $inc: { totalFlats: -1 } });
    }

    return res.status(200).json(new ApiResponse(200, null, "Flat deactivated successfully"));
});