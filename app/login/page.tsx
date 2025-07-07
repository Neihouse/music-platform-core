import { Login } from "@/components/auth/Login";
import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import { Box, Container } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // TODO: Implement in middleware.ts
  const supabase = await createClient()
  const user = await getUser(supabase);

  if (user) {
    redirect("/");
  }

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
        <Login />
      </Box>
    </Container>
  );
}
