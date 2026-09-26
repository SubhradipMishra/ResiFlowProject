import React from 'react';
import { X, CheckCircle2, FileText, Image as ImageIcon, UserCheck, Calendar, ExternalLink } from 'lucide-react';

interface ResolutionProofModalProps {
    isOpen: boolean;
    onClose: () => void;
    complaint: any;
}

export const ResolutionProofModal: React.FC<ResolutionProofModalProps> = ({ isOpen, onClose, complaint }) => {
    if (!isOpen || !complaint) return null;

    const proof = complaint.resolutionProof || {};
    const resolvedAtFormatted = complaint.resolvedAt 
        ? new Date(complaint.resolvedAt).toLocaleString() 
        : 'Recently';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 overflow-y-auto animate-fadeIn">
            <div className="bg-white rounded-[28px] max-w-3xl w-full p-6 sm:p-8 border-2 border-slate-900 shadow-2xl relative">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-slate-900">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900">Work Resolution & Dual-Signed Proof</h3>
                            <p className="text-xs text-slate-500">Verified via Cloudinary multi-photo verification</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Complaint Summary Strip */}
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-900 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                        <span className="text-slate-500 font-bold block uppercase text-[10px]">Complaint Ticket</span>
                        <span className="font-extrabold text-slate-900">{complaint.title}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 font-bold block uppercase text-[10px]">Assigned Staff</span>
                        <span className="font-extrabold text-slate-900">{complaint.assignedTo?.name || 'Technician'}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 font-bold block uppercase text-[10px]">Resolved At</span>
                        <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {resolvedAtFormatted}
                        </span>
                    </div>
                </div>

                {/* 3 Proof Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* 1. Signed Physical Sheet */}
                    <div className="border-2 border-slate-900 rounded-2xl p-3 flex flex-col items-center bg-white space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-900">
                            <FileText className="w-4 h-4 text-rose-600" /> Signed Job Sheet
                        </div>
                        <div className="w-full h-44 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 flex items-center justify-center relative group">
                            {proof.signedFormUrl ? (
                                <img 
                                    src={proof.signedFormUrl} 
                                    alt="Signed Job Sheet" 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <span className="text-xs text-slate-400">No image uploaded</span>
                            )}
                            {proof.signedFormUrl && (
                                <a 
                                    href={proof.signedFormUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="absolute bottom-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-xs"
                                    title="Open Full Image"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-semibold text-center">
                            Dual physical signatures of Resident & Staff
                        </span>
                    </div>

                    {/* 2. Solved Work Photo */}
                    <div className="border-2 border-slate-900 rounded-2xl p-3 flex flex-col items-center bg-white space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-900">
                            <ImageIcon className="w-4 h-4 text-emerald-600" /> Solved Work Photo
                        </div>
                        <div className="w-full h-44 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 flex items-center justify-center relative group">
                            {proof.resolvedWorkUrl ? (
                                <img 
                                    src={proof.resolvedWorkUrl} 
                                    alt="Resolved Work" 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <span className="text-xs text-slate-400">No image uploaded</span>
                            )}
                            {proof.resolvedWorkUrl && (
                                <a 
                                    href={proof.resolvedWorkUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="absolute bottom-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-xs"
                                    title="Open Full Image"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-semibold text-center">
                            Repaired equipment & site condition
                        </span>
                    </div>

                    {/* 3. Staff on-site Selfie */}
                    <div className="border-2 border-slate-900 rounded-2xl p-3 flex flex-col items-center bg-white space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-900">
                            <UserCheck className="w-4 h-4 text-indigo-600" /> Staff on Site
                        </div>
                        <div className="w-full h-44 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 flex items-center justify-center relative group">
                            {proof.staffProofUrl ? (
                                <img 
                                    src={proof.staffProofUrl} 
                                    alt="Staff Verification" 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <span className="text-xs text-slate-400">No image uploaded</span>
                            )}
                            {proof.staffProofUrl && (
                                <a 
                                    href={proof.staffProofUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="absolute bottom-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-xs"
                                    title="Open Full Image"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-semibold text-center">
                            Identity & on-site presence proof
                        </span>
                    </div>
                </div>

                {/* Resolution Notes */}
                {complaint.resolutionNote && (
                    <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs space-y-1">
                        <span className="font-extrabold text-emerald-900 uppercase text-[10px]">Technician Resolution Notes:</span>
                        <p className="text-emerald-800 font-medium">{complaint.resolutionNote}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
