"use client";

import React, { useEffect, useState } from 'react';
import { Title, TitleProps } from '@mantine/core';
import { loadFontDynamically } from '@/lib/google-fonts';

interface StyledTitleProps extends Omit<TitleProps, 'children'> {
  /** The text content to display */
  title: string;
  /** The Google Font family name to use */
  fontName: string;
  /** Font weights to load (defaults to ['400', '600', '700']) */
  fontWeights?: string[];
  /** Font display strategy (defaults to 'swap') */
  fontDisplay?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  /** Fallback font stack (defaults to 'sans-serif') */
  fallbackFont?: string;
  /** Loading transition duration in milliseconds (defaults to 300) */
  transitionDuration?: number;
}

/**
 * StyledTitle - A portable component that extends Mantine's Title with Google Fonts
 * 
 * Features:
 * - Dynamically loads Google Fonts
 * - Shows fallback font while loading
 * - Smooth transition when font loads
 * - Extends all Title component props
 * - Type-safe and reusable
 * 
 * @example
 * ```tsx
 * <StyledTitle 
 *   title="Welcome to Music Platform" 
 *   fontName="Playfair Display"
 *   order={1}
 *   size="h1"
 * />
 * ```
 */
export function StyledTitle({
  title,
  fontName,
  fontWeights = ['400', '600', '700'],
  fontDisplay = 'swap',
  fallbackFont = 'sans-serif',
  transitionDuration = 300,
  style,
  ...titleProps
}: StyledTitleProps) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [fontError, setFontError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadFont = async () => {
      try {
        await loadFontDynamically(fontName, {
          weights: fontWeights,
          display: fontDisplay,
          subsets: ['latin'],
        });
        
        // Only update state if component is still mounted
        if (isMounted) {
          setFontLoaded(true);
          setFontError(false);
        }
      } catch (error) {
        console.warn(`Failed to load font "${fontName}":`, error);
        if (isMounted) {
          setFontError(true);
          setFontLoaded(false);
        }
      }
    };

    // Reset states when fontName changes
    setFontLoaded(false);
    setFontError(false);
    
    loadFont();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [fontName, fontWeights, fontDisplay]);

  // Determine the font family to use
  const fontFamily = fontLoaded && !fontError 
    ? `"${fontName}", ${fallbackFont}`
    : fallbackFont;

  // Combine styles with font loading transition
  const combinedStyle = {
    fontFamily,
    opacity: fontLoaded ? 1 : 0.9,
    transition: `all ${transitionDuration}ms ease-in-out`,
    ...(typeof style === 'object' ? style : {}),
  };

  return (
    <Title
      {...titleProps}
      style={combinedStyle}
    >
      {title}
    </Title>
  );
}

export default StyledTitle;
