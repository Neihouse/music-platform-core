import { Group, Anchor, Button } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import * as React from "react";

export interface ISwitchActionProps {
  action: "login" | "register";
}

export function SwitchAction({ action }: ISwitchActionProps) {
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
        <Button type="submit" radius="xl">
          {upperFirst(action)}
        </Button>
      </Group>
    </div>
  );
}
