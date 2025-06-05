import { Login } from "@/components/auth/Login";
import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import { Container, Box } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // TODO: Implement in middleware.ts
  const supabase = await createClient()
  const user = await getUser(supabase);

  if (user) {
    redirect("/");
  }

  return (
    <Container size="xs" py="xl">
      <Box maw={400} mx="auto">
        <Login />
      </Box>
    </Container>
  );
}
