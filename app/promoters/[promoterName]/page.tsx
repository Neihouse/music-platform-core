import { getPromoterByName } from "@/db/queries/promoters";
import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import { urlToName, nameToUrl } from "@/lib/utils";
import {
  Container,
  Grid,
  GridCol,
  Group,
  Stack,
  Title,
  Badge,
  Divider,
  Card,
  Text,
  Button,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PromoterPage({
  params,
}: {
  params: Promise<{ promoterName: string }>;
}) {
  const { promoterName } = await params;
  const decodedPromoterName = urlToName(promoterName);
  const supabase = await createClient();
  const user = await getUser(supabase);
  const promoter = await getPromoterByName(supabase, decodedPromoterName);

  if (!promoter) {
    notFound();
  }

  const userIsPromoter = user?.id === promoter.user_id;

  const { name, bio, email, phone } = promoter;
  
  return (
    <Container>
      <Grid gutter="lg">
        {/* Main Content */}
        <GridCol span={{ base: 12, md: 8 }}>
          {/* Promoter Header */}
          <div style={{ position: "relative", height: "200px", marginBottom: "2rem" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "200px",
                background: "linear-gradient(45deg, #ff6b35, #f7931e)",
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                zIndex: 1,
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div>
                <Group>
                  <Title style={{ color: "white" }}>{name}</Title>
                  {userIsPromoter && (
                    <Button 
                      component={Link} 
                      href={`/promoters/${nameToUrl(name)}/edit`}
                    >
                      <IconEdit size={16} />
                    </Button>
                  )}
                </Group>
                <Badge color="orange">Promoter</Badge>
              </div>
            </div>
          </div>

          {/* Events Section */}
          <Title order={2} mb="md">
            Promoted Events
          </Title>
          <Card withBorder p="lg">
            <Text c="dimmed" ta="center">
              Events promoted by {name} will appear here.
            </Text>
          </Card>
        </GridCol>

        {/* Sidebar */}
        <GridCol span={{ base: 12, md: 4 }}>
          <Title order={3} mb="md">
            About
          </Title>
          <Text size="sm" c="dimmed">
            {bio || "No bio available."}
          </Text>
          
          <Divider my="md" />
          
          <Title order={3} mb="md">
            Contact Information
          </Title>
          <Stack gap="sm">
            {email && (
              <Card withBorder p="sm">
                <Text size="sm" fw={500}>Email</Text>
                <Text size="sm" c="dimmed">{email}</Text>
              </Card>
            )}
            {phone && (
              <Card withBorder p="sm">
                <Text size="sm" fw={500}>Phone</Text>
                <Text size="sm" c="dimmed">{phone}</Text>
              </Card>
            )}
          </Stack>
        </GridCol>
      </Grid>
    </Container>
  );
}
