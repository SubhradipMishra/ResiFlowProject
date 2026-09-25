import React, { useState, useEffect } from 'react';
import { Car, Plus, RefreshCw, AlertCircle, CheckCircle2, X, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import api from '../../services/api';

const VehiclesPage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchNumber, setSearchNumber] = useState('');
    const [searchedVehicle, setSearchedVehicle] = useState<any>(null);
    const [searchError, setSearchError] = useState('');

    const [formData, setFormData] = useState({
        vehicleType: 'four_wheeler',
        make: '',
        model: '',
        color: '',
        registrationNumber: '',
        parkingSlot: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const endpoint = user?.role === 'resident' ? '/vehicle/my-vehicles' : '/vehicle/all';
            const res = await api.get(endpoint).catch(() => ({ data: { data: [] } }));
            setVehicles(res.data?.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!formData.registrationNumber) {
            setErrorMsg('Registration plate number is required.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.post('/vehicle/register', formData);
            if (res.data?.success) {
                setSuccessMsg('Vehicle registered successfully!');
                setFormData({
                    vehicleType: 'four_wheeler',
                    make: '',
                    model: '',
                    color: '',
                    registrationNumber: '',
                    parkingSlot: '',
                });
                fetchVehicles();
                setTimeout(() => {
                    setIsModalOpen(false);
                    setSuccessMsg('');
                }, 1500);
            } else {
                setErrorMsg(res.data?.message || 'Failed to register vehicle.');
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Error registering vehicle.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setSearchError('');
        setSearchedVehicle(null);

        if (!searchNumber) return;

        try {
            const res = await api.get(`/vehicle/search?registrationNumber=${encodeURIComponent(searchNumber)}`);
            if (res.data?.data) {
                setSearchedVehicle(res.data.data);
            } else {
                setSearchError('No vehicle found matching this registration number.');
            }
        } catch (err: any) {
            setSearchError('Vehicle search failed.');
        }
    };

    const deleteVehicle = async (id: string) => {
        try {
            await api.delete(`/vehicle/${id}`);
            fetchVehicles();
        } catch (e) {
            console.error(e);
        }
    };

    const isResident = user?.role === 'resident';

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/5 rounded-bl-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-[#e11d48] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                        <Car className="w-3.5 h-3.5" /> Parking Permits & Registry
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight font-outfit">Vehicles Registry</h1>
                    <p className="text-slate-500 text-sm mt-1">Register cars, bikes, assign parking slots, and perform instant security plate lookup.</p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    {isResident && (
                        <button
                            onClick={() => { setIsModalOpen(true); setErrorMsg(''); }}
                            className="bg-[#e11d48] hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-rose-200"
                        >
                            <Plus className="w-4 h-4" /> Register Vehicle
                        </button>
                    )}
                    <button
                        onClick={fetchVehicles}
                        className="bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-semibold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 border border-slate-200"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync
                    </button>
                </div>
            </div>

            {/* Security Quick Search */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-rose-400" /> Security Plate Lookup
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">Enter vehicle registration number to identify owner & flat details</p>

                    <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
                        <input
                            type="text"
                            placeholder="e.g. MH 12 AB 1234"
                            value={searchNumber}
                            onChange={(e) => setSearchNumber(e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
                        />
                        <button
                            type="submit"
                            className="bg-[#e11d48] hover:bg-rose-600 font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
                        >
                            Search Plate
                        </button>
                    </form>

                    {searchError && (
                        <p className="text-xs text-rose-400 font-semibold mt-3">{searchError}</p>
                    )}

                    {searchedVehicle && (
                        <div className="mt-4 p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs space-y-1">
                            <p className="text-rose-400 font-extrabold text-sm uppercase">{searchedVehicle.registrationNumber}</p>
                            <p><strong className="text-slate-300">Make/Model:</strong> {searchedVehicle.make} {searchedVehicle.model} ({searchedVehicle.color})</p>
                            <p><strong className="text-slate-300">Owner:</strong> {searchedVehicle.resident?.name} ({searchedVehicle.resident?.phone})</p>
                            <p><strong className="text-slate-300">Flat:</strong> Flat {searchedVehicle.resident?.flat?.flatNumber} ({searchedVehicle.resident?.flat?.building?.name})</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Vehicle Cards */}
            {loading ? (
                <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-3xl border border-slate-200">
                    Loading vehicle registry...
                </div>
            ) : vehicles.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                    <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-[#0f172a]">No Registered Vehicles</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Register your cars or motorcycles to get society gate parking permits.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((v) => (
                        <div key={v._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 bg-rose-50 text-[#e11d48] rounded-xl flex items-center justify-center font-bold">
                                    <Car className="w-5 h-5" />
                                </div>
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg uppercase">
                                    {v.vehicleType.replace('_', ' ')}
                                </span>
                            </div>

                            <h3 className="text-2xl font-extrabold text-[#0f172a] mb-1 tracking-tight uppercase">{v.registrationNumber}</h3>
                            <p className="text-xs text-slate-500 mb-4 font-semibold">{v.make} {v.model} • {v.color || 'Standard'}</p>

                            <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1 mb-4">
                                <p className="text-slate-600"><strong className="text-slate-700">Parking Slot:</strong> {v.parkingSlot || 'Unassigned'}</p>
                                {v.resident?.name && <p className="text-slate-600"><strong className="text-slate-700">Owner:</strong> {v.resident?.name}</p>}
                            </div>

                            {isResident && (
                                <div className="pt-2 border-t border-slate-100 flex justify-end">
                                    <button
                                        onClick={() => deleteVehicle(v._id)}
                                        className="text-xs font-bold text-rose-600 hover:text-rose-700 underline"
                                    >
                                        Deregister
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Registration Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-bold text-[#0f172a] mb-1">Register Vehicle</h3>
                        <p className="text-xs text-slate-500 mb-6">Add vehicle plate details to get society gate access</p>

                        {errorMsg && (
                            <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {successMsg && (
                            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Registration Number *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. KA 01 MJ 5678"
                                    value={formData.registrationNumber}
                                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Vehicle Type</label>
                                    <select
                                        value={formData.vehicleType}
                                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    >
                                        <option value="four_wheeler">Car / SUV (4W)</option>
                                        <option value="two_wheeler">Bike / Scooter (2W)</option>
                                        <option value="electric_vehicle">EV (Electric)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Color</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. White"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Make (Brand)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Tata / Honda"
                                        value={formData.make}
                                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Model</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Nexon"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Parking Slot (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. P1-B24"
                                    value={formData.parkingSlot}
                                    onChange={(e) => setFormData({ ...formData, parkingSlot: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 bg-[#e11d48] hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-rose-200 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Registering...' : 'Register Vehicle'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehiclesPage;
