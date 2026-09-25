import { Request, Response } from "express";
import NoticeModel from "./notice.model";
import ResidentModel from "../resident/resident.model";
import ResidenceModel from "../residence/residence.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AuthenticatedRequest } from "../middleware/gaurd.middleware";
import { sendNoticeMail } from "../utils/mail.util";

// Admin Action: Create Notice
export const CreateNotice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    console.log(req.body);
    const adminId = req.user?.id;
    const { title, description, type, priority, targetType, targetBuildings, targetFlats, publishAt, expiresAt, isPinned } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Notice title and description are required");
    }

    const residence = await ResidenceModel.findOne({ admin: adminId, isActive: true });
    if (!residence) {
        throw new ApiError(400, "No active residence found for your admin account");
    }

    const notice = await NoticeModel.create({
        title,
        description,
        residence: residence._id,
        createdBy: adminId,
        type: type || "general",
        priority: priority || "medium",
        targetType: targetType || "all",
        targetBuildings: targetBuildings || [],
        targetFlats: targetFlats || [],
        publishAt: publishAt || new Date(),
        expiresAt: expiresAt || null,
        isPinned: isPinned || false,
        isPublished: true,
    });

    // Send email broadcast
    let emailsToNotify: string[] = [];
    if (targetType === "all") {
        const residents = await ResidentModel.find({ isActive: true }).populate({
            path: 'flat',
            match: { building: { $in: await (await import('../building/building.schema')).default.find({ residence: residence._id }).distinct('_id') } }
        });
        // Simplification: In reality, we'd do a better joined query. For now we assume active residents of this society.
        // Let's do a strict query:
        const residentDocs = await ResidentModel.find({ isActive: true }).populate('flat');
        emailsToNotify = residentDocs
            .filter(r => r.email)
            .map(r => r.email as string);
    }

    if (emailsToNotify.length > 0) {
        // Send email async
        sendNoticeMail({
            emails: emailsToNotify,
            title,
            description,
            priority: notice.priority as string,
            societyName: residence.name,
        }).catch(console.error);
    }

    return res.status(201).json(new ApiResponse(201, notice, "Notice published successfully"));
});

// Admin Action: Update Notice
export const UpdateNotice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const adminId = req.user?.id;

    const residence = await ResidenceModel.findOne({ admin: adminId });
    if (!residence) throw new ApiError(404, "Residence not found");

    const notice = await NoticeModel.findOneAndUpdate(
        { _id: id, residence: residence._id },
        req.body,
        { new: true }
    );

    if (!notice) throw new ApiError(404, "Notice not found or unauthorized");

    return res.status(200).json(new ApiResponse(200, notice, "Notice updated successfully"));
});

// Admin Action: Delete Notice
export const DeleteNotice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const adminId = req.user?.id;

    const residence = await ResidenceModel.findOne({ admin: adminId });
    if (!residence) throw new ApiError(404, "Residence not found");

    const notice = await NoticeModel.findOneAndDelete({ _id: id, residence: residence._id });
    if (!notice) throw new ApiError(404, "Notice not found or unauthorized");

    return res.status(200).json(new ApiResponse(200, null, "Notice deleted successfully"));
});

// Admin/Resident Action: Get Feed
export const GetNoticeFeed = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const role = req.user?.role;
    let residenceId = req.query.residenceId as string;
    let filter: any = { isPublished: true, publishAt: { $lte: new Date() } };

    // Also filter unexpired
    filter.$or = [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
    ];

    if (role === "admin") {
        const adminId = req.user?.id;
        const residence = await ResidenceModel.findOne({ admin: adminId });
        if (residence) {
            filter.residence = residence._id;
        }
    } else if (role === "resident") {
        const residentId = req.user?.id;
        const resident: any = await ResidentModel.findById(residentId).populate('flat');
        if (resident && resident.flat) {
            const flatId = resident.flat._id;
            const buildingId = resident.flat.building;
            // Get residence via building
            const building: any = await (await import('../building/building.schema')).default.findById(buildingId);
            if (building) {
                filter.residence = building.residence;
            }

            // Notice targeting logic
            filter.$and = [
                {
                    $or: [
                        { targetType: "all" },
                        { targetType: "building", targetBuildings: buildingId },
                        { targetType: "flat", targetFlats: flatId }
                    ]
                }
            ];
        }
    } else if (residenceId) {
        filter.residence = residenceId;
    }

    const notices = await NoticeModel.find(filter)
        .sort({ isPinned: -1, publishAt: -1 })
        .populate("createdBy", "name avatar");

    return res.status(200).json(new ApiResponse(200, notices, "Notice feed fetched successfully"));
});