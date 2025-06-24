import { createClient } from "@/utils/supabase/server";
import { getAllVenues } from "@/db/queries/venues";
import { nameToUrl } from "@/lib/utils";
import Link from "next/link";

export default async function VenuesListPage() {
  const supabase = await createClient();
  
  try {
    const venues = await getAllVenues(supabase);
    
    return (
      <div style={{ padding: "2rem" }}>
        <h1>All Venues (Debug Page)</h1>
        
        {venues.length === 0 ? (
          <div>
            <p>No venues found in the database.</p>
            <Link href="/venues/create">
              <button style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
                Create a Venue
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <p>Found {venues.length} venue(s):</p>
            <ul>
              {venues.map((venue) => (
                <li key={venue.id} style={{ marginBottom: "0.5rem" }}>
                  <Link href={`/venues/${nameToUrl(venue.name)}`}>
                    {venue.name}
                  </Link>
                  <small style={{ marginLeft: "1rem", color: "#666" }}>
                    (ID: {venue.id})
                  </small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Error</h1>
        <p>Error loading venues: {String(error)}</p>
      </div>
    );
  }
}
