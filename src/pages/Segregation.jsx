import React from 'react';
import '../App.css';

const Segregation = () => {
    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Segregation</h1>
                <p className="text-slate-500 mt-1">Manage and segregate your financial items.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#195BAC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                            <polyline points="2 17 12 22 22 17" />
                            <polyline points="2 12 12 17 22 12" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">Segregation Page</h3>
                    <p className="text-slate-500 mt-2 max-w-md">
                        This page is currently under construction. Future features will include advanced item segregation and categorization tools.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Segregation;
