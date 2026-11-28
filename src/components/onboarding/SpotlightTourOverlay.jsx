import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Check, MousePointerClick } from 'lucide-react';

const PADDING = 5;
const TOOLTIP_GAP = 12;
const VIEWPORT_MARGIN = 12;

const getScrimPanels = (holes, viewportWidth, viewportHeight) => {
    const xs = new Set([0, viewportWidth]);
    const ys = new Set([0, viewportHeight]);

    holes.forEach((hole) => {
        xs.add(Math.max(0, Math.min(viewportWidth, hole.left)));
        xs.add(Math.max(0, Math.min(viewportWidth, hole.left + hole.width)));
        ys.add(Math.max(0, Math.min(viewportHeight, hole.top)));
        ys.add(Math.max(0, Math.min(viewportHeight, hole.top + hole.height)));
    });

    const xPoints = [...xs].sort((a, b) => a - b);
    const yPoints = [...ys].sort((a, b) => a - b);
    const panels = [];

    for (let xIndex = 0; xIndex < xPoints.length - 1; xIndex += 1) {
        for (let yIndex = 0; yIndex < yPoints.length - 1; yIndex += 1) {
            const left = xPoints[xIndex];
            const top = yPoints[yIndex];
            const width = xPoints[xIndex + 1] - left;
            const height = yPoints[yIndex + 1] - top;
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            const isHole = holes.some((hole) =>
                centerX >= hole.left &&
                centerX <= hole.left + hole.width &&
                centerY >= hole.top &&
                centerY <= hole.top + hole.height
            );

            if (width > 0 && height > 0 && !isHole) {
                panels.push({ left, top, width, height });
            }
        }
    }

    return panels;
};

/**
 * Lightweight, accessible spotlight tour overlay with automatic viewport clamping,
 * dark-mode support, ResizeObserver/scroll tracking, and keyboard navigation.
 */
