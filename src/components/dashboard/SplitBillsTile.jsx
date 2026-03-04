import React from 'react';
import { Share2, Film } from 'lucide-react';

const SplitBillsTile = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Header extension inside content if needed, but we use the tile title. 
               The image has "View All" in the header. We can handle this in the main View or duplicate logic.
               For now, let's just make the list.
            */}

            <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #F1F5F9' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#195BAC', marginRight: '1rem' }}>
                    <Share2 size={20} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E293B' }}>Pizza Night</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Split with 4 people <span style={{ fontWeight: 600, color: '#94A3B8' }}>YOU OWE SARAH</span></div>
                </div>
                <div style={{ fontWeight: 700, color: '#EF4444' }}>-$12.50</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #F1F5F9' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#195BAC', marginRight: '1rem' }}>
                    <Film size={20} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E293B' }}>Cinema IMAX</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Split with 2 people <span style={{ fontWeight: 600, color: '#94A3B8' }}>BEN OWES YOU</span></div>
                </div>
                <div style={{ fontWeight: 700, color: '#10B981' }}>+$24.00</div>
            </div>
        </div>
    );
};

export default SplitBillsTile;
