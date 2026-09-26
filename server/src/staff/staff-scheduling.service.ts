import StaffModel from "./staff.model";
import StaffSlotModel from "./staff-slot.model";
import ComplaintModel from "../complaint/complaint.model";
import { Types } from "mongoose";

export interface TimeSlotOption {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    reason?: string;
}

export interface StaffRecommendation {
    staffId: string;
    name: string;
    phone: string;
    role: string;
    department: string;
    avatar: string | null;
    availabilityStatus: string;
    activeTasksCount: number;
    isWorkingDay: boolean;
    availableSlots: TimeSlotOption[];
    suggestedSlot: { startTime: string; endTime: string } | null;
    recommendationScore: number; // Higher is better
    recommendationReason: string;
}

// Generate standard time slots from start hour to end hour
export const generateSlotsForStaff = (
    startHourStr: string = "09:00",
    endHourStr: string = "18:00",
    durationMinutes: number = 120
): { startTime: string; endTime: string }[] => {
    const slots: { startTime: string; endTime: string }[] = [];

    const parseMinutes = (timeStr: string) => {
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m;
    };

    const formatMinutes = (totalMin: number) => {
        const h = Math.floor(totalMin / 60).toString().padStart(2, "0");
        const m = (totalMin % 60).toString().padStart(2, "0");
        return `${h}:${m}`;
    };

    const startMin = parseMinutes(startHourStr);
    const endMin = parseMinutes(endHourStr);

    let current = startMin;
    while (current + durationMinutes <= endMin) {
        const next = current + durationMinutes;
        slots.push({
            startTime: formatMinutes(current),
            endTime: formatMinutes(next),
        });
        current = next;
    }

    return slots;
};

// Get available staff recommendations for a complaint & date
export const getAIStaffRecommendations = async (params: {
    residenceId: string | Types.ObjectId;
    requiredSkill?: string;
    category?: string;
    targetDate?: string; // YYYY-MM-DD
}): Promise<StaffRecommendation[]> => {
    const { residenceId, requiredSkill, category, targetDate } = params;

    // Use current date if not specified
    const dateStr = targetDate || new Date().toISOString().split("T")[0];
    const targetDayName = new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

    // Map AI category to staff roles
    const categoryToRoleMap: Record<string, string> = {
        plumbing: "plumber",
        electrical: "electrician",
        cleaning: "cleaner",
        security: "security",
        water: "plumber",
        lift: "maintenance",
        maintenance: "maintenance",
        parking: "security",
        noise: "security",
        other: "maintenance",
    };

    const targetRole = (requiredSkill || (category ? categoryToRoleMap[category.toLowerCase()] : null) || "maintenance").toLowerCase();

    // 1. Fetch all staff for this residence
    const allStaff = await StaffModel.find({
        residence: residenceId,
        isActive: true,
    });

    if (!allStaff.length) {
        return [];
    }

    // 2. Fetch all booked slots on target date
    const bookedSlots = await StaffSlotModel.find({
        residence: residenceId,
        date: dateStr,
        status: { $in: ["booked", "blocked"] },
    });

    const recommendations: StaffRecommendation[] = [];

    for (const staff of allStaff) {
        const roleMatches = staff.role?.toLowerCase() === targetRole;
        const isWorkingDay = staff.workingDays ? (staff.workingDays as any).includes(targetDayName) : true;
        const isAvailableStatus = staff.availabilityStatus === "available" || staff.availabilityStatus === "busy";

        // Generate day slots
        const rawSlots = generateSlotsForStaff(
            staff.workingHours?.start || "09:00",
            staff.workingHours?.end || "18:00",
            staff.slotDurationMinutes || 120
        );

        // Filter out booked slots for this staff
        const staffBookings = bookedSlots.filter(
            (b) => b.staff.toString() === staff._id.toString()
        );

        const slotOptions: TimeSlotOption[] = rawSlots.map((slot) => {
            const isBooked = staffBookings.some(
                (b) => b.startTime === slot.startTime && b.endTime === slot.endTime
            );

            if (!isWorkingDay) {
                return { ...slot, isAvailable: false, reason: `Off duty on ${targetDayName}` };
            }
            if (staff.availabilityStatus === "on_leave") {
                return { ...slot, isAvailable: false, reason: "Staff is currently on leave" };
            }
            if (staff.availabilityStatus === "off_duty") {
                return { ...slot, isAvailable: false, reason: "Staff is off duty" };
            }
            if (isBooked) {
                return { ...slot, isAvailable: false, reason: "Slot already booked" };
            }

            return { ...slot, isAvailable: true };
        });

        const availableSlots = slotOptions.filter((s) => s.isAvailable);
        const suggestedSlot = availableSlots.length > 0 ? { startTime: availableSlots[0].startTime, endTime: availableSlots[0].endTime } : null;

        // Calculate Recommendation Score
        let score = 50;
        let reasons: string[] = [];

        if (roleMatches) {
            score += 40;
            reasons.push(`Direct skill match (${staff.role})`);
        } else {
            score += 10;
            reasons.push(`Cross-department backup (${staff.role})`);
        }

        if (isWorkingDay && isAvailableStatus) {
            score += 20;
        } else {
            score -= 30;
            reasons.push("Not on scheduled shift");
        }

        // Penalty for high active tasks
        const workload = staff.activeTasksCount || 0;
        score -= workload * 10;
        reasons.push(`Current workload: ${workload} active task(s)`);

        if (availableSlots.length > 0) {
            score += 15;
            reasons.push(`${availableSlots.length} available slot(s) today`);
        } else {
            score -= 25;
            reasons.push("No free slots on this date");
        }

        recommendations.push({
            staffId: staff._id.toString(),
            name: staff.name,
            phone: staff.phone,
            role: staff.role,
            department: staff.department || "Facility Operations",
            avatar: staff.avatar || null,
            availabilityStatus: staff.availabilityStatus,
            activeTasksCount: workload,
            isWorkingDay,
            availableSlots: slotOptions,
            suggestedSlot,
            recommendationScore: Math.max(0, score),
            recommendationReason: reasons.join(" • "),
        });
    }

    // Sort by recommendation score descending
    recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);

    return recommendations;
};

// Check for conflicting bookings
export const checkSlotConflict = async (
    staffId: string | Types.ObjectId,
    date: string,
    startTime: string,
    endTime: string,
    excludeComplaintId?: string | Types.ObjectId
): Promise<boolean> => {
    const filter: any = {
        staff: staffId,
        date,
        startTime,
        endTime,
        status: { $in: ["booked", "blocked"] },
    };

    if (excludeComplaintId) {
        filter.complaint = { $ne: excludeComplaintId };
    }

    const existing = await StaffSlotModel.findOne(filter);
    return !!existing;
};
