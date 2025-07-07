import { Signup } from "@/components/auth/Signup";
import { Container, Box } from "@mantine/core";

export default function SignupPage() {
  return (
    <Container 
      size="xs" 
      py="xl"
      px={{ base: "xs", sm: "md" }}
    >
      <Box 
        maw={{ base: "100%", sm: 400 }} 
        mx="auto"
        px={{ base: 0, sm: "md" }}
      >
        <Signup />
      </Box>
    </Container>
  );
}
