"use client";

import { Box, Image } from "@mantine/core";

interface HeroSectionProps {
  bannerUrl: string | null;
  title: string;
  fallbackBannerUrl?: string;
}

const HeroSection = ({ 
  bannerUrl, 
  title, 
  fallbackBannerUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDqANvJwje3Oa6X49BIDf5y4Her6lRMCQQBGrwoxzTNq1djLqd9GKSt-uGltF10PcD8IV11HBuzFu3mCkHNNgDtGCyh7SMZWflPZEJ6waNjNgnd-USEihrBX5GA1Kc3L3HSSCfP7AWWmcg__cqnWQXucXNS_cTz8JItRkvGBAiXXM9Gpyr03EJ4JVK-MF2DC1rVH43iKhkf6n1rpOrm60QLH7HnhIy-4z-s6DzoHoaqgmx71ik4s3TwUWOixkDv65WidK3cAHYJEK8"
}: HeroSectionProps) => {
  return (
    <Box style={{ position: 'relative', height: '400px', marginBottom: '-180px', marginTop: '60px' }}>
      <Image
        src={bannerUrl || fallbackBannerUrl}
        alt={`${title} banner`}
        style={{
          width: '100%',
          height: '400px',
          objectFit: 'cover',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, var(--mantine-color-dark-9) 0%, rgba(22, 17, 34, 0.5) 30%, transparent 70%)',
        }}
      />
    </Box>
  );
};

export default HeroSection;
