import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "./ko";
import en from "./en";
import zh from "./zh";
import my from "./my";
import zhTw from "./zhTw";
import th from "./th";

// Restore saved language preference
const savedLng = (() => {
  try { return localStorage.getItem("app_lang") || "ko"; } catch { return "ko"; }
})();

i18n.use(initReactI18next).init({
  resources: {
    ko,
    en,
    zh,
    "zh-TW": zhTw,
    my,
    th,
  },
  lng: savedLng,
  fallbackLng: "ko",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
