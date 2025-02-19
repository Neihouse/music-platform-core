"use client";

import { Container, Title, Box } from '@mantine/core';
import { Auth } from "@/components/Auth";

export default function LoginPage() {
  return (
    <Container size="xs" py="xl">
      <Box maw={400} mx="auto">
        <Title order={1} ta="center" mb="lg">
          Login
        </Title>
        <Auth view="sign_in" />
      </Box>
    </Container>
  );
}
