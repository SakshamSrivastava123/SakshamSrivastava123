const FEATURES = [
  { id: "quiz", label: "📝 Quiz me" },
  { id: "interview", label: "🎯 Interview questions" },
  { id: "beginner", label: "💡 Explain simply" },
];

export default function FeatureButtons({ activeMode, onSelect, disabled }) {
  return (
    <div className="feature-bar" role="group" aria-label="Study features">
      {FEATURES.map((f) => (
        <button
          key={f.id}
          className={`feature-btn ${activeMode === f.id ? "active" : ""}`}
          onClick={() => onSelect(f.id)}
          disabled={disabled}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
