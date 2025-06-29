'use client';

import { Box, Text, ThemeIcon, Stack, Loader, useMantineColorScheme } from "@mantine/core";
import { IconMusic, IconSparkles, IconMapPin, IconMicrophone } from "@tabler/icons-react";
import { useEffect, useState } from "react";

// CSS animations as strings
const animations = {
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }
  `,
  spin: `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
  fadeInOut: `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(10px); }
      50% { opacity: 1; transform: translateY(0px); }
      100% { opacity: 0; transform: translateY(-10px); }
    }
  `
};

interface LoadingAnimationProps {
  cityName: string;
}

export function LoadingAnimation({ cityName }: LoadingAnimationProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [currentText, setCurrentText] = useState(0);
  
  const loadingMessages = [
    `� Discovering artists in ${cityName}...`,
    `🏛️ Finding amazing venues...`,
    `🎪 Looking for active promoters...`,
    `🎫 Gathering upcoming events...`,
    `✨ Almost ready to rock!`
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % loadingMessages.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          50% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
      
      <Box
        py={80}
        style={{
          background: isDark
            ? 'linear-gradient(135deg, var(--mantine-color-violet-9), var(--mantine-color-indigo-9))'
            : 'linear-gradient(135deg, var(--mantine-color-indigo-5), var(--mantine-color-cyan-4))',
          borderRadius: 'var(--mantine-radius-lg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated background elements */}
        <Box
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            animation: 'float 3s ease-in-out infinite',
            opacity: 0.15,
          }}
        >
          <ThemeIcon size={80} radius="xl" variant="subtle" color="white">
            <IconMusic size={40} />
          </ThemeIcon>
        </Box>
        
        <Box
          style={{
            position: 'absolute',
            top: '30%',
            right: '15%',
            animation: 'float 4s ease-in-out infinite 1s',
            opacity: 0.12,
          }}
        >
          <ThemeIcon size={60} radius="xl" variant="subtle" color="white">
            <IconMicrophone size={30} />
          </ThemeIcon>
        </Box>
        
        <Box
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '25%',
            animation: 'pulse 2.5s ease-in-out infinite',
            opacity: 0.1,
          }}
        >
          <ThemeIcon size={100} radius="xl" variant="subtle" color="white">
            <IconSparkles size={50} />
          </ThemeIcon>
        </Box>

        <Stack align="center" gap="xl" style={{ position: 'relative', zIndex: 2 }}>
          <Box style={{ position: 'relative' }}>
            <ThemeIcon 
              size={120} 
              radius="xl" 
              variant="light" 
              color="white"
              style={{
                animation: 'spin 2s linear infinite',
                background: 'rgba(255,255,255,0.2)',
              }}
            >
              <IconMapPin size={60} />
            </ThemeIcon>
            
            <Box
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Loader size="md" color="white" />
            </Box>
          </Box>
          
          <Stack align="center" gap="md">
            <Text 
              size="xl" 
              fw={700} 
              c="white" 
              ta="center"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              Exploring {cityName}'s Music Scene...
            </Text>
            
            <Text 
              size="md" 
              c="rgba(255,255,255,0.9)" 
              ta="center"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                animation: 'fadeInOut 1.2s ease-in-out infinite',
                minHeight: '1.5em',
              }}
            >
              {loadingMessages[currentText]}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
