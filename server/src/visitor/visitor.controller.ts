import { Request, Response } from "express";
import VisitorModel from "./visitor.model";
import ResidentModel from "../resident/resident.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AuthenticatedRequest } from "../middleware/gaurd.middleware";

// Resident Action: Pre-approve Visitor
export const PreApproveVisitor = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const residentId = req.user?.id;
    const { name, phone, visitorType, purpose, vehicleNumber, vehicleType, entryTime } = req.body;

    if (!name || !phone) {
        throw new ApiError(400, "Visitor name and phone are required");
    }

    const resident: any = await ResidentModel.findById(residentId).populate('flat');
    if (!resident || !resident.flat) {
        throw new ApiError(400, "Resident or flat information not found");
    }

    const buildingId = resident.flat.building;
    const building: any = await (await import('../building/building.schema')).default.findById(buildingId);

    const visitor = await VisitorModel.create({
        name,
        phone,
        resident: residentId,
        flat: resident.flat._id,
        residence: building.residence,
        visitorType: visitorType || "guest",
        purpose,
        vehicleNumber,
        vehicleType,
        entryTime: entryTime || new Date(), // Expected entry time
        status: "approved",
        approvedBy: residentId,
    });

    return res.status(201).json(new ApiResponse(201, visitor, "Visitor pre-approved successfully"));
});

// Resident Action: Get My Visitors
export const GetMyVisitors = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const residentId = req.user?.id;
    const visitors = await VisitorModel.find({ resident: residentId })
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, visitors, "Visitors fetched successfully"));
});

// Security/Admin Action: Check-in Visitor
export const CheckInVisitor = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const staffId = req.user?.id;
    const { visitorId, idProofType, idProofNumber, photo, vehicleNumber } = req.body;

    if (!visitorId) {
        throw new ApiError(400, "Visitor ID is required");
    }

    const visitor = await VisitorModel.findById(visitorId);
    if (!visitor) throw new ApiError(404, "Visitor not found");

    if (visitor.status === "checked_in") {
        throw new ApiError(400, "Visitor is already checked in");
    }

    visitor.status = "checked_in";
    visitor.entryTime = new Date();
    visitor.checkedInBy = staffId as any;
    
    if (idProofType) visitor.idProofType = idProofType;
    if (idProofNumber) visitor.idProofNumber = idProofNumber;
    if (photo) visitor.photo = photo;
    if (vehicleNumber) visitor.vehicleNumber = vehicleNumber;

    await visitor.save();

    return res.status(200).json(new ApiResponse(200, visitor, "Visitor checked in successfully"));
});

// Security/Admin Action: Check-out Visitor
export const CheckOutVisitor = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const staffId = req.user?.id;
    const { id } = params(req); // Or get it from body depending on route structure

    const visitor = await VisitorModel.findById(req.params.id || req.body.visitorId);
    if (!visitor) throw new ApiError(404, "Visitor not found");

    if (visitor.status !== "checked_in") {
        throw new ApiError(400, "Visitor is not currently checked in");
    }

    visitor.status = "checked_out";
    visitor.exitTime = new Date();
    visitor.checkedOutBy = staffId as any;

    await visitor.save();

    return res.status(200).json(new ApiResponse(200, visitor, "Visitor checked out successfully"));
});

// Security/Admin Action: Get Active/All Visitors
export const GetAllVisitors = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { status, date } = req.query;
    
    let filter: any = {};
    if (status) filter.status = status;
    
    if (date) {
        const queryDate = new Date(date as string);
        filter.createdAt = {
            $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
            $lte: new Date(queryDate.setHours(23, 59, 59, 999))
        };
    }

    const visitors = await VisitorModel.find(filter)
        .populate("resident", "name phone flat")
        .populate("checkedInBy", "name")
        .populate("checkedOutBy", "name")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, visitors, "Visitors fetched successfully"));
});

// Helper for param extraction
function params(req: Request) {
    return req.params;
}
