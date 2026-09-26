import { model, Schema, Document, Types } from "mongoose";

export interface IStaffSlot extends Document {
    staff: Types.ObjectId;
    residence: Types.ObjectId;
    complaint?: Types.ObjectId;
    date: string; // YYYY-MM-DD
    startTime: string; // "09:00"
    endTime: string; // "11:00"
    status: "available" | "booked" | "blocked" | "completed";
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const StaffSlotSchema = new Schema<IStaffSlot>(
    {
        staff: {
            type: Schema.Types.ObjectId,
            ref: "Staff",
            required: true,
            index: true,
        },
        residence: {
            type: Schema.Types.ObjectId,
            ref: "Residence",
            required: true,
            index: true,
        },
        complaint: {
            type: Schema.Types.ObjectId,
            ref: "Complaint",
            default: null,
            index: true,
        },
        date: {
            type: String,
            required: true,
            index: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["available", "booked", "blocked", "completed"],
            default: "booked",
            index: true,
        },
        notes: {
            type: String,
            trim: true,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

StaffSlotSchema.index(
    { staff: 1, date: 1, startTime: 1 },
    { unique: true }
);

const StaffSlotModel = model<IStaffSlot>("StaffSlot", StaffSlotSchema);

export default StaffSlotModel;
