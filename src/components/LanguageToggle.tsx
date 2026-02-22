import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import "./LanguageToggle.css";

const LANGUAGES = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
  { code: "zh", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "my", label: "မြန်မာ" },
  { code: "th", label: "ไทย" },
] as const;

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    try { localStorage.setItem("app_lang", code); } catch { /* */ }
    setOpen(false);
  };

  return (
    <>
      <button className="lang-toggle-fab" onClick={() => setOpen(!open)}>
        🌐
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="lang-toggle-backdrop" onClick={() => setOpen(false)} />
            <motion.div
              className="lang-toggle-dropdown"
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-toggle-item ${i18n.language === lang.code ? "lang-toggle-item--active" : ""}`}
                  onClick={() => handleSelect(lang.code)}
                >
                  {lang.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
