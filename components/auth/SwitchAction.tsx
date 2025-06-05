import { Group, Anchor, Button, Loader } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import * as React from "react";

export interface ISwitchActionProps {
  action: "login" | "register";
  loading?: boolean;
}

export function SwitchAction({ action, loading }: ISwitchActionProps) {
  return (
    <div>
      <Group justify="space-between" mt="xl">
        <Anchor
          c="dimmed"
          href={action === "login" ? "/signup" : "/login"}
          size="xs"
        >
          {action === "register"
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </Anchor>
        <Button type="submit" radius="xl" disabled={loading}>
          {loading ? <Loader size="sm" /> : upperFirst(action)}
        </Button>
      </Group>
    </div>
  );
}
