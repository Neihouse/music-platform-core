"use client";

import { Container } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface ConditionalLayoutProps {
  children: ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');
  
  // Pages that should NOT have the container wrapper (full-width pages)
  const fullWidthPages = [
    '/artists/', // Any artist page
    '/promoters/', // Any promoter page
  ];
  
  const isFullWidth = fullWidthPages.some(path => pathname.includes(path));
  
  if (isFullWidth) {
    return (
      <div style={{
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        // padding: isSmallMobile ? '0.5rem' : isMobile ? '1rem' : '1.5rem',
        // paddingTop: isSmallMobile ? '1rem' : '1.5rem', // Add top padding for header spacing
        // paddingBottom: isSmallMobile ? '1rem' : '1.5rem',
      }}>
        {children}
      </div>
    );
  }
  
  return (
    <Container 
      size={1200} 
      px={isSmallMobile ? "0.5rem" : "1rem"} 
      py={isSmallMobile ? "1rem" : "1.5rem"} 
      style={{ 
        backgroundColor: 'var(--mantine-color-dark-9)',
        // Remove the minHeight calculation since AppShell.Main handles header offset automatically
        color: 'var(--mantine-color-gray-0)',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
      {children}
    </Container>
  );
}
