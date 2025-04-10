"use client";
import {
  Divider,
  Paper,
  PaperProps,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { signup, SignupData } from "@/app/login/actions";
import { SwitchAction } from "../SwitchAction";
import { EmailAndPasswordInputs } from "../EmailAndPasswordInputs";
import { validateEmail, validatePassword } from "../validation";

export function Signup(props: PaperProps) {
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
        onSubmit={form.onSubmit((values) => signup(values))}
      >
        <Stack>
          <TextInput
            label="Name"
            placeholder="Your name"
            value={form.values.name}
            onChange={(event) =>
              form.setFieldValue("name", event.currentTarget.value)
            }
            radius="md"
          />
          <EmailAndPasswordInputs
            errors={form.errors}
            values={form.values}
            setFieldValue={form.setFieldValue}
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
        <SwitchAction action="register" />
      </form>
    </Paper>
  );
}
