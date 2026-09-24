import React, { useState, useMemo, useEffect } from 'react';
import { 
    Users, UserCheck, UserPlus, Search, Filter, Mail, Phone, 
    Briefcase, Building2, Calendar, IndianRupee, Trash2, Edit3, 
    X, CheckCircle2, AlertCircle, Eye, Download, RefreshCw,
    Shield, Clock, ArrowUpDown, ChevronDown, ChevronRight, User
} from 'lucide-react';
import { staffingService } from '../../services';

const INITIAL_STAFF = [
    {
        id: 'EMP-001',
        employee_code: 'CLK-101',
        first_name: 'Arun',
        last_name: 'Kumar',
        email: 'arun.kumar@cliks.io',
        phone: '+91 98765 43210',
        department: 'Finance & Accounts',
        designation: 'Senior Accountant',
        employment_type: 'Full Time',
        joining_date: '2024-02-15',
        salary: 65000,
        status: 'Active',
        emergency_contact: '+91 98765 11111'
    },
    {
        id: 'EMP-002',
        employee_code: 'CLK-102',
        first_name: 'Priya',
        last_name: 'Sharma',
        email: 'priya.sharma@cliks.io',
        phone: '+91 98765 43211',
        department: 'Operations',
        designation: 'Operations Lead',
        employment_type: 'Full Time',
        joining_date: '2024-03-01',
        salary: 75000,
        status: 'Active',
        emergency_contact: '+91 98765 22222'
    },
    {
        id: 'EMP-003',
        employee_code: 'CLK-103',
        first_name: 'Rohan',
        last_name: 'Verma',
        email: 'rohan.verma@cliks.io',
        phone: '+91 98765 43212',
        department: 'Engineering',
        designation: 'Frontend Engineer',
        employment_type: 'Full Time',
        joining_date: '2024-05-10',
        salary: 85000,
        status: 'Active',
        emergency_contact: '+91 98765 33333'
    },
    {
        id: 'EMP-004',
        employee_code: 'CLK-104',
        first_name: 'Ananya',
        last_name: 'Iyer',
        email: 'ananya.iyer@cliks.io',
        phone: '+91 98765 43213',
        department: 'Human Resources',
        designation: 'HR Coordinator',
        employment_type: 'Full Time',
        joining_date: '2024-06-01',
        salary: 55000,
        status: 'On Leave',
        emergency_contact: '+91 98765 44444'
    },
    {
        id: 'EMP-005',
        employee_code: 'CLK-105',
        first_name: 'Karthik',
        last_name: 'Rao',
        email: 'karthik.rao@cliks.io',
        phone: '+91 98765 43214',
        department: 'Sales & Marketing',
        designation: 'Sales Executive',
        employment_type: 'Contract',
        joining_date: '2024-07-15',
        salary: 45000,
        status: 'Active',
        emergency_contact: '+91 98765 55555'
    }
];

const DEPARTMENTS = [
    'All Departments',
    'Finance & Accounts',
    'Operations',
    'Engineering',
    'Human Resources',
    'Sales & Marketing',
    'Customer Support'
];

