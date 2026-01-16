import {
  Dialog,
  Portal,
  Button,
  CloseButton,
  Heading,
  Progress,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useRecipeRunnerContext } from "../contexts/RecipeRunnerContext";
import { use, useEffect } from "react";
function Runner({ isOpen, onClose, recipe }) {
  const {
    currentStepIndex,
    currentStep,
    isLastStep,
    steps,
    getStepTime,
    getStepStatus,
    startStep,
    pauseStep,
    nextStep,
    prevStep,
  } = useRecipeRunnerContext();

  console.log("Runner render", { currentStepIndex, currentStep });
  if (!currentStep) {
    return null;
  }

  const timeRemaining = getStepTime(currentStepIndex);
  const status = getStepStatus(currentStepIndex);
  const isRunning = status === "running";

  const handleFinish = () => {
    onClose();
  };

  const handleNext = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      nextStep();
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
      size="lg"
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <VStack align="start" width="100%">
                <Dialog.Title>{recipe.title}</Dialog.Title>
                <Text fontSize="sm" color="gray.600">
                  Step {currentStepIndex + 1} of {steps.length}
                </Text>
              </VStack>
            </Dialog.Header>
            <Dialog.Body>
              <VStack spacing={6} align="stretch">
                <Heading size="sm">{currentStep.title}</Heading>

                {currentStep.notes && (
                  <Text fontSize="sm">{currentStep.notes}</Text>
                )}
                {currentStep.waterMl && (
                  <Text fontSize="sm" fontWeight="bold">
                    Water: {currentStep.waterMl}ml
                  </Text>
                )}
                {currentStep.timeSec && (
                  <VStack spacing={2} width="100%">
                    <Progress.Root
                      max={currentStep.timeSec}
                      value={currentStep.timeSec - timeRemaining}
                      size="lg"
                      width="100%"
                    >
                      <Progress.Track>
                        <Progress.Range />
                      </Progress.Track>
                    </Progress.Root>
                    <HStack justify="center" width="100%">
                      <Text fontSize="2xl" fontWeight="bold">
                        {timeRemaining}s
                      </Text>
                    </HStack>
                  </VStack>
                )}
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack spacing={2}>
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                >
                  Previous
                </Button>
                {currentStep.timeSec && (
                  <Button
                    onClick={() =>
                      isRunning
                        ? pauseStep(currentStepIndex)
                        : startStep(currentStepIndex)
                    }
                  >
                    {isRunning ? "Pause" : "Start"}
                  </Button>
                )}
                <Button colorScheme="blue" onClick={handleNext}>
                  {isLastStep ? "Finish" : "Next"}
                </Button>
              </HStack>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default Runner;
