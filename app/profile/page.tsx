import { getAuthUser, getUser } from "@/db/queries/users";
import { Container } from "@mantine/core";

export default async function ProfilePage({}) {
  const authUser = await getAuthUser();
  const userProfile = await getUser();

  return (
    <Container>
      <h1>{authUser.email}</h1>

      <h2>{userProfile.description}</h2>
      <h3>Created at: {userProfile.created_at}</h3>
    </Container>
  );
}
