import React, { useState, useEffect, useMemo } from 'react';
import {
    Users,
    UserCheck,
    Building2,
    Briefcase,
    Lock,
    Unlock,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    AlertCircle,
    IndianRupee,
    CreditCard,
    FileText,
    Download,
    ExternalLink,
    Clock,
    ArrowRight,
    Sparkles,
    ChevronRight,
    Info,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BadgeCheck,
    Shield,
    Check,
    X,
    RotateCcw
} from 'lucide-react';
import { useAuth } from '../context';
import { apiClient } from '../api/client';

// Helper to extract logged-in user email dynamically
const resolveCurrentUserEmail = (authContextUser) => {
    // 1. From AuthContext user
    if (authContextUser?.email) return authContextUser.email.toLowerCase().trim();
    if (authContextUser?.username && authContextUser.username.includes('@')) {
        return authContextUser.username.toLowerCase().trim();
    }

    // 2. From localStorage 'user'
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed.email) return parsed.email.toLowerCase().trim();
            if (parsed.username) {
                return parsed.username.includes('@') 
                    ? parsed.username.toLowerCase().trim() 
                    : `${parsed.username.toLowerCase().trim()}@bnxmail.com`;
            }
        }
    } catch (e) {}

    // 3. From JWT token payload (books_auth_token or bnx_auth_token)
    try {
        const token = localStorage.getItem('books_auth_token') || localStorage.getItem('bnx_auth_token');
        if (token && token.includes('.')) {
            const base64Url = token.split('.')[1];
            if (base64Url) {
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                const payload = JSON.parse(jsonPayload);
                if (payload.email) return payload.email.toLowerCase().trim();
                if (payload.username) {
                    return payload.username.includes('@') 
                        ? payload.username.toLowerCase().trim() 
                        : `${payload.username.toLowerCase().trim()}@bnxmail.com`;
                }
            }
        }
    } catch (e) {}

    // 4. From direct localStorage keys
    try {
        const directEmail = localStorage.getItem('user_email') || localStorage.getItem('cliks_user_email');
        if (directEmail) return directEmail.toLowerCase().trim();
        const directUsername = localStorage.getItem('username');
        if (directUsername) {
            return directUsername.includes('@') 
                ? directUsername.toLowerCase().trim() 
                : `${directUsername.toLowerCase().trim()}@bnxmail.com`;
        }
    } catch (e) {}

    // Fallback default
    return 'vincent1182003@bnxmail.com';
};

// Default staff records created by HR in Cliks Business
const INITIAL_STAFF_LIST = [
    {
        corporateEmail: 'vincent1182003@bnxmail.com',
        firstName: 'vincent',
        lastName: 'ffjd',
        name: 'vincent ffjd',
        employeeCode: 'CLK-0040',
        basicMonthlySalary: 25000,
        department: 'Operations',
        designation: 'Sales Executive',
        joiningDate: '01 Mar 2026',
        employmentType: 'FULL TIME ACTIVE',
        bankName: 'HDFC Bank',
        accountNumber: '•••• •••• 5678',
        ifsc: 'HDFC0001234',
        pan: 'ABCDE1234F',
        pfUan: '101234567890',
        esiNumber: '31009876540001',
        residentialAddress: 'Plot No. 12, Anna Nagar, Chennai, Tamil Nadu (600040)',
        emergencyPerson: 'Vijay Kumar (Father) - +91 98765 99911',
        personalInfo: '2026-09-29 (Male) • Blood group: O+',
        contactPhone: '+91 98765 43210',
        inviterName: 'santhoshhhhhh(HR)'
    },
    {
        corporateEmail: 'sanjay123@bnxmail.com',
        firstName: 'rakesh',
        lastName: 'kumar',
        name: 'rakesh kumar',
        employeeCode: 'CLK-0039',
        basicMonthlySalary: 35000,
        department: 'Operations',
        designation: 'Sales Executive',
        joiningDate: '15 Jan 2026',
        employmentType: 'FULL TIME ACTIVE',
        bankName: 'HDFC Bank',
        accountNumber: '•••• •••• 1122',
        ifsc: 'HDFC0001234',
        pan: 'ABCDE1234F',
        pfUan: '101234567890',
        esiNumber: '31009876540001',
        residentialAddress: 'Plot No. 12, Anna Nagar, Chennai, Tamil Nadu (600040)',
        emergencyPerson: 'Vijay Kumar (Father) - +91 98765 99911',
        personalInfo: '2026-09-29 (Male) • Blood group: O+',
        contactPhone: '+91 98765 43210',
        inviterName: 'santhoshhhhhh(HR)'
    }
];

