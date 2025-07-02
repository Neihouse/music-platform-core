"use client";

import { Box, useMantineColorScheme } from "@mantine/core";

export default function BackgroundElements() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <>
      {/* Sophisticated background elements */}
      <Box
        style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: isDark 
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 50%, transparent 100%)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.02) 50%, transparent 100%)',
          filter: 'blur(1px)',
        }}
      />
      
      <Box
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '40% 60% 60% 40% / 60% 40% 60% 40%',
          background: isDark 
            ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.06), rgba(6, 182, 212, 0.03))'
            : 'linear-gradient(135deg, rgba(14, 165, 233, 0.02), rgba(6, 182, 212, 0.01))',
          filter: 'blur(0.5px)',
        }}
      />

      {/* Grid pattern overlay */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: isDark 
            ? 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.3,
        }}
      />
      
      <Box
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      
      <Box
        style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          filter: 'blur(30px)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />
      
      <Box
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
          filter: 'blur(25px)',
          animation: 'float 10s ease-in-out infinite',
        }}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
      `}</style>
    </>
  );
}
