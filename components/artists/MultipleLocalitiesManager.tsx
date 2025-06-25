"use client";

import { useState } from "react";
import { 
  Button, 
  Stack, 
  Text, 
  Group, 
  Badge, 
  Paper, 
  Title,
  ActionIcon,
  Alert
} from "@mantine/core";
import { IconPlus, IconX, IconMapPin, IconAlertCircle } from "@tabler/icons-react";
import { LocationInput } from "../LocationInput";
import { updateArtistLocalitiesAction } from "@/app/artists/[artistName]/actions";
import { notifications } from "@mantine/notifications";
import { StoredLocality } from "@/utils/supabase/global.types";

interface MultipleLocalitiesManagerProps {
  currentLocalities?: StoredLocality[];
  onUpdate?: (localities: StoredLocality[]) => void;
}

export function MultipleLocalitiesManager({ 
  currentLocalities = [], 
  onUpdate 
}: MultipleLocalitiesManagerProps) {
  const [localities, setLocalities] = useState<StoredLocality[]>(currentLocalities);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddLocality = (newLocality: StoredLocality) => {
    // Check if locality already exists
    const exists = localities.some(loc => loc.locality.id === newLocality.locality.id);
    if (exists) {
      notifications.show({
        title: "Locality already added",
        message: "This locality is already in your list",
        color: "orange",
      });
      return;
    }

    const updatedLocalities = [...localities, newLocality];
    setLocalities(updatedLocalities);
    setIsAdding(false);
    onUpdate?.(updatedLocalities);
  };

  const handleRemoveLocality = (localityId: string) => {
    const updatedLocalities = localities.filter(loc => loc.locality.id !== localityId);
    setLocalities(updatedLocalities);
    onUpdate?.(updatedLocalities);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const localityIds = localities.map(loc => loc.locality.id);
      await updateArtistLocalitiesAction(localityIds);
      
      notifications.show({
        title: "Success",
        message: "Your localities have been updated",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: `Failed to update localities: ${error}`,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md" withBorder radius="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>Performance Localities</Title>
          <Button
            size="sm"
            leftSection={<IconPlus size={16} />}
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
          >
            Add Locality
          </Button>
        </Group>

        <Text size="sm" c="dimmed">
          Add all the cities and localities where you regularly perform. This helps promoters find you for local shows.
        </Text>

        {/* Current Localities */}
        {localities.length > 0 ? (
          <Stack gap="xs">
            {localities.map((locality) => (
              <Group key={locality.locality.id} justify="space-between">
                <Badge
                  size="lg"
                  variant="light"
                  leftSection={<IconMapPin size={14} />}
                  rightSection={
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      onClick={() => handleRemoveLocality(locality.locality.id)}
                    >
                      <IconX size={12} />
                    </ActionIcon>
                  }
                >
                  {locality.locality.name}, {locality.administrativeArea.name}, {locality.country.name}
                </Badge>
              </Group>
            ))}
          </Stack>
        ) : (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="No localities added"
            color="gray"
          >
            Add localities where you perform to help promoters find you for local shows.
          </Alert>
        )}

        {/* Add Locality Form */}
        {isAdding && (
          <Paper p="md" withBorder>
            <Stack gap="md">
              <Text fw={500}>Add New Locality</Text>
              <LocationInput
                onPlaceSelect={handleAddLocality}
              />
              <Group justify="flex-end">
                <Button
                  variant="subtle"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
              </Group>
            </Stack>
          </Paper>
        )}

        {/* Save Button */}
        {localities.length > 0 && (
          <Group justify="flex-end">
            <Button
              onClick={handleSave}
              loading={loading}
              disabled={localities.length === 0}
            >
              Save Localities
            </Button>
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
