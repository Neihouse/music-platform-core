"use client";

import React, { useEffect, useState, ReactNode, useMemo } from 'react';
import { loadFont, isFontLoaded } from '@/lib/fonts-client';

interface StyledTitleProps {
  /**
   * The text content to display
   */
  children: ReactNode;
  
  /**
   * The font family name from the selectedFont field
   * This should come from the database (artists.selectedFont, promoters.selectedFont, etc.)
   */
  selectedFont?: string | null;
  
  /**
   * Font weights to load (defaults to common weights)
   */
  fontWeights?: string[];
  
  /**
   * Fallback font family if selectedFont fails to load
   */
  fallbackFont?: string;
  
  /**
   * Additional CSS class name
   */
  className?: string;
  
  /**
   * Additional inline styles
   */
  style?: React.CSSProperties;
  
  /**
   * HTML element to render (defaults to 'h1')
   */
  as?: keyof JSX.IntrinsicElements;
  
  /**
   * Whether to show a loading state while font loads
   */
  showLoading?: boolean;
}

/**
 * StyledTitle Component
 * 
 * A component that dynamically loads and applies Google Fonts based on the selectedFont field
 * from the database. It safely handles font loading using the secure client-side font loader.
 * 
 * Features:
 * - Dynamically loads Google Fonts using the selectedFont field
 * - Uses secure client-side font loading (no API keys exposed)
 * - Provides fallback fonts if loading fails
 * - Supports custom styling and HTML elements
 * - Shows loading state while font loads
 * 
 * @example
 * ```tsx
 * // Basic usage with artist data
 * <StyledTitle selectedFont={artist.selectedFont}>
 *   {artist.name}
 * </StyledTitle>
 * 
 * // With custom element and styling
 * <StyledTitle 
 *   selectedFont={promoter.selectedFont}
 *   as="h2"
 *   className="my-title"
 *   fallbackFont="Arial, sans-serif"
 * >
 *   {promoter.name}
 * </StyledTitle>
 * 
 * // With venue data
 * <StyledTitle selectedFont={venue.selectedFont}>
 *   {venue.name}
 * </StyledTitle>
 * ```
 */
export function StyledTitle({
  children,
  selectedFont,
  fontWeights = ['400', '500', '600', '700'],
  fallbackFont = 'Arial, sans-serif',
  className,
  style,
  as: Component = 'h1',
  showLoading = false,
}: StyledTitleProps) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [fontFailed, setFontFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize fontWeights to prevent unnecessary re-renders
  const memoizedFontWeights = useMemo(() => fontWeights, [fontWeights.join(',')]);

  useEffect(() => {
    // If no selectedFont provided, don't attempt to load
    if (!selectedFont || !selectedFont.trim()) {
      setFontLoaded(false);
      setFontFailed(false);
      setIsLoading(false);
      return;
    }

    // Check if font is already loaded in the DOM to prevent unnecessary re-loading
    if (isFontLoaded(selectedFont)) {
      setFontLoaded(true);
      setFontFailed(false);
      setIsLoading(false);
      return;
    }

    // Reset states only when we're about to load a new font
    setFontLoaded(false);
    setFontFailed(false);
    setIsLoading(false);

    // If no selectedFont provided, don't attempt to load
    if (!selectedFont || !selectedFont.trim()) {
      setFontLoaded(false);
      setFontFailed(false);
      setIsLoading(false);
      return;
    }

    // Check if font is already loaded in the DOM to prevent unnecessary re-loading
    if (isFontLoaded(selectedFont)) {
      setFontLoaded(true);
      setFontFailed(false);
      setIsLoading(false);
      return;
    }

    // Reset states only when we're about to load a new font
    setFontLoaded(false);
    setFontFailed(false);
    setIsLoading(false);

    const loadSelectedFont = async () => {
      setIsLoading(true);
      
      try {
        const result = await loadFont(selectedFont, {
          weights: memoizedFontWeights,
          display: 'swap' // Use swap for better performance
        });

        if (result.success) {
          setFontLoaded(true);
        } else {
          console.warn(`Failed to load font "${selectedFont}":`, result.error);
          setFontFailed(true);
        }
      } catch (error) {
        console.error(`Error loading font "${selectedFont}":`, error);
        setFontFailed(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadSelectedFont();
  }, [selectedFont, memoizedFontWeights]);

  // Determine the font family to use
  const getFontFamily = (): string => {
    if (fontLoaded && selectedFont) {
      return `"${selectedFont}", ${fallbackFont}`;
    }
    return fallbackFont;
  };

  // Generate a normalized CSS class for consistent font rendering
  const generateNormalizedClassName = (): string => {
    const baseClasses = ['styled-title-normalized'];
    if (className) baseClasses.push(className);
    return baseClasses.join(' ');
  };

  // Combine styles with font normalization
  const combinedStyle: React.CSSProperties = {
    fontFamily: getFontFamily(),
    // Add a subtle transition for smooth font loading
    transition: 'font-family 0.2s ease-in-out',
    
    // Font normalization for consistent positioning across different fonts
    fontFeatureSettings: '"kern" 1, "liga" 1', // Enable kerning and ligatures
    textRendering: 'optimizeLegibility', // Better text rendering
    
    // Normalize line height and baseline alignment
    lineHeight: style?.lineHeight || '1.2', // Consistent line height if not specified
    
    // Use CSS Grid or Flexbox properties for better alignment control
    display: style?.display || 'block',
    
    // Normalize font metrics for consistent baseline alignment
    fontVariantNumeric: 'normal',
    fontVariantPosition: 'normal',
    
    // Ensure consistent text baseline across fonts
    textAlign: style?.textAlign || 'left',
    
    // Font baseline normalization - key for consistent positioning
    verticalAlign: 'baseline',
    
    // Apply additional styles from props
    ...style,
  };

  // Add loading opacity if needed
  if (showLoading && isLoading) {
    combinedStyle.opacity = 0.7;
  }

  // Add CSS normalization styles directly to the component
  const normalizedStyle: React.CSSProperties = {
    ...combinedStyle,
    
    // The following normalization properties are set after spreading user/computed styles,
    // so they cannot be overridden by user styles.
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    boxSizing: 'border-box',
    alignSelf: 'baseline',
    marginTop: 0,
    marginBottom: 0,
    position: 'relative',
    top: combinedStyle?.top || '0px',
    lineHeight: combinedStyle.lineHeight || 1.2,
  };

  return (
    <Component 
      className={generateNormalizedClassName()} 
      style={normalizedStyle}
      // Add data attributes for debugging/testing
      data-font={selectedFont}
      data-font-loaded={fontLoaded}
      data-font-failed={fontFailed}
    >
      {children}
    </Component>
  );
}

export default StyledTitle;
