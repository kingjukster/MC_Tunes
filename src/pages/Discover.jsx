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
    <div>
      <h1>Discover</h1>
      <label>
        Mood:&nbsp;
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">All</option>
          <option value="happy">Happy</option>
          <option value="calm">Calm</option>
          <option value="sad">Sad</option>
          <option value="energetic">Energetic</option>
        </select>
      </label>

      {loading ? <p>Loading…</p> : (
        <ul>
          {recs.map((r) => (
            <li key={r.trackId} style={{ margin: "12px 0" }}>
              <div><strong>{r.title}</strong> — {r.artist}</div>
              {r.explanation && <div style={{ fontStyle: "italic" }}>{r.explanation}</div>}
              <div>
                Rate:&nbsp;
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => rateTrack(r.trackId, n)} aria-label={`Rate ${n}`}>
                    {n}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
