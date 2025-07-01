"use client";

import { Container, Title, Text, Grid, GridCol, Card, Box, Avatar, Badge } from "@mantine/core";
import Link from "next/link";
import { nameToUrl } from "@/lib/utils";
import { StyledTitle } from "@/components/StyledTitle";

interface CollaboratorCard {
  id: string;
  name: string;
  bio?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  selectedFont?: string;
  type?: string;
}

interface CollaboratorsGridProps {
  collaborators: CollaboratorCard[];
  title?: string;
  emptyStateMessage?: string;
  basePath?: string;
  cardType?: string;
}

const CollaboratorsGrid = ({ 
  collaborators, 
  title = "Promoters & Collectives",
  emptyStateMessage = "No promoters or collectives found yet.",
  basePath = "/promoters",
  cardType = "Promoter"
}: CollaboratorsGridProps) => {
  return (
    <Container size="md">
      <Title order={2} mb="md" c="gray.0">{title}</Title>
      {collaborators.length > 0 ? (
        <Grid gutter="lg">
          {collaborators.map((collaborator) => (
            <GridCol key={collaborator.id} span={{ base: 6, sm: 4, md: 4 }}>
              <Card 
                padding="0" 
                style={{ 
                  backgroundColor: 'rgba(46, 35, 72, 0.3)',
                  border: '1px solid var(--mantine-color-dark-4)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                component={Link}
                href={`${basePath}/${nameToUrl(collaborator.name)}`}
              >
                {/* Banner Image */}
                <Box style={{ 
                  height: '120px', 
                  position: 'relative',
                  background: collaborator.bannerUrl 
                    ? `url(${collaborator.bannerUrl})` 
                    : 'linear-gradient(135deg, var(--mantine-color-violet-6), var(--mantine-color-indigo-6))',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}>
                  {/* Avatar positioned to overlap banner */}
                  <Avatar
                    src={collaborator.avatarUrl}
                    alt={collaborator.name}
                    size={60}
                    radius="xl"
                    style={{
                      position: 'absolute',
                      bottom: -30,
                      left: 16,
                      border: '3px solid var(--mantine-color-dark-7)',
                      zIndex: 10,
                    }}
                  >
                    {collaborator.name.charAt(0)}
                  </Avatar>
                </Box>
                
                {/* Content Section */}
                <Box p="md" pt="xl">
                  <StyledTitle
                    selectedFont={collaborator.selectedFont}
                    as="h3"
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--mantine-color-gray-0)',
                      marginBottom: '0.5rem',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {collaborator.name}
                  </StyledTitle>
                  {collaborator.bio && (
                    <Text 
                      size="sm" 
                      c="dimmed" 
                      lineClamp={2}
                      mb="sm"
                    >
                      {collaborator.bio}
                    </Text>
                  )}
                  <Badge 
                    variant="light" 
                    color="blue" 
                    size="sm"
                    style={{ width: 'fit-content' }}
                  >
                    {collaborator.type || cardType}
                  </Badge>
                </Box>
              </Card>
            </GridCol>
          ))}
        </Grid>
      ) : (
        <Text c="dimmed" ta="center" py="xl">
          {emptyStateMessage}
        </Text>
      )}
    </Container>
  );
};

export default CollaboratorsGrid;
