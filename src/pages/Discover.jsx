import { useEffect, useState } from "react";
import { fetchRecommendations, rateTrack } from "../services/recommendations.js";
import { useAppStore } from "../app/store.js";

export default function Discover() {
  const { mood, setMood } = useAppStore();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchRecommendations({ mood: mood || undefined, k: 10 });
        setRecs(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    })();
  }, [mood]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="emo-card w-full max-w-2xl">
        <h1 className="text-4xl font-emo text-blood emo-glitch mb-4">Discover</h1>
        <label className="block mb-4">
          <span className="mr-2">Mood:</span>
          <select value={mood} onChange={(e) => setMood(e.target.value)} className="bg-ash text-pale rounded px-2 py-1 focus:outline-none">
            <option value="">All</option>
            <option value="happy">Happy</option>
            <option value="calm">Calm</option>
            <option value="sad">Sad</option>
            <option value="energetic">Energetic</option>
          </select>
        </label>

        {loading ? <p className="text-pale">Loading…</p> : (
          <ul>
            {recs.map((r) => (
              <li key={r.trackId} className="mb-6 p-4 rounded bg-jet bg-opacity-80 shadow emo-border">
                <div className="font-emo text-xl text-violet mb-1">{r.title}</div>
                <div className="text-pale mb-1">{r.artist}</div>
                {r.explanation && <div className="italic text-sm text-gray-400 mb-2">{r.explanation}</div>}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Rate:</span>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => rateTrack(r.trackId, n)} aria-label={`Rate ${n}`} className="px-2 py-1 rounded bg-ash text-pale hover:bg-blood hover:text-white transition-colors">
                      {n}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
