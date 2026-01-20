import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Accounts from './pages/Accounts';
import PlannedPayments from './pages/PlannedPayments';
import Savings from './pages/Savings';
import Investments from './pages/Investments';
import Debts from './pages/Debts';
import Finance from './pages/Finance';
import Books from './pages/Books';
import Public from './pages/Public';
import Stock from './pages/Stock';
import PlanBudget from './pages/financial-plan/PlanBudget';
import PlanIncome from './pages/financial-plan/PlanIncome';
import PlanExpense from './pages/financial-plan/PlanExpense';
import FinancialCalendar from './pages/financial-plan/FinancialCalendar';
import PlanGoals from './pages/financial-plan/PlanGoals';
import PlanReminders from './pages/financial-plan/PlanReminders';
import PlanAnalysis from './pages/financial-plan/PlanAnalysis';
import PeopleOverview from './pages/people/PeopleOverview';
import PeopleTransactions from './pages/people/PeopleTransactions';
import PeopleReminders from './pages/people/PeopleReminders';
import PeopleRecords from './pages/people/PeopleRecords';
import FinancialContacts from './pages/FinancialContacts';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Profile Page with custom layout */}
        <Route path="/books/profile" element={<Profile />} />

        {/* Main App Layout for all other routes */}
        <Route path="*" element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/home/income" element={<Income />} />
              <Route path="/home/expenses" element={<Expenses />} />
              <Route path="/home/budgets" element={<Budgets />} />
              <Route path="/home/accounts" element={<Accounts />} />
              <Route path="/home/planned-payments" element={<PlannedPayments />} />
              <Route path="/home/savings" element={<Savings />} />
              <Route path="/home/investments" element={<Investments />} />
              <Route path="/home/debts" element={<Debts />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/stock" element={<Stock />} />
              <Route path="/books/plan/budget" element={<PlanBudget />} />
              <Route path="/books/plan/income" element={<PlanIncome />} />
              <Route path="/books/plan/expense" element={<PlanExpense />} />
              <Route path="/books/plan/calendar" element={<FinancialCalendar />} />
              <Route path="/books/plan/goals" element={<PlanGoals />} />
              <Route path="/books/plan/reminders" element={<PlanReminders />} />
              <Route path="/books/plan/analysis" element={<PlanAnalysis />} />
              <Route path="/books/people/overview" element={<PeopleOverview />} />
              <Route path="/books/people/transactions" element={<PeopleTransactions />} />
              <Route path="/books/people/reminders" element={<PeopleReminders />} />
              <Route path="/books/people/records" element={<PeopleRecords />} />
              <Route path="/books/contacts" element={<FinancialContacts />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/public" element={<Public />} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
