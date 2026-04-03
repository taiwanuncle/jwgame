/**
 * Post-process WOL NWT lookup results and generate updated characters.ts
 *
 * 1. Clean up book names, numbered suffixes
 * 2. Apply manual fixes for missing/wrong entries
 * 3. Merge existing my/th names for id 1-128
 * 4. Add my/th names for new 40 characters (129-168)
 * 5. Output new characters.ts content
 */

import { readFileSync, writeFileSync } from 'fs';

const nwtData = JSON.parse(readFileSync('scripts/nwt-v2-all.json', 'utf-8'));
const existing = JSON.parse(readFileSync('scripts/existing-chars.json', 'utf-8'));

// ── Clean up helpers ──

function cleanName(name) {
  if (!name) return null;
  // Remove "Book of" / "Letter to" patterns
  name = name.replace(/,\s*Book of$/i, '');
  name = name.replace(/,?\s*Letter to$/i, '');
  // Remove ", I", ", II", ", 1", ", 2" suffixes
  name = name.replace(/,\s*[IV]+$/i, '').replace(/,\s*\d+$/i, '');
  // Remove "서" suffix for Korean book names (이사야서→이사야, 요엘서→요엘)
  name = name.replace(/서$/, '');
  // Remove Chinese book markers: 福音, 书, 書, 记, 記
  name = name.replace(/福音$/, '').replace(/书$/, '').replace(/書$/, '');
  name = name.replace(/记$/, '').replace(/記$/, '');
  // Remove numbered Chinese suffixes like "1", "2"
  name = name.replace(/\d+$/, '');
  // Clean up " Good News According to" pattern
  name = name.replace(/,?\s*Good News According to$/i, '');
  return name.trim() || null;
}

// ── Manual overrides for entries that WOL couldn't resolve ──
// Based on 신세계역(연구용) / New World Translation (Study Edition)

const MANUAL = {
  // ── Prevent cleanName 서→에 bug (에서=Esau, not 에+서) ──
  15: { ko: "에서" },

  // ── Book article returned: 기/记 suffix not handled by cleanName ──
  24: { ko: "욥" },       // 욥기→욥
  91: { ko: "에스더" },   // 에스더기→에스더

  // ── Gospel/Letter title returned instead of person name ──
  96: { en: "Jesus", ko: "예수", zh: "耶稣", zhTw: "耶穌" },  // "Jesus Christ"
  106: { en: "Matthew", ko: "마태", zh: "马太", zhTw: "馬太" },  // "Good News According to"
  159: { en: "Mark", ko: "마가", zh: "马可", zhTw: "馬可" },
  165: { en: "Philemon", ko: "빌레몬", zh: "腓利门", zhTw: "腓利門" },

  // ── NWT returned completely wrong person ──
  29: { en: "Paul's Nephew", ko: "바울의 조카", zh: "保罗的外甥", zhTw: "保羅的外甥" },  // "Claudius Lysias"
  58: { en: "Queen of Sheba", ko: "시바 여왕", zh: "示巴女王", zhTw: "示巴女王" },  // "Sheba" (place)
  83: { en: "Israelite Girl", ko: "이스라엘 소녀", zh: "以色列少女", zhTw: "以色列少女" },  // "Harlot"
  98: { en: "Joseph" },    // "Genealogy of Jesus Christ"
  103: { en: "John" },     // "Apostle"
  119: { en: "Pontius Pilate" },  // "Herod"
  124: { en: "Philip" },   // "Chariot"
  142: { en: "Shunammite Woman", ko: "수넴 여인", zh: "书念妇人", zhTw: "書念婦人" },  // "Gehazi"
  158: { en: "Pilate's Wife", ko: "빌라도의 아내", zh: "彼拉多的妻子", zhTw: "彼拉多的妻子" },  // "Pilate"

  // ── NWT returned incomplete/ambiguous compound name ──
  73: { en: "Shadrach, Meshach, Abednego", ko: "사드락 메삭 아벳느고", zh: "沙得拉、米煞、亚伯尼歌", zhTw: "沙得拉、米煞、亞伯尼歌" },
  99: { en: "John the Baptist", ko: "침례자 요한", zh: "施浸者约翰", zhTw: "施浸者約翰" },
  105: { en: "Herod Antipas", ko: "헤롯 안티파스", zh: "希律安提帕", zhTw: "希律安提帕" },
  111: { en: "Judas Iscariot", ko: "유다 이스가리옷", zh: "加略人犹大", zhTw: "加略人猶大" },
  112: { en: "Mary Magdalene", ko: "막달라 마리아", zh: "抹大拉的马利亚", zhTw: "抹大拉的馬利亞" },
  127: { en: "Priscilla and Aquila", ko: "브리스길라와 아굴라", zh: "百基拉和亚居拉", zhTw: "百基拉和亞居拉" },

  // ── Disambiguation needed (multiple same-name characters) ──
  118: { en: "Herod the Great", ko: "헤롯 대왕", zh: "大希律", zhTw: "大希律" },  // 3 Herods in game

  // ── New characters (129-168) missing data (no existing fallback) ──
  160: { zh: "雅各", zhTw: "雅各" },  // NWT has en/ko but no zh/zhTw
  164: { en: "Herod Agrippa", ko: "헤롯 아그립바", zh: "希律亚基帕", zhTw: "希律亞基帕" },  // "Herod" only
};

