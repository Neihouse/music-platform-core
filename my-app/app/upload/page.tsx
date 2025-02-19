"use client";

import { 
  Container, 
  Title, 
  Text, 
  Stack,
  Paper,
  Stepper,
  Group,
  Button,
  rem
} from '@mantine/core';
import { useState } from 'react';
import { TrackEditor } from "@/components/track/TrackEditor";
import { FileUploader } from "@/components/track/FileUploader";
import { IconCheck } from '@tabler/icons-react';

export default function UploadPage() {
  const [active, setActive] = useState(0);
  const [trackId, setTrackId] = useState<string | null>(null);

  const nextStep = () => setActive((current) => Math.min(current + 1, 2));
  const prevStep = () => setActive((current) => Math.max(current - 1, 0));

  const handleUploadComplete = (id: string) => {
    setTrackId(id);
    nextStep();
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="sm">Upload Track</Title>
          <Text c="dimmed" size="lg">
            Share your music with the world. Upload your track and add details to help listeners discover it.
          </Text>
        </div>

        <Paper withBorder radius="md" p="xl">
          <Stack gap="xl">
            <Stepper 
              active={active} 
              onStepClick={setActive}
              allowNextStepsSelect={false}
            >
              <Stepper.Step
                label="Upload File"
                description="Upload your track file"
                completedIcon={<IconCheck size={rem(20)} />}
              >
                <Stack gap="md" mt="xl">
                  <FileUploader onUploadComplete={handleUploadComplete} />
                </Stack>
              </Stepper.Step>

              <Stepper.Step
                label="Track Details"
                description="Add track information"
                completedIcon={<IconCheck size={rem(20)} />}
              >
                <Stack gap="md" mt="xl">
                  {trackId && <TrackEditor trackId={trackId} />}
                </Stack>
              </Stepper.Step>

              <Stepper.Completed>
                <Stack gap="md" mt="xl" ta="center">
                  <IconCheck size={rem(48)} color="var(--mantine-color-green-6)" />
                  <Title order={2}>Upload Complete!</Title>
                  <Text size="lg">
                    Your track has been successfully uploaded and is now ready to be discovered.
                  </Text>
                  <Group justify="center" mt="md">
                    <Button 
                      variant="light"
                      onClick={() => {
                        setActive(0);
                        setTrackId(null);
                      }}
                    >
                      Upload Another Track
                    </Button>
                  </Group>
                </Stack>
              </Stepper.Completed>
            </Stepper>

            {active < 2 && (
              <Group justify="center" mt="xl">
                {active > 0 && (
                  <Button variant="default" onClick={prevStep}>
                    Back
                  </Button>
                )}
              </Group>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
