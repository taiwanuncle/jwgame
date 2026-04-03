/**
 * WOL Insight on the Scriptures를 이용해 신세계역(NWT) 이름을 조회하는 스크립트
 *
 * 사용법: node scripts/lookup-nwt-names.mjs
 *
 * 1. 영어 WOL에서 캐릭터명 검색 → Insight 기사 docId 추출
 * 2. 같은 docId로 한국어/중국어(간체/번체) 기사 fetch → 이름 추출
 * 3. 결과를 JSON으로 출력
 */

import https from 'https';

// WOL language configs
const LANGS = {
  ko: { r: 'r8', lp: 'lp-ko' },
  en: { r: 'r1', lp: 'lp-e' },
  zh: { r: 'r23', lp: 'lp-chs' },
  zhTw: { r: 'r24', lp: 'lp-ch' },
  th: { r: 'r113', lp: 'lp-si' },
  my: { r: 'r144', lp: 'lp-bu' },
};

// All 168 characters: [id, nameKo, nameEn, searchTerm (English)]
// searchTerm is used for WOL Insight search - simplified for better matching
const CHARACTERS = [
  [1, "아담", "Adam"],
  [2, "하와", "Eve"],
  [3, "아벨", "Abel"],
  [4, "가인", "Cain"],
  [5, "에녹", "Enoch"],
  [6, "노아", "Noah"],
  [7, "셈", "Shem"],
  [8, "아브라함", "Abraham"],
  [9, "사라", "Sarah"],
  [10, "롯", "Lot"],
  [11, "하갈", "Hagar"],
  [12, "이스마엘", "Ishmael"],
  [13, "이삭", "Isaac"],
  [14, "리브가", "Rebekah"],
  [15, "에서", "Esau"],
  [16, "야곱", "Jacob"],
  [17, "라헬", "Rachel"],
  [18, "레아", "Leah"],
  [19, "요셉", "Joseph"],
  [20, "유다", "Judah"],
  [21, "디나", "Dinah"],
  [22, "보디발", "Potiphar"],
  [23, "모세", "Moses"],
  [24, "아론", "Aaron"],
  [25, "미리암", "Miriam"],
  [26, "여호수아", "Joshua"],
  [27, "갈렙", "Caleb"],
  [28, "라합", "Rahab"],
  [29, "드보라", "Deborah"],
  [30, "기드온", "Gideon"],
  [31, "입다", "Jephthah"],
  [32, "삼손", "Samson"],
  [33, "나오미", "Naomi"],
  [34, "룻", "Ruth"],
  [35, "보아스", "Boaz"],
  [36, "한나", "Hannah"],
  [37, "사무엘", "Samuel"],
  [38, "사울", "Saul"],
  [39, "다윗", "David"],
  [40, "요나단", "Jonathan"],
  [41, "아비가일", "Abigail"],
  [42, "밧세바", "Bathsheba"],
  [43, "솔로몬", "Solomon"],
  [44, "나단", "Nathan"],
  [45, "압살롬", "Absalom"],
  [46, "엘리야", "Elijah"],
  [47, "엘리사", "Elisha"],
  [48, "나아만", "Naaman"],
  [49, "이사야", "Isaiah"],
  [50, "예레미야", "Jeremiah"],
  [51, "에스겔", "Ezekiel"],
  [52, "다니엘", "Daniel"],
  [53, "호세아", "Hosea"],
  [54, "요나", "Jonah"],
  [55, "미가", "Micah"],
  [56, "히스기야", "Hezekiah"],
  [57, "요시야", "Josiah"],
  [58, "느헤미야", "Nehemiah"],
  [59, "에스라", "Ezra"],
  [60, "에스더", "Esther"],
  [61, "모르드개", "Mordecai"],
  [62, "욥", "Job"],
  [63, "이세벨", "Jezebel"],
  [64, "아합", "Ahab"],
  [65, "오바댜", "Obadiah"],
  [66, "하박국", "Habakkuk"],
  [67, "스바냐", "Zephaniah"],
  [68, "스가랴", "Zechariah"],
  [69, "말라기", "Malachi"],
  [70, "예수", "Jesus"],
  [71, "마리아", "Mary"],
  [72, "요셉 (마리아의 남편)", "Joseph"],
  [73, "세례자 요한", "John the Baptist"],
  [74, "베드로", "Peter"],
  [75, "안드레", "Andrew"],
  [76, "야고보 (제베대의 아들)", "James son of Zebedee"],
  [77, "요한 (사도)", "John"],
  [78, "빌립", "Philip"],
  [79, "바돌로매", "Bartholomew"],
  [80, "마태", "Matthew"],
  [81, "도마", "Thomas"],
  [82, "예수 그리스도", "Jesus Christ"],
  [83, "사마리아 여인", "Samaritan woman"],
  [84, "삭개오", "Zacchaeus"],
  [85, "나사로", "Lazarus"],
  [86, "마르다", "Martha"],
  [87, "바디매오", "Bartimaeus"],
  [88, "헤롯 안디바", "Herod Antipas"],
  [89, "바라바", "Barabbas"],
  [90, "시몬 (구레네 사람)", "Simon of Cyrene"],
  [91, "아리마대 요셉", "Joseph of Arimathea"],
  [92, "도마 (부활 후)", "Thomas"],
  [93, "바울", "Paul"],
  [94, "바나바", "Barnabas"],
  [95, "누가", "Luke"],
  [96, "디모데", "Timothy"],
  [97, "브리스길라", "Priscilla"],
  [98, "아굴라", "Aquila"],
  [99, "아볼로", "Apollos"],
  [100, "실라", "Silas"],
  [101, "스데반", "Stephen"],
  [102, "빌립 (전도자)", "Philip the Evangelist"],
  [103, "고넬료", "Cornelius"],
  [104, "루디아", "Lydia"],
  [105, "비비", "Phoebe"],
  [106, "에바브로디도", "Epaphroditus"],
  [107, "빌레몬", "Philemon"],
  [108, "가야바", "Caiaphas"],
  [109, "다대오", "Thaddaeus"],
  [110, "시몬 (열심당원)", "Simon the Zealot"],
  [111, "유다 이스가리옷", "Judas Iscariot"],
  [112, "막달라 마리아", "Mary Magdalene"],
  [113, "마르다", "Martha"],
  [114, "마리아 (마르다의 동생)", "Mary sister of Martha"],
  [115, "나사로", "Lazarus"],
  [116, "삭개오", "Zacchaeus"],
  [117, "니고데모", "Nicodemus"],
  [118, "헤롯 대왕", "Herod the Great"],
  [119, "본디오 빌라도", "Pontius Pilate"],
  [120, "맛디아", "Matthias"],
  [121, "바울", "Paul"],
  [122, "바나바", "Barnabas"],
  [123, "스데반", "Stephen"],
  [124, "빌립 (전도자)", "Philip the Evangelist"],
  [125, "디모데", "Timothy"],
  [126, "누가", "Luke"],
  [127, "브리스길라와 아굴라", "Priscilla"],
  [128, "실라", "Silas"],
  // New 40 characters (129-168)
  [129, "므두셀라", "Methuselah"],
  [130, "야벳", "Japheth"],
  [131, "멜기세덱", "Melchizedek"],
  [132, "십보라", "Zipporah"],
  [133, "비느하스", "Phinehas"],
  [134, "아간", "Achan"],
  [135, "아비멜렉", "Abimelech"],
  [136, "들릴라", "Delilah"],
  [137, "이새", "Jesse"],
  [138, "우리아", "Uriah"],
  [139, "므비보셋", "Mephibosheth"],
  [140, "요압", "Joab"],
  [141, "아히도벨", "Ahithophel"],
  [142, "수넴 여인", "Shunammite"],
  [143, "예후", "Jehu"],
  [144, "아달리야", "Athaliah"],
  [145, "여호야다", "Jehoiada"],
  [146, "요아스", "Joash"],
  [147, "므낫세", "Manasseh"],
  [148, "요엘", "Joel"],
  [149, "나훔", "Nahum"],
  [150, "스룹바벨", "Zerubbabel"],
  [151, "학개", "Haggai"],
  [152, "엘리사벳", "Elizabeth"],
  [153, "안나", "Anna"],
  [154, "시므온", "Simeon"],
  [155, "안드레", "Andrew"],
  [156, "야이로", "Jairus"],
  [157, "오르바", "Orpah"],
  [158, "빌라도의 아내", "Pilate wife"],
  [159, "마가", "Mark"],
  [160, "예수의 형제 야고보", "James brother of Jesus"],
  [161, "아나니아", "Ananias"],
  [162, "삽비라", "Sapphira"],
  [163, "가말리엘", "Gamaliel"],
  [164, "헤롯 아그립바", "Herod Agrippa"],
  [165, "빌레몬", "Philemon"],
  [166, "오네시모", "Onesimus"],
  [167, "디도", "Titus"],
  [168, "에바브라", "Epaphras"],
];

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

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/** Search WOL and find the Insight article docId */
async function findInsightDocId(nameEn) {
  // Extract core name for matching (e.g. "James brother of Jesus" → "James", "Philip the Evangelist" → "Philip")
  const coreName = nameEn.split(/\s+(the|of|brother|son|sister)\b/i)[0].trim();

  const url = `https://wol.jw.org/wol/s/r1/lp-e?q=${encodeURIComponent(nameEn)}&p=0&limit=50`;
  try {
    const raw = await fetch(url);
    const data = JSON.parse(raw);
    if (!data.items) return null;

    // Priority 1: Insight article where caption matches the name
    for (const item of data.items) {
      if (item.englishSymbol && item.englishSymbol.startsWith('it')) {
        const caption = (item.caption || '').trim();
        // Check if caption matches or contains the core name
        if (caption.toLowerCase() === nameEn.toLowerCase() ||
            caption.toLowerCase() === coreName.toLowerCase() ||
            caption.toLowerCase().startsWith(coreName.toLowerCase())) {
          const match = item.url.match(/\/(\d+)\?/);
          if (match) return { docId: match[1], nameEn: caption };
        }
      }
    }

    // Priority 2: Any Insight article with a broader match
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
    console.error(`  Error searching for ${nameEn}: ${e.message}`);
    return null;
  }
}

