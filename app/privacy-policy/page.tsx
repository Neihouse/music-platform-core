"use client";

import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  List,
  Divider,
  rem,
} from "@mantine/core";

interface PolicySection {
  title: string;
  content: string | string[];
}

const policySections: PolicySection[] = [
  {
    title: "Information We Collect",
    content: [
      "Personal information (name, email address)",
      "Usage data and analytics",
      "Device and browser information",
      "Music preferences and listening history",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "To provide and improve our services",
      "To personalize your music experience",
      "To communicate with you about updates and features",
      "To ensure platform security and prevent abuse",
    ],
  },
  {
    title: "Data Security",
    content:
      "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.",
  },
  {
    title: "Your Rights",
    content: [
      "Access your personal data",
      "Request corrections to your data",
      "Delete your account and associated data",
      "Opt-out of marketing communications",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="sm">
            Privacy Policy
          </Title>
          <Text c="dimmed" size="sm">
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </div>

        <Text size="lg">
          This Privacy Policy describes how we collect, use, and handle your
          personal information when you use our music platform services.
        </Text>

        {policySections.map((section, index) => (
          <Paper key={index} withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={2} size="h3">
                {section.title}
              </Title>
              {Array.isArray(section.content) ? (
                <List spacing="sm" size="md">
                  {section.content.map((item, i) => (
                    <List.Item key={i}>{item}</List.Item>
                  ))}
                </List>
              ) : (
                <Text>{section.content}</Text>
              )}
            </Stack>
          </Paper>
        ))}

        <Divider my={rem(32)} />

        <Stack gap="md">
          <Title order={2} size="h3">
            Contact Us
          </Title>
          <Text>
            If you have any questions about this Privacy Policy, please contact
            us at:
            <Text component="span" fw={500} ml={5}>
              privacy@musicmvp.com
            </Text>
          </Text>
        </Stack>
      </Stack>
    </Container>
  );
}
