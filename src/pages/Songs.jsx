import { useEffect, useState } from 'react';
import { fetchSongs, rateSong } from '../services/api';
import RatingStars from '../components/RatingStars';
import Filters from '../components/Filters';

const DEMO_USER_ID = 1; // swap with real auth later

export default function SongsPage() {
  const [filters, setFilters] = useState({});
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setSongs(await fetchSongs({ ...filters, limit: 50 })); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);           // initial
  useEffect(() => { load(); }, [JSON.stringify(filters)]); // refetch on filter change

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-3">Songs</h1>
      <Filters value={filters} onChange={setFilters} />
      {loading && <div>Loading…</div>}
      <div className="grid gap-3">
        {songs.map(s => {
          const id = s.ID ?? s.id;
          const title = s.TITLE ?? s.title;
          const artist = s.ARTIST ?? s.artist;
          const avg = Number(s.RATING_AVG ?? s.rating_avg ?? 0);
          return (
            <div key={id} className="p-4 rounded border">
              <div className="font-semibold">{title} — {artist}</div>
              <div className="text-sm opacity-70 mb-2">Avg ★ {avg.toFixed(2)}</div>
              <RatingStars value={Math.round(avg)} onRate={async (n) => {
                await rateSong(DEMO_USER_ID, id, n); await load();
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
