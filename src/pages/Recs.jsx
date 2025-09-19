import { useEffect, useState } from 'react';
import { fetchRecs, getContext, setContext, fetchActs, fetchMoods } from '../services/api';

const DEMO_USER_ID = 1;

export default function RecsPage() {
  const [recs, setRecs] = useState([]);
  const [ctx, setCtx] = useState({});
  const [moods, setMoods] = useState([]);
  const [acts, setActs] = useState([]);

  useEffect(() => { (async () => {
    setMoods(await fetchMoods()); setActs(await fetchActs());
    setCtx((await getContext(DEMO_USER_ID)) || {});
    setRecs(await fetchRecs(DEMO_USER_ID, 20));
  })(); }, []);

  const saveCtx = async (patch) => {
    const next = { ...ctx, ...patch };
    setCtx(next);
    await setContext(DEMO_USER_ID, next.mood_code || next.moodCode, next.activity_id || next.activityId);
    setRecs(await fetchRecs(DEMO_USER_ID, 20));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-3">Recommendations</h1>

      <div className="flex gap-3 mb-4">
        <select className="border rounded px-2 py-1"
                value={ctx.mood_code || ctx.moodCode || ''}
                onChange={e => saveCtx({ mood_code: e.target.value || null, moodCode: e.target.value || null })}>
          <option value="">Mood: Any</option>
          {moods.map(m => <option key={m.ID ?? m.id} value={(m.CODE ?? m.code)}>
            {m.DISPLAY_NAME ?? m.display_name}
          </option>)}
        </select>

        <select className="border rounded px-2 py-1"
                value={ctx.activity_id || ''}
                onChange={e => saveCtx({ activity_id: e.target.value || null, activityId: e.target.value || null })}>
          <option value="">Activity: Any</option>
          {acts.map(a => <option key={a.ID ?? a.id} value={a.ID ?? a.id}>{a.NAME ?? a.name}</option>)}
        </select>
      </div>

      <div className="grid gap-3">
        {recs.map(r => (
          <div key={r.ID ?? r.id} className="p-4 rounded border">
            <div className="font-semibold">{(r.TITLE ?? r.title)} — {(r.ARTIST ?? r.artist)}</div>
            <div className="text-sm opacity-70">Avg ★ {Number(r.RATING_AVG ?? r.rating_avg ?? 0).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
