"use client";

import { useMobileContentSection } from "@/lib/mobile-responsive-hooks";
import {
  Badge,
  Box,
  Container,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { ReactNode } from "react";

interface ContentSectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
  scrollable?: boolean;
  maxWidth?: string;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function ContentSection({
  title,
  subtitle,
  badge,
  children,
  scrollable = false,
  maxWidth = "1200px",
  spacing = 'lg',
}: ContentSectionProps) {
  const { containerPadding, titleSize, gridStyle } = useMobileContentSection();

  const content = scrollable ? (
    <ScrollArea
      style={{ width: '100%' }}
      scrollbars="x"
      offsetScrollbars={false}
    >
      <Box style={{
        display: 'flex',
        gap: rem(16),
        paddingTop: rem(12), // Add top padding to prevent clipping on hover
        paddingBottom: rem(16),
        paddingRight: rem(16),
        minWidth: 'fit-content'
      }}>
        {children}
      </Box>
    </ScrollArea>
  ) : (
    <Box style={{
      ...gridStyle,
      paddingTop: rem(12) // Add top padding for grid layout too
    }}>
      {children}
    </Box>
  );

  return (
    <Box
      py={spacing === 'xs' ? 'md' : spacing === 'sm' ? 'lg' : 'xl'}
      style={{
        background: spacing === 'lg' ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
        borderTop: spacing === 'lg' ? '1px solid var(--mantine-color-dark-6)' : 'none'
      }}
    >
      <Container size="xl" px={containerPadding}>
        <Stack gap="xl">
          {/* Section Header */}
          <Group justify="space-between" align="center">
            <Stack gap="xs">
              <Group align="center" gap="md">
                <Title
                  order={2}
                  size={rem(32)}
                  fw={700}
                  c="white"
                  style={{
                    letterSpacing: rem(-0.5),
                    fontSize: titleSize
                  }}
                >
                  {title}
                </Title>
                {badge && (
                  <Badge
                    size="lg"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan' }}
                    style={{ fontWeight: 600 }}
                  >
                    {badge}
                  </Badge>
                )}
              </Group>
              {subtitle && (
                <Text size="lg" c="dimmed" maw={600} style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)' }}>
                  {subtitle}
                </Text>
              )}
            </Stack>
          </Group>

          {/* Content */}
          {content}
        </Stack>
      </Container>
    </Box>
  );
}
