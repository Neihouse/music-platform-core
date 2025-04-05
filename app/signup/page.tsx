import { Signup } from "@/components/auth/Signup";
import { Container, Box } from "@mantine/core";

export default function LoginPage() {
  return (
    <Container size="xs" py="xl">
      <Box maw={400} mx="auto">
        <Signup />
      </Box>
    </Container>
  );
}
