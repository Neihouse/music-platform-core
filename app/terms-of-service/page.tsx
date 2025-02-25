"use client";

import { 
  Container, 
  Title, 
  Text, 
  Stack,
  Paper,
  List,
  Divider,
  Accordion,
  rem
} from '@mantine/core';

interface TermsSection {
  title: string;
  content: string | string[];
}

const termsSections: TermsSection[] = [
  {
    title: "Account Terms",
    content: [
      "You must be at least 13 years old to use this service",
      "You must provide accurate and complete registration information",
      "You are responsible for maintaining the security of your account",
      "You must notify us immediately of any unauthorized access"
    ]
  },
  {
    title: "Acceptable Use",
    content: [
      "You may not use the service for any illegal purpose",
      "You may not upload copyrighted material without permission",
      "You may not harass, abuse, or harm other users",
      "You may not attempt to manipulate or game our systems"
    ]
  },
  {
    title: "Content Guidelines",
    content: [
      "All uploaded content must comply with our community guidelines",
      "We reserve the right to remove content that violates our terms",
      "You retain ownership of content you upload",
      "You grant us license to distribute your content on our platform"
    ]
  },
  {
    title: "Service Modifications",
    content: "We reserve the right to modify or discontinue the service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service."
  }
];

export default function TermsOfServicePage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="sm">Terms of Service</Title>
          <Text c="dimmed" size="sm">
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </div>

        <Text size="lg">
          Please read these Terms of Service carefully before using our platform. 
          By using the service, you agree to be bound by these terms.
        </Text>

        <Accordion variant="separated" radius="md">
          {termsSections.map((section, index) => (
            <Accordion.Item key={index} value={section.title}>
              <Accordion.Control>
                <Text fw={500}>{section.title}</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="md">
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
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>

        <Divider my={rem(32)} />

        <Paper withBorder radius="md" p="xl">
          <Stack gap="md">
            <Title order={2} size="h3">Changes to Terms</Title>
            <Text>
              We reserve the right to update these Terms of Service at any time. 
              We will notify you of any material changes by posting the new Terms 
              of Service on this page and updating the &quot;Last updated&quot; date.
            </Text>
            <Text>
              Your continued use of the service after any changes constitutes your 
              acceptance of the new Terms of Service.
            </Text>
          </Stack>
        </Paper>

        <Stack gap="md">
          <Title order={2} size="h3">Contact Us</Title>
          <Text>
            If you have any questions about these Terms of Service, please contact us at:
            <Text component="span" fw={500} ml={5}>legal@musicmvp.com</Text>
          </Text>
        </Stack>
      </Stack>
    </Container>
  );
}
