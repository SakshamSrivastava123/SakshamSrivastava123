import { useState } from "react";
import ChatWindow from "./components/ChatWindow.jsx";
import InputBox from "./components/InputBox.jsx";
import FeatureButtons from "./components/FeatureButtons.jsx";
import { useChat } from "./hooks/useChat.js";
import "./styles/App.css";

export default function App() {
  const { messages, isLoading, error, sendQuestion, runQuiz, runInterview } = useChat();
  // null = plain chat; "beginner" = simple-explain chat mode; "quiz" / "interview" = next
  // message is treated as a topic for that feature.
  const [activeMode, setActiveMode] = useState(null);

  const handleFeatureSelect = (id) => {
    setActiveMode((current) => (current === id ? null : id));
  };

  const handleSend = (text) => {
    if (activeMode === "quiz") {
      runQuiz(text);
    } else if (activeMode === "interview") {
      runInterview(text);
    } else {
      sendQuestion(text, activeMode === "beginner" ? "beginner" : "beginner");
    }
    // reset one-shot feature modes after firing; keep "beginner" sticky
    if (activeMode === "quiz" || activeMode === "interview") {
      setActiveMode(null);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>StudyMate</h1>
        <span className="tagline">AI study & placement prep</span>
      </header>

      <FeatureButtons activeMode={activeMode} onSelect={handleFeatureSelect} disabled={isLoading} />

      <ChatWindow messages={messages} isLoading={isLoading} error={error} />

      <InputBox
        onSend={handleSend}
        disabled={isLoading}
        placeholderHint={
          activeMode === "quiz"
            ? "Type a topic to quiz on, e.g. 'Binary Search Trees'"
            : activeMode === "interview"
            ? "Type a topic for interview questions, e.g. 'Process Scheduling'"
            : undefined
        }
      />
    </div>
  );
}
