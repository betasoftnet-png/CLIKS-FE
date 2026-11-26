import React from 'react';
import { useOnboarding } from '../../context/onboarding-context';
import WelcomeOnboardingModal from './WelcomeOnboardingModal';
import SpotlightTourOverlay from './SpotlightTourOverlay';

const OnboardingManager = () => {
    const {
        showWelcome,
        userName,
        startMainTour,
        skipMainTour,
        activeTour,
        currentStep,
        targetElement,
        targetElements,
        stepIndex,
        activeSteps,
        handleInteractiveTargetClick,
        nextStep,
        prevStep,
        skipActiveTour,
        finishActiveTour,
    } = useOnboarding();

    return (
        <>
            <WelcomeOnboardingModal
                isOpen={showWelcome && !activeTour}
                userName={userName}
                onStart={() => startMainTour({ manual: false })}
                onSkip={skipMainTour}
            />
            <SpotlightTourOverlay
                isOpen={Boolean(activeTour && currentStep && targetElement)}
                step={currentStep}
                targetElement={targetElement}
                targetElements={targetElements}
                stepIndex={stepIndex}
                totalSteps={activeSteps.length}
                tourTitle={activeTour?.title}
                onNext={nextStep}
                onBack={prevStep}
                onTargetClick={handleInteractiveTargetClick}
                onSkip={skipActiveTour}
                onFinish={finishActiveTour}
            />
        </>
    );
};

export default OnboardingManager;
