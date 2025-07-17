"use client";

import { acceptArtistRequest, declineArtistRequest } from "@/app/promoter/actions";
import { Button, Group } from "@mantine/core";
import { useState } from "react";

interface RequestActionsProps {
    requestId: string;
}

export function RequestActions({ requestId }: RequestActionsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAccept = async () => {
        setIsLoading(true);
        try {
            const result = await acceptArtistRequest(requestId);
            if (!result.success) {
                console.error("Failed to accept request:", result.error);
            }
        } catch (error) {
            console.error("Error accepting request:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDecline = async () => {
        setIsLoading(true);
        try {
            const result = await declineArtistRequest(requestId);
            if (!result.success) {
                console.error("Failed to decline request:", result.error);
            }
        } catch (error) {
            console.error("Error declining request:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Group gap="xs">
            <Button
                size="xs"
                variant="light"
                color="green"
                loading={isLoading}
                onClick={handleAccept}
            >
                Accept
            </Button>
            <Button
                size="xs"
                variant="light"
                color="red"
                loading={isLoading}
                onClick={handleDecline}
            >
                Decline
            </Button>
        </Group>
    );
}
