import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Plus, 
    Search, 
    TrendingUp, 
    TrendingDown, 
    Building2, 
    Phone, 
    Mail, 
    X, 
    Trash2, 
    ChevronRight, 
    ArrowLeftRight, 
    Coins, 
    Calendar, 
    Bell, 
    MessageSquare, 
    CheckCircle2,
    Edit2,
    Pin,
    MoreVertical,
    Share2,
    Tag,
    Clock,
    Check,
    UserPlus,
    FolderKanban,
    ShieldCheck,
    Wallet,
    PieChart,
    Layers,
    AlertCircle,
    Lock
} from 'lucide-react';
import { peopleService } from '../services/peopleService';
import { settingsService } from '../services/settingsService';
import { profileService } from '../services/profileService';
import FilterableTableHead from '../components/FilterableTableHead';
import { applyTableFilters } from '../utils/filterUtils';
import '../App.css';
import { customConfirm } from '../utils/customConfirm';
import { useCurrency } from '../context';

const BusinessPeople = () => {
    const { currency, formatCurrency } = useCurrency();
    const [activeTab, setActiveTab] = useState('contacts'); // 'contacts', 'transactions', 'reminders'
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const queryClient = useQueryClient();

    // Modals states
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [selectedPersonId, setSelectedPersonId] = useState(null);
    const [editingContactId, setEditingContactId] = useState(null);
    const [editingTxId, setEditingTxId] = useState(null);
    const [editingRemId, setEditingRemId] = useState(null);

    // Customization Filters state
    const [groupFilter, setGroupFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [colFilters, setColFilters] = useState({});

    React.useEffect(() => {
        setColFilters({});
    }, [activeTab]);

    // Forms input states
    const [contactForm, setContactForm] = useState({ name: '', role_type: 'friend', phone: '', email: '', company: '', relationship: '', contact_info: '' });
    const [contactEmailError, setContactEmailError] = useState('');
    const [txForm, setTxForm] = useState({ person_id: '', type: 'lent', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
    const [reminderForm, setReminderForm] = useState({ person_id: '', title: '', amount: '', due_date: new Date().toISOString().split('T')[0], notes: '' });

    // Inline Transaction state inside popup
    const [isInlineTxOpen, setIsInlineTxOpen] = useState(false);
    const [inlineTxForm, setInlineTxForm] = useState({ type: 'lent', amount: '', date: new Date().toISOString().split('T')[0], description: '' });

    // Inline Reminder/Maturity state inside popup
    const [isInlineRemOpen, setIsInlineRemOpen] = useState(false);
    const [inlineRemForm, setInlineRemForm] = useState({ title: '', amount: '', due_date: new Date().toISOString().split('T')[0] });

    // Ledger search inside person detail modal
    const [ledgerSearchTerm, setLedgerSearchTerm] = useState('');
    const [showLedgerSearch, setShowLedgerSearch] = useState(false);

    const [pinnedPeopleIds, setPinnedPeopleIds] = useState(() => {
        const saved = localStorage.getItem('cliks_pinned_people');
        return saved ? JSON.parse(saved) : [];
    });
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Share Reminder Modal State
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareModalData, setShareModalData] = useState(null); // { person, balance }
    const [shareAmount, setShareAmount] = useState('');
    const [shareDate, setShareDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSubmittingAlert, setIsSubmittingAlert] = useState(false);

    // Financial Groups State
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [isAddGroupTxModalOpen, setIsAddGroupTxModalOpen] = useState(false);
    const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);
    const [groupActiveSubTab, setGroupActiveSubTab] = useState('balances');
    const [newGroupForm, setNewGroupForm] = useState({
        name: '',
        description: '',
        group_type: 'syndicate',
        target_amount: '',
        currency: 'INR',
        members: []
    });
    const [tempMemberInput, setTempMemberInput] = useState({ name: '', email: '', role: 'member' });
    const [tempMemberEmailError, setTempMemberEmailError] = useState('');
    const [groupTxForm, setGroupTxForm] = useState({
        type: 'expense',
        amount: '',
        title: '',
        category: 'General',
        notes: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [inviteMemberForm, setInviteMemberForm] = useState({ name: '', email: '', role: 'member' });
    const [inviteMemberEmailError, setInviteMemberEmailError] = useState('');
    const [privateNoteModalData, setPrivateNoteModalData] = useState(null);
    const [privateNoteForm, setPrivateNoteForm] = useState({ amount: '', notes: '' });

    React.useEffect(() => {
        if (shareModalData) {
            const verifiedBalance = Math.max(0, Math.abs(parseFloat(shareModalData.balance) || 0));
            setShareAmount(verifiedBalance.toString());
            setShareDate(new Date().toISOString().split('T')[0]);
        }
    }, [shareModalData]);

    // Fetch user profile for sending reminders
    const { data: userProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: profileService.getProfile,
    });

    React.useEffect(() => {
        const handleGlobalClick = () => setActiveMenuId(null);
        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, []);

    React.useEffect(() => {
        setIsInlineTxOpen(false);
        setIsInlineRemOpen(false);
        setEditingTxId(null);
        setLedgerSearchTerm('');
        setShowLedgerSearch(false);
        setInlineTxForm({ type: 'lent', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
        setInlineRemForm({ title: '', amount: '', due_date: new Date().toISOString().split('T')[0] });
    }, [selectedPersonId]);

    // Settings Configuration
    const { data: userSettings } = useQuery({
        queryKey: ['business-settings'],
        queryFn: settingsService.getSettings,
    });
    const activeConfig = userSettings?.data || userSettings || {};

    const getContactMeta = (contactInfo) => {
        try {
            if (contactInfo && (contactInfo.startsWith('{') || contactInfo.startsWith('['))) {
                return JSON.parse(contactInfo);
            }
        } catch {
            // fallback to default metadata
        }
        return {
            status: contactInfo === 'inactive' ? 'inactive' : 'active',
            loyalty_points: 0
        };
    };

    const serializeContactMeta = (status, loyaltyPoints) => {
        return JSON.stringify({
            status: status || 'active',
            loyalty_points: parseInt(loyaltyPoints) || 0
        });
    };

    // ── Queries ─────────────────────────────────────────────────────────────
    const { data: peopleRes = [], isLoading: isPeopleLoading } = useQuery({
        queryKey: ['people-list', searchTerm],
        queryFn: () => peopleService.getPeople({ search: searchTerm }),
    });

    // ── Incoming Connection Requests ─────────────────────────────────────────
    const { data: incomingRequests = [], refetch: refetchIncomingRequests } = useQuery({
        queryKey: ['people-incoming-requests'],
        queryFn: () => peopleService.getIncomingRequests(),
    });

    const respondRequestMutation = useMutation({
        mutationFn: ({ id, action }) => peopleService.respondToRequest(id, action),
        onSuccess: (res, variables) => {
            queryClient.invalidateQueries({ queryKey: ['people-incoming-requests'] });
            queryClient.invalidateQueries({ queryKey: ['people-list'] });
            alert(`Connection request ${variables.action === 'accept' ? 'accepted! Contact added to your network.' : 'declined.'}`);
        },
        onError: (err) => {
            const msg = err?.response?.data?.message || err?.message || 'Failed to respond to connection request.';
            alert(msg);
        }
    });

    // ── Financial Groups Queries & Mutations ─────────────────────────────────
    const { data: groupsList = [], isLoading: isGroupsLoading } = useQuery({
        queryKey: ['people-groups-list'],
        queryFn: () => peopleService.getGroups(),
    });

    const { data: groupIncomingRequests = [], refetch: refetchGroupIncomingRequests } = useQuery({
        queryKey: ['people-group-incoming-requests'],
        queryFn: () => peopleService.getGroupIncomingRequests(),
    });

    const { data: selectedGroupDetails, isLoading: isGroupDetailsLoading, refetch: refetchGroupDetails } = useQuery({
        queryKey: ['people-group-details', selectedGroupId],
        queryFn: () => peopleService.getGroupDetails(selectedGroupId),
        enabled: !!selectedGroupId
    });

    const createGroupMutation = useMutation({
        mutationFn: (data) => peopleService.createGroup(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['people-groups-list'] });
            setIsCreateGroupModalOpen(false);
            setNewGroupForm({ name: '', description: '', group_type: 'syndicate', target_amount: '', currency: 'INR', members: [] });
            setTempMemberInput({ name: '', email: '', role: 'member' });
            setTempMemberEmailError('');
            alert('Financial group created and invitations dispatched!');
        },
        onError: (err) => {
            alert(err?.response?.data?.message || err?.message || 'Failed to create financial group.');
        }
    });

    const respondGroupRequestMutation = useMutation({
        mutationFn: ({ membershipId, action }) => peopleService.respondToGroupRequest(membershipId, action),
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ['people-group-incoming-requests'] });
            queryClient.invalidateQueries({ queryKey: ['people-groups-list'] });
            alert(`Group invitation ${vars.action === 'accept' ? 'accepted! You now have access to the group ledger.' : 'declined.'}`);
        },
        onError: (err) => {
            alert(err?.response?.data?.message || err?.message || 'Failed to respond to group invitation.');
        }
    });

    const addGroupTxMutation = useMutation({
        mutationFn: (data) => peopleService.addGroupTransaction(selectedGroupId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['people-group-details', selectedGroupId] });
            queryClient.invalidateQueries({ queryKey: ['people-groups-list'] });
            setIsAddGroupTxModalOpen(false);
            setGroupTxForm({ type: 'expense', amount: '', title: '', category: 'General', notes: '', date: new Date().toISOString().split('T')[0] });
            alert('Transaction recorded in group ledger!');
        },
        onError: (err) => {
            alert(err?.response?.data?.message || err?.message || 'Failed to add transaction.');
        }
    });

    const inviteMemberMutation = useMutation({
        mutationFn: (data) => peopleService.inviteGroupMember(selectedGroupId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['people-group-details', selectedGroupId] });
            queryClient.invalidateQueries({ queryKey: ['people-groups-list'] });
            setIsInviteMemberModalOpen(false);
            setInviteMemberForm({ name: '', email: '', role: 'member' });
            setInviteMemberEmailError('');
            alert('Invitation sent to @bnxmail.com member!');
        },
        onError: (err) => {
            alert(err?.response?.data?.message || err?.message || 'Failed to invite member.');
        }
    });

    const deleteGroupMutation = useMutation({
        mutationFn: (groupId) => peopleService.deleteGroup(groupId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['people-groups-list'] });
            setSelectedGroupId(null);
            alert('Financial group deleted.');
        },
        onError: (err) => {
            alert(err?.response?.data?.message || err?.message || 'Failed to delete group.');
        }
    });

    const setPrivateNoteMutation = useMutation({
        mutationFn: ({ memberId, amount, notes }) => peopleService.setMemberPrivateNote(selectedGroupId, memberId, { amount, notes }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['people-group-details', selectedGroupId] });
            setPrivateNoteModalData(null);
            setPrivateNoteForm({ amount: '', notes: '' });
        },
        onError: (err) => {
            alert(err?.response?.data?.message || err?.message || 'Failed to save private note.');
        }
    });

    const deletePrivateNoteMutation = useMutation({
        mutationFn: (memberId) => peopleService.deleteMemberPrivateNote(selectedGroupId, memberId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['people-group-details', selectedGroupId] });
            setPrivateNoteModalData(null);
            setPrivateNoteForm({ amount: '', notes: '' });
        },
        onError: (err) => {
            alert(err?.response?.data?.message || err?.message || 'Failed to delete private note.');
        }
    });

    const { data: transactionsRes = [], isLoading: isTxLoading } = useQuery({
        queryKey: ['people-transactions-all'],
        queryFn: () => peopleService.getAllTransactions(),
    });

    const { data: remindersRes = [], isLoading: isRemindersLoading } = useQuery({
        queryKey: ['people-reminders-all'],
        queryFn: () => peopleService.getAllReminders(),
    });

    // ── Top-level person query detail hooks ─────────────────────────────────
    const { data: personDetails, isLoading: isPersonDetailLoading } = useQuery({
        queryKey: ['person-detail', selectedPersonId],
        queryFn: () => peopleService.getPersonById(selectedPersonId),
        enabled: !!selectedPersonId
    });

    const { data: personTx, isLoading: isPersonTxLoading } = useQuery({
        queryKey: ['person-transactions', selectedPersonId],
        queryFn: () => peopleService.getTransactions(selectedPersonId),
        enabled: !!selectedPersonId
    });

    const { data: personReminders, isLoading: isPersonRemLoading } = useQuery({
        queryKey: ['person-reminders', selectedPersonId],
        queryFn: () => peopleService.getReminders(selectedPersonId),
        enabled: !!selectedPersonId
    });

    const computedNetBalance = React.useMemo(() => {
        const txList = personTx?.data || personTx || [];
        if (!Array.isArray(txList) || txList.length === 0) {
            return parseFloat(personDetails?.net_balance || 0);
        }
        return txList.reduce((acc, curr) => {
            const amt = parseFloat(curr.amount || 0);
            return curr.type === 'lent' ? acc + amt : acc - amt;
        }, 0);
    }, [personTx, personDetails]);

    const people = useMemo(() => {
        const list = peopleRes.data || peopleRes || [];
        return [...list].sort((a, b) => {
            const aPinned = pinnedPeopleIds.includes(a.id);
            const bPinned = pinnedPeopleIds.includes(b.id);
            if (aPinned && !bPinned) return -1;
            if (!aPinned && bPinned) return 1;
            const dateA = new Date(a.updatedAt || a.updated_at || a.createdAt || a.created_at || a.date || 0).getTime();
            const dateB = new Date(b.updatedAt || b.updated_at || b.createdAt || b.created_at || b.date || 0).getTime();
            if (dateB !== dateA) return dateB - dateA;
            return (Number(b.id) || 0) - (Number(a.id) || 0);
        });
    }, [peopleRes, pinnedPeopleIds]);

    const transactions = useMemo(() => {
        const list = transactionsRes.data || transactionsRes || [];
        return [...list].sort((a, b) => {
            const dateA = new Date(a.date || a.execution_date || a.updatedAt || a.updated_at || a.createdAt || a.created_at || 0).getTime();
            const dateB = new Date(b.date || b.execution_date || b.updatedAt || b.updated_at || b.createdAt || b.created_at || 0).getTime();
            if (dateB !== dateA) return dateB - dateA;
            return (Number(b.id) || 0) - (Number(a.id) || 0);
        });
    }, [transactionsRes]);

    const reminders = remindersRes.data || remindersRes || [];

    const displayAlerts = useMemo(() => {
        const list = Array.isArray(reminders) ? [...reminders] : [];
        const seenIds = new Set();
        const seenComposite = new Set();
        const uniqueAlerts = [];

        for (const a of list) {
            if (!a) continue;

            const idKey = a.id !== undefined && a.id !== null ? String(a.id) : null;
            if (idKey && seenIds.has(idKey)) {
                continue;
            }

            const targetContact = String(a.target_contact || a.person_name || '').trim().toLowerCase();
            const memoLabel = String(a.memo_label || a.title || '').trim().toLowerCase();
            const rawCap = a.claim_cap !== undefined ? a.claim_cap : (a.amount !== undefined ? a.amount : 0);
            const claimCap = Number(rawCap) || 0;
            const rawDate = a.maturity_date || a.due_date || a.maturityDate || a.date || '';
            const maturityDate = String(rawDate).slice(0, 10);

            const compositeKey = `${targetContact}__${memoLabel}__${claimCap}__${maturityDate}`;
            if (seenComposite.has(compositeKey)) {
                continue;
            }

            if (idKey) seenIds.add(idKey);
            seenComposite.add(compositeKey);
            uniqueAlerts.push(a);
        }

        return uniqueAlerts.sort((a, b) => {
            const createdB = b.createdAt || b.created_at;
            const createdA = a.createdAt || a.created_at;
            if (createdB && createdA) {
                const diff = new Date(createdB).getTime() - new Date(createdA).getTime();
                if (diff !== 0) return diff;
            }
            const dateB = b.maturityDate || b.maturity_date || b.due_date || b.date;
            const dateA = a.maturityDate || a.maturity_date || a.due_date || a.date;
            if (dateB && dateA) {
                const diff = new Date(dateB).getTime() - new Date(dateA).getTime();
                if (diff !== 0) return diff;
            }
            return (Number(b.id) || 0) - (Number(a.id) || 0);
        });
    }, [reminders]);

    const summary = useMemo(() => {
        const totalContacts = people.length;

        // Build per-person transaction aggregations from ledger transactions
        const txByPerson = {};
        if (Array.isArray(transactions)) {
            transactions.forEach(tx => {
                const pid = String(tx.person_id || tx.contact_id || '');
                if (!pid) return;
                if (!txByPerson[pid]) txByPerson[pid] = { lent: 0, borrowed: 0 };
                const amt = parseFloat(tx.amount || 0);
                if (tx.type === 'lent') txByPerson[pid].lent += amt;
                else if (tx.type === 'borrowed') txByPerson[pid].borrowed += amt;
            });
        }

        let totalReceivables = 0;
        let totalReceivablesCollected = 0;
        let totalPayables = 0;
        let totalPayablesPaid = 0;

        const processedIds = new Set();
        (people || []).forEach(p => {
            const pid = String(p.id);
            processedIds.add(pid);

            let lent = parseFloat(p.total_lent || 0);
            let borrowed = parseFloat(p.total_borrowed || 0);

            if (txByPerson[pid]) {
                lent = Math.max(lent, txByPerson[pid].lent);
                borrowed = Math.max(borrowed, txByPerson[pid].borrowed);
            }

            // Fallback to net_balance if total_lent/total_borrowed not populated
            if (lent === 0 && borrowed === 0 && p.net_balance !== undefined) {
                const net = parseFloat(p.net_balance || 0);
                if (net > 0) lent = net;
                else if (net < 0) borrowed = Math.abs(net);
            }

            if (lent >= borrowed) {
                if (lent > 0) {
                    totalReceivables += lent;
                    totalReceivablesCollected += borrowed;
                }
            } else {
                if (borrowed > 0) {
                    totalPayables += borrowed;
                    totalPayablesPaid += lent;
                }
            }
        });

        // Account for any transactions for contacts not in people list
        Object.keys(txByPerson).forEach(pid => {
            if (!processedIds.has(pid)) {
                const { lent, borrowed } = txByPerson[pid];
                if (lent >= borrowed) {
                    if (lent > 0) {
                        totalReceivables += lent;
                        totalReceivablesCollected += borrowed;
                    }
                } else {
                    if (borrowed > 0) {
                        totalPayables += borrowed;
                        totalPayablesPaid += lent;
                    }
                }
            }
        });

        const outstandingReceivables = Math.max(0, totalReceivables - totalReceivablesCollected);
        const outstandingPayables = Math.max(0, totalPayables - totalPayablesPaid);

        return {
            totalContacts,
            totalReceivables,
            totalReceivablesCollected,
            outstandingReceivables,
            totalPayables,
            totalPayablesPaid,
            outstandingPayables
        };
    }, [people, transactions]);

    // ── Mutations ───────────────────────────────────────────────────────────
    const createContactMutation = useMutation({
        mutationFn: (data) => peopleService.createPerson(data),
        onSuccess: async (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['people-list'] });
            setIsContactModalOpen(false);
            setContactForm({ name: '', role_type: 'friend', phone: '', email: '', company: '', relationship: '', contact_info: '' });
            alert('Contact added and invitation request sent.');

            // Sync to BitTool Contact API
            try {
                const contactId = data.id || data._id || data.data?.id || data.data?._id;
                if (contactId) {
                    const bitToolData = {
                        name: variables.name || '',
                        email: variables.email || '',
                        phonenumber: variables.phone || '',
                        role: variables.role_type || '',
                        externalId: String(contactId)
                    };
                    
                    const bitToolUrl = import.meta.env.VITE_CONTACT_API_BASE_URL || 'https://api.bit-tool.com/api/contacts';
                    const token = localStorage.getItem('bnx_auth_token');
                    
                    const syncRes = await fetch(`${bitToolUrl}/add`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                        },
                        body: JSON.stringify(bitToolData)
                    });
                    
                    if (!syncRes.ok) {
                        console.error('Failed to sync contact with BitTool API', await syncRes.text());
                    }
                }
            } catch (err) {
                console.error("Error syncing contact with BitTool API", err);
            }
        },
        onError: (err) => {
            const errMsg = err?.response?.data?.message || err?.response?.data?.error?.message || err?.message || '';
            if (errMsg.toLowerCase().includes('bnxmail') || errMsg.toLowerCase().includes('email')) {
                setContactEmailError(errMsg || 'Only official @bnxmail.com domain emails are permitted.');
            } else {
                alert(errMsg || 'Failed to create contact.');
            }
        }
    });

    const updateContactMutation = useMutation({
        mutationFn: (variables) => peopleService.updatePerson(variables.id, variables.data),
        onSuccess: async (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['people-list'] });
            queryClient.invalidateQueries({ queryKey: ['person-detail', variables.id] });
            setIsContactModalOpen(false);
            setEditingContactId(null);
            setContactForm({ name: '', role_type: 'friend', phone: '', email: '', company: '', relationship: '', contact_info: '' });
            alert('Contact profile updated.');

            // Sync update to BitTool Contact API
            try {
                const bitToolData = {
                    name: variables.data.name || '',
                    email: variables.data.email || '',
                    phonenumber: variables.data.phone || '',
                    role: variables.data.role_type || ''
                };
                
                const bitToolUrl = import.meta.env.VITE_CONTACT_API_BASE_URL || 'https://api.bit-tool.com/api/contacts';
                const token = localStorage.getItem('bnx_auth_token');
                
                const syncRes = await fetch(`${bitToolUrl}/external/${variables.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify(bitToolData)
                });
                
                if (!syncRes.ok) {
                    console.error('Failed to sync updated contact with BitTool API', await syncRes.text());
                }
            } catch (err) {
                console.error("Error syncing updated contact with BitTool API", err);
            }
        }
    });

    const deleteContactMutation = useMutation({
        mutationFn: (id) => peopleService.deletePerson(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['people-list'] });
            alert('Contact deleted successfully.');
        }
    });

    const createTxMutation = useMutation({
        mutationFn: (data) => peopleService.createTransaction(data.person_id, data),
        onSuccess: (res, variables) => {
            const rawNew = res?.data?.data || res?.data || res || {};
            const nowIso = new Date().toISOString();
            const newRecord = {
                ...rawNew,
                person_id: variables.person_id,
                type: variables.type || rawNew.type,
                amount: variables.amount || rawNew.amount,
                date: variables.date || rawNew.date,
                description: variables.description || rawNew.description,
                person_name: people.find(p => String(p.id) === String(variables.person_id))?.name || rawNew.person_name || 'Contact',
                created_at: rawNew.created_at || nowIso,
                updated_at: rawNew.updated_at || nowIso
            };

            // Prepend newRecord to queryClient cache so it appears first immediately
            queryClient.setQueryData(['people-transactions-all'], (old) => {
                const oldList = Array.isArray(old) ? old : (old?.data || []);
                return [newRecord, ...oldList.filter(item => String(item.id) !== String(newRecord.id))];
            });

            if (variables.person_id) {
                queryClient.setQueryData(['person-transactions', variables.person_id], (old) => {
                    const oldList = Array.isArray(old) ? old : (old?.data || []);
                    return [newRecord, ...oldList.filter(item => String(item.id) !== String(newRecord.id))];
                });
            }

            // Bump contact's updated_at in cache so it immediately surfaces to top of contacts list
            queryClient.setQueryData(['people-list', searchTerm], (old) => {
                if (!old) return old;
                const oldList = Array.isArray(old) ? old : (old?.data || []);
                const target = oldList.find(p => String(p.id) === String(variables.person_id));
                if (!target) return old;
                const updatedPerson = {
                    ...target,
                    updated_at: nowIso,
                    updatedAt: nowIso
                };
                const rest = oldList.filter(p => String(p.id) !== String(variables.person_id));
                const nextList = [updatedPerson, ...rest];
                return Array.isArray(old) ? nextList : { ...old, data: nextList };
            });

            queryClient.invalidateQueries({ queryKey: ['people-transactions-all'] });
            queryClient.invalidateQueries({ queryKey: ['people-list'] });
            if (variables.person_id) {
                queryClient.invalidateQueries({ queryKey: ['person-transactions', variables.person_id] });
                queryClient.invalidateQueries({ queryKey: ['person-detail', variables.person_id] });
            }
            setIsTxModalOpen(false);
            setIsInlineTxOpen(false);
            setTxForm({ person_id: '', type: 'lent', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
            setInlineTxForm({ type: 'lent', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
            alert('Transaction logged successfully.');
        }
    });

    const updateTxMutation = useMutation({
        mutationFn: (data) => peopleService.updateTransaction(data.person_id, data.id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['people-transactions-all'] });
            queryClient.invalidateQueries({ queryKey: ['people-list'] });
            if (variables.person_id) {
                queryClient.invalidateQueries({ queryKey: ['person-transactions', variables.person_id] });
                queryClient.invalidateQueries({ queryKey: ['person-detail', variables.person_id] });
            }
            setIsInlineTxOpen(false);
            setEditingTxId(null);
            setInlineTxForm({ type: 'lent', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
            alert('Transaction updated successfully.');
        }
    });

    const deleteTxMutation = useMutation({
        mutationFn: (txn) => peopleService.deleteTransaction(txn.person_id, txn.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['people-transactions-all'] });
            queryClient.invalidateQueries({ queryKey: ['people-list'] });
            alert('Transaction removed.');
        }
    });

    const createReminderMutation = useMutation({
        mutationFn: (data) => peopleService.createReminder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['people-reminders-all'] });
            setIsReminderModalOpen(false);
            setReminderForm({ person_id: '', title: '', amount: '', due_date: new Date().toISOString().split('T')[0], notes: '' });
            alert('Repayment alert dispatched successfully.');
        },
        onSettled: () => {
            setIsSubmittingAlert(false);
        }
    });

    const updateReminderMutation = useMutation({
        mutationFn: (data) => peopleService.updateReminder(data.person_id, data.id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['people-reminders-all'] });
            queryClient.invalidateQueries({ queryKey: ['person-reminders', variables.person_id] });
            setIsInlineRemOpen(false);
            setEditingRemId(null);
            setInlineRemForm({ title: '', amount: '', due_date: new Date().toISOString().split('T')[0] });
            alert('Reminder updated successfully.');
        }
    });

    const deleteReminderMutation = useMutation({
        mutationFn: (rem) => peopleService.deleteReminder(rem.person_id, rem.id),
        onSuccess: (_, variables) => {
            queryClient.setQueryData(['people-reminders-all'], (old) => {
                if (!old) return old;
                if (old.data) {
                    return {
                        ...old,
                        data: old.data.filter(r => r.id !== variables.id)
                    };
                }
                return Array.isArray(old) ? old.filter(r => r.id !== variables.id) : old;
            });
            queryClient.setQueryData(['person-reminders', variables.person_id], (old) => {
                if (!old) return old;
                if (old.data) {
                    return {
                        ...old,
                        data: old.data.filter(r => r.id !== variables.id)
                    };
                }
                return Array.isArray(old) ? old.filter(r => r.id !== variables.id) : old;
            });
            queryClient.invalidateQueries({ queryKey: ['people-reminders-all'] });
            queryClient.invalidateQueries({ queryKey: ['person-reminders', variables.person_id] });
            alert('Reminder dismissed.');
        }
    });

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleSaveContact = (e) => {
        e.preventDefault();
        setContactEmailError('');

        // Strict BNXMAIL Validation
        const cleanEmail = contactForm.email ? contactForm.email.trim().toLowerCase() : '';
        if (!cleanEmail) {
            setContactEmailError('Email is required. Only official @bnxmail.com domain emails are accepted.');
            return;
        }

        const bnxmailRegex = /^[a-zA-Z0-9._%+-]+@bnxmail\.com$/i;
        if (!bnxmailRegex.test(cleanEmail)) {
            setContactEmailError('Only official @bnxmail.com domain emails are permitted.');
            return;
        }

        const myEmail = (userProfile?.email || '').trim().toLowerCase();
        if (myEmail && cleanEmail === myEmail) {
            setContactEmailError('You cannot add your own @bnxmail.com address as a contact.');
            return;
        }

        const exists = people.some(p => {
            if (editingContactId && String(p.id) === String(editingContactId)) return false;
            return p.email && p.email.trim().toLowerCase() === cleanEmail;
        });

        if (exists) {
            setContactEmailError('A contact with this email address already exists in your network.');
            return;
        }

        const meta = getContactMeta(contactForm.contact_info);
        const payload = {
            ...contactForm,
            email: cleanEmail,
            contact_info: serializeContactMeta(meta.status, 0)
        };
        if (editingContactId) {
            updateContactMutation.mutate({ id: editingContactId, data: payload });
        } else {
            createContactMutation.mutate(payload);
        }
    };

    const handleSendWhatsAppReminder = (person, balance) => {
        setShareModalData({ person, balance });
        setIsShareModalOpen(true);
    };

    const handleDeleteContact = async (id) => {
        if (await customConfirm('Are you sure you want to delete this contact and all associated transactions?')) {
            deleteContactMutation.mutate(id);
        }
    };

    const handleAmountChange = (e) => {
        let val = e.target.value;

        // Remove any character that is not a digit or decimal point
        val = val.replace(/[^0-9.]/g, '');

        // Prevent multiple decimal points
        const parts = val.split('.');
        if (parts.length > 2) {
            val = parts[0] + '.' + parts.slice(1).join('');
        }

        // Restrict integer part strictly to 12 digits
        let integerPart = parts[0] || '';
        if (integerPart.length > 12) {
            integerPart = integerPart.slice(0, 12);
        }

        // Restrict decimal part to 2 digits (if entered)
        let decimalPart = parts[1] !== undefined ? '.' + parts[1].slice(0, 2) : '';

        const finalValue = integerPart + decimalPart;

        setTxForm(prev => ({
            ...prev,
            amount: finalValue
        }));
    };

    const handleInlineTxAmountChange = (e) => {
        let val = e.target.value;

        val = val.replace(/[^0-9.]/g, '');

        const parts = val.split('.');
        if (parts.length > 2) {
            val = parts[0] + '.' + parts.slice(1).join('');
        }

        let integerPart = parts[0] || '';
        if (integerPart.length > 12) {
            integerPart = integerPart.slice(0, 12);
        }

        let decimalPart = parts[1] !== undefined ? '.' + parts[1].slice(0, 2) : '';

        const finalValue = integerPart + decimalPart;

        setInlineTxForm(prev => ({
            ...prev,
            amount: finalValue
        }));
    };

    const handleSaveTx = (e) => {
        e.preventDefault();
        if (!txForm.person_id) return alert('Please select a contact.');
        createTxMutation.mutate(txForm);
    };

    const handleSaveInlineTx = (e) => {
        e.preventDefault();
        if (!selectedPersonId) return alert('Target registry contact missing.');
        if (editingTxId) {
            updateTxMutation.mutate({ ...inlineTxForm, person_id: selectedPersonId, id: editingTxId });
        } else {
            createTxMutation.mutate({ ...inlineTxForm, person_id: selectedPersonId });
        }
    };

    const handleSaveInlineRem = (e) => {
        e.preventDefault();
        if (!selectedPersonId) return alert('Target registry contact missing.');
        
        if (inlineRemForm.amount !== undefined && inlineRemForm.amount !== null && inlineRemForm.amount !== '') {
            const parsed = Number(inlineRemForm.amount);
            if (isNaN(parsed) || parsed < 0) {
                return alert('Claim Cap must be a valid number greater than or equal to 0.');
            }
        }
        
        if (editingRemId) {
            updateReminderMutation.mutate(
                { ...inlineRemForm, person_id: selectedPersonId, id: editingRemId }
            );
        } else {
            createReminderMutation.mutate(
                { ...inlineRemForm, person_id: selectedPersonId },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ['person-reminders', selectedPersonId] });
                        setIsInlineRemOpen(false);
                        setInlineRemForm({ title: '', amount: '', due_date: new Date().toISOString().split('T')[0] });
                    }
                }
            );
        }
    };

    const handleSaveReminder = (e) => {
        e.preventDefault();
        if (isSubmittingAlert || createReminderMutation.isPending) return;
        if (!reminderForm.person_id) return alert('Please select a target contact.');
        if (!reminderForm.due_date) return alert('Please select a maturity / due date.');

        let amt = 0;
        if (reminderForm.amount !== undefined && reminderForm.amount !== null && reminderForm.amount !== '') {
            amt = Number(reminderForm.amount);
            if (isNaN(amt) || amt < 0) {
                return alert('Claim Cap must be a valid number greater than or equal to 0.');
            }
        }

        const selectedPerson = people.find(p => String(p.id) === String(reminderForm.person_id));

        const payload = {
            contact_id: reminderForm.person_id,
            person_id: reminderForm.person_id,
            target_contact: selectedPerson ? selectedPerson.name : 'Contact',
            person_name: selectedPerson ? selectedPerson.name : 'Contact',
            contact_phone: selectedPerson ? selectedPerson.phone : '',
            maturity_date: reminderForm.due_date,
            due_date: reminderForm.due_date,
            memo_label: reminderForm.title || 'Repayment Alert',
            title: reminderForm.title || 'Repayment Alert',
            claim_cap: amt,
            amount: amt,
            status: 'Pending'
        };

        setIsSubmittingAlert(true);
        createReminderMutation.mutate(payload);
    };

    const renderAvatar = (name, size = 42) => {
        const firstLetter = (name || '?').trim().charAt(0).toUpperCase();
        let hash = 0;
        const str = name || '';
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hues = [145, 195, 220, 260, 310, 340, 25, 55];
        const hue = hues[Math.abs(hash) % hues.length];
        return (
            <div style={{ 
                width: `${size}px`, 
                height: `${size}px`, 
                borderRadius: size > 50 ? '24px' : '12px', 
                background: `hsl(${hue}, 75%, 93%)`, 
                color: `hsl(${hue}, 75%, 32%)`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: '900', 
                fontSize: `${size * 0.45}px`,
                fontFamily: "'Outfit', 'Inter', sans-serif",
                flexShrink: 0
            }}>
                {firstLetter}
            </div>
        );
    };

    const formatCurr = (val) => {
        return formatCurrency(val);
    };

    const uniqueGroups = useMemo(() => {
        const groups = new Set(['Family', 'Friends', 'Clients', 'Vendors', 'Staff']);
        people.forEach(p => {
            if (p.relationship) groups.add(p.relationship);
        });
        return Array.from(groups);
    }, [people]);

    const filteredPeople = useMemo(() => {
        return people.filter(p => {
            const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (p.company || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGroup = groupFilter === 'All' || p.relationship === groupFilter;
            const meta = getContactMeta(p.contact_info);
            const matchesStatus = statusFilter === 'All' || meta.status === statusFilter;
            return matchesSearch && matchesGroup && matchesStatus;
        });
    }, [people, searchTerm, groupFilter, statusFilter]);

    const filteredTx = useMemo(() => {
        return transactions
            .filter(t =>
                (t.person_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.description || '').toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const dateA = new Date(a.date || a.execution_date || a.updatedAt || a.updated_at || a.createdAt || a.created_at || 0).getTime();
                const dateB = new Date(b.date || b.execution_date || b.updatedAt || b.updated_at || b.createdAt || b.created_at || 0).getTime();
                if (dateB !== dateA) return dateB - dateA;
                return (Number(b.id) || 0) - (Number(a.id) || 0);
            });
    }, [transactions, searchTerm]);

    return (
        <div style={{ padding: '1.133rem 2.266rem', background: 'var(--bg-color, #F0F9F4)', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <div style={{ display: 'flex', flexShrink: 0, justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.042rem', flexWrap: 'wrap', gap: '0.68rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', marginBottom: '0.317rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(27, 107, 58, 0.2)' }}>
                            <Users size={22} />
                        </div>
                        <h1 style={{ fontSize: '1.812rem', fontWeight: '850', color: 'var(--text-main, #064E3B)', letterSpacing: '-0.02em' }}>People Network & Escrow</h1>
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.952rem', fontWeight: '500' }}>Track peer-to-peer relationships, log personal advances, track friendly loans, and set ledger alerts.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.68rem' }}>
                    <button 
                        data-tour="people-log-transaction"
                        onClick={() => setIsTxModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.453rem', padding: '0.544rem 0.906rem', borderRadius: '10px', background: 'white', fontSize: '0.77rem', whiteSpace: 'nowrap', color: '#1B6B3A', border: '1px solid #DCF2E4', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                    >
                        <ArrowLeftRight size={16} /> Log Transaction
                    </button>
                    <button 
                        data-tour="people-add-contact"
                        onClick={() => setIsContactModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.453rem', padding: '0.544rem 0.906rem', borderRadius: '10px', fontSize: '0.77rem', whiteSpace: 'nowrap', background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 20px rgba(27, 107, 58, 0.25)' }}
                    >
                        <Plus size={16} /> Add People Contact
                    </button>
                </div>
            </div>

            {/* Receivables & Payables Summary (Compact Minimized Strip matching reference) */}
            {(() => {
                const recPct = summary.totalReceivables > 0 ? Math.min(100, Math.round((summary.totalReceivablesCollected / summary.totalReceivables) * 100)) : 0;
                const payPct = summary.totalPayables > 0 ? Math.min(100, Math.round((summary.totalPayablesPaid / summary.totalPayables) * 100)) : 0;

                return (
                    <div
                        className="shrink-0 w-full"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '0.68rem',
                            marginBottom: '0.906rem',
                            maxWidth: '58rem'
                        }}
                    >
                        {/* Compact Receivables Card */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '12px',
                                border: '1px solid #E2E8F0',
                                padding: '0.68rem 0.906rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.68rem',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', minWidth: 0 }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: '#ECFDF5',
                                    color: '#059669',
                                    border: '1px solid #A7F3D0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <TrendingUp size={18} />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '0.616rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                                            To Receive
                                        </span>
                                        <span style={{ fontSize: '0.589rem', fontWeight: '800', color: '#047857', background: '#ECFDF5', border: '1px solid #D1FAE5', padding: '1px 6px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                                            {recPct}% Collected
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '1.042rem', fontWeight: '900', color: '#065F46', letterSpacing: '-0.02em', lineHeight: '1.2', marginTop: '2px' }}>
                                        {formatCurr(summary.outstandingReceivables)}
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', flexShrink: 0, borderLeft: '1px solid #F1F5F9', paddingLeft: '0.68rem' }}>
                                <div style={{ fontSize: '0.634rem', color: '#64748B', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    Total: <strong style={{ color: '#1E293B', fontWeight: '800' }}>{formatCurr(summary.totalReceivables)}</strong>
                                </div>
                                <div style={{ fontSize: '0.634rem', color: '#059669', fontWeight: '600', marginTop: '2px', whiteSpace: 'nowrap' }}>
                                    Received: <strong style={{ fontWeight: '800' }}>{formatCurr(summary.totalReceivablesCollected)}</strong>
                                </div>
                            </div>

                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#F1F5F9' }}>
                                <div data-tour="people-pay-icon" style={{
                                    height: '100%',
                                    width: `${recPct}%`,
                                    background: 'linear-gradient(90deg, #10B981, #059669)',
                                    transition: 'width 0.4s ease'
                                }} />
                            </div>
                        </div>

                        {/* Compact Payables Card */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '12px',
                                border: '1px solid #E2E8F0',
                                padding: '0.68rem 0.906rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.68rem',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', minWidth: 0 }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: '#FEF2F2',
                                    color: '#DC2626',
                                    border: '1px solid #FECACA',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <TrendingDown size={18} />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span data-tour="people-pay-heading" style={{ fontSize: '0.616rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                                            To Pay
                                        </span>
                                        <span style={{ fontSize: '0.589rem', fontWeight: '800', color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FEE2E2', padding: '1px 6px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                                            {payPct}% Settled
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '1.042rem', fontWeight: '900', color: '#991B1B', letterSpacing: '-0.02em', lineHeight: '1.2', marginTop: '2px' }}>
                                        {formatCurr(summary.outstandingPayables)}
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', flexShrink: 0, borderLeft: '1px solid #F1F5F9', paddingLeft: '0.68rem' }}>
                                <div style={{ fontSize: '0.634rem', color: '#64748B', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    Total: <strong style={{ color: '#1E293B', fontWeight: '800' }}>{formatCurr(summary.totalPayables)}</strong>
                                </div>
                                <div style={{ fontSize: '0.634rem', color: '#DC2626', fontWeight: '600', marginTop: '2px', whiteSpace: 'nowrap' }}>
                                    Paid: <strong style={{ fontWeight: '800' }}>{formatCurr(summary.totalPayablesPaid)}</strong>
                                </div>
                            </div>

                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#F1F5F9' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${payPct}%`,
                                    background: 'linear-gradient(90deg, #F87171, #DC2626)',
                                    transition: 'width 0.4s ease'
                                }} />
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Incoming Connection & Financial Group Requests Banner */}
            {((incomingRequests && incomingRequests.length > 0) || (groupIncomingRequests && groupIncomingRequests.length > 0)) && activeTab !== 'requests' && (
                <div style={{
                    marginBottom: '1.133rem',
                    padding: '1.133rem',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)',
                    border: '1.5px solid #BFDBFE',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.77rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.544rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <UserPlus size={18} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.861rem', fontWeight: '850', color: '#1E3A8A' }}>
                                    Pending Invitations ({((incomingRequests?.length || 0) + (groupIncomingRequests?.length || 0))})
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748B' }}>
                                    {incomingRequests.length > 0 ? `${incomingRequests.length} contact request(s)` : ''}
                                    {incomingRequests.length > 0 && groupIncomingRequests.length > 0 ? ' and ' : ''}
                                    {groupIncomingRequests.length > 0 ? `${groupIncomingRequests.length} financial group invitation(s)` : ''} sent to your @bnxmail.com address.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveTab('requests')}
                            style={{
                                border: 'none',
                                background: '#DBEAFE',
                                color: '#1E40AF',
                                padding: '0.317rem 0.77rem',
                                borderRadius: '999px',
                                fontSize: '0.68rem',
                                fontWeight: '800',
                                cursor: 'pointer'
                            }}
                        >
                            Review All ({((incomingRequests?.length || 0) + (groupIncomingRequests?.length || 0))})
                        </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.77rem' }}>
                        {/* Direct Contacts requests */}
                        {incomingRequests.slice(0, 2).map(req => (
                            <div key={`contact-${req.id}`} style={{
                                background: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '14px',
                                padding: '0.77rem 0.906rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.68rem',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', minWidth: 0 }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#004aad', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.77rem', flexShrink: 0 }}>
                                        {(req.requester_username || req.requester_business_name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ margin: 0, fontSize: '0.77rem', fontWeight: '800', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {req.requester_username || req.requester_business_name || 'Network Contact'}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Mail size={11} /> {req.requester_email}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.363rem', flexShrink: 0 }}>
                                    <button
                                        onClick={() => respondRequestMutation.mutate({ id: req.id, action: 'accept' })}
                                        disabled={respondRequestMutation.isPending}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            border: 'none',
                                            background: '#10B981',
                                            color: '#FFFFFF',
                                            padding: '0.408rem 0.68rem',
                                            borderRadius: '8px',
                                            fontSize: '0.68rem',
                                            fontWeight: '750',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Check size={13} /> Accept
                                    </button>
                                    <button
                                        onClick={() => respondRequestMutation.mutate({ id: req.id, action: 'reject' })}
                                        disabled={respondRequestMutation.isPending}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            border: '1px solid #E2E8F0',
                                            background: '#FFFFFF',
                                            color: '#EF4444',
                                            padding: '0.408rem 0.589rem',
                                            borderRadius: '8px',
                                            fontSize: '0.68rem',
                                            fontWeight: '700',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <X size={13} /> Decline
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Group invitations */}
                        {groupIncomingRequests.slice(0, 2).map(req => (
                            <div key={`group-${req.membership_id}`} style={{
                                background: '#FFFFFF',
                                border: '1.5px solid #E0E7FF',
                                borderRadius: '14px',
                                padding: '0.77rem 0.906rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.68rem',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', minWidth: 0 }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#4F46E5', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.77rem', flexShrink: 0 }}>
                                        <FolderKanban size={18} />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <p style={{ margin: 0, fontSize: '0.77rem', fontWeight: '800', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {req.group_name}
                                            </p>
                                            <span style={{ padding: '0.091rem 0.363rem', borderRadius: '4px', background: '#EEF2FF', color: '#4338CA', fontSize: '0.589rem', fontWeight: '800', textTransform: 'capitalize' }}>
                                                {req.group_type || 'Group'}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.652rem', color: '#64748B' }}>
                                            Invited by {req.inviter_business_name || req.inviter_username || req.inviter_email}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.363rem', flexShrink: 0 }}>
                                    <button
                                        onClick={() => respondGroupRequestMutation.mutate({ membershipId: req.membership_id, action: 'accept' })}
                                        disabled={respondGroupRequestMutation.isPending}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            border: 'none',
                                            background: '#4F46E5',
                                            color: '#FFFFFF',
                                            padding: '0.408rem 0.68rem',
                                            borderRadius: '8px',
                                            fontSize: '0.68rem',
                                            fontWeight: '750',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Check size={13} /> Join
                                    </button>
                                    <button
                                        onClick={() => respondGroupRequestMutation.mutate({ membershipId: req.membership_id, action: 'reject' })}
                                        disabled={respondGroupRequestMutation.isPending}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            border: '1px solid #E2E8F0',
                                            background: '#FFFFFF',
                                            color: '#EF4444',
                                            padding: '0.408rem 0.589rem',
                                            borderRadius: '8px',
                                            fontSize: '0.68rem',
                                            fontWeight: '700',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <X size={13} /> Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tabs Row & Global Tools */}
            <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.359rem', flexWrap: 'wrap', gap: '0.906rem' }}>
                <div style={{ display: 'flex', gap: '0.68rem', flexWrap: 'wrap' }}>
                    {[
                        { id: 'contacts', label: 'Contacts', icon: Users },
                        { id: 'groups', label: `Financial Groups ${groupsList && groupsList.length > 0 ? `(${groupsList.length})` : ''}`, icon: FolderKanban },
                        { 
                            id: 'requests', 
                            label: `Requests ${((incomingRequests?.length || 0) + (groupIncomingRequests?.length || 0)) > 0 ? `(${((incomingRequests?.length || 0) + (groupIncomingRequests?.length || 0))})` : ''}`, 
                            icon: UserPlus, 
                            badge: ((incomingRequests?.length || 0) + (groupIncomingRequests?.length || 0)) 
                        },
                        { id: 'transactions', label: 'Global Ledger', icon: ArrowLeftRight },
                        { id: 'reminders', label: 'Repayment Alerts', icon: Bell }
                    ].map(tab => (
                        <button 
                            data-tour={`people-tab-${tab.id}`}
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ 
                                padding: '0.544rem 0.997rem', borderRadius: '10px', fontSize: '0.77rem', whiteSpace: 'nowrap',
                                background: activeTab === tab.id ? '#064E3B' : 'white', 
                                color: activeTab === tab.id ? 'white' : '#475569',
                                border: '1px solid #E2E8F0', fontWeight: '700', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.544rem',
                                boxShadow: activeTab === tab.id ? '0 8px 16px rgba(6, 78, 59, 0.15)' : 'none',
                                transition: 'all 0.2s',
                                position: 'relative'
                            }}
                        >
                            <tab.icon size={18} /> {tab.label}
                            {tab.badge > 0 && activeTab !== tab.id && (
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', position: 'absolute', top: '10px', right: '10px' }} />
                            )}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.906rem' }}>
                    {activeTab === 'groups' && (
                        <button 
                            onClick={() => setIsCreateGroupModalOpen(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.453rem', padding: '0.589rem 1.133rem', borderRadius: '12px', background: '#064E3B', color: 'white', border: 'none', fontWeight: '750', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 10px rgba(6, 78, 59, 0.2)' }}
                        >
                            <Plus size={16} /> New Financial Group
                        </button>
                    )}

                    {activeTab === 'contacts' && activeConfig.partyGroup && (
                        <select 
                            value={groupFilter} 
                            onChange={(e) => setGroupFilter(e.target.value)}
                            style={{ padding: '0.453rem 0.906rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontSize: '0.77rem', fontWeight: '700', color: '#475569', outline: 'none', cursor: 'pointer' }}
                        >
                            <option value="All">All Groups</option>
                            {uniqueGroups.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    )}

                    {activeTab === 'contacts' && activeConfig.partyStatus && (
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ padding: '0.453rem 0.906rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontSize: '0.77rem', fontWeight: '700', color: '#475569', outline: 'none', cursor: 'pointer' }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    )}

                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        background: '#FFF', 
                        border: '1px solid #E2E8F0', 
                        borderRadius: '12px', 
                        padding: showSearch ? '0.453rem 0.906rem' : '0.453rem', 
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                        width: showSearch ? '280px' : '40px', 
                        height: '40px',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}>
                        <Search 
                            size={18} 
                            style={{ color: '#64748B', cursor: 'pointer', flexShrink: 0 }} 
                            onClick={() => setShowSearch(!showSearch)} 
                        />
                        <input 
                            type="text" 
                            placeholder={`Lookup ${activeTab === 'contacts' ? 'contacts...' : activeTab === 'transactions' ? 'transactions...' : 'reminders...'}`} 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                border: 'none', 
                                outline: 'none', 
                                background: 'transparent', 
                                marginLeft: '0.68rem', 
                                width: '100%', 
                                fontSize: '0.816rem', 
                                color: '#1E293B',
                                display: showSearch ? 'block' : 'none'
                            }}
                            autoFocus={showSearch}
                        />
                    </div>
                    {activeTab === 'reminders' && (
                        <button 
                            onClick={() => setIsReminderModalOpen(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.453rem', padding: '0.589rem 1.042rem', borderRadius: '12px', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', fontWeight: '750', cursor: 'pointer', flexShrink: 0 }}
                        >
                            <Bell size={16} /> Dispatch Alert
                        </button>
                    )}
                </div>
            </div>

            {/* Main Dynamic Content */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <div className="cliks-table-scroll" style={{ flex: 1, minHeight: 0 }}>
                    {/* TAB 1: Contacts List */}
                    {activeTab === 'contacts' && (
                        <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <FilterableTableHead 
                                columns={[
                                    { key: 'name', label: 'Profile Contact', placeholder: 'Name...' },
                                    { key: 'role_type', label: 'Classification', placeholder: 'Role...' },
                                    ...(activeConfig.partyGroup ? [{ key: 'relationship', label: 'Group', placeholder: 'Group...' }] : []),
                                    ...(activeConfig.partyStatus ? [{ key: 'status', label: 'Status', placeholder: 'Status...' }] : []),
                                    { key: 'company', label: 'Company / Link', placeholder: 'Company...' },
                                    { key: 'phone_email', label: 'Phone / Email', placeholder: 'Contact...' },
                                    { key: 'net_balance', label: 'Net Exposure', placeholder: 'Exposure...', align: 'right' },
                                    { key: '_actions', label: '', noFilter: true, align: 'right' }
                                ]} 
                                onFilterChange={setColFilters} 
                                thStyle={{ position: 'sticky', top: 0, zIndex: 10, background: '#FFF', padding: '0.56rem 0.78rem' }}
                            />
                            <tbody>
                                {isPeopleLoading ? (
                                    <tr><td colSpan={10} style={{ padding: '3.625rem', textAlign: 'center', color: '#64748B' }}>Streaming network directory...</td></tr>
                                ) : filteredPeople
                                    .map(p => {
                                        const meta = getContactMeta(p.contact_info);
                                        return {
                                            ...p,
                                            status: p.status || meta.status || 'accepted',
                                            loyalty_points: meta.loyalty_points,
                                            phone_email: `${p.phone || ''} ${p.email || ''}`
                                        };
                                    })
                                    .filter(item => applyTableFilters(item, typeof colFilters !== "undefined" ? colFilters : {})).length === 0 ? (
                                    <tr><td colSpan={10} style={{ padding: '3.625rem', textAlign: 'center', color: '#94A3B8' }}>Zero network contacts found. Start adding!</td></tr>
                                ) : filteredPeople
                                    .map(p => {
                                        const meta = getContactMeta(p.contact_info);
                                        return {
                                            ...p,
                                            status: p.status || meta.status || 'accepted',
                                            loyalty_points: meta.loyalty_points,
                                            phone_email: `${p.phone || ''} ${p.email || ''}`
                                        };
                                    })
                                    .filter(item => applyTableFilters(item, typeof colFilters !== "undefined" ? colFilters : {}))
                                    .sort((a, b) => {
                                        const aPinned = pinnedPeopleIds.includes(a.id);
                                        const bPinned = pinnedPeopleIds.includes(b.id);
                                        if (aPinned && !bPinned) return -1;
                                        if (!aPinned && bPinned) return 1;
                                        const dateA = new Date(a.updatedAt || a.updated_at || a.createdAt || a.created_at || a.date || 0).getTime();
                                        const dateB = new Date(b.updatedAt || b.updated_at || b.createdAt || b.created_at || b.date || 0).getTime();
                                        if (dateB !== dateA) return dateB - dateA;
                                        return (Number(b.id) || 0) - (Number(a.id) || 0);
                                    })
                                    .map((p) => {
                                        const meta = getContactMeta(p.contact_info);
                                        const netBal = parseFloat(p.net_balance || 0);
                                        const isPinned = pinnedPeopleIds.includes(p.id);
                                        return (
                                            <tr key={p.id} 
                                                style={{ borderBottom: '1px solid #F8FAFC', cursor: 'pointer', transition: 'background 0.15s', background: 'white' }} 
                                                onClick={() => setSelectedPersonId(p.id)}
                                                onMouseOver={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.background = 'white'; }}
                                            >
                                            <td style={{ padding: '0.589rem 0.78rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.72rem' }}>
                                                    <div style={{ position: 'relative', flexShrink: 0 }}>
                                                        {renderAvatar(p.name, 36)}
                                                        {isPinned && (
                                                            <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#004aad', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                                                <Pin size={10} style={{ transform: 'rotate(45deg)' }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ minWidth: 0 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                            <p style={{ fontWeight: '800', color: '#1E293B', fontSize: '0.793rem', margin: 0, whiteSpace: 'nowrap' }} title={p.name}>{p.name}</p>
                                                            {p.status === 'pending' && (
                                                                <span className="badge-nowrap" style={{ gap: '3px', background: '#FEF3C7', color: '#B45309', padding: '0.136rem 0.453rem', borderRadius: '6px', fontSize: '0.589rem', fontWeight: '800' }}>
                                                                    <Clock size={10} /> Pending Request
                                                                </span>
                                                            )}
                                                            {p.status === 'accepted' && (
                                                                <span className="badge-nowrap" style={{ gap: '3px', background: '#ECFDF5', color: '#047857', padding: '0.136rem 0.453rem', borderRadius: '6px', fontSize: '0.589rem', fontWeight: '800' }}>
                                                                    <Check size={10} /> Connected
                                                                </span>
                                                            )}
                                                            {p.status === 'rejected' && (
                                                                <span className="badge-nowrap" style={{ gap: '3px', background: '#FEE2E2', color: '#DC2626', padding: '0.136rem 0.453rem', borderRadius: '6px', fontSize: '0.589rem', fontWeight: '800' }}>
                                                                    <X size={10} /> Declined
                                                                </span>
                                                            )}
                                                        </div>
                                                        {activeConfig.payReminder && netBal !== 0 && (
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleSendWhatsAppReminder(p, netBal); }}
                                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: 'none', background: '#ECFDF5', color: '#047857', padding: '0.181rem 0.453rem', borderRadius: '6px', fontSize: '0.589rem', fontWeight: '750', marginTop: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                                            >
                                                                <MessageSquare size={11} /> Send Reminder
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="cell-nowrap" style={{ padding: '0.589rem 0.78rem', whiteSpace: 'nowrap' }}>
                                                <span className="badge-nowrap" style={{ padding: '0.24rem 0.5rem', borderRadius: '6px', background: '#EFF6FF', color: '#1E40AF', fontWeight: '800', fontSize: '0.652rem', textTransform: 'uppercase' }}>{p.role_type}</span>
                                            </td>
                                            {activeConfig.partyGroup && (
                                                <td className="cell-nowrap" style={{ padding: '0.589rem 0.78rem', whiteSpace: 'nowrap' }}>
                                                    {p.relationship ? (
                                                        <span className="badge-nowrap" style={{ padding: '0.24rem 0.5rem', borderRadius: '6px', background: '#FEF3C7', color: '#D97706', fontWeight: '800', fontSize: '0.652rem', textTransform: 'uppercase' }}>{p.relationship}</span>
                                                    ) : (
                                                        <span style={{ color: '#94A3B8', fontSize: '0.725rem' }}>None</span>
                                                    )}
                                                </td>
                                            )}
                                            {activeConfig.partyStatus && (
                                                <td className="cell-nowrap" style={{ padding: '0.589rem 0.78rem', whiteSpace: 'nowrap' }}>
                                                    <span className="badge-nowrap" style={{ padding: '0.24rem 0.5rem', borderRadius: '6px', background: meta.status === 'active' ? '#ECFDF5' : '#FEE2E2', color: meta.status === 'active' ? '#047857' : '#EF4444', fontWeight: '800', fontSize: '0.652rem', textTransform: 'uppercase' }}>
                                                        {meta.status}
                                                    </span>
                                                </td>
                                            )}
                                            <td style={{ padding: '0.589rem 0.78rem', color: '#64748B', fontWeight: '600', fontSize: '0.77rem', maxWidth: '170px' }} title={p.company || 'Individual'}>
                                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>{p.company || 'Individual'}</div>
                                            </td>
                                            <td style={{ padding: '0.589rem 0.78rem', color: '#475569', maxWidth: '210px' }}>
                                                <div style={{ fontSize: '0.77rem', fontWeight: '650', whiteSpace: 'nowrap' }}>{p.phone || 'N/A'}</div>
                                                <div style={{ fontSize: '0.68rem', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }} title={p.email || ''}>{p.email || ''}</div>
                                            </td>
                                            <td className="cell-num" style={{ padding: '0.589rem 0.78rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                <span style={{ fontWeight: '900', fontSize: '0.793rem', color: netBal >= 0 ? '#16A34A' : '#EF4444', whiteSpace: 'nowrap' }}>
                                                    {formatCurr(p.net_balance)}
                                                </span>
                                                <div style={{ fontSize: '0.634rem', color: '#94A3B8', fontWeight: '700', whiteSpace: 'nowrap' }}>{netBal >= 0 ? 'RECEIVABLE' : 'PAYABLE'}</div>
                                            </td>
                                            <td className="cell-actions" style={{ padding: '0.589rem 0.78rem', textAlign: 'right', position: 'relative', whiteSpace: 'nowrap' }}>
                                                <div style={{ display: 'inline-block', position: 'relative' }}>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveMenuId(activeMenuId === p.id ? null : p.id);
                                                        }}
                                                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', transition: 'color 0.2s', padding: '6px 12px', borderRadius: '8px' }}
                                                        onMouseOver={(e) => e.currentTarget.style.color = '#004aad'}
                                                        onMouseOut={(e) => e.currentTarget.style.color = '#94A3B8'}
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>
                                                    
                                                    {activeMenuId === p.id && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            right: 0,
                                                            top: '100%',
                                                            background: 'white',
                                                            borderRadius: '12px',
                                                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)',
                                                            border: '1px solid #E2E8F0',
                                                            padding: '6px',
                                                            zIndex: 100,
                                                            minWidth: '160px',
                                                            textAlign: 'left'
                                                        }}>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const next = pinnedPeopleIds.includes(p.id)
                                                                        ? pinnedPeopleIds.filter(id => id !== p.id)
                                                                        : [...pinnedPeopleIds, p.id];
                                                                    setPinnedPeopleIds(next);
                                                                    localStorage.setItem('cliks_pinned_people', JSON.stringify(next));
                                                                    setActiveMenuId(null);
                                                                }}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    width: '100%',
                                                                    padding: '8px 12px',
                                                                    border: 'none',
                                                                    background: 'none',
                                                                    color: '#334155',
                                                                    fontSize: '0.77rem',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer',
                                                                    borderRadius: '8px',
                                                                    transition: 'background 0.2s'
                                                                }}
                                                                onMouseOver={(e) => e.currentTarget.style.background = '#F1F5F9'}
                                                                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                                            >
                                                                <Pin size={14} style={{ color: '#004aad', transform: isPinned ? 'rotate(45deg)' : 'none' }} />
                                                                {isPinned ? 'Unpin Contact' : 'Pin to top'}
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditingContactId(p.id);
                                                                    setContactForm({
                                                                        name: p.name || '',
                                                                        role_type: p.role_type || 'friend',
                                                                        phone: p.phone || '',
                                                                        email: p.email || '',
                                                                        company: p.company || '',
                                                                        relationship: p.relationship || '',
                                                                        contact_info: p.contact_info || JSON.stringify({ status: 'active', loyalty_points: 0 })
                                                                    });
                                                                    setIsContactModalOpen(true);
                                                                    setActiveMenuId(null);
                                                                }}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    width: '100%',
                                                                    padding: '8px 12px',
                                                                    border: 'none',
                                                                    background: 'none',
                                                                    color: '#334155',
                                                                    fontSize: '0.77rem',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer',
                                                                    borderRadius: '8px',
                                                                    transition: 'background 0.2s'
                                                                }}
                                                                onMouseOver={(e) => e.currentTarget.style.background = '#F1F5F9'}
                                                                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                                            >
                                                                <Edit2 size={14} style={{ color: '#64748B' }} />
                                                                Edit Profile
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteContact(p.id);
                                                                    setActiveMenuId(null);
                                                                }}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    width: '100%',
                                                                    padding: '8px 12px',
                                                                    border: 'none',
                                                                    background: 'none',
                                                                    color: '#EF4444',
                                                                    fontSize: '0.77rem',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer',
                                                                    borderRadius: '8px',
                                                                    transition: 'background 0.2s'
                                                                }}
                                                                onMouseOver={(e) => e.currentTarget.style.background = '#FEF2F2'}
                                                                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                                            >
                                                                <Trash2 size={14} style={{ color: '#EF4444' }} />
                                                                Delete Contact
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    {/* TAB: Financial Groups */}
                    {activeTab === 'groups' && (
                        <div style={{ padding: '1.812rem' }}>
                            <div style={{ marginBottom: '1.586rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.906rem' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.133rem', fontWeight: '900', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FolderKanban size={22} style={{ color: '#064E3B' }} /> Financial Groups & Syndicates
                                    </h3>
                                    <p style={{ margin: '0.227rem 0 0 0', fontSize: '0.77rem', color: '#64748B' }}>
                                        Collaborative ledgers, joint business pools, and shared credit circles with verified @bnxmail.com partners.
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.68rem' }}>
                                    <button
                                        onClick={() => setIsCreateGroupModalOpen(true)}
                                        style={{
                                            padding: '0.589rem 1.133rem',
                                            borderRadius: '12px',
                                            background: '#064E3B',
                                            color: 'white',
                                            border: 'none',
                                            fontWeight: '800',
                                            fontSize: '0.77rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            boxShadow: '0 4px 12px rgba(6, 78, 59, 0.2)'
                                        }}
                                    >
                                        <Plus size={16} /> Create Group
                                    </button>
                                </div>
                            </div>

                            {groupsList.length === 0 ? (
                                <div style={{ padding: '3.625rem 1.812rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '24px', border: '1.5px dashed #CBD5E1' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '20px', background: '#ECFDF5', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.133rem' }}>
                                        <FolderKanban size={28} />
                                    </div>
                                    <h4 style={{ margin: 0, fontSize: '1.042rem', fontWeight: '800', color: '#1E293B' }}>No Financial Groups Yet</h4>
                                    <p style={{ margin: '0.453rem 0 1.359rem', fontSize: '0.77rem', color: '#64748B', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
                                        Create a joint syndicate, savings circle, or project outlay pool. Invite partners using their @bnxmail.com address.
                                    </p>
                                    <button
                                        onClick={() => setIsCreateGroupModalOpen(true)}
                                        style={{
                                            padding: '0.68rem 1.359rem',
                                            borderRadius: '12px',
                                            background: '#064E3B',
                                            color: 'white',
                                            border: 'none',
                                            fontWeight: '800',
                                            fontSize: '0.77rem',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <Plus size={16} /> Create Your First Group
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.359rem' }}>
                                    {groupsList.map(group => {
                                        const typeColor = 
                                            group.group_type === 'syndicate' ? { bg: '#EFF6FF', text: '#1E40AF', border: '#DBEAFE' } :
                                            group.group_type === 'pool' ? { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' } :
                                            group.group_type === 'credit' ? { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' } :
                                            { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE' };

                                        const progressPercent = group.target_amount > 0 
                                            ? Math.min(100, Math.round((group.total_contributed / group.target_amount) * 100))
                                            : null;

                                        return (
                                            <div key={group.id} style={{
                                                background: '#FFFFFF',
                                                borderRadius: '20px',
                                                border: '1.5px solid #E2E8F0',
                                                padding: '1.359rem',
                                                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                gap: '1.133rem',
                                                transition: 'all 0.2s',
                                                position: 'relative'
                                            }}>
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.68rem' }}>
                                                        <span style={{
                                                            padding: '0.227rem 0.589rem',
                                                            borderRadius: '8px',
                                                            background: typeColor.bg,
                                                            color: typeColor.text,
                                                            border: `1px solid ${typeColor.border}`,
                                                            fontSize: '0.652rem',
                                                            fontWeight: '800',
                                                            textTransform: 'uppercase'
                                                        }}>
                                                            {group.group_type === 'syndicate' ? 'Business Syndicate' :
                                                             group.group_type === 'pool' ? 'Contribution Pool' :
                                                             group.group_type === 'credit' ? 'Credit Circle' : 'Project Outlays'}
                                                        </span>
                                                        <span style={{ fontSize: '0.652rem', fontWeight: '800', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Users size={12} /> {group.member_count} active
                                                            {group.pending_member_count > 0 && (
                                                                <span style={{ color: '#D97706', marginLeft: '4px' }}>
                                                                    ({group.pending_member_count} pending)
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>

                                                    <h4 style={{ margin: 0, fontSize: '1.042rem', fontWeight: '900', color: '#0F172A' }}>
                                                        {group.name}
                                                    </h4>
                                                    {group.description && (
                                                        <p style={{ margin: '0.317rem 0 0 0', fontSize: '0.725rem', color: '#64748B', lineHeight: '1.3' }}>
                                                            {group.description}
                                                        </p>
                                                    )}

                                                    {/* Progress bar for pools */}
                                                    {progressPercent !== null && (
                                                        <div style={{ marginTop: '0.906rem', padding: '0.77rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.652rem', fontWeight: '800', color: '#475569', marginBottom: '0.317rem' }}>
                                                                <span>Pool Goal ({formatCurr(group.target_amount)})</span>
                                                                <span style={{ color: '#065F46' }}>{progressPercent}%</span>
                                                            </div>
                                                            <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                                                                <div style={{ width: `${progressPercent}%`, height: '100%', background: '#10B981', borderRadius: '999px' }} />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Metrics breakdown */}
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.68rem', marginTop: '0.906rem' }}>
                                                        <div style={{ padding: '0.589rem 0.77rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                                                            <p style={{ margin: 0, fontSize: '0.634rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Contributed</p>
                                                            <p style={{ margin: '0.181rem 0 0 0', fontSize: '0.816rem', fontWeight: '900', color: '#065F46' }}>{formatCurr(group.total_contributed)}</p>
                                                        </div>
                                                        <div style={{ padding: '0.589rem 0.77rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                                                            <p style={{ margin: 0, fontSize: '0.634rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Expenses</p>
                                                            <p style={{ margin: '0.181rem 0 0 0', fontSize: '0.816rem', fontWeight: '900', color: '#991B1B' }}>{formatCurr(group.total_expenses)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '0.68rem', paddingTop: '0.906rem', borderTop: '1px solid #F1F5F9' }}>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedGroupId(group.id);
                                                            setGroupActiveSubTab('balances');
                                                        }}
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.589rem 0.906rem',
                                                            borderRadius: '10px',
                                                            background: '#064E3B',
                                                            color: 'white',
                                                            border: 'none',
                                                            fontWeight: '800',
                                                            fontSize: '0.77rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '6px'
                                                        }}
                                                    >
                                                        <FolderKanban size={14} /> Open Ledger
                                                    </button>
                                                    {group.my_role === 'admin' && (
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm(`Delete "${group.name}"? All group records and balances will be removed.`)) {
                                                                    deleteGroupMutation.mutate(group.id);
                                                                }
                                                            }}
                                                            style={{
                                                                padding: '0.589rem',
                                                                borderRadius: '10px',
                                                                background: '#FFF',
                                                                color: '#EF4444',
                                                                border: '1.5px solid #FECACA',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                            title="Delete Group"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: Connection & Financial Group Requests */}
                    {activeTab === 'requests' && (
                        <div style={{ padding: '1.812rem' }}>
                            <div style={{ marginBottom: '1.359rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.906rem' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.133rem', fontWeight: '900', color: '#0F172A' }}>Incoming Requests & Invitations</h3>
                                    <p style={{ margin: '0.227rem 0 0 0', fontSize: '0.77rem', color: '#64748B' }}>
                                        Contact connections and financial group invitations sent to your @bnxmail.com address.
                                    </p>
                                </div>
                                <span style={{ padding: '0.317rem 0.77rem', borderRadius: '999px', background: '#DBEAFE', color: '#1D4ED8', fontWeight: '800', fontSize: '0.725rem' }}>
                                    {incomingRequests.length + groupIncomingRequests.length} Pending
                                </span>
                            </div>

                            {/* Section 1: Financial Group Invitations */}
                            {groupIncomingRequests && groupIncomingRequests.length > 0 && (
                                <div style={{ marginBottom: '2.266rem' }}>
                                    <h4 style={{ fontSize: '0.861rem', fontWeight: '850', color: '#1E3A8A', margin: '0 0 0.906rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <FolderKanban size={18} /> Financial Group Invitations ({groupIncomingRequests.length})
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.133rem' }}>
                                        {groupIncomingRequests.map((req) => (
                                            <div key={`group-invite-${req.membership_id}`} style={{
                                                background: '#FFFFFF',
                                                borderRadius: '18px',
                                                border: '1.5px solid #BFDBFE',
                                                padding: '1.359rem',
                                                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.05)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                gap: '0.906rem'
                                            }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.906rem' }}>
                                                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#4F46E5', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                            <FolderKanban size={24} />
                                                        </div>
                                                        <div style={{ minWidth: 0, flex: 1 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                                <h4 style={{ margin: 0, fontSize: '0.952rem', fontWeight: '900', color: '#0F172A' }}>
                                                                    {req.group_name}
                                                                </h4>
                                                                <span style={{ padding: '0.136rem 0.453rem', borderRadius: '6px', background: '#EEF2FF', color: '#4338CA', fontSize: '0.616rem', fontWeight: '800', textTransform: 'capitalize' }}>
                                                                    {req.group_type || 'Syndicate'}
                                                                </span>
                                                            </div>
                                                            {req.group_description && (
                                                                <p style={{ margin: '0.227rem 0 0 0', fontSize: '0.725rem', color: '#64748B' }}>
                                                                    {req.group_description}
                                                                </p>
                                                            )}
                                                            <p style={{ margin: '0.317rem 0 0 0', fontSize: '0.707rem', color: '#475569' }}>
                                                                Invited by: <strong>{req.inviter_business_name || req.inviter_username || 'Admin'}</strong> ({req.inviter_email})
                                                            </p>
                                                            <div style={{ display: 'flex', gap: '0.453rem', marginTop: '0.453rem', flexWrap: 'wrap' }}>
                                                                <span style={{ padding: '0.181rem 0.498rem', borderRadius: '6px', background: '#F1F5F9', color: '#334155', fontSize: '0.634rem', fontWeight: '800' }}>
                                                                    Role: {req.invited_role?.toUpperCase()}
                                                                </span>
                                                                {req.target_amount > 0 && (
                                                                    <span style={{ padding: '0.181rem 0.498rem', borderRadius: '6px', background: '#ECFDF5', color: '#065F46', fontSize: '0.634rem', fontWeight: '800' }}>
                                                                        Pool Goal: {formatCurr(req.target_amount)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '0.68rem', paddingTop: '0.906rem', borderTop: '1px solid #F1F5F9' }}>
                                                    <button
                                                        onClick={() => respondGroupRequestMutation.mutate({ membershipId: req.membership_id, action: 'accept' })}
                                                        disabled={respondGroupRequestMutation.isPending}
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.589rem 0.906rem',
                                                            borderRadius: '10px',
                                                            background: '#4F46E5',
                                                            color: 'white',
                                                            border: 'none',
                                                            fontWeight: '800',
                                                            fontSize: '0.77rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '6px'
                                                        }}
                                                    >
                                                        <Check size={14} /> Join Group
                                                    </button>
                                                    <button
                                                        onClick={() => respondGroupRequestMutation.mutate({ membershipId: req.membership_id, action: 'reject' })}
                                                        disabled={respondGroupRequestMutation.isPending}
                                                        style={{
                                                            padding: '0.589rem 0.906rem',
                                                            borderRadius: '10px',
                                                            background: '#FFFFFF',
                                                            color: '#EF4444',
                                                            border: '1.5px solid #FECACA',
                                                            fontWeight: '800',
                                                            fontSize: '0.77rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '6px'
                                                        }}
                                                    >
                                                        <X size={14} /> Decline
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Section 2: Contact Connection Requests */}
                            <h4 style={{ fontSize: '0.861rem', fontWeight: '850', color: '#0F172A', margin: '0 0 0.906rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Users size={18} /> Contact Connections ({incomingRequests.length})
                            </h4>
                            {incomingRequests.length === 0 ? (
                                <div style={{ padding: '2.719rem 1.812rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '20px', border: '1px dashed #CBD5E1' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#E2E8F0', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.906rem' }}>
                                        <UserPlus size={24} />
                                    </div>
                                    <h4 style={{ margin: 0, fontSize: '0.906rem', fontWeight: '800', color: '#334155' }}>No Pending Contact Requests</h4>
                                    <p style={{ margin: '0.317rem 0 0 0', fontSize: '0.77rem', color: '#94A3B8' }}>
                                        When someone adds your @bnxmail.com address to their directory, you can accept or decline their connection request here.
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.133rem' }}>
                                    {incomingRequests.map((req) => (
                                        <div key={req.id} style={{
                                            background: '#FFFFFF',
                                            borderRadius: '18px',
                                            border: '1.5px solid #E2E8F0',
                                            padding: '1.359rem',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            gap: '0.906rem'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.906rem' }}>
                                                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#004aad', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.997rem', flexShrink: 0 }}>
                                                    {(req.requester_username || req.requester_business_name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div style={{ minWidth: 0, flex: 1 }}>
                                                    <h4 style={{ margin: 0, fontSize: '0.906rem', fontWeight: '900', color: '#0F172A' }}>
                                                        {req.requester_username || req.requester_business_name || 'Network Member'}
                                                    </h4>
                                                    <p style={{ margin: '0.181rem 0', fontSize: '0.725rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        <Mail size={12} /> {req.requester_email}
                                                    </p>
                                                    <div style={{ display: 'flex', gap: '0.453rem', marginTop: '0.453rem', flexWrap: 'wrap' }}>
                                                        <span style={{ padding: '0.181rem 0.498rem', borderRadius: '6px', background: '#EFF6FF', color: '#1E40AF', fontSize: '0.634rem', fontWeight: '800', textTransform: 'uppercase' }}>
                                                            {req.role_type || 'Contact'}
                                                        </span>
                                                        <span style={{ padding: '0.181rem 0.498rem', borderRadius: '6px', background: '#FEF3C7', color: '#92400E', fontSize: '0.634rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                            <Clock size={10} /> Pending
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.68rem', paddingTop: '0.906rem', borderTop: '1px solid #F1F5F9' }}>
                                                <button
                                                    onClick={() => respondRequestMutation.mutate({ id: req.id, action: 'accept' })}
                                                    disabled={respondRequestMutation.isPending}
                                                    style={{
                                                        flex: 1,
                                                        padding: '0.589rem 0.906rem',
                                                        borderRadius: '10px',
                                                        background: '#10B981',
                                                        color: 'white',
                                                        border: 'none',
                                                        fontWeight: '800',
                                                        fontSize: '0.77rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '6px',
                                                        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)'
                                                    }}
                                                >
                                                    <Check size={14} /> Accept Request
                                                </button>
                                                <button
                                                    onClick={() => respondRequestMutation.mutate({ id: req.id, action: 'reject' })}
                                                    disabled={respondRequestMutation.isPending}
                                                    style={{
                                                        padding: '0.589rem 0.906rem',
                                                        borderRadius: '10px',
                                                        background: '#FFFFFF',
                                                        color: '#EF4444',
                                                        border: '1.5px solid #FECACA',
                                                        fontWeight: '800',
                                                        fontSize: '0.77rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '6px'
                                                    }}
                                                >
                                                    <X size={14} /> Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 2: Transactions Ledger */}
                    {activeTab === 'transactions' && (
                        <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <FilterableTableHead 
                                columns={[
                                    { key: 'date', label: 'Execution Date', placeholder: 'Date...' },
                                    { key: 'person_name', label: 'Network Contact', placeholder: 'Contact...' },
                                    { key: 'description', label: 'Activity Description', placeholder: 'Description...' },
                                    { key: 'type', label: 'Classification', placeholder: 'Type...' },
                                    { key: 'amount', label: 'Ledger Flow', placeholder: 'Flow...', align: 'right' },
                                    { key: '_actions', label: '', noFilter: true, align: 'right' }
                                ]} 
                                onFilterChange={setColFilters} 
                                thStyle={{ position: 'sticky', top: 0, zIndex: 10, background: '#FFF', padding: '0.56rem 0.78rem' }}
                            />
                            <tbody>
                                {isTxLoading ? (
                                    <tr><td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748B' }}>Accessing Ledger Database...</td></tr>
                                ) : filteredTx.filter(item => applyTableFilters(item, typeof colFilters !== "undefined" ? colFilters : {})).length === 0 ? (
                                    <tr><td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>No logged P2P activities found.</td></tr>
                                ) : filteredTx.filter(item => applyTableFilters(item, typeof colFilters !== "undefined" ? colFilters : {})).map((t) => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td className="cell-nowrap" style={{ padding: '0.589rem 0.78rem', color: '#64748B', fontWeight: '600', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{new Date(t.date).toLocaleDateString('en-IN')}</td>
                                        <td style={{ padding: '0.589rem 0.78rem', fontWeight: '800', color: '#1E293B', fontSize: '0.793rem', maxWidth: '180px' }} title={t.person_name}>
                                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{t.person_name}</div>
                                        </td>
                                        <td style={{ padding: '0.589rem 0.78rem', color: '#475569', fontWeight: '600', fontSize: '0.78rem', maxWidth: '240px' }} title={t.description}>
                                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>{t.description}</div>
                                        </td>
                                        <td className="cell-nowrap" style={{ padding: '0.589rem 0.78rem', whiteSpace: 'nowrap' }}>
                                            <span className="badge-nowrap" style={{ padding: '0.227rem 0.5rem', borderRadius: '6px', background: t.type === 'lent' ? '#ECFDF5' : '#FEF2F2', color: t.type === 'lent' ? '#059669' : '#DC2626', fontWeight: '800', fontSize: '0.652rem', textTransform: 'uppercase' }}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="cell-num" style={{ padding: '0.589rem 0.78rem', textAlign: 'right', fontWeight: '900', fontSize: '0.84rem', whiteSpace: 'nowrap', color: t.type === 'lent' ? '#059669' : '#DC2626' }}>
                                            {t.type === 'lent' ? '+' : '-'}{formatCurr(t.amount)}
                                        </td>
                                        <td className="cell-actions" style={{ padding: '0.589rem 0.78rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                            <button 
                                                onClick={() => deleteTxMutation.mutate(t)}
                                                title="Delete entry"
                                                aria-label="Delete entry"
                                                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* TAB 3: Reminders & Tasks */}
                    {activeTab === 'reminders' && (
                        <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <FilterableTableHead 
                                columns={[
                                    { key: 'due_date', label: 'MATURITY / DUE DATE', placeholder: 'Due Date...' },
                                    { key: 'person_name', label: 'TARGET CONTACT', placeholder: 'Contact...' },
                                    { key: 'title', label: 'MEMO LABEL', placeholder: 'Memo...' },
                                    { key: 'amount', label: 'CLAIM CAP', placeholder: 'Claim...', align: 'right' },
                                    { key: '_actions', label: '', noFilter: true, align: 'right' }
                                ]} 
                                onFilterChange={setColFilters} 
                                thStyle={{ position: 'sticky', top: 0, zIndex: 10, background: '#FFF', padding: '0.56rem 0.78rem' }}
                            />
                            <tbody>
                                {isRemindersLoading ? (
                                    <tr><td colSpan={5} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748B' }}>Resolving dispatch statuses...</td></tr>
                                ) : displayAlerts.filter(item => applyTableFilters(item, typeof colFilters !== "undefined" ? colFilters : {})).length === 0 ? (
                                    <tr><td colSpan={5} style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>Zero pending alerts scheduled.</td></tr>
                                ) : displayAlerts.filter(item => applyTableFilters(item, typeof colFilters !== "undefined" ? colFilters : {})).map((r) => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td className="cell-nowrap" style={{ padding: '0.589rem 0.78rem', color: '#E11D48', fontWeight: '800', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                                                <Calendar size={14} />
                                                {new Date(r.maturity_date || r.due_date).toLocaleDateString('en-IN')}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.589rem 0.78rem', fontWeight: '800', color: '#1E293B', fontSize: '0.793rem', maxWidth: '180px' }} title={r.target_contact || r.person_name}>
                                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{r.target_contact || r.person_name}</div>
                                        </td>
                                        <td style={{ padding: '0.589rem 0.78rem', color: '#475569', fontWeight: '650', fontSize: '0.78rem', maxWidth: '220px' }} title={r.memo_label || r.title}>
                                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>{r.memo_label || r.title}</div>
                                        </td>
                                        <td className="cell-num" style={{ padding: '0.589rem 0.78rem', textAlign: 'right', fontWeight: '900', color: '#0F172A', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{formatCurr(r.claim_cap !== undefined ? r.claim_cap : r.amount)}</td>
                                        <td className="cell-actions" style={{ padding: '0.589rem 0.78rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                            <div style={{ display: 'inline-flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                                                <button 
                                                    onClick={() => alert(`Dispatched WhatsApp alert reminder to ${r.target_contact || r.person_name}.`)}
                                                    style={{ border: 'none', background: '#F0FDF4', padding: '0.35rem 0.65rem', borderRadius: '8px', color: '#1B6B3A', fontWeight: '800', cursor: 'pointer', fontSize: '0.725rem', whiteSpace: 'nowrap' }}
                                                >
                                                    Send
                                                </button>
                                                <button 
                                                    onClick={() => deleteReminderMutation.mutate(r)}
                                                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                                                    onMouseOver={(e) => (e.currentTarget.style.color = '#EF4444')}
                                                    onMouseOut={(e) => (e.currentTarget.style.color = '#94A3B8')}
                                                    title="Delete reminder"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteReminderMutation.mutate(r)}
                                                    style={{ background: 'none', border: 'none', color: '#10B981', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                                                    title="Mark alert as completed"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal 1: Add/Edit People Contact */}
            <AnimatePresence>
                {isContactModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                        <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'white', width: '100%', maxWidth: '480px', borderRadius: '20px', padding: '1.586rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.359rem' }}>
                                <h3 style={{ fontSize: '1.133rem', fontWeight: '850', color: '#064E3B' }}>{editingContactId ? 'Edit Contact Profile' : 'Enroll New Contact'}</h3>
                                <button onClick={() => { setIsContactModalOpen(false); setEditingContactId(null); setContactForm({ name: '', role_type: 'friend', phone: '', email: '', company: '', relationship: '', contact_info: '' }); }} style={{ border: 'none', background: '#F1F5F9', padding: '0.544rem', borderRadius: '14px', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: '1.133rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Full Identity Name <span style={{ color: '#EF4444' }}>*</span></label>
                                    <input required placeholder="e.g., Rahul Dev" type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.68rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Network Role</label>
                                        <select 
                                            value={['friend', 'family', 'colleague', 'business'].includes(contactForm.role_type) ? contactForm.role_type : 'others'} 
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setContactForm({ ...contactForm, role_type: val === 'others' ? '' : val });
                                            }} 
                                            style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white' }}
                                        >
                                            <option value="friend">Friend</option>
                                            <option value="family">Family</option>
                                            <option value="colleague">Colleague</option>
                                            <option value="business">Business Partner</option>
                                            <option value="others">Others (Custom)</option>
                                        </select>
                                        {!['friend', 'family', 'colleague', 'business'].includes(contactForm.role_type) && (
                                            <input 
                                                placeholder="Specify custom role..." 
                                                type="text" 
                                                value={contactForm.role_type} 
                                                onChange={(e) => setContactForm({ ...contactForm, role_type: e.target.value })} 
                                                style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', marginTop: '0.453rem' }} 
                                                required
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Company Label</label>
                                        <input placeholder="Dunder Mifflin" type="text" value={contactForm.company} onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })} style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.68rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Phone Contact <span style={{ color: '#EF4444' }}>*</span></label>
                                        <input required placeholder="+91 ..." type="text" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value.replace(/[^0-9+]/g, '') })} style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>
                                            E-Mail Address (bnxmail) <span style={{ color: '#EF4444' }}>*</span>
                                        </label>
                                        <input 
                                            required
                                            placeholder="username@bnxmail.com" 
                                            type="email" 
                                            value={contactForm.email} 
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setContactForm({ ...contactForm, email: val });
                                                if (val.trim()) {
                                                    const bnxmailRegex = /^[a-zA-Z0-9._%+-]+@bnxmail\.com$/i;
                                                    if (!bnxmailRegex.test(val.trim())) {
                                                        setContactEmailError('Only official @bnxmail.com domain emails are permitted.');
                                                    } else {
                                                        setContactEmailError('');
                                                    }
                                                } else {
                                                    setContactEmailError('');
                                                }
                                            }} 
                                            style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: contactEmailError ? '1.5px solid #EF4444' : '1px solid #E2E8F0', outline: 'none' }} 
                                        />
                                        <span style={{ fontSize: '0.652rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.317rem' }}>
                                            <Mail size={12} /> Only @bnxmail.com accepted. Request will be sent for approval.
                                        </span>
                                        {contactEmailError && (
                                            <span style={{ fontSize: '0.68rem', color: '#EF4444', fontWeight: '700', marginTop: '0.272rem', display: 'block' }}>
                                                {contactEmailError}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {activeConfig.partyGroup && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Group</label>
                                        <select 
                                            value={contactForm.relationship || ''} 
                                            onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })}
                                            style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white' }}
                                        >
                                            <option value="">No Group</option>
                                            <option value="Family">Family</option>
                                            <option value="Friends">Friends</option>
                                            <option value="Clients">Clients</option>
                                            <option value="Vendors">Vendors</option>
                                            <option value="Staff">Staff</option>
                                            <option value="Consultants">Consultants</option>
                                        </select>
                                    </div>
                                )}

                                {activeConfig.partyStatus && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Status</label>
                                        <select 
                                            value={getContactMeta(contactForm.contact_info).status || 'active'} 
                                            onChange={(e) => {
                                                const meta = getContactMeta(contactForm.contact_info);
                                                setContactForm({ 
                                                    ...contactForm, 
                                                    contact_info: serializeContactMeta(e.target.value, meta.loyalty_points) 
                                                });
                                            }}
                                            style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white' }}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                )}

                                <button type="submit" disabled={createContactMutation.isPending || updateContactMutation.isPending} style={{ width: '100%', padding: '0.68rem 0.906rem', borderRadius: '12px', background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)', color: 'white', border: 'none', fontWeight: '800', fontSize: '0.861rem', cursor: 'pointer', marginTop: '0.453rem' }}>
                                    {editingContactId ? (updateContactMutation.isPending ? 'Updating Profile...' : 'Save Profile Changes') : (createContactMutation.isPending ? 'Saving Contact...' : 'Create Contact Node')}
                                </button>
                            </form>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal 2: Log Escrow Transaction */}
            <AnimatePresence>
                {isTxModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                        <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'white', width: '100%', maxWidth: '460px', borderRadius: '20px', padding: '1.586rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.359rem' }}>
                                <h3 style={{ fontSize: '1.133rem', fontWeight: '850', color: '#064E3B' }}>Record Peer Transaction</h3>
                                <button onClick={() => setIsTxModalOpen(false)} style={{ border: 'none', background: '#F1F5F9', padding: '0.544rem', borderRadius: '14px', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSaveTx} style={{ display: 'flex', flexDirection: 'column', gap: '1.133rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Target Network User</label>
                                    <select required value={txForm.person_id} onChange={(e) => setTxForm({ ...txForm, person_id: e.target.value })} style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white' }}>
                                        <option value="">Select contact from registry...</option>
                                        {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.68rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Entry Direction</label>
                                        <select value={txForm.type} onChange={(e) => setTxForm({ ...txForm, type: e.target.value })} style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white' }}>
                                            <option value="lent">I Lent Assets / Money</option>
                                            <option value="borrowed">I Borrowed Assets / Money</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Ledger Date</label>
                                        <input type="date" value={txForm.date} onChange={(e) => setTxForm({ ...txForm, date: e.target.value })} style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Value Cap Amount ({currency.symbol})</label>
                                    <input 
                                        required 
                                        type="text" 
                                        inputMode="decimal"
                                        maxLength={15}
                                        placeholder="0.00" 
                                        value={txForm.amount} 
                                        onChange={handleAmountChange} 
                                        style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.997rem', fontWeight: '900' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Asset narrative / Memo</label>
                                    <input placeholder="e.g., Advance for marketing services" type="text" value={txForm.description} onChange={(e) => setTxForm({ ...txForm, description: e.target.value })} style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }} />
                                </div>
                                <button type="submit" style={{ width: '100%', padding: '0.68rem 0.906rem', borderRadius: '12px', background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)', color: 'white', border: 'none', fontWeight: '800', fontSize: '0.861rem', cursor: 'pointer' }}>
                                    Authorize Entry Log
                                </button>
                            </form>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal 3: Setup Alert / Repayment Alert */}
            <AnimatePresence>
                {isReminderModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                        <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'white', width: '100%', maxWidth: '460px', borderRadius: '20px', padding: '1.586rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.359rem' }}>
                                <h3 style={{ fontSize: '1.133rem', fontWeight: '850', color: '#064E3B' }}>Schedule Repayment Alert</h3>
                                <button onClick={() => setIsReminderModalOpen(false)} style={{ border: 'none', background: '#F1F5F9', padding: '0.544rem', borderRadius: '14px', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSaveReminder} style={{ display: 'flex', flexDirection: 'column', gap: '1.133rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Target Contact <span style={{ color: '#EF4444' }}>*</span></label>
                                    <select required value={reminderForm.person_id} onChange={(e) => setReminderForm({ ...reminderForm, person_id: e.target.value })} style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', fontWeight: '600' }}>
                                        <option value="">Select contact...</option>
                                        {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', gap: '0.68rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Memo Label <span style={{ color: '#EF4444' }}>*</span></label>
                                        <input required placeholder="e.g. Loan Repayment Due" type="text" value={reminderForm.title} onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })} style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Claim Cap (₹)</label>
                                        <input 
                                            type="text" 
                                            inputMode="decimal"
                                            placeholder="0.00" 
                                            value={reminderForm.amount} 
                                            onChange={(e) => {
                                                let val = e.target.value.replace(/[^0-9.]/g, '');
                                                const parts = val.split('.');
                                                if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
                                                const intPart = parts[0].slice(0, 12);
                                                const decPart = parts.length > 1 ? '.' + parts[1].slice(0, 2) : '';
                                                val = intPart + decPart;
                                                setReminderForm({ ...reminderForm, amount: val });
                                            }} 
                                            style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: '900' }} 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Maturity / Due Date <span style={{ color: '#EF4444' }}>*</span></label>
                                    <input required type="date" value={reminderForm.due_date} onChange={(e) => setReminderForm({ ...reminderForm, due_date: e.target.value })} style={{ width: '100%', padding: '0.589rem 0.77rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }} />
                                </div>
                                <button type="submit" disabled={isSubmittingAlert || createReminderMutation.isPending} style={{ width: '100%', padding: '0.68rem 0.906rem', borderRadius: '12px', background: isSubmittingAlert || createReminderMutation.isPending ? '#94A3B8' : 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)', color: 'white', border: 'none', fontWeight: '800', fontSize: '0.997rem', cursor: isSubmittingAlert || createReminderMutation.isPending ? 'not-allowed' : 'pointer' }}>
                                    {isSubmittingAlert || createReminderMutation.isPending ? 'Scheduling Alert...' : 'Dispatch Repayment Alert'}
                                </button>
                            </form>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Modal 4: Person Detail Profile Modal */}
            <AnimatePresence>
                {selectedPersonId && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                        <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'white', width: '100%', maxWidth: '750px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.812rem', background: '#F0F9F4', borderBottom: '1px solid #DCF2E4' }}>
                                {isPersonDetailLoading ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', height: '80px' }}>
                                        <div className="premium-loader" style={{ width: '24px', height: '24px', border: '3px solid #DCF2E4', borderTopColor: '#1B6B3A', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                        <p style={{ margin: 0, fontWeight: '700', color: '#064E3B' }}>Accessing network dossier...</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: '1.359rem', alignItems: 'center' }}>
                                        {renderAvatar(personDetails?.name, 80)}
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', marginBottom: '0.227rem', flexWrap: 'wrap' }}>
                                                <h2 style={{ margin: 0, fontSize: '1.586rem', fontWeight: '900', color: '#064E3B', textTransform: 'uppercase' }}>{personDetails?.name}</h2>
                                                <span style={{ padding: '0.227rem 0.68rem', borderRadius: '8px', background: '#EFF6FF', color: '#1E40AF', fontSize: '0.634rem', fontWeight: '800', textTransform: 'uppercase' }}>{personDetails?.role_type}</span>
                                                {activeConfig.partyGroup && personDetails?.relationship && (
                                                    <span style={{ padding: '0.227rem 0.68rem', borderRadius: '8px', background: '#FEF3C7', color: '#D97706', fontSize: '0.634rem', fontWeight: '800', textTransform: 'uppercase' }}>Group: {personDetails.relationship}</span>
                                                )}
                                                {activeConfig.partyStatus && (
                                                    <span 
                                                        onClick={() => {
                                                            const meta = getContactMeta(personDetails.contact_info);
                                                            const newStatus = meta.status === 'active' ? 'inactive' : 'active';
                                                            const updatedMeta = serializeContactMeta(newStatus, meta.loyalty_points);
                                                            updateContactMutation.mutate({
                                                                id: personDetails.id,
                                                                data: { ...personDetails, contact_info: updatedMeta }
                                                            });
                                                        }}
                                                        style={{ padding: '0.227rem 0.68rem', borderRadius: '8px', background: getContactMeta(personDetails.contact_info).status === 'active' ? '#DCF2E4' : '#FEE2E2', color: getContactMeta(personDetails.contact_info).status === 'active' ? '#16A34A' : '#EF4444', fontSize: '0.634rem', fontWeight: '800', textTransform: 'uppercase', cursor: 'pointer' }}
                                                        title="Click to toggle status"
                                                    >
                                                        {getContactMeta(personDetails.contact_info).status}
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ margin: 0, color: '#64748B', fontWeight: '600', display: 'flex', gap: '0.906rem', fontSize: '0.77rem' }}>
                                                {personDetails?.company && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Building2 size={14} /> {personDetails.company}</span>}
                                                {personDetails?.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Phone size={14} /> {personDetails.phone}</span>}
                                                {personDetails?.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> {personDetails.email}</span>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '0.453rem', alignItems: 'center' }}>
                                    <button 
                                        onClick={() => handleSendWhatsAppReminder(personDetails, computedNetBalance)}
                                        style={{ border: 'none', background: 'white', padding: '0.544rem', borderRadius: '14px', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Share Contact"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                    <button onClick={() => setSelectedPersonId(null)} style={{ border: 'none', background: 'white', padding: '0.544rem', borderRadius: '14px', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div style={{ padding: '1.812rem', overflowY: 'auto', flex: 1, background: '#FAFAF9' }}>
                                {!isPersonDetailLoading && personDetails && (
                                    <>

                                        {/* Exposure Card */}
                                        <div style={{ background: computedNetBalance >= 0 ? '#ECFDF5' : '#FEF2F2', padding: '1.586rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.812rem', border: '1.5px solid', borderColor: computedNetBalance >= 0 ? '#A7F3D0' : '#FCA5A5', boxShadow: '0 4px 10px -2px rgba(0,0,0,0.02)' }}>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: '850', textTransform: 'uppercase', color: computedNetBalance >= 0 ? '#047857' : '#B91C1C', letterSpacing: '0.05em' }}>Consolidated Ledger Stand</p>
                                                <h3 style={{ margin: '0.317rem 0 0 0', fontSize: '2.039rem', fontWeight: '950', color: computedNetBalance >= 0 ? '#065F46' : '#991B1B', letterSpacing: '-0.03em' }}>
                                                    {formatCurr(computedNetBalance)}
                                                </h3>
                                                {activeConfig.payReminder && computedNetBalance !== 0 && (
                                                    <button 
                                                        onClick={() => handleSendWhatsAppReminder(personDetails, computedNetBalance)}
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: 'none', background: computedNetBalance >= 0 ? '#D1FAE5' : '#FEE2E2', color: computedNetBalance >= 0 ? '#065F46' : '#991B1B', padding: '0.363rem 0.725rem', borderRadius: '10px', fontSize: '0.68rem', fontWeight: '800', marginTop: '0.68rem', cursor: 'pointer' }}
                                                    >
                                                        <MessageSquare size={13} /> Send Payment Reminder
                                                    </button>
                                                )}
                                            </div>
                                            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: computedNetBalance >= 0 ? '#059669' : '#DC2626', boxShadow: '0 4px 6px rgba(0,0,0,0.04)' }}>
                                                {computedNetBalance >= 0 ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.812rem' }}>
                                            {/* Recent Ledger List */}
                                           <div>
    <div
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.68rem'
        }}
    >
        <h4
            style={{
                fontSize: '0.861rem',
                fontWeight: '900',
                color: '#1E293B',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
            }}
        >
            Direct Ledger Activity
        </h4>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.453rem' }}>
            <button
                onClick={() => {
                    setShowLedgerSearch(prev => !prev);

                    if (showLedgerSearch) {
                        setLedgerSearchTerm('');
                    }
                }}
                style={{
                    background: 'none',
                    border: 'none',
                    color: showLedgerSearch ? '#1B6B3A' : '#94A3B8',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex'
                }}
                title="Search entries"
            >
                <Search size={16} />
            </button>

            <ArrowLeftRight size={16} style={{ color: '#94A3B8' }} />
        </div>
    </div>

    {showLedgerSearch && (
        <div style={{ marginBottom: '0.68rem' }}>
            <input
                type="text"
                placeholder="Search by amount, date, or memo..."
                value={ledgerSearchTerm}
                onChange={(e) => setLedgerSearchTerm(e.target.value)}
                autoFocus
                style={{
                    width: '100%',
                    padding: '0.544rem 0.906rem',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    outline: 'none',
                    fontSize: '0.743rem',
                    fontWeight: '600',
                    color: '#1E293B',
                    background: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                    boxSizing: 'border-box'
                }}
            />
        </div>
    )}

    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.68rem',
            maxHeight: '320px',
            overflowY: 'auto'
        }}
    >
        {isPersonTxLoading ? (
            <p style={{ color: '#94A3B8', fontSize: '0.77rem' }}>
                Loading transactions...
            </p>
        ) : (!personTx ||
          (personTx.data
              ? personTx.data.length === 0
              : personTx.length === 0)) ? (
            <div
                style={{
                    padding: '1.812rem',
                    border: '2px dashed #E2E8F0',
                    borderRadius: '16px',
                    textAlign: 'center',
                    background: 'white'
                }}
            >
                <p
                    style={{
                        margin: 0,
                        color: '#94A3B8',
                        fontSize: '0.77rem',
                        fontStyle: 'italic',
                        fontWeight: '600'
                    }}
                >
                    Zero financial assets logged.
                </p>
            </div>
        ) : (
            (() => {
                const allTx = [...(personTx.data || personTx || [])].sort((a, b) => {
                    const dateA = new Date(a.date || a.execution_date || a.updatedAt || a.updated_at || a.createdAt || a.created_at || 0).getTime();
                    const dateB = new Date(b.date || b.execution_date || b.updatedAt || b.updated_at || b.createdAt || b.created_at || 0).getTime();
                    if (dateB !== dateA) return dateB - dateA;
                    return (Number(b.id) || 0) - (Number(a.id) || 0);
                });

                const filtered = ledgerSearchTerm.trim()
                    ? allTx.filter(t => {
                          const term = ledgerSearchTerm.toLowerCase().trim();

                          const matchDesc = (t.description || '')
                              .toLowerCase()
                              .includes(term);

                          const matchAmt = String(t.amount).includes(term);

                          const matchDate = new Date(t.date)
                              .toLocaleDateString('en-IN')
                              .includes(term);

                          const matchType = (t.type || '')
                              .toLowerCase()
                              .includes(term);

                          return (
                              matchDesc ||
                              matchAmt ||
                              matchDate ||
                              matchType
                          );
                      })
                    : allTx;

                return filtered.length === 0 ? (
                    <div
                        style={{
                            padding: '1.359rem',
                            border: '2px dashed #E2E8F0',
                            borderRadius: '16px',
                            textAlign: 'center',
                            background: 'white'
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                color: '#94A3B8',
                                fontSize: '0.77rem',
                                fontStyle: 'italic',
                                fontWeight: '600'
                            }}
                        >
                            No matching entries found for "
                            {ledgerSearchTerm}"
                        </p>
                    </div>
                ) : (
                    filtered.map((t, i) => (
                        <div
                            key={i}
                            style={{
                                padding: '0.997rem 1.133rem',
                                background: 'white',
                                border: '1px solid #E2E8F0',
                                borderRadius: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                                gap: '0.906rem'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.227rem',
                                    flex: 1
                                }}
                            >
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '0.816rem',
                                        fontWeight: '800',
                                        color: '#334155'
                                    }}
                                >
                                    {t.description || 'Registry entry'}
                                </p>

                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '0.68rem',
                                        color: '#94A3B8',
                                        fontWeight: '600'
                                    }}
                                >
                                    {new Date(t.date).toLocaleDateString(
                                        'en-IN'
                                    )}
                                </p>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.68rem'
                                }}
                            >
                                <div style={{ textAlign: 'right' }}>
                                    <span
                                        style={{
                                            fontSize: '0.952rem',
                                            fontWeight: '900',
                                            color:
                                                t.type === 'lent'
                                                    ? '#059669'
                                                    : '#DC2626'
                                        }}
                                    >
                                        {t.type === 'lent' ? '+' : '-'}
                                        {formatCurr(t.amount)}
                                    </span>

                                    <div
                                        style={{
                                            fontSize: '0.589rem',
                                            fontWeight: '850',
                                            textTransform: 'uppercase',
                                            color:
                                                t.type === 'lent'
                                                    ? '#10B981'
                                                    : '#EF4444',
                                            marginTop: '2px'
                                        }}
                                    >
                                        {t.type}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '0.317rem',
                                        borderLeft: '1px solid #E2E8F0',
                                        paddingLeft: '0.68rem',
                                        alignItems: 'center'
                                    }}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            setEditingTxId(t.id);

                                            setInlineTxForm({
                                                type: t.type,
                                                amount: t.amount,
                                                date: new Date(t.date)
                                                    .toISOString()
                                                    .split('T')[0],
                                                description:
                                                    t.description || ''
                                            });

                                            setIsInlineTxOpen(true);
                                            setIsInlineRemOpen(false);
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#94A3B8',
                                            cursor: 'pointer',
                                            transition: 'color 0.2s',
                                            padding: '4px'
                                        }}
                                        onMouseOver={(e) =>
                                            (e.currentTarget.style.color =
                                                '#7C3AED')
                                        }
                                        onMouseOut={(e) =>
                                            (e.currentTarget.style.color =
                                                '#94A3B8')
                                        }
                                        title="Edit Transaction"
                                    >
                                        <Edit2 size={15} />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            if (
                                                confirm(
                                                    'Are you sure you want to delete this transaction?'
                                                )
                                            ) {
                                                deleteTxMutation.mutate(t);
                                            }
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#94A3B8',
                                            cursor: 'pointer',
                                            transition: 'color 0.2s',
                                            padding: '4px'
                                        }}
                                        onMouseOver={(e) =>
                                            (e.currentTarget.style.color =
                                                '#EF4444')
                                        }
                                        onMouseOut={(e) =>
                                            (e.currentTarget.style.color =
                                                '#94A3B8')
                                        }
                                        title="Delete Transaction"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                );
            })()
        )}
    </div>
</div>

                                            {/* Specific Reminder Flows */}
                                            {/* Right Column: Reminders OR Inline Transaction Form OR Inline Reminder Form */}
                                            <AnimatePresence mode="wait">
                                                {isInlineTxOpen ? (
                                                    <Motion.div key="tx-form" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} style={{ background: '#F8FAFC', padding: '1.359rem', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.133rem' }}>
                                                            <h4 style={{ fontSize: '0.861rem', fontWeight: '900', color: '#064E3B', margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                                                                {editingTxId ? 'Edit Registry Entry' : 'Log New Entry'}
                                                            </h4>
                                                            <button type="button" onClick={() => { setIsInlineTxOpen(false); setEditingTxId(null); setInlineTxForm({ type: 'lent', amount: '', date: new Date().toISOString().split('T')[0], description: '' }); }} style={{ border: 'none', background: 'white', padding: '4px', borderRadius: '8px', cursor: 'pointer', display: 'flex', color: '#64748B' }}><X size={16} /></button>
                                                        </div>
                                                        <form onSubmit={handleSaveInlineTx} style={{ display: 'flex', flexDirection: 'column', gap: '0.906rem' }}>
                                                            <div>
                                                                <label style={{ display: 'block', fontSize: '0.634rem', fontWeight: '800', color: '#64748B', marginBottom: '0.227rem' }}>DIRECTION</label>
                                                                <select value={inlineTxForm.type} onChange={(e) => setInlineTxForm({ ...inlineTxForm, type: e.target.value })} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', outline: 'none', fontSize: '0.77rem' }}>
                                                                    <option value="lent">I Lent Money (+)</option>
                                                                    <option value="borrowed">I Borrowed Money (-)</option>
                                                                </select>
                                                            </div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.453rem' }}>
                                                                <div>
                                                                    <label style={{ display: 'block', fontSize: '0.634rem', fontWeight: '800', color: '#64748B', marginBottom: '0.227rem' }}>AMOUNT ({currency.symbol})</label>
                                                                    <input 
                                                                        required 
                                                                        type="text" 
                                                                        inputMode="decimal"
                                                                        maxLength={15}
                                                                        placeholder="0.00" 
                                                                        value={inlineTxForm.amount} 
                                                                        onChange={handleInlineTxAmountChange} 
                                                                        style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: '800', fontSize: '0.816rem' }} 
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label style={{ display: 'block', fontSize: '0.634rem', fontWeight: '800', color: '#64748B', marginBottom: '0.227rem' }}>DATE</label>
                                                                    <input type="date" value={inlineTxForm.date} onChange={(e) => setInlineTxForm({ ...inlineTxForm, date: e.target.value })} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.77rem' }} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label style={{ display: 'block', fontSize: '0.634rem', fontWeight: '800', color: '#64748B', marginBottom: '0.227rem' }}>MEMO / NARRATIVE</label>
                                                                <input placeholder="Registry note..." type="text" value={inlineTxForm.description} onChange={(e) => setInlineTxForm({ ...inlineTxForm, description: e.target.value })} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.77rem' }} />
                                                            </div>
                                                            <button type="submit" disabled={createTxMutation.isPending || updateTxMutation.isPending} style={{ width: '100%', padding: '0.68rem', borderRadius: '12px', background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)', color: 'white', border: 'none', fontWeight: '800', fontSize: '0.816rem', cursor: 'pointer', marginTop: '0.453rem' }}>
                                                                {createTxMutation.isPending || updateTxMutation.isPending ? 'Saving...' : editingTxId ? 'Update Entry' : 'Submit Entry'}
                                                            </button>
                                                        </form>
                                                    </Motion.div>
                                                ) : isInlineRemOpen ? (
                                                    <Motion.div key="rem-form" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} style={{ background: '#FFFBEB', padding: '1.359rem', borderRadius: '24px', border: '1px solid #FEF3C7' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.133rem' }}>
                                                            <h4 style={{ fontSize: '0.861rem', fontWeight: '900', color: '#B45309', margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Set Maturity Alarm</h4>
                                                            <button type="button" onClick={() => setIsInlineRemOpen(false)} style={{ border: 'none', background: 'white', padding: '4px', borderRadius: '8px', cursor: 'pointer', display: 'flex', color: '#D97706' }}><X size={16} /></button>
                                                        </div>
                                                        <form onSubmit={handleSaveInlineRem} style={{ display: 'flex', flexDirection: 'column', gap: '0.906rem' }}>
                                                            <div>
                                                                <label style={{ display: 'block', fontSize: '0.634rem', fontWeight: '800', color: '#B45309', marginBottom: '0.227rem' }}>PURPOSE / DETAILS</label>
                                                                <input required placeholder="e.g. Handloan Repayment Date" type="text" value={inlineRemForm.title} onChange={(e) => setInlineRemForm({ ...inlineRemForm, title: e.target.value })} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #FCD34D', outline: 'none', fontSize: '0.77rem' }} />
                                                            </div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.453rem' }}>
                                                                <div>
                                                                    <label style={{ display: 'block', fontSize: '0.634rem', fontWeight: '800', color: '#B45309', marginBottom: '0.227rem' }}>EXPECTED ({currency.symbol})</label>
                                                                    <input required type="number" placeholder="0.00" value={inlineRemForm.amount} onChange={(e) => setInlineRemForm({ ...inlineRemForm, amount: e.target.value })} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #FCD34D', outline: 'none', fontWeight: '800', fontSize: '0.816rem' }} />
                                                                </div>
                                                                <div>
                                                                    <label style={{ display: 'block', fontSize: '0.634rem', fontWeight: '800', color: '#B45309', marginBottom: '0.227rem' }}>DUE MATURITY</label>
                                                                    <input required type="date" value={inlineRemForm.due_date} onChange={(e) => setInlineRemForm({ ...inlineRemForm, due_date: e.target.value })} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #FCD34D', outline: 'none', fontSize: '0.77rem' }} />
                                                                </div>
                                                            </div>
                                                            <button type="submit" disabled={createReminderMutation.isPending || updateReminderMutation.isPending} style={{ width: '100%', padding: '0.68rem', borderRadius: '12px', background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)', color: 'white', border: 'none', fontWeight: '800', fontSize: '0.816rem', cursor: 'pointer', marginTop: '0.453rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                                <Bell size={16} /> {createReminderMutation.isPending || updateReminderMutation.isPending ? 'Saving...' : editingRemId ? 'Update Alarm' : 'Enable Alarm'}
                                                            </button>
                                                        </form>
                                                    </Motion.div>
                                                ) : (
                                                    <Motion.div key="reminders" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.133rem' }}>
                                                            <h4 style={{ fontSize: '0.861rem', fontWeight: '900', color: '#1E293B', margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Maturity Due Alerts</h4>
                                                            <Bell size={16} style={{ color: '#94A3B8' }} />
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.68rem' }}>
                                                            {isPersonRemLoading ? (
                                                                <p style={{ color: '#94A3B8', fontSize: '0.77rem' }}>Fetching deadlines...</p>
                                                            ) : (!personReminders || (personReminders.data ? personReminders.data.length === 0 : personReminders.length === 0)) ? (
                                                                <div style={{ padding: '1.812rem', border: '2px dashed #E2E8F0', borderRadius: '16px', textAlign: 'center', background: 'white' }}>
                                                                    <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.77rem', fontStyle: 'italic', fontWeight: '600' }}>All accounts cleared.</p>
                                                                </div>
                                                            ) : (
                                                                (personReminders.data || personReminders || []).slice(0, 4).map((rem, i) => (
                                                                    <div key={i} style={{ padding: '0.997rem 1.133rem', background: 'white', border: '1px solid #E2E8F0', borderLeft: '4px solid #F59E0B', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.453rem', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                            <span style={{ fontSize: '0.77rem', fontWeight: '800', color: '#334155' }}>{rem.title}</span>
                                                                            <span style={{ fontSize: '0.861rem', fontWeight: '900', color: '#1E293B' }}>{(rem.amount !== undefined && rem.amount !== null && rem.amount !== '') ? formatCurr(rem.amount) : ''}</span>
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: '#E11D48', fontWeight: '800' }}>
                                                                                <Calendar size={12} />
                                                                                <span>Matures: {new Date(rem.due_date).toLocaleDateString('en-IN')}</span>
                                                                            </div>
                                                                            <div style={{ display: 'flex', gap: '0.453rem' }}>
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        setEditingRemId(rem.id);
                                                                                        setInlineRemForm({
                                                                                            title: rem.title,
                                                                                            amount: rem.amount !== null && rem.amount !== undefined ? rem.amount : '',
                                                                                            due_date: new Date(rem.due_date).toISOString().split('T')[0]
                                                                                        });
                                                                                        setIsInlineRemOpen(true);
                                                                                        setIsInlineTxOpen(false);
                                                                                    }}
                                                                                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', display: 'flex' }}
                                                                                    title="Edit Alert"
                                                                                >
                                                                                    <Edit2 size={14} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        if (window.confirm('Are you sure you want to delete this alert?')) {
                                                                                            deleteReminderMutation.mutate(rem);
                                                                                        }
                                                                                    }}
                                                                                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', display: 'flex' }}
                                                                                    title="Delete Alert"
                                                                                >
                                                                                    <Trash2 size={14} />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </Motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </>
                                )}
                            </div>
                            {/* Footer */}
                            <div style={{ padding: '0.816rem 0.906rem', borderTop: '1px solid #E2E8F0', background: 'white', display: 'flex', justifyContent: 'flex-end', gap: '0.906rem' }}>
                                {!isInlineRemOpen && (
                                    <button onClick={() => { setIsInlineTxOpen(prev => !prev); setIsInlineRemOpen(false); if (isInlineTxOpen) { setEditingTxId(null); setInlineTxForm({ type: 'lent', amount: '', date: new Date().toISOString().split('T')[0], description: '' }); } }} style={{ padding: '0.68rem 1.359rem', borderRadius: '12px', background: isInlineTxOpen ? '#FEE2E2' : '#F1F5F9', border: 'none', color: isInlineTxOpen ? '#991B1B' : '#475569', fontWeight: '750', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {isInlineTxOpen ? 'Cancel Entry' : <><Plus size={15} /> Record Transaction</>}
                                    </button>
                                )}
                                {!isInlineTxOpen && (
                                    <button onClick={() => { setIsInlineRemOpen(prev => !prev); setIsInlineTxOpen(false); if (isInlineRemOpen) { setEditingRemId(null); setInlineRemForm({ title: '', amount: '', due_date: new Date().toISOString().split('T')[0] }); } }} style={{ padding: '0.68rem 1.359rem', borderRadius: '12px', background: isInlineRemOpen ? '#FEF2F2' : '#FEF3C7', border: 'none', color: isInlineRemOpen ? '#991B1B' : '#D97706', fontWeight: '750', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {isInlineRemOpen ? 'Cancel Alarm' : <><Bell size={15} /> Set Maturity Due</>}
                                    </button>
                                )}
                            </div>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal 5: Ledger Statement & Payment Reminder Modal */}
            <AnimatePresence>
                {isShareModalOpen && shareModalData && (() => {
                    const person = shareModalData.person;
                    const balance = parseFloat(shareModalData.balance) || 0;
                    const isReceivable = balance >= 0;
                    
                    // Sender info
                    const senderName = userProfile?.name || 'CliKs User';
                    const senderPhone = userProfile?.phone || '';
                    
                    // Format date elegantly (e.g. 25 May 26)
                    const formatDateToLabel = (dateStr) => {
                        try {
                            const d = new Date(dateStr);
                            if (isNaN(d.getTime())) return dateStr;
                            const day = d.getDate();
                            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            const month = monthNames[d.getMonth()];
                            const yearStr = d.getFullYear().toString().slice(-2);
                            return `${day} ${month} ${yearStr}`;
                        } catch {
                            return dateStr;
                        }
                    };
                    
                    const displayDate = formatDateToLabel(shareDate);

                    const drawCardToCanvas = (canvas) => {
                        const ctx = canvas.getContext('2d');

                        // Background
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, 800, 600);

                        // Card Outline
                        ctx.strokeStyle = '#F1F5F9';
                        ctx.lineWidth = 6;
                        ctx.strokeRect(15, 15, 770, 570);
                        
                        ctx.strokeStyle = '#E2E8F0';
                        ctx.lineWidth = 1.5;
                        ctx.strokeRect(20, 20, 760, 560);

                        // Draw golden mandala ornament (vector rotation)
                        ctx.save();
                        ctx.translate(680, 120);
                        ctx.strokeStyle = 'rgba(196, 160, 89, 0.12)'; // Delicate soft golden tone
                        ctx.lineWidth = 1.5;
                        for (let i = 0; i < 16; i++) {
                            ctx.beginPath();
                            ctx.arc(35, 0, 75, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.rotate((Math.PI * 2) / 16);
                        }
                        ctx.restore();

                        // Header Text
                        ctx.fillStyle = '#475569';
                        ctx.font = '600 28px system-ui, -apple-system, sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(isReceivable ? 'Payment reminder for' : 'Ledger stand statement for', 400, 150);

                        // Amount (receivable red, payable green)
                        ctx.fillStyle = isReceivable ? '#DC2626' : '#16A34A';
                        ctx.font = '900 76px system-ui, -apple-system, sans-serif';
                        ctx.fillText(`${currency.symbol} ${parseFloat(shareAmount || 0).toLocaleString()}`, 400, 250);

                        // Date
                        ctx.fillStyle = '#64748B';
                        ctx.font = '600 24px system-ui, -apple-system, sans-serif';
                        ctx.fillText(`on ${displayDate}`, 400, 320);

                        // Divider Line
                        ctx.strokeStyle = '#E2E8F0';
                        ctx.lineWidth = 2.5;
                        ctx.beginPath();
                        ctx.moveTo(180, 380);
                        ctx.lineTo(620, 380);
                        ctx.stroke();

                        // Sent By Name
                        ctx.fillStyle = '#1E293B';
                        ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
                        ctx.fillText(`Sent by ${senderName}`, 400, 440);

                        // Sent By Details
                        ctx.fillStyle = '#64748B';
                        ctx.font = '500 22px system-ui, -apple-system, sans-serif';
                        ctx.fillText(`${senderName}${senderPhone ? ` | ${senderPhone}` : ''}`, 400, 495);

                        // Brand Seal
                        ctx.fillStyle = '#059669';
                        ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
                        ctx.fillText('CLIKS BUSINESS STATEMENT LOG', 400, 555);
                    };

                    const handleDownloadCard = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = 800;
                        canvas.height = 600;
                        drawCardToCanvas(canvas);

                        const link = document.createElement('a');
                        link.download = `ledger_reminder_${person?.name?.replace(/\s+/g, '_') || 'statement'}.png`;
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    };

                    // Format full clipboard/WhatsApp message text block
                    const whatsappMsg = `${senderName} (${senderPhone}) has requested a payment of ${currency.symbol}${parseFloat(shareAmount || 0).toLocaleString()} on CliKs.\n\n*Statement details for ${person?.name}:*\n- *Net Ledger Standing:* ${currency.symbol}${parseFloat(shareAmount || 0).toLocaleString()} (${isReceivable ? 'Receivable' : 'Payable'})\n- *Statement Date:* ${displayDate}\n\nPlease check details and settle the standing ledger. Thank you,\n${senderName}.`;

                    const handleCopyCardAndText = async () => {
                        try {
                            const canvas = document.createElement('canvas');
                            canvas.width = 800;
                            canvas.height = 600;
                            drawCardToCanvas(canvas);

                            canvas.toBlob(async (blob) => {
                                if (!blob) {
                                    alert('Failed to generate card image Blob.');
                                    return;
                                }
                                try {
                                    // Construct clipboard item containing both PNG screenshot and text
                                    const clipboardItem = new ClipboardItem({
                                        'image/png': blob,
                                        'text/plain': new Blob([whatsappMsg], { type: 'text/plain' })
                                    });
                                    await navigator.clipboard.write([clipboardItem]);
                                    alert('Screenshot card and text statement both copied to clipboard! Paste it directly (Cmd+V) in WhatsApp.');
                                } catch (err) {
                                    console.error('Unified clipboard copy failed, falling back to text:', err);
                                    // Fallback to text if mixed copy is blocked
                                    await navigator.clipboard.writeText(whatsappMsg);
                                    alert('Ledger statement text copied to clipboard! (Image copy was restricted by browser/context).');
                                }
                            }, 'image/png');
                        } catch (err) {
                            console.error('Failed to copy card & text:', err);
                            alert('Failed to copy. Please try again.');
                        }
                    };

                    const handleWhatsAppShare = () => {
                        const targetPhone = person?.phone ? person.phone.replace(/[^0-9]/g, '') : '';
                        const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(whatsappMsg)}`;
                        window.open(waUrl, '_blank');
                    };

                    return (
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(10px)' }}>
                            <Motion.div 
                                initial={{ opacity: 0, y: 20, scale: 0.98 }} 
                                animate={{ opacity: 1, y: 0, scale: 1 }} 
                                exit={{ opacity: 0, y: 20, scale: 0.98 }} 
                                style={{ background: '#F8FAFC', width: '92%', maxWidth: '820px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
                            >
                                {/* Header Banner */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.816rem 0.906rem', background: '#FFFFFF', borderBottom: '1.5px solid #F1F5F9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ background: '#ECFDF5', padding: '8px', borderRadius: '12px', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Share2 size={20} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.042rem', fontWeight: '900', color: '#064E3B' }}>Share Ledger Reminder</h3>
                                            <span style={{ fontSize: '0.652rem', color: '#64748B', fontWeight: '600' }}>Customize and send a premium statement log to {person?.name}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsShareModalOpen(false)} style={{ border: 'none', background: '#F1F5F9', padding: '0.589rem', borderRadius: '14px', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                                </div>

                                {/* Body Container split in two columns */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.1fr) 1fr', overflowY: 'auto', flex: 1, background: '#F8FAFC' }} className="share-grid-responsive">
                                    
                                    {/* Left Side: Controls */}
                                    <div style={{ padding: '1.812rem', display: 'flex', flexDirection: 'column', gap: '1.359rem', borderRight: '1.5px solid #F1F5F9' }}>
                                        
                                        {/* Amount input */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.652rem', fontWeight: '850', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.408rem' }}>Outstanding Amount ({currency.symbol})</label>
                                            <div style={{ position: 'relative' }}>
                                                <input 
                                                    type="text" 
                                                    readOnly
                                                    disabled
                                                    value={parseFloat(shareAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                                                    style={{ width: '100%', padding: '0.77rem 0.906rem', paddingLeft: '1.812rem', borderRadius: '14px', border: '1.5px solid #E2E8F0', fontSize: '1.042rem', fontWeight: '900', outline: 'none', color: isReceivable ? '#DC2626' : '#16A34A', background: '#F1F5F9', cursor: 'not-allowed', boxSizing: 'border-box' }} 
                                                />
                                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: '900', fontSize: '1.133rem', color: '#94A3B8' }}>{currency.symbol}</span>
                                            </div>
                                        </div>

                                        {/* Date selector */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.652rem', fontWeight: '850', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.408rem' }}>Maturity / Statement Date</label>
                                            <input 
                                                type="date" 
                                                value={shareDate} 
                                                onChange={(e) => setShareDate(e.target.value)} 
                                                style={{ width: '100%', padding: '0.77rem 0.906rem', borderRadius: '14px', border: '1.5px solid #E2E8F0', fontSize: '0.816rem', fontWeight: '750', outline: 'none', background: 'white' }} 
                                            />
                                        </div>

                                        {/* Action buttons */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.68rem', marginTop: 'auto' }}>
                                            <button 
                                                onClick={handleWhatsAppShare} 
                                                style={{ width: '100%', padding: '0.816rem', borderRadius: '16px', border: 'none', background: '#16A34A', color: 'white', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)' }}
                                            >
                                                <MessageSquare size={18} />
                                                <span>Share on WhatsApp</span>
                                            </button>
                                            
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.453rem' }}>
                                                <button 
                                                    onClick={handleDownloadCard} 
                                                    style={{ padding: '0.77rem', borderRadius: '14px', border: '1.5px solid #E2E8F0', background: 'white', color: '#334155', fontWeight: '800', fontSize: '0.725rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                                                >
                                                    <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} />
                                                    <span>Get PNG Card</span>
                                                </button>
                                                
                                                <button 
                                                    onClick={handleCopyCardAndText} 
                                                    style={{ padding: '0.77rem', borderRadius: '14px', border: '1.5px solid #E2E8F0', background: 'white', color: '#334155', fontWeight: '800', fontSize: '0.725rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                                                >
                                                    <CheckCircle2 size={16} />
                                                    <span>Copy Card & Text</span>
                                                </button>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Right Side: Live Visual Preview */}
                                    <div style={{ padding: '1.812rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9' }}>
                                        <div style={{ background: 'white', width: '100%', maxWidth: '340px', borderRadius: '24px', padding: '1.586rem', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                                            
                                            {/* Mandala Ornament SVG (Elegant Flower Motif) */}
                                            <svg style={{ position: 'absolute', top: '-10px', right: '-10px', width: '130px', height: '130px', opacity: 0.22, pointerEvents: 'none' }} viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="46" fill="none" stroke="#C4A059" strokeWidth="0.5" strokeDasharray="1 1" />
                                                <circle cx="50" cy="50" r="38" fill="none" stroke="#C4A059" strokeWidth="0.5" />
                                                {[...Array(12)].map((_, i) => (
                                                    <g key={i} transform={`rotate(${i * 30} 50 50)`}>
                                                        <path d="M 50 12 C 58 35, 42 35, 50 12 Z" fill="none" stroke="#C4A059" strokeWidth="0.6" />
                                                        <circle cx="50" cy="24" r="2.5" fill="none" stroke="#C4A059" strokeWidth="0.5" />
                                                    </g>
                                                ))}
                                            </svg>

                                            <div style={{ textAlign: 'center', marginTop: '0.906rem', position: 'relative', zIndex: 1 }}>
                                                <p style={{ margin: 0, fontSize: '0.743rem', fontWeight: '750', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    {isReceivable ? 'Payment reminder for' : 'Ledger stand statement for'}
                                                </p>
                                                
                                                <h2 style={{ margin: '0.68rem 0', fontSize: '2.084rem', fontWeight: '950', color: isReceivable ? '#DC2626' : '#16A34A', letterSpacing: '-0.02em' }}>
                                                    {currency.symbol}{parseFloat(shareAmount || 0).toLocaleString()}
                                                </h2>
                                                
                                                <p style={{ margin: 0, fontSize: '0.707rem', fontWeight: '700', color: '#64748B' }}>
                                                    on {displayDate}
                                                </p>
                                            </div>

                                            {/* Center Divider */}
                                            <div style={{ height: '1px', borderTop: '2px dashed #E2E8F0', margin: '1.812rem 0.906rem' }}></div>

                                            <div style={{ textAlign: 'center', marginBottom: '0.906rem' }}>
                                                <span style={{ display: 'block', fontSize: '0.77rem', fontWeight: '800', color: '#1E293B' }}>
                                                    Sent by {senderName}
                                                </span>
                                                <span style={{ display: 'block', fontSize: '0.634rem', fontWeight: '600', color: '#64748B', marginTop: '3px' }}>
                                                    {senderName}{senderPhone ? ` | ${senderPhone}` : ''}
                                                </span>
                                            </div>

                                            {/* Bottom Brand Seal */}
                                            <div style={{ textAlign: 'center', marginTop: '2.266rem' }}>
                                                <span style={{ fontSize: '0.471rem', fontWeight: '900', color: '#10B981', letterSpacing: '0.15em', textTransform: 'uppercase', background: '#ECFDF5', padding: '4px 10px', borderRadius: '999px', border: '1px solid #A7F3D0' }}>
                                                    CLIKS BUSINESS STATEMENT
                                                </span>
                                            </div>

                                        </div>
                                    </div>

                                </div>

                                {/* Custom Responsive CSS styles injected inline to ensure columns stack on mobile */}
                                <style>
                                    {`
                                        @media (max-width: 680px) {
                                            .share-grid-responsive {
                                                grid-template-columns: 1fr !important;
                                            }
                                        }
                                    `}
                                </style>

                            </Motion.div>
                        </div>
                    );
                })()}
            </AnimatePresence>

            {/* Modal: Create Financial Group */}
            <AnimatePresence>
                {isCreateGroupModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(8px)', padding: '0.906rem' }}>
                        <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'white', width: '100%', maxWidth: '580px', borderRadius: '28px', padding: '1.812rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.133rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#ECFDF5', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FolderKanban size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.087rem', fontWeight: '900', color: '#0F172A' }}>New Financial Group</h3>
                                        <p style={{ margin: 0, fontSize: '0.707rem', color: '#64748B' }}>Create a shared syndicate or pool with verified @bnxmail.com partners</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsCreateGroupModalOpen(false)} style={{ border: 'none', background: '#F1F5F9', padding: '0.453rem', borderRadius: '12px', cursor: 'pointer' }}>
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (!newGroupForm.name.trim()) return alert('Please enter a group name');
                                createGroupMutation.mutate({
                                    ...newGroupForm,
                                    target_amount: Number(newGroupForm.target_amount) || 0
                                });
                            }} style={{ display: 'flex', flexDirection: 'column', gap: '1.042rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Group Title <span style={{ color: '#EF4444' }}>*</span></label>
                                    <input 
                                        required 
                                        placeholder="e.g. Q4 Inventory Syndicate or Retail Expansion Pool" 
                                        type="text" 
                                        value={newGroupForm.name} 
                                        onChange={(e) => setNewGroupForm({ ...newGroupForm, name: e.target.value })} 
                                        style={{ width: '100%', padding: '0.68rem 0.906rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.816rem' }} 
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.68rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Group Financial Model</label>
                                        <select 
                                            value={newGroupForm.group_type} 
                                            onChange={(e) => setNewGroupForm({ ...newGroupForm, group_type: e.target.value })} 
                                            style={{ width: '100%', padding: '0.68rem 0.906rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontSize: '0.77rem', fontWeight: '700' }}
                                        >
                                            <option value="syndicate">Business Syndicate</option>
                                            <option value="pool">Savings & Contribution Pool</option>
                                            <option value="project">Project Expenses</option>
                                            <option value="credit">Lending & Credit Circle</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Target Pool Amount (Optional)</label>
                                        <input 
                                            placeholder="e.g. 500000" 
                                            type="number" 
                                            value={newGroupForm.target_amount} 
                                            onChange={(e) => setNewGroupForm({ ...newGroupForm, target_amount: e.target.value })} 
                                            style={{ width: '100%', padding: '0.68rem 0.906rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.816rem' }} 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Description & Purpose</label>
                                    <textarea 
                                        placeholder="Outline capital objectives, expense boundaries, or settlement frequency..." 
                                        rows={2}
                                        value={newGroupForm.description} 
                                        onChange={(e) => setNewGroupForm({ ...newGroupForm, description: e.target.value })} 
                                        style={{ width: '100%', padding: '0.68rem 0.906rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.77rem' }} 
                                    />
                                </div>

                                {/* Member Invitations Sub-Section */}
                                <div style={{ padding: '0.906rem', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.68rem' }}>
                                        <label style={{ fontSize: '0.707rem', fontWeight: '850', color: '#1E293B' }}>
                                            Invite Group Partners (Strictly @bnxmail.com)
                                        </label>
                                        <span style={{ fontSize: '0.652rem', color: '#64748B' }}>
                                            {newGroupForm.members.length} invited
                                        </span>
                                    </div>

                                    {/* Partner Input Row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr 1fr auto', gap: '0.453rem', alignItems: 'center' }}>
                                        <input 
                                            placeholder="Name" 
                                            value={tempMemberInput.name} 
                                            onChange={(e) => setTempMemberInput({ ...tempMemberInput, name: e.target.value })} 
                                            style={{ padding: '0.544rem 0.68rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.725rem', outline: 'none' }} 
                                        />
                                        <input 
                                            placeholder="partner@bnxmail.com" 
                                            value={tempMemberInput.email} 
                                            onChange={(e) => {
                                                setTempMemberInput({ ...tempMemberInput, email: e.target.value });
                                                setTempMemberEmailError('');
                                            }}
                                            style={{ padding: '0.544rem 0.68rem', borderRadius: '8px', border: tempMemberEmailError ? '1.5px solid #EF4444' : '1px solid #CBD5E1', fontSize: '0.725rem', outline: 'none' }} 
                                        />
                                        <select 
                                            value={tempMemberInput.role} 
                                            onChange={(e) => setTempMemberInput({ ...tempMemberInput, role: e.target.value })} 
                                            style={{ padding: '0.544rem 0.453rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'white', fontSize: '0.68rem', fontWeight: '700' }}
                                        >
                                            <option value="member">Member</option>
                                            <option value="manager">Manager</option>
                                            <option value="auditor">Auditor</option>
                                        </select>
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const email = (tempMemberInput.email || '').trim().toLowerCase();
                                                const bnxRegex = /^[a-zA-Z0-9._%+-]+@bnxmail\.com$/i;
                                                if (!email) {
                                                    setTempMemberEmailError('Email required');
                                                    return;
                                                }
                                                if (!bnxRegex.test(email)) {
                                                    setTempMemberEmailError('Only @bnxmail.com allowed');
                                                    return;
                                                }
                                                if (newGroupForm.members.some(m => m.email === email)) {
                                                    setTempMemberEmailError('Already added');
                                                    return;
                                                }
                                                setNewGroupForm({
                                                    ...newGroupForm,
                                                    members: [...newGroupForm.members, {
                                                        name: (tempMemberInput.name || email.split('@')[0]).trim(),
                                                        email,
                                                        role: tempMemberInput.role
                                                    }]
                                                });
                                                setTempMemberInput({ name: '', email: '', role: 'member' });
                                                setTempMemberEmailError('');
                                            }}
                                            style={{ padding: '0.544rem 0.77rem', borderRadius: '8px', background: '#064E3B', color: 'white', border: 'none', fontWeight: '750', fontSize: '0.725rem', cursor: 'pointer' }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {tempMemberEmailError && (
                                        <p style={{ margin: '0.363rem 0 0 0', fontSize: '0.652rem', color: '#EF4444', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <AlertCircle size={12} /> {tempMemberEmailError}
                                        </p>
                                    )}

                                    {/* Invited Members Badges List */}
                                    {newGroupForm.members.length > 0 && (
                                        <div style={{ marginTop: '0.68rem', display: 'flex', flexWrap: 'wrap', gap: '0.453rem' }}>
                                            {newGroupForm.members.map((m, idx) => (
                                                <div key={idx} style={{ background: '#FFFFFF', padding: '0.317rem 0.589rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem' }}>
                                                    <span style={{ fontWeight: '800', color: '#1E293B' }}>{m.name}</span>
                                                    <span style={{ color: '#64748B' }}>({m.email})</span>
                                                    <span style={{ padding: '0.091rem 0.317rem', borderRadius: '4px', background: '#ECFDF5', color: '#065F46', fontSize: '0.589rem', fontWeight: '800' }}>{m.role}</span>
                                                    <X 
                                                        size={12} 
                                                        style={{ cursor: 'pointer', color: '#EF4444' }} 
                                                        onClick={() => {
                                                            setNewGroupForm({
                                                                ...newGroupForm,
                                                                members: newGroupForm.members.filter((_, i) => i !== idx)
                                                            });
                                                        }} 
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '0.68rem', marginTop: '0.453rem' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsCreateGroupModalOpen(false)} 
                                        style={{ flex: 1, padding: '0.68rem', borderRadius: '12px', border: '1px solid #CBD5E1', background: 'white', fontWeight: '750', fontSize: '0.77rem', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={createGroupMutation.isPending}
                                        style={{ flex: 2, padding: '0.68rem', borderRadius: '12px', border: 'none', background: '#064E3B', color: 'white', fontWeight: '800', fontSize: '0.77rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        {createGroupMutation.isPending ? 'Dispatching Invites...' : 'Create Group & Send Invites'}
                                    </button>
                                </div>
                            </form>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal: Full Group Details & Financial Ledger */}
            <AnimatePresence>
                {selectedGroupId && selectedGroupDetails && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050, backdropFilter: 'blur(8px)', padding: '1.133rem' }}>
                        <Motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} style={{ background: '#FFFFFF', width: '100%', maxWidth: '960px', height: '88vh', borderRadius: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            {/* Header */}
                            <div style={{ padding: '0.816rem 0.906rem', background: '#064E3B', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.906rem' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FolderKanban size={24} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.178rem', fontWeight: '900', color: 'white' }}>{selectedGroupDetails.name}</h3>
                                            <span style={{ padding: '0.181rem 0.544rem', borderRadius: '6px', background: 'rgba(255,255,255,0.2)', fontSize: '0.634rem', fontWeight: '800', textTransform: 'uppercase' }}>
                                                {selectedGroupDetails.group_type}
                                            </span>
                                        </div>
                                        {selectedGroupDetails.description && (
                                            <p style={{ margin: '0.181rem 0 0 0', fontSize: '0.725rem', color: '#A7F3D0' }}>{selectedGroupDetails.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem' }}>
                                    <button 
                                        onClick={() => setIsAddGroupTxModalOpen(true)}
                                        style={{ padding: '0.544rem 0.906rem', borderRadius: '10px', background: '#10B981', color: 'white', border: 'none', fontWeight: '800', fontSize: '0.725rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <Plus size={14} /> Record Entry
                                    </button>
                                    <button 
                                        onClick={() => setIsInviteMemberModalOpen(true)}
                                        style={{ padding: '0.544rem 0.906rem', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', fontWeight: '800', fontSize: '0.725rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <UserPlus size={14} /> Invite Member
                                    </button>
                                    <button onClick={() => setSelectedGroupId(null)} style={{ border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.453rem', borderRadius: '10px', cursor: 'pointer' }}>
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Subtab Navigator */}
                            <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', padding: '0 1.812rem', background: '#F8FAFC' }}>
                                {[
                                    { id: 'balances', label: 'Net Balances & Overview', icon: PieChart },
                                    { id: 'transactions', label: `Transactions (${selectedGroupDetails.transactions?.length || 0})`, icon: ArrowLeftRight },
                                    { id: 'members', label: `Members (${selectedGroupDetails.members?.length || 0})`, icon: Users }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setGroupActiveSubTab(tab.id)}
                                        style={{
                                            padding: '0.906rem 1.359rem',
                                            border: 'none',
                                            background: 'none',
                                            borderBottom: groupActiveSubTab === tab.id ? '3px solid #064E3B' : '3px solid transparent',
                                            color: groupActiveSubTab === tab.id ? '#064E3B' : '#64748B',
                                            fontWeight: groupActiveSubTab === tab.id ? '850' : '650',
                                            fontSize: '0.77rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <tab.icon size={16} /> {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Modal Content Body */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.812rem' }}>
                                {/* SUBTAB 1: Net Balances & Summary */}
                                {groupActiveSubTab === 'balances' && (
                                    <div>
                                        {/* Financial Highlights */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.906rem', marginBottom: '1.812rem' }}>
                                            <div style={{ padding: '1.133rem', background: '#F0FDF4', borderRadius: '18px', border: '1px solid #BBF7D0' }}>
                                                <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>Total Contributed</p>
                                                <h3 style={{ margin: '0.317rem 0 0 0', fontSize: '1.269rem', fontWeight: '900', color: '#065F46' }}>
                                                    {formatCurr(selectedGroupDetails.summary?.total_contributed || 0)}
                                                </h3>
                                            </div>
                                            <div style={{ padding: '1.133rem', background: '#FEF2F2', borderRadius: '18px', border: '1px solid #FECACA' }}>
                                                <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: '800', color: '#991B1B', textTransform: 'uppercase' }}>Total Expenses</p>
                                                <h3 style={{ margin: '0.317rem 0 0 0', fontSize: '1.269rem', fontWeight: '900', color: '#991B1B' }}>
                                                    {formatCurr(selectedGroupDetails.summary?.total_expenses || 0)}
                                                </h3>
                                            </div>
                                            <div style={{ padding: '1.133rem', background: '#EFF6FF', borderRadius: '18px', border: '1px solid #BFDBFE' }}>
                                                <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: '800', color: '#1E40AF', textTransform: 'uppercase' }}>Net Fund In Hand</p>
                                                <h3 style={{ margin: '0.317rem 0 0 0', fontSize: '1.269rem', fontWeight: '900', color: '#1D4ED8' }}>
                                                    {formatCurr(Math.max(0, (selectedGroupDetails.summary?.total_contributed || 0) - (selectedGroupDetails.summary?.total_expenses || 0)))}
                                                </h3>
                                            </div>
                                            <div style={{ padding: '1.133rem', background: '#F8FAFC', borderRadius: '18px', border: '1px solid #E2E8F0' }}>
                                                <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Target Pool</p>
                                                <h3 style={{ margin: '0.317rem 0 0 0', fontSize: '1.269rem', fontWeight: '900', color: '#1E293B' }}>
                                                    {selectedGroupDetails.target_amount > 0 ? formatCurr(selectedGroupDetails.target_amount) : 'Open Pool'}
                                                </h3>
                                            </div>
                                            <div style={{ padding: '1.133rem', background: '#F0FDF4', borderRadius: '18px', border: '1.5px solid #86EFAC' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <p style={{ margin: 0, fontSize: '0.652rem', fontWeight: '850', color: '#166534', textTransform: 'uppercase' }}>To Give (Private)</p>
                                                    <span style={{ fontSize: '0.589rem', fontWeight: '800', background: '#DCFCE7', color: '#15803D', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                        <Lock size={10} /> Only You
                                                    </span>
                                                </div>
                                                <h3 style={{ margin: '0.317rem 0 0 0', fontSize: '1.269rem', fontWeight: '900', color: '#14532D' }}>
                                                    {formatCurr(selectedGroupDetails.summary?.total_private_commitments || 0)}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Member Ledger Matrix */}
                                        <h4 style={{ fontSize: '0.906rem', fontWeight: '850', color: '#0F172A', marginBottom: '0.906rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <ShieldCheck size={18} style={{ color: '#064E3B' }} /> Member Financial Positions & Net Dues
                                        </h4>
                                        <div className="cliks-table-scroll" style={{ background: 'white', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                                            <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                                <thead>
                                                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                                        <th style={{ padding: '0.589rem 0.78rem', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', whiteSpace: 'nowrap' }}>Member</th>
                                                        <th style={{ padding: '0.589rem 0.78rem', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', whiteSpace: 'nowrap' }}>Role / Status</th>
                                                        <th style={{ padding: '0.589rem 0.78rem', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', textAlign: 'right', whiteSpace: 'nowrap' }}>Total Paid</th>
                                                        <th style={{ padding: '0.589rem 0.78rem', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', textAlign: 'right', whiteSpace: 'nowrap' }}>Contributed</th>
                                                        <th style={{ padding: '0.589rem 0.78rem', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', textAlign: 'right', whiteSpace: 'nowrap' }}>Owed</th>
                                                        <th style={{ padding: '0.589rem 0.78rem', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', textAlign: 'right', whiteSpace: 'nowrap' }}>Net Balance</th>
                                                        <th style={{ padding: '0.589rem 0.78rem', fontSize: '0.68rem', fontWeight: '800', color: '#047857', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                                                                <Lock size={11} /> Money to Give
                                                            </span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(selectedGroupDetails.balances || []).map(b => (
                                                        <tr key={b.member_id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                            <td style={{ padding: '0.589rem 0.78rem', maxWidth: '180px' }} title={`${b.name || ''} (${b.email || ''})`}>
                                                                <p style={{ margin: 0, fontWeight: '800', fontSize: '0.77rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</p>
                                                                <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.email}</p>
                                                            </td>
                                                            <td className="cell-nowrap" style={{ padding: '0.589rem 0.78rem', whiteSpace: 'nowrap' }}>
                                                                <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', whiteSpace: 'nowrap' }}>
                                                                    <span className="badge-nowrap" style={{ padding: '0.136rem 0.408rem', borderRadius: '4px', background: '#F1F5F9', color: '#334155', fontSize: '0.616rem', fontWeight: '800' }}>{b.role}</span>
                                                                    <span className="badge-nowrap" style={{ padding: '0.136rem 0.408rem', borderRadius: '4px', background: b.status === 'accepted' ? '#ECFDF5' : '#FEF3C7', color: b.status === 'accepted' ? '#065F46' : '#92400E', fontSize: '0.616rem', fontWeight: '800' }}>
                                                                        {b.status === 'accepted' ? 'Active' : 'Pending Invite'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="cell-num" style={{ padding: '0.589rem 0.78rem', textAlign: 'right', fontWeight: '750', color: '#1E293B', fontSize: '0.77rem', whiteSpace: 'nowrap' }}>
                                                                {formatCurr(b.total_paid)}
                                                            </td>
                                                            <td className="cell-num" style={{ padding: '0.589rem 0.78rem', textAlign: 'right', fontWeight: '750', color: '#065F46', fontSize: '0.77rem', whiteSpace: 'nowrap' }}>
                                                                {formatCurr(b.total_contributed)}
                                                            </td>
                                                            <td className="cell-num" style={{ padding: '0.589rem 0.78rem', textAlign: 'right', fontWeight: '750', color: '#991B1B', fontSize: '0.77rem', whiteSpace: 'nowrap' }}>
                                                                {formatCurr(b.total_owed)}
                                                            </td>
                                                            <td className="cell-num" style={{ padding: '0.589rem 0.78rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                                <span style={{
                                                                    fontWeight: '900',
                                                                    fontSize: '0.816rem',
                                                                    color: b.net_balance > 0 ? '#10B981' : b.net_balance < 0 ? '#EF4444' : '#64748B'
                                                                }}>
                                                                    {b.net_balance > 0 ? `+${formatCurr(b.net_balance)}` : b.net_balance < 0 ? `-${formatCurr(Math.abs(b.net_balance))}` : formatCurr(0)}
                                                                </span>
                                                            </td>
                                                            <td className="cell-actions" style={{ padding: '0.589rem 0.78rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                                {b.private_note ? (
                                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                                                                        <span style={{ fontWeight: '900', fontSize: '0.816rem', color: '#047857' }}>
                                                                            {formatCurr(b.private_note.amount)}
                                                                        </span>
                                                                        {b.private_note.notes && (
                                                                            <span style={{ fontSize: '0.634rem', color: '#64748B', maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={b.private_note.notes}>
                                                                                {b.private_note.notes}
                                                                            </span>
                                                                        )}
                                                                        <button
                                                                            onClick={() => {
                                                                                setPrivateNoteModalData({ member_id: b.member_id, name: b.name, email: b.email });
                                                                                setPrivateNoteForm({ amount: b.private_note.amount || '', notes: b.private_note.notes || '' });
                                                                            }}
                                                                            style={{ border: 'none', background: 'none', color: '#059669', fontSize: '0.634rem', fontWeight: '750', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                                                                        >
                                                                            Edit Note
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => {
                                                                            setPrivateNoteModalData({ member_id: b.member_id, name: b.name, email: b.email });
                                                                            setPrivateNoteForm({ amount: '', notes: '' });
                                                                        }}
                                                                        style={{
                                                                            display: 'inline-flex',
                                                                            alignItems: 'center',
                                                                            gap: '3px',
                                                                            padding: '0.317rem 0.589rem',
                                                                            borderRadius: '8px',
                                                                            border: '1px dashed #86EFAC',
                                                                            background: '#F0FDF4',
                                                                            color: '#15803D',
                                                                            fontSize: '0.652rem',
                                                                            fontWeight: '800',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        <Lock size={10} /> + Note to Give
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* SUBTAB 2: Group Transactions */}
                                {groupActiveSubTab === 'transactions' && (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.906rem' }}>
                                            <h4 style={{ margin: 0, fontSize: '0.906rem', fontWeight: '850', color: '#0F172A' }}>Shared Financial Entries</h4>
                                            <button 
                                                onClick={() => setIsAddGroupTxModalOpen(true)}
                                                style={{ padding: '0.498rem 0.861rem', borderRadius: '10px', background: '#064E3B', color: 'white', border: 'none', fontWeight: '800', fontSize: '0.707rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                            >
                                                <Plus size={14} /> Record Entry
                                            </button>
                                        </div>

                                        {selectedGroupDetails.transactions?.length === 0 ? (
                                            <div style={{ padding: '2.719rem 0.906rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '18px', border: '1px dashed #CBD5E1' }}>
                                                <p style={{ margin: 0, color: '#64748B', fontSize: '0.77rem' }}>No financial transactions logged yet. Click "Record Entry" to log contributions, expenditures, or settlements.</p>
                                            </div>
                                        ) : (
                                            <div className="cliks-table-scroll" style={{ background: 'white', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                                                <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                                    <thead>
                                                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                                            <th style={{ padding: '0.589rem 0.78rem', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', whiteSpace: 'nowrap' }}>Date</th>
                                                            <th style={{ padding: '0.589rem 0.78rem', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', whiteSpace: 'nowrap' }}>Type</th>
                                                            <th style={{ padding: '0.589rem 0.78rem', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', whiteSpace: 'nowrap' }}>Title &amp; Category</th>
                                                            <th style={{ padding: '0.589rem 0.78rem', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', whiteSpace: 'nowrap' }}>Recorded By / Payer</th>
                                                            <th style={{ padding: '0.589rem 0.78rem', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', textAlign: 'right', whiteSpace: 'nowrap' }}>Amount</th>
                                                            <th style={{ padding: '0.589rem 0.78rem', width: '48px', textAlign: 'center' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedGroupDetails.transactions?.map(tx => (
                                                            <tr key={tx.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                                <td className="cell-nowrap" style={{ padding: '0.589rem 0.78rem', fontSize: '0.725rem', color: '#64748B', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                                                    {String(tx.date || tx.created_at).slice(0, 10)}
                                                                </td>
                                                                <td className="cell-nowrap" style={{ padding: '0.589rem 0.78rem', whiteSpace: 'nowrap' }}>
                                                                    <span className="badge-nowrap" style={{
                                                                        padding: '0.181rem 0.498rem',
                                                                        borderRadius: '6px',
                                                                        background: tx.type === 'contribution' ? '#ECFDF5' : tx.type === 'expense' ? '#FEF2F2' : '#EFF6FF',
                                                                        color: tx.type === 'contribution' ? '#065F46' : tx.type === 'expense' ? '#991B1B' : '#1E40AF',
                                                                        fontSize: '0.634rem',
                                                                        fontWeight: '800',
                                                                        textTransform: 'uppercase'
                                                                    }}>
                                                                        {tx.type}
                                                                    </span>
                                                                </td>
                                                                <td style={{ padding: '0.589rem 0.78rem', maxWidth: '210px' }} title={tx.title}>
                                                                    <p style={{ margin: 0, fontWeight: '800', fontSize: '0.77rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.title}</p>
                                                                    <p style={{ margin: 0, fontSize: '0.652rem', color: '#64748B' }}>{tx.category || 'General'}</p>
                                                                </td>
                                                                <td style={{ padding: '0.589rem 0.78rem', fontSize: '0.77rem', color: '#334155', maxWidth: '160px' }} title={tx.paid_by_name || 'Group'}>
                                                                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.paid_by_name || 'Group'}</div>
                                                                </td>
                                                                <td className="cell-num" style={{ padding: '0.589rem 0.78rem', textAlign: 'right', fontWeight: '900', fontSize: '0.816rem', whiteSpace: 'nowrap', color: tx.type === 'contribution' ? '#065F46' : '#991B1B' }}>
                                                                    {formatCurr(tx.amount)}
                                                                </td>
                                                                <td style={{ padding: '0.906rem 1.133rem', textAlign: 'center' }}>
                                                                    <button
                                                                        onClick={async () => {
                                                                            if (window.confirm('Delete this entry?')) {
                                                                                await peopleService.deleteGroupTransaction(selectedGroupId, tx.id);
                                                                                refetchGroupDetails();
                                                                            }
                                                                        }}
                                                                        style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer' }}
                                                                    >
                                                                        <Trash2 size={15} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* SUBTAB 3: Members & Invitations */}
                                {groupActiveSubTab === 'members' && (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.906rem' }}>
                                            <h4 style={{ margin: 0, fontSize: '0.906rem', fontWeight: '850', color: '#0F172A' }}>Group Governance & Participants</h4>
                                            <button 
                                                onClick={() => setIsInviteMemberModalOpen(true)}
                                                style={{ padding: '0.498rem 0.861rem', borderRadius: '10px', background: '#064E3B', color: 'white', border: 'none', fontWeight: '800', fontSize: '0.707rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                            >
                                                <UserPlus size={14} /> Invite Partner
                                            </button>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.906rem' }}>
                                            {selectedGroupDetails.members?.map(m => (
                                                <div key={m.id} style={{ padding: '1.133rem', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.77rem' }}>
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.363rem' }}>
                                                            <h5 style={{ margin: 0, fontSize: '0.861rem', fontWeight: '850', color: '#0F172A' }}>{m.name}</h5>
                                                            <span style={{ padding: '0.136rem 0.408rem', borderRadius: '4px', background: '#E2E8F0', color: '#334155', fontSize: '0.616rem', fontWeight: '800', textTransform: 'uppercase' }}>
                                                                {m.role}
                                                            </span>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: '0.707rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Mail size={12} /> {m.email}
                                                        </p>
                                                    </div>

                                                    {/* Private Commitment Note (Only visible to authenticated user) */}
                                                    <div style={{ padding: '0.589rem 0.77rem', background: '#F0FDF4', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '0.634rem', fontWeight: '850', color: '#065F46', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <Lock size={11} /> My Private Note (Only for me)
                                                            </span>
                                                            <button
                                                                onClick={() => {
                                                                    setPrivateNoteModalData({ member_id: m.id, name: m.name, email: m.email });
                                                                    setPrivateNoteForm({ amount: m.private_note?.amount || '', notes: m.private_note?.notes || '' });
                                                                }}
                                                                style={{ border: 'none', background: 'none', color: '#059669', fontSize: '0.652rem', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                                                            >
                                                                {m.private_note ? 'Edit' : '+ Note to Give'}
                                                            </button>
                                                        </div>
                                                        {m.private_note ? (
                                                            <div style={{ marginTop: '4px' }}>
                                                                <p style={{ margin: 0, fontSize: '0.797rem', fontWeight: '900', color: '#064E3B' }}>
                                                                    I will give: {formatCurr(m.private_note.amount)}
                                                                </p>
                                                                {m.private_note.notes && (
                                                                    <p style={{ margin: '2px 0 0', fontSize: '0.652rem', color: '#047857', fontStyle: 'italic' }}>
                                                                        "{m.private_note.notes}"
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p style={{ margin: '4px 0 0', fontSize: '0.652rem', color: '#059669' }}>
                                                                No private commitment set yet
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.68rem', borderTop: '1px solid #E2E8F0' }}>
                                                        <span style={{
                                                            fontSize: '0.652rem',
                                                            fontWeight: '800',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            color: m.status === 'accepted' ? '#065F46' : m.status === 'pending' ? '#92400E' : '#991B1B'
                                                        }}>
                                                            {m.status === 'accepted' && <Check size={12} />}
                                                            {m.status === 'pending' && <Clock size={12} />}
                                                            {m.status === 'rejected' && <X size={12} />}
                                                            {m.status === 'accepted' ? 'Active Member' : m.status === 'pending' ? 'Pending Invite' : 'Declined'}
                                                        </span>
                                                        {selectedGroupDetails.my_membership?.role === 'admin' && m.role !== 'admin' && (
                                                            <button
                                                                onClick={async () => {
                                                                    if (window.confirm(`Remove ${m.name} from this group?`)) {
                                                                        await peopleService.removeGroupMember(selectedGroupId, m.id);
                                                                        refetchGroupDetails();
                                                                    }
                                                                }}
                                                                style={{ border: 'none', background: 'none', color: '#EF4444', fontSize: '0.68rem', fontWeight: '750', cursor: 'pointer' }}
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal: Add Group Transaction Entry */}
            <AnimatePresence>
                {isAddGroupTxModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1150, backdropFilter: 'blur(8px)', padding: '0.906rem' }}>
                        <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'white', width: '100%', maxWidth: '460px', borderRadius: '24px', padding: '1.812rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.133rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.042rem', fontWeight: '900', color: '#0F172A' }}>Record Group Transaction</h3>
                                <button onClick={() => setIsAddGroupTxModalOpen(false)} style={{ border: 'none', background: '#F1F5F9', padding: '0.453rem', borderRadius: '12px', cursor: 'pointer' }}>
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (!groupTxForm.title.trim() || !groupTxForm.amount) return alert('Please enter title and amount');
                                addGroupTxMutation.mutate(groupTxForm);
                            }} style={{ display: 'flex', flexDirection: 'column', gap: '0.906rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.68rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Entry Type</label>
                                        <select 
                                            value={groupTxForm.type} 
                                            onChange={(e) => setGroupTxForm({ ...groupTxForm, type: e.target.value })} 
                                            style={{ width: '100%', padding: '0.68rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontSize: '0.77rem', fontWeight: '700' }}
                                        >
                                            <option value="expense">Group Expense</option>
                                            <option value="contribution">Member Deposit</option>
                                            <option value="loan">Member Loan</option>
                                            <option value="settlement">Settlement</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Amount <span style={{ color: '#EF4444' }}>*</span></label>
                                        <input 
                                            required 
                                            type="number" 
                                            placeholder="0.00" 
                                            value={groupTxForm.amount} 
                                            onChange={(e) => setGroupTxForm({ ...groupTxForm, amount: e.target.value })} 
                                            style={{ width: '100%', padding: '0.68rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.816rem' }} 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Title / Description <span style={{ color: '#EF4444' }}>*</span></label>
                                    <input 
                                        required 
                                        placeholder="e.g. Supplier Batch Payment or Initial Capital" 
                                        value={groupTxForm.title} 
                                        onChange={(e) => setGroupTxForm({ ...groupTxForm, title: e.target.value })} 
                                        style={{ width: '100%', padding: '0.68rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.77rem' }} 
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.68rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Category</label>
                                        <input 
                                            placeholder="Inventory, Rent, Equipment..." 
                                            value={groupTxForm.category} 
                                            onChange={(e) => setGroupTxForm({ ...groupTxForm, category: e.target.value })} 
                                            style={{ width: '100%', padding: '0.68rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.77rem' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Date</label>
                                        <input 
                                            type="date" 
                                            value={groupTxForm.date} 
                                            onChange={(e) => setGroupTxForm({ ...groupTxForm, date: e.target.value })} 
                                            style={{ width: '100%', padding: '0.68rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.77rem' }} 
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.68rem', marginTop: '0.453rem' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsAddGroupTxModalOpen(false)} 
                                        style={{ flex: 1, padding: '0.68rem', borderRadius: '12px', border: '1px solid #CBD5E1', background: 'white', fontWeight: '750', fontSize: '0.77rem', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={addGroupTxMutation.isPending}
                                        style={{ flex: 2, padding: '0.68rem', borderRadius: '12px', border: 'none', background: '#064E3B', color: 'white', fontWeight: '800', fontSize: '0.77rem', cursor: 'pointer' }}
                                    >
                                        {addGroupTxMutation.isPending ? 'Logging...' : 'Save Entry'}
                                    </button>
                                </div>
                            </form>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal: Invite Member to Existing Group */}
            <AnimatePresence>
                {isInviteMemberModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1150, backdropFilter: 'blur(8px)', padding: '0.906rem' }}>
                        <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'white', width: '100%', maxWidth: '440px', borderRadius: '24px', padding: '1.812rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.133rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.042rem', fontWeight: '900', color: '#0F172A' }}>Invite Partner to Group</h3>
                                <button onClick={() => setIsInviteMemberModalOpen(false)} style={{ border: 'none', background: '#F1F5F9', padding: '0.453rem', borderRadius: '12px', cursor: 'pointer' }}>
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const email = (inviteMemberForm.email || '').trim().toLowerCase();
                                const bnxRegex = /^[a-zA-Z0-9._%+-]+@bnxmail\.com$/i;
                                if (!email) {
                                    setInviteMemberEmailError('Email address is required');
                                    return;
                                }
                                if (!bnxRegex.test(email)) {
                                    setInviteMemberEmailError('Only official @bnxmail.com domain addresses are accepted');
                                    return;
                                }
                                inviteMemberMutation.mutate({
                                    name: (inviteMemberForm.name || email.split('@')[0]).trim(),
                                    email,
                                    role: inviteMemberForm.role
                                });
                            }} style={{ display: 'flex', flexDirection: 'column', gap: '0.906rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Partner Name</label>
                                    <input 
                                        placeholder="e.g. Ramesh Patel" 
                                        value={inviteMemberForm.name} 
                                        onChange={(e) => setInviteMemberForm({ ...inviteMemberForm, name: e.target.value })} 
                                        style={{ width: '100%', padding: '0.68rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.77rem' }} 
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Partner @bnxmail.com Email <span style={{ color: '#EF4444' }}>*</span></label>
                                    <input 
                                        required 
                                        placeholder="partner@bnxmail.com" 
                                        value={inviteMemberForm.email} 
                                        onChange={(e) => {
                                            setInviteMemberForm({ ...inviteMemberForm, email: e.target.value });
                                            setInviteMemberEmailError('');
                                        }} 
                                        style={{ width: '100%', padding: '0.68rem', borderRadius: '12px', border: inviteMemberEmailError ? '1.5px solid #EF4444' : '1px solid #E2E8F0', outline: 'none', fontSize: '0.77rem' }} 
                                    />
                                    {inviteMemberEmailError ? (
                                        <p style={{ margin: '0.317rem 0 0 0', fontSize: '0.652rem', color: '#EF4444', fontWeight: '700' }}>{inviteMemberEmailError}</p>
                                    ) : (
                                        <p style={{ margin: '0.317rem 0 0 0', fontSize: '0.652rem', color: '#64748B' }}>Only official @bnxmail.com accounts can receive financial invitations</p>
                                    )}
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Assigned Access Role</label>
                                    <select 
                                        value={inviteMemberForm.role} 
                                        onChange={(e) => setInviteMemberForm({ ...inviteMemberForm, role: e.target.value })} 
                                        style={{ width: '100%', padding: '0.68rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontSize: '0.77rem', fontWeight: '700' }}
                                    >
                                        <option value="member">Member (Can view ledger & contribute)</option>
                                        <option value="manager">Manager (Can record & edit transactions)</option>
                                        <option value="auditor">Auditor (Read-only financial auditor)</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '0.68rem', marginTop: '0.453rem' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsInviteMemberModalOpen(false)} 
                                        style={{ flex: 1, padding: '0.68rem', borderRadius: '12px', border: '1px solid #CBD5E1', background: 'white', fontWeight: '750', fontSize: '0.77rem', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={inviteMemberMutation.isPending}
                                        style={{ flex: 2, padding: '0.68rem', borderRadius: '12px', border: 'none', background: '#064E3B', color: 'white', fontWeight: '800', fontSize: '0.77rem', cursor: 'pointer' }}
                                    >
                                        {inviteMemberMutation.isPending ? 'Sending...' : 'Dispatch Invitation'}
                                    </button>
                                </div>
                            </form>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal: Set Private Note for Member */}
            <AnimatePresence>
                {privateNoteModalData && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, backdropFilter: 'blur(8px)', padding: '0.906rem' }}>
                        <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'white', width: '100%', maxWidth: '420px', borderRadius: '24px', padding: '1.812rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.133rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ECFDF5', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Lock size={18} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '0.997rem', fontWeight: '900', color: '#0F172A' }}>Private Member Note</h3>
                                        <p style={{ margin: 0, fontSize: '0.652rem', color: '#059669', fontWeight: '750' }}>Only visible to you</p>
                                    </div>
                                </div>
                                <button onClick={() => setPrivateNoteModalData(null)} style={{ border: 'none', background: '#F1F5F9', padding: '0.453rem', borderRadius: '12px', cursor: 'pointer' }}>
                                    <X size={18} />
                                </button>
                            </div>

                            <div style={{ padding: '0.68rem 0.906rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.133rem' }}>
                                <p style={{ margin: 0, fontSize: '0.652rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '800' }}>Target Member</p>
                                <p style={{ margin: '2px 0 0', fontSize: '0.834rem', fontWeight: '900', color: '#0F172A' }}>{privateNoteModalData.name}</p>
                                <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748B' }}>{privateNoteModalData.email}</p>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                setPrivateNoteMutation.mutate({
                                    memberId: privateNoteModalData.member_id,
                                    amount: Number(privateNoteForm.amount) || 0,
                                    notes: privateNoteForm.notes
                                });
                            }} style={{ display: 'flex', flexDirection: 'column', gap: '0.906rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>
                                        How much money will you give? <span style={{ color: '#EF4444' }}>*</span>
                                    </label>
                                    <input 
                                        required 
                                        type="number" 
                                        placeholder="e.g. 5000" 
                                        value={privateNoteForm.amount} 
                                        onChange={(e) => setPrivateNoteForm({ ...privateNoteForm, amount: e.target.value })} 
                                        style={{ width: '100%', padding: '0.68rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.861rem', fontWeight: '750' }} 
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>
                                        Private Memo / Reason (Optional)
                                    </label>
                                    <textarea 
                                        rows={2} 
                                        placeholder="e.g. For raw materials share, to be settled next Tuesday..." 
                                        value={privateNoteForm.notes} 
                                        onChange={(e) => setPrivateNoteForm({ ...privateNoteForm, notes: e.target.value })} 
                                        style={{ width: '100%', padding: '0.68rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.77rem' }} 
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.453rem 0.68rem', background: '#ECFDF5', borderRadius: '10px', border: '1px solid #A7F3D0' }}>
                                    <Lock size={14} style={{ color: '#065F46', flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.652rem', color: '#065F46', fontWeight: '750' }}>
                                        This note and amount will NEVER be visible to any other group member or admin.
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '0.68rem', marginTop: '0.453rem' }}>
                                    {selectedGroupDetails?.members?.find(m => m.id === privateNoteModalData.member_id)?.private_note && (
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                if (window.confirm('Remove this private note?')) {
                                                    deletePrivateNoteMutation.mutate(privateNoteModalData.member_id);
                                                }
                                            }} 
                                            disabled={deletePrivateNoteMutation.isPending}
                                            style={{ padding: '0.68rem 0.906rem', borderRadius: '12px', border: '1.5px solid #FECACA', background: '#FFFFFF', color: '#EF4444', fontWeight: '800', fontSize: '0.743rem', cursor: 'pointer' }}
                                        >
                                            Remove
                                        </button>
                                    )}
                                    <button 
                                        type="button" 
                                        onClick={() => setPrivateNoteModalData(null)} 
                                        style={{ flex: 1, padding: '0.68rem', borderRadius: '12px', border: '1px solid #CBD5E1', background: 'white', fontWeight: '750', fontSize: '0.77rem', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={setPrivateNoteMutation.isPending}
                                        style={{ flex: 2, padding: '0.68rem', borderRadius: '12px', border: 'none', background: '#064E3B', color: 'white', fontWeight: '800', fontSize: '0.77rem', cursor: 'pointer' }}
                                    >
                                        {setPrivateNoteMutation.isPending ? 'Saving...' : 'Save Private Note'}
                                    </button>
                                </div>
                            </form>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BusinessPeople;
