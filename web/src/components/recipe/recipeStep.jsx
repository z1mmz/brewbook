import { Card, Progress, Button, HStack } from "@chakra-ui/react";
import { useRecipeRunnerContext } from "../../contexts/RecipeRunnerContext";

function RecipeStep({ step, index }) {
  const { getStepTime, getStepStatus, startStep, pauseStep, resetStep } =
    useRecipeRunnerContext();

  const timeRemaining = getStepTime(index);
  const status = getStepStatus(index);

  const handleStartStep = () => {
    if (status === "paused") {
      startStep(index);
    } else {
      resetStep(index);
      startStep(index);
    }
  };

  const handlePauseStep = () => {
    pauseStep(index);
  };

  const progressPercent =
    step.timeSec && timeRemaining > 0
      ? ((step.timeSec - timeRemaining) / step.timeSec) * 100
      : 0;

  return (
    <Card.Root key={index}>
      <Card.Header>{step.title}</Card.Header>
      <Card.Body>
        {step.notes ? <p>Notes: {step.notes}</p> : null}
        {step.waterMl ? <p>Water: {step.waterMl}ml</p> : null}
        {step.timeSec ? <p>Time: {step.timeSec} seconds</p> : null}

        {step.timeSec ? (
          <div>
            <Progress.Root
              maxW="20vw"
              max={step.timeSec}
              value={step.timeSec - timeRemaining}
              mt={2}
            >
              <HStack gap="5">
                <Progress.Track flex="1">
                  <Progress.Range />
                </Progress.Track>
                <Progress.ValueText>{timeRemaining}s</Progress.ValueText>
              </HStack>
            </Progress.Root>
            <HStack gap={2} mt={2}>
              <Button onClick={handleStartStep} size="sm">
                {status === "running" ? "Restart" : "Start"}
              </Button>
              {status === "running" && (
                <Button onClick={handlePauseStep} size="sm" variant="outline">
                  Pause
                </Button>
              )}
            </HStack>
          </div>
        ) : null}
      </Card.Body>
    </Card.Root>
  );
}
export default RecipeStep;
