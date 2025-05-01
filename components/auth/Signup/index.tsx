"use client";
import {
  Divider,
  Paper,
  PaperProps,
  Stack,
  Text,
  TextInput,
  Tooltip,
  ActionIcon,
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
            onChange={(event) =>
              form.setFieldValue("name", event.currentTarget.value)
            }
            radius="md"
          />
          <EmailAndPasswordInputs
            errors={form.errors}
            values={form.values}
            setFieldValue={form.setFieldValue}
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
        <SwitchAction action="register" />
      </form>
    </Paper>
  );
}
