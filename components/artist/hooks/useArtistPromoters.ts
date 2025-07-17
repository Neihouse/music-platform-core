"use client";

import { cancelJoinRequest } from "@/app/artist/actions";
import { AdministrativeArea, Country, Locality, Promoter, StoredLocality } from "@/utils/supabase/global.types";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

// Use database-first types as per TYPE_USAGE_GUIDE.md
type PromoterWithLocation = Pick<Promoter, 'id' | 'name' | 'bio' | 'avatar_img' | 'user_id'> & {
    avatarUrl?: string | null;
    localities?: Locality | null;
    administrative_areas?: AdministrativeArea | null;
    countries?: Country | null;
    storedLocality?: StoredLocality;
};

interface UseArtistPromotersProps {
    localityPromoters: PromoterWithLocation[];
    artistLocalityPromoters: PromoterWithLocation[];
    pendingRequests: Array<{
        id: string;
        invited_to_entity_id: string;
        invitee_entity_id: string;
        status: string;
    }>;
}

export function useArtistPromoters({
    localityPromoters,
    artistLocalityPromoters,
    pendingRequests
}: UseArtistPromotersProps) {
    const [filterByArtistLocality, setFilterByArtistLocality] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [joinModalOpened, setJoinModalOpened] = useState(false);
    const [selectedPromoter, setSelectedPromoter] = useState<PromoterWithLocation | null>(null);
    // State to manage pending requests locally to avoid page reloads
    const [localPendingRequests, setLocalPendingRequests] = useState(pendingRequests);

    // Determine which promoters to show based on the toggle
    const basePromoters = filterByArtistLocality ? artistLocalityPromoters : localityPromoters;

    // Filter by search term
    const filteredPromoters = basePromoters.filter(promoter =>
        promoter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promoter.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getLocationText(promoter).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getLocationText = (promoter: PromoterWithLocation) => {
        if (promoter.storedLocality) {
            return `${promoter.storedLocality.locality.name}, ${promoter.storedLocality.administrativeArea.name}, ${promoter.storedLocality.country.name}`;
        }
        if (promoter.localities?.name) return promoter.localities.name;
        if (promoter.administrative_areas?.name) return promoter.administrative_areas.name;
        if (promoter.countries?.name) return promoter.countries.name;
        return "Location not specified";
    };

    const handleJoinRequest = (promoter: PromoterWithLocation) => {
        setSelectedPromoter(promoter);
        setJoinModalOpened(true);
    };

    const handleCloseJoinModal = () => {
        setJoinModalOpened(false);
        setSelectedPromoter(null);
    };

    // Helper function to check if a promoter has a pending request
    const getPromoterRequestStatus = (promoterId: string) => {
        return localPendingRequests.find(request => request.invitee_entity_id === promoterId);
    };

    // Function to handle canceling a join request
    const handleCancelRequest = async (requestId: string) => {
        try {
            await cancelJoinRequest(requestId);
            // Update local state to remove the cancelled request
            setLocalPendingRequests(prev => prev.filter(request => request.id !== requestId));
            notifications.show({
                title: "Request cancelled",
                message: "Your join request has been cancelled.",
                color: "green",
            });
        } catch (error) {
            notifications.show({
                title: "Error",
                message: "Failed to cancel request",
                color: "red",
            });
        }
    };

    return {
        // State
        filterByArtistLocality,
        setFilterByArtistLocality,
        searchTerm,
        setSearchTerm,
        joinModalOpened,
        selectedPromoter,

        // Computed values
        filteredPromoters,

        // Functions
        getLocationText,
        handleJoinRequest,
        handleCloseJoinModal,
        getPromoterRequestStatus,
        handleCancelRequest,
    };
}

export type { PromoterWithLocation };
