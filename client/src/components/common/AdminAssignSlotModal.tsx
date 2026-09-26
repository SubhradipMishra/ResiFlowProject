import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, Calendar, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

interface AdminAssignSlotModalProps {
    isOpen: boolean;
    onClose: () => void;
    complaint: any;
    onSuccess: () => void;
}

export const AdminAssignSlotModal: React.FC<AdminAssignSlotModalProps> = ({ isOpen, onClose, complaint, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(
        complaint?.scheduledDate || new Date().toISOString().split('T')[0]
    );

    const [selectedStaffId, setSelectedStaffId] = useState<string>('');
    const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null);
    const [adminNote, setAdminNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchRecommendations = async (date: string) => {
        if (!complaint) return;
        setLoading(true);
        try {
            const complaintId = complaint._id || complaint.id;
            const res = await api.get(`/complaint/${complaintId}/recommendations?targetDate=${date}`);
            const recs = res.data?.data?.recommendations || [];
            setRecommendations(recs);

            // Auto-select best candidate and their suggested slot if available
            if (recs.length > 0) {
                const best = recs[0];
                setSelectedStaffId(best.staffId);
                if (best.suggestedSlot) {
                    setSelectedSlot(best.suggestedSlot);
                }
            }
        } catch (err) {
            console.error(err);
            toast.error('Could not load AI staff recommendations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && complaint) {
            const initialDate = complaint.scheduledDate || new Date().toISOString().split('T')[0];
            setSelectedDate(initialDate);
            fetchRecommendations(initialDate);
        }
    }, [isOpen, complaint]);

    if (!isOpen || !complaint) return null;

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        fetchRecommendations(newDate);
    };

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedStaffId || !selectedSlot) {
            toast.warning('Please select both a staff member and an available time slot.');
            return;
        }

        setIsSubmitting(true);
        try {
            const complaintId = complaint._id || complaint.id;
            const payload = {
                staffId: selectedStaffId,
                date: selectedDate,
                startTime: selectedSlot.startTime,
                endTime: selectedSlot.endTime,
                adminNote,
            };

            const res = await api.patch(`/complaint/${complaintId}/assign-slot`, payload);
            if (res.data?.success) {
                toast.success('Assigned staff & scheduled time slot successfully! Job Sheet created.');
                onSuccess();
                onClose();
            } else {
                toast.error(res.data?.message || 'Failed to assign slot.');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Conflict detected or assignment failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedStaffObj = recommendations.find((r) => r.staffId === selectedStaffId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 overflow-y-auto animate-fadeIn">
            <div className="bg-white rounded-[28px] max-w-3xl w-full p-6 sm:p-8 border-2 border-slate-900 shadow-2xl relative">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-900">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900">AI Staff Dispatch & Slot Allocation</h3>
                            <p className="text-xs text-slate-500">Gemini intelligence & real-time conflict-free slot scheduling</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleAssign} className="space-y-6">
                    
                    {/* Complaint Overview Strip */}
                    <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                            <span className="font-extrabold text-slate-900 text-sm block">{complaint.title}</span>
                            <span className="text-slate-500">{complaint.description?.slice(0, 80)}...</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-white border border-slate-300 font-extrabold rounded-full uppercase text-[10px]">
                                {complaint.category}
                            </span>
                            <span className="px-2.5 py-1 bg-rose-600 text-white font-extrabold rounded-full uppercase text-[10px]">
                                {complaint.priority} Priority
                            </span>
                        </div>
                    </div>

                    {/* Target Date Picker */}
                    <div className="flex items-center gap-3">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-slate-900" /> Dispatch Date:
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={handleDateChange}
                            className="bg-white border-2 border-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                        />
                    </div>

                    {/* AI Staff Recommendations Cards */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-slate-900" /> AI Ranked Staff & Availability
                            </label>
                            {loading && <span className="text-xs text-rose-600 font-bold flex items-center gap-1"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Scanning schedule...</span>}
                        </div>

                        {recommendations.length === 0 && !loading ? (
                            <div className="p-6 text-center text-xs text-slate-500 border-2 border-dashed border-slate-300 rounded-2xl">
                                No active staff found in society for this role.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                                {recommendations.map((staff) => {
                                    const isSelected = selectedStaffId === staff.staffId;
                                    const freeCount = staff.availableSlots?.filter((s: any) => s.isAvailable).length || 0;

                                    return (
                                        <div
                                            key={staff.staffId}
                                            onClick={() => {
                                                setSelectedStaffId(staff.staffId);
                                                if (staff.suggestedSlot) {
                                                    setSelectedSlot(staff.suggestedSlot);
                                                }
                                            }}
                                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                                                isSelected
                                                    ? 'border-slate-900 bg-rose-50/50 shadow-md ring-2 ring-slate-900'
                                                    : 'border-slate-200 bg-white hover:border-slate-900'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                                                        {staff.name?.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span className="font-extrabold text-xs text-slate-900 block">{staff.name}</span>
                                                        <span className="text-[11px] text-slate-500 capitalize font-medium">{staff.role} • {staff.department}</span>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-slate-900 text-white">
                                                    Score {staff.recommendationScore}
                                                </span>
                                            </div>

                                            <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                                                <span className="text-slate-600 font-semibold">
                                                    Tasks: <strong className="text-slate-900">{staff.activeTasksCount}</strong>
                                                </span>
                                                <span className={`font-extrabold ${freeCount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {freeCount > 0 ? `${freeCount} Free Slots` : 'No Free Slots'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Time Slot Picker for Selected Staff */}
                    {selectedStaffObj && (
                        <div className="space-y-2 pt-2 border-t-2 border-slate-100">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-slate-900" /> Select Time Slot for {selectedStaffObj.name} ({selectedDate})
                            </label>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {selectedStaffObj.availableSlots?.map((slot: any, idx: number) => {
                                    const isSlotSelected = selectedSlot?.startTime === slot.startTime && selectedSlot?.endTime === slot.endTime;
                                    const isAvailable = slot.isAvailable;

                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            disabled={!isAvailable}
                                            onClick={() => setSelectedSlot({ startTime: slot.startTime, endTime: slot.endTime })}
                                            className={`p-2.5 rounded-xl border-2 text-xs font-extrabold flex flex-col items-center justify-center transition-all ${
                                                isSlotSelected
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                                    : isAvailable
                                                    ? 'bg-white text-slate-800 border-slate-900 hover:bg-slate-100'
                                                    : 'bg-slate-100 text-slate-400 border-slate-300 opacity-60 cursor-not-allowed'
                                            }`}
                                        >
                                            <span>{slot.startTime} - {slot.endTime}</span>
                                            <span className="text-[9px] mt-0.5 font-bold uppercase">
                                                {isAvailable ? 'Free' : slot.reason || 'Booked'}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Admin Note */}
                    <div>
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                            Assignment Notes (Optional)
                        </label>
                        <input
                            type="text"
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Special instructions, resident preferred gate entry, etc."
                            className="w-full bg-white border-2 border-slate-900 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none"
                        />
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl border-2 border-slate-900 text-xs font-extrabold text-slate-700 hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedStaffId || !selectedSlot}
                            className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 border-2 border-slate-900 transition-colors shadow-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Scheduling...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" /> Confirm & Generate Job Sheet
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
