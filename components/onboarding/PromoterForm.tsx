"use client";

import {
  Button,
  Group,
  Stack,
  TextInput,
  Title,
  Textarea,
  Paper,
  FileInput,
  Text,
  Card,
  Divider,
  Badge,
  Box,
  Container,
  Grid,
  GridCol,
  Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocationInput } from "@/components/LocationInput";
import { submitPromoter } from "@/app/promoters/create/actions";
import { 
  IconUpload, 
  IconBuilding, 
  IconMapPin,
  IconSparkles,
  IconMusic,
  IconUsers
} from "@tabler/icons-react";

export interface IPromoterFormProps { }

export function PromoterForm(props: IPromoterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      companyName: "",
      description: "",
      logo: null,
      location: null as any,
    },
    validate: {
      companyName: (value: string) =>
        !!value.length ? null : "Company name is required",
      location: (value: any) =>
        value ? null : "Operating location is required",
    },
  });

  return (
    <Container size="lg" py="xl">
      {/* Hero Section */}
      <Box mb="xl" style={{ textAlign: "center" }}>
        <Group justify="center" mb="md">
          <IconMusic size={40} style={{ color: "var(--mantine-color-blue-6)" }} />
          <IconSparkles size={32} style={{ color: "var(--mantine-color-yellow-5)" }} />
          <IconUsers size={40} style={{ color: "var(--mantine-color-green-6)" }} />
        </Group>
        <Title 
          order={1} 
          size="h1" 
          mb="sm"
          style={{
            background: "linear-gradient(45deg, var(--mantine-color-blue-6), var(--mantine-color-purple-6))",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Join the Music Revolution! 🎵
        </Title>
        <Text size="lg" c="dimmed" maw={600} mx="auto">
          Connect artists with audiences, create unforgettable experiences, and build the future of live music.
          Your journey as a music promoter starts here!
        </Text>
        <Group justify="center" mt="md" gap="xs">
          <Badge variant="light" color="blue" size="lg">Exclusive Access</Badge>
          <Badge variant="light" color="green" size="lg">Instant Setup</Badge>
          <Badge variant="light" color="purple" size="lg">Premium Tools</Badge>
        </Group>
      </Box>

      <Paper 
        radius="xl" 
        shadow="xl" 
        p="xl"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 249, 250, 0.9))",
          border: "1px solid var(--mantine-color-gray-2)",
        }}
      >
        <form
          onSubmit={form.onSubmit((values) =>
            handleSubmitPromoter(
              values.companyName,
              values.description,
              values.location,
            ),
          )}
        >
          <Stack gap="xl">
            {/* Company Info Section */}
            <Card radius="lg" shadow="sm" p="lg" withBorder>
              <Group mb="lg">
                <IconBuilding size={24} style={{ color: "var(--mantine-color-blue-6)" }} />
                <Title order={3} style={{ color: "var(--mantine-color-blue-8)" }}>
                  Company Information
                </Title>
              </Group>
              
              <Grid>
                <GridCol span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Company Name"
                    placeholder="Your amazing promotion company"
                    size="md"
                    leftSection={<IconBuilding size={18} />}
                    error={form.errors.companyName}
                    {...form.getInputProps("companyName")}
                    styles={{
                      input: {
                        borderRadius: "12px",
                        border: "2px solid var(--mantine-color-gray-3)",
                        "&:focus": {
                          borderColor: "var(--mantine-color-blue-5)",
                          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                        },
                      },
                    }}
                  />
                </GridCol>
                
                <GridCol span={{ base: 12, md: 6 }}>
                  <FileInput
                    label="Company Logo"
                    placeholder="Upload your awesome logo"
                    size="md"
                    leftSection={<IconUpload size={18} />}
                    accept="image/png,image/jpeg,image/webp"
                    {...form.getInputProps("logo")}
                    styles={{
                      input: {
                        borderRadius: "12px",
                        border: "2px solid var(--mantine-color-gray-3)",
                        "&:focus": {
                          borderColor: "var(--mantine-color-blue-5)",
                          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                        },
                      },
                    }}
                  />
                </GridCol>
              </Grid>

              <Textarea
                label="Company Description"
                placeholder="Tell the world about your passion for music and events! What makes your company special?"
                size="md"
                minRows={4}
                mt="md"
                {...form.getInputProps("description")}
                styles={{
                  input: {
                    borderRadius: "12px",
                    border: "2px solid var(--mantine-color-gray-3)",
                    "&:focus": {
                      borderColor: "var(--mantine-color-blue-5)",
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                    },
                  },
                }}
              />
            </Card>

            {/* Location Section */}
            <Card radius="lg" shadow="sm" p="lg" withBorder>
              <Group mb="lg">
                <IconMapPin size={24} style={{ color: "var(--mantine-color-purple-6)" }} />
                <Title order={3} style={{ color: "var(--mantine-color-purple-8)" }}>
                  Operating Location
                </Title>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Where do you primarily organize events? This helps us connect you with local artists and venues.
              </Text>
              <LocationInput
                onPlaceSelect={(locality) => form.setFieldValue("location", locality)}
                storedLocality={form.values.location}
              />
            </Card>

            <Divider my="lg" />

            {/* Submit Button */}
            <Flex justify="center">
              <Button
                type="submit"
                size="xl"
                loading={loading}
                leftSection={<IconSparkles size={20} />}
                style={{
                  background: "linear-gradient(45deg, var(--mantine-color-blue-6), var(--mantine-color-purple-6))",
                  border: "none",
                  borderRadius: "50px",
                  padding: "12px 48px",
                  fontSize: "18px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                  transition: "all 0.3s ease",
                }}
                styles={{
                  root: {
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 35px rgba(0, 0, 0, 0.2)",
                    },
                  },
                }}
              >
                🚀 Launch My Promoter Journey
              </Button>
            </Flex>

            <Text size="sm" c="dimmed" style={{ textAlign: "center" }}>
              By creating your promoter profile, you're joining a community of music industry professionals
              dedicated to bringing amazing live experiences to life! 🎤✨
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );

  async function handleSubmitPromoter(
    companyName: string,
    description: string,
    location: any,
  ) {
    setLoading(true);
    
    // Validate required fields
    if (!companyName) {
      notifications.show({
        title: "Validation Error",
        message: "Company name is required",
        color: "red",
      });
      setLoading(false);
      return;
    }
    
    if (!location) {
      notifications.show({
        title: "Validation Error", 
        message: "Operating location is required",
        color: "red",
      });
      setLoading(false);
      return;
    }
    
    console.log(
      "Submitting promoter:",
      companyName,
      description,
      location,
    );
    
    try {
      // Map form data to promoter table structure
      const promoterData = {
        name: companyName,
        bio: description || null,
      };
// TODO: Repeatedly calls `submitPromoter` 
      const promoter = await submitPromoter(promoterData, location);
      
      notifications.show({
        title: "🎉 Welcome to the team!",
        message: "Your promoter profile has been created successfully!",
        color: "green",
        autoClose: 5000,
      });
      
      console.log("Promoter profile created:", promoter);
      router.push("/dashboard");
    } catch (error) {
      notifications.show({
        title: "Oops! Something went wrong",
        message: `${error instanceof Error ? error.message : 'Unknown error'}`,
        color: "red",
      });

      console.error("Error creating promoter profile:", error);
    } finally {
      setLoading(false);
    }
  }
}
