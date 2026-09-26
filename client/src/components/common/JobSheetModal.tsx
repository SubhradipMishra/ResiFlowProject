import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Wrench, ShieldCheck, Building2, User } from 'lucide-react';

interface JobSheetModalProps {
    isOpen: boolean;
    onClose: () => void;
    complaint: any;
}

export const JobSheetModal: React.FC<JobSheetModalProps> = ({ isOpen, onClose, complaint }) => {
    if (!isOpen || !complaint) return null;

    const handlePrint = () => {
        window.print();
    };

    const jobSheetNum = complaint.jobSheetNumber || `JS-${(complaint._id || complaint.id || '').slice(-6).toUpperCase()}`;
    const dateFormatted = complaint.scheduledDate || new Date().toISOString().split('T')[0];
    const slotTime = complaint.scheduledSlot 
        ? `${complaint.scheduledSlot.startTime} - ${complaint.scheduledSlot.endTime}` 
        : '09:00 - 11:00';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 overflow-y-auto print:p-0 print:bg-white animate-fadeIn">
            <div className="bg-white rounded-[28px] max-w-3xl w-full p-6 sm:p-8 border-2 border-slate-900 shadow-2xl relative print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none">
                
                {/* Modal Header Actions (Hidden in Print) */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-900 print:hidden">
                    <div className="flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-rose-600" />
                        <span className="font-extrabold text-slate-900 text-lg">Official Maintenance Work Order</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 border-2 border-slate-900 transition-colors shadow-sm"
                        >
                            <Printer className="w-4 h-4" /> Print Job Sheet
                        </button>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-xl border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Printable Document Area */}
                <div className="print-sheet space-y-6 text-slate-900 font-sans border border-slate-300 p-6 rounded-2xl print:border-2 print:border-black print:rounded-none">
                    
                    {/* Header with Branding & QR */}
                    <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-slate-900" />
                                <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                                    {complaint.residence?.name || 'SmartResidence Society'}
                                </h1>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">
                                Facility & Property Maintenance Management Order
                            </p>
                            <div className="mt-2 inline-block px-3 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded">
                                Work Order #{jobSheetNum}
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <QRCodeSVG 
                                value={`TICKET:${complaint._id || complaint.id}|ORDER:${jobSheetNum}|SLOT:${slotTime}`} 
                                size={70} 
                                level="M"
                            />
                            <span className="text-[10px] font-mono text-slate-500 mt-1 font-bold">SCAN TO VERIFY</span>
                        </div>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-300 text-xs">
                        <div>
                            <span className="text-slate-500 font-bold block uppercase text-[10px]">Service Date</span>
                            <span className="font-extrabold text-slate-900">{dateFormatted}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 font-bold block uppercase text-[10px]">Allocated Slot</span>
                            <span className="font-extrabold text-rose-600">{slotTime}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 font-bold block uppercase text-[10px]">Category</span>
                            <span className="font-extrabold uppercase text-slate-900">{complaint.category || 'Maintenance'}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 font-bold block uppercase text-[10px]">Priority Level</span>
                            <span className="font-extrabold uppercase text-rose-600">{complaint.priority || 'Medium'}</span>
                        </div>
                    </div>

                    {/* Resident & Location Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border border-slate-300 p-3.5 rounded-xl space-y-1.5">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b pb-1">
                                <User className="w-3.5 h-3.5 text-slate-900" /> Resident / Flat Details
                            </h3>
                            <div className="text-xs space-y-0.5">
                                <p><span className="text-slate-500 font-bold">Resident:</span> <span className="font-extrabold">{complaint.resident?.name || 'Resident'}</span></p>
                                <p><span className="text-slate-500 font-bold">Flat No:</span> <span className="font-extrabold">{complaint.flat?.flatNumber || 'Flat Unit'}</span> {complaint.flat?.floor ? `(Floor ${complaint.flat.floor})` : ''}</p>
                                <p><span className="text-slate-500 font-bold">Phone:</span> <span className="font-bold">{complaint.resident?.phone || 'On Record'}</span></p>
                            </div>
                        </div>

                        <div className="border border-slate-300 p-3.5 rounded-xl space-y-1.5">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b pb-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-slate-900" /> Assigned Technician
                            </h3>
                            <div className="text-xs space-y-0.5">
                                <p><span className="text-slate-500 font-bold">Staff Name:</span> <span className="font-extrabold">{complaint.assignedTo?.name || 'Assigned Technician'}</span></p>
                                <p><span className="text-slate-500 font-bold">Role / Dept:</span> <span className="font-bold uppercase">{complaint.assignedTo?.role || complaint.category} ({complaint.assignedTo?.department || 'Operations'})</span></p>
                                <p><span className="text-slate-500 font-bold">Contact:</span> <span className="font-bold">{complaint.assignedTo?.phone || 'N/A'}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Complaint Description & AI Diagnosis */}
                    <div className="border border-slate-300 p-4 rounded-xl space-y-2">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Problem Description & AI Classification</h3>
                        <p className="text-xs font-bold text-slate-900">{complaint.title}</p>
                        <p className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200">{complaint.description}</p>
                        {complaint.aiAnalysis?.reasoning && (
                            <p className="text-[11px] text-slate-500 italic">
                                <span className="font-bold text-slate-700">AI Assessment:</span> {complaint.aiAnalysis.reasoning}
                            </p>
                        )}
                    </div>

                    {/* Technician Work Log Table */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Service Completion & Materials Log (Offline Entry)</h3>
                        <table className="w-full text-xs border border-slate-300">
                            <thead>
                                <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-bold">
                                    <th className="p-1.5 text-left border-r border-slate-300">Step / Task Performed</th>
                                    <th className="p-1.5 text-left border-r border-slate-300">Parts / Spares Used</th>
                                    <th className="p-1.5 text-center w-24">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-200 h-8">
                                    <td className="p-1.5 border-r border-slate-200">1. Inspection & Root Cause Diagnosis</td>
                                    <td className="p-1.5 border-r border-slate-200"></td>
                                    <td className="p-1.5 text-center font-bold text-[10px]">COMPLETED [  ]</td>
                                </tr>
                                <tr className="border-b border-slate-200 h-8">
                                    <td className="p-1.5 border-r border-slate-200">2. Repair / Replacement Executed</td>
                                    <td className="p-1.5 border-r border-slate-200"></td>
                                    <td className="p-1.5 text-center font-bold text-[10px]">COMPLETED [  ]</td>
                                </tr>
                                <tr className="h-8">
                                    <td className="p-1.5 border-r border-slate-200">3. Functional Testing & Resident Verification</td>
                                    <td className="p-1.5 border-r border-slate-200"></td>
                                    <td className="p-1.5 text-center font-bold text-[10px]">SATISFIED [  ]</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Dual Physical Signatures Block */}
                    <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-slate-900">
                        {/* Resident Signature */}
                        <div className="border border-slate-400 p-3 rounded-xl bg-slate-50 space-y-8 text-center">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 block border-b pb-1">
                                Resident Acknowledgment & Signature
                            </span>
                            <div className="border-b-2 border-dashed border-slate-400 h-8"></div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-600">
                                <span>Sign: {complaint.resident?.name || 'Resident'}</span>
                                <span>Date: ____/____/2026</span>
                            </div>
                        </div>

                        {/* Staff Signature */}
                        <div className="border border-slate-400 p-3 rounded-xl bg-slate-50 space-y-8 text-center">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 block border-b pb-1">
                                Staff / Technician Signature
                            </span>
                            <div className="border-b-2 border-dashed border-slate-400 h-8"></div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-600">
                                <span>Sign: {complaint.assignedTo?.name || 'Staff'}</span>
                                <span>Date: ____/____/2026</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer instructions */}
                    <div className="text-center text-[10px] text-slate-500 font-semibold border-t border-slate-200 pt-2">
                        * Notice: Staff must take a clear photo of this signed form, the resolved work, and staff selfie, then upload to Cloudinary via the app to complete ticket resolution.
                    </div>
                </div>
            </div>
        </div>
    );
};
