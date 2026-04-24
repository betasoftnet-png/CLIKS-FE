import { apiClient } from '../api/client';

/**
 * Financial Plan Service
 */
export const financialPlanService = {
    // Plans
    getPlans: async () => await apiClient.get('/plans'),
    getPlanById: async (id) => await apiClient.get(`/plans/${id}`),
    createPlan: async (data) => await apiClient.post('/plans', data),
    updatePlan: async (id, data) => await apiClient.put(`/plans/${id}`, data),
    deletePlan: async (id) => await apiClient.delete(`/plans/${id}`),

    // Plan Budgets
    getPlanBudgets: async (planId) => await apiClient.get(`/plans/${planId}/budgets`),
    createPlanBudget: async (planId, data) => await apiClient.post(`/plans/${planId}/budgets`, data),
    updatePlanBudget: async (planId, budgetId, data) => await apiClient.put(`/plans/${planId}/budgets/${budgetId}`, data),
    deletePlanBudget: async (planId, budgetId) => await apiClient.delete(`/plans/${planId}/budgets/${budgetId}`),

    // Plan Income
    getPlanIncome: async (planId) => await apiClient.get(`/plans/${planId}/income`),
    createPlanIncome: async (planId, data) => await apiClient.post(`/plans/${planId}/income`, data),
    updatePlanIncome: async (planId, incomeId, data) => await apiClient.put(`/plans/${planId}/income/${incomeId}`, data),
    deletePlanIncome: async (planId, incomeId) => await apiClient.delete(`/plans/${planId}/income/${incomeId}`),

    // Plan Expenses
    getPlanExpenses: async (planId) => await apiClient.get(`/plans/${planId}/expenses`),
    createPlanExpense: async (planId, data) => await apiClient.post(`/plans/${planId}/expenses`, data),
    updatePlanExpense: async (planId, expenseId, data) => await apiClient.put(`/plans/${planId}/expenses/${expenseId}`, data),
    deletePlanExpense: async (planId, expenseId) => await apiClient.delete(`/plans/${planId}/expenses/${expenseId}`),

    // Plan Goals
    getPlanGoals: async (planId) => await apiClient.get(`/plans/${planId}/goals`),
    createPlanGoal: async (planId, data) => await apiClient.post(`/plans/${planId}/goals`, data),
    updatePlanGoal: async (planId, goalId, data) => await apiClient.put(`/plans/${planId}/goals/${goalId}`, data),
    deletePlanGoal: async (planId, goalId) => await apiClient.delete(`/plans/${planId}/goals/${goalId}`),

    // Plan Reminders
    getPlanReminders: async (planId) => await apiClient.get(`/plans/${planId}/reminders`),
    createPlanReminder: async (planId, data) => await apiClient.post(`/plans/${planId}/reminders`, data),
    updatePlanReminder: async (planId, reminderId, data) => await apiClient.put(`/plans/${planId}/reminders/${reminderId}`, data),
    deletePlanReminder: async (planId, reminderId) => await apiClient.delete(`/plans/${planId}/reminders/${reminderId}`),

    // Analysis & Calendar
    getPlanAnalysis: async (planId) => await apiClient.get(`/plans/${planId}/analysis`),
    getCalendar: async () => await apiClient.get('/calendar'),
};

export default financialPlanService;