export const StaffDetails = () => {
    const [staffList, setStaffList] = useState(() => {
        try {
            const saved = localStorage.getItem('cliks_books_staff_details');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load local staff cache:', e);
        }
        return INITIAL_STAFF;
    });

    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedEmpType, setSelectedEmpType] = useState('All');
    const [sortBy, setSortBy] = useState('name-asc');

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [viewingStaff, setViewingStaff] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        employee_code: '',
        email: '',
        phone: '',
        department: 'Finance & Accounts',
        designation: '',
        employment_type: 'Full Time',
        joining_date: new Date().toISOString().split('T')[0],
        salary: '',
        status: 'Active',
        emergency_contact: ''
    });

    // Save to local storage whenever staffList updates
    useEffect(() => {
        try {
            localStorage.setItem('cliks_books_staff_details', JSON.stringify(staffList));
        } catch (e) {
            console.error('Failed to save staff details:', e);
        }
    }, [staffList]);

    // Fetch from backend service if available
    const fetchStaff = async () => {
        setIsLoading(true);
        try {
            const data = await staffingService.getEmployees();
            if (Array.isArray(data) && data.length > 0) {
                setStaffList(data);
            }
        } catch (e) {
            // Keep using local state fallback
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    // Form handlers
    const openAddModal = () => {
        setEditingStaff(null);
        setFormData({
            first_name: '',
            last_name: '',
            employee_code: `CLK-${Math.floor(100 + Math.random() * 900)}`,
            email: '',
            phone: '',
            department: 'Finance & Accounts',
            designation: '',
            employment_type: 'Full Time',
            joining_date: new Date().toISOString().split('T')[0],
            salary: '',
            status: 'Active',
            emergency_contact: ''
        });
        setIsAddModalOpen(true);
    };

    const openEditModal = (staff) => {
        setEditingStaff(staff);
        setFormData({
            first_name: staff.first_name || '',
            last_name: staff.last_name || '',
            employee_code: staff.employee_code || '',
            email: staff.email || '',
            phone: staff.phone || '',
            department: staff.department || 'Finance & Accounts',
            designation: staff.designation || '',
            employment_type: staff.employment_type || 'Full Time',
            joining_date: staff.joining_date || '',
            salary: staff.salary || '',
            status: staff.status || 'Active',
            emergency_contact: staff.emergency_contact || ''
        });
        setIsAddModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.first_name.trim() || !formData.email.trim()) {
            alert('Please provide first name and email.');
            return;
        }

        const payload = {
            ...formData,
            salary: Number(formData.salary) || 0
        };

        if (editingStaff) {
            // Edit existing
            const updated = staffList.map(item => 
                (item.id === editingStaff.id || item.employee_code === editingStaff.employee_code) 
                    ? { ...item, ...payload } 
                    : item
            );
            setStaffList(updated);
            try {
                await staffingService.updateEmployee(editingStaff.id, payload);
            } catch (err) {
                // Ignore backend failure, handled locally
            }
        } else {
            // Add new
            const newMember = {
                id: `EMP-${Date.now().toString().slice(-4)}`,
                ...payload
            };
            setStaffList([newMember, ...staffList]);
            try {
                await staffingService.createEmployee(newMember);
            } catch (err) {
                // Ignore backend failure, handled locally
            }
        }

        setIsAddModalOpen(false);
    };

    const handleDelete = async (staff) => {
        if (!window.confirm(`Are you sure you want to remove ${staff.first_name} ${staff.last_name}?`)) {
            return;
        }
        setStaffList(prev => prev.filter(item => item.id !== staff.id && item.employee_code !== staff.employee_code));
        try {
            await staffingService.deleteEmployee(staff.id);
        } catch (err) {
            // Ignore backend failure, handled locally
        }
    };

    // Filter & Sort
    const filteredStaff = useMemo(() => {
        return staffList.filter(staff => {
            const fullName = `${staff.first_name || ''} ${staff.last_name || ''}`.toLowerCase();
            const q = searchQuery.toLowerCase();
            const matchesQuery = !searchQuery || 
                fullName.includes(q) ||
                (staff.email && staff.email.toLowerCase().includes(q)) ||
                (staff.employee_code && staff.employee_code.toLowerCase().includes(q)) ||
                (staff.designation && staff.designation.toLowerCase().includes(q));

            const matchesDept = selectedDepartment === 'All Departments' || staff.department === selectedDepartment;
            const matchesStatus = selectedStatus === 'All' || staff.status === selectedStatus;
            const matchesType = selectedEmpType === 'All' || staff.employment_type === selectedEmpType;

            return matchesQuery && matchesDept && matchesStatus && matchesType;
        }).sort((a, b) => {
            if (sortBy === 'name-asc') {
                return (a.first_name || '').localeCompare(b.first_name || '');
            }
            if (sortBy === 'name-desc') {
                return (b.first_name || '').localeCompare(a.first_name || '');
            }
            if (sortBy === 'salary-desc') {
                return (b.salary || 0) - (a.salary || 0);
            }
            if (sortBy === 'salary-asc') {
                return (a.salary || 0) - (b.salary || 0);
            }
            if (sortBy === 'date-desc') {
                return new Date(b.joining_date || 0) - new Date(a.joining_date || 0);
            }
            return 0;
        });
    }, [staffList, searchQuery, selectedDepartment, selectedStatus, selectedEmpType, sortBy]);

    // Summary statistics
    const stats = useMemo(() => {
        const total = staffList.length;
        const active = staffList.filter(s => s.status === 'Active').length;
        const payroll = staffList.reduce((acc, s) => acc + (Number(s.salary) || 0), 0);
        const deptCount = new Set(staffList.map(s => s.department).filter(Boolean)).size;
        return { total, active, payroll, deptCount };
    }, [staffList]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const exportToCSV = () => {
        const headers = ['Employee ID,Employee Code,First Name,Last Name,Email,Phone,Department,Designation,Employment Type,Joining Date,Salary,Status'];
        const rows = staffList.map(s => [
            s.id,
            s.employee_code,
            `"${s.first_name || ''}"`,
            `"${s.last_name || ''}"`,
            `"${s.email || ''}"`,
            `"${s.phone || ''}"`,
            `"${s.department || ''}"`,
            `"${s.designation || ''}"`,
            `"${s.employment_type || ''}"`,
            s.joining_date || '',
            s.salary || 0,
            s.status || 'Active'
        ].join(','));

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `cliks_staff_details_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="content-wrapper" style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: '#EFF6FF',
                            color: '#2563EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1E293B', margin: 0, letterSpacing: '-0.02em' }}>
                                Staff Details
                            </h1>
                            <p style={{ color: '#64748B', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
                                Manage team members, roles, contact information, payroll details, and active records.
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                        onClick={exportToCSV}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1rem',
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '10px',
                            color: '#334155',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Download size={16} />
                        <span>Export CSV</span>
                    </button>

                    <button
                        onClick={fetchStaff}
                        disabled={isLoading}
                        title="Refresh"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '38px',
                            height: '38px',
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '10px',
                            color: '#334155',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    </button>

                    <button
                        onClick={openAddModal}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1.25rem',
                            background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#FFFFFF',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 3px 10px rgba(27,107,58,0.25)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <UserPlus size={18} />
                        <span>Add Staff Member</span>
                    </button>
                </div>
            </div>

            {/* Metric KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Total Staff
                        </div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginTop: '0.1rem' }}>
                            {stats.total}
                        </div>
                    </div>
                </div>

                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Active on Duty
                        </div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginTop: '0.1rem' }}>
                            {stats.active}
                        </div>
                    </div>
                </div>

                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IndianRupee size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Monthly Payroll
                        </div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginTop: '0.1rem' }}>
                            {formatCurrency(stats.payroll)}
                        </div>
                    </div>
                </div>

                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building2 size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Departments
                        </div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginTop: '0.1rem' }}>
                            {stats.deptCount}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 280px', minWidth: '240px', position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', color: '#94A3B8' }} />
                    <input
                        type="text"
                        placeholder="Search by name, role, email, code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 0.75rem 0.6rem 2.4rem',
                            borderRadius: '10px',
                            border: '1px solid #E2E8F0',
                            fontSize: '0.85rem',
                            color: '#1E293B',
                            background: '#F8FAFC',
                            outline: 'none'
                        }}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {/* Department Filter */}
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        style={{
                            padding: '0.55rem 0.85rem',
                            borderRadius: '10px',
                            border: '1px solid #E2E8F0',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            color: '#334155',
                            background: '#F8FAFC',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        {DEPARTMENTS.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        style={{
                            padding: '0.55rem 0.85rem',
                            borderRadius: '10px',
                            border: '1px solid #E2E8F0',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            color: '#334155',
                            background: '#F8FAFC',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                    </select>

                    {/* Employment Type */}
                    <select
                        value={selectedEmpType}
                        onChange={(e) => setSelectedEmpType(e.target.value)}
                        style={{
                            padding: '0.55rem 0.85rem',
                            borderRadius: '10px',
                            border: '1px solid #E2E8F0',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            color: '#334155',
                            background: '#F8FAFC',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        <option value="All">All Types</option>
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Contract">Contract</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: '0.55rem 0.85rem',
                            borderRadius: '10px',
                            border: '1px solid #E2E8F0',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            color: '#334155',
                            background: '#F8FAFC',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                        <option value="salary-desc">Highest Salary</option>
                        <option value="salary-asc">Lowest Salary</option>
                        <option value="date-desc">Newest Joining</option>
                    </select>
                </div>
            </div>

            {/* Staff Table */}
            <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Staff Member</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Department & Role</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contact Info</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Joining Date</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Salary</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStaff.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '4rem 1rem', textAlign: 'center', color: '#94A3B8' }}>
                                        <Users size={44} style={{ opacity: 0.35, marginBottom: '0.75rem', margin: '0 auto' }} />
                                        <div style={{ fontSize: '1.05rem', fontWeight: '600', color: '#475569' }}>No staff members found</div>
                                        <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                                            Try adjusting your search queries or add a new staff member.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredStaff.map((staff, idx) => {
                                    const fullName = `${staff.first_name || ''} ${staff.last_name || ''}`.trim() || 'Unnamed';
                                    const initials = ((staff.first_name?.[0] || '') + (staff.last_name?.[0] || '')).toUpperCase() || 'ST';
                                    const isLast = idx === filteredStaff.length - 1;

                                    return (
                                        <tr 
                                            key={staff.id || staff.employee_code || idx}
                                            style={{
                                                borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                                                transition: 'background-color 0.15s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            {/* Staff Member */}
                                            <td style={{ padding: '0.95rem 1.25rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        borderRadius: '10px',
                                                        background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
                                                        color: '#4338CA',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: '700',
                                                        fontSize: '0.85rem',
                                                        flexShrink: 0
                                                    }}>
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0F172A' }}>
                                                            {fullName}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                                                            <span style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '600' }}>
                                                                {staff.employee_code || staff.id}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{staff.employment_type || 'Full Time'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Department & Role */}
                                            <td style={{ padding: '0.95rem 1.25rem' }}>
                                                <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#1E293B' }}>
                                                    {staff.designation || 'Staff Role'}
                                                </div>
                                                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.1rem' }}>
                                                    {staff.department || 'General'}
                                                </div>
                                            </td>

                                            {/* Contact Info */}
                                            <td style={{ padding: '0.95rem 1.25rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                                    <a 
                                                        href={`mailto:${staff.email}`}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2563EB', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '500' }}
                                                    >
                                                        <Mail size={13} />
                                                        <span>{staff.email}</span>
                                                    </a>
                                                    {staff.phone && (
                                                        <a 
                                                            href={`tel:${staff.phone}`}
                                                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', textDecoration: 'none', fontSize: '0.78rem' }}
                                                        >
                                                            <Phone size={13} />
                                                            <span>{staff.phone}</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Joining Date */}
                                            <td style={{ padding: '0.95rem 1.25rem', fontSize: '0.85rem', color: '#475569', fontWeight: '500' }}>
                                                {staff.joining_date ? new Date(staff.joining_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                            </td>

                                            {/* Salary */}
                                            <td style={{ padding: '0.95rem 1.25rem', fontWeight: '700', fontSize: '0.9rem', color: '#0F172A' }}>
                                                {formatCurrency(staff.salary || 0)}
                                                <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '500', marginLeft: '0.25rem' }}>/mo</span>
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: '0.95rem 1.25rem' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    padding: '0.25rem 0.65rem',
                                                    borderRadius: '50px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    background: staff.status === 'Active' ? '#ECFDF5' : staff.status === 'On Leave' ? '#FEF3C7' : '#F1F5F9',
                                                    color: staff.status === 'Active' ? '#047857' : staff.status === 'On Leave' ? '#B45309' : '#475569',
                                                    border: `1px solid ${staff.status === 'Active' ? '#A7F3D0' : staff.status === 'On Leave' ? '#FDE68A' : '#E2E8F0'}`
                                                }}>
                                                    <span style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        background: staff.status === 'Active' ? '#10B981' : staff.status === 'On Leave' ? '#F59E0B' : '#94A3B8'
                                                    }} />
                                                    {staff.status || 'Active'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '0.95rem 1.25rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                                                    <button
                                                        onClick={() => setViewingStaff(staff)}
                                                        title="View Details"
                                                        style={{
                                                            background: '#F8FAFC',
                                                            border: '1px solid #E2E8F0',
                                                            borderRadius: '8px',
                                                            width: '32px',
                                                            height: '32px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#475569',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s'
                                                        }}
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(staff)}
                                                        title="Edit Staff Member"
                                                        style={{
                                                            background: '#F8FAFC',
                                                            border: '1px solid #E2E8F0',
                                                            borderRadius: '8px',
                                                            width: '32px',
                                                            height: '32px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#2563EB',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s'
                                                        }}
                                                    >
                                                        <Edit3 size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(staff)}
                                                        title="Remove Staff"
                                                        style={{
                                                            background: '#FEF2F2',
                                                            border: '1px solid #FEE2E2',
                                                            borderRadius: '8px',
                                                            width: '32px',
                                                            height: '32px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#DC2626',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s'
                                                        }}
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Staff Modal */}
            {isAddModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        width: '100%',
                        maxWidth: '560px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '1.75rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                                    {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                                </h2>
                                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                                    Fill in employee details for payroll, roles, and records.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        placeholder="e.g. Arun"
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        placeholder="e.g. Kumar"
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                        Employee Code / ID
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.employee_code}
                                        onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                                        placeholder="CLK-101"
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                        Department
                                    </label>
                                    <select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                                    >
                                        {DEPARTMENTS.filter(d => d !== 'All Departments').map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                        Designation / Role *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        placeholder="Senior Accountant"
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                        Employment Type
                                    </label>
                                    <select
                                        value={formData.employment_type}
                                        onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                                    >
                                        <option value="Full Time">Full Time</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="name@cliks.io"
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91 98765 43210"
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                        Joining Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.joining_date}
                                        onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                        Monthly Salary (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                        placeholder="65000"
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="On Leave">On Leave</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                        Emergency Contact
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.emergency_contact}
                                        onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                                        placeholder="+91 98765 00000"
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    style={{
                                        padding: '0.65rem 1.25rem',
                                        background: '#F1F5F9',
                                        border: 'none',
                                        borderRadius: '10px',
                                        color: '#475569',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '0.65rem 1.75rem',
                                        background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                                        border: 'none',
                                        borderRadius: '10px',
                                        color: '#FFFFFF',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(27,107,58,0.25)'
                                    }}
                                >
                                    {editingStaff ? 'Update Staff Member' : 'Save Staff Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Viewing Staff Profile Drawer / Modal */}
            {viewingStaff && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        width: '100%',
                        maxWidth: '520px',
                        padding: '2rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '54px',
                                    height: '54px',
                                    borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
                                    color: '#4338CA',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '800',
                                    fontSize: '1.2rem'
                                }}>
                                    {((viewingStaff.first_name?.[0] || '') + (viewingStaff.last_name?.[0] || '')).toUpperCase() || 'ST'}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0F172A' }}>
                                        {viewingStaff.first_name} {viewingStaff.last_name}
                                    </h3>
                                    <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
                                        {viewingStaff.designation} • {viewingStaff.department}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingStaff(null)}
                                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F8FAFC', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>EMPLOYEE CODE</div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1E293B', marginTop: '0.2rem' }}>{viewingStaff.employee_code || viewingStaff.id}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>STATUS</div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: viewingStaff.status === 'Active' ? '#059669' : '#D97706', marginTop: '0.2rem' }}>{viewingStaff.status}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>JOINING DATE</div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1E293B', marginTop: '0.2rem' }}>
                                    {viewingStaff.joining_date ? new Date(viewingStaff.joining_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>SALARY (MONTHLY)</div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1E293B', marginTop: '0.2rem' }}>{formatCurrency(viewingStaff.salary || 0)}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Mail size={16} style={{ color: '#64748B' }} />
                                <span style={{ fontSize: '0.875rem', color: '#1E293B', fontWeight: '500' }}>{viewingStaff.email}</span>
                            </div>
                            {viewingStaff.phone && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Phone size={16} style={{ color: '#64748B' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#1E293B', fontWeight: '500' }}>{viewingStaff.phone}</span>
                                </div>
                            )}
                            {viewingStaff.emergency_contact && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Shield size={16} style={{ color: '#64748B' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#64748B' }}>
                                        Emergency: <strong style={{ color: '#1E293B' }}>{viewingStaff.emergency_contact}</strong>
                                    </span>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                onClick={() => {
                                    const s = viewingStaff;
                                    setViewingStaff(null);
                                    openEditModal(s);
                                }}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    background: '#2563EB',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: '#FFFFFF',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Edit Record
                            </button>
                            <button
                                onClick={() => setViewingStaff(null)}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    background: '#F1F5F9',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: '#475569',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffDetails;