/** Fetch Insight article in a specific language and extract the name from JSON title */
async function getInsightName(docId, lang) {
  const cfg = LANGS[lang];
  const url = `https://wol.jw.org/wol/d/${cfg.r}/${cfg.lp}/${docId}`;
  try {
    const raw = await fetch(url);
    const data = JSON.parse(raw);
    // title field contains HTML like "<strong>므두셀라</strong>"
    let name = (data.title || '').replace(/<[^>]+>/g, '').trim();
    return name || null;
  } catch (e) {
    return null;
  }
}

/** Search directly in a specific language if Insight article not found */
async function searchDirectName(nameEn, lang) {
  const cfg = LANGS[lang];
  // For ko, search with Korean name; for others search with English
  const searchTerm = nameEn;
  const url = `https://wol.jw.org/wol/s/${cfg.r}/${cfg.lp}?q=${encodeURIComponent(searchTerm)}&p=0`;
  try {
    const raw = await fetch(url);
    const data = JSON.parse(raw);
    if (data.items && data.items.length > 0) {
      // Look for Insight article first
      for (const item of data.items) {
        if (item.englishSymbol && item.englishSymbol.startsWith('it')) {
          return item.caption || null;
        }
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function main() {
  const results = [];
  const total = CHARACTERS.length;

  // Process only new characters (129-168) first, then optionally existing
  const startId = parseInt(process.argv[2] || '1');
  const endId = parseInt(process.argv[3] || '168');

  const chars = CHARACTERS.filter(c => c[0] >= startId && c[0] <= endId);
  console.error(`Processing ${chars.length} characters (id ${startId}-${endId})...`);

  for (const [id, nameKo, nameEn] of chars) {
    process.stderr.write(`[${id}/${endId}] ${nameEn}... `);

    // Step 1: Find Insight docId via English search
    const insight = await findInsightDocId(nameEn);
    await sleep(300); // rate limiting

    const result = { id, nameKo, nameEn, nwt: {} };

    if (insight && insight.docId) {
      result.insightDocId = insight.docId;
      result.nwt.en = insight.nameEn;

      // Step 2: Fetch ko/zh/zhTw in parallel (th/my don't have Insight articles)
      const [ko, zh, zhTw] = await Promise.all([
        getInsightName(insight.docId, 'ko'),
        getInsightName(insight.docId, 'zh'),
        getInsightName(insight.docId, 'zhTw'),
      ]);
      if (ko) result.nwt.ko = ko;
      if (zh) result.nwt.zh = zh;
      if (zhTw) result.nwt.zhTw = zhTw;
    } else {
      // Fallback: direct search in each language (parallel)
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

  // Output results as JSON
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
