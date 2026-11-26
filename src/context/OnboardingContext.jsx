import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './auth-context';
import { OnboardingContext } from './onboarding-context';
import { MAIN_TOUR_STEPS, PAGE_TOURS, PAGE_TOUR_LIST } from '../config/onboardingTours';

const STORAGE_PREFIX = 'cliks_onboarding_v1:';
const REGISTERED_EMAIL_KEY = 'cliks_just_registered_email';
const NEW_USER_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const PUBLIC_OR_CRITICAL_PREFIXES = [
    '/auth',
    '/join',
    '/register',
    '/auditor',
    '/books/profile',
    '/books/tax-filing',
];

const EXISTING_ACTIVITY_KEYS = [
    'cliks_books_shortcuts',
    'cliks_pinned_people',
    'cliks_pinned_tools',
    'cliks_custom_shortcuts',
];

const getUserKey = (user) => {
    if (!user) return null;
    const raw = user.id ?? user.user_id ?? user.email;
    if (raw === undefined || raw === null || String(raw).trim() === '') return null;
    return String(raw).trim().toLowerCase();
};

const getStorageKey = (userKey) => `${STORAGE_PREFIX}${userKey}`;

const defaultState = () => ({
    version: 1,
    mainCompleted: false,
    mainSkipped: false,
    autoWelcomeSuppressed: false,
    suppressAutoPageTours: false,
    completedPages: {},
    firstSeenAt: Date.now(),
    updatedAt: Date.now(),
});

const readStoredState = (userKey) => {
    try {
        const raw = localStorage.getItem(getStorageKey(userKey));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;
        return {
            ...defaultState(),
            ...parsed,
            completedPages: parsed.completedPages && typeof parsed.completedPages === 'object'
                ? parsed.completedPages
                : {},
        };
    } catch {
        return null;
    }
};

const writeStoredState = (userKey, state) => {
    if (!userKey) return;
    try {
        localStorage.setItem(
            getStorageKey(userKey),
            JSON.stringify({ ...state, updatedAt: Date.now() })
        );
    } catch {
        // Ignore storage quota / private mode failures cleanly
    }
};

const detectExistingUser = (user) => {
    if (!user) return true;

    const email = user.email ? String(user.email).trim().toLowerCase() : null;
    try {
        const justRegistered = sessionStorage.getItem(REGISTERED_EMAIL_KEY);
        if (justRegistered && email && justRegistered === email) {
            sessionStorage.removeItem(REGISTERED_EMAIL_KEY);
            return false;
        }
    } catch {
        // ignore sessionStorage error
    }

    if (user.is_new_user === true || user.isNewUser === true) {
        return false;
    }

    const createdRaw = user.created_at || user.createdAt || user.created;
    if (createdRaw) {
        const createdMs = Date.parse(createdRaw);
        if (!Number.isNaN(createdMs)) {
            return Date.now() - createdMs > NEW_USER_MAX_AGE_MS;
        }
    }

    try {
        const hasActivity = EXISTING_ACTIVITY_KEYS.some((key) => {
            const val = localStorage.getItem(key);
            return Boolean(val && val !== '[]' && val !== '{}');
        });
        if (hasActivity) return true;
    } catch {
        // ignore localStorage read issues
    }

    return false;
};

const isElementVisibleAndEnabled = (el) => {
    if (!el || !el.isConnected) return false;
    if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
};

const isCriticalRoute = (pathname) => {
    if (!pathname || pathname === '/') return true;
    return PUBLIC_OR_CRITICAL_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};

const hasBlockingWorkflowDialog = () => {
    if (typeof document === 'undefined') return false;
    const customBlocker = document.querySelector('[data-tour-blocking="true"]');
    if (customBlocker) return true;
    // Do not interrupt ICAI verification, Cashfree checkout, or other open interactive dialogs
    if (document.querySelector('iframe[src*="cashfree"], [id*="cashfree"]')) return true;
    return false;
};

