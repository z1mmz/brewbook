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
  Box,
} from "@chakra-ui/react";
import { useRecipeRunnerContext } from "../../contexts/RecipeRunnerContext";

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

  if (!currentStep) return null;

  const timeRemaining = getStepTime(currentStepIndex);
  const status = getStepStatus(currentStepIndex);
  const isRunning = status === "running";

  // Compute cumulative water poured across all steps up to and including now.
  // Completed steps contribute their full waterMl.
  // The current step interpolates linearly if it has both timeSec and waterMl.
  const cumulativeWater = steps.reduce((total, step, index) => {
    const stepStatus = getStepStatus(index);
    const waterMl = step.waterMl || 0;
    if (!waterMl) return total;

    if (index < currentStepIndex || stepStatus === "completed") {
      return total + waterMl;
    }

    if (index === currentStepIndex) {
      if (step.timeSec) {
        const elapsed = step.timeSec - getStepTime(index);
        return total + waterMl * (elapsed / step.timeSec);
      }
      // No timer: show full step water once the step is active
      if (stepStatus === "running" || stepStatus === "paused" || stepStatus === "completed") {
        return total + waterMl;
      }
    }

    return total;
  }, 0);

  const totalRecipeWater = recipe?.water || 0;
  const displayWater = Math.round(cumulativeWater);

  const handleFinish = () => onClose();
  const handleNext = () => (isLastStep ? handleFinish() : nextStep());

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

                {/* Step water target */}
                {currentStep.waterMl && (
                  <Text fontSize="sm" opacity={0.7}>
                    Pour {currentStep.waterMl}ml this step
                  </Text>
                )}

                {/* Timer */}
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
                        {Math.ceil(timeRemaining)}s
                      </Text>
                    </HStack>
                  </VStack>
                )}

                {/* Live water counter */}
                {totalRecipeWater > 0 && (
                  <Box
                    borderWidth="1px"
                    borderRadius="xl"
                    p={4}
                    textAlign="center"
                  >
                    <Text fontSize="xs" fontWeight="semibold" letterSpacing="widest" textTransform="uppercase" opacity={0.5} mb={1}>
                      Scale target
                    </Text>
                    <HStack justify="center" align="baseline" gap={1}>
                      <Text fontSize="4xl" fontWeight="bold" lineHeight="1">
                        {displayWater}
                      </Text>
                      <Text fontSize="lg" opacity={0.5}>
                        / {totalRecipeWater}g
                      </Text>
                    </HStack>
                    <Progress.Root
                      max={totalRecipeWater}
                      value={displayWater}
                      size="xs"
                      colorPalette="blue"
                      mt={3}
                    >
                      <Progress.Track>
                        <Progress.Range />
                      </Progress.Track>
                    </Progress.Root>
                  </Box>
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
                <Button colorPalette="blue" onClick={handleNext}>
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
