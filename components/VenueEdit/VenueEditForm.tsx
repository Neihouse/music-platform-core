"use client";

import {
  Container,
  Title,
  Text,
  Group,
  Stack,
  Button,
  Box,
  Paper,
  TextInput,
  Textarea,
  NumberInput,
  Divider,
  ActionIcon,
  ThemeIcon,
  Grid,
  GridCol,
  Alert,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconMapPin,
  IconUsers,
  IconPhone,
  IconMail,
  IconDeviceFloppy,
  IconX,
  IconEdit,
  IconAlertCircle,
  IconCheck,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LocationInput } from "@/components/LocationInput";
import { StoredLocality } from "@/utils/supabase/global.types";
import { updateVenue } from "@/app/venues/[venueName]/actions";

interface VenueEditFormProps {
  venue: {
    id: string;
    name: string;
    description: string | null;
    address: string | null;
    capacity: number | null;
    contact_email: string | null;
    contact_phone: string | null;
    user_id: string | null;
    administrative_area: string;
    locality: string;
  };
}

export function VenueEditForm({ venue }: VenueEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<StoredLocality | undefined>();

  const form = useForm({
    initialValues: {
      name: venue.name || "",
      description: venue.description || "",
      capacity: venue.capacity || 0,
      contact_email: venue.contact_email || "",
      contact_phone: venue.contact_phone || "",
    },
    validate: {
      name: (value: string) =>
        !!value.length ? null : "Venue name is required",
      contact_email: (value: string) =>
        !value || /^\S+@\S+$/.test(value) ? null : "Invalid email address",
    },
  });

  const handleRemoveLocation = async () => {
    setSelectedPlace(undefined);
  };

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    
    try {
      await updateVenue(venue.id, {
        name: values.name,
        description: values.description,
        capacity: values.capacity,
        contact_email: values.contact_email,
        contact_phone: values.contact_phone,
        location: selectedPlace,
      });

      notifications.show({
        title: "Success!",
        message: "Venue updated successfully",
        color: "green",
        icon: <IconCheck size={16} />,
      });

      router.push(`/venues/${encodeURIComponent(values.name)}`);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: `Failed to update venue: ${error}`,
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Modern Hero Section */}
      <Box
        style={{
          position: "relative",
          minHeight: "40vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          overflow: "hidden",
        }}
      >
        {/* Animated background elements */}
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
            `,
          }}
        />
        
        <Container size="xl" h="100%" style={{ position: "relative", zIndex: 2 }}>
          <Stack justify="center" h="40vh" gap="2rem">
            {/* Navigation */}
            <Group>
              <ActionIcon
                component={Link}
                href={`/venues/${encodeURIComponent(venue.name)}`}
                size="lg"
                radius="xl"
                variant="light"
                color="white"
                style={{
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <IconArrowLeft size={20} />
              </ActionIcon>
            </Group>

            {/* Page title */}
            <Box ta="center">
              <Group justify="center" gap="md" mb="md">
                <ThemeIcon size="xl" variant="light" color="white" radius="xl">
                  <IconEdit size={28} />
                </ThemeIcon>
              </Group>
              
              <Title
                order={1}
                style={{
                  fontSize: "clamp(2rem, 6vw, 3.5rem)",
                  fontWeight: 300,
                  color: "white",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  marginBottom: "1rem",
                }}
              >
                Edit Venue
              </Title>
              
              <Text
                size="1.25rem"
                ta="center"
                c="rgba(255, 255, 255, 0.9)"
                style={{ fontWeight: 300 }}
              >
                Update your venue information and settings
              </Text>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Edit Form Section */}
      <Container size="md" py="3rem">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="2rem">
            {/* Basic Information */}
            <Paper
              p="2rem"
              radius="xl"
              withBorder
              style={{
                background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              }}
            >
              <Stack gap="xl">
                <Group gap="md">
                  <ThemeIcon size="lg" color="blue" variant="light" radius="xl">
                    <IconEdit size={24} />
                  </ThemeIcon>
                  <div>
                    <Title order={3}>Basic Information</Title>
                    <Text size="sm" c="dimmed">Update your venue's core details</Text>
                  </div>
                </Group>

                <Divider />

                <Grid>
                  <GridCol span={12}>
                    <TextInput
                      label="Venue Name"
                      placeholder="Enter venue name"
                      size="md"
                      radius="lg"
                      {...form.getInputProps("name")}
                      styles={{
                        input: {
                          border: "2px solid #e9ecef",
                          "&:focus": {
                            borderColor: "#667eea",
                            boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                          },
                        },
                      }}
                    />
                  </GridCol>
                  
                  <GridCol span={12}>
                    <Textarea
                      label="Description"
                      placeholder="Describe your venue..."
                      size="md"
                      radius="lg"
                      minRows={4}
                      {...form.getInputProps("description")}
                      styles={{
                        input: {
                          border: "2px solid #e9ecef",
                          "&:focus": {
                            borderColor: "#667eea",
                            boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                          },
                        },
                      }}
                    />
                  </GridCol>

                  <GridCol span={{ base: 12, md: 6 }}>
                    <NumberInput
                      label="Capacity"
                      placeholder="Maximum capacity"
                      size="md"
                      radius="lg"
                      min={0}
                      leftSection={<IconUsers size={18} />}
                      {...form.getInputProps("capacity")}
                      styles={{
                        input: {
                          border: "2px solid #e9ecef",
                          "&:focus": {
                            borderColor: "#667eea",
                            boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                          },
                        },
                      }}
                    />
                  </GridCol>
                </Grid>
              </Stack>
            </Paper>

            {/* Location */}
            <Paper
              p="2rem"
              radius="xl"
              withBorder
              style={{
                background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              }}
            >
              <Stack gap="xl">
                <Group gap="md">
                  <ThemeIcon size="lg" color="green" variant="light" radius="xl">
                    <IconMapPin size={24} />
                  </ThemeIcon>
                  <div>
                    <Title order={3}>Location</Title>
                    <Text size="sm" c="dimmed">Update your venue's address</Text>
                  </div>
                </Group>

                <Divider />

                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Current Address"
                  color="blue"
                  variant="light"
                  radius="lg"
                >
                  {venue.address || "No address currently set"}
                </Alert>

                <LocationInput
                  onPlaceSelect={setSelectedPlace}
                  onRemovePlace={handleRemoveLocation}
                  storedLocality={selectedPlace}
                  searchFullAddress={true}
                />
              </Stack>
            </Paper>

            {/* Contact Information */}
            <Paper
              p="2rem"
              radius="xl"
              withBorder
              style={{
                background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              }}
            >
              <Stack gap="xl">
                <Group gap="md">
                  <ThemeIcon size="lg" color="orange" variant="light" radius="xl">
                    <IconPhone size={24} />
                  </ThemeIcon>
                  <div>
                    <Title order={3}>Contact Information</Title>
                    <Text size="sm" c="dimmed">How people can reach you</Text>
                  </div>
                </Group>

                <Divider />

                <Grid>
                  <GridCol span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Contact Email"
                      placeholder="venue@example.com"
                      size="md"
                      radius="lg"
                      leftSection={<IconMail size={18} />}
                      {...form.getInputProps("contact_email")}
                      styles={{
                        input: {
                          border: "2px solid #e9ecef",
                          "&:focus": {
                            borderColor: "#667eea",
                            boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                          },
                        },
                      }}
                    />
                  </GridCol>

                  <GridCol span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Contact Phone"
                      placeholder="(555) 123-4567"
                      size="md"
                      radius="lg"
                      leftSection={<IconPhone size={18} />}
                      {...form.getInputProps("contact_phone")}
                      styles={{
                        input: {
                          border: "2px solid #e9ecef",
                          "&:focus": {
                            borderColor: "#667eea",
                            boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                          },
                        },
                      }}
                    />
                  </GridCol>
                </Grid>
              </Stack>
            </Paper>

            {/* Action Buttons */}
            <Group justify="space-between" mt="2rem">
              <Button
                component={Link}
                href={`/venues/${encodeURIComponent(venue.name)}`}
                variant="outline"
                size="lg"
                radius="xl"
                leftSection={<IconX size={20} />}
                style={{
                  border: "2px solid #e9ecef",
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="lg"
                radius="xl"
                loading={loading}
                leftSection={<IconDeviceFloppy size={20} />}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
                  },
                }}
                px="2rem"
              >
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}
