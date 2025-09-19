export default function RatingStars({ value=0, onRate }) {
  return (
    <div className="inline-flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          className={`px-2 py-1 rounded border ${n <= value ? 'bg-yellow-100' : ''}`}
          onClick={() => onRate?.(n)}
          title={`${n} star${n>1?'s':''}`}
        >
          {n}★
        </button>
      ))}
    </div>
  );
}
