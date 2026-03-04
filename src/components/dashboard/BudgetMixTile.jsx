import React from 'react';
import { Utensils, Film, Car, Lightbulb } from 'lucide-react';


const BudgetItem = ({ icon: Icon, label, current, total, color }) => {
    const percentage = Math.min((current / total) * 100, 100);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: color // Use the color for the icon itself to match "React-icons" style request often implying colored icons
                    }}>
                        <Icon size={20} />
                    </div>
                    <span style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.9rem' }}>{label}</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    <span style={{ color: '#1E293B' }}>${current}</span>
                    <span style={{ color: '#94A3B8' }}> / ${total}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#F1F5F9',
                borderRadius: '99px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: color,
                    borderRadius: '99px',
                    transition: 'width 0.5s ease-out'
                }} />
            </div>
        </div>
    );
};

const BudgetMixTile = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
            }}>
                <BudgetItem
                    icon={Utensils}
                    label="Food & Drinks"
                    current={420}
                    total={600}
                    color="#195BAC" // Primary Blue
                />
                <BudgetItem
                    icon={Film}
                    label="Entertainment"
                    current={180}
                    total={200}
                    color="#3B82F6" // Blue
                />
                <BudgetItem
                    icon={Car}
                    label="Transport"
                    current={85}
                    total={150}
                    color="#60A5FA" // Light Blue
                />
                <BudgetItem
                    icon={Lightbulb}
                    label="Utilities"
                    current={120}
                    total={120}
                    color="#EF4444" // Red
                />
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', paddingTop: '0.5rem' }}>
                <a href="#view-all" style={{ fontSize: '0.85rem', color: '#195BAC', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    View All Categories
                </a>
            </div>
        </div>
    );
};

export default BudgetMixTile;
