import { TextInput, PasswordInput } from "@mantine/core";
import * as React from "react";

export interface IEmailAndPasswordInputsProps {
  values: {
    email: string;
    password: string;
  };
  setFieldValue: (field: string, value: string) => void;
  errors: {
    email?: string;
    password?: string;
  };
}

export function EmailAndPasswordInputs({
  values: { email, password },
  setFieldValue,
  errors: { email: emailError, password: passwordError },
}: IEmailAndPasswordInputsProps) {
  return (
    <div>
      <TextInput
        required
        label="Email"
        placeholder="hello@mantine.dev"
        value={email}
        onChange={(event) => setFieldValue("email", event.currentTarget.value)}
        error={emailError && "Invalid email"}
        radius="md"
      />
      <PasswordInput
        required
        label="Password"
        placeholder="Your password"
        value={password}
        onChange={(event) =>
          setFieldValue("password", event.currentTarget.value)
        }
        error={passwordError && passwordError}
        radius="md"
      />
    </div>
  );
}
