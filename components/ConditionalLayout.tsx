"use client";

import { Container } from "@mantine/core";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface ConditionalLayoutProps {
  children: ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
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
        overflowX: 'hidden'
      }}>
        {children}
      </div>
    );
  }
  
  return (
    <Container 
      size={1200} 
      px="1rem" 
      py="1.5rem" 
      style={{ 
        backgroundColor: 'var(--mantine-color-dark-9)',
        minHeight: 'calc(100vh - 120px)', // Account for header (60px) + footer (60px)
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
