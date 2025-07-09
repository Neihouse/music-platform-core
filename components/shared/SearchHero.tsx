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
import { IconSearch, IconTrendingUp, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface SearchHeroProps {
  onSearch: (query: string) => void;
  onClear?: () => void;
  popularCities?: string[];
  placeholder?: string;
  title?: string;
  subtitle?: string;
  currentValue?: string;
}

export function SearchHero({
  onSearch,
  onClear,
  popularCities = ['New York', 'Los Angeles', 'Chicago', 'Austin', 'Nashville', 'Miami'],
  placeholder = "Your city...",
  title = "Discover Your Local Music Scene",
  subtitle = "Explore local scenes, artists, and venues in cities around the world",
  currentValue = ""
}: SearchHeroProps) {
  const [searchValue, setSearchValue] = useState(currentValue);

  // Update searchValue when currentValue prop changes
  useEffect(() => {
    setSearchValue(currentValue);
  }, [currentValue]);

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleClear = () => {
    setSearchValue("");
    if (onClear) {
      onClear();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const hasValue = searchValue.trim().length > 0;

  return (
    <Box
      style={{
        background: 'transparent',
        paddingTop: rem(80), // Reduced from 120 for mobile
        paddingBottom: rem(60), // Reduced from 80 for mobile
        position: 'relative',
        overflow: 'hidden',
      }}
      pt={{ base: rem(80), sm: rem(100), md: rem(120) }}
      pb={{ base: rem(60), sm: rem(70), md: rem(80) }}
    >
      <Container size="lg" px={{ base: "md", sm: "lg" }}>
        <Stack align="center" gap="xl">
          <Stack align="center" gap="md">
            {/* Mobile Title */}
            <Title
              hiddenFrom="sm"
              order={1}
              size="xl"
              fw={700}
              ta="center"
              c="white"
              style={{
                letterSpacing: rem(-0.5),
                lineHeight: 1.2,
                fontSize: 'clamp(1.8rem, 6vw, 2.5rem)'
              }}
            >
              {title}
            </Title>

            {/* Desktop Title */}
            <Title
              visibleFrom="sm"
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

            {/* Mobile Subtitle */}
            <Text
              hiddenFrom="sm"
              size="md"
              c="dimmed"
              ta="center"
              maw={600}
              px="sm"
              style={{ lineHeight: 1.6 }}
            >
              {subtitle}
            </Text>

            {/* Desktop Subtitle */}
            <Text
              visibleFrom="sm"
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
          <Box w="100%" maw={600} px={{ base: "md", sm: 0 }}>
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
              {/* Mobile Search/Clear Button */}
              <ActionIcon
                hiddenFrom="sm"
                size={40}
                radius="xl"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                onClick={hasValue ? handleClear : handleSearch}
                style={{
                  boxShadow: '0 4px 16px rgba(51, 154, 240, 0.3)',
                }}
              >
                {hasValue ? <IconX size={18} /> : <IconSearch size={18} />}
              </ActionIcon>
              {/* Desktop Search/Clear Button */}
              <ActionIcon
                visibleFrom="sm"
                size={48}
                radius="xl"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                onClick={hasValue ? handleClear : handleSearch}
                style={{
                  boxShadow: '0 4px 16px rgba(51, 154, 240, 0.3)',
                }}
              >
                {hasValue ? <IconX size={20} /> : <IconSearch size={20} />}
              </ActionIcon>
            </Group>
          </Box>

          {!!popularCities.length && (
            <Stack align="center" gap="sm">
              <Group gap="xs" align="center">
                <IconTrendingUp size={16} color="var(--mantine-color-dimmed)" />
                <Text size="sm" c="dimmed" fw={500}>
                  Popular cities
                </Text>
              </Group>
              {/* Mobile Popular Cities */}
              <Group hiddenFrom="sm" gap="xs" justify="center" px="md">
                {popularCities.slice(0, 4).map((city) => (
                  <Pill
                    key={city}
                    size="sm"
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
              {/* Desktop Popular Cities */}
              <Group visibleFrom="sm" gap="xs" justify="center">
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
          )}
        </Stack>
      </Container>
    </Box>
  );
}
