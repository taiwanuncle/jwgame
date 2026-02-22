import type { BibleCharacter } from "../data/characters";

/** Normalize i18n.language to our known codes */
export function normalizeLang(lang: string): string {
  if (!lang) return "ko";
  const known = ["ko", "en", "zh", "zh-TW", "my", "th"];
  if (known.includes(lang)) return lang;
  if (lang.startsWith("zh-Hant") || lang.startsWith("zh-TW")) return "zh-TW";
  if (lang.startsWith("zh")) return "zh";
  const base = lang.split("-")[0];
  if (known.includes(base)) return base;
  return "ko";
}

/** Determine which names to show on card based on current language */
export function getCardNames(character: BibleCharacter, lang: string) {
  const resolved = normalizeLang(lang);

  const nameMap: Record<string, string> = {
    ko: character.nameKo,
    en: character.nameEn,
    zh: character.nameZh,
    "zh-TW": character.nameZhTw,
    my: character.nameMy,
    th: character.nameTh,
  };

  const primaryName = nameMap[resolved] || character.nameKo;

  const isKoPrimary = primaryName === character.nameKo;
  const isEnPrimary = primaryName === character.nameEn;

  let secondaryNames: string[];
  if (isKoPrimary) {
    secondaryNames = [character.nameEn, character.nameZh];
  } else if (isEnPrimary) {
    secondaryNames = [character.nameKo, character.nameZh];
  } else {
    secondaryNames = [character.nameKo, character.nameEn];
  }

  secondaryNames = secondaryNames.filter((n) => n !== primaryName);

  return { primaryName, secondaryNames };
}
