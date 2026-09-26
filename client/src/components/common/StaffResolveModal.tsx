import React, { useState } from 'react';
import { X, CheckCircle2, FileText, Image as ImageIcon, UserCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

interface StaffResolveModalProps {
    isOpen: boolean;
    onClose: () => void;
    complaint: any;
    onSuccess: () => void;
}

export const StaffResolveModal: React.FC<StaffResolveModalProps> = ({ isOpen, onClose, complaint, onSuccess }) => {
    const [signedFormFile, setSignedFormFile] = useState<File | null>(null);
    const [resolvedWorkFile, setResolvedWorkFile] = useState<File | null>(null);
    const [staffProofFile, setStaffProofFile] = useState<File | null>(null);

    const [signedFormPreview, setSignedFormPreview] = useState<string | null>(null);
    const [resolvedWorkPreview, setResolvedWorkPreview] = useState<string | null>(null);
    const [staffProofPreview, setStaffProofPreview] = useState<string | null>(null);

    const [resolutionNote, setResolutionNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !complaint) return null;

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'signedForm' | 'resolvedWork' | 'staffProof'
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        if (type === 'signedForm') {
            setSignedFormFile(file);
            setSignedFormPreview(previewUrl);
        } else if (type === 'resolvedWork') {
            setResolvedWorkFile(file);
            setResolvedWorkPreview(previewUrl);
        } else if (type === 'staffProof') {
            setStaffProofFile(file);
            setStaffProofPreview(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!signedFormFile || !resolvedWorkFile || !staffProofFile) {
            toast.warning('All 3 photo proofs are mandatory: Signed Job Sheet, Work Photo, and Staff Selfie.');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('signedForm', signedFormFile);
            formData.append('resolvedWork', resolvedWorkFile);
            formData.append('staffProof', staffProofFile);
            formData.append('resolutionNote', resolutionNote || 'Work completed and physically verified.');

            const complaintId = complaint._id || complaint.id;
            const res = await api.post(`/complaint/${complaintId}/resolve-proof`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data?.success) {
                toast.success('Complaint resolved and 3 Cloudinary proofs verified successfully!');
                onSuccess();
                onClose();
            } else {
                toast.error(res.data?.message || 'Failed to submit resolution.');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error uploading proofs to Cloudinary.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 overflow-y-auto animate-fadeIn">
            <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 sm:p-8 border-2 border-slate-900 shadow-2xl relative">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-900">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900">Complete & Verify Ticket Resolution</h3>
                        <p className="text-xs text-slate-500">Upload all 3 required proofs for mandatory physical verification</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Ticket Context Info */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-300 flex items-center justify-between text-xs">
                        <div>
                            <span className="font-extrabold text-slate-900 block">{complaint.title}</span>
                            <span className="text-slate-500 text-[11px]">Ticket #{((complaint._id || complaint.id) as string).slice(-6).toUpperCase()} • {complaint.category}</span>
                        </div>
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-700 font-extrabold rounded-full text-[10px] uppercase">
                            Required 3 Proofs
                        </span>
                    </div>

                    {/* 3 Mandatory Proof Upload Slots */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        
                        {/* 1. Signed Form */}
                        <div className="border-2 border-dashed border-slate-400 hover:border-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center text-center relative bg-slate-50 transition-colors">
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleFileChange(e, 'signedForm')}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {signedFormPreview ? (
                                <div className="space-y-1">
                                    <img src={signedFormPreview} alt="Preview" className="w-full h-24 object-cover rounded-lg border border-slate-300" />
                                    <span className="text-[10px] font-extrabold text-emerald-600 flex items-center justify-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Form Attached
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-1.5 py-2">
                                    <FileText className="w-7 h-7 text-rose-600 mx-auto" />
                                    <span className="text-xs font-black block text-slate-900 leading-tight">1. Signed Sheet *</span>
                                    <span className="text-[10px] text-slate-500 block leading-tight">Both Signatures</span>
                                </div>
                            )}
                        </div>

                        {/* 2. Solved Work Photo */}
                        <div className="border-2 border-dashed border-slate-400 hover:border-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center text-center relative bg-slate-50 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'resolvedWork')}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {resolvedWorkPreview ? (
                                <div className="space-y-1">
                                    <img src={resolvedWorkPreview} alt="Preview" className="w-full h-24 object-cover rounded-lg border border-slate-300" />
                                    <span className="text-[10px] font-extrabold text-emerald-600 flex items-center justify-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Work Photo Attached
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-1.5 py-2">
                                    <ImageIcon className="w-7 h-7 text-emerald-600 mx-auto" />
                                    <span className="text-xs font-black block text-slate-900 leading-tight">2. Solved Work *</span>
                                    <span className="text-[10px] text-slate-500 block leading-tight">Repaired area photo</span>
                                </div>
                            )}
                        </div>

                        {/* 3. Staff on site Selfie */}
                        <div className="border-2 border-dashed border-slate-400 hover:border-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center text-center relative bg-slate-50 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'staffProof')}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {staffProofPreview ? (
                                <div className="space-y-1">
                                    <img src={staffProofPreview} alt="Preview" className="w-full h-24 object-cover rounded-lg border border-slate-300" />
                                    <span className="text-[10px] font-extrabold text-emerald-600 flex items-center justify-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Staff Selfie Attached
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-1.5 py-2">
                                    <UserCheck className="w-7 h-7 text-indigo-600 mx-auto" />
                                    <span className="text-xs font-black block text-slate-900 leading-tight">3. Staff on Site *</span>
                                    <span className="text-[10px] text-slate-500 block leading-tight">Technician photo</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resolution Note */}
                    <div>
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                            Resolution Notes & Work Details
                        </label>
                        <textarea
                            rows={3}
                            value={resolutionNote}
                            onChange={(e) => setResolutionNote(e.target.value)}
                            placeholder="Describe how the problem was solved, parts replaced, and test results..."
                            className="w-full bg-white border-2 border-slate-900 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    {/* Submit Button */}
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
                            disabled={isSubmitting || !signedFormFile || !resolvedWorkFile || !staffProofFile}
                            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 border-2 border-slate-900 transition-colors shadow-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Cloudinary...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" /> Verify & Mark Resolved
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
