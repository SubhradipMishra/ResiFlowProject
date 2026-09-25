import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlaceholderProps {
    title: string;
    description: string;
}

const PlaceholderPage: React.FC<PlaceholderProps> = ({ title, description }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700 mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-[#e11d48]" /> ResiFlow Module
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">{title}</h1>
                    <p className="text-slate-500 text-sm mt-1">{description}</p>
                </div>

                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
            </div>

            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
                <div className="h-16 w-16 bg-rose-50 text-[#e11d48] rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                    {title.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-2">{title} Workspace</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                    This module is active and ready. Select actions or return to your main dashboard.
                </p>
            </div>
        </div>
    );
};

export default PlaceholderPage;
