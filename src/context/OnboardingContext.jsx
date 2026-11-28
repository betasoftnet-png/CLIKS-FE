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

import { BIT_GUIDES, CHECKLIST_TOURS, LEGACY_ONBOARDING_KEY, readChecklistProgress } from '../config/onboardingChecklist';

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
    '/books/settings',
];

const EXISTING_ACTIVITY_KEYS = [
    'cliks_books_shortcuts',
    'cliks_pinned_people',
    'cliks_pinned_tools',
    'cliks_custom_shortcuts',
];

const getUserKey = (user) => {
    if (!user) return null;
    // The existing SSO fallback is shared by accounts whose token has no subject.
    const raw = (user.id === 'sso-user' ? user.user_id : user.id ?? user.user_id) ?? user.email;
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
    guides: {},
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

const detectExistingUser = (user, requireFirstTimeEvidence = false) => {
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

    if (requireFirstTimeEvidence) return true;

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

const isTargetExposed = (target) => {
    if (typeof document.elementsFromPoint !== 'function') return true;
    const { left, top, right, bottom } = target.getBoundingClientRect();
    const visibleLeft = Math.max(0, left);
    const visibleTop = Math.max(0, top);
    const visibleRight = Math.min(window.innerWidth, right);
    const visibleBottom = Math.min(window.innerHeight, bottom);
    if (visibleRight <= visibleLeft || visibleBottom <= visibleTop) return false;
    const x = (visibleLeft + visibleRight) / 2;
    return [0.15, 0.5, 0.85].some((fraction) => {
        const y = visibleTop + (visibleBottom - visibleTop) * fraction;
        const hit = document.elementsFromPoint(x, y).find((element) =>
            !element.closest('[data-onboarding-tooltip]'));
        return hit && target.contains(hit);
    });
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

export const OnboardingProvider = ({ children, checklist = false }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const userKey = useMemo(() => (isAuthenticated ? getUserKey(user) : null), [isAuthenticated, user]);

    const [sessionState, setSessionState] = useState(null);
    const userState = sessionState?.owner === userKey ? sessionState.state : null;
    const [showWelcome, setShowWelcome] = useState(false);
    const [activeTour, setActiveTour] = useState(null); // { id, title, isMain, steps }
    const [stepIndex, setStepIndex] = useState(0);
    const [targetElement, setTargetElement] = useState(null);
    const [targetElements, setTargetElements] = useState([]);

    const activeTourRef = useRef(null);
    activeTourRef.current = activeTour;
    const pendingNavigationRef = useRef(null);
    const pendingPageEntryRef = useRef(null);
    const [requestedTool, setRequestedTool] = useState(null);

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
        let parsedSubs = user?.active_subscriptions;
        if (typeof parsedSubs === 'string') {
            try { parsedSubs = JSON.parse(parsedSubs); } catch {}
        }
        const hasFinProSub = Boolean(
            parsedSubs?.fin_pro?.plan ||
            parsedSubs?.fin_pro?.active ||
            user?.finpro_plan ||
            user?.ca_plan
        );
        const isFinProVerified = Boolean(
            user?.is_finpro_verified ||
                user?.ca_verification_status === 'verified' ||
                user?.ca_verification_status === 'VERIFIED' ||
                user?.is_ca ||
                user?.role === 'ca' ||
                hasFinProSub ||
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
            setSessionState(null);
            return;
        }

        const existing = readStoredState(userKey);
        const guides = checklist ? { ...readChecklistProgress(userKey), ...existing?.guides } : {};
        const existingUser = existing ? existing.suppressAutoPageTours : detectExistingUser(user, checklist);
        const state = existing || {
            ...defaultState(),
            mainSkipped: existingUser,
            autoWelcomeSuppressed: existingUser,
            suppressAutoPageTours: existingUser,
        };
        const next = checklist ? {
            ...state,
            guides,
            checklistEligible: state.checklistEligible ??
                (Object.keys(guides).length > 0 || (!existingUser && !state.mainCompleted && !state.mainSkipped)),
        } : state;

        if (!existing || (checklist && existing.checklistEligible === undefined)) writeStoredState(userKey, next);
        setSessionState({ owner: userKey, state: next });
    }, [isAuthenticated, isLoading, userKey, checklist]);

    const updateUserState = useCallback(
        (updater) => {
            if (!userKey) return;
            setSessionState((previous) => {
                if (previous?.owner !== userKey) return previous;
                const stored = readStoredState(userKey);
                const base = checklist && stored
                    ? { ...stored, guides: { ...previous.state.guides, ...stored.guides } }
                    : previous.state;
                const next = typeof updater === 'function' ? updater(base) : { ...base, ...updater };
                writeStoredState(userKey, next);
                return { owner: userKey, state: next };
            });
        },
        [checklist, userKey]
    );

    // Show welcome modal once for eligible first-time users after shell mounts
    useEffect(() => {
        if (
            checklist ||
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
    }, [checklist, userKey, userState, activeTour, location.pathname]);

    // Auto-start contextual page tour on first visit for complex pages
    useEffect(() => {
        if (
            checklist ||
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
            const firstMatch = filtered[0].visibleDelay || filtered.find((step) => {
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
        checklist,
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
                            page_accounting: 'completed',
                            page_purchases: 'completed',
                            page_finance: 'completed',
                            page_books: 'completed',
                            page_stock: 'completed',
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
        pendingPageEntryRef.current = null;
        setActiveTour(null);
        setStepIndex(0);
        setTargetElement(null);
        setTargetElements([]);
    }, []);

    const openChecklistTour = useCallback((config, steps) => {
        if (!steps.length) return false;
        setShowWelcome(false);
        setTargetElement(null);
        setTargetElements([]);
        setActiveTour({ ...config, steps, checklist: true });
        setStepIndex(0);
        return true;
    }, []);

    const activeChecklist = CHECKLIST_TOURS.find((tour) => tour.matchPath(location.pathname));

    useEffect(() => {
        if (!checklist || !userKey || !userState || isCriticalRoute(location.pathname)) return;
        if (activeTour) return;
        const tool = requestedTool?.pathname === location.pathname && BIT_GUIDES[requestedTool.name];
        if (tool && !userState.guides?.['page_bit:' + tool.id]) {
            const { pathname } = requestedTool;
            openChecklistTour({ id: 'page_bit', title: 'BIT Tool', matchPath: (path) => path === pathname }, [tool]);
            return;
        }
        if (!userState.checklistEligible || !activeChecklist) return;
        const steps = activeChecklist.steps.filter((step) => !userState.guides?.[activeChecklist.id + ':' + step.id]);
        openChecklistTour(activeChecklist, steps);
    }, [checklist, userKey, userState, activeTour, activeChecklist, location.pathname, requestedTool, openChecklistTour]);

    useEffect(() => {
        if (!checklist) return;
        const cancelTool = () => {
            setRequestedTool(null);
            if (activeTourRef.current?.id === 'page_bit') stopTour();
        };
        const requestTool = ({ detail }) => {
            const name = detail?.tool?.toLowerCase();
            const step = BIT_GUIDES[name];
            if (!userState?.checklistEligible || isCriticalRoute(location.pathname)) return;
            if (detail?.open === false || !step || userState?.guides?.['page_bit:' + step.id]) {
                cancelTool();
                return;
            }
            setRequestedTool({ name, pathname: location.pathname });
            stopTour();
        };
        window.addEventListener('cliks:bit-tool-click', requestTool);
        window.addEventListener('cliks:bit-toggle-click', cancelTool);
        return () => {
            window.removeEventListener('cliks:bit-tool-click', requestTool);
            window.removeEventListener('cliks:bit-toggle-click', cancelTool);
        };
    }, [checklist, location.pathname, userState, stopTour]);

    useEffect(() => { setRequestedTool(null); }, [location.pathname, userKey]);

    const advanceChecklist = useCallback((status) => {
        const tour = activeTourRef.current;
        if (!tour?.checklist || !currentStep) return false;
        const key = tour.id + ':' + currentStep.id;
        updateUserState((prev) => ({
            ...prev,
            guides: {
                ...prev.guides,
                [key]: prev.guides?.[key] || status,
            },
        }));
        if (stepIndex + 1 >= activeSteps.length) {
            if (tour.id === 'page_bit') setRequestedTool(null);
            stopTour();
        } else {
            setTargetElement(null);
            setTargetElements([]);
            setStepIndex(stepIndex + 1);
        }
        return true;
    }, [activeSteps.length, currentStep, stepIndex, stopTour, updateUserState]);

    const finishActiveTour = useCallback(() => {
        if (advanceChecklist('completed')) return;
        const tour = activeTourRef.current;
        completeTourState(tour, 'completed');
        stopTour();
    }, [advanceChecklist, completeTourState, stopTour]);

    const skipActiveTour = useCallback(() => {
        if (advanceChecklist('skipped')) return;
        const tour = activeTourRef.current;
        if (currentStep?.visibleDelay && stepIndex < activeSteps.length - 1) {
            setTargetElement(null);
            setTargetElements([]);
            setStepIndex(stepIndex + 1);
            return;
        }
        completeTourState(tour, 'skipped');
        stopTour();
    }, [activeSteps.length, advanceChecklist, completeTourState, currentStep, stepIndex, stopTour]);

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
            if (checklist) {
                const dashboard = CHECKLIST_TOURS[0];
                if (!dashboard.matchPath(location.pathname)) {
                    pendingPageEntryRef.current = location.pathname;
                    navigate(dashboard.route);
                }
                return openChecklistTour(dashboard, dashboard.steps);
            }
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
        [checklist, filterEligibleSteps, location.pathname, navigate, openChecklistTour, updateUserState]
    );

    const startPageTour = useCallback(
        (tourId, { manual = true } = {}) => {
            const config = checklist && CHECKLIST_TOURS.find((item) => item.id === tourId);
            if (config) {
                if (!config.matchPath(location.pathname)) {
                    pendingPageEntryRef.current = location.pathname;
                    navigate(config.route);
                }
                return openChecklistTour(config, config.steps);
            }
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

            if ((!tour.matchPath(location.pathname) || (manual && !steps[0].visibleDelay)) && tour.route && location.pathname !== tour.route) {
                if (steps[0].visibleDelay) pendingPageEntryRef.current = location.pathname;
                navigate(tour.route);
            }
            return true;
        },
        [checklist, eligibilityCtx, filterEligibleSteps, location.pathname, navigate, openChecklistTour]
    );

    const nextStep = useCallback(() => {
        if (advanceChecklist('completed')) return;
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
    }, [stepIndex, activeSteps.length, advanceChecklist, completeTourState]);

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
        if (!userKey || (checklist && !import.meta.env.DEV)) return;
        const fresh = { ...defaultState(), checklistEligible: true };
        writeStoredState(userKey, fresh);
        setSessionState({ owner: userKey, state: fresh });
        stopTour();
    }, [checklist, userKey, stopTour]);

    useEffect(() => {
        if (!checklist || !userKey || !import.meta.env.DEV || !['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)) return;
        const resetAll = () => {
            Object.keys(localStorage).filter((key) =>
                LEGACY_ONBOARDING_KEY.test(key) && key.slice(key.indexOf(':') + 1) === userKey)
                .forEach((key) => localStorage.removeItem(key));
            setRequestedTool(null);
            resetOnboarding();
        };
        window.__cliksResetAllOnboarding = resetAll;
        for (const config of CHECKLIST_TOURS) {
            window[config.resetName] = () => {
                if (config.legacyPrefix) localStorage.removeItem(config.legacyPrefix + userKey);
                updateUserState((prev) => ({
                    ...prev,
                    guides: Object.fromEntries(Object.entries(prev.guides || {}).filter(([key]) =>
                        !key.startsWith(config.id + ':') &&
                        !(config.id === 'page_dashboard' && key.startsWith('page_bit:')))),
                }));
                setRequestedTool(null);
                stopTour();
            };
        }
        return () => {
            delete window.__cliksResetAllOnboarding;
            CHECKLIST_TOURS.forEach((config) => { delete window[config.resetName]; });
        };
    }, [checklist, resetOnboarding, stopTour, updateUserState, userKey]);

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

        if (currentStep.visibleDelay && !(activeTour.matchPath || PAGE_TOURS[activeTour.id]?.matchPath)?.(location.pathname)) {
            if (pendingPageEntryRef.current !== location.pathname) stopTour();
            return;
        }

        if (currentStep.visibleDelay) {
            pendingPageEntryRef.current = null;
            let target;
            let inView = false;
            let timer;
            let shown = false;

            const canShow = () => inView && isElementVisibleAndEnabled(target) &&
                !hasBlockingWorkflowDialog() && (!activeTour.checklist || isTargetExposed(target));

            const refresh = () => {
                if (!canShow()) {
                    clearTimeout(timer);
                    timer = undefined;
                    if (shown) {
                        shown = false;
                        setTargetElement(null);
                        setTargetElements([]);
                    }
                    return;
                }

                if (shown || timer !== undefined) return;
                timer = window.setTimeout(() => {
                    timer = undefined;
                    if (!canShow()) return;
                    shown = true;
                    setTargetElement(target);
                    setTargetElements([target]);
                }, currentStep.visibleDelay);
            };

            const intersection = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
                if (entry.target !== target) return;
                const { width, height } = entry.intersectionRect || {};
                inView = entry.isIntersecting && (activeTour.checklist && width !== undefined
                    ? width >= Math.min(entry.boundingClientRect.width, 24) && height >= Math.min(entry.boundingClientRect.height, 24)
                    : entry.intersectionRatio >= 0.75);
                refresh();
            }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });

            const checkTarget = () => {
                const candidate = currentStep.target.split(',').flatMap((selector) =>
                    [...document.querySelectorAll(selector.trim())]).find(isElementVisibleAndEnabled);
                if (candidate !== target) {
                    if (!candidate && target && activeTour.id === 'page_bit') {
                        setRequestedTool(null);
                        stopTour();
                        return;
                    }
                    intersection?.disconnect();
                    target = candidate;
                    inView = false;
                    if (target) intersection?.observe(target);
                }
                refresh();
            };

            checkTarget();
            const mutations = new MutationObserver(checkTarget);
            mutations.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['hidden', 'disabled', 'aria-disabled', 'data-tour-blocking', 'data-tour', 'class'],
            });
            window.addEventListener('scroll', checkTarget, true);
            window.addEventListener('resize', checkTarget);
            window.addEventListener('transitionend', checkTarget, true);
            return () => {
                clearTimeout(timer);
                intersection?.disconnect();
                mutations.disconnect();
                window.removeEventListener('scroll', checkTarget, true);
                window.removeEventListener('resize', checkTarget);
                window.removeEventListener('transitionend', checkTarget, true);
            };
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
        stopTour,
    ]);

    const availablePageTours = useMemo(
        () => (checklist ? [
            ...CHECKLIST_TOURS,
            ...PAGE_TOUR_LIST.filter((tour) => !CHECKLIST_TOURS.some(({ id }) => id === tour.id)),
        ] : PAGE_TOUR_LIST).filter((tour) => !tour.when || tour.when(eligibilityCtx)),
        [checklist, eligibilityCtx]
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
