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
  if (!url.trim()) return null; // Allow empty URLs to be removed
  
  try {
    new URL(url);
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
    // validate: {
    //   links: (links: string[]) => {
    //     const errors: (string | null)[] = [];
    //     links.forEach((url) => {
    //       errors.push(validateUrl(url));
    //     });
    //     return errors.some(error => error !== null) ? errors : null;
    //   },
    // },
  });

  const handleAddLink = () => {
    form.insertListItem("links", "");
  };

  const handleRemoveLink = (index: number) => {
    form.removeListItem("links", index);
  };

  const handleSubmit = async (values: { links: string[] }) => {

    setLoading(true);
    try {
      // Filter out empty links
      const validLinks = values.links.filter(link => link.trim());

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
            <Group key={index} align="flex-end" gap="sm">
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