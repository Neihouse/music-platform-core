import { Anchor, Button, Group, Loader, Stack } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";

export interface ISwitchActionProps {
  action: "login" | "register";
  loading?: boolean;
  onForgotPasswordClick?: () => void;
}

export function SwitchAction({ action, loading, onForgotPasswordClick }: ISwitchActionProps) {
  return (
    <div>
      <Stack gap="sm" mt="xl">
        <Group justify="space-between">
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

        {action === "login" && onForgotPasswordClick && (
          <Group justify="center">
            <Anchor
              c="dimmed"
              onClick={onForgotPasswordClick}
              size="xs"
              style={{ cursor: "pointer" }}
            >
              Forgot your password?
            </Anchor>
          </Group>
        )}
      </Stack>
    </div>
  );
}
