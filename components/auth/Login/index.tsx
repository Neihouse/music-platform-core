"use client";
import { createClient } from "@/utils/supabase/client";
import {
  Alert,
  Divider,
  Paper,
  PaperProps,
  Stack,
  Text
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmailAndPasswordInputs } from "../EmailAndPasswordInputs";
import { SwitchAction } from "../SwitchAction";
import { validateEmail } from "../validation";

export interface LoginData {
  email: string;
  password: string;
}

export function Login(props: PaperProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

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
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        // Provide user-friendly error messages
        if (authError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Please check your email and click the confirmation link before logging in.");
        } else if (authError.message.includes("Too many requests")) {
          setError("Too many login attempts. Please wait a moment before trying again.");
        } else if (authError.message.includes("Network error") || authError.message.includes("fetch")) {
          setError("Network error. Please check your connection and try again.");
        } else if (authError.message.includes("Invalid API key")) {
          setError("Service temporarily unavailable. Please try again later.");
        } else {
          setError(authError.message || "An error occurred during login. Please try again.");
        }
        return;
      }

      // Verify session was created successfully
      if (!data.session) {
        setError("Failed to create session. Please try again.");
        return;
      }

      router.push("/");
      router.refresh(); // Ensure the page refreshes to update the auth state
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
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
