"use client";
import { Divider, Paper, PaperProps, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { login, LoginData } from "@/app/login/actions";
import { SwitchAction } from "../SwitchAction";
import { EmailAndPasswordInputs } from "../EmailAndPasswordInputs";
import { validateEmail } from "../validation";

export function Login(props: PaperProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginData>({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val: string) => validateEmail(val),
      password: (val: string) => (!val.length ? "Password is required" : null),
    },
  });

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
        Welcome to Music Band
      </Text>

      {/* TODO: Implement Google OAuth
        https://supabase.com/docs/guides/auth/social-login/auth-google
      */}
      {/* <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
      </Group> */}

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form
        encType="multipart/form-data"
        onSubmit={form.onSubmit((values) => handleLogin(values))}
      >
        <Stack>
          <EmailAndPasswordInputs
            inputProps={{
              emailProps: form.getInputProps("email"),
              passwordProps: form.getInputProps("password"),
            }}
            errors={form.errors}
            values={form.values}
            setFieldValue={(field: string, value: string) => {
              setError(null);
              form.setFieldValue(field, value);
            }}
          />
        </Stack>
        {error && (
          <Text c="red" size="sm" mt="sm">
            {error}
          </Text>
        )}
        <SwitchAction loading={loading} action="login" />
      </form>
    </Paper>
  );

  async function handleLogin(values: LoginData) {
    setLoading(true);
    const error = await login(values);

    if (error) {
      if (`${error}`.includes("Invalid login credentials")) {
        setError("Invalid email or password");
      }
      setLoading(false);
      return null;
    }

    setError(null);
    setLoading(false);
  }
}
