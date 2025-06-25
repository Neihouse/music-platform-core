"use client";

import {
  Button,
  Group,
  Stack,
  TextInput,
  Title,
  Textarea,
  Paper,
  Text,
  Container,
  Grid,
  GridCol,
  Card,
  Avatar,
  Center,
  Box,
  ActionIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconFileText,
  IconArrowLeft,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import Link from "next/link";
import { nameToUrl } from "@/lib/utils";
import { updatePromoterAction, getPromoterLocalitiesAction, updatePromoterLocalitiesAction } from "@/app/promoters/[promoterName]/edit/actions";
import { PromoterAvatarUpload } from "@/components/Upload/PromoterAvatarUpload";
import { PromoterBannerUpload } from "@/components/Upload/PromoterBannerUpload";
import { createClient } from "@/utils/supabase/client";
import { MultipleLocationsInput } from "@/components/LocationInput/MultipleLocationsInput";
import { StoredLocality } from "@/utils/supabase/global.types";

interface PromoterEditFormProps {
  promoter: any;
}

export function PromoterEditForm({ promoter }: PromoterEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedLocalities, setSelectedLocalities] = useState<StoredLocality[]>([]);
  const [localitiesLoading, setLocalitiesLoading] = useState(true);

  // Load existing localities on component mount
  useEffect(() => {
    async function loadLocalities() {
      try {
        setLocalitiesLoading(true);
        const result = await getPromoterLocalitiesAction(promoter.id);
        
        if (result.success && result.data) {
          // Transform the localities data to StoredLocality format
          const transformedLocalities: StoredLocality[] = result.data
            .filter((pl: any) => pl?.localities) // Filter out any items without localities
            .map((pl: any) => ({
              locality: pl.localities,
              administrativeArea: pl.localities?.administrative_areas || null,
              country: pl.localities?.administrative_areas?.countries || null,
              fullAddress: undefined // We don't store full address for existing localities
            }));
          
          setSelectedLocalities(transformedLocalities);
        } else {
          throw new Error(result.error || "Failed to load localities");
        }
      } catch (error) {
        console.error("Error loading localities:", error);
        notifications.show({
          title: "Error",
          message: "Failed to load existing localities",
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
      email: promoter.email || "",
      phone: promoter.phone || "",
    },
    validate: {
      name: (value: string) =>
        value.trim().length > 0 ? null : "Collective name is required",
      email: (value: string) =>
        value.trim().length === 0 || /^\S+@\S+\.\S+$/.test(value)
          ? null
          : "Invalid email format",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      // Update basic promoter information
      const result = await updatePromoterAction(promoter.id, values);
      
      if (result.success) {
        // Update localities
        const localityIds = selectedLocalities.map((loc: any) => loc.locality.id);
        const localitiesResult = await updatePromoterLocalitiesAction(promoter.id, localityIds);
        
        if (!localitiesResult.success) {
          throw new Error(localitiesResult.error);
        }
        
        notifications.show({
          title: "Success!",
          message: "Collective profile and locations updated successfully",
          color: "green",
        });

        router.push(`/promoters/${nameToUrl(values.name)}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.message || "Failed to update collective profile",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      {/* Header */}
      <Group mb="xl">
        <ActionIcon
          component={Link}
          href={`/promoters/${nameToUrl(promoter.name)}`}
          size="lg"
          variant="light"
          color="gray"
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
        <div>
          <Title order={1}>Edit Collective Profile</Title>
          <Text c="dimmed">Update your collective information and images</Text>
        </div>
      </Group>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid gutter="xl">
          {/* Banner and Avatar Section */}
          <GridCol span={12}>
            <Card withBorder radius="md" p="xl">
              <Title order={3} mb="md">
                Collective Images
              </Title>
              
              <Text size="sm" c="dimmed" mb="lg">
                Upload images to customize your collective profile. Changes are saved automatically when you upload new images.
              </Text>
              
              {/* Banner Upload */}
              <Stack gap="md" mb="xl">
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
          <GridCol span={{ base: 12, md: 8 }}>
            <Card withBorder radius="md" p="xl">
              <Title order={3} mb="md">
                Basic Information
              </Title>
              
              <Stack gap="md">
                <TextInput
                  label="Collective Name"
                  placeholder="Enter your collective name"
                  leftSection={<IconUser size={16} />}
                  {...form.getInputProps("name")}
                  required
                />

                <Textarea
                  label="Bio"
                  placeholder="Tell us about your collective, your mission, and what makes you unique..."
                  leftSection={<IconFileText size={16} />}
                  rows={4}
                  {...form.getInputProps("bio")}
                />

                <TextInput
                  label="Email"
                  placeholder="contact@collective.com"
                  leftSection={<IconMail size={16} />}
                  {...form.getInputProps("email")}
                />

                <TextInput
                  label="Phone"
                  placeholder="+1 (555) 123-4567"
                  leftSection={<IconPhone size={16} />}
                  {...form.getInputProps("phone")}
                />
              </Stack>
            </Card>
          </GridCol>

          {/* Preview Card */}
          <GridCol span={{ base: 12, md: 4 }}>
            <Card withBorder radius="md" p="xl" h="fit-content" style={{ position: "sticky", top: "20px" }}>
              <Title order={3} mb="md">
                Preview
              </Title>
              
              <Stack gap="md">
                <Box
                  style={{
                    height: "80px",
                    borderRadius: "8px",
                    background: bannerUrl 
                      ? `url(${bannerUrl}) center/cover` 
                      : "var(--mantine-color-gray-2)",
                    position: "relative",
                  }}
                >
                  <Box
                    style={{
                      position: "absolute",
                      bottom: "-20px",
                      left: "16px",
                    }}
                  >
                    <Avatar
                      src={avatarUrl}
                      size={40}
                      style={{
                        border: "2px solid white",
                      }}
                    >
                      <IconUser size={16} />
                    </Avatar>
                  </Box>
                </Box>
                
                <Box pt="md">
                  <Text fw={600} size="lg">
                    {form.values.name || "Collective Name"}
                  </Text>
                  {form.values.bio && (
                    <Text size="sm" c="dimmed" lineClamp={3} mt="xs">
                      {form.values.bio}
                    </Text>
                  )}
                </Box>
              </Stack>
            </Card>
          </GridCol>

          {/* Localities Section */}
          <GridCol span={{ base: 12, md: 8 }}>
            <Card withBorder radius="md" p="xl">
              <Title order={3} mb="md">
                Operating Locations
              </Title>
              
              <Text size="sm" c="dimmed" mb="lg">
                Manage the cities where your collective operates. This helps local artists and venues find you.
              </Text>
              
              {localitiesLoading ? (
                <Text>Loading locations...</Text>
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
            <Group justify="center" mt="xl">
              <Button
                component={Link}
                href={`/promoters/${nameToUrl(promoter.name)}`}
                variant="light"
                size="lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                leftSection={<IconDeviceFloppy size={20} />}
                size="lg"
                style={{
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                }}
              >
                Save Changes
              </Button>
            </Group>
          </GridCol>
        </Grid>
      </form>
    </Container>
  );
}
