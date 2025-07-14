import { Paper, PaperProps } from "@mantine/core";
import { ReactNode } from "react";

interface ThemedPaperProps extends Omit<PaperProps, 'children'> {
    children: ReactNode;
    variant?: 'default' | 'danger';
}

export function ThemedPaper({ children, variant = 'default', ...props }: ThemedPaperProps) {
    const borderColor = variant === 'danger'
        ? "var(--mantine-color-red-9)"
        : "var(--mantine-color-dark-6)";

    return (
        <Paper
            p={{ base: "md", sm: "lg" }}
            radius="md"
            withBorder
            bg="dark.8"
            style={{ borderColor, ...props.style }}
            {...props}
        >
            {children}
        </Paper>
    );
}
