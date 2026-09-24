import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ErrorBoundary } from './components/common';
import MainLayout from './layouts/MainLayout';
import AuditorLayout from './layouts/AuditorLayout';
import Landing from './pages/Landing';


// Lazy Load Pages to optimize bundle size
const Auth = React.lazy(() => import('./pages/Auth'));
const Join = React.lazy(() => import('./pages/Join'));
const Register = React.lazy(() => import('./pages/Register'));
const Income = React.lazy(() => import('./pages/Income'));
const Expenses = React.lazy(() => import('./pages/Expenses'));
const Transactions = React.lazy(() => import('./pages/Transactions'));
const Budgets = React.lazy(() => import('./pages/Budgets'));
const Accounts = React.lazy(() => import('./pages/Accounts'));
const PlannedPayments = React.lazy(() => import('./pages/PlannedPayments'));
const Savings = React.lazy(() => import('./pages/Savings'));
const Investments = React.lazy(() => import('./pages/Investments'));
const Debts = React.lazy(() => import('./pages/Debts'));
const Finance = React.lazy(() => import('./pages/Finance'));
const Transfers = React.lazy(() => import('./pages/finance/Transfers'));
const FinanceAccounts = React.lazy(() => import('./pages/finance/Accounts'));
const Bills = React.lazy(() => import('./pages/finance/Bills'));
const FinanceSavings = React.lazy(() => import('./pages/finance/Savings'));
const Rewards = React.lazy(() => import('./pages/finance/Rewards'));
const Books = React.lazy(() => import('./pages/Books'));
const BooksDashboard = React.lazy(() => import('./pages/books/Dashboard'));
const Auditor = React.lazy(() => import('./pages/Auditor'));
const Public = React.lazy(() => import('./pages/Public'));
const Stock = React.lazy(() => import('./pages/Stock'));
const Wallet = React.lazy(() => import('./pages/finance/Wallet'));
const FinancialPlan = React.lazy(() => import('./pages/financial-plan/FinancialPlan'));
const BusinessCA = React.lazy(() => import('./pages/BusinessCA'));

const People = React.lazy(() => import('./pages/People'));
const PeopleOverview = React.lazy(() => import('./pages/people/PeopleOverview'));
const PeopleTransactions = React.lazy(() => import('./pages/people/PeopleTransactions'));
const PeopleReminders = React.lazy(() => import('./pages/people/PeopleReminders'));
const PeopleRecords = React.lazy(() => import('./pages/people/PeopleRecords'));
const PersonProfile = React.lazy(() => import('./pages/people/PersonProfile'));
const SplitExpense = React.lazy(() => import('./pages/SplitExpense'));
const Segregation = React.lazy(() => import('./pages/Segregation'));
const Referral = React.lazy(() => import('./pages/Referral'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const Subscription = React.lazy(() => import('./pages/Subscription'));
const FinancePage = React.lazy(() => import('./pages/books/FinancePage'));
const TaxDeductions = React.lazy(() => import('./pages/books/TaxDeductions'));
const MoneyTracker = React.lazy(() => import('./pages/books/MoneyTracker'));
const SimpleBilling = React.lazy(() => import('./pages/books/SimpleBilling'));
const BillingRecords = React.lazy(() => import('./pages/books/BillingRecords'));
const Accounting = React.lazy(() => import('./pages/books/Accounting'));
const PurchaseDetails = React.lazy(() => import('./pages/books/PurchaseDetails'));
const StaffDetails = React.lazy(() => import('./pages/StaffDetails'));


import './App.css';

// Apply persisted dark mode before first render
const savedDarkMode = localStorage.getItem('cliks_dark_mode');
if (savedDarkMode === 'true') {
    document.documentElement.setAttribute('data-theme', 'dark');
} else {
    document.documentElement.setAttribute('data-theme', 'light');
}

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '200px', color: '#64748B' }}>
    Loading...
  </div>
);

