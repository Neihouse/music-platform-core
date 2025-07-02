"use client";

import { 
  Stack, 
  Title, 
  Group, 
  Button, 
  Text, 
  Badge,
  useMantineColorScheme 
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export default function HeroContent() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack gap="xl">
      <Badge 
        size="lg" 
        variant="dot"
        color={isDark ? "violet" : "indigo"}
      >
        <Text size="sm" fw={600}>Live Music Platform</Text>
      </Badge>
      
      <Title
        order={1}
        style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          color: isDark ? '#ffffff' : '#1e293b',
          letterSpacing: '-0.02em',
        }}
      >
        Where Music
        <br />
        <Text
          span
          variant="gradient"
          gradient={{ 
            from: isDark ? 'violet' : 'indigo', 
            to: isDark ? 'cyan' : 'blue', 
            deg: 45 
          }}
        >
          Meets Community
        </Text>
      </Title>
      
      <Text 
        size="xl" 
        fw={400}
        style={{ 
          color: isDark ? '#cbd5e1' : '#475569',
          lineHeight: 1.6,
          maxWidth: '500px',
        }}
      >
        Discover live music events, connect with artists, and experience unforgettable performances in your city.
      </Text>
      
      <Group gap="md">
        <Button
          component={Link}
          href="/discover"
          size="lg"
          radius="xl"
          variant="gradient"
          gradient={{ from: isDark ? 'violet' : 'indigo', to: isDark ? 'cyan' : 'blue', deg: 45 }}
          rightSection={<IconArrowRight size={18} />}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          Explore Events
        </Button>
        
        <Button
          component={Link}
          href="/artists"
          size="lg"
          radius="xl"
          variant={isDark ? "light" : "outline"}
          color={isDark ? "violet" : "indigo"}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 500,
          }}
        >
          Find Artists
        </Button>
      </Group>
    </Stack>
  );
}
