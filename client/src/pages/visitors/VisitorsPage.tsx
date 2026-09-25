import React, { useState, useEffect, useRef } from 'react';
import { UserCheck, Plus, RefreshCw, AlertCircle, CheckCircle2, X, Clock, LogIn, LogOut, Car, Download, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import api from '../../services/api';

const VisitorsPage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [visitors, setVisitors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPreApproveModalOpen, setIsPreApproveModalOpen] = useState(false);
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState<any>(null);
    const [generatedPass, setGeneratedPass] = useState<any>(null);
    const qrWrapRef = useRef<HTMLDivElement>(null);

    const [preApproveForm, setPreApproveForm] = useState({
        name: '',
        phone: '',
        visitorType: 'guest',
        purpose: 'Social visit',
        vehicleNumber: '',
        vehicleType: 'car',
    });

    const [checkInForm, setCheckInForm] = useState({
        idProofType: 'Aadhaar',
        idProofNumber: '',
        vehicleNumber: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [qrActionMsg, setQrActionMsg] = useState('');

    const fetchVisitors = async () => {
        setLoading(true);
        try {
            const endpoint = user?.role === 'resident' ? '/visitor/my-visitors' : '/visitor';
            const res = await api.get(endpoint).catch(() => ({ data: { data: [] } }));
            setVisitors(res.data?.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, [user]);

    const handlePreApproveSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!preApproveForm.name || !preApproveForm.phone) {
            setErrorMsg('Visitor name and phone are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.post('/visitor/pre-approve', preApproveForm);
            if (res.data?.success) {
                setSuccessMsg('Pass generated successfully!');
                setGeneratedPass({
                    ...preApproveForm,
                    id: res.data.data?._id || 'V-' + Math.floor(Math.random() * 10000)
                });
                setPreApproveForm({
                    name: '',
                    phone: '',
                    visitorType: 'guest',
                    purpose: 'Social visit',
                    vehicleNumber: '',
                    vehicleType: 'car',
                });
                fetchVisitors();
            } else {
                setErrorMsg(res.data?.message || 'Failed to pre-approve visitor.');
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Error creating gate pass.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCheckInSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVisitor) return;

        setIsSubmitting(true);
        try {
            const res = await api.post('/visitor/check-in', {
                visitorId: selectedVisitor._id,
                ...checkInForm,
            });
            if (res.data?.success) {
                setSuccessMsg('Visitor checked in at security gate!');
                fetchVisitors();
                setTimeout(() => {
                    setIsCheckInModalOpen(false);
                    setSuccessMsg('');
                    setSelectedVisitor(null);
                }, 1200);
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Error performing gate check-in.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCheckOut = async (visitorId: string) => {
        try {
            await api.put(`/visitor/${visitorId}/check-out`);
            fetchVisitors();
        } catch (e) {
            console.error(e);
        }
    };

    // Converts the rendered QRCodeSVG into a PNG blob via an offscreen canvas
    const qrSvgToPngBlob = (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            const svgEl = qrWrapRef.current?.querySelector('svg');
            if (!svgEl) return resolve(null);

            const svgString = new XMLSerializer().serializeToString(svgEl);
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.onload = () => {
                const padding = 24;
                const size = 360;
                const canvas = document.createElement('canvas');
                canvas.width = size + padding * 2;
                canvas.height = size + padding * 2;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    URL.revokeObjectURL(url);
                    return resolve(null);
                }
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, padding, padding, size, size);
                URL.revokeObjectURL(url);
                canvas.toBlob((blob) => resolve(blob), 'image/png');
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                resolve(null);
            };
            img.src = url;
        });
    };

    const handleDownloadQR = async () => {
        setQrActionMsg('');
        const blob = await qrSvgToPngBlob();
        if (!blob) {
            setQrActionMsg('Could not prepare the QR image.');
            return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `gate-pass-${(generatedPass?.name || 'visitor').replace(/\s+/g, '-').toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleShareQR = async () => {
        setQrActionMsg('');
        const blob = await qrSvgToPngBlob();
        const shareText = `Gate pass for ${generatedPass?.name} (${generatedPass?.visitorType}). Show this QR at the gate.`;

        if (blob) {
            const file = new File([blob], 'gate-pass.png', { type: 'image/png' });
            if (typeof navigator !== 'undefined' && (navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
                try {
                    await (navigator as any).share({
                        files: [file],
                        title: 'Visitor Gate Pass',
                        text: shareText,
                    });
                    return;
                } catch (err) {
                    // user cancelled or share failed — fall through to fallback below
                }
            }
        }

        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({ title: 'Visitor Gate Pass', text: shareText });
                return;
            } catch (err) {
                // fall through
            }
        }

        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(shareText);
                setQrActionMsg('Sharing isn\u2019t supported here — pass details copied instead.');
                return;
            } catch (err) {
                // ignore
            }
        }
        setQrActionMsg('Sharing isn\u2019t supported on this device.');
    };

    const isResident = user?.role === 'resident';
    const isSecurity = user?.role === 'staff' || user?.role === 'admin';

    const visitorStatusPill = (status: string) => {
        if (status === 'checked_in') return 'bg-emerald-500 text-white';
        if (status === 'checked_out') return 'bg-slate-900 text-white';
        return 'bg-amber-400 text-slate-900';
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
            {/* Header Banner — flat, ink-bordered, squarish */}
            <div className="bg-white p-6 sm:p-8 rounded-[28px] border-2 border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-slate-900 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3 border-2 border-slate-900">
                        <UserCheck className="w-3.5 h-3.5" /> Security Gate Pass Desk
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">Visitor Management</h1>
                    <p className="text-slate-500 text-sm mt-2 max-w-xl leading-relaxed">Pre-approve guests, issue digital gate passes, and track entry/exit timestamps.</p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    {isResident && (
                        <button
                            onClick={() => { setIsPreApproveModalOpen(true); setErrorMsg(''); }}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 border-2 border-slate-900"
                        >
                            <Plus className="w-4 h-4" /> Pre-Approve Guest
                        </button>
                    )}
                    <button
                        onClick={fetchVisitors}
                        className="bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 border-2 border-slate-900"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Logs
                    </button>
                </div>
            </div>

            {/* Visitor Cards */}
            {loading ? (
                <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-[28px] border-2 border-slate-900">
                    Loading visitor entry logs...
                </div>
            ) : visitors.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-[28px] border-2 border-dashed border-slate-300">
                    <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-extrabold text-slate-900">No Visitors Recorded</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Pre-approve guests or perform security check-ins at the gate.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visitors.map((v) => (
                        <div key={v._id} className="bg-white p-6 rounded-[28px] border-2 border-slate-900">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 bg-rose-600 text-white rounded-xl flex items-center justify-center border-2 border-slate-900">
                                    <UserCheck className="w-5 h-5" />
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-extrabold rounded-full uppercase tracking-wider ${visitorStatusPill(v.status)}`}>
                                    {v.status.replace('_', ' ')}
                                </span>
                            </div>

                            <h3 className="text-xl font-extrabold text-slate-900 mb-1">{v.name}</h3>
                            <p className="text-xs text-slate-500 mb-3 font-semibold">{v.phone} • {v.visitorType}</p>

                            <div className="space-y-1.5 text-xs text-slate-600 p-3 bg-[#FAF9F6] border-2 border-slate-200 rounded-2xl mb-4">
                                <p><strong className="text-slate-700">Purpose:</strong> {v.purpose || 'Visit'}</p>
                                {v.vehicleNumber && (
                                    <p className="flex items-center gap-1">
                                        <Car className="w-3.5 h-3.5 text-slate-400" /> {v.vehicleNumber}
                                    </p>
                                )}
                                <p className="flex items-center gap-1 text-slate-400">
                                    <Clock className="w-3.5 h-3.5" /> Entry: {v.entryTime ? new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                                </p>
                            </div>

                            {/* Gate Security Actions */}
                            {isSecurity && (
                                <div className="pt-2 border-t-2 border-slate-100 flex items-center justify-end gap-2">
                                    {v.status === 'approved' && (
                                        <button
                                            onClick={() => { setSelectedVisitor(v); setIsCheckInModalOpen(true); }}
                                            className="w-full bg-slate-900 hover:bg-slate-700 text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border-2 border-slate-900"
                                        >
                                            <LogIn className="w-3.5 h-3.5" /> Gate Check-In
                                        </button>
                                    )}
                                    {v.status === 'checked_in' && (
                                        <button
                                            onClick={() => handleCheckOut(v._id)}
                                            className="w-full bg-white text-rose-600 hover:bg-rose-600 hover:text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border-2 border-slate-900"
                                        >
                                            <LogOut className="w-3.5 h-3.5" /> Gate Check-Out
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Pre-Approve Modal — flat */}
            {isPreApproveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
                    <div className="bg-white rounded-[28px] max-w-md w-full p-8 border-2 border-slate-900 relative">
                        <button
                            onClick={() => setIsPreApproveModalOpen(false)}
                            className="absolute top-6 right-6 w-8 h-8 rounded-lg border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Pre-Approve Guest</h3>
                        <p className="text-xs text-slate-500 mb-6">Generate an instant digital security pass for your visitor</p>

                        {errorMsg && (
                            <div className="mb-4 p-3 bg-white border-2 border-rose-600 text-rose-600 text-xs font-bold rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {successMsg && !generatedPass && (
                            <div className="mb-4 p-3 bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        {generatedPass ? (
                            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-900 rounded-2xl bg-[#FAF9F6] mb-2">
                                <div ref={qrWrapRef} className="bg-white p-4 rounded-xl border-2 border-slate-900 mb-4">
                                    <QRCodeSVG
                                        value={JSON.stringify(generatedPass)}
                                        size={180}
                                        level="H"
                                        includeMargin={true}
                                        fgColor="#0f172a"
                                    />
                                </div>
                                <h4 className="text-lg font-extrabold text-slate-900">{generatedPass.name}</h4>
                                <p className="text-xs font-extrabold text-rose-600 uppercase tracking-wider mb-2">Gate Pass • {generatedPass.visitorType}</p>
                                <p className="text-xs text-slate-500 mb-1">Phone: {generatedPass.phone}</p>
                                <p className="text-xs text-slate-500 mb-1">Purpose: {generatedPass.purpose}</p>
                                {generatedPass.vehicleNumber && (
                                    <p className="text-xs text-slate-500">Vehicle: {generatedPass.vehicleNumber}</p>
                                )}
                                <p className="text-[10px] text-slate-400 mt-4 mb-4">Ask visitor to show this QR at the gate.</p>

                                {/* Download / Share QR */}
                                <div className="w-full grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleDownloadQR}
                                        className="bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold py-3 rounded-xl text-sm border-2 border-slate-900 flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Download className="w-4 h-4" /> Download
                                    </button>
                                    <button
                                        onClick={handleShareQR}
                                        className="bg-slate-900 hover:bg-slate-700 text-white font-extrabold py-3 rounded-xl text-sm border-2 border-slate-900 flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Share2 className="w-4 h-4" /> Share
                                    </button>
                                </div>

                                {qrActionMsg && (
                                    <p className="text-[11px] text-slate-500 mt-3 text-center">{qrActionMsg}</p>
                                )}

                                <button
                                    onClick={() => {
                                        setIsPreApproveModalOpen(false);
                                        setGeneratedPass(null);
                                        setSuccessMsg('');
                                        setQrActionMsg('');
                                    }}
                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3.5 rounded-xl transition-colors border-2 border-slate-900 mt-3"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handlePreApproveSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Visitor Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Vikram Singh"
                                        value={preApproveForm.name}
                                        onChange={(e) => setPreApproveForm({ ...preApproveForm, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Phone *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="9876543210"
                                            value={preApproveForm.phone}
                                            onChange={(e) => setPreApproveForm({ ...preApproveForm, phone: e.target.value })}
                                            className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Visitor Type</label>
                                        <select
                                            value={preApproveForm.visitorType}
                                            onChange={(e) => setPreApproveForm({ ...preApproveForm, visitorType: e.target.value })}
                                            className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                        >
                                            <option value="guest">Guest / Friend</option>
                                            <option value="delivery">Delivery</option>
                                            <option value="cab">Cab / Taxi</option>
                                            <option value="service_provider">Service / Maintenance</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Vehicle Reg Number (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. DL 01 AB 1234"
                                        value={preApproveForm.vehicleNumber}
                                        onChange={(e) => setPreApproveForm({ ...preApproveForm, vehicleNumber: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full mt-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3.5 rounded-xl transition-colors border-2 border-slate-900 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Generating Pass...' : 'Generate Pre-Approval Pass'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Check-In Modal for Security — flat */}
            {isCheckInModalOpen && selectedVisitor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
                    <div className="bg-white rounded-[28px] max-w-md w-full p-8 border-2 border-slate-900 relative">
                        <button
                            onClick={() => setIsCheckInModalOpen(false)}
                            className="absolute top-6 right-6 w-8 h-8 rounded-lg border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Gate Check-In: {selectedVisitor.name}</h3>
                        <p className="text-xs text-slate-500 mb-6">Verify visitor ID proof and log gate entry</p>

                        <form onSubmit={handleCheckInSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">ID Proof Type</label>
                                <select
                                    value={checkInForm.idProofType}
                                    onChange={(e) => setCheckInForm({ ...checkInForm, idProofType: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                >
                                    <option value="Aadhaar">Aadhaar Card</option>
                                    <option value="Driving License">Driving License</option>
                                    <option value="Voter ID">Voter ID</option>
                                    <option value="Passport">Passport</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">ID Number / Last 4 Digits</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 5678"
                                    value={checkInForm.idProofNumber}
                                    onChange={(e) => setCheckInForm({ ...checkInForm, idProofNumber: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 bg-slate-900 hover:bg-slate-700 text-white font-extrabold py-3.5 rounded-xl transition-colors border-2 border-slate-900 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Verifying...' : 'Confirm Gate Check-In'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisitorsPage;