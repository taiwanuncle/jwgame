import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AvatarIcon from "./AvatarIcon";
import type { ChatMessage } from "../hooks/useSocket";
import "./GlobalChat.css";

interface GlobalChatProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  myId?: string;
}

export default function GlobalChat({ messages, onSend, myId }: GlobalChatProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(messages.length);

  // Track unread messages when chat is closed
  useEffect(() => {
    if (!open && messages.length > prevCountRef.current) {
      const newCount = messages.length - prevCountRef.current;
      setUnread((u) => u + newCount);
    }
    prevCountRef.current = messages.length;
  }, [messages.length, open]);

  // Clear unread when opening
  useEffect(() => {
    if (open) {
      setUnread(0);
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [open]);

  // Scroll on new messages while open
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="global-chat">
      <AnimatePresence>
        {open && (
          <motion.div
            className="global-chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="global-chat-header">
              <span className="global-chat-title">💬 채팅</span>
              <button
                className="global-chat-close"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="global-chat-messages">
              {messages.length === 0 && (
                <div className="global-chat-empty">메시지가 없습니다</div>
              )}
              {messages.map((msg, i) => {
                const isMine = msg.playerId === myId;
                return (
                  <div
                    key={`${msg.timestamp}-${i}`}
                    className={`gchat-bubble ${isMine ? "gchat-bubble--mine" : "gchat-bubble--other"}`}
                  >
                    {!isMine && (
                      <div className="gchat-bubble-header">
                        <AvatarIcon index={msg.avatarIndex} size={16} />
                        <span className="gchat-bubble-name">
                          {msg.nickname}
                        </span>
                      </div>
                    )}
                    <span className="gchat-bubble-text">{msg.message}</span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="global-chat-input-bar">
              <input
                className="global-chat-input"
                placeholder="메시지 입력..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={100}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                autoFocus
              />
              <button
                className="global-chat-send"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                ↑
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`global-chat-fab ${open ? "global-chat-fab--active" : ""}`}
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.9 }}
      >
        {open ? "✕" : "💬"}
        {!open && unread > 0 && (
          <span className="global-chat-badge">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </motion.button>
    </div>
  );
}
