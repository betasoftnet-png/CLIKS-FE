import React from 'react';
import '../App.css';

const Auditor = () => {
    return (
        <div className="auditor-page text-center">
            <h1 className="text-2xl font-bold mb-8 text-left text-slate-800">Auditor Workflow</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Skeleton Tiles */}
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="h-64 bg-slate-100 rounded-2xl animate-pulse relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] animate-shimmer" />
                        <div className="p-6 flex flex-col gap-4 h-full">
                            <div className="h-6 w-1/2 bg-slate-200 rounded" />
                            <div className="h-4 w-3/4 bg-slate-200 rounded" />
                            <div className="flex-1" />
                            <div className="h-10 w-full bg-slate-200 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex flex-col gap-4">
                <div className="h-32 w-full bg-slate-100 rounded-2xl animate-pulse" />
                <div className="h-32 w-full bg-slate-100 rounded-2xl animate-pulse" />
            </div>
        </div>
    );
};

export default Auditor;
