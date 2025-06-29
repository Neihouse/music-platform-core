"use client";

import {
  Card,
  Badge,
  Box,
  Button,
  Group,
  Text,
  Avatar,
  rem,
} from "@mantine/core";
import { 
  IconUsers, 
  IconStar,
} from "@tabler/icons-react";
import { StyledTitle } from "@/components/StyledTitle";
import { getAvatarUrl, getBannerUrl } from "@/lib/images/image-utils-client";
import { LocalPromoter } from "@/app/discover/actions";

interface PromoterCardProps {
  promoter: LocalPromoter;
}

export function PromoterCard({ promoter }: PromoterCardProps) {
  const bannerUrl = promoter.banner_img ? getBannerUrl(promoter.banner_img) : null;
  const avatarUrl = promoter.avatar_img ? getAvatarUrl(promoter.avatar_img) : null;

  return (
    <Card 
      radius="xl" 
      shadow="lg" 
      padding={0}
      withBorder
      style={{
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: '1px solid var(--mantine-color-gray-2)',
      }}
      className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Banner Section */}
      <Card.Section
        style={{
          height: 100,
          background: bannerUrl 
            ? `linear-gradient(135deg, rgba(255,69,0,0.3), rgba(255,140,0,0.2)), url(${bannerUrl})`
            : 'linear-gradient(135deg, var(--mantine-color-orange-6), var(--mantine-color-red-5))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          padding: rem(12),
        }}
      >
      </Card.Section>
      
      {/* Content Section */}
      <Box p="lg" style={{ position: 'relative' }}>
        {/* Avatar positioned to overlap banner */}
        <Avatar
          src={avatarUrl}
          alt={promoter.name}
          size={50}
          radius="xl"
          style={{
            position: 'absolute',
            top: -25,
            left: 20,
            border: '3px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 10,
          }}
        >
          <IconUsers size={24} />
        </Avatar>

        {/* Title positioned horizontally aligned with avatar */}
        <Group justify="space-between" align="center" mb="xs" style={{ 
          marginTop: -25, 
          paddingLeft: 75,
        }}>
          <StyledTitle
            selectedFont={promoter.selectedFont}
            as="h3"
            style={{
              fontSize: rem(18),
              fontWeight: 700,
              lineHeight: 1.2,
              margin: 0,
              right: "30px",
            }}
          >
            {promoter.name}
          </StyledTitle>
          <Badge
            size="sm"
            variant="light"
            color="orange"
            leftSection={<IconStar size={12} />}
          >
            {promoter.eventsOrganized || 0}
          </Badge>
        </Group>
        
        <Box style={{ paddingLeft: 75 }}>
          <Text size="xs" c="dimmed" fw={500} mb="sm" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
            Event Promoter/Collective
          </Text>
        </Box>

        {/* Bio and Actions with proper spacing */}
        <Box mt="md">
          {promoter.bio && (
            <Text size="sm" c="dimmed" lineClamp={2} mb="md" style={{ lineHeight: 1.5 }}>
              {promoter.bio}
            </Text>
          )}
          
          <Button 
            fullWidth
            variant="gradient"
            gradient={{ from: 'orange', to: 'red' }}
            size="sm"
            radius="xl"
            leftSection={<IconUsers size={14} />}
            style={{ fontWeight: 600 }}
          >
            Follow
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
