"use client";

import { useState } from "react";
import { Stack, Text, Paper, Group, Code, Box } from "@mantine/core";
import FontSelect from "./index";

export default function FontSelectDemo() {
  const [selectedFont, setSelectedFont] = useState<string | undefined>("Inter");
  const [formFont, setFormFont] = useState<string | undefined>(undefined);

  return (
    <Stack gap="xl" p="md">
      <div>
        <Text size="xl" fw={700} mb="md">
          Google Fonts Selector Demo
        </Text>
        <Text c="dimmed" mb="xl">
          This demo shows the FontSelect component in action. Since no API key is provided, 
          it uses a curated selection of popular fonts.
        </Text>
      </div>

      <Paper p="md" shadow="sm" radius="md">
        <Stack gap="md">
          <Text fw={600}>Basic Usage</Text>
          <FontSelect
            label="Choose a font"
            description="Select a font family from the available options"
            placeholder="Search for a font..."
            value={selectedFont}
            onChange={(value) => setSelectedFont(value || undefined)}
          />
          {selectedFont && (
            <Box>
              <Text size="sm" c="dimmed" mb="xs">Preview:</Text>
              <Text 
                size="lg" 
                style={{ 
                  fontFamily: `"${selectedFont}", sans-serif`,
                }}
              >
                The quick brown fox jumps over the lazy dog
              </Text>
              <Code mt="xs">
                font-family: "{selectedFont}", sans-serif;
              </Code>
            </Box>
          )}
        </Stack>
      </Paper>

      <Paper p="md" shadow="sm" radius="md">
        <Stack gap="md">
          <Text fw={600}>Form Integration Example</Text>
          <FontSelect
            label="Typography Settings"
            description="This could be part of a larger form"
            placeholder="Select font for your design..."
            value={formFont}
            onChange={(value) => setFormFont(value || undefined)}
            size="sm"
            required
          />
          {formFont && (
            <Group gap="xs">
              <Text size="sm" c="dimmed">Selected:</Text>
              <Code>{formFont}</Code>
            </Group>
          )}
        </Stack>
      </Paper>

      <Paper p="md" shadow="sm" radius="md" bg="gray.0">
        <Stack gap="sm">
          <Text fw={600} size="sm">API Key Setup</Text>
          <Text size="xs" c="dimmed">
            This component now uses secure server actions to fetch fonts.
            No API key configuration needed on the frontend!
          </Text>
          <Code block>
            {`<FontSelect 
  label="Choose a font"
  value={selectedFont}
  onChange={setSelectedFont}
  // No apiKey prop needed - handled securely on server
/>`}
          </Code>
        </Stack>
      </Paper>
    </Stack>
  );
}
