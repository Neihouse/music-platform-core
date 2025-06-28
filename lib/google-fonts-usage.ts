/**
 * Google Fonts Utility - Quick Usage Guide
 * 
 * Copy and paste these examples into your components to get started
 */

// 1. BASIC USAGE - Search for a font and get its CDN URL
import { searchFont } from '@/lib/google-fonts';

async function basicFontSearch() {
  const result = await searchFont(
    'Inter',  // Font name
    'YOUR_API_KEY_HERE', // Your Google Fonts API key
    {
      weights: ['400', '500', '600', '700'], // Font weights
      subsets: ['latin'], // Character subsets
      display: 'swap' // Font display strategy
    }
  );

  if (result.error) {
    console.error('Font not found:', result.error);
    return;
  }

  console.log('Font found:', result.font?.family);
  console.log('CDN URL:', result.cdnUrl);
  // CDN URL will be something like:
  // https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&subset=latin&display=swap
}

// 2. GENERATE CDN URL WITHOUT API CALL
import { generateFontCDNUrl } from '@/lib/google-fonts';

function quickCDNGeneration() {
  const cdnUrl = generateFontCDNUrl('Roboto', {
    weights: ['300', '400', '700'],
    display: 'swap'
  });
  
  console.log('CDN URL:', cdnUrl);
  // Output: https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&subset=latin&display=swap
}

// 3. LOAD FONT DYNAMICALLY IN BROWSER
import { loadFontDynamically } from '@/lib/google-fonts';

async function loadFontInBrowser() {
  try {
    await loadFontDynamically('Poppins', {
      weights: ['400', '600'],
      display: 'swap'
    });
    
    // Font is now loaded and ready to use
    document.body.style.fontFamily = '"Poppins", sans-serif';
    console.log('Font loaded successfully!');
  } catch (error) {
    console.error('Failed to load font:', error);
  }
}

// 4. SEARCH MULTIPLE FONTS AT ONCE
import { searchMultipleFonts } from '@/lib/google-fonts';

async function searchManyFonts() {
  const fontNames = ['Inter', 'Roboto', 'Open Sans', 'Lora'];
  const results = await searchMultipleFonts(fontNames, 'YOUR_API_KEY_HERE');
  
  results.forEach((result, index) => {
    if (result.error) {
      console.error(`${fontNames[index]} failed:`, result.error);
    } else {
      console.log(`${fontNames[index]} CDN:`, result.cdnUrl);
    }
  });
}

// 5. GENERATE COMBINED CDN URL FOR MULTIPLE FONTS
import { generateMultiFontCDNUrl } from '@/lib/google-fonts';

function combinedFontURL() {
  const fonts = [
    { family: 'Inter', weights: ['400', '500'] },
    { family: 'Playfair Display', weights: ['400', '700'] }
  ];
  
  const combinedUrl = generateMultiFontCDNUrl(fonts, {
    display: 'swap'
  });
  
  console.log('Combined URL:', combinedUrl);
  // This loads both fonts with one request - more efficient!
}

// 6. CHECK IF FONT IS AVAILABLE
import { isFontAvailable } from '@/lib/google-fonts';

async function checkFont() {
  const isAvailable = await isFontAvailable('Montserrat');
  
  if (isAvailable) {
    console.log('Montserrat is available!');
    // Use the font
  } else {
    console.log('Font not available, using fallback');
    // Use fallback font
  }
}

// 7. REACT COMPONENT EXAMPLE (use in a .tsx file)
/*
import React, { useEffect, useState } from 'react';
import { loadFontDynamically } from '@/lib/google-fonts';

function DynamicFontComponent({ fontFamily, children }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  
  useEffect(() => {
    loadFontDynamically(fontFamily, {
      weights: ['400', '600'],
      display: 'swap'
    })
    .then(() => setFontLoaded(true))
    .catch(console.error);
  }, [fontFamily]);

  return (
    <div 
      style={{ 
        fontFamily: fontLoaded ? `"${fontFamily}", sans-serif` : 'inherit',
        opacity: fontLoaded ? 1 : 0.8,
        transition: 'opacity 0.3s ease'
      }}
    >
      {children}
    </div>
  );
}
*/

// 8. NEXT.JS API ROUTE EXAMPLE
/*
// pages/api/fonts/search.ts
import { searchFont } from '@/lib/google-fonts';

export default async function handler(req, res) {
  const { fontName } = req.query;
  
  if (!fontName) {
    return res.status(400).json({ error: 'Font name required' });
  }

  const result = await searchFont(
    fontName as string,
    process.env.GOOGLE_FONTS_API_KEY!,
    { weights: ['400', '500', '600', '700'] }
  );

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  res.json({
    font: result.font,
    cdnUrl: result.cdnUrl
  });
}
*/

export {
  basicFontSearch,
  quickCDNGeneration,
  loadFontInBrowser,
  searchManyFonts,
  combinedFontURL,
  checkFont
};
