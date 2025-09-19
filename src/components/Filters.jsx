import { useEffect, useState } from 'react';
import { fetchGenres, fetchMoods } from '../services/api';

export default function Filters({ value, onChange }) {
  const [genres, setGenres] = useState([]);
  const [moods, setMoods] = useState([]);

  useEffect(() => { (async () => {
    setGenres(await fetchGenres()); setMoods(await fetchMoods());
  })(); }, []);

  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="flex flex-wrap gap-3 items-end mb-4">
      <div>
        <label className="block text-sm">Search</label>
        <input className="border rounded px-2 py-1"
               value={value.q || ''} onChange={e => set({ q: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm">Genre</label>
        <select className="border rounded px-2 py-1"
                value={value.genreId || ''} onChange={e => set({ genreId: e.target.value || undefined })}>
          <option value="">Any</option>
          {genres.map(g => <option key={g.ID ?? g.id} value={g.ID ?? g.id}>{g.NAME ?? g.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm">Mood</label>
        <select className="border rounded px-2 py-1"
                value={value.moodCode || ''} onChange={e => set({ moodCode: e.target.value || undefined })}>
          <option value="">Any</option>
          {moods.map(m => <option key={m.ID ?? m.id} value={(m.CODE ?? m.code)}>{m.DISPLAY_NAME ?? m.display_name}</option>)}
        </select>
      </div>
      <button className="border px-3 py-1 rounded" onClick={() => onChange({})}>Clear</button>
    </div>
  );
}
