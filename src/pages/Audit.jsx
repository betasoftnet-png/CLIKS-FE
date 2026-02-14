import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Send,
    Bot,
    User,
    Paperclip,
    MoreVertical,
    FileText,
    AlertTriangle,
    Clock,
    CheckCircle2,
    Search,
    Filter,
    Download
} from 'lucide-react';
import '../App.css';

// --- Chat View (New Audit) ---
const ChatView = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: "Hello! I'm your AI Auditor. I can help you analyze financial records, detect anomalies, or generate compliance reports. How would you like to start?" }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');

        // Mock AI Response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'ai',
                text: "I've received your request. I'm analyzing the current context data..."
            }]);
        }, 1000);
    };

    return (
        <div className="audit-chat-container">
            <div className="chat-header">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">AI Audit Assistant</h2>
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Online
                        </div>
                    </div>
                </div>
                <button className="icon-btn"><MoreVertical size={20} /></button>
            </div>

            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message-wrapper ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                        <div className={`message-avatar ${msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white'}`}>
                            {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className="message-content">
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            <div className="chat-input-area">
                <button className="attach-btn" title="Upload Document">
                    <Paperclip size={20} />
                </button>
                <input
                    type="text"
                    placeholder="Ask anything about your audits..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    className={`send-btn ${input.trim() ? 'active' : ''}`}
                    onClick={handleSend}
                    disabled={!input.trim()}
                >
                    <Send size={18} />
                </button>
            </div>

            <style>{`
                .audit-chat-container {
                    display: flex; flex-direction: column; height: calc(100vh - 140px); 
                    background: white; border-radius: 16px; border: 1px solid var(--border-color);
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden;
                }
                .chat-header {
                    padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; bg-white;
                }
                .chat-messages {
                    flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.5rem; background: #F8FAFC;
                }
                .message-wrapper { display: flex; gap: 1rem; max-width: 80%; }
                .message-wrapper.user { align-self: flex-end; flex-direction: row-reverse; }
                .message-avatar { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 4px; }
                .message-content {
                    padding: 1rem; border-radius: 12px; font-size: 0.95rem; line-height: 1.5; color: #1E293B;
                    background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border: 1px solid #E2E8F0;
                }
                .message-wrapper.user .message-content {
                    background: #195BAC; color: white; border: none;
                }
                .message-wrapper.ai .message-content {
                    border-top-left-radius: 2px;
                }
                .message-wrapper.user .message-content {
                    border-top-right-radius: 2px;
                }
                
                .chat-input-area {
                    padding: 1rem 1.5rem; background: white; border-top: 1px solid var(--border-color); display: flex; gap: 0.75rem; align-items: center;
                }
                .chat-input-area input {
                    flex: 1; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #CBD5E1; 
                    outline: none; transition: all 0.2s; font-size: 0.95rem;
                }
                .chat-input-area input:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(25, 91, 172, 0.1); }
                .attach-btn { color: #64748B; padding: 0.5rem; border-radius: 8px; transition: bg 0.2s; }
                .attach-btn:hover { background: #F1F5F9; color: #334155; }
                .send-btn { 
                    width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
                    background: #E2E8F0; color: #94A3B8; transition: all 0.2s;
                }
                .send-btn.active { background: var(--primary); color: white; }
            `}</style>
        </div>
    );
};

// --- View: Audit List (Recent/All) ---
const AuditListView = ({ type }) => (
    <div className="audit-list-view fade-in">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">{type} Audits</h2>
                <p className="text-slate-500 text-sm mt-1">Manage and review your audit history</p>
            </div>
            <div className="flex gap-2">
                <button className="btn-secondary flex items-center gap-2">
                    <Filter size={16} /> Filter
                </button>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search audits..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 outline-none focus:border-blue-500" />
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="p-4 font-semibold text-slate-600">Audit Name</th>
                        <th className="p-4 font-semibold text-slate-600">Date</th>
                        <th className="p-4 font-semibold text-slate-600">Status</th>
                        <th className="p-4 font-semibold text-slate-600">Findings</th>
                        <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {[1, 2, 3, 4].map(i => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <FileText size={16} />
                                </div>
                                Sample Audit Q{i}
                            </td>
                            <td className="p-4 text-slate-500">Oct {20 + i}, 2026</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${i === 1 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                    {i === 1 ? 'In Progress' : 'Completed'}
                                </span>
                            </td>
                            <td className="p-4 text-slate-500">{i * 2 + 1} Issues Found</td>
                            <td className="p-4 text-right">
                                <button className="text-blue-600 hover:underline text-sm font-medium">View Report</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// --- View: Findings & Risks ---
const FindingsView = () => (
    <div className="fade-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Findings & Risks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-red-50 border border-red-100 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="text-red-500" size={20} />
                    <h3 className="font-semibold text-red-700">High Risk</h3>
                </div>
                <div className="text-3xl font-bold text-red-800">12</div>
                <p className="text-sm text-red-600 mt-1">Requires immediate attention</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="text-yellow-500" size={20} />
                    <h3 className="font-semibold text-yellow-700">Medium Risk</h3>
                </div>
                <div className="text-3xl font-bold text-yellow-800">28</div>
                <p className="text-sm text-yellow-600 mt-1">Review within 7 days</p>
            </div>
            <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="text-green-500" size={20} />
                    <h3 className="font-semibold text-green-700">Resolved</h3>
                </div>
                <div className="text-3xl font-bold text-green-800">156</div>
                <p className="text-sm text-green-600 mt-1">Successfully mitigated</p>
            </div>
        </div>
    </div>
);

// --- Placeholder for other views ---
const PlaceholderView = ({ title, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center h-96 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
        <Icon size={48} className="mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">{title}</h3>
        <p className="max-w-md">This section is currently under development. Check back later for {title.toLowerCase()} updates.</p>
    </div>
);

// --- Main Page Component ---
const Audit = () => {
    const location = useLocation();
    const path = location.pathname;

    let Content;
    if (path.includes('/new')) Content = ChatView;
    else if (path.includes('/recent')) Content = () => <AuditListView type="Recent" />;
    else if (path.includes('/all')) Content = () => <AuditListView type="All" />;
    else if (path.includes('/findings')) Content = FindingsView;
    else if (path.includes('/reports')) Content = () => <PlaceholderView title="Reports" icon={FileText} />;
    else if (path.includes('/settings')) Content = () => <PlaceholderView title="Audit Settings" icon={Search} />; // Use Settings icon
    else Content = ChatView; // Default

    return (
        <div className="p-6 h-full overflow-hidden flex flex-col">
            <Content />
        </div>
    );
};

export default Audit;