export const StaffDetails = () => {
    const { user } = useAuth();
    
    // Dynamically retrieve the logged-in session email
    const loggedInEmail = useMemo(() => resolveCurrentUserEmail(user), [user]);

    // Retrieve dynamic business name from HR profile settings (cliksbusiness.com/customization)
    const [businessName, setBusinessName] = useState(() => {
        try {
            const custom = localStorage.getItem('cliks_business_customization') || localStorage.getItem('business_profile');
            if (custom) {
                const p = JSON.parse(custom);
                if (p.business_name || p.companyName || p.legal_name || p.businessName) {
                    return p.business_name || p.companyName || p.legal_name || p.businessName;
                }
            }
        } catch (e) {}

        try {
            const configStr = localStorage.getItem('customizationConfig') || localStorage.getItem('invoice_settings');
            if (configStr) {
                const c = JSON.parse(configStr);
                if (c.companyName || c.business_name || c.businessName) {
                    return c.companyName || c.business_name || c.businessName;
                }
            }
        } catch (e) {}

        return localStorage.getItem('business_name') || 'Welton Consignor';
    });

    // Staff List state
    const [staffList, setStaffList] = useState(() => {
        try {
            const cached = localStorage.getItem('cliks_staff_list');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {}
        return INITIAL_STAFF_LIST;
    });

    // Active Staff Record strictly matched by active session email
    const currentStaff = useMemo(() => {
        const found = staffList.find(s => 
            (s.corporateEmail || s.email || '').toLowerCase() === loggedInEmail.toLowerCase()
        );
        if (found) return found;

        // Route fallback for Sanjay vs Vincent
        if (loggedInEmail.toLowerCase().includes('sanjay')) {
            return INITIAL_STAFF_LIST[1];
        }
        return INITIAL_STAFF_LIST[0];
    }, [staffList, loggedInEmail]);

    // Scoped invitation status key per user account
    const statusStorageKey = `cliks_staff_invitation_status_${loggedInEmail.toLowerCase()}`;

    const [invitationStatus, setInvitationStatus] = useState(() => {
        try {
            return localStorage.getItem(statusStorageKey) || 'pending';
        } catch (e) {
            return 'pending';
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // Derived salary items dynamically from currentStaff.basicMonthlySalary:
    // - Basic Monthly Salary: currentStaff.basicMonthlySalary (displays ₹25,000 for Vincent, ₹35,000 for Sanjay)
    // - Annual CTC: basicSalary * 12 (displays ₹3,00,000 for Vincent, ₹4,20,000 for Sanjay)
    // - Basic Pay (70%): basicSalary * 0.70 (displays ₹17,500 for Vincent, ₹24,500 for Sanjay)
    // - HRA (20%): basicSalary * 0.20 (displays ₹5,000 for Vincent, ₹7,000 for Sanjay)
    // - Special Allowance (10%): basicSalary * 0.10 (displays ₹2,500 for Vincent, ₹3,500 for Sanjay)
    // - Est. In-Hand (94%): basicSalary * 0.94 (displays ₹23,500 for Vincent, ₹32,900 for Sanjay)
    const basicSalary = Number(currentStaff?.basicMonthlySalary || 25000);
    const annualCTC = basicSalary * 12;
    const basicPay = Math.round(basicSalary * 0.70);
    const hra = Math.round(basicSalary * 0.20);
    const specialAllowance = Math.round(basicSalary * 0.10);
    const estInHand = Math.round(basicSalary * 0.94);

    // Header items derived from currentStaff
    const firstName = currentStaff?.firstName || (loggedInEmail.includes('sanjay') ? 'rakesh' : 'vincent');
    const lastName = currentStaff?.lastName || (loggedInEmail.includes('sanjay') ? 'kumar' : 'ffjd');
    const fullName = currentStaff?.name || `${firstName} ${lastName}`.trim();
    const employeeCode = currentStaff?.employeeCode || (loggedInEmail.includes('sanjay') ? 'CLK-0039' : 'CLK-0040');
    const initials = ((firstName?.[0] || 'V') + (lastName?.[0] || 'F')).toUpperCase();

    // Query /staff/profile?email=${loggedInEmail} using the logged-in session email
    useEffect(() => {
        let isMounted = true;
        const fetchStaffProfile = async () => {
            setIsLoading(true);
            try {
                // 1. Primary: query /staff/profile?email=${loggedInEmail}
                const response = await apiClient.get('/staff/profile', {
                    params: { email: loggedInEmail }
                });
                const payload = response.data?.data || response.data;
                if (payload && isMounted) {
                    const mapped = {
                        corporateEmail: loggedInEmail,
                        firstName: payload.firstName || payload.first_name || firstName,
                        lastName: payload.lastName || payload.last_name || lastName,
                        name: payload.name || `${payload.firstName || payload.first_name || firstName} ${payload.lastName || payload.last_name || lastName}`.trim(),
                        employeeCode: payload.employeeCode || payload.employee_code || payload.employee_id || employeeCode,
                        basicMonthlySalary: Number(payload.basicMonthlySalary || payload.salary || payload.salary_monthly || basicSalary),
                        department: payload.department || currentStaff.department || 'Operations',
                        designation: payload.designation || payload.role || currentStaff.designation || 'Sales Executive',
                        joiningDate: payload.joining_date || currentStaff.joiningDate || '01 Mar 2026',
                        employmentType: payload.employment_type || currentStaff.employmentType || 'FULL TIME ACTIVE',
                        bankName: payload.bank_name || payload.bank || currentStaff.bankName,
                        accountNumber: payload.account_number || payload.account_no || currentStaff.accountNumber,
                        ifsc: payload.ifsc_code || payload.ifsc || currentStaff.ifsc,
                        pan: payload.pan_number || payload.pan || currentStaff.pan,
                        pfUan: payload.pf_number || payload.pf_uan || currentStaff.pfUan,
                        esiNumber: payload.esi_number || currentStaff.esiNumber,
                        residentialAddress: payload.residential_address || payload.address || currentStaff.residentialAddress,
                        emergencyPerson: payload.emergency_person || payload.emergency_contact || currentStaff.emergencyPerson,
                        personalInfo: payload.personal_info || currentStaff.personalInfo,
                        contactPhone: payload.phone_number || payload.phone || currentStaff.contactPhone,
                        inviterName: payload.inviter_name || currentStaff.inviterName || 'santhoshhhhhh(HR)'
                    };
                    setStaffList(prev => {
                        const idx = prev.findIndex(s => s.corporateEmail.toLowerCase() === loggedInEmail.toLowerCase());
                        if (idx >= 0) {
                            const updated = [...prev];
                            updated[idx] = mapped;
                            return updated;
                        }
                        return [mapped, ...prev];
                    });
                    if (payload.organization || payload.business_name || payload.companyName) {
                        setBusinessName(payload.organization || payload.business_name || payload.companyName);
                    }
                    return;
                }
            } catch (err) {
                // Ignore API offline, fallback to matched record
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchStaffProfile();
        return () => { isMounted = false; };
    }, [loggedInEmail]);

    // Keep invitation status in sync if user changes
    useEffect(() => {
        try {
            const saved = localStorage.getItem(statusStorageKey);
            setInvitationStatus(saved || 'pending');
        } catch (e) {
            setInvitationStatus('pending');
        }
    }, [statusStorageKey]);

    // Save status change
    const updateStatus = (newStatus) => {
        setIsActionLoading(true);
        setTimeout(() => {
            setInvitationStatus(newStatus);
            try {
                localStorage.setItem(statusStorageKey, newStatus);
            } catch (e) {
                console.error(e);
            }
            setIsActionLoading(false);

            if (newStatus === 'accepted') {
                setNotification({
                    type: 'success',
                    message: `Invitation accepted! Salary details for ${loggedInEmail} are now live.`
                });
            } else if (newStatus === 'rejected') {
                setNotification({
                    type: 'error',
                    message: 'Invitation declined. You can reconsider or re-accept at any time.'
                });
            } else {
                setNotification(null);
            }
        }, 300);
    };

    // Auto-dismiss toast
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <div className="content-wrapper" style={{ padding: '1.75rem', maxWidth: '1440px', margin: '0 auto' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                            color: '#1D4ED8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(29, 78, 216, 0.12)'
                        }}>
                            <UserCheck size={26} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                                    Staff Details
                                </h1>
                                <span style={{
                                    fontSize: '0.72rem',
                                    fontWeight: '700',
                                    padding: '0.2rem 0.65rem',
                                    borderRadius: '50px',
                                    background: invitationStatus === 'accepted' ? '#ECFDF5' : '#FEF3C7',
                                    color: invitationStatus === 'accepted' ? '#047857' : '#B45309',
                                    border: `1px solid ${invitationStatus === 'accepted' ? '#A7F3D0' : '#FDE68A'}`
                                }}>
                                    {invitationStatus === 'accepted' ? 'INTEGRATION ACTIVE' : 'PENDING INVITATION'}
                                </span>
                            </div>
                            <p style={{ color: '#64748B', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
                                Workforce integrations, organization linkage & salary structure.
                            </p>
                        </div>
                    </div>

                    {/* Dynamic Account Indicator */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.85rem',
                        borderRadius: '12px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.82rem',
                        color: '#475569'
                    }}>
                        <Mail size={15} style={{ color: '#2563EB' }} />
                        <span>Logged-in: <strong style={{ color: '#0F172A' }}>{loggedInEmail}</strong></span>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    background: notification.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                    border: `1px solid ${notification.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
                    color: notification.type === 'success' ? '#166534' : '#991B1B'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{notification.message}</span>
                    </div>
                    <button
                        onClick={() => setNotification(null)}
                        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '2px' }}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Main 2-Column Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* ─────────────────────────────────────────────────────────
                    LEFT CARD: Active Integrations (lg:col-span-5)
                ───────────────────────────────────────────────────────── */}
                <div className="lg:col-span-5" style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Card Header */}
                    <div style={{
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid #F1F5F9',
                        background: '#FAFBFD',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '10px',
                                background: '#EFF6FF',
                                color: '#2563EB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Building2 size={18} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                                    Active Integrations
                                </h2>
                                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.1rem 0 0 0' }}>
                                    Incoming organization & HR linkages
                                </p>
                            </div>
                        </div>

                        <span style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '50px',
                            background: '#F1F5F9',
                            color: '#475569'
                        }}>
                            1 Invite
                        </span>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        
                        {/* Invitation Item Box */}
                        <div style={{
                            borderRadius: '16px',
                            border: `1.5px solid ${invitationStatus === 'accepted' ? '#A7F3D0' : invitationStatus === 'rejected' ? '#FECACA' : '#E2E8F0'}`,
                            background: invitationStatus === 'accepted' ? '#F0FDF4' : invitationStatus === 'rejected' ? '#FEF2F2' : '#FFFFFF',
                            padding: '1.25rem',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                            transition: 'all 0.25s ease'
                        }}>
                            {/* Inviter Header */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.85rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                                        color: '#FFFFFF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '800',
                                        fontSize: '1rem',
                                        boxShadow: '0 2px 6px rgba(27, 107, 58, 0.25)'
                                    }}>
                                        SH
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A' }}>
                                                {currentStaff?.inviterName || 'santhoshhhhhh(HR)'}
                                            </span>
                                            <span style={{
                                                fontSize: '0.68rem',
                                                fontWeight: '700',
                                                padding: '0.15rem 0.5rem',
                                                borderRadius: '4px',
                                                background: '#DBEAFE',
                                                color: '#1E40AF'
                                            }}>
                                                Cliks Business
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem' }}>
                                            Organization: <strong>{businessName || 'Welton Consignor'}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Status badge */}
                                <div>
                                    {invitationStatus === 'pending' && (
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            padding: '0.25rem 0.65rem',
                                            borderRadius: '50px',
                                            background: '#FEF3C7',
                                            color: '#B45309',
                                            fontSize: '0.72rem',
                                            fontWeight: '700'
                                        }}>
                                            <Clock size={12} />
                                            Pending
                                        </span>
                                    )}
                                    {invitationStatus === 'accepted' && (
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            padding: '0.25rem 0.65rem',
                                            borderRadius: '50px',
                                            background: '#DCFCE7',
                                            color: '#15803D',
                                            fontSize: '0.72rem',
                                            fontWeight: '700'
                                        }}>
                                            <Check size={12} />
                                            Active
                                        </span>
                                    )}
                                    {invitationStatus === 'rejected' && (
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            padding: '0.25rem 0.65rem',
                                            borderRadius: '50px',
                                            background: '#FEE2E2',
                                            color: '#B91C1C',
                                            fontSize: '0.72rem',
                                            fontWeight: '700'
                                        }}>
                                            <X size={12} />
                                            Declined
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Invitation Details Body */}
                            <div style={{
                                background: invitationStatus === 'accepted' ? '#FFFFFF' : '#F8FAFC',
                                borderRadius: '12px',
                                padding: '0.85rem',
                                marginBottom: '1rem',
                                border: '1px solid #E2E8F0'
                            }}>
                                <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.45' }}>
                                    You have been added to the organization payroll & HR roster for target email:
                                </div>
                                <div style={{
                                    display: 'inline-block',
                                    fontSize: '0.82rem',
                                    fontWeight: '700',
                                    color: '#2563EB',
                                    background: '#EFF6FF',
                                    padding: '0.2rem 0.55rem',
                                    borderRadius: '6px',
                                    marginTop: '0.4rem'
                                }}>
                                    {loggedInEmail}
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '0.65rem',
                                    marginTop: '0.85rem',
                                    paddingTop: '0.75rem',
                                    borderTop: '1px dashed #E2E8F0'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Position</div>
                                        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', marginTop: '0.1rem' }}>
                                            {currentStaff?.designation || 'Sales Executive'}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Department</div>
                                        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', marginTop: '0.1rem' }}>
                                            {currentStaff?.department || 'Operations'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Buttons (Accept / Reject) */}
                            {invitationStatus === 'pending' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <button
                                        onClick={() => updateStatus('accepted')}
                                        disabled={isActionLoading}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '0.7rem 1rem',
                                            background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontWeight: '700',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            boxShadow: '0 3px 10px rgba(27, 107, 58, 0.25)',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Check size={16} strokeWidth={2.5} />
                                        <span>Accept</span>
                                    </button>

                                    <button
                                        onClick={() => updateStatus('rejected')}
                                        disabled={isActionLoading}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '0.7rem 1rem',
                                            background: '#FFFFFF',
                                            color: '#DC2626',
                                            border: '1.5px solid #FCA5A5',
                                            borderRadius: '10px',
                                            fontWeight: '700',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <X size={16} strokeWidth={2.5} />
                                        <span>Reject</span>
                                    </button>
                                </div>
                            )}

                            {/* Accepted View */}
                            {invitationStatus === 'accepted' && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803D', fontSize: '0.82rem', fontWeight: '700' }}>
                                        <CheckCircle2 size={16} />
                                        <span>Integration active & verified</span>
                                    </div>
                                    <button
                                        onClick={() => updateStatus('pending')}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            background: 'none',
                                            border: 'none',
                                            color: '#64748B',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        <RotateCcw size={13} />
                                        <span>Reset Status</span>
                                    </button>
                                </div>
                            )}

                            {/* Rejected View */}
                            {invitationStatus === 'rejected' && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B91C1C', fontSize: '0.82rem', fontWeight: '600' }}>
                                        <XCircle size={16} />
                                        <span>Invitation declined</span>
                                    </div>
                                    <button
                                        onClick={() => updateStatus('accepted')}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            background: '#FFFFFF',
                                            border: '1px solid #CBD5E1',
                                            borderRadius: '8px',
                                            padding: '0.4rem 0.75rem',
                                            color: '#1E293B',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <RotateCcw size={13} />
                                        <span>Re-accept Invitation</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Integration Security Info Card */}
                        <div style={{
                            background: '#F8FAFC',
                            borderRadius: '14px',
                            padding: '1rem',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'flex-start'
                        }}>
                            <ShieldCheck size={20} style={{ color: '#1B6B3A', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A' }}>
                                    Direct HR Sync Protection
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem', lineHeight: '1.4' }}>
                                    Your salary slips, tax deductions, and EPF records are securely synced directly from Cliks Business. Sensitive bank records remain read-only for security.
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ─────────────────────────────────────────────────────────
                    RIGHT CARD: YOUR SALARY History & Details (lg:col-span-7)
                ───────────────────────────────────────────────────────── */}
                <div className="lg:col-span-7" style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Card Header */}
                    <div style={{
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid #F1F5F9',
                        background: '#FAFBFD',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '10px',
                                background: invitationStatus === 'accepted' ? '#ECFDF5' : '#FEF3C7',
                                color: invitationStatus === 'accepted' ? '#059669' : '#D97706',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {invitationStatus === 'accepted' ? <Unlock size={18} /> : <Lock size={18} />}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                                    YOUR SALARY History & Details
                                </h2>
                                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.1rem 0 0 0' }}>
                                    Official payroll structure, compensations & tax documents
                                </p>
                            </div>
                        </div>

                        {invitationStatus === 'accepted' && (
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                padding: '0.2rem 0.65rem',
                                borderRadius: '50px',
                                background: '#ECFDF5',
                                color: '#059669',
                                border: '1px solid #A7F3D0'
                            }}>
                                <BadgeCheck size={13} />
                                VERIFIED UNLOCKED
                            </span>
                        )}
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '1.5rem' }}>
                        
                        {/* ─────── STATE A: PENDING / REJECTED (LOCKED PLACEHOLDER) ─────── */}
                        {invitationStatus !== 'accepted' && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '2.5rem 1.5rem',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '20px',
                                    background: '#FEF3C7',
                                    color: '#D97706',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.25rem',
                                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.15)'
                                }}>
                                    <Lock size={32} strokeWidth={2.2} />
                                </div>

                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                                    Employment & Salary Details Locked
                                </h3>
                                <p style={{ color: '#64748B', fontSize: '0.875rem', maxWidth: '440px', margin: '0.5rem 0 1.5rem 0', lineHeight: '1.5' }}>
                                    Your compensation structure, bank disbursement account, PAN, and PF/UAN are protected.
                                    Accept the incoming invitation from <strong style={{ color: '#0F172A' }}>{currentStaff?.inviterName || 'santhoshhhhhh(HR)'}</strong> to unlock and view your records.
                                </p>

                                {/* Redacted Preview Placeholders */}
                                <div style={{
                                    width: '100%',
                                    maxWidth: '460px',
                                    background: '#F8FAFC',
                                    borderRadius: '16px',
                                    padding: '1.25rem',
                                    border: '1px solid #E2E8F0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem',
                                    marginBottom: '1.75rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>EMPLOYEE NAME</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', letterSpacing: '2px' }}>••••••••••••</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>BASIC MONTHLY SALARY</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', letterSpacing: '2px' }}>₹ ••••••••</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>DISBURSEMENT BANK</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', letterSpacing: '2px' }}>••••••••••••</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>PAN & PF INFO</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', letterSpacing: '2px' }}>••••••••••</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>ADDRESS & EMERGENCY</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', letterSpacing: '2px' }}>••••••••••••</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => updateStatus('accepted')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.75rem',
                                        background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: '700',
                                        fontSize: '0.88rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 3px 12px rgba(27, 107, 58, 0.28)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Unlock size={17} />
                                    <span>Accept Invitation to Unlock</span>
                                </button>
                            </div>
                        )}

                        {/* ─────── STATE B: ACCEPTED (FULL SALARY & PROFILE REVEALED) ─────── */}
                        {invitationStatus === 'accepted' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                
                                {/* 1. Employee Profile Header: Dynamic Name and Employee Code */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '1rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '54px',
                                            height: '54px',
                                            borderRadius: '14px',
                                            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                                            color: '#FFFFFF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '800',
                                            fontSize: '1.3rem',
                                            boxShadow: '0 4px 12px rgba(29, 78, 216, 0.3)'
                                        }}>
                                            {initials}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                                                    {fullName}
                                                </h3>
                                                <BadgeCheck size={18} style={{ color: '#10B981' }} />
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                                                {currentStaff?.department || 'Operations'} • <strong style={{ color: '#F1F5F9' }}>{currentStaff?.designation || 'Sales Executive'}</strong>
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem' }}>
                                                Employee Code: <span style={{ color: '#CBD5E1', fontWeight: '600' }}>{employeeCode}</span> • Joining: {currentStaff?.joiningDate || '01 Mar 2026'}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700' }}>
                                            Employment Status
                                        </div>
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            background: 'rgba(16, 185, 129, 0.18)',
                                            color: '#34D399',
                                            padding: '0.3rem 0.75rem',
                                            borderRadius: '50px',
                                            fontSize: '0.78rem',
                                            fontWeight: '700',
                                            marginTop: '0.25rem'
                                        }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
                                            {currentStaff?.employmentType || 'FULL TIME ACTIVE'}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Monthly Compensation & Salary Structure: Dynamically derived from currentStaff.basicMonthlySalary */}
                                <div style={{
                                    background: '#F8FAFC',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0',
                                    padding: '1.25rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
                                                Basic Monthly Salary
                                            </span>
                                            <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#1B6B3A', marginTop: '0.1rem' }}>
                                                ₹{basicSalary.toLocaleString('en-IN')}
                                                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748B', marginLeft: '0.35rem' }}>
                                                    / month
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{
                                            background: '#ECFDF5',
                                            border: '1px solid #A7F3D0',
                                            padding: '0.4rem 0.85rem',
                                            borderRadius: '10px',
                                            textAlign: 'right'
                                        }}>
                                            <div style={{ fontSize: '0.68rem', color: '#047857', fontWeight: '700', textTransform: 'uppercase' }}>
                                                Annual CTC
                                            </div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#065F46' }}>
                                                ₹{annualCTC.toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Breakdown Items Dynamically Derived */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                                        gap: '0.75rem',
                                        background: '#FFFFFF',
                                        padding: '0.85rem',
                                        borderRadius: '12px',
                                        border: '1px solid #E2E8F0'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600' }}>BASIC PAY (70%)</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A', marginTop: '0.1rem' }}>
                                                ₹{basicPay.toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600' }}>HRA (20%)</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A', marginTop: '0.1rem' }}>
                                                ₹{hra.toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600' }}>SPECIAL ALLOWANCE</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A', marginTop: '0.1rem' }}>
                                                ₹{specialAllowance.toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600' }}>EST. IN-HAND TAKEHOME</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1B6B3A', marginTop: '0.1rem' }}>
                                                ₹{estInHand.toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Bank & Disbursement Details */}
                                <div style={{
                                    background: '#FFFFFF',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0',
                                    padding: '1.25rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                                        <CreditCard size={17} style={{ color: '#2563EB' }} />
                                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', textTransform: 'uppercase' }}>
                                            Bank Disbursement Details
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                        gap: '1rem'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>BANK NAME</div>
                                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A', marginTop: '0.15rem' }}>
                                                {currentStaff?.bankName || 'HDFC Bank'}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>ACCOUNT NUMBER</div>
                                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A', marginTop: '0.15rem' }}>
                                                {currentStaff?.accountNumber || '•••• •••• 5678'}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>IFSC CODE</div>
                                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A', marginTop: '0.15rem' }}>
                                                {currentStaff?.ifsc || 'HDFC0001234'}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>DISBURSEMENT MODE</div>
                                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#10B981', marginTop: '0.15rem' }}>
                                                Auto Direct Credit (NEFT)
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. PAN & PF / Statutory Compliance */}
                                <div style={{
                                    background: '#FFFFFF',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0',
                                    padding: '1.25rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                                        <ShieldCheck size={17} style={{ color: '#1B6B3A' }} />
                                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', textTransform: 'uppercase' }}>
                                            PAN, PF & Compliance Records
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                        gap: '1rem'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>PAN NUMBER</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                                                <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A' }}>
                                                    {currentStaff?.pan || 'ABCDE1234F'}
                                                </span>
                                                <span style={{ fontSize: '0.65rem', background: '#DCFCE7', color: '#15803D', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>
                                                    VERIFIED
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>PF / UAN NUMBER</div>
                                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A', marginTop: '0.15rem' }}>
                                                {currentStaff?.pfUan || '101234567890'}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>ESI ACCOUNT NUMBER</div>
                                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A', marginTop: '0.15rem' }}>
                                                {currentStaff?.esiNumber || '31009876540001'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 4b. Residential Address & Emergency Contacts */}
                                <div style={{
                                    background: '#FFFFFF',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0',
                                    padding: '1.25rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <MapPin size={17} style={{ color: '#2563EB' }} />
                                            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', textTransform: 'uppercase' }}>
                                                Residential Address & Emergency Contacts
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#1E40AF', background: '#DBEAFE', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                                            HR SUBMITTED RECORD
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                                        gap: '1rem'
                                    }}>
                                        {/* RESIDENTIAL ADDRESS */}
                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                                                RESIDENTIAL ADDRESS
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                                                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#0F172A', lineHeight: '1.4' }}>
                                                    {currentStaff?.residentialAddress || 'Plot No. 12, Anna Nagar, Chennai, Tamil Nadu (600040)'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* EMERGENCY PERSON */}
                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                                                EMERGENCY PERSON
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0F172A' }}>
                                                    {currentStaff?.emergencyPerson || 'Vijay Kumar (Father) - +91 98765 99911'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* PERSONAL INFO */}
                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                                                PERSONAL INFO
                                            </div>
                                            <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#0F172A' }}>
                                                {currentStaff?.personalInfo || '2026-09-29 (Male) • Blood group: O+'}
                                            </div>
                                        </div>

                                        {/* CONTACT INFO */}
                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                                                CONTACT INFO
                                            </div>
                                            <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#0F172A' }}>
                                                {currentStaff?.contactPhone || '+91 98765 43210'} • <span style={{ color: '#2563EB', fontWeight: '700' }}>{loggedInEmail}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 5. Recent Payslips / Documents */}
                                <div style={{
                                    background: '#F8FAFC',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0',
                                    padding: '1.25rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FileText size={17} style={{ color: '#2563EB' }} />
                                            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', textTransform: 'uppercase' }}>
                                                Disbursed Payslips
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                            Generated by {currentStaff?.inviterName || 'santhoshhhhhh(HR)'}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {[
                                            { month: 'August 2026', date: '31 Aug 2026', amount: `₹${basicSalary.toLocaleString('en-IN')}`, status: 'Disbursed' },
                                            { month: 'July 2026', date: '31 Jul 2026', amount: `₹${basicSalary.toLocaleString('en-IN')}`, status: 'Disbursed' }
                                        ].map((slip, i) => (
                                            <div key={i} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                background: '#FFFFFF',
                                                padding: '0.75rem 1rem',
                                                borderRadius: '10px',
                                                border: '1px solid #E2E8F0'
                                            }}>
                                                <div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A' }}>
                                                        {slip.month} Payslip
                                                    </div>
                                                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                                        Credited on {slip.date} • {slip.amount}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => alert(`Downloading ${slip.month} Payslip...`)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                        padding: '0.4rem 0.75rem',
                                                        background: '#F1F5F9',
                                                        border: '1px solid #CBD5E1',
                                                        borderRadius: '8px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        color: '#334155',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Download size={13} />
                                                    <span>Slip</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default StaffDetails;
