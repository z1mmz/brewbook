import { Card, Progress, Button, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { useEffect } from "react";

function RecipeStep({ step, index }) {
  const [timeRemaining, setTimeRemaining] = useState(step.timeSec || 0);
  const [status, setStatus] = useState(null); // 'running', 'paused', 'completed', 'nu''

  const handleStartStep = () => {
    // Logic to start the step timer or any other action
    setTimeRemaining(step.timeSec || 0);
    console.log(`Starting step ${index + 1}: ${step.title}`);
    setStatus("running");
  };

  useEffect(() => {
    let timer;
    if (status === "running" && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && status === "running") {
      setStatus("completed");
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [step.timeSec, status, timeRemaining]);

  return (
    <Card.Root key={index}>
      <Card.Header>{step.title}</Card.Header>
      <Card.Body>
        {step.notes ? <p>Notes: {step.notes}</p> : null}
        {step.waterMl ? <p>Water: {step.waterMl}ml</p> : null}
        {step.timeSec ? <p>Time: {step.timeSec} seconds</p> : null}

        {step.timeSec ? (
          <Progress.Root
            maxW="20vw"
            value={((step.timeSec - timeRemaining) / step.timeSec) * 100}
            mt={2}
          >
            <HStack gap="5">
              <Progress.Track flex="1">
                <Progress.Range />
              </Progress.Track>
              <Progress.ValueText>{timeRemaining}s</Progress.ValueText>
            </HStack>
            <Button onClick={() => handleStartStep()} mt={2} size="sm">
              {" "}
              {status == null ? "Start Step" : "Restart"}
            </Button>
          </Progress.Root>
        ) : null}
      </Card.Body>
    </Card.Root>
  );
}
export default RecipeStep;
