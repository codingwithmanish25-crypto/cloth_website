export default function BlinkLoader({ label = "Loading...", className = "" }) {
  return (
    <div
      className={`blink-loader ${className}`}
      role="status"
      aria-label={label}
    >
      <span className="blink-loader__buffer" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            className="blink-loader__dot"
            style={{ "--dot-index": index }}
          />
        ))}
      </span>
      <span>{label}</span>
    </div>
  );
}
