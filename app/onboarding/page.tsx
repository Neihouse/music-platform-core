"use client";

import {
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  SimpleGrid,
  rem,
  Card,
  ThemeIcon,
  Box,
  Transition,
} from "@mantine/core";
import {
  IconMicrophone,
  IconUsers,
  IconArrowLeft,
} from "@tabler/icons-react";
import * as React from "react";
import { ArtistForm } from "@/components/onboarding/ArtistForm";
import { PromoterForm } from "@/components/onboarding/PromoterForm";

export interface IOnboardingPageProps {}

export default function OnboardingPage({}: IOnboardingPageProps) {
  const [selectedType, setSelectedType] = React.useState<'artist' | 'collective' | null>(null);

  // Define the user type options with their details
  const userTypes = [
    {
      title: "Artist",
      icon: IconMicrophone,
      description: "Upload and share your music with fans",
      type: 'artist' as const,
      color: "blue",
    },
    {
      title: "Collective",
      icon: IconUsers,
      description: "Promote events and manage artists",
      type: 'collective' as const,
      color: "orange",
    },
  ];

  const handleTypeSelect = (type: 'artist' | 'collective') => {
    setSelectedType(type);
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'artist':
        return <ArtistForm />;
      case 'collective':
        return <PromoterForm />;
      default:
        return null;
    }
  };

  return (
    <Container size="md" py={rem(40)}>
      <Paper withBorder radius="md" p="lg" shadow="md" style={{ position: 'relative', minHeight: '400px' }}>
        <Transition
          mounted={selectedType === null}
          transition="fade"
          duration={600}
          timingFunction="ease-in-out"
        >
          {(styles) => (
            <div style={{ 
              ...styles,
              position: selectedType !== null ? 'absolute' : 'relative',
              top: 0,
              left: 0,
              right: 0,
              width: '100%'
            }}>
              <Stack gap="md">
                <div>
                  <Title order={2} ta="center" mb="xs">
                    Welcome to MusicApp
                  </Title>
                  <Text ta="center" size="md" c="dimmed">
                    Tell us how you want to use our platform
                  </Text>
                </div>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  {userTypes.map((type) => (
                    <Card
                      key={type.title}
                      padding="md"
                      radius="md"
                      withBorder
                      onClick={() => handleTypeSelect(type.type)}
                      style={{
                        cursor: 'pointer',
                        textDecoration: "none",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                      className="hover:shadow-lg hover:-translate-y-1"
                    >
                      <Group wrap="nowrap" align="flex-start" gap="xs">
                        <ThemeIcon
                          size={rem(36)}
                          radius="md"
                          color={type.color}
                          variant="light"
                        >
                          <type.icon size={rem(20)} stroke={1.5} />
                        </ThemeIcon>
                        <Box style={{ flex: 1 }}>
                          <Text fw={500} size="md">
                            {type.title}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {type.description}
                          </Text>
                        </Box>
                      </Group>
                    </Card>
                  ))}
                </SimpleGrid>
              </Stack>
            </div>
          )}
        </Transition>

        <Transition
          mounted={selectedType !== null}
          transition="fade"
          duration={600}
          timingFunction="ease-in-out"
        >
          {(styles) => (
            <div style={{ 
              ...styles,
              position: selectedType === null ? 'absolute' : 'relative',
              top: 0,
              left: 0,
              right: 0,
              width: '100%'
            }}>
              <Stack gap="md">
                <Group align="center" gap="xs">
                  <Button
                    variant="subtle"
                    size="sm"
                    leftSection={<IconArrowLeft size={16} />}
                    onClick={handleBack}
                  >
                    Back to selection
                  </Button>
                </Group>
                {renderForm()}
              </Stack>
            </div>
          )}
        </Transition>
      </Paper>
    </Container>
  );
}
