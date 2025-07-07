import { Signup } from "@/components/auth/Signup";
import { Box, Container } from "@mantine/core";

export default function SignupPage() {
  return (
    <Container
      size="sm"
      px={{ base: "md", sm: "xl" }}
      py={{ base: "xl", sm: "3xl" }}
      style={{
        minHeight: 'calc(100vh - 60px)', // Account for header height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        w="100%"
        maw={{ base: "100%", xs: 480, sm: 400 }}
        mx="auto"
      >
        <Signup />
      </Box>
    </Container>
  );
}
