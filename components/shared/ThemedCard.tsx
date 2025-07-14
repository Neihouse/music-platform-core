import { Card, CardProps } from "@mantine/core";
import { ReactNode } from "react";

interface ThemedCardProps extends Omit<CardProps, 'children'> {
    children: ReactNode;
    variant?: 'default' | 'danger';
}

export function ThemedCard({ children, variant = 'default', ...props }: ThemedCardProps) {
    const borderColor = variant === 'danger'
        ? "var(--mantine-color-red-9)"
        : "var(--mantine-color-dark-6)";

    return (
        <Card
            p={{ base: "md", sm: "lg", md: "xl" }}
            radius="md"
            withBorder
            bg="dark.8"
            style={{ borderColor, ...props.style }}
            {...props}
        >
            {children}
        </Card>
    );
}
