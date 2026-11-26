import { createContext, useContext } from 'react';

export const OnboardingContext = createContext(null);

export const useOnboarding = () => {
    const ctx = useContext(OnboardingContext);
    if (!ctx) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return ctx;
};
