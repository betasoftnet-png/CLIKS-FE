const guide = (id, title, target, description, visibleDelay = 2000) => ({
    id, title, target, description, visibleDelay,
    interactiveClick: !['finance_analytics', 'interactive_analytics', 'reports_engine',
        'budget_planner', 'my_wallet', 'financial_goals', 'investment_portfolio',
        'additional_source', 'bills_reminders', 'fixed_source', 'loyalty_points',
        'bit_calculator', 'bit_calendar', 'bit_contacts', 'bit_notes', 'bit_keyboard'].includes(id),
    showNext: true,
    allowBack: true,
});

const tour = (id, title, paths, steps, legacyPrefix, resetName) => ({
    id, title, route: paths[0], steps, legacyPrefix, resetName,
    matchPath: (path) => paths.includes(path.replace(/\/$/, '') || '/'),
});

export const CHECKLIST_TOURS = [
    tour('page_dashboard', 'Dashboard', ['/books/dashboard'], [
        guide('nav_books', 'Books', '[data-tour="topbar-nav-books"]', 'Access core bookkeeping, stock inventory, invoices, ledgers, tax deductions, and financial reports.', 5000),
        guide('nav_payments', 'Payments', '[data-tour="topbar-nav-payments"]', 'Track incoming collections, vendor payables, bank registers, purpose wallets, and payment planners.'),
        guide('nav_social', 'Social', '[data-tour="topbar-nav-social"]', 'Explore community trading, verified merchant meetups, and collaborative peer business networks.'),
        guide('search', 'Search', '[data-tour="topbar-search"]', 'Quickly find transactions, ledgers, products, invoices, and tools across your entire workspace.'),
        guide('notification', 'Notification', '[data-tour="topbar-notifications"]', 'Stay updated with real-time alerts, payment reminders, inventory warnings, and system notifications.'),
        guide('profile', 'Profile', '[data-tour="profile-dropdown-toggle"]', 'Manage personal details, security settings, firm preferences, and sign out from this menu.'),
        guide('customize', 'Customize Dashboard', '[data-tour="dashboard-customize-btn"]', 'Tailor your workspace layout, reorder metric cards, and manage quick action shortcuts to match your workflow.', 5000),
        guide('bit_tool', 'BIT Tool', '[data-tour="topbar-toolbar-toggle"]', 'Launch built-in productivity utilities including Calculator, Calendar, Contacts, Notes, and Keyboard shortcuts.'),
        guide('refer_earn', 'Refer & Earn', '[data-tour="sidebar-refer-earn"]', 'Invite business partners and peers to join CLIKS. Track rewarded credits and earnings in real time.'),
        guide('sidebar_finpro', 'FIN-PRO', '[data-tour="sidebar-finpro-subscription"]', 'Unlock Chartered Accountant verification, Tax Audit Form 3CD, and Statutory Financial Audit suites.'),
        guide('module_inventory', 'Inventory & Stocks', '[data-tour="dashboard-module-inventory"]', 'Real-time overview of products, stock alerts, warehouse distribution, and restock thresholds.'),
        guide('module_people', 'People Hub', '[data-tour="dashboard-module-people"]', 'Operational base for handling contacts, payables, receivables, and staff transactions.'),
        guide('module_finance', 'Finance', '[data-tour="dashboard-module-finance"]', 'Track personal income, fixed costs, and daily expenses with automatic balance calculations.'),
    ], 'cliks_dashboard_onboarding_v5:', '__cliksResetDashboardOnboarding'),
    tour('page_accounting', 'Accounts', ['/books/accounting'], [
        guide('tax_deductions', 'Tax & Deductions', '[data-tour="accounting-tax-deductions"]', 'Open the tax workspace to review annual tax estimates, advance payments, and 80C deductions.'),
        guide('budget_planner', 'Budget Planner', '[data-tour="accounting-budget-planner"]', 'Set and track monthly spending limits against current expenses with live progress alerts.'),
        guide('my_wallet', 'My Wallet', '[data-tour="accounting-my-wallet"]', 'Monitor account balances across cash, bank accounts, UPI, and credit cards in real time.'),
        guide('financial_goals', 'Financial Goals', '[data-tour="accounting-financial-goals"]', 'Define target milestones, emergency funds, and vacation budgets with scheduled deposits.'),
        guide('investment_portfolio', 'Investment Portfolio', '[data-tour="accounting-investment-portfolio"]', 'Track mutual funds, equity stocks, fixed deposits, and overall asset performance.'),
        guide('additional_source', 'Total Additional Source', '[data-tour="accounting-additional-source"]', 'Manage variable income streams, bonuses, freelance gigs, and supplementary expense logs.'),
        guide('bills_reminders', 'Bills & Reminders', '[data-tour="accounting-bills-reminders"]', 'Stay on top of recurring utility bills, subscriptions, and upcoming due dates effortlessly.'),
        guide('fixed_source', 'Fixed Source', '[data-tour="accounting-fixed-source"]', 'Keep record of regular monthly salary, rental earnings, and fixed operational expenses.'),
    ], 'cliks_accounts_onboarding_v1:', '__cliksResetAccountsOnboarding'),
    tour('page_purchases', 'Purchases', ['/books/purchase-details'], [
        guide('sync_data', 'Sync Data', '[data-tour="purchases-sync-data"]', 'Synchronize your purchase data and update invoices and loyalty points across connected stores.'),
        guide('link_store', 'Link Store', '[data-tour="purchases-link-store"]', 'Connect new retail and partner stores using their unique merchant ID to import purchases and bills.'),
        guide('loyalty_points', 'Loyalty Points', '[data-tour="purchases-loyalty-points"]', 'Overview of all loyalty points earned across connected stores along with their redeemable cashback value.'),
        guide('store_points', 'Store Points & Balance', '[data-tour="purchases-tab-shop-points"]', 'View and track loyalty points and reward balances earned individually at each specific store.'),
        guide('points_history', 'Points History Ledger', '[data-tour="purchases-tab-point-history"]', 'Review the chronological audit trail of all loyalty points earned from orders or redeemed for discounts.'),
        guide('purchase_invoices', 'Purchase Invoices', '[data-tour="purchases-tab-purchases"]', 'Browse, search, and download digital purchase bills and tax invoices received across all linked stores.'),
        guide('warranty_products', 'Warranty Products', '[data-tour="purchases-tab-warranty"]', 'Track active product warranty dates, invoices, and coverage terms automatically pulled from purchases.'),
    ], 'cliks_purchases_onboarding_v1:', '__cliksResetPurchasesOnboarding'),
    tour('page_books', 'Report', ['/books', '/books/report', '/books/reports'], [
        guide('finance_analytics', 'Finance Analytics', '[data-tour="report-finance-analytics"]', 'Inspect income vs expense comparisons, yearly trends, and categorical breakdown summaries at a glance.'),
        guide('interactive_analytics', 'Interactive Analytics', '[data-tour="report-interactive-analytics"]', 'Explore live charts with interactive filters to drill down into monthly cash flow, margins, and trends.'),
        guide('reports_engine', 'Reports Engine', '[data-tour="report-reports-engine"]', 'Generate, filter, and export comprehensive financial statements, tax reports, and monthly summaries.'),
    ], 'cliks_report_onboarding_v1:', '__cliksResetReportOnboarding'),
    tour('page_finance', 'Transactions', ['/payments/transactions', '/payments/transaction', '/finance/dashboard'], [
        guide('add_transaction', 'Add Transaction', '[data-tour="finance-add-transaction"]', 'Quickly record income, expenses, cash movements, and bank transfers with full categorized tracking.'),
        guide('income_inflow', 'Income (Inflow)', '[data-tour="finance-tab-receivables"]', 'View customer receivables, incoming revenue, reconciliation status, and linked invoice payments.'),
        guide('expenses_outflow', 'Expenses (Outflow)', '[data-tour="finance-tab-payables"]', 'Monitor vendor payables, utility costs, operational expenses, and outgoing cash flows.'),
        guide('bank_cash', 'Bank & Cash Registers', '[data-tour="finance-tab-bank"]', 'Manage physical cash registers, bank account ledgers, deposits, withdrawals, and liquidity.'),
        guide('overdue_reminders', 'Overdue Reminders', '[data-tour="finance-tab-reminders"]', 'Track outstanding customer balances, pending collection alerts, and send WhatsApp payment reminders.'),
    ], 'cliks_transactions_onboarding_v1:', '__cliksResetTransactionsOnboarding'),
    tour('page_segregation', 'Segregation Wallets', ['/payments/segregation'], [
        guide('setup_wallet', 'Setup Purpose Wallet', '[data-tour="segregation-create"]', 'Create a new dedicated target wallet to isolate and protect funds for specific business operations or capital needs.'),
        guide('all_containers', 'All Containers', '[data-tour="segregation-filter-all"]', 'Filter and review every segregated wallet container across all statuses in one organized overview.'),
        guide('in_progress', 'In Progress', '[data-tour="segregation-filter-in-progress"]', 'Track active purpose containers that are actively being funded toward their designated financial targets.'),
        guide('target_met', 'Target Met', '[data-tour="segregation-filter-target-met"]', 'Celebrate and review purpose containers that have achieved 100% of their funding goals and are ready to claim.'),
        guide('claimed', 'Claimed', '[data-tour="segregation-filter-claimed"]', 'Access the history of completed and disbursed purpose wallets after fulfillment.'),
        guide('financial_goals', 'Financial Goals', '[data-tour="segregation-financial-goals"]', 'Manage comprehensive financial goals, emergency reserves, expansion plans, and progress milestones.'),
    ], 'cliks_segregation_onboarding_v1:', '__cliksResetSegregationOnboarding'),
    tour('page_split', 'Splitwise & Collect', ['/payments/split-collect', '/payments/split-expense', '/books/split-collect'], [
        guide('new_ticket', 'New Split Ticket', '[data-tour="split-create"]', 'Create a shared expense ticket to divide bills, group purchases, and team costs with transparent participant shares.'),
    ], 'cliks_splitwise_onboarding_v1:', '__cliksResetSplitwiseOnboarding'),
    tour('page_planner', 'Payment Planner', ['/payments/planner', '/payments/plan'], [
        guide('schedule_payment', 'Schedule Payment', '[data-tour="planner-actions"]', 'Set up upcoming supplier payables, customer collections, and recurring transfers with scheduled reminders and due dates.'),
    ], 'cliks_planner_onboarding_v1:', '__cliksResetPlannerOnboarding'),
    tour('page_people', 'People', ['/payments/people'], [
        guide('log_transaction', 'Log Transaction', '[data-tour="people-log-transaction"]', 'Record money lent to or borrowed from a contact.'),
        guide('contacts', 'Contacts', '[data-tour="people-tab-contacts"]', 'Find and manage your contacts.'),
        guide('groups', 'Financial Groups', '[data-tour="people-tab-groups"]', 'Manage shared expenses and group ledgers.'),
        guide('request', 'Request', '[data-tour="people-tab-requests"]', 'Review contact and group invitations.'),
        guide('ledger', 'Global Ledger', '[data-tour="people-tab-transactions"]', 'Review transactions across your contacts.'),
        guide('repayment_alerts', 'Repayment Alerts', '[data-tour="people-tab-reminders"]', 'Review upcoming repayments and reminders.'),
    ], null, '__cliksResetPeopleOnboarding'),
    tour('page_social', 'Social', ['/social/meetup', '/social/beta-club', '/social/trading', '/public'], [
        guide('trading_dock', 'Trading Dock', '[data-tour="social-trading-dock"]', 'Open the trading workspace from the Social sidebar.'),
        guide('active_deals', 'Active Deals Marketplace', '[data-tour="social-active-deals"]', 'Browse active ventures and explore their offerings in the marketplace.'),
        guide('my_studio', 'My Studio (Founder View)', '[data-tour="social-my-studio"]', 'Manage your ventures in the founder workspace.'),
        guide('region', 'Select Region / Local GPS', '[data-tour="social-region"]', 'Choose which region to browse. GPS is optional.'),
        guide('venture', 'List Your Venture', '[data-tour="social-list-venture"]', 'Open the form to create a venture listing.'),
    ], null, '__cliksResetSocialOnboarding'),
];