const SpotlightTourOverlay = ({
    isOpen,
    step,
    targetElement,
    targetElements = [],
    stepIndex,
    totalSteps,
    tourTitle,
    onNext,
    onBack,
    onTargetClick,
    onSkip,
    onFinish,
}) => {
    const tooltipRef = useRef(null);
    const nextBtnRef = useRef(null);
    const [rectState, setRectState] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ top: 80, left: 24, placement: 'bottom' });

    const freeScroll = Boolean(step?.visibleDelay);
    const isLast = stepIndex >= totalSteps - 1;
    const targets = targetElements.length > 0 ? targetElements : (targetElement ? [targetElement] : []);
    const boxes = isOpen &&
        targets.length > 0 &&
        rectState?.stepId === step?.id &&
        rectState.targets.length === targets.length &&
        rectState.targets.every((target, index) => target === targets[index])
        ? rectState.boxes
        : [];
    const rect = useMemo(() => boxes.length > 0
        ? {
            top: Math.min(...boxes.map((box) => box.top)),
            left: Math.min(...boxes.map((box) => box.left)),
            right: Math.max(...boxes.map((box) => box.left + box.width)),
            bottom: Math.max(...boxes.map((box) => box.top + box.height)),
        }
        : null, [boxes]);
    const anchorRect = useMemo(() => rect
        ? { top: rect.top, left: rect.left, width: rect.right - rect.left, height: rect.bottom - rect.top }
        : null, [rect]);

    // Measure highlighted element and keep it synced on scroll/resize
    useLayoutEffect(() => {
        if (!isOpen || targets.length === 0) {
            return undefined;
        }

        let cancelled = false;
        const updateRect = () => {
            if (cancelled || targets.some((target) => !target.isConnected)) return;
            const measuredBoxes = targets.map((target) => {
                const r = target.getBoundingClientRect();
                return {
                    top: r.top - PADDING,
                    left: r.left - PADDING,
                    width: r.width + PADDING * 2,
                    height: r.height + PADDING * 2,
                };
            });
            if (measuredBoxes.some((box) => box.width <= PADDING * 2 || box.height <= PADDING * 2)) return;
            setRectState({
                targets,
                stepId: step?.id,
                boxes: measuredBoxes,
            });
        };

        if (!freeScroll) {
            targets.forEach((target) => target.scrollIntoView?.({ behavior: 'smooth', block: 'center', inline: 'nearest' }));
        }

        if (freeScroll) updateRect();
        else queueMicrotask(updateRect);
        const rafId = requestAnimationFrame(updateRect);
        const resizeObs = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateRect) : null;
        targets.forEach((target) => resizeObs?.observe(target));
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect, true);

        return () => {
            cancelled = true;
            cancelAnimationFrame(rafId);
            resizeObs?.disconnect();
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect, true);
        };
    }, [isOpen, targetElements, targetElement, step?.id, freeScroll]);

    // Compute smart tooltip position to prevent viewport clipping
    useLayoutEffect(() => {
        if (!isOpen || !anchorRect || !tooltipRef.current) return undefined;

        const computePos = () => {
            if (!tooltipRef.current) return;
            const tt = tooltipRef.current.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const preferred = step?.placement || 'bottom';

            const fits = {
                bottom: anchorRect.top + anchorRect.height + TOOLTIP_GAP + tt.height <= vh - VIEWPORT_MARGIN,
                top: anchorRect.top - TOOLTIP_GAP - tt.height >= VIEWPORT_MARGIN,
                right: anchorRect.left + anchorRect.width + TOOLTIP_GAP + tt.width <= vw - VIEWPORT_MARGIN,
                left: anchorRect.left - TOOLTIP_GAP - tt.width >= VIEWPORT_MARGIN,
            };

            const order = vw < 768
                ? ['bottom', 'top']
                : [preferred, 'bottom', 'right', 'top', 'left'];

            const chosen = order.find((p) => fits[p]) || 'bottom';

            let top = anchorRect.top + anchorRect.height + TOOLTIP_GAP;
            let left = anchorRect.left;

            if (chosen === 'top') {
                top = anchorRect.top - tt.height - TOOLTIP_GAP;
                left = anchorRect.left + anchorRect.width / 2 - tt.width / 2;
            } else if (chosen === 'right') {
                top = anchorRect.top + anchorRect.height / 2 - tt.height / 2;
                left = anchorRect.left + anchorRect.width + TOOLTIP_GAP;
            } else if (chosen === 'left') {
                top = anchorRect.top + anchorRect.height / 2 - tt.height / 2;
                left = anchorRect.left - tt.width - TOOLTIP_GAP;
            } else {
                top = anchorRect.top + anchorRect.height + TOOLTIP_GAP;
                left = anchorRect.left + anchorRect.width / 2 - tt.width / 2;
            }

            // Clamp inside viewport
            const clampedLeft = Math.max(VIEWPORT_MARGIN, Math.min(left, vw - tt.width - VIEWPORT_MARGIN));
            const clampedTop = Math.max(VIEWPORT_MARGIN, Math.min(top, vh - tt.height - VIEWPORT_MARGIN));

            setTooltipPos({ top: clampedTop, left: clampedLeft, placement: chosen });
        };

        queueMicrotask(computePos);
        return undefined;
    }, [isOpen, anchorRect, step?.id, step?.placement]);

    // Focus management + keyboard navigation
    useEffect(() => {
        if (!isOpen || freeScroll) return undefined;
        const raf = requestAnimationFrame(() => nextBtnRef.current?.focus());

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onSkip();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (!step?.interactiveClick) {
                    if (isLast) onFinish();
                    else onNext();
                }
            } else if (e.key === 'ArrowLeft' && stepIndex > 0) {
                e.preventDefault();
                onBack();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen, stepIndex, isLast, onNext, onBack, onSkip, onFinish, step?.id, freeScroll]);

    // Global Outside Click listener: dismiss current guide on outside click while allowing original action to execute
    useEffect(() => {
        if (!isOpen) return undefined;

        const onGlobalPointerDown = (e) => {
            // If click is inside the tooltip card itself, do not dismiss
            if (tooltipRef.current && tooltipRef.current.contains(e.target)) {
                return;
            }

            const interactiveTargets = targetElements.length > 0 ? targetElements : (targetElement ? [targetElement] : []);
            const isClickOnTarget = interactiveTargets.some((target) => target.contains(e.target));

            if (isClickOnTarget) {
                // If user clicks the highlighted target directly:
                // Let the target execute its native action and complete/advance the guide
                onTargetClick();
            } else {
                // If user clicks outside: dismiss only the current guide
                onSkip();
            }
        };

        window.addEventListener('pointerdown', onGlobalPointerDown, true);
        return () => window.removeEventListener('pointerdown', onGlobalPointerDown, true);
    }, [isOpen, targetElement, targetElements, onTargetClick, onSkip]);

    // Let the real target action happen before the tour handles its progression.
    useEffect(() => {
        const interactiveTargets = targetElements.length > 0 ? targetElements : (targetElement ? [targetElement] : []);
        if (!isOpen || !step?.interactiveClick || interactiveTargets.length === 0) return undefined;

        const handleTargetClick = () => onTargetClick();

        interactiveTargets.forEach((target) => target.addEventListener('click', handleTargetClick, { once: true }));
        return () => interactiveTargets.forEach((target) => target.removeEventListener('click', handleTargetClick));
    }, [isOpen, step?.id, step?.interactiveClick, targetElement, targetElements, onTargetClick]);

    if (!isOpen || !step || !rect || !anchorRect) return null;

    return (
        <div
            role="presentation"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10040,
                pointerEvents: 'none',
            }}
        >
            {/* Option 3: Single Rounded Spotlight (no green borders, outlines, rings, or glows) */}
            <div
                aria-hidden="true"
                data-tour-spotlight="true"
                style={{
                    position: 'fixed',
                    top: anchorRect.top,
                    left: anchorRect.left,
                    width: anchorRect.width,
                    height: anchorRect.height,
                    borderRadius: '14px',
                    border: '1px solid var(--tour-spotlight-border, rgba(255, 255, 255, 0.9))',
                    boxShadow: '0 0 0 9999px var(--tour-scrim-bg, rgba(15, 23, 42, 0.54))',
                    background: 'transparent',
                    pointerEvents: freeScroll || step.interactiveClick ? 'none' : 'auto',
                    transition: freeScroll ? 'none' : 'all 0.2s ease',
                }}
            />

            {/* Compact Accessible Tooltip */}
            <div
                ref={tooltipRef}
                role="dialog"
                aria-modal="false"
                data-onboarding-tooltip="true"
                aria-labelledby="cliks-tour-step-title"
                style={{
                    position: 'fixed',
                    top: tooltipPos.top,
                    left: tooltipPos.left,
                    width: 'min(320px, calc(100vw - 24px))',
                    background: 'var(--card-bg, #FFFFFF)',
                    color: 'var(--text-main, #0F172A)',
                    border: '1px solid var(--border-color, #DCF2E4)',
                    borderRadius: '14px',
                    padding: '0.95rem 1rem',
                    boxShadow: '0 20px 44px rgba(15, 23, 42, 0.24)',
                    pointerEvents: 'auto',
                    zIndex: 10045,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.45rem' }}>
                    <span
                        style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: 'var(--primary, #1B6B3A)',
                        }}
                    >
                        {tourTitle ? `${tourTitle} · ` : ''}Step {stepIndex + 1} of {totalSteps}
                    </span>
                    <button
                        type="button"
                        onClick={onSkip}
                        aria-label={freeScroll ? 'Skip guide' : 'Close tour'}
                        style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '7px',
                            border: '1px solid var(--border-color, #E2E8F0)',
                            background: 'transparent',
                            color: 'var(--text-muted, #64748B)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <X size={14} />
                    </button>
                </div>

                <h3
                    id="cliks-tour-step-title"
                    style={{
                        margin: '0 0 0.35rem 0',
                        fontSize: '0.94rem',
                        fontWeight: 800,
                        color: 'var(--text-main, #0F172A)',
                        lineHeight: 1.3,
                    }}
                >
                    {step.title}
                </h3>

                <p
                    style={{
                        margin: '0 0 0.75rem 0',
                        fontSize: '0.79rem',
                        lineHeight: 1.5,
                        color: 'var(--text-muted, #475569)',
                    }}
                >
                    {step.description}
                </p>

                {step.interactiveClick && (
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.28rem 0.55rem',
                            borderRadius: '999px',
                            background: 'var(--bg-color, #F0FDF4)',
                            border: '1px solid var(--border-color, #DCF2E4)',
                            color: 'var(--primary, #1B6B3A)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            marginBottom: '0.75rem',
                        }}
                    >
                        <MousePointerClick size={12} /> Click the highlighted item to continue
                    </div>
                )}

                {/* Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', paddingTop: '0.55rem', borderTop: '1px solid var(--border-color, #F1F5F9)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
                        <button
                            type="button"
                            onClick={onSkip}
                            style={{
                                padding: '0.38rem 0.6rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--text-muted, #64748B)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Skip
                        </button>

                        {(!freeScroll || step.allowBack) && stepIndex > 0 && (
                            <button
                                type="button"
                                onClick={onBack}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '2px',
                                    padding: '0.38rem 0.65rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color, #E2E8F0)',
                                    background: 'transparent',
                                    color: 'var(--text-main, #334155)',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <ChevronLeft size={14} /> Back
                            </button>
                        )}

                        {(!step.interactiveClick || step.showNext) && (
                            <button
                                ref={nextBtnRef}
                                type="button"
                                onClick={isLast ? onFinish : onNext}
                                style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                padding: '0.4rem 0.78rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                                color: '#FFFFFF',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                }}
                            >
                                {step.actionLabel || (isLast ? (
                                    <>
                                        Finish <Check size={14} />
                                    </>
                                ) : (
                                    <>
                                        Next <ChevronRight size={14} />
                                    </>
                                ))}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpotlightTourOverlay;
