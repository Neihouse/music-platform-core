"use client";

import {
  Button,
  Container,
  Group,
  Stack,
  TextInput,
  Title,
  Textarea,
  Paper,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { submitPromoter } from "@/app/promoters/create/actions";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FontSelect from "../FontSelect";
import { MultipleLocationsInput } from "@/components/LocationInput/MultipleLocationsInput";
import { StoredLocality } from "@/utils/supabase/global.types";
import { PromoterBannerUpload } from "@/components/Upload/PromoterBannerUpload";
import { PromoterAvatarUpload } from "@/components/Upload/PromoterAvatarUpload";

export interface IPromoterFormProps {}

export function PromoterForm(props: IPromoterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedLocalities, setSelectedLocalities] = useState<StoredLocality[]>([]);
  const [promoterId, setPromoterId] = useState<string | undefined>();
  
  const form = useForm({
    initialValues: {
      name: "",
      bio: "",
      email: "",
      phone: "",
      fontFamily: "",
    },
    validate: {
      name: (value: string) =>
        !value.length ? "Promoter name is required" : null,
      email: (value: string) =>
        !value || /^\S+@\S+$/.test(value) ? null : "Invalid email address",
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
    <Group justify="center" align="center" mt="xl">
      <Paper p="lg" radius="md" shadow="sm" w={600}>
        <form
          onSubmit={form.onSubmit((values) => {
            if (!validateForm()) {
              return;
            }
            return submitPromoterForm(
              values.name,
              values.bio,
              selectedLocalities,
              values.email,
              values.phone,
            );
          })}
        >
          <Stack gap="md">
            <Container>
              <Title order={2} mb="md">
                Promoter Information
              </Title>

              <TextInput
                label="Promoter/Company Name"
                error={form.errors.name}
                key={form.key("name")}
                placeholder="Enter your promoter or company name"
                {...form.getInputProps("name")}
                mb="md"
              />

              <Textarea
                label="Bio/Description"
                key={form.key("bio")}
                placeholder="Tell us about your promotion experience and what types of events you specialize in"
                minRows={3}
                {...form.getInputProps("bio")}
                mb="md"
              />

              <Title order={4} mb="sm">
                Business Location
              </Title>
              
              <MultipleLocationsInput
                localities={selectedLocalities}
                onLocalitiesChange={setSelectedLocalities}
                title="Business Locations"
                description="Add cities where your collective operates. This helps local artists and venues find you."
                maxLocalities={5}
                searchLocalitiesOnly={true}
              />

              <TextInput
                label="Contact Email"
                error={form.errors.email}
                key={form.key("email")}
                placeholder="contact@yourcompany.com"
                {...form.getInputProps("email")}
                mb="md"
              />

              <TextInput
                label="Contact Phone"
                key={form.key("phone")}
                placeholder="(555) 123-4567"
                {...form.getInputProps("phone")}
                mb="md"
              />

              <FontSelect
                label="Brand Font"
                placeholder="Choose a font for your brand..."
                description="This font will be used for your collective name and branding"
                size="md"
                {...form.getInputProps("fontFamily")}
              />

              {form.values.fontFamily && form.values.name && (
                <Paper mt="sm" p="md" bg="gray.0" radius="md" withBorder>
                  <Text size="xs" c="dimmed" mb="xs">
                    Preview: {form.values.fontFamily}
                  </Text>
                  <Text 
                    size="xl" 
                    fw={600}
                    style={{ 
                      fontFamily: `"${form.values.fontFamily}", "Inter", sans-serif`,
                    }}
                  >
                    {form.values.name}
                  </Text>
                  <Text size="xs" c="dimmed" mt="xs" style={{ fontFamily: 'monospace' }}>
                    CSS: font-family: "{form.values.fontFamily}", sans-serif
                  </Text>
                </Paper>
              )}

              {/* Avatar and Banner Upload - Only show if promoter is created */}
              {promoterId && (
                <div>
                  <Title order={4} mb="sm">
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
                </div>
              )}

              {/* Banner Upload - Only show if promoter is created */}
              {promoterId && (
                <div>
                  <Title order={4} mb="sm">
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
                </div>
              )}
            </Container>

            <Button disabled={loading} type="submit" mt="md">
              {promoterId ? "Update Profile" : "Create Promoter Profile"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Group>
  );

  async function submitPromoterForm(
    name: string,
    bio: string,
    localities: StoredLocality[],
    email: string,
    phone: string,
  ) {
    setLoading(true);
    console.log(
      "Submitting promoter:",
      name,
      bio,
      localities,
      email,
      phone,
    );
    try {
      const promoter = await submitPromoter(
        {
          name,
          bio,
          email,
          phone,
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