export const OnboardingProvider = ({ children }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const userKey = useMemo(() => (isAuthenticated ? getUserKey(user) : null), [isAuthenticated, user]);

    const [userState, setUserState] = useState(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const [activeTour, setActiveTour] = useState(null); // { id, title, isMain, steps }
    const [stepIndex, setStepIndex] = useState(0);
    const [targetElement, setTargetElement] = useState(null);
    const [targetElements, setTargetElements] = useState([]);

    const activeTourRef = useRef(null);
    activeTourRef.current = activeTour;
    const pendingNavigationRef = useRef(null);

    const eligibilityCtx = useMemo(() => {
        let activePlan = 'Free Plan';
        let finproFlag = false;
        try {
            activePlan =
                localStorage.getItem('cliks_active_plan') ||
                user?.tier ||
                user?.plan ||
                'Free Plan';
            finproFlag = localStorage.getItem('cliks_finpro_verified') === 'true';
        } catch {
            // ignore storage failures
        }
        const isFinProVerified = Boolean(
            user?.is_finpro_verified ||
                user?.ca_verification_status === 'verified' ||
                user?.is_ca ||
                finproFlag
        );
        return { user, activePlan, isFinProVerified };
    }, [user]);

    const filterEligibleSteps = useCallback(
        (steps) => steps.filter((step) => !step.when || step.when(eligibilityCtx)),
        [eligibilityCtx]
    );

    const activeSteps = useMemo(() => {
        if (!activeTour) return [];
        return filterEligibleSteps(activeTour.steps);
    }, [activeTour, filterEligibleSteps]);

    const currentStep = activeSteps[stepIndex] || null;

    // Initialize or reload onboarding state whenever the authenticated user changes
    useEffect(() => {
        setActiveTour(null);
        setStepIndex(0);
        setTargetElement(null);
        setShowWelcome(false);

        if (!isAuthenticated || isLoading || !userKey) {
            setUserState(null);
            return;
        }

        const existing = readStoredState(userKey);
        if (existing) {
            setUserState(existing);
            return;
        }

        const existingUser = detectExistingUser(user);
        const initial = {
            ...defaultState(),
            mainSkipped: existingUser,
            autoWelcomeSuppressed: existingUser,
            suppressAutoPageTours: existingUser,
        };
        writeStoredState(userKey, initial);
        setUserState(initial);
    }, [isAuthenticated, isLoading, userKey, user]);

    const updateUserState = useCallback(
        (updater) => {
            if (!userKey) return;
            setUserState((prev) => {
                const base = prev || readStoredState(userKey) || defaultState();
                const next = typeof updater === 'function' ? updater(base) : { ...base, ...updater };
                writeStoredState(userKey, next);
                return next;
            });
        },
        [userKey]
    );

    // Show welcome modal once for eligible first-time users after shell mounts
    useEffect(() => {
        if (
            !userKey ||
            !userState ||
            activeTour ||
            userState.mainCompleted ||
            userState.mainSkipped ||
            userState.autoWelcomeSuppressed ||
            isCriticalRoute(location.pathname) ||
            hasBlockingWorkflowDialog()
        ) {
            return;
        }

        let rafId = window.requestAnimationFrame(() => {
            if (document.querySelector('[data-tour]')) {
                setShowWelcome(true);
            }
        });

        const observer = new MutationObserver(() => {
            if (document.querySelector('[data-tour]')) {
                setShowWelcome(true);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.cancelAnimationFrame(rafId);
            observer.disconnect();
        };
    }, [userKey, userState, activeTour, location.pathname]);

    // Auto-start contextual page tour on first visit for complex pages
    useEffect(() => {
        if (
            !userKey ||
            !userState ||
            activeTour ||
            showWelcome ||
            userState.suppressAutoPageTours ||
            isCriticalRoute(location.pathname) ||
            hasBlockingWorkflowDialog()
        ) {
            return;
        }

        // Wait until first-time welcome decision has been made (started or skipped)
        if (!userState.mainCompleted && !userState.mainSkipped && !userState.autoWelcomeSuppressed) {
            return;
        }

        const matchedPageTour = PAGE_TOUR_LIST.find((tour) => tour.matchPath(location.pathname));
        if (!matchedPageTour) return;
        if (matchedPageTour.when && !matchedPageTour.when(eligibilityCtx)) return;
        if (userState.completedPages?.[matchedPageTour.id]) return;

        const filtered = filterEligibleSteps(matchedPageTour.steps);
        if (filtered.length === 0) return;

        let started = false;
        const tryStart = () => {
            if (started || hasBlockingWorkflowDialog()) return false;
            const firstMatch = filtered.find((step) => {
                const selectors = step.targets || [step.target];
                return selectors.every((selector) =>
                    isElementVisibleAndEnabled(document.querySelector(selector))
                );
            });
            if (!firstMatch) return false;
            started = true;
            setActiveTour({
                id: matchedPageTour.id,
                title: matchedPageTour.title,
                isMain: false,
                steps: matchedPageTour.steps,
            });
            setStepIndex(0);
            return true;
        };

        const rafId = window.requestAnimationFrame(() => {
            tryStart();
        });

        const observer = new MutationObserver(() => {
            if (tryStart()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.cancelAnimationFrame(rafId);
            observer.disconnect();
        };
    }, [
        userKey,
        userState,
        activeTour,
        showWelcome,
        location.pathname,
        eligibilityCtx,
        filterEligibleSteps,
    ]);

    const completeTourState = useCallback(
        (tour, status) => {
            if (!tour) return;
            if (tour.isMain) {
                updateUserState((prev) => ({
                    ...prev,
                    mainCompleted: status === 'completed' ? true : prev.mainCompleted,
                    mainSkipped: status === 'skipped' ? true : prev.mainSkipped,
                    autoWelcomeSuppressed: true,
                    completedPages: status === 'completed'
                        ? {
                            ...prev.completedPages,
                            page_dashboard: 'completed',
                            page_accounting: 'completed',
                            page_purchases: 'completed',
                            page_finance: 'completed',
                            page_books: 'completed',
                            page_stock: 'completed',
                            page_people: 'completed',
                            page_notifications: 'completed',
                            page_social: 'completed',
                        }
                        : prev.completedPages,
                }));
            } else {
                updateUserState((prev) => ({
                    ...prev,
                    completedPages: {
                        ...prev.completedPages,
                        [tour.id]: status,
                    },
                }));
            }
        },
        [updateUserState]
    );

    const stopTour = useCallback(() => {
        pendingNavigationRef.current = null;
        setActiveTour(null);
        setStepIndex(0);
        setTargetElement(null);
    }, []);

    const finishActiveTour = useCallback(() => {
        const tour = activeTourRef.current;
        completeTourState(tour, 'completed');
        stopTour();
    }, [completeTourState, stopTour]);

    const skipActiveTour = useCallback(() => {
        const tour = activeTourRef.current;
        completeTourState(tour, 'skipped');
        stopTour();
    }, [completeTourState, stopTour]);

    const skipMainTour = useCallback(() => {
        setShowWelcome(false);
        updateUserState((prev) => ({
            ...prev,
            mainSkipped: true,
            autoWelcomeSuppressed: true,
        }));
    }, [updateUserState]);

    const startMainTour = useCallback(
        ({ manual = false } = {}) => {
            setShowWelcome(false);
            const steps = filterEligibleSteps(MAIN_TOUR_STEPS);
            if (steps.length === 0) return false;
            pendingNavigationRef.current = null;

            if (!manual) {
                updateUserState((prev) => ({
                    ...prev,
                    autoWelcomeSuppressed: true,
                }));
            }

            setTargetElement(null);
            setActiveTour({
                id: 'main_tour',
                title: 'CLIKS Workspace Tour',
                isMain: true,
                steps: MAIN_TOUR_STEPS,
            });
            setStepIndex(0);

            return true;
        },
        [filterEligibleSteps, updateUserState]
    );

    const startPageTour = useCallback(
        (tourId, { manual = true } = {}) => {
            const tour = PAGE_TOURS[tourId];
            if (!tour) return false;
            if (tour.when && !tour.when(eligibilityCtx)) return false;

            const steps = filterEligibleSteps(tour.steps);
            if (steps.length === 0) return false;

            setShowWelcome(false);
            pendingNavigationRef.current = null;
            setTargetElement(null);
            setActiveTour({
                id: tour.id,
                title: tour.title,
                isMain: false,
                steps: tour.steps,
            });
            setStepIndex(0);

            if ((manual || !tour.matchPath(location.pathname)) && tour.route && location.pathname !== tour.route) {
                navigate(tour.route);
            }
            return true;
        },
        [eligibilityCtx, filterEligibleSteps, location.pathname, navigate]
    );

    const nextStep = useCallback(() => {
        pendingNavigationRef.current = null;
        setTargetElement(null);
        if (stepIndex + 1 >= activeSteps.length) {
            const tour = activeTourRef.current;
            completeTourState(tour, 'completed');
            setActiveTour(null);
            setStepIndex(0);
            return;
        }
        setStepIndex(stepIndex + 1);
    }, [stepIndex, activeSteps.length, completeTourState]);

    const prevStep = useCallback(() => {
        pendingNavigationRef.current = null;
        setTargetElement(null);
        setStepIndex((prev) => Math.max(0, prev - 1));
    }, []);

    const handleInteractiveTargetClick = useCallback(() => {
        const tour = activeTourRef.current;
        if (!tour || !currentStep?.interactiveClick) return;

        if (!currentStep.nextRoute || location.pathname === currentStep.nextRoute) {
            nextStep();
            return;
        }

        pendingNavigationRef.current = {
            tourId: tour.id,
            stepId: currentStep.id,
            stepIndex,
            nextRoute: currentStep.nextRoute,
        };
    }, [currentStep, location.pathname, nextStep, stepIndex]);

    const resetOnboarding = useCallback(() => {
        if (!userKey) return;
        const fresh = {
            ...defaultState(),
            mainCompleted: false,
            mainSkipped: false,
            autoWelcomeSuppressed: false,
            suppressAutoPageTours: false,
            completedPages: {},
        };
        writeStoredState(userKey, fresh);
        setUserState(fresh);
        stopTour();
    }, [userKey, stopTour]);

    // Resolve only on the expected route and wait for the rendered target before showing a step.
    useEffect(() => {
        if (!activeTour) {
            setTargetElement(null);
            setTargetElements([]);
            return;
        }

        if (!currentStep) {
            finishActiveTour();
            return;
        }

        const pendingNavigation = pendingNavigationRef.current;
        if (
            pendingNavigation &&
            pendingNavigation.tourId === activeTour.id &&
            pendingNavigation.stepId === currentStep.id &&
            pendingNavigation.stepIndex === stepIndex &&
            location.pathname === pendingNavigation.nextRoute
        ) {
            pendingNavigationRef.current = null;
            setTargetElement(null);
            setTargetElements([]);
            setStepIndex(stepIndex + 1);
            return;
        }

        if (currentStep.route && location.pathname !== currentStep.route) {
            setTargetElement(null);
            setTargetElements([]);
            return;
        }

        if (currentStep.requiresSidebar) {
            window.dispatchEvent(new CustomEvent('cliks:ensure-sidebar-open'));
        }

        let cancelled = false;
        const resolveTarget = () => {
            if (cancelled) return false;
            if (
                currentStep.readyTarget &&
                !isElementVisibleAndEnabled(document.querySelector(currentStep.readyTarget))
            ) {
                return false;
            }
            const selectors = currentStep.targets || [currentStep.target];
            const candidates = selectors.map((selector) => document.querySelector(selector));
            if (candidates.every(isElementVisibleAndEnabled)) {
                setTargetElement(candidates[0]);
                setTargetElements(candidates);
                return true;
            }
            return false;
        };

        if ((!currentStep.route || location.pathname === currentStep.route) && resolveTarget()) {
            return () => {
                cancelled = true;
            };
        }

        const rafId = window.requestAnimationFrame(() => {
            resolveTarget();
        });

        const observer = new MutationObserver(() => {
            if (resolveTarget()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'hidden', 'disabled', 'aria-disabled'],
        });

        return () => {
            cancelled = true;
            window.cancelAnimationFrame(rafId);
            observer.disconnect();
        };
    }, [
        activeTour,
        currentStep,
        stepIndex,
        activeSteps.length,
        location.pathname,
        finishActiveTour,
    ]);

    const availablePageTours = useMemo(
        () => PAGE_TOUR_LIST.filter((tour) => !tour.when || tour.when(eligibilityCtx)),
        [eligibilityCtx]
    );

    const value = useMemo(
        () => ({
            showWelcome,
            userName: user?.name || user?.username || '',
            userState,
            activeTour,
            activeSteps,
            stepIndex,
            currentStep,
            targetElement,
            targetElements,
            availablePageTours,
            startMainTour,
            skipMainTour,
            startPageTour,
            handleInteractiveTargetClick,
            nextStep,
            prevStep,
            skipActiveTour,
            finishActiveTour,
            resetOnboarding,
            isPageCompleted: (tourId) => Boolean(userState?.completedPages?.[tourId]),
        }),
        [
            showWelcome,
            user,
            userState,
            activeTour,
            activeSteps,
            stepIndex,
            currentStep,
            targetElement,
            targetElements,
            availablePageTours,
            startMainTour,
            skipMainTour,
            startPageTour,
            handleInteractiveTargetClick,
            nextStep,
            prevStep,
            skipActiveTour,
            finishActiveTour,
            resetOnboarding,
        ]
    );

    return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};
