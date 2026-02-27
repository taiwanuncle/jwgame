import adjectives from "../data/adjectives";
import characters from "../data/characters";
import { AVATAR_COUNT } from "../components/AvatarIcon";

const MAX_NICKNAME_LENGTH = 16;

/** Normalize i18n language code to adjectives key */
function toLangKey(lang: string): string {
  const l = lang.toLowerCase().replace("-", "");
  if (l.startsWith("zhtw") || l.startsWith("zhhant")) return "zhTw";
  if (l.startsWith("zh")) return "zh";
  if (l.startsWith("ko")) return "ko";
  if (l.startsWith("en")) return "en";
  if (l.startsWith("my")) return "my";
  if (l.startsWith("th")) return "th";
  return "en"; // fallback
}

/** Strip parenthesized disambiguation, e.g. "마리아 (마르다의 동생)" → "마리아" */
function stripParens(name: string): string {
  return name.replace(/\s*\(.*\)$/, "").trim();
}

/** Get character name in the given language (without parenthesized notes) */
function getCharName(char: (typeof characters)[0], langKey: string): string {
  let name: string;
  switch (langKey) {
    case "ko": name = char.nameKo; break;
    case "en": name = char.nameEn; break;
    case "zh": name = char.nameZh; break;
    case "zhTw": name = char.nameZhTw; break;
    case "my": name = char.nameMy; break;
    case "th": name = char.nameTh; break;
    default: name = char.nameEn;
  }
  return stripParens(name);
}

/** Pick a random element from an array */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate a random avatar index + nickname (adjective + Bible character name) */
export function generateRandomName(lang: string): {
  avatarIndex: number;
  nickname: string;
} {
  const langKey = toLangKey(lang);
  const adjs = adjectives[langKey] || adjectives.en;

  const adj = pickRandom(adjs);
  const char = pickRandom(characters);
  const name = getCharName(char, langKey);

  // Chinese: no space between adjective and name
  const separator = langKey === "zh" || langKey === "zhTw" ? "" : " ";
  let nickname = `${adj}${separator}${name}`;

  // Truncate if too long
  if (nickname.length > MAX_NICKNAME_LENGTH) {
    nickname = nickname.slice(0, MAX_NICKNAME_LENGTH);
  }

  return {
    avatarIndex: Math.floor(Math.random() * AVATAR_COUNT),
    nickname,
  };
}
