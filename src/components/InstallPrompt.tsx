import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import "./InstallPrompt.css";

const DISMISS_KEY = "pwa_install_dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if ((navigator as any).standalone === true) return; // iOS Safari standalone

    // Check if dismissed
    try {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt) {
        const elapsed = Date.now() - parseInt(dismissedAt, 10);
        if (elapsed < DISMISS_DURATION) return;
      }
    } catch { /* ignore */ }

    const ua = navigator.userAgent;
    const isiOS = /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream;

    if (isiOS) {
      // iOS Safari — no beforeinstallprompt, show manual instruction
      const isSafari = /safari/i.test(ua) && !/crios|fxios|opios|edgios/i.test(ua);
      if (isSafari || /safari/i.test(ua)) {
        setIsIOS(true);
        // Delay showing to not overwhelm on first visit
        const timer = setTimeout(() => setShow(true), 3000);
        return () => clearTimeout(timer);
      }
    } else {
      // Android / Desktop: listen for beforeinstallprompt
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setTimeout(() => setShow(true), 2000);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        setShow(false);
      }
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(DISMISS_KEY, Date.now().toString());
      } catch { /* ignore */ }
    }
    setShow(false);
  }, [dontShowAgain]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="install-prompt-banner"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="install-prompt-content">
            <div className="install-prompt-icon">📲</div>
            <div className="install-prompt-text">
              <p className="install-prompt-title">{t("pwa.title")}</p>
              {isIOS ? (
                <p className="install-prompt-desc">
                  {t("pwa.iosDesc")}
                </p>
              ) : (
                <p className="install-prompt-desc">
                  {t("pwa.androidDesc")}
                </p>
              )}
            </div>
          </div>

          <div className="install-prompt-actions">
            {!isIOS && deferredPrompt && (
              <button
                className="btn-primary install-prompt-install-btn"
                onClick={handleInstall}
              >
                {t("pwa.install")}
              </button>
            )}
            <div className="install-prompt-bottom">
              <label className="install-prompt-checkbox">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                />
                <span>{t("pwa.dontShowAgain")}</span>
              </label>
              <button className="btn-ghost install-prompt-close" onClick={handleDismiss}>
                {t("pwa.close")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
