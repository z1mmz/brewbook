import { useState, useEffect, useCallback } from "react";

export function useRecipeRunner(recipe) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepTimers, setStepTimers] = useState({}); // { stepIndex: timeRemaining }
  const [stepStatus, setStepStatus] = useState({}); // { stepIndex: 'running'|'paused'|'completed'|null }
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);

  const steps = recipe?.steps || [];

  // Initialize all step timers
  useEffect(() => {
    const newTimers = {};
    const newStatus = {};
    steps.forEach((step, index) => {
      newTimers[index] = step.timeSec || 0;
      newStatus[index] = null;
    });
    setStepTimers(newTimers);
    setStepStatus(newStatus);
  }, [steps]);

  // Handle timer countdown
  useEffect(() => {
    const timers = {};

    steps.forEach((step, index) => {
      const isRunning = stepStatus[index] === "running";
      const timeRemaining = stepTimers[index] || 0;

      if (isRunning && timeRemaining > 0) {
        timers[index] = setInterval(() => {
          setStepTimers((prev) => {
            const updated = { ...prev };
            updated[index] = Math.max(0, prev[index] - 1);

            // Auto-stop when timer reaches 0
            if (updated[index] === 0) {
              setStepStatus((prevStatus) => ({
                ...prevStatus,
                [index]: "completed",
              }));
            }
            return updated;
          });
        }, 1000);
      }
    });

    return () => {
      Object.values(timers).forEach((timer) => clearInterval(timer));
    };
  }, [stepStatus, steps]);

  const startStep = useCallback((stepIndex) => {
    setStepStatus((prev) => ({ ...prev, [stepIndex]: "running" }));
  }, []);

  const pauseStep = useCallback((stepIndex) => {
    setStepStatus((prev) => ({ ...prev, [stepIndex]: "paused" }));
  }, []);

  const resetStep = useCallback(
    (stepIndex) => {
      const step = steps[stepIndex];
      if (step) {
        setStepTimers((prev) => ({ ...prev, [stepIndex]: step.timeSec || 0 }));
        setStepStatus((prev) => ({ ...prev, [stepIndex]: null }));
      }
    },
    [steps]
  );

  const goToStep = useCallback(
    (stepIndex) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setCurrentStepIndex(stepIndex);
      }
    },
    [steps.length]
  );

  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      goToStep(currentStepIndex + 1);
    }
  }, [currentStepIndex, steps.length, goToStep]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, goToStep]);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  return {
    // State
    currentStepIndex,
    currentStep,
    isLastStep,
    steps,
    stepTimers,
    stepStatus,
    isRunnerOpen,

    // Timer accessors
    getStepTime: (stepIndex) => stepTimers[stepIndex] || 0,
    getStepStatus: (stepIndex) => stepStatus[stepIndex] || null,

    // Actions
    startStep,
    pauseStep,
    resetStep,
    goToStep,
    nextStep,
    prevStep,
    setIsRunnerOpen,
  };
}
