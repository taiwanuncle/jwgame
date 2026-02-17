import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage } from "../hooks/useSocket";
import "./ChatOverlay.css";

interface ChatOverlayProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  myId?: string;
}

export default function ChatOverlay({
  messages,
  onSend,
  myId,
}: ChatOverlayProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="chat-overlay">
      <div className="chat-messages">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMine = msg.playerId === myId;
            return (
              <motion.div
                key={`${msg.timestamp}-${i}`}
                className={`chat-bubble ${isMine ? "chat-bubble--mine" : "chat-bubble--other"}`}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {!isMine && (
                  <span className="chat-bubble-name">{msg.nickname}</span>
                )}
                <span className="chat-bubble-text">{msg.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-bar">
        <input
          className="chat-input"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={100}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          전송
        </button>
      </div>
    </div>
  );
}
