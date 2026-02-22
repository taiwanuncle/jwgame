import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import AvatarIcon from "./AvatarIcon";
import type { ChatMessage } from "../hooks/useSocket";
import "./GlobalChat.css";

interface GlobalChatProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  myId?: string;
}

const MIN_MSG_HEIGHT = 120;
const MAX_MSG_HEIGHT = 500;
const DEFAULT_MSG_HEIGHT = 250;
const DEFAULT_MSG_HEIGHT_MOBILE = 200;

function getDefaultHeight() {
  return window.innerWidth <= 480 ? DEFAULT_MSG_HEIGHT_MOBILE : DEFAULT_MSG_HEIGHT;
}

export default function GlobalChat({ messages, onSend, myId }: GlobalChatProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [msgHeight, setMsgHeight] = useState(getDefaultHeight);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);

  // Auto-scroll on new messages (only when expanded & ref is mounted)
  useEffect(() => {
    if (expanded) {
      // Use setTimeout to ensure the DOM has rendered the new message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [messages, expanded]);

  // Focus input and scroll to bottom when expanding
  useEffect(() => {
    if (expanded) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 200);
    }
  }, [expanded]);

  // Set CSS variable for chat bar height so FAB can follow
  const updateBarHeight = useCallback(() => {
    if (barRef.current) {
      const h = barRef.current.offsetHeight;
      document.documentElement.style.setProperty("--gchat-bar-h", `${h}px`);
    }
  }, []);

  useEffect(() => {
    // Update height after render/animation
    updateBarHeight();
    const timer = setTimeout(updateBarHeight, 350);
    return () => clearTimeout(timer);
  }, [expanded, messages.length, updateBarHeight, msgHeight]);

  // Toggle body class
  useEffect(() => {
    document.body.classList.toggle("gchat-is-expanded", expanded);
    return () => document.body.classList.remove("gchat-is-expanded");
  }, [expanded]);

  // Drag handlers for resize handle
  const handleDragStart = useCallback((clientY: number) => {
    isDragging.current = true;
    dragStartY.current = clientY;
    dragStartHeight.current = msgHeight;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "ns-resize";
  }, [msgHeight]);

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging.current) return;
    // Dragging up = increasing height (startY - currentY is positive when moving up)
    const delta = dragStartY.current - clientY;
    const newHeight = Math.min(MAX_MSG_HEIGHT, Math.max(MIN_MSG_HEIGHT, dragStartHeight.current + delta));
    setMsgHeight(newHeight);
  }, []);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, []);

  // Mouse events
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientY);
  }, [handleDragStart]);

  // Touch events
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  }, [handleDragStart]);

  // Global move/end listeners
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const onTouchMove = (e: TouchEvent) => handleDragMove(e.touches[0].clientY);
    const onEnd = () => handleDragEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
    inputRef.current?.focus();
  };

  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;

  return (
    <div
      ref={barRef}
      className={`global-chat-bar ${expanded ? "global-chat-bar--expanded" : ""}`}
    >
      {/* Collapsed: single-line preview + input */}
      {!expanded && (
        <div className="gchat-collapsed">
          <div className="gchat-preview" onClick={() => setExpanded(true)}>
            {lastMsg ? (
              <span className="gchat-preview-text">
                <strong>{lastMsg.playerId === myId ? t("chat.me") : lastMsg.nickname}</strong>: {lastMsg.message}
              </span>
            ) : (
              <span className="gchat-preview-empty">💬 {t("chat.title")}</span>
            )}
          </div>
          <div className="gchat-input-row">
            <input
              className="gchat-input"
              placeholder={t("chat.inputPlaceholder")}
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
            onAnimationComplete={updateBarHeight}
          >
            {/* Drag handle for resizing */}
            <div
              className="gchat-resize-handle"
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
            >
              <div className="gchat-resize-bar" />
            </div>

            <div className="gchat-expanded-header">
              <span className="gchat-expanded-title">💬 {t("chat.title")}</span>
              <button
                className="gchat-collapse-btn"
                onClick={() => setExpanded(false)}
              >
                ▼
              </button>
            </div>
            <div
              className="gchat-messages"
              style={{ height: msgHeight }}
            >
              {messages.length === 0 && (
                <div className="gchat-empty">{t("chat.empty")}</div>
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
                placeholder={t("chat.inputPlaceholder")}
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
