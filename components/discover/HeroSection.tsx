"use client";

import {
  Container,
  Title,
  Paper,
  Group,
  Text,
  Stack,
  Box,
  Button,
  TextInput,
  ActionIcon,
  ThemeIcon,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import { 
  IconMapPin, 
  IconMusic, 
  IconSearch,
  IconSparkles,
} from "@tabler/icons-react";
import { useState } from "react";

interface HeroSectionProps {
  onCitySelect: (city: string) => void;
}

export function HeroSection({ onCitySelect }: HeroSectionProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [tempCity, setTempCity] = useState("");

  return (
    <Paper
      py={rem(80)}
      mb={rem(40)}
      radius="lg"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, var(--mantine-color-violet-9), var(--mantine-color-indigo-9))'
          : 'linear-gradient(135deg, var(--mantine-color-indigo-6), var(--mantine-color-cyan-5))',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <Box style={{ position: 'absolute', top: '-40px', right: '10%', opacity: 0.15 }}>
        <ThemeIcon size={200} radius={100} variant="subtle" color="white">
          <IconMusic size={120} stroke={1} />
        </ThemeIcon>
      </Box>
      
      <Box style={{ position: 'absolute', bottom: '10%', left: '5%', opacity: 0.1 }}>
        <ThemeIcon size={160} radius={80} variant="subtle" color="white">
          <IconSparkles size={100} stroke={1} />
        </ThemeIcon>
      </Box>

      <Container size="md" style={{ position: 'relative', zIndex: 2 }}>
        <Stack align="center" gap="xl">
          <Title
            order={1}
            size={rem(48)}
            ta="center"
            c="white"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontWeight: 900,
            }}
          >
            Discover Your City's
            <br />
            <Text
              component="span"
              inherit
              variant="gradient"
              gradient={{ from: 'yellow', to: 'orange', deg: 45 }}
            >
              Music Scene
            </Text>
          </Title>
          
          <Text size="xl" ta="center" c="white" maw={600} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
            Enter your city and explore local artists, venues, promoters, and the hottest upcoming events
          </Text>

          <Box w="100%" maw={400}>
            <Group>
              <TextInput
                placeholder="Enter your city..."
                size="lg"
                radius="xl"
                flex={1}
                value={tempCity}
                onChange={(e) => setTempCity(e.target.value)}
                leftSection={<IconMapPin size={20} />}
                styles={{
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    '&:focus': {
                      backgroundColor: 'white',
                    }
                  }
                }}
              />
              <ActionIcon
                size="lg"
                radius="xl"
                variant="filled"
                color="yellow"
                onClick={() => tempCity && onCitySelect(tempCity)}
              >
                <IconSearch size={20} />
              </ActionIcon>
            </Group>
          </Box>

          <Group gap="xs">
            {['New York', 'Los Angeles', 'Chicago', 'Austin'].map((city) => (
              <Button
                key={city}
                variant="white"
                size="sm"
                radius="xl"
                onClick={() => onCitySelect(city)}
                leftSection={<IconSparkles size={16} />}
              >
                {city}
              </Button>
            ))}
          </Group>
        </Stack>
      </Container>
    </Paper>
  );
}