// ── Myanmar/Thai names for new 40 characters (129-168) ──

const NEW_MY_TH = {
  129: { my: "မသုရှလ", th: "เมธูเซลาห์" },
  130: { my: "ယာဖက", th: "ยาเฟท" },
  131: { my: "မယ်လခိဇေဒက", th: "เมลคีเซเดค" },
  132: { my: "ဇိပ္ပိုရ", th: "ศิปโปราห์" },
  133: { my: "ဖိနဟတ", th: "ฟีเนหัส" },
  134: { my: "အာခန", th: "อาคาน" },
  135: { my: "အဗိမလက", th: "อะบีเมเลค" },
  136: { my: "ဒလိလ", th: "เดลีลาห์" },
  137: { my: "ယေရှဲ", th: "เจสซี" },
  138: { my: "ဥရိယ", th: "อูรียาห์" },
  139: { my: "မေဖိဗောရှက", th: "เมฟีโบเชท" },
  140: { my: "ယွာဘ", th: "โยอาบ" },
  141: { my: "အဟိသောဖလ", th: "อะหิโธเฟล" },
  142: { my: "ရှုနင်အမျိုးသမီး", th: "หญิงชาวชูเนม" },
  143: { my: "ယေဟု", th: "เยฮู" },
  144: { my: "အာသလိ", th: "อาธาลิยาห์" },
  145: { my: "ယဟောယဒ", th: "เยโฮยาดา" },
  146: { my: "ယွာရှ", th: "โยอาช" },
  147: { my: "မနာရှေ", th: "มนัสเสห์" },
  148: { my: "ယွေလ", th: "โยเอล" },
  149: { my: "နာဟုံ", th: "นาฮูม" },
  150: { my: "ဇေရုဗ္ဗေလ", th: "เศรุบบาเบล" },
  151: { my: "ဟဂ္ဂဲ", th: "ฮักกัย" },
  152: { my: "ဧလိဇဗက", th: "เอลีซาเบท" },
  153: { my: "အန္နာ", th: "อันนา" },
  154: { my: "ရှိမောင", th: "สิเมโอน" },
  155: { my: "အန္ဒြေ", th: "อันดรูว์" },
  156: { my: "ယာဣရု", th: "ไยรัส" },
  157: { my: "ဩရပ", th: "โอรปาห์" },
  158: { my: "ပိလတ၏ဇနီး", th: "ภรรยาปีลาต" },
  159: { my: "မာကု", th: "มาระโก" },
  160: { my: "ယာကုပ(ယေရှု၏ညီ)", th: "ยากอบ(น้องชายพระเยซู)" },
  161: { my: "အာနနိ", th: "อานาเนีย" },
  162: { my: "သပ္ဖိရ", th: "สัปฟีรา" },
  163: { my: "ဂမလျေလ", th: "กามาลิเอล" },
  164: { my: "ဟေရုဒ်အဂြိပ္ပ", th: "เฮโรดอากริปปา" },
  165: { my: "ဖိလေမုန", th: "ฟีเลโมน" },
  166: { my: "ဩနေသိမု", th: "โอเนซิมัส" },
  167: { my: "တိတု", th: "ทิตัส" },
  168: { my: "ဧပဖရ", th: "เอปาฟรัส" },
};

