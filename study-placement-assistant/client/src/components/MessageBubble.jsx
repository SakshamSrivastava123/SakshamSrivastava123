export default function MessageBubble({ role, content, feature }) {
  const showTag = role === "assistant" && feature && feature !== "chat";

  return (
    <div className={`msg-row ${role}`}>
      <div className={`msg-bubble ${role}`}>
        {showTag && <span className="feature-tag">{feature}</span>}
        {content || "\u00A0"}
      </div>
    </div>
  );
}
