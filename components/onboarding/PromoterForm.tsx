"use client";

import { submitPromoter } from "@/app/promoters/create/actions";
import { MultipleLocationsInput } from "@/components/LocationInput/MultipleLocationsInput";
import { PromoterAvatarUpload } from "@/components/Upload/PromoterAvatarUpload";
import { PromoterBannerUpload } from "@/components/Upload/PromoterBannerUpload";
import { StoredLocality } from "@/utils/supabase/global.types";
import {
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  useMantineColorScheme
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FontSelect from "../FontSelect";

export interface IPromoterFormProps { }

export function PromoterForm(props: IPromoterFormProps) {
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const [loading, setLoading] = useState(false);
  const [selectedLocalities, setSelectedLocalities] = useState<StoredLocality[]>([]);
  const [promoterId, setPromoterId] = useState<string | undefined>();

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');

  const form = useForm({
    initialValues: {
      name: "",
      bio: "",
      fontFamily: "",
    },
    validate: {
      name: (value: string) =>
        !value.length ? "Promoter name is required" : null,
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

  // Custom validation for locations
  const validateForm = () => {
    const formErrors = form.validate();
    if (selectedLocalities.length === 0) {
      notifications.show({
        title: "Error",
        message: "Please add at least one location for your promoter profile",
        color: "red",
      });
      return false;
    }
    return !formErrors.hasErrors;
  };

  async function handleRemoveLocation() {
    // This function is no longer needed since MultipleLocationsInput handles removal
  }

  return (
    <Container
      size="lg"
      px={isMobile ? "sm" : isTablet ? "md" : "xl"}
      py={isMobile ? "md" : "xl"}
    >
      <Paper
        p={isMobile ? "md" : isTablet ? "lg" : "xl"}
        radius={isMobile ? "md" : "lg"}
        shadow={isMobile ? "xs" : isTablet ? "sm" : "md"}
        maw={isMobile ? "100%" : isTablet ? 600 : isSmallScreen ? 700 : 800}
        mx="auto"
        bg={colorScheme === 'dark' ? 'dark.7' : 'white'}
        withBorder
      >
        <form
          onSubmit={form.onSubmit((values) => {
            if (!validateForm()) {
              return;
            }
            return submitPromoterForm(
              values.name,
              values.bio,
              selectedLocalities,
            );
          })}
        >
          <Stack gap={isMobile ? "md" : isTablet ? "lg" : "xl"}>
            {/* Header Section */}
            <Group justify="center" mb={isMobile ? "md" : "lg"}>
              <Title
                order={isMobile ? 2 : 1}
                size={isMobile ? "1.5rem" : isTablet ? "1.8rem" : "2.2rem"}
                ta="center"
                c="blue.7"
                fw={isMobile ? 600 : 700}
              >
                Promoter Information
              </Title>
            </Group>

            {/* Basic Information Section */}
            <Stack gap={isMobile ? "sm" : "md"}>
              <TextInput
                label="Promoter/Company Name"
                error={form.errors.name}
                key={form.key("name")}
                placeholder="Enter your promoter or company name"
                size={isMobile ? "sm" : "md"}
                radius={isMobile ? "sm" : "md"}
                {...form.getInputProps("name")}
                styles={{
                  label: {
                    fontSize: "var(--mantine-font-size-sm)",
                    fontWeight: 500,
                    marginBottom: "0.25rem"
                  }
                }}
              />

              <Textarea
                label="Bio/Description"
                key={form.key("bio")}
                placeholder="Tell us about your promotion experience and what types of events you specialize in"
                minRows={isMobile ? 3 : 4}
                maxRows={isMobile ? 6 : 8}
                size={isMobile ? "sm" : "md"}
                radius={isMobile ? "sm" : "md"}
                autosize
                {...form.getInputProps("bio")}
                styles={{
                  label: {
                    fontSize: "var(--mantine-font-size-sm)",
                    fontWeight: 500,
                    marginBottom: "0.25rem"
                  }
                }}
              />
            </Stack>

            {/* Locations Section */}
            <Paper
              p={isMobile ? "sm" : "md"}
              bg={colorScheme === 'dark' ? 'dark.6' : 'gray.0'}
              radius={isMobile ? "sm" : "md"}
              withBorder
            >
              <MultipleLocationsInput
                localities={selectedLocalities}
                onLocalitiesChange={setSelectedLocalities}
                title="Business Locations"
                description="Add cities where your collective operates. This helps local artists and venues find you."
                maxLocalities={5}
                searchLocalitiesOnly={true}
              />
            </Paper>

            {/* Font Selection Section */}
            <Paper
              p={isMobile ? "sm" : "md"}
              bg={colorScheme === 'dark' ? 'dark.6' : 'blue.0'}
              radius={isMobile ? "sm" : "md"}
              withBorder
            >
              <Stack gap={isMobile ? "sm" : "md"}>
                <FontSelect
                  label="Brand Font"
                  placeholder="Choose a font for your brand..."
                  description="This font will be used for your collective name and branding"
                  size={isMobile ? "sm" : "md"}
                  {...form.getInputProps("fontFamily")}
                />

                {form.values.fontFamily && form.values.name && (
                  <Paper
                    p={isMobile ? "sm" : "md"}
                    bg={colorScheme === 'dark' ? 'dark.7' : 'white'}
                    radius={isMobile ? "sm" : "md"}
                    withBorder
                  >
                    <Stack gap="xs">
                      <Text
                        size={isMobile ? "xs" : "sm"}
                        c="dimmed"
                        fw={500}
                      >
                        Preview: {form.values.fontFamily}
                      </Text>
                      <Text
                        size={isMobile ? "lg" : isTablet ? "xl" : "2rem"}
                        fw={600}
                        ta="center"
                        style={{
                          fontFamily: `"${form.values.fontFamily}", "Inter", sans-serif`,
                        }}
                        c={colorScheme === 'dark' ? 'white' : 'dark.8'}
                      >
                        {form.values.name}
                      </Text>
                      {!isMobile && (
                        <Text
                          size="xs"
                          c="dimmed"
                          ta="center"
                          style={{ fontFamily: 'monospace' }}
                        >
                          CSS: font-family: "{form.values.fontFamily}", sans-serif
                        </Text>
                      )}
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </Paper>

            {/* Upload Sections - Only show if promoter is created */}
            {promoterId && (
              <Stack gap={isMobile ? "md" : "lg"}>
                {/* Avatar Upload */}
                <Paper
                  p={isMobile ? "sm" : "md"}
                  bg={colorScheme === 'dark' ? 'dark.6' : 'green.0'}
                  radius={isMobile ? "sm" : "md"}
                  withBorder
                >
                  <Stack gap={isMobile ? "sm" : "md"}>
                    <Title
                      order={isMobile ? 4 : 3}
                      size={isMobile ? "1rem" : "1.2rem"}
                      c={colorScheme === 'dark' ? 'green.4' : 'green.7'}
                    >
                      Profile Picture
                    </Title>
                    <PromoterAvatarUpload
                      promoterId={promoterId}
                      onAvatarUploaded={(url) => {
                        console.log("Promoter avatar uploaded:", url);
                        notifications.show({
                          title: "Success",
                          message: "Profile picture uploaded successfully!",
                          color: "green",
                        });
                      }}
                    />
                  </Stack>
                </Paper>

                {/* Banner Upload */}
                <Paper
                  p={isMobile ? "sm" : "md"}
                  bg={colorScheme === 'dark' ? 'dark.6' : 'orange.0'}
                  radius={isMobile ? "sm" : "md"}
                  withBorder
                >
                  <Stack gap={isMobile ? "sm" : "md"}>
                    <Title
                      order={isMobile ? 4 : 3}
                      size={isMobile ? "1rem" : "1.2rem"}
                      c={colorScheme === 'dark' ? 'orange.4' : 'orange.7'}
                    >
                      Promoter Banner
                    </Title>
                    <PromoterBannerUpload
                      promoterId={promoterId}
                      onBannerUploaded={(url) => {
                        console.log("Promoter banner uploaded:", url);
                        notifications.show({
                          title: "Success",
                          message: "Banner uploaded successfully!",
                          color: "green",
                        });
                      }}
                    />
                  </Stack>
                </Paper>
              </Stack>
            )}

            {/* Submit Button */}
            <Group justify="center" mt={isMobile ? "md" : "lg"}>
              <Button
                disabled={loading}
                type="submit"
                size={isMobile ? "md" : "lg"}
                radius={isMobile ? "md" : "lg"}
                w={isMobile ? "100%" : "auto"}
                px={isMobile ? "xl" : "3rem"}
                loading={loading}
                gradient={{ from: "blue", to: "cyan", deg: 45 }}
                variant="gradient"
                style={{
                  minHeight: isMobile ? '44px' : '48px', // Touch-friendly height
                }}
              >
                {promoterId ? "Update Profile" : "Create Promoter Profile"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );

  async function submitPromoterForm(
    name: string,
    bio: string,
    localities: StoredLocality[],
  ) {
    setLoading(true);
    console.log(
      "Submitting promoter:",
      name,
      bio,
      localities,
    );
    try {
      const promoter = await submitPromoter(
        {
          name,
          bio,
          selectedFont: form.values.fontFamily || null,
        },
        localities
      );
      console.log("Promoter created:", promoter);

      // Set the promoter ID so the banner upload appears
      setPromoterId(promoter.id);

      notifications.show({
        title: "Success",
        message: "Promoter profile created! You can now upload a banner image.",
        color: "green",
      });

      // Optionally redirect after a delay to let user upload banner
      // setTimeout(() => {
      //   router.push("/profile");
      // }, 3000);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: `${error}`,
        color: "red",
      });

      console.error("Error creating promoter:", error);
    } finally {
      setLoading(false);
    }
  }
}
