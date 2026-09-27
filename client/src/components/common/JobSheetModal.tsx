import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Wrench, ShieldCheck, Building2, User, Download, FileText } from 'lucide-react';

interface JobSheetModalProps {
    isOpen: boolean;
    onClose: () => void;
    complaint: any;
}

export const JobSheetModal: React.FC<JobSheetModalProps> = ({ isOpen, onClose, complaint }) => {
    const printRef = useRef<HTMLDivElement>(null);

    if (!isOpen || !complaint) return null;

    const jobSheetNum = complaint.jobSheetNumber || `JS-${(complaint._id || complaint.id || '').slice(-6).toUpperCase()}`;
    const dateFormatted = complaint.scheduledDate || new Date().toISOString().split('T')[0];
    const slotTime = complaint.scheduledSlot
        ? `${complaint.scheduledSlot.startTime} - ${complaint.scheduledSlot.endTime}`
        : '09:00 - 11:00';
    const generatedOn = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        if (!printRef.current) return;

        const societyName = complaint.residence?.name || 'SmartResidence Society';
        const residentName = complaint.resident?.name || 'Resident';
        const flatNo = complaint.flat?.flatNumber || 'Flat Unit';
        const staffName = complaint.assignedTo?.name || 'Assigned Technician';
        const staffRole = complaint.assignedTo?.role || complaint.category || 'Operations';

        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Job Sheet — ${jobSheetNum}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; font-size: 11px; background: white; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
    .header-left h1 { font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.03em; }
    .header-left p { color: #64748b; margin-top: 2px; }
    .badge { display: inline-block; background: #0f172a; color: white; font-family: monospace; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; margin-top: 6px; }
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 14px; }
    .meta-item .label { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #94a3b8; display: block; }
    .meta-item .value { font-weight: 800; font-size: 11px; }
    .meta-item .value.accent { color: #dc2626; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
    .info-box { border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px; }
    .info-box h3 { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; margin-bottom: 6px; }
    .info-box p { margin-bottom: 3px; }
    .info-box .field-label { color: #64748b; font-weight: 700; }
    .info-box .field-value { font-weight: 800; }
    .desc-box { border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px; margin-bottom: 14px; }
    .desc-box h3 { font-size: 9px; font-weight: 900; text-transform: uppercase; margin-bottom: 6px; }
    .desc-box .title { font-weight: 800; margin-bottom: 4px; }
    .desc-box .desc { background: #f8fafc; padding: 6px 8px; border-radius: 4px; border: 1px solid #e2e8f0; line-height: 1.5; color: #334155; }
    .desc-box .ai-note { margin-top: 6px; color: #64748b; font-style: italic; }
    .log-table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 14px; }
    .log-table th { background: #f1f5f9; padding: 6px 8px; text-align: left; border: 1px solid #cbd5e1; font-weight: 800; font-size: 9px; text-transform: uppercase; }
    .log-table td { padding: 10px 8px; border: 1px solid #e2e8f0; vertical-align: top; }
    .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; border-top: 2px solid #0f172a; padding-top: 14px; margin-bottom: 14px; }
    .sig-box { border: 1px solid #94a3b8; padding: 10px; border-radius: 8px; background: #f8fafc; }
    .sig-box .sig-title { font-size: 9px; font-weight: 900; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 20px; }
    .sig-box .sig-line { border-bottom: 2px dashed #94a3b8; height: 24px; margin-bottom: 8px; }
    .sig-box .sig-meta { display: flex; justify-content: space-between; font-size: 9px; font-weight: 700; color: #475569; }
    .footer-note { text-align: center; font-size: 9px; color: #94a3b8; font-weight: 600; border-top: 1px solid #e2e8f0; padding-top: 8px; }
    .generated { text-align: right; font-size: 9px; color: #94a3b8; margin-bottom: 12px; }
  </style>
</head>
<body>
  <div class="generated">Generated: ${generatedOn}</div>
  <div class="header">
    <div class="header-left">
      <h1>${societyName}</h1>
      <p>Facility &amp; Property Maintenance Management Order</p>
      <div class="badge">Work Order #${jobSheetNum}</div>
    </div>
  </div>
  <div class="meta-grid">
    <div class="meta-item"><span class="label">Service Date</span><span class="value">${dateFormatted}</span></div>
    <div class="meta-item"><span class="label">Allocated Slot</span><span class="value accent">${slotTime}</span></div>
    <div class="meta-item"><span class="label">Category</span><span class="value">${(complaint.category || 'Maintenance').toUpperCase()}</span></div>
    <div class="meta-item"><span class="label">Priority</span><span class="value accent">${(complaint.priority || 'Medium').toUpperCase()}</span></div>
  </div>
  <div class="two-col">
    <div class="info-box">
      <h3>Resident / Flat Details</h3>
      <p><span class="field-label">Resident: </span><span class="field-value">${residentName}</span></p>
      <p><span class="field-label">Flat No: </span><span class="field-value">${flatNo}${complaint.flat?.floor ? ` (Floor ${complaint.flat.floor})` : ''}</span></p>
      <p><span class="field-label">Phone: </span><span class="field-value">${complaint.resident?.phone || 'On Record'}</span></p>
    </div>
    <div class="info-box">
      <h3>Assigned Technician</h3>
      <p><span class="field-label">Staff Name: </span><span class="field-value">${staffName}</span></p>
      <p><span class="field-label">Role / Dept: </span><span class="field-value">${staffRole.toUpperCase()} (${complaint.assignedTo?.department || 'Operations'})</span></p>
      <p><span class="field-label">Contact: </span><span class="field-value">${complaint.assignedTo?.phone || 'N/A'}</span></p>
    </div>
  </div>
  <div class="desc-box">
    <h3>Problem Description &amp; AI Classification</h3>
    <p class="title">${complaint.title || 'Maintenance Issue'}</p>
    <p class="desc">${complaint.description || ''}</p>
    ${complaint.aiAnalysis?.reasoning ? `<p class="ai-note"><strong>AI Assessment:</strong> ${complaint.aiAnalysis.reasoning}</p>` : ''}
  </div>
  <table class="log-table">
    <thead><tr><th>Step / Task Performed</th><th>Parts / Spares Used</th><th style="width:80px;text-align:center;">Status</th></tr></thead>
    <tbody>
      <tr><td>1. Inspection &amp; Root Cause Diagnosis</td><td></td><td style="text-align:center;font-weight:700;font-size:9px;">COMPLETED [  ]</td></tr>
      <tr><td>2. Repair / Replacement Executed</td><td></td><td style="text-align:center;font-weight:700;font-size:9px;">COMPLETED [  ]</td></tr>
      <tr><td>3. Functional Testing &amp; Resident Verification</td><td></td><td style="text-align:center;font-weight:700;font-size:9px;">SATISFIED [  ]</td></tr>
    </tbody>
  </table>
  <div class="sig-grid">
    <div class="sig-box">
      <div class="sig-title">Resident Acknowledgment &amp; Signature</div>
      <div class="sig-line"></div>
      <div class="sig-meta"><span>Sign: ${residentName}</span><span>Date: ____/____/2026</span></div>
    </div>
    <div class="sig-box">
      <div class="sig-title">Staff / Technician Signature</div>
      <div class="sig-line"></div>
      <div class="sig-meta"><span>Sign: ${staffName}</span><span>Date: ____/____/2026</span></div>
    </div>
  </div>
  <div class="footer-note">* Staff must photograph this signed form, the resolved work, and a selfie — then upload via app to complete ticket closure.</div>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `JobSheet-${jobSheetNum}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            {/* Print-only content: render the full doc for browser print dialog */}
            <div className="job-sheet-print-source hidden print:block" ref={printRef}>
                {/* This is rendered by window.print() via the .print-area class — see below */}
            </div>

            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-sm overflow-y-auto animate-fadeIn print:p-0 print:bg-white">
                <div className="bg-white rounded-[28px] max-w-3xl w-full border-2 border-slate-900 shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:rounded-none print:max-w-none">

                    {/* === MODAL TOOLBAR (hidden on print) === */}
                    <div className="print:hidden flex items-center justify-between px-6 py-4 border-b-2 border-slate-900 bg-slate-50">
                        <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-xl bg-rose-600 border-2 border-slate-900 flex items-center justify-center">
                                <FileText className="w-4.5 h-4.5 text-white" />
                            </div>
                            <div>
                                <p className="font-extrabold text-slate-900 text-sm leading-tight">Official Maintenance Work Order</p>
                                <p className="text-[10px] text-slate-500 font-semibold font-mono">#{jobSheetNum}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Download Button */}
                            <button
                                onClick={handleDownload}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 border-2 border-slate-900 transition-colors shadow-sm"
                                title="Download as HTML file (open in browser → Save as PDF)"
                            >
                                <Download className="w-4 h-4" /> Download
                            </button>
                            {/* Print Button */}
                            <button
                                onClick={handlePrint}
                                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 border-2 border-slate-900 transition-colors shadow-sm"
                            >
                                <Printer className="w-4 h-4" /> Print
                            </button>
                            {/* Close */}
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-xl border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* === PRINTABLE DOCUMENT BODY === */}
                    <div id="job-sheet-printable" className="p-6 sm:p-8 print:p-6 space-y-5 text-slate-900">

                        {/* Generated timestamp */}
                        <p className="text-right text-[10px] text-slate-400 font-semibold print:block hidden">
                            Generated: {generatedOn}
                        </p>

                        {/* Doc Header */}
                        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Building2 className="w-5 h-5 text-slate-900" />
                                    <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                                        {complaint.residence?.name || 'SmartResidence Society'}
                                    </h1>
                                </div>
                                <p className="text-xs text-slate-500 mb-2">Facility &amp; Property Maintenance Management Order</p>
                                <div className="inline-block px-3 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded-md">
                                    Work Order #{jobSheetNum}
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1 shrink-0">
                                <div className="p-2 bg-white border-2 border-slate-900 rounded-xl">
                                    <QRCodeSVG
                                        value={`TICKET:${complaint._id || complaint.id}|ORDER:${jobSheetNum}|SLOT:${slotTime}`}
                                        size={64}
                                        level="M"
                                    />
                                </div>
                                <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">Scan to Verify</span>
                            </div>
                        </div>

                        {/* Meta Info Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 text-xs">
                            <div>
                                <span className="text-slate-400 font-bold block uppercase text-[9px] mb-0.5">Service Date</span>
                                <span className="font-extrabold text-slate-900">{dateFormatted}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 font-bold block uppercase text-[9px] mb-0.5">Allocated Slot</span>
                                <span className="font-extrabold text-rose-600">{slotTime}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 font-bold block uppercase text-[9px] mb-0.5">Category</span>
                                <span className="font-extrabold uppercase text-slate-900">{complaint.category || 'Maintenance'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 font-bold block uppercase text-[9px] mb-0.5">Priority</span>
                                <span className="font-extrabold uppercase text-rose-600">{complaint.priority || 'Medium'}</span>
                            </div>
                        </div>

                        {/* Resident & Technician Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="border-2 border-slate-200 p-4 rounded-2xl space-y-1.5">
                                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2">
                                    <User className="w-3.5 h-3.5 text-slate-900" /> Resident / Flat Details
                                </h3>
                                <div className="text-xs space-y-1">
                                    <p><span className="text-slate-500 font-bold">Resident: </span><span className="font-extrabold">{complaint.resident?.name || 'Resident'}</span></p>
                                    <p><span className="text-slate-500 font-bold">Flat No: </span><span className="font-extrabold">{complaint.flat?.flatNumber || 'Flat Unit'}</span>{complaint.flat?.floor ? <span className="text-slate-500"> (Floor {complaint.flat.floor})</span> : ''}</p>
                                    <p><span className="text-slate-500 font-bold">Phone: </span><span className="font-bold">{complaint.resident?.phone || 'On Record'}</span></p>
                                </div>
                            </div>

                            <div className="border-2 border-slate-200 p-4 rounded-2xl space-y-1.5">
                                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-slate-900" /> Assigned Technician
                                </h3>
                                <div className="text-xs space-y-1">
                                    <p><span className="text-slate-500 font-bold">Staff Name: </span><span className="font-extrabold">{complaint.assignedTo?.name || 'Assigned Technician'}</span></p>
                                    <p><span className="text-slate-500 font-bold">Role / Dept: </span><span className="font-bold uppercase">{complaint.assignedTo?.role || complaint.category} ({complaint.assignedTo?.department || 'Operations'})</span></p>
                                    <p><span className="text-slate-500 font-bold">Contact: </span><span className="font-bold">{complaint.assignedTo?.phone || 'N/A'}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Problem Description */}
                        <div className="border-2 border-slate-200 p-4 rounded-2xl space-y-2">
                            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                <Wrench className="w-3.5 h-3.5 text-rose-600" /> Problem Description &amp; AI Classification
                            </h3>
                            <p className="text-sm font-extrabold text-slate-900">{complaint.title}</p>
                            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">{complaint.description}</p>
                            {complaint.aiAnalysis?.reasoning && (
                                <p className="text-[11px] text-slate-500 italic">
                                    <span className="font-bold text-slate-700">AI Assessment: </span>{complaint.aiAnalysis.reasoning}
                                </p>
                            )}
                        </div>

                        {/* Technician Work Log Table */}
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-700">Service Completion &amp; Materials Log (Offline Entry)</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-2 border-slate-300 rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-slate-100 border-b-2 border-slate-300 text-[10px] font-black uppercase">
                                            <th className="p-2.5 text-left border-r border-slate-300">Step / Task Performed</th>
                                            <th className="p-2.5 text-left border-r border-slate-300">Parts / Spares Used</th>
                                            <th className="p-2.5 text-center w-24">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-slate-200 h-9">
                                            <td className="p-2 border-r border-slate-200 font-semibold">1. Inspection &amp; Root Cause Diagnosis</td>
                                            <td className="p-2 border-r border-slate-200"></td>
                                            <td className="p-2 text-center font-black text-[10px]">COMPLETED [  ]</td>
                                        </tr>
                                        <tr className="border-b border-slate-200 h-9">
                                            <td className="p-2 border-r border-slate-200 font-semibold">2. Repair / Replacement Executed</td>
                                            <td className="p-2 border-r border-slate-200"></td>
                                            <td className="p-2 text-center font-black text-[10px]">COMPLETED [  ]</td>
                                        </tr>
                                        <tr className="h-9">
                                            <td className="p-2 border-r border-slate-200 font-semibold">3. Functional Testing &amp; Resident Verification</td>
                                            <td className="p-2 border-r border-slate-200"></td>
                                            <td className="p-2 text-center font-black text-[10px]">SATISFIED [  ]</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Dual Signatures */}
                        <div className="grid grid-cols-2 gap-6 pt-5 border-t-2 border-slate-900">
                            <div className="border-2 border-slate-400 p-4 rounded-2xl bg-slate-50 text-center">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block border-b border-slate-300 pb-2 mb-5">
                                    Resident Acknowledgment &amp; Signature
                                </span>
                                <div className="border-b-2 border-dashed border-slate-400 h-8 mb-3"></div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-600">
                                    <span>Sign: {complaint.resident?.name || 'Resident'}</span>
                                    <span>Date: ____/____/2026</span>
                                </div>
                            </div>
                            <div className="border-2 border-slate-400 p-4 rounded-2xl bg-slate-50 text-center">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block border-b border-slate-300 pb-2 mb-5">
                                    Staff / Technician Signature
                                </span>
                                <div className="border-b-2 border-dashed border-slate-400 h-8 mb-3"></div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-600">
                                    <span>Sign: {complaint.assignedTo?.name || 'Staff'}</span>
                                    <span>Date: ____/____/2026</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer note */}
                        <div className="text-center text-[10px] text-slate-400 font-semibold border-t border-slate-200 pt-3">
                            * Staff must photograph this signed form, the resolved work, and a selfie — then upload via app to complete ticket closure.
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};
