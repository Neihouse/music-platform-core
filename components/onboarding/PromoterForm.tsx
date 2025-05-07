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
  FileInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { createPromoter } from "@/app/promoter/create/actions";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocationInput } from "@/components/LocationInput";
import { IconUpload } from "@tabler/icons-react";

export interface IPromoterFormProps {}

export function PromoterForm(props: IPromoterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      companyName: "",
      description: "",
      contactEmail: "",
      contactPhone: "",
      logo: null,
    },
    validate: {
      companyName: (value: string) =>
        !!value.length ? null : "Company name is required",
      contactEmail: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
    },
  });

  return (
    <Group justify="center" align="center" mt="xl">
      <Paper p="lg" radius="md" shadow="sm" w={600}>
        <form
          onSubmit={form.onSubmit((values) =>
            submitPromoter(
              values.companyName,
              values.description,
              values.contactEmail,
              values.contactPhone
            )
          )}
        >
          <Stack spacing="md">
            <Container>
              <Title order={2} mb="md">
                Promoter Profile
              </Title>

              <TextInput
                label="Company Name"
                error={form.errors.companyName}
                key={form.key("companyName")}
                placeholder="Enter your company/promotion name"
                {...form.getInputProps("companyName")}
                mb="md"
              />

              <Textarea
                label="Description"
                key={form.key("description")}
                placeholder="Tell us about your promotion company"
                minRows={3}
                {...form.getInputProps("description")}
                mb="md"
              />

              <TextInput
                label="Contact Email"
                error={form.errors.contactEmail}
                key={form.key("contactEmail")}
                placeholder="contact@yourcompany.com"
                {...form.getInputProps("contactEmail")}
                mb="md"
              />

              <TextInput
                label="Contact Phone"
                key={form.key("contactPhone")}
                placeholder="(555) 123-4567"
                {...form.getInputProps("contactPhone")}
                mb="md"
              />

              <FileInput
                label="Company Logo"
                placeholder="Upload your logo"
                leftSection={<IconUpload size={16} />}
                accept="image/png,image/jpeg"
                mb="md"
              />

              <Title order={4} mb="sm">
                Operating Location
              </Title>
              <LocationInput />
            </Container>

            <Button disabled={loading} type="submit" mt="md">
              Create Promoter Profile
            </Button>
          </Stack>
        </form>
      </Paper>
    </Group>
  );

  async function submitPromoter(
    companyName: string,
    description: string,
    contactEmail: string,
    contactPhone: string
  ) {
    setLoading(true);
    console.log(
      "Submitting promoter:",
      companyName,
      description,
      contactEmail,
      contactPhone
    );
    try {
      const promoter = await createPromoter(
        companyName,
        description,
        contactEmail,
        contactPhone
      );
      console.log("Promoter profile created:", promoter);
      router.push("/dashboard");
    } catch (error) {
      notifications.show({
        title: "Error",
        message: `${error}`,
        color: "red",
      });

      console.error("Error creating promoter profile:", error);
    } finally {
      setLoading(false);
    }
  }
}
