export default function Stars({ value, onRate }) {
  return (
    <span className="stars" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={n <= value ? 'star on' : 'star'}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onClick={() => onRate(n)}
        >
          ★
        </button>
      ))}
    </span>
  );
}
