"use client";
import { signup, SignupData } from "@/app/login/actions";
import {
  ActionIcon,
  Alert,
  Divider,
  Paper,
  PaperProps,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { EmailAndPasswordInputs } from "../EmailAndPasswordInputs";
import { SwitchAction } from "../SwitchAction";
import { validateEmail, validatePassword } from "../validation";

export function Signup(props: PaperProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupData>({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },

    validate: {
      email: validateEmail,
      password: validatePassword,
    },
  });

  const handleSubmit = async (values: SignupData) => {
    setLoading(true);
    setError(null);

    try {
      await signup(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
        Welcome to Myuzo
      </Text>

      {/* TODO: Implement Google OAuth
        https://supabase.com/docs/guides/auth/social-login/auth-google
      */}
      {/* <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
      </Group> */}

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}

      <form
        encType="multipart/form-data"
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <Stack>
          <TextInput
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                Your name
                <Tooltip label="You will be able to set your artist name later">
                  <ActionIcon
                    size="xs"
                    variant="outline"
                    radius="xl"
                    ml="xs"
                    style={{
                      display: "inline-flex",
                      transform: "translateY(-30%)",
                      borderColor: "#fff",
                      color: "#fff",
                      fontSize: "0.6rem",
                      backgroundColor: "transparent",
                    }}
                  >
                    ?
                  </ActionIcon>
                </Tooltip>
              </div>
            }
            placeholder="Your name"
            value={form.values.name}
            {...form.getInputProps("name")}
            onChange={(event) => {
              setError(null);
              form.setFieldValue("name", event.currentTarget.value);
            }}
            radius="md"
          />
          <EmailAndPasswordInputs
            errors={form.errors}
            values={form.values}
            setFieldValue={(field: string, value: string) => {
              setError(null);
              form.setFieldValue(field, value);
            }}
            inputProps={{
              emailProps: form.getInputProps("email"),
              passwordProps: form.getInputProps("password"),
            }}
          />
          {/* TODO: Write terms and conditions */}
          {/* <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue("terms", event.currentTarget.checked)
              }
            /> */}
        </Stack>
        <SwitchAction action="register" loading={loading} />
      </form>
    </Paper>
  );
}
