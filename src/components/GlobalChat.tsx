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
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when expanding
  useEffect(() => {
    if (expanded) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [expanded]);

  // Toggle body class for other fixed elements to react
  useEffect(() => {
    document.body.classList.toggle("gchat-is-expanded", expanded);
    return () => document.body.classList.remove("gchat-is-expanded");
  }, [expanded]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
    inputRef.current?.focus();
  };

  // Last message preview for collapsed bar
  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;

  return (
    <div className={`global-chat-bar ${expanded ? "global-chat-bar--expanded" : ""}`}>
      {/* Collapsed: single-line preview + input */}
      {!expanded && (
        <div className="gchat-collapsed">
          <div className="gchat-preview" onClick={() => setExpanded(true)}>
            {lastMsg ? (
              <span className="gchat-preview-text">
                <strong>{lastMsg.playerId === myId ? "나" : lastMsg.nickname}</strong>: {lastMsg.message}
              </span>
            ) : (
              <span className="gchat-preview-empty">💬 채팅</span>
            )}
          </div>
          <div className="gchat-input-row">
            <input
              className="gchat-input"
              placeholder="메시지 입력..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={100}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              onFocus={() => setExpanded(true)}
            />
            <button
              className="gchat-send"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Expanded: messages + input */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="gchat-expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          >
            <div className="gchat-expanded-header">
              <span className="gchat-expanded-title">💬 채팅</span>
              <button
                className="gchat-collapse-btn"
                onClick={() => setExpanded(false)}
              >
                ▼
              </button>
            </div>
            <div className="gchat-messages">
              {messages.length === 0 && (
                <div className="gchat-empty">메시지가 없습니다</div>
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
                        <span className="gchat-bubble-name">{msg.nickname}</span>
                      </div>
                    )}
                    <span className="gchat-bubble-text">{msg.message}</span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="gchat-input-row">
              <input
                ref={inputRef}
                className="gchat-input"
                placeholder="메시지 입력..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={100}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="gchat-send"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                ↑
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