function AuthenticatedApp() {
  const location = useLocation();

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <MainLayout>
          <div key={location.pathname} className="main-content-wrapper" style={{ height: '100%', width: '100%', minHeight: 0 }}>
            <Suspense fallback={<PageLoader />}>
              <Routes location={location}>
                {/* Root Redirect */}
                <Route path="/" element={<Navigate to="/books/dashboard" replace />} />
                <Route path="/books" element={<Navigate to="/books/dashboard" replace />} />
                <Route path="/payments" element={<Navigate to="/payments/transactions" replace />} />
                <Route path="/social" element={<Navigate to="/social/meetup" replace />} />
                
                {/* Finance (formerly Home) Section */}
                <Route path="/finance" element={<Navigate to="/payments/planner" replace />} />
                <Route path="/finance/dashboard" element={<Finance />} />
                <Route path="/finance/income" element={<Income />} />
                <Route path="/finance/expenses" element={<Expenses />} />
                <Route path="/finance/budgets" element={<Budgets />} />
                <Route path="/finance/accounts" element={<Accounts />} />
                <Route path="/finance/transactions" element={<Transactions />} />
                <Route path="/finance/planned-payments" element={<PlannedPayments />} />
                <Route path="/finance/savings" element={<Savings />} />
                <Route path="/finance/investments" element={<Investments />} />
                <Route path="/finance/debts" element={<Debts />} />

                {/* Payments Routes */}
                <Route path="/payments/transactions" element={<Finance />} />
                <Route path="/payments/transaction" element={<Finance />} />
                <Route path="/payments/people" element={<Navigate to="/books/people" replace />} />
                <Route path="/payments/wallet" element={<Wallet />} />
                <Route path="/payments/plan" element={<FinancialPlan />} />
                <Route path="/payments/planner" element={<FinancialPlan />} />
                <Route path="/payments/segregation" element={<Segregation />} />
                <Route path="/payments/split-collect" element={<Navigate to="/books/split-collect" replace />} />
                <Route path="/payments/split-expense" element={<Navigate to="/books/split-collect" replace />} />
                <Route path="/payments/rewards-offers" element={<Rewards />} />

                {/* Referral Routes */}
                <Route path="/referral" element={<Referral />} />
                <Route path="/refer-earn" element={<Referral />} />

                {/* Books Section */}
                <Route path="/books/finance" element={<Navigate to="/books/accounting" replace />} />
                <Route path="/books/tax-deductions" element={<TaxDeductions />} />
                <Route path="/books" element={<Books />} />
                <Route path="/books/dashboard" element={<BooksDashboard />} />
                <Route path="/books/stock" element={<Stock />} />
                <Route path="/books/people" element={<People />} />
                <Route path="/books/people/overview" element={<PeopleOverview />} />
                <Route path="/books/people/:id" element={<PersonProfile />} />
                <Route path="/books/people/transactions" element={<PeopleTransactions />} />
                <Route path="/books/people/reminders" element={<PeopleReminders />} />
                <Route path="/books/people/records" element={<PeopleRecords />} />
                <Route path="/books/split-collect" element={<SplitExpense />} />
                <Route path="/books/split-expense" element={<Navigate to="/books/split-collect" replace />} />
                <Route path="/books/settings" element={<Settings />} />
                <Route path="/books/faq" element={<FAQ />} />
                <Route path="/books/money-tracker" element={<Navigate to="/books/track/simple-billing" replace />} />
                <Route path="/books/track" element={<Navigate to="/books/track/simple-billing" replace />} />
                <Route path="/books/track/simple-billing" element={<SimpleBilling />} />
                <Route path="/books/track/billing-records" element={<BillingRecords />} />
                <Route path="/books/accounting" element={<Accounting />} />
                <Route path="/books/purchase-details" element={<PurchaseDetails />} />
                <Route path="/books/finance/staff-details" element={<StaffDetails />} />

                {/* Public / Social Section */}
                <Route path="/public" element={<Public />} />
                <Route path="/social/meetup" element={<Public />} />
                <Route path="/social/trading" element={<Public />} />
                <Route path="/social/beta-club" element={<Public />} />

                {/* FIN-PRO CA Section */}
                <Route path="/ca" element={<BusinessCA />} />
                
                {/* Subscription Section */}
                <Route path="/subscription" element={<Subscription />} />
              </Routes>
            </Suspense>
          </div>
        </MainLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}

function AppContent() {

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/join" element={
          <Suspense fallback={<PageLoader />}>
            <Join />
          </Suspense>
        } />
        <Route path="/register" element={
          <Suspense fallback={<PageLoader />}>
            <Register />
          </Suspense>
        } />
        <Route path="/auth" element={
          <Suspense fallback={<PageLoader />}>
            <Auth />
          </Suspense>
        } />
        <Route path="/auditor" element={
          <Suspense fallback={<PageLoader />}>
            <AuditorLayout>
              <Auditor />
            </AuditorLayout>
          </Suspense>
        } />
        <Route path="/books/profile" element={
          <Suspense fallback={<PageLoader />}>
            <Profile />
          </Suspense>
        } />

        {/* Protected Routes - All routes within MainLayout require authentication */}
        <Route path="*" element={<AuthenticatedApp />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;