export const BIT_GUIDES = {
    calculator: guide('bit_calculator', 'Calculator', '[data-tour="docked-calculator"]', 'Perform arithmetic calculations, calculate taxes, markups, and margins with instant memory.'),
    calendar: guide('bit_calendar', 'Calendar', '[data-tour="docked-calendar"]', 'Track due dates, scheduled payables, tax filing deadlines, and client meetings on a monthly grid.'),
    contact: guide('bit_contacts', 'Contacts', '[data-tour="docked-contact"]', 'Look up and connect with customers, vendors, and staff members without leaving your dashboard.'),
    notes: guide('bit_notes', 'Notes', '[data-tour="docked-notes"]', 'Take quick notes, draft meeting minutes, and keep reminders synchronized across your sessions.'),
    keyboard: guide('bit_keyboard', 'Keyboard Shortcuts', '[data-tour="docked-keyboard"]', 'Navigate at high speed: cycle through forms, jump to search with Ctrl+K, and toggle tools with Esc.'),
};

export const LEGACY_ONBOARDING_KEY = /^cliks_(?:(?:dashboard|accounts|purchases|report|transactions|segregation|splitwise|planner)_)?onboarding_v\d+:/;

export function readChecklistProgress(userKey) {
    const progress = {};
    for (const config of CHECKLIST_TOURS) {
        if (!config.legacyPrefix) continue;
        try {
            const saved = JSON.parse(localStorage.getItem(config.legacyPrefix + userKey));
            for (const step of config.steps) {
                const status = saved?.[step.id];
                if (status === 'completed' || status === 'skipped') {
                    progress[config.id + ':' + step.id] = status;
                }
            }
            if (config.id === 'page_dashboard') {
                for (const step of Object.values(BIT_GUIDES)) {
                    if (saved?.[step.id] === 'completed' || saved?.[step.id] === 'skipped') {
                        progress['page_bit:' + step.id] = saved[step.id];
                    }
                }
            }
        } catch {
            // Invalid legacy records do not affect the checklist.
        }
    }
    return progress;
}
