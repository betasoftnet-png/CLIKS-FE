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
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header with View All is usually handled by the Tile wrapper title, 
                but specific 'View All' link for this content might be needed inside if the main title is generic. 
                The Dashboard renders the title "Budget". We can add the View All link here. 
            */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '1rem',
                marginTop: '-0.5rem' // Pull up slightly to align with header area if needed, or just standard spacing
            }}>
                <a href="#view-all" style={{ fontSize: '0.85rem', color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>
                    View All
                </a>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2rem 1.5rem', // Row gap, Column gap
                alignItems: 'start'
            }}>
                <BudgetItem
                    icon={Utensils}
                    label="Food & Drinks"
                    current={420}
                    total={600}
                    color="#1E40AF" // Dark Blue
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
        </div>
    );
};

export default BudgetMixTile;
