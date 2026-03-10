import fs from 'fs';

let content = fs.readFileSync('src/pages/FinancialContacts.jsx', 'utf8');

content = content.replace(/import \{ motion, AnimatePresence \} from 'framer-motion';/g, "import { motion, AnimatePresence } from 'framer-motion';\nimport EmptyState from '../components/common/EmptyState';");

content = content.replace(/\s*\/\/ Mock data[\s\S]*?\]\);/, `
    const [contacts, setContacts] = useState(() => {
        const saved = localStorage.getItem('books_contacts');
        return saved ? JSON.parse(saved) : [];
    });
`);

content = content.replace(/setColumns\(prev => \{[\s\S]*?return newCols;\n\s*\}\);/, `
        setContacts(prev => {
            const updated = [newContact, ...prev];
            localStorage.setItem('books_contacts', JSON.stringify(updated));
            return updated;
        });
`);

content = content.replace(/<div className="kanban-board">[\s\S]*?<AnimatePresence>/, `{contacts.length === 0 ? (
                <EmptyState 
                    title="No Contacts Found" 
                    description="Click 'Add Contact' to create your first contact." 
                />
            ) : (
                <div className="kanban-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {(() => {
                        const filteredContacts = contacts.filter(contact => {
                            const nameMatch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
                            const phoneMatch = !hasPhone || (contact.phone && contact.phone !== '-');
                            const emailMatch = !hasEmail || (contact.email && contact.email !== '-');
                            
                            const letterMatch = (() => {
                                const first = contact.name[0].toUpperCase();
                                if (letterRange === "A-F") return first >= "A" && first <= "F";
                                if (letterRange === "G-L") return first >= "G" && first <= "L";
                                if (letterRange === "M-R") return first >= "M" && first <= "R";
                                if (letterRange === "S-Z") return first >= "S" && first <= "Z";
                                return true;
                            })();

                            return nameMatch && phoneMatch && emailMatch && letterMatch;
                        });

                        return filteredContacts.map(item => (
                            <div key={item.id} className="contact-card">
                                <div className="avatar-large" style={{ background: item.avatarBg, color: 'white' }}>
                                    <span>{item.initials}</span>
                                </div>
                                <h4 className="contact-name">{item.name}</h4>
                                <div className="contact-details">
                                    <div className="detail-row">
                                        <Phone className="detail-icon" />
                                        <span>{item.phone}</span>
                                    </div>
                                    <div className="detail-row">
                                        <Mail className="detail-icon" />
                                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '100%' }}>{item.email}</span>
                                    </div>
                                </div>
                            </div>
                        ));
                    })()}
                </div>
            )}

            <AnimatePresence>`);

fs.writeFileSync('src/pages/FinancialContacts.jsx', content);
