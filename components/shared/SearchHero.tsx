"use client";

import {
  ActionIcon,
  Box,
  Container,
  Group,
  Pill,
  Stack,
  Text,
  TextInput,
  Title,
  rem
} from "@mantine/core";
import { IconSearch, IconTrendingUp } from "@tabler/icons-react";
import { useState } from "react";

interface SearchHeroProps {
  onSearch: (query: string) => void;
  popularCities?: string[];
  placeholder?: string;
  title?: string;
  subtitle?: string;
}

export function SearchHero({
  onSearch,
  popularCities = ['New York', 'Los Angeles', 'Chicago', 'Austin', 'Nashville', 'Miami'],
  placeholder = "Your city...",
  title = "Discover Your Local Music Scene",
  subtitle = "Explore local scenes, artists, and venues in cities around the world"
}: SearchHeroProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box
      style={{
        background: 'transparent',
        paddingTop: rem(120),
        paddingBottom: rem(80),
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container size="lg">
        <Stack align="center" gap="xl">
          <Stack align="center" gap="md">
            <Title
              order={1}
              size={rem(48)}
              fw={700}
              ta="center"
              c="white"
              style={{
                letterSpacing: rem(-1),
                lineHeight: 1.1,
              }}
            >
              {title}
            </Title>
            <Text
              size="lg"
              c="dimmed"
              ta="center"
              maw={600}
              style={{ lineHeight: 1.6 }}
            >
              {subtitle}
            </Text>
          </Stack>

          {/* Search Bar */}
          <Box w="100%" maw={600}>
            <Group gap="sm" style={{
              background: 'var(--mantine-color-dark-7)',
              borderRadius: rem(50),
              padding: rem(8),
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--mantine-color-dark-5)',
            }}>
              <Box style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: rem(12),
                paddingLeft: rem(16),
              }}>
                <IconSearch size={20} color="var(--mantine-color-gray-5)" />
                <TextInput
                  placeholder={placeholder}
                  size="lg"
                  variant="unstyled"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{ flex: 1 }}
                  styles={{
                    input: {
                      border: 'none',
                      fontSize: rem(16),
                      padding: 0,
                      color: 'var(--mantine-color-white)',
                      backgroundColor: 'transparent',
                      '&::placeholder': {
                        color: 'var(--mantine-color-gray-5)',
                      }
                    }
                  }}
                />
              </Box>
              <ActionIcon
                size={48}
                radius="xl"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                onClick={handleSearch}
                style={{
                  boxShadow: '0 4px 16px rgba(51, 154, 240, 0.3)',
                }}
              >
                <IconSearch size={20} />
              </ActionIcon>
            </Group>
          </Box>

          {/* Popular Cities */}
          <Stack align="center" gap="sm">
            <Group gap="xs" align="center">
              <IconTrendingUp size={16} color="var(--mantine-color-dimmed)" />
              <Text size="sm" c="dimmed" fw={500}>
                Popular cities
              </Text>
            </Group>
            <Group gap="xs" justify="center">
              {popularCities.map((city) => (
                <Pill
                  key={city}
                  size="md"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--mantine-color-gray-3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => onSearch(city)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {city}
                </Pill>
              ))}
            </Group>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
