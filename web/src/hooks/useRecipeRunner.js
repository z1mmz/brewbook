import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export function useRecipeRunner(recipe) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepStatus, setStepStatus] = useState({}); // { stepIndex: 'running'|'paused'|'completed'|null }
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);
  const [tick, setTick] = useState(0); // incremented at 20fps to drive visual updates

  // Timestamp refs — mutations don't cause re-renders
  const stepStartTimes = useRef({}); // { index: Date.now() when started/resumed }
  const stepElapsedMs = useRef({});  // { index: accumulated ms before current run }

  const steps = useMemo(() => recipe?.steps || [], [recipe?.steps]);

  // Initialize step status
  useEffect(() => {
    const newStatus = {};
    steps.forEach((_, index) => {
      newStatus[index] = null;
    });
    setStepStatus(newStatus);
  }, [steps]);

  const getRemainingMs = useCallback((index) => {
    const timeSec = steps[index]?.timeSec || 0;
    if (!timeSec) return 0;
    const elapsed = stepElapsedMs.current[index] || 0;
    const start = stepStartTimes.current[index];
    const liveElapsed = start ? Date.now() - start : 0;
    return Math.max(0, timeSec * 1000 - elapsed - liveElapsed);
  }, [steps]);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const next = prev + 1;
      if (next < steps.length) {
        // Auto-start the next step
        stepStartTimes.current[next] = Date.now();
        stepElapsedMs.current[next] = 0;
        setStepStatus((prevStatus) => ({ ...prevStatus, [next]: "running" }));
        return next;
      }
      return prev;
    });
  }, [steps.length]);

  // Single 50ms visual loop — only active when something is running
  useEffect(() => {
    const anyRunning = Object.values(stepStatus).some((s) => s === "running");
    if (!anyRunning) return;

    const id = setInterval(() => {
      // Check for completions
      steps.forEach((step, index) => {
        if (stepStatus[index] === "running" && step.timeSec) {
          if (getRemainingMs(index) <= 0) {
            stepStartTimes.current[index] = null;
            setStepStatus((prev) => ({ ...prev, [index]: "completed" }));
            if (index < steps.length - 1) {
              nextStep();
            }
          }
        }
      });
      setTick((t) => t + 1);
    }, 50);

    return () => clearInterval(id);
  }, [stepStatus, steps, getRemainingMs, nextStep]);

  const startStep = useCallback((stepIndex) => {
    stepStartTimes.current[stepIndex] = Date.now();
    // Keep any prior accumulated elapsed (for resume after pause)
    setStepStatus((prev) => ({ ...prev, [stepIndex]: "running" }));
  }, []);

  const pauseStep = useCallback((stepIndex) => {
    const start = stepStartTimes.current[stepIndex];
    if (start) {
      stepElapsedMs.current[stepIndex] =
        (stepElapsedMs.current[stepIndex] || 0) + (Date.now() - start);
      stepStartTimes.current[stepIndex] = null;
    }
    setStepStatus((prev) => ({ ...prev, [stepIndex]: "paused" }));
  }, []);

  const resetStep = useCallback(
    (stepIndex) => {
      stepStartTimes.current[stepIndex] = null;
      stepElapsedMs.current[stepIndex] = 0;
      setStepStatus((prev) => ({ ...prev, [stepIndex]: null }));
    },
    []
  );

  const goToStep = useCallback(
    (stepIndex) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setCurrentStepIndex(stepIndex);
        startStep(stepIndex);
      }
    },
    [steps.length, startStep]
  );

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev > 0) {
        goToStep(prev - 1);
        return prev - 1;
      }
      return prev;
    });
  }, [goToStep]);

  const start = useCallback(() => {
    steps.forEach((_, index) => {
      stepStartTimes.current[index] = null;
      stepElapsedMs.current[index] = 0;
    });
    const newStatus = {};
    steps.forEach((_, index) => { newStatus[index] = null; });
    setStepStatus(newStatus);
    setIsRunnerOpen(true);
    setCurrentStepIndex(0);
    startStep(0);
  }, [steps, startStep]);

  const close = useCallback(() => {
    setIsRunnerOpen(false);
    steps.forEach((_, index) => {
      stepStartTimes.current[index] = null;
      stepElapsedMs.current[index] = 0;
    });
    const newStatus = {};
    steps.forEach((_, index) => { newStatus[index] = null; });
    setStepStatus(newStatus);
    setCurrentStepIndex(0);
  }, [steps]);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  return {
    // State
    currentStepIndex,
    currentStep,
    isLastStep,
    steps,
    stepStatus,
    isRunnerOpen,
    tick,

    // Timer accessors
    getStepTime: (stepIndex) => getRemainingMs(stepIndex) / 1000,
    getStepStatus: (stepIndex) => stepStatus[stepIndex] || null,

    // Actions
    start,
    close,
    startStep,
    pauseStep,
    resetStep,
    goToStep,
    nextStep,
    prevStep,
    setIsRunnerOpen,
  };
}
