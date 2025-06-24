import { ArtistForm } from "@/components/onboarding/ArtistForm";
import { ExternalLinksForm } from "@/components/onboarding/ExternalLinksForm";
import { getArtist, getArtistByName } from "@/db/queries/artists";
import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Container, Stack, Divider } from "@mantine/core";
import { updateExternalLinks } from "../actions";
import { urlToName } from "@/lib/utils";


export default async function ArtistEditPage({
    params,
}: {
    params: Promise<{ artistName: string }>;
}) {
    const { artistName } = await params;
    const decodedArtistName = urlToName(artistName);
    const supabase = await createClient();
    const user = await getUser(supabase);
    const artist = await getArtistByName(supabase, decodedArtistName);

    const userIsArtist = user?.id === artist?.user_id;

    if (!userIsArtist || !artist) {
        redirect("/artists");
    }

    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                <ArtistForm artist={artist} />
                <Divider />
                <ExternalLinksForm 
                    initialLinks={artist.external_links || []}
                />
            </Stack>
        </Container>
    );
}