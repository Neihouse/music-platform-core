"use client";

import {
  Stack,
  Title,
  Group,
  TextInput,
  Button,
  Card,
  ActionIcon,
  Text,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import {
  IconPlus,
  IconTrash,
  IconExternalLink,
} from "@tabler/icons-react";
import { updateExternalLinks } from "@/app/artists/[artistName]/actions";

export interface ExternalLinksFormProps {
  initialLinks?: string[];
}

function validateUrl(url: string): string | null {
  if (!url || !url.trim()) return null; // Allow empty URLs to be removed
  
  try {
    const urlObj = new URL(url);
    
    // Check if hostname has at least one dot (indicating a TLD)
    if (!urlObj.hostname.includes('.')) {
      return "Please enter a valid URL with a proper domain (e.g., example.com)";
    }
    
    // Check if the hostname has a valid TLD (at least 2 characters after the last dot)
    const parts = urlObj.hostname.split('.');
    const tld = parts[parts.length - 1];
    if (!tld || tld.length < 2) {
      return "Please enter a valid URL with a proper domain extension";
    }
    
    // Check for valid protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return "URL must start with http:// or https://";
    }
    
    return null;
  } catch {
    return "Please enter a valid URL (including http:// or https://)";
  }
}

export function ExternalLinksForm({ initialLinks = [] }: ExternalLinksFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      links: initialLinks.length > 0 ? initialLinks : [""],
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      values.links.forEach((link, index) => {
        const error = validateUrl(link);
        if (error) {
          errors[`links.${index}`] = error;
        }
      });
      
      return errors;
    },
  });

  const handleAddLink = () => {
    form.insertListItem("links", "");
  };

  const handleRemoveLink = (index: number) => {
    form.removeListItem("links", index);
  };

  const handleSubmit = async (values: { links: string[] }) => {
    // Validate all links before submission
    const hasErrors = Object.keys(form.errors).length > 0;
    if (hasErrors) {
      notifications.show({
        title: "Validation Error",
        message: "Please fix the invalid URLs before saving.",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      // Filter out empty links
      const validLinks = values.links.filter(link => link && link.trim());

      console.log("Saving links:", validLinks);
      await updateExternalLinks(validLinks);
      console.log("Links saved successfully");
      notifications.show({
        title: "Success",
        message: "External links updated successfully!",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: `Failed to update external links: ${error}`,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card withBorder p="md" radius="md" shadow="sm">
      <Title order={4} mb="lg">
        External Links
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Add links to your social media profiles, streaming platforms, and website. 
        Include the full URL (starting with http:// or https://).
      </Text>
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {form.values.links.map((link, index) => (
            <Group key={index} align="flex-start" gap="sm">
              <Box style={{ flex: 1 }}>
                <TextInput
                  label={index === 0 ? "URLs" : ""}
                  placeholder="https://instagram.com/your-profile"
                  leftSection={<IconExternalLink size={16} />}
                  {...form.getInputProps(`links.${index}`)}
                />
              </Box>
              {form.values.links.length > 1 && (
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => handleRemoveLink(index)}
                  size="lg"
                  mt={index === 0 ? "lg" : 0}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              )}
            </Group>
          ))}

          <Button
            variant="light"
            leftSection={<IconPlus size={16} />}
            onClick={handleAddLink}
            fullWidth
          >
            Add Another Link
          </Button>

      
            <Button
              type="submit"
              loading={loading}
            >
              Save External Links
            </Button>
        </Stack>
      </form>
    </Card>
  );
}