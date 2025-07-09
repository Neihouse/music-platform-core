"use client";

import { getPosterUrl } from "@/lib/images/image-utils-client";
import { Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";

interface Event {
    id: string;
    name: string;
    date: string | null;
    hash: string | null;
    poster_img: string | null;
    venues: {
        id: string;
        name: string;
        address: string | null;
    } | null;
}

interface EventsHeaderProps {
    events: Event[];
}

// Utility function to extract dominant color from image
const extractDominantColor = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = document.createElement('img') as HTMLImageElement;
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve('#667eea');
                return;
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                const colors: { [key: string]: number } = {};
                const sampleSize = 10;

                for (let i = 0; i < data.length; i += 4 * sampleSize) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const alpha = data[i + 3];

                    if (alpha < 128) continue;

                    const colorKey = `${Math.floor(r / 16) * 16},${Math.floor(g / 16) * 16},${Math.floor(b / 16) * 16}`;
                    colors[colorKey] = (colors[colorKey] || 0) + 1;
                }

                let dominantColor = '#667eea';
                let maxCount = 0;

                for (const [color, count] of Object.entries(colors)) {
                    if (count > maxCount) {
                        maxCount = count;
                        const [r, g, b] = color.split(',').map(Number);
                        dominantColor = `rgb(${r}, ${g}, ${b})`;
                    }
                }

                resolve(dominantColor);
            } catch (error) {
                resolve('#667eea');
            }
        };

        img.onerror = () => resolve('#667eea');
        img.src = imageSrc;
    });
};

export default function EventsHeader({ events }: EventsHeaderProps) {
    const [titleColor, setTitleColor] = useState('#1a1a1a');

    useEffect(() => {
        // Get the first event with a poster to set the overall theme
        const eventWithPoster = events.find(event => event.poster_img);

        if (eventWithPoster?.poster_img) {
            const posterUrl = getPosterUrl(eventWithPoster.poster_img);
            extractDominantColor(posterUrl).then(dominantColor => {
                // Create a darker version for the title
                const rgbMatch = dominantColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (rgbMatch) {
                    const [, r, g, b] = rgbMatch.map(Number);
                    // Make it darker for better readability
                    const darkerR = Math.max(0, r - 40);
                    const darkerG = Math.max(0, g - 40);
                    const darkerB = Math.max(0, b - 40);
                    setTitleColor(`rgb(${darkerR}, ${darkerG}, ${darkerB})`);
                }
            });
        }
    }, [events]);

    return (
        <div>
            <Title
                order={1}
                size="2.5rem"
                fw={700}
                mb="xs"
                style={{
                    color: titleColor,
                    transition: 'color 0.5s ease',
                }}
            >
                Events
            </Title>
            <Text size="lg" c="dimmed">
                Discover upcoming music events and performances
            </Text>
        </div>
    );
}
