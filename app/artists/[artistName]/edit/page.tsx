import { ArtistForm } from "@/components/onboarding/ArtistForm";
import { getArtist, getArtistByName } from "@/db/queries/artists";
import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export default async function ArtistEditPage({
    params,
}: {
    params: { artistName: string };
}) {
    const supabase = await createClient();
    const user = await getUser(supabase);
    const artist = await getArtist(supabase);

    const userIsArtist = user?.id === artist?.user_id;

    if (!userIsArtist || !artist) {
        redirect("/artists");
    }

    return (
        <div>
            <h1>Edit Artist</h1>
            <ArtistForm artist={artist} />
        </div>
    );
}