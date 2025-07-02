"use client";

import { Box, Paper, Stack, ThemeIcon, Text, useMantineColorScheme, useMantineTheme } from "@mantine/core";

interface StatCardProps {
  icon: React.ComponentType<any>;
  color: 'violet' | 'blue' | 'cyan' | 'indigo';
  title: string;
  subtitle: string;
}

export default function StatCard({ icon: IconComponent, color, title, subtitle }: StatCardProps) {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const isDark = colorScheme === 'dark';

  return (
    <Paper
      p="lg"
      radius="xl"
      style={{
        background: isDark 
          ? 'rgba(30, 41, 59, 0.5)' 
          : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        border: isDark 
          ? '1px solid rgba(71, 85, 105, 0.3)' 
          : '1px solid rgba(203, 213, 225, 0.3)',
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <Stack gap="sm" align="center">
        <ThemeIcon 
          size="xl" 
          radius="xl" 
          color={color}
          variant="light"
        >
          <IconComponent size={24} />
        </ThemeIcon>
        <Box style={{ textAlign: 'center' }}>
          <Text 
            fw={700} 
            size="lg"
            c={isDark ? 'white' : 'dark.9'}
          >
            {title}
          </Text>
          <Text 
            size="sm" 
            c={isDark ? 'gray.4' : 'gray.6'}
          >
            {subtitle}
          </Text>
        </Box>
      </Stack>
    </Paper>
  );
}
