import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import LoadingIndicator from "./LoadingIndicator.jsx";

export default function ChatWindow({ messages, isLoading, error }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      {messages.length === 0 && !isLoading && (
        <div className="chat-empty">
          Ask a doubt about DSA, DBMS, OOPs, OS or Aptitude — or tap a feature
          button below to generate a quiz, interview questions, or a simple
          explanation.
        </div>
      )}

      {messages.map((m, i) => (
        <MessageBubble key={i} role={m.role} content={m.content} feature={m.feature} />
      ))}

      {isLoading && messages[messages.length - 1]?.content === "" && <LoadingIndicator />}
      {error && <div className="error-banner">{error}</div>}

      <div ref={bottomRef} />
    </div>
  );
}
