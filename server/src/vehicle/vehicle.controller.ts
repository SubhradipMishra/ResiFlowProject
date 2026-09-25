import { Request, Response } from "express";
import VehicleModel from "./vehicle.model";
import ResidentModel from "../resident/resident.model";
import FlatModel from "../flat/flat.model";
import BuildingModel from "../building/building.schema";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AuthenticatedRequest } from "../middleware/gaurd.middleware";

// Resident Action: Register Vehicle
export const RegisterVehicle = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const residentId = req.user?.id;
    const { vehicleType, make, model, color, registrationNumber, parkingSlot } = req.body;

    if (!vehicleType || !registrationNumber) {
        throw new ApiError(400, "Vehicle type and registration number are required");
    }

    const existing = await VehicleModel.findOne({ registrationNumber: registrationNumber.toUpperCase() });
    if (existing) {
        throw new ApiError(400, `Vehicle with registration number ${registrationNumber} is already registered`);
    }

    const vehicle = await VehicleModel.create({
        resident: residentId,
        vehicleType,
        make,
        model,
        color,
        registrationNumber: registrationNumber.toUpperCase(),
        parkingSlot,
    });

    return res.status(201).json(new ApiResponse(201, vehicle, "Vehicle registered successfully"));
});

// Resident Action: Get My Vehicles
export const GetMyVehicles = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const residentId = req.user?.id;
    const vehicles = await VehicleModel.find({ resident: residentId, isActive: true });
    
    return res.status(200).json(new ApiResponse(200, vehicles, "Vehicles fetched successfully"));
});

// Resident Action: Delete Vehicle
export const DeleteVehicle = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const residentId = req.user?.id;

    const vehicle = await VehicleModel.findOneAndUpdate(
        { _id: id, resident: residentId },
        { isActive: false },
        { new: true }
    );

    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found or you are not authorized to delete it");
    }

    return res.status(200).json(new ApiResponse(200, null, "Vehicle deleted successfully"));
});

// Admin/Security Action: Search Vehicle
export const SearchVehicle = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { registrationNumber } = req.query;
    
    if (!registrationNumber) {
        throw new ApiError(400, "Registration number is required for search");
    }

    const vehicle: any = await VehicleModel.findOne({ 
        registrationNumber: (registrationNumber as string).toUpperCase(),
        isActive: true 
    }).populate({
        path: "resident",
        select: "name phone flat",
        populate: {
            path: "flat",
            select: "flatNumber building",
            populate: {
                path: "building",
                select: "name buildingNumber"
            }
        }
    });

    if (!vehicle) {
        return res.status(200).json(new ApiResponse(200, null, "No vehicle found with this registration number"));
    }

    return res.status(200).json(new ApiResponse(200, vehicle, "Vehicle found"));
});

// Admin Action: Get All Vehicles in Residence
export const GetAllVehicles = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // In a real scenario, filter by residence through the resident -> flat -> building -> residence chain
    // For simplicity, we just fetch all or filter by resident ids of the residence
    
    const vehicles = await VehicleModel.find({ isActive: true })
        .populate({
            path: "resident",
            select: "name phone flat",
            populate: {
                path: "flat",
                select: "flatNumber building"
            }
        });

    return res.status(200).json(new ApiResponse(200, vehicles, "Vehicles fetched successfully"));
});
