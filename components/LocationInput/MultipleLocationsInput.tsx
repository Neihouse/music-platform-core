"use client";

import { useState } from "react";
import { Stack, Title, Text, Button, Group, Badge, Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus, IconMapPin } from "@tabler/icons-react";
import { LocationInput } from "@/components/LocationInput";
import { StoredLocality } from "@/utils/supabase/global.types";

interface MultipleLocationsInputProps {
  localities: StoredLocality[];
  onLocalitiesChange: (localities: StoredLocality[]) => void;
  maxLocalities?: number;
  title?: string;
  description?: string;
  searchLocalitiesOnly?: boolean;
}

export function MultipleLocationsInput({
  localities,
  onLocalitiesChange,
  maxLocalities = 5,
  title = "Business Locations",
  description = "Add locations where your collective operates",
  searchLocalitiesOnly = true,
}: MultipleLocationsInputProps) {
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');

  const handleAddLocation = (newLocality: StoredLocality) => {
    // Check if this locality is already added
    const exists = localities.some(
      loc => loc.locality.id === newLocality.locality.id
    );
    
    if (!exists) {
      onLocalitiesChange([...localities, newLocality]);
    }
    
    setIsAddingLocation(false);
  };

  const handleRemoveLocation = (localityToRemove: StoredLocality) => {
    onLocalitiesChange(
      localities.filter(loc => loc.locality.id !== localityToRemove.locality.id)
    );
  };

  const canAddMore = localities.length < maxLocalities;

  return (
    <Stack gap={isSmallMobile ? "sm" : "md"}>
      {title && (
        <div>
          <Title order={4} mb="xs" size={isSmallMobile ? "1rem" : undefined}>
            {title}
          </Title>
          <Text size={isSmallMobile ? "xs" : "sm"} c="dimmed">
            {description}
          </Text>
        </div>
      )}

      {/* Display current localities */}
      {localities.length > 0 && (
        <Stack gap="xs">
          {localities.map((locality, index) => (
            <Group 
              key={locality.locality.id} 
              justify="space-between" 
              wrap="nowrap"
              gap={isSmallMobile ? "xs" : "sm"}
            >
              <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
                <IconMapPin size={isSmallMobile ? 14 : 16} color="var(--mantine-color-blue-6)" />
                <Text size={isSmallMobile ? "xs" : "sm"} lineClamp={isMobile ? 2 : 1}>
                  {locality.fullAddress || 
                    `${locality.locality.name}, ${locality.administrativeArea.name}, ${locality.country.name}`
                  }
                </Text>
              </Group>
              <Button
                size="xs"
                variant="subtle"
                color="red"
                onClick={() => handleRemoveLocation(locality)}
                style={{ 
                  flexShrink: 0,
                  fontSize: isSmallMobile ? '0.625rem' : undefined
                }}
              >
                Remove
              </Button>
            </Group>
          ))}
        </Stack>
      )}

      {/* Add new location */}
      {isAddingLocation ? (
        <Box>
          <LocationInput
            onPlaceSelect={handleAddLocation}
            onRemovePlace={async () => setIsAddingLocation(false)}
            searchFullAddress={!searchLocalitiesOnly}
          />
          <Group mt="sm" gap="xs" justify="flex-start">
            <Button
              size={isSmallMobile ? "xs" : "sm"}
              variant="light"
              onClick={() => setIsAddingLocation(false)}
            >
              Cancel
            </Button>
          </Group>
        </Box>
      ) : (
        canAddMore && (
          <Group justify="flex-start" mt="sm" wrap="wrap">
            <Button
              leftSection={<IconPlus size={isSmallMobile ? 14 : 16} />}
              variant="light"
              size={isSmallMobile ? "sm" : "md"}
              onClick={() => setIsAddingLocation(true)}
              style={{
                borderStyle: 'dashed',
                borderWidth: '1px',
              }}
            >
              Add Location
            </Button>
            <Text size="xs" c="dimmed">
              {localities.length}/{maxLocalities} locations
            </Text>
          </Group>
        )
      )}

      {!canAddMore && (
        <Text size="xs" c="dimmed">
          Maximum {maxLocalities} locations allowed
        </Text>
      )}
    </Stack>
  );
}
