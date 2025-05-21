"use client";

import { Tag } from "@/utils/supabase/global.types";
import { Badge, Group, Text } from "@mantine/core";

interface TagDisplayProps {
	/**
	 * Array of tag objects to display
	 */
	tags: string[];

	/**
	 * Optional color for the badges
	 * @default "blue"
	 */
	color?: string;

	/**
	 * Optional variant for the badges
	 * @default "filled"
	 */
	variant?: "filled" | "outline" | "light" | "white" | "transparent" | "default" | "dot" | "gradient";

	/**
	 * Optional size for the badges
	 * @default "md"
	 */
	size?: "xs" | "sm" | "md" | "lg" | "xl";

	/**
	 * Optional radius for the badges
	 * @default "xl"
	 */
	radius?: "xs" | "sm" | "md" | "lg" | "xl" | number;

	/**
	 * Optional label to display before the tags
	 */
	label?: string;

	/**
	 * Optional message to display when there are no tags
	 * @default "No tags"
	 */
	emptyMessage?: string;

	/**
	 * Optional CSS class name
	 */
	className?: string;
}

/**
 * A component to display a collection of tags
 */
export default function TagDisplay({
	tags,
	color = "blue",
	variant = "filled",
	size = "md",
	radius = "xl",
	label,
	emptyMessage = "No tags",
	className,
}: TagDisplayProps) {
	if (!tags || tags.length === 0) {
		return <Text size="sm" c="dimmed">{emptyMessage}</Text>;
	}

	return (
		<div className={className}>
			{label && (
				<Text size="sm" fw={500} mb="xs">
					{label}
				</Text>
			)}
			<Group gap="xs" wrap="wrap">
				{tags.map((tag) => (
					<Badge
						key={tag}
						color={color}
						variant={variant}
						size={size}
						radius={radius}
					>
						{tag}
					</Badge>
				))}
			</Group>
		</div>
	);
}