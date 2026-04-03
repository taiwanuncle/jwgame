/**
 * v2: Use ACTUAL characters from existing characters.ts + new 40 from characters.md
 * Lookup NWT names via WOL Insight API
 */

import https from 'https';
import { readFileSync, writeFileSync } from 'fs';

const LANGS = {
  ko: { r: 'r8', lp: 'lp-ko' },
  en: { r: 'r1', lp: 'lp-e' },
  zh: { r: 'r23', lp: 'lp-chs' },
  zhTw: { r: 'r24', lp: 'lp-ch' },
};

// Load existing 128 characters
const existing = JSON.parse(readFileSync('scripts/existing-chars.json', 'utf-8'));

// Build character list: existing 128 + new 40
const CHARACTERS = [];
for (let id = 1; id <= 128; id++) {
  const c = existing[id];
  if (c) CHARACTERS.push([id, c.nameKo, c.nameEn]);
}
// New 40 from characters.md
const NEW_CHARS = [
  [129, "므두셀라", "Methuselah"], [130, "야벳", "Japheth"], [131, "멜기세덱", "Melchizedek"],
  [132, "십보라", "Zipporah"], [133, "비느하스", "Phinehas"], [134, "아간", "Achan"],
  [135, "아비멜렉", "Abimelech"], [136, "들릴라", "Delilah"], [137, "이새", "Jesse"],
  [138, "우리아", "Uriah"], [139, "므비보셋", "Mephibosheth"], [140, "요압", "Joab"],
  [141, "아히도벨", "Ahithophel"], [142, "수넴 여인", "Shunammite Woman"],
  [143, "예후", "Jehu"], [144, "아달리야", "Athaliah"], [145, "여호야다", "Jehoiada"],
  [146, "요아스", "Joash"], [147, "므낫세", "Manasseh"], [148, "요엘", "Joel"],
  [149, "나훔", "Nahum"], [150, "스룹바벨", "Zerubbabel"], [151, "학개", "Haggai"],
  [152, "엘리사벳", "Elizabeth"], [153, "안나", "Anna"], [154, "시므온", "Simeon"],
  [155, "안드레", "Andrew"], [156, "야이로", "Jairus"], [157, "오르바", "Orpah"],
  [158, "빌라도의 아내", "Pilate's Wife"], [159, "마가", "Mark"],
  [160, "예수의 형제 야고보", "James brother of Jesus"],
  [161, "아나니아", "Ananias"], [162, "삽비라", "Sapphira"], [163, "가말리엘", "Gamaliel"],
  [164, "헤롯 아그립바", "Herod Agrippa"], [165, "빌레몬", "Philemon"],
  [166, "오네시모", "Onesimus"], [167, "디도", "Titus"], [168, "에바브라", "Epaphras"],
];
CHARACTERS.push(...NEW_CHARS);

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 15000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function findInsightDocId(nameEn) {
  const coreName = nameEn.split(/\s+(?:the|of|brother|son|sister)\b/i)[0].trim();
  const url = `https://wol.jw.org/wol/s/r1/lp-e?q=${encodeURIComponent(nameEn)}&p=0&limit=50`;
  try {
    const raw = await fetch(url);
    const data = JSON.parse(raw);
    if (!data.items) return null;

    for (const item of data.items) {
      if (item.englishSymbol && item.englishSymbol.startsWith('it')) {
        const caption = (item.caption || '').trim();
        if (caption.toLowerCase() === nameEn.toLowerCase() ||
            caption.toLowerCase() === coreName.toLowerCase() ||
            caption.toLowerCase().startsWith(coreName.toLowerCase())) {
          const match = item.url.match(/\/(\d+)\?/);
          if (match) return { docId: match[1], nameEn: caption };
        }
      }
    }
    for (const item of data.items) {
      if (item.englishSymbol && item.englishSymbol.startsWith('it')) {
        const caption = (item.caption || '').trim();
        if (caption.toLowerCase().includes(coreName.toLowerCase())) {
          const match = item.url.match(/\/(\d+)\?/);
          if (match) return { docId: match[1], nameEn: caption };
        }
      }
    }
    return { docId: null, nameEn: coreName, fallback: true };
  } catch (e) {
    console.error(`  Error: ${nameEn}: ${e.message}`);
    return null;
  }
}

async function getInsightName(docId, lang) {
  const cfg = LANGS[lang];
  const url = `https://wol.jw.org/wol/d/${cfg.r}/${cfg.lp}/${docId}`;
  try {
    const raw = await fetch(url);
    const data = JSON.parse(raw);
    let name = (data.title || '').replace(/<[^>]+>/g, '').trim();
    return name || null;
  } catch (e) { return null; }
}

async function searchDirectName(nameEn, lang) {
  const cfg = LANGS[lang];
  const url = `https://wol.jw.org/wol/s/${cfg.r}/${cfg.lp}?q=${encodeURIComponent(nameEn)}&p=0`;
  try {
    const raw = await fetch(url);
    const data = JSON.parse(raw);
    if (data.items) {
      for (const item of data.items) {
        if (item.englishSymbol && item.englishSymbol.startsWith('it')) {
          return item.caption || null;
        }
      }
    }
    return null;
  } catch (e) { return null; }
}

async function main() {
  const results = [];
  const startId = parseInt(process.argv[2] || '1');
  const endId = parseInt(process.argv[3] || '168');
  const chars = CHARACTERS.filter(c => c[0] >= startId && c[0] <= endId);

  console.error(`Processing ${chars.length} characters (id ${startId}-${endId})...`);

  for (const [id, nameKo, nameEn] of chars) {
    process.stderr.write(`[${id}/${endId}] ${nameEn}... `);

    const insight = await findInsightDocId(nameEn);
    const result = { id, nameKo, nameEn, nwt: {} };

    if (insight && insight.docId) {
      result.insightDocId = insight.docId;
      result.nwt.en = insight.nameEn;
      const [ko, zh, zhTw] = await Promise.all([
        getInsightName(insight.docId, 'ko'),
        getInsightName(insight.docId, 'zh'),
        getInsightName(insight.docId, 'zhTw'),
      ]);
      if (ko) result.nwt.ko = ko;
      if (zh) result.nwt.zh = zh;
      if (zhTw) result.nwt.zhTw = zhTw;
    } else {
      result.noInsight = true;
      const [ko, en, zh, zhTw] = await Promise.all([
        searchDirectName(nameEn, 'ko'),
        searchDirectName(nameEn, 'en'),
        searchDirectName(nameEn, 'zh'),
        searchDirectName(nameEn, 'zhTw'),
      ]);
      if (ko) result.nwt.ko = ko;
      if (en) result.nwt.en = en;
      if (zh) result.nwt.zh = zh;
      if (zhTw) result.nwt.zhTw = zhTw;
    }

    console.error(JSON.stringify(result.nwt));
    results.push(result);
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