// ── Image path mapping ──

const IMAGE_PATHS = {};
// Existing 128 characters - extract from current characters.ts
const charContent = readFileSync('src/data/characters.ts', 'utf-8');
const imgRegex = /id:\s*(\d+),.*?image:\s*"([^"]*)"/g;
let im;
while ((im = imgRegex.exec(charContent)) !== null) {
  IMAGE_PATHS[parseInt(im[1])] = im[2];
}

// New 40 characters - map from the files
import { readdirSync } from 'fs';
const cardFiles = readdirSync('public/cards');
for (let id = 129; id <= 168; id++) {
  const file = cardFiles.find(f => f.startsWith(id + '_'));
  if (file) IMAGE_PATHS[id] = `/cards/${file}`;
}

// ── Build final character data ──

const finalChars = [];

for (const entry of nwtData) {
  const id = entry.id;
  const ex = existing[id] || {};
  const manual = MANUAL[id] || {};
  const newMyTh = NEW_MY_TH[id] || {};
  const nwt = entry.nwt || {};

  // Priority: manual > cleaned NWT > existing
  const nameEn = manual.en || cleanName(nwt.en) || ex.nameEn || entry.nameEn;
  const nameKo = manual.ko || cleanName(nwt.ko) || ex.nameKo || entry.nameKo;
  const nameZh = manual.zh || cleanName(nwt.zh) || ex.nameZh || '';
  const nameZhTw = manual.zhTw || cleanName(nwt.zhTw) || ex.nameZhTw || '';
  const nameMy = newMyTh.my || ex.nameMy || '';
  const nameTh = newMyTh.th || ex.nameTh || '';
  const image = IMAGE_PATHS[id] || `/cards/${id}_${entry.nameKo}_${entry.nameEn}.png`;

  finalChars.push({ id, nameKo, nameEn, nameZh, nameZhTw, nameMy, nameTh, image });
}

// ── Generate characters.ts ──

let ts = `export interface BibleCharacter {
  id: number;
  nameKo: string;
  nameEn: string;
  nameZh: string;
  nameZhTw: string;
  nameMy: string;
  nameTh: string;
  image: string;
}

const characters: BibleCharacter[] = [\n`;

for (const c of finalChars) {
  ts += `  { id: ${c.id}, nameKo: "${c.nameKo}", nameEn: "${c.nameEn}", nameZh: "${c.nameZh}", nameZhTw: "${c.nameZhTw}", nameMy: "${c.nameMy}", nameTh: "${c.nameTh}", image: "${c.image}" },\n`;
}

ts += `];\n\nexport default characters;\n`;

writeFileSync('src/data/characters.ts', ts);
console.log(`Generated characters.ts with ${finalChars.length} characters`);

// Report differences from existing
let diffs = 0;
for (const c of finalChars) {
  const ex = existing[c.id];
  if (!ex) continue;
  const fields = ['nameKo', 'nameEn', 'nameZh', 'nameZhTw'];
  for (const f of fields) {
    if (ex[f] && c[f] && ex[f] !== c[f]) {
      console.log(`  [${c.id}] ${f}: "${ex[f]}" → "${c[f]}"`);
      diffs++;
    }
  }
}
console.log(`Total NWT corrections: ${diffs}`);
