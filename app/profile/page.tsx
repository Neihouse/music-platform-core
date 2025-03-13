import { getAuthUser, getUser } from "@/db/queries/users";
import {
  Card,
  CardSection,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";

export default async function ProfilePage({}) {
  const authUser = await getAuthUser();
  const userProfile = await getUser();

  return (
    <Container>
      <Grid grow justify="space-around" gutter={6}>
        <Card>
          <Text fs="italic">User info</Text>
          <Divider />
          <Stack gap={0} align="flex-start" justify="flex-start">
            <Title m={0}>{authUser?.user_metadata.name}</Title>
            <Text fs="italic">{authUser?.email}</Text>
          </Stack>
          <Space h="md" />
          <Paper p={4}>
            {userProfile?.description ? (
              <Text p={4}>{userProfile.description}</Text>
            ) : (
              <Text fs="italic">No bio</Text>
            )}
          </Paper>
        </Card>
        <Card>
          <Text>
            <em>Artist info</em>
          </Text>
          <Divider />
        </Card>
      </Grid>
    </Container>
  );
}
