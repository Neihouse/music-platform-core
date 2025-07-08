"use client";
import { login, LoginData } from "@/app/login/actions";
import {
  Alert,
  Divider,
  Paper,
  PaperProps,
  Stack,
  Text
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { EmailAndPasswordInputs } from "../EmailAndPasswordInputs";
import { SwitchAction } from "../SwitchAction";
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

  const handleLogin = async (values: LoginData) => {
    setLoading(true);
    setError(null);

    try {
      await login(values);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      if (errorMessage.includes("Invalid login credentials")) {
        setError("Invalid email or password");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      radius="md"
      p={{ base: "md", sm: "xl" }}
      withBorder
      style={{
        width: '100%',
        maxWidth: '100%'
      }}
      {...props}
    >
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
          <Alert color="red" mt="md">
            {error}
          </Alert>
        )}
        <SwitchAction loading={loading} action="login" />
      </form>
    </Paper>
  );
}
