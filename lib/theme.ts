import { createTheme } from "@mantine/core";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const theme = createTheme({
  primaryColor: "blue",
  fontFamily: inter.style.fontFamily,
  defaultRadius: "md",
  colors: {
    // Custom color palette
    brand: [
      "#E7F5FF",
      "#D0EBFF",
      "#A5D8FF",
      "#74C0FC",
      "#4DABF7",
      "#339AF0",
      "#228BE6",
      "#1C7ED6",
      "#1971C2",
      "#1864AB",
    ],
    // Dark theme colors to match the design
    dark: [
      "#C1C2C5",
      "#A6A7AB", 
      "#909296",
      "#5C5F66",
      "#373A40",
      "#2C2E33",
      "#25262B",
      "#1A1B1E",
      "#141518",
      "#161122", // Custom dark background to match design
    ]
  },
  shadows: {
    md: "0 4px 8px rgba(0,0,0,0.1)",
    lg: "0 8px 16px rgba(0,0,0,0.1)",
    xl: "0 12px 24px rgba(0,0,0,0.1)",
  },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
  },
  components: {
    Button: {
      defaultProps: {
        size: "md",
        variant: "filled",
      },
    },
    Input: {
      defaultProps: {
        size: "md",
      },
    },
    Card: {
      defaultProps: {
        shadow: "sm",
        padding: "md",
        radius: "md",
      },
    },
    Container: {
      defaultProps: {
        size: "lg",
      },
    },
    // Mantine 8.x configuration for compatibility
    Portal: {
      defaultProps: {
        // Keep old behavior - disable reuseTargetNode if z-index issues occur
        reuseTargetNode: false,
      },
    },
    Switch: {
      defaultProps: {
        // Disable new thumb indicator to keep old visual style
        withThumbIndicator: false,
      },
    },
    Popover: {
      defaultProps: {
        // Keep old behavior - disable hideDetached to prevent auto-closing
        hideDetached: false,
      },
    },
  },
  other: { transitionDuration: 200, headerHeight: 60, footerHeight: 60 },
  breakpoints: {
    xs: "36em", // 576px
    sm: "48em", // 768px
    md: "62em", // 992px
    lg: "75em", // 1200px
    xl: "88em", // 1408px
  },
});
