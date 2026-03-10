import React from 'react';
import '../App.css';
import './Auditor.css';

const Auditor = () => {
    return (
        <div className="auditor-page">
            <h1 className="auditor-page-title">Auditor Workflow</h1>

            <div className="auditor-grid">
                {/* Skeleton Tiles */}
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="auditor-skeleton-card">
                        <div className="auditor-skeleton-shimmer" />
                        <div className="auditor-skeleton-content">
                            <div className="auditor-skeleton-line-1" />
                            <div className="auditor-skeleton-line-2" />
                            <div className="auditor-skeleton-spacer" />
                            <div className="auditor-skeleton-button" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="auditor-skeleton-list">
                <div className="auditor-skeleton-list-item" />
                <div className="auditor-skeleton-list-item" />
            </div>
        </div>
    );
};

export default Auditor;
