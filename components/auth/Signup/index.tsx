"use client";
import { createClient } from "@/utils/supabase/client";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmailAndPasswordInputs } from "../EmailAndPasswordInputs";
import { SwitchAction } from "../SwitchAction";
import { validateEmail, validatePassword } from "../validation";

export interface SignupData {
  email: string;
  name: string;
  password: string;
}

export function Signup(props: PaperProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

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
      const { data, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
        },
      });

      if (authError) {
        // Provide user-friendly error messages
        if (authError.message.includes("User already registered")) {
          setError("An account with this email already exists. Please try logging in instead.");
        } else if (authError.message.includes("Password should be at least")) {
          setError("Password is too weak. Please choose a stronger password.");
        } else if (authError.message.includes("Invalid email")) {
          setError("Please enter a valid email address.");
        } else if (authError.message.includes("Network error") || authError.message.includes("fetch")) {
          setError("Network error. Please check your connection and try again.");
        } else {
          setError(authError.message || "An error occurred during signup. Please try again.");
        }
        return;
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        setError("Please check your email and click the confirmation link to complete your registration.");
        return;
      }

      // Signup successful
      if (data.session) {
        router.push("/settings");
        router.refresh();
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Signup error:", err);
      }
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
