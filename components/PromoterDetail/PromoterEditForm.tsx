"use client";

import { MultipleLocationsInput } from "@/components/LocationInput/MultipleLocationsInput";
import { PromoterAvatarUpload } from "@/components/Upload/PromoterAvatarUpload";
import { PromoterBannerUpload } from "@/components/Upload/PromoterBannerUpload";
import { nameToUrl } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { StoredLocality } from "@/utils/supabase/global.types";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Grid,
  GridCol,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconUser
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FontSelect from "../FontSelect";

interface PromoterEditFormProps {
  promoter: any;
}

export function PromoterEditForm({ promoter }: PromoterEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedLocalities, setSelectedLocalities] = useState<StoredLocality[]>([]);
  const [localitiesLoading, setLocalitiesLoading] = useState(true);

  // Mobile responsive hooks
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');

  // Load existing localities on component mount
  useEffect(() => {
    async function loadLocalities() {
      try {
        setLocalitiesLoading(true);
        const supabase = createClient();

        const { data, error } = await supabase
          .from('promoters_localities')
          .select(`
            localities (
              id,
              name,
              administrative_areas (
                id,
                name,
                countries (
                  id,
                  name
                )
              )
            )
          `)
          .eq('promoter', promoter.id);

        if (error) {
          // Handle specific database errors
          if (error.code === '42501') { // Insufficient privilege
            throw new Error('You don\'t have permission to view this collective\'s locations.');
          } else if (error.code === '42P01') { // Table doesn't exist
            throw new Error('System configuration error. Please contact support.');
          } else {
            throw error;
          }
        }

        if (data) {
          // Transform the localities data to StoredLocality format
          const transformedLocalities: StoredLocality[] = data
            .filter((pl: any) => pl?.localities) // Filter out any items without localities
            .map((pl: any) => ({
              locality: pl.localities,
              administrativeArea: pl.localities?.administrative_areas || null,
              country: pl.localities?.administrative_areas?.countries || null,
              fullAddress: undefined // We don't store full address for existing localities
            }));

          setSelectedLocalities(transformedLocalities);
        }
      } catch (error: any) {
        console.error("Error loading localities:", error);

        let errorMessage = "Failed to load existing localities";

        // Provide more specific error messages based on the error type
        if (error?.message) {
          if (error.message.includes('permission')) {
            errorMessage = "You don't have permission to view this collective's locations";
          } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage = "Network error - please check your connection and try again";
          } else if (error.message.includes('not found')) {
            errorMessage = "Collective not found or has been removed";
          } else {
            errorMessage = `Unable to load locations: ${error.message}`;
          }
        }

        notifications.show({
          title: "Loading Error",
          message: errorMessage,
          color: "red",
        });
      } finally {
        setLocalitiesLoading(false);
      }
    }

    loadLocalities();
  }, [promoter.id]);

  // Helper function to get banner image URL
  const getBannerImageUrl = () => {
    if (!promoter.banner_img) return null;
    const supabase = createClient();
    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(`banners/${promoter.banner_img}`);
    return data.publicUrl;
  };

  // Helper function to get avatar image URL
  const getAvatarImageUrl = () => {
    if (!promoter.avatar_img) return null;
    const supabase = createClient();
    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(`avatars/${promoter.avatar_img}`);
    return data.publicUrl;
  };

  const bannerUrl = getBannerImageUrl();
  const avatarUrl = getAvatarImageUrl();

  const form = useForm({
    initialValues: {
      name: promoter.name || "",
      bio: promoter.bio || "",
      fontFamily: promoter.selectedFont || "",
    },
    validate: {
      name: (value: string) =>
        value.trim().length > 0 ? null : "Collective name is required",
    },
  });

  // Simple font loading for preview
  useEffect(() => {
    if (form.values.fontFamily) {
      const fontName = form.values.fontFamily.replace(/ /g, '+');

      // Check if font is already loaded
      const existingLink = document.querySelector(`link[href*="${fontName}"]`);
      if (!existingLink) {
        const fontLink = document.createElement('link');
        fontLink.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`;
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
    }
  }, [form.values.fontFamily]);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Update basic promoter information
      const { error: updateError } = await supabase
        .from('promoters')
        .update({
          name: values.name,
          bio: values.bio,
          selectedFont: values.fontFamily,
        })
        .eq('id', promoter.id);

      if (updateError) {
        // Handle specific database errors with user-friendly messages
        if (updateError.code === '23505') { // Unique constraint violation
          throw new Error('A collective with this name already exists. Please choose a different name.');
        } else if (updateError.code === '23514') { // Check constraint violation
          throw new Error('Please check your input values and try again.');
        } else if (updateError.code === '42501') { // Insufficient privilege
          throw new Error('You don\'t have permission to edit this collective.');
        } else {
          throw updateError;
        }
      }

      // Update localities - first delete existing ones, then insert new ones
      const { error: deleteError } = await supabase
        .from('promoters_localities')
        .delete()
        .eq('promoter', promoter.id);

      if (deleteError) {
        if (deleteError.code === '42501') { // Insufficient privilege
          throw new Error('You don\'t have permission to update this collective\'s locations.');
        } else {
          throw new Error('Failed to update locations. Please try again.');
        }
      }

      // Insert new localities if any are selected
      if (selectedLocalities.length > 0) {
        const localityInserts = selectedLocalities.map(loc => ({
          promoter: promoter.id,
          locality: loc.locality.id
        }));

        const { error: insertError } = await supabase
          .from('promoters_localities')
          .insert(localityInserts);

        if (insertError) {
          if (insertError.code === '23503') { // Foreign key violation
            throw new Error('One or more selected locations are invalid. Please refresh and try again.');
          } else if (insertError.code === '42501') { // Insufficient privilege
            throw new Error('You don\'t have permission to update this collective\'s locations.');
          } else {
            throw new Error('Failed to save location updates. Profile was saved successfully.');
          }
        }
      }

      notifications.show({
        title: "Profile Updated!",
        message: selectedLocalities.length > 0
          ? `Successfully updated your collective profile and ${selectedLocalities.length} location${selectedLocalities.length === 1 ? '' : 's'}.`
          : "Successfully updated your collective profile.",
        color: "green",
        autoClose: 4000,
      });

      router.push(`/promoters/${nameToUrl(values.name)}`);
    } catch (error: any) {
      console.error("Error updating promoter:", error);

      let errorMessage = "Failed to update collective profile";

      // Provide more specific error messages based on the error type
      if (error?.message) {
        if (error.message.includes('permission') || error.message.includes('unauthorized')) {
          errorMessage = "You don't have permission to edit this collective";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Network error - please check your connection and try again";
        } else if (error.message.includes('duplicate') || error.message.includes('unique')) {
          errorMessage = "A collective with this name already exists. Please choose a different name.";
        } else if (error.message.includes('validation') || error.message.includes('invalid')) {
          errorMessage = "Please check your input and try again";
        } else if (error.message.includes('not found')) {
          errorMessage = "Collective not found or has been removed";
        } else if (error.message.includes('localities') || error.message.includes('location')) {
          errorMessage = "Failed to update locations. Profile was saved but locations weren't updated.";
        } else {
          // Keep the original error message if it's descriptive enough
          errorMessage = error.message.length > 100
            ? "An unexpected error occurred. Please try again."
            : error.message;
        }
      }

      notifications.show({
        title: "Update Failed",
        message: errorMessage,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg" py={isSmallMobile ? "md" : "xl"} px={isSmallMobile ? "xs" : "md"}>
      {/* Header */}
      <Stack gap={isSmallMobile ? "sm" : "md"} mb={isSmallMobile ? "lg" : "xl"}>
        <Group gap="sm" wrap="nowrap">
          <ActionIcon
            component={Link}
            href={`/promoters/${nameToUrl(promoter.name)}`}
            size={isSmallMobile ? "md" : "lg"}
            variant="light"
            color="gray"
          >
            <IconArrowLeft size={isSmallMobile ? 16 : 20} />
          </ActionIcon>
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Title order={isSmallMobile ? 2 : 1} size={isSmallMobile ? "1.5rem" : undefined}>
              Edit Collective Profile
            </Title>
            <Text c="dimmed" size={isSmallMobile ? "xs" : "sm"} lineClamp={isMobile ? 2 : undefined}>
              Update your collective information and images
            </Text>
          </Box>
        </Group>
      </Stack>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid gutter={isSmallMobile ? "md" : "xl"}>
          {/* Banner and Avatar Section */}
          <GridCol span={12}>
            <Card withBorder radius="md" p={isSmallMobile ? "md" : "xl"}>
              <Title order={3} mb="md" size={isSmallMobile ? "1.25rem" : undefined}>
                Collective Images
              </Title>

              <Text size={isSmallMobile ? "xs" : "sm"} c="dimmed" mb={isSmallMobile ? "md" : "lg"}>
                Upload images to customize your collective profile. Changes are saved automatically when you upload new images.
              </Text>

              {/* Banner Upload */}
              <Stack gap="md" mb={isSmallMobile ? "lg" : "xl"}>
                <PromoterBannerUpload
                  promoterId={promoter.id}
                />
              </Stack>

              {/* Avatar Upload */}
              <Stack gap="md">
                <PromoterAvatarUpload
                  promoterId={promoter.id}
                />
              </Stack>
            </Card>
          </GridCol>

          {/* Basic Information */}
          <GridCol span={12}>
            <Card withBorder radius="md" p={isSmallMobile ? "md" : "xl"}>
              <Title order={3} mb="md" size={isSmallMobile ? "1.25rem" : undefined}>
                Basic Information
              </Title>

              <Grid gutter={isSmallMobile ? "sm" : "md"}>
                <GridCol span={{ base: 12, md: 6 }}>
                  <Stack gap={isSmallMobile ? "sm" : "md"}>
                    <TextInput
                      label="Collective Name"
                      placeholder="Enter your collective name"
                      leftSection={<IconUser size={16} />}
                      size={isSmallMobile ? "sm" : "md"}
                      {...form.getInputProps("name")}
                      required
                    />
                  </Stack>
                </GridCol>

                <GridCol span={{ base: 12, md: 6 }}>
                  <Stack gap={isSmallMobile ? "sm" : "md"} align="stretch">
                    <Textarea
                      label="Bio"
                      placeholder="Tell us about your collective, your mission, and what makes you unique..."
                      rows={isSmallMobile ? 3 : 6}
                      size={isSmallMobile ? "sm" : "md"}
                      {...form.getInputProps("bio")}
                    />
                  </Stack>
                </GridCol>

                <GridCol span={12}>
                  <Box style={{ display: 'flex', justifyContent: 'center', marginTop: isSmallMobile ? '1rem' : '1.5rem' }}>
                    <Box style={{ width: '100%', maxWidth: '400px' }}>
                      <FontSelect
                        label="Brand Font"
                        placeholder="Choose a font for your brand..."
                        description="This font will be used for your collective name and branding"
                        size={isSmallMobile ? "sm" : "md"}
                        {...form.getInputProps("fontFamily")}
                      />
                    </Box>
                  </Box>
                </GridCol>

                {form.values.fontFamily && form.values.name && (
                  <GridCol span={12}>
                    <Paper mt="sm" p={isSmallMobile ? "sm" : "md"} radius="md" withBorder>
                      <Text size="xs" c="dimmed" mb="xs">
                        Preview: {form.values.fontFamily}
                      </Text>
                      <Text
                        size={isSmallMobile ? "lg" : "xl"}
                        fw={600}
                        style={{
                          fontFamily: `"${form.values.fontFamily}", "Inter", sans-serif`,
                          wordBreak: 'break-word'
                        }}
                      >
                        {form.values.name}
                      </Text>
                      <Text size="xs" c="dimmed" mt="xs" style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        CSS: font-family: "{form.values.fontFamily}", sans-serif
                      </Text>
                    </Paper>
                  </GridCol>
                )}
              </Grid>
            </Card>
          </GridCol>

          {/* Localities Section */}
          <GridCol span={12}>
            <Card withBorder radius="md" p={isSmallMobile ? "md" : "xl"}>
              <Title order={3} mb="md" size={isSmallMobile ? "1.25rem" : undefined}>
                Operating Locations
              </Title>

              <Text size={isSmallMobile ? "xs" : "sm"} c="dimmed" mb={isSmallMobile ? "md" : "lg"}>
                Manage the cities where your collective operates. This helps local artists and venues find you.
              </Text>

              {localitiesLoading ? (
                <Text size={isSmallMobile ? "sm" : undefined}>Loading locations...</Text>
              ) : (
                <MultipleLocationsInput
                  localities={selectedLocalities}
                  onLocalitiesChange={setSelectedLocalities}
                  title=""
                  description=""
                  maxLocalities={5}
                  searchLocalitiesOnly={true}
                />
              )}
            </Card>
          </GridCol>

          {/* Actions */}
          <GridCol span={12}>
            <Stack gap={isSmallMobile ? "sm" : "md"} mt={isSmallMobile ? "lg" : "xl"}>
              {/* Mobile: Stack buttons vertically, Desktop: Side by side */}
              <Group
                justify="center"
                gap={isSmallMobile ? "xs" : "md"}
                style={{
                  flexDirection: isSmallMobile ? 'column' : 'row',
                  width: '100%'
                }}
              >
                <Button
                  component={Link}
                  href={`/promoters/${nameToUrl(promoter.name)}`}
                  variant="light"
                  size={isSmallMobile ? "md" : "lg"}
                  style={{
                    width: isSmallMobile ? '100%' : 'auto',
                    maxWidth: isSmallMobile ? '300px' : 'none'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  leftSection={<IconDeviceFloppy size={isSmallMobile ? 16 : 20} />}
                  size={isSmallMobile ? "md" : "lg"}
                  style={{
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    width: isSmallMobile ? '100%' : 'auto',
                    maxWidth: isSmallMobile ? '300px' : 'none'
                  }}
                >
                  Save Changes
                </Button>
              </Group>
            </Stack>
          </GridCol>
        </Grid>
      </form>
    </Container>
  );
}
