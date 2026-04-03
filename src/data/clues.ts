/**
 * 봇 제시어 라이브러리 (다국어)
 * 각 캐릭터별 5개: 단어 2개 + 애매한 문장 3개
 * key = language, inner key = character id
 */
const clues: Record<string, Record<number, string[]>> = {
  "ko": {
    1: [
      "에덴",
      "흙",
      "모든 인류의 시작이 된 사람",
      "동산에서 금지된 것을 먹었다",
      "아내의 이름을 직접 지어주었다"
    ],
    2: [
      "뱀",
      "열매",
      "최초의 어머니라 불리는 여인",
      "동산에서 유혹에 넘어갔다",
      "살아 있는 모든 것의 어머니라는 뜻의 이름"
    ],
    3: [
      "양",
      "제물",
      "형에게 목숨을 잃은 목자",
      "하느님이 기뻐하신 제물을 바쳤다",
      "성서에서 최초로 죽음을 맞은 사람"
    ],
    4: [
      "농부",
      "표",
      "질투 때문에 돌이킬 수 없는 일을 저질렀다",
      "땅에서 떠돌아다니는 형벌을 받았다",
      "이마에 특별한 보호의 징표를 받았다"
    ],
    5: [
      "걸음",
      "옮김",
      "하느님과 함께 걸었다고 기록된 사람",
      "죽음을 보지 않고 사라졌다",
      "365년을 살았다고 전해진다"
    ],
    6: [
      "방주",
      "홍수",
      "거대한 배를 지어 가족을 구했다",
      "비둘기를 내보내 마른 땅을 확인했다",
      "무지개 약속을 받은 사람"
    ],
    7: [
      "장막",
      "축복",
      "아버지의 벗은 몸을 덮어준 아들",
      "메시아의 혈통에 속하는 인물",
      "홍수 이후 새 시대를 연 삼형제 중 하나"
    ],
    8: [
      "별",
      "약속",
      "고향을 떠나 약속의 땅으로 간 사람",
      "백 세에 아들을 얻었다",
      "믿음의 아버지라 불린다"
    ],
    9: [
      "웃음",
      "장막",
      "나이 들어 아들을 낳고 웃었다",
      "남편의 고향 떠남에 함께했다",
      "천사의 약속을 듣고 처음엔 믿지 못했다"
    ],
    10: [
      "소금",
      "동굴",
      "삼촌과 함께 여행하다 갈라선 사람",
      "두 도시가 멸망할 때 겨우 탈출했다",
      "아내가 뒤를 돌아보아 소금 기둥이 되었다"
    ],
    11: [
      "광야",
      "우물",
      "여주인에게서 도망친 여종",
      "광야에서 천사를 만났다",
      "아들의 이름에 '하느님이 들으셨다'는 뜻이 담겼다"
    ],
    12: [
      "활",
      "광야",
      "어머니와 함께 쫓겨난 소년",
      "광야에서 목마를 때 우물을 발견했다",
      "열두 족장의 아버지가 되었다"
    ],
    13: [
      "제단",
      "우물",
      "아버지에게 묶여 제단에 올랐다",
      "이름 자체가 '웃음'을 뜻한다",
      "아내를 만나기 전 들판에서 명상하고 있었다"
    ],
    14: [
      "물동이",
      "쌍둥이",
      "우물가에서 낙타에게 물을 주어 선택받았다",
      "한 아들에게 축복을 받게 해주려 계략을 꾸몄다",
      "머나먼 곳에서 시집을 왔다"
    ],
    15: [
      "사냥",
      "붉은 죽",
      "배가 고파 소중한 것을 팔아버린 사람",
      "온몸이 털로 덮여 있었다",
      "축복을 동생에게 빼앗겼다"
    ],
    16: [
      "사다리",
      "씨름",
      "천사와 밤새 겨루어 새 이름을 얻었다",
      "외삼촌 집에서 14년을 일했다",
      "꿈에서 하늘로 오르는 계단을 보았다"
    ],
    17: [
      "양떼",
      "사랑",
      "우물가에서 처음 만나 사랑에 빠졌다",
      "남편이 그녀를 위해 7년을 더 일했다",
      "오랫동안 아이를 갖지 못해 슬퍼했다"
    ],
    18: [
      "눈",
      "첫째",
      "아버지의 계략으로 결혼하게 된 여인",
      "사랑받지 못했지만 많은 아들을 낳았다",
      "동생보다 먼저 시집갔다"
    ],
    19: [
      "꿈",
      "옷",
      "형들에게 팔려 종이 되었다가 총리가 됐다",
      "화려한 옷 때문에 미움을 샀다",
      "곡식을 저장해 온 나라를 기근에서 구했다"
    ],
    20: [
      "지팡이",
      "사자",
      "왕의 혈통이 이 사람에게서 나왔다",
      "며느리에게 속아 넘어갔다",
      "동생을 죽이지 말고 팔자고 제안했다"
    ],
    21: [
      "베일",
      "쌍둥이",
      "변장해서 시아버지를 속인 여인",
      "자기 권리를 지키기 위해 대담한 행동을 했다",
      "메시아 혈통에 이름이 올라 있다"
    ],
    22: [
      "맏아들",
      "합력초",
      "동생을 구하려 했지만 실패했다",
      "장자권을 잃어버린 첫째 아들",
      "아버지의 침상에서 잘못을 저질렀다"
    ],
    23: [
      "은잔",
      "늑대",
      "가장 어린 아들이라 아버지가 보내기 싫어했다",
      "형의 은잔이 짐에서 발견되었다",
      "어머니가 낳다가 세상을 떠났다"
    ],
    24: [
      "인내",
      "재",
      "하루아침에 모든 것을 잃었지만 신앙을 지켰다",
      "온몸이 종기로 뒤덮였다",
      "세 친구의 위로가 오히려 고통이었다"
    ],
    25: [
      "지팡이",
      "바다",
      "갈대 상자에 넣어져 강에 띄워진 아기",
      "불타는 떨기나무 앞에서 사명을 받았다",
      "백성을 이끌고 바다를 건넜다"
    ],
    26: [
      "대제사장",
      "싹",
      "형으로서 동생의 대변자가 되었다",
      "금으로 동물 형상을 만들어 큰 잘못을 저질렀다",
      "지팡이에서 싹이 나 선택이 확인되었다"
    ],
    27: [
      "소고",
      "나병",
      "동생을 강에서 지켜본 누나",
      "바다를 건넌 뒤 노래하며 춤췄다",
      "불평했다가 피부병에 걸렸다"
    ],
    28: [
      "열 가지",
      "전차",
      "마음이 완고해져 백성을 놓아주지 않았다",
      "열 가지 재앙을 겪고도 끝까지 고집했다",
      "바다에서 군대를 잃었다"
    ],
    29: [
      "음모",
      "밤",
      "삼촌의 목숨을 구한 젊은이",
      "암살 음모를 알아채고 지휘관에게 전했다",
      "이름이 기록되지 않은 용감한 소년"
    ],
    30: [
      "재판관",
      "광야",
      "사위에게 지혜로운 조직 체계를 제안했다",
      "미디안의 제사장이자 장인",
      "사위가 떠나기 전 작별 인사를 나눴다"
    ],
    31: [
      "땅",
      "반역",
      "하느님이 세운 지도자에게 반기를 들었다",
      "땅이 갈라져 삼켜 버린 사람",
      "250명과 함께 향을 바치며 도전했다"
    ],
    32: [
      "당나귀",
      "축복",
      "돈을 받고 저주하러 갔다가 축복했다",
      "타고 가던 동물이 갑자기 말을 했다",
      "천사가 칼을 들고 길을 막고 있었다"
    ],
    33: [
      "포도송이",
      "용기",
      "열두 정탐꾼 중 좋은 보고를 한 사람",
      "85세에 산지를 달라고 요청했다",
      "여호수아와 함께 약속의 땅에 들어갔다"
    ],
    34: [
      "성벽",
      "태양",
      "모세의 뒤를 이어 백성을 이끈 지도자",
      "성을 돌며 함성을 질러 무너뜨렸다",
      "해가 멈추도록 기도한 사람"
    ],
    35: [
      "빨간 줄",
      "창문",
      "정탐꾼을 숨겨주고 가족을 구한 여인",
      "성벽 위의 집에 살았다",
      "붉은 끈이 구원의 표시가 되었다"
    ],
    36: [
      "종려나무",
      "재판관",
      "나무 아래에서 재판한 여성 지도자",
      "장군에게 전쟁에 나가라고 명했다",
      "승리의 노래를 불렀다"
    ],
    37: [
      "번개",
      "전차",
      "여성 지도자 없이는 전쟁에 안 간다고 했다",
      "적장의 철 전차 900대를 물리쳤다",
      "승리는 여자의 손에 돌아갈 거라는 말을 들었다"
    ],
    38: [
      "장막 말뚝",
      "우유",
      "도망친 적장을 자기 장막에 숨겨주었다",
      "우유를 주고 재운 뒤 결정적 행동을 했다",
      "여자의 손에 승리가 돌아갈 것이라는 예언을 성취했다"
    ],
    39: [
      "횃불",
      "양털",
      "300명만으로 대군을 물리친 지도자",
      "양털에 이슬이 맺히는 표징을 구했다",
      "항아리를 깨고 횃불을 들어 적을 혼란에 빠뜨렸다"
    ],
    40: [
      "서원",
      "딸",
      "이기면 바치겠다는 약속을 했다가 괴로워한 사람",
      "쫓겨났다가 위기 때 지도자로 돌아왔다",
      "집에서 첫 번째로 나온 사람이 딸이었다"
    ],
    41: [
      "머리카락",
      "기둥",
      "초인적인 힘을 가졌지만 비밀을 빼앗겼다",
      "사자를 맨손으로 찢었다",
      "마지막 순간 기둥을 밀어 무너뜨렸다"
    ],
    42: [
      "창문",
      "3층",
      "설교 중에 졸다가 창문에서 떨어졌다",
      "죽었다가 다시 살아난 청년",
      "밤늦게까지 이어진 긴 이야기 중에 사고가 났다"
    ],
    43: [
      "이삭줍기",
      "충성",
      "시어머니를 따라 낯선 나라로 갔다",
      "밭에서 곡식을 주워 생계를 이었다",
      "당신의 하느님이 나의 하느님이라고 말했다"
    ],
    44: [
      "쓰라림",
      "귀향",
      "남편과 두 아들을 잃고 고향으로 돌아온 여인",
      "이름을 '쓰라린 여인'으로 바꿔 달라고 했다",
      "며느리의 새 아기를 양육했다"
    ],
    45: [
      "타작마당",
      "기업 무를 자",
      "밭에서 곡식 줍는 외국 여인에게 친절했다",
      "가까운 친족으로서 책임을 다한 사람",
      "다윗 왕의 증조할아버지"
    ],
    46: [
      "기도",
      "서원",
      "아이를 간절히 원해 성전에서 울며 기도했다",
      "입술만 움직여 기도해서 취한 줄 오해받았다",
      "아들을 낳으면 하느님께 바치겠다고 약속했다"
    ],
    47: [
      "부름",
      "기름",
      "밤에 자기 이름을 부르는 소리를 들었다",
      "이스라엘의 첫 두 왕에게 기름을 부었다",
      "어릴 때부터 성전에서 자란 소년"
    ],
    48: [
      "대제사장",
      "소식",
      "아들들을 바로잡지 못한 제사장",
      "궤가 빼앗겼다는 소식을 듣고 의자에서 떨어졌다",
      "기도하는 여인을 취한 줄 알고 꾸짖었다"
    ],
    49: [
      "창",
      "당나귀",
      "잃어버린 동물을 찾으러 갔다가 왕이 됐다",
      "질투 때문에 충신을 죽이려 했다",
      "전쟁터에서 스스로 목숨을 끊었다"
    ],
    50: [
      "하프",
      "물맷돌",
      "거인을 쓰러뜨린 소년 목자",
      "양치기에서 왕이 된 인물",
      "시편을 많이 쓴 이스라엘의 왕"
    ],
    51: [
      "거인",
      "투구",
      "40일 동안 이스라엘 군대를 모욕했다",
      "돌멩이 하나에 쓰러진 전사",
      "키가 약 3미터에 달했다고 전해지는 사람"
    ],
    52: [
      "화살",
      "우정",
      "아버지의 뜻을 거슬러 친구를 도운 왕자",
      "옷과 칼과 활을 벗어 친구에게 주었다",
      "화살로 위험 신호를 보냈다"
    ],
    53: [
      "빵",
      "지혜",
      "어리석은 남편 대신 왕에게 선물을 가져갔다",
      "분노한 왕의 마음을 지혜로 돌린 여인",
      "남편이 죽은 뒤 왕비가 되었다"
    ],
    54: [
      "목욕",
      "지붕",
      "왕이 지붕에서 목욕하는 모습을 보았다",
      "남편이 전쟁터의 최전방에 배치되었다",
      "지혜로운 왕의 어머니"
    ],
    55: [
      "비유",
      "어린 양",
      "왕에게 비유로 죄를 지적한 선지자",
      "가난한 사람의 어린 양 이야기를 들려주었다",
      "바로 당신이 그 사람이라고 선포했다"
    ],
    56: [
      "머리카락",
      "반란",
      "아름다운 외모로 유명했던 왕의 아들",
      "아버지의 왕좌를 빼앗으려 반란을 일으켰다",
      "나무에 머리가 걸려 최후를 맞았다"
    ],
    57: [
      "지혜",
      "성전",
      "두 여인의 아기 분쟁을 지혜로 해결한 왕",
      "하느님께 지혜를 구해 받은 사람",
      "화려한 성전을 건축한 왕"
    ],
    58: [
      "보물",
      "수수께끼",
      "먼 나라에서 지혜를 시험하러 찾아온 여왕",
      "어려운 질문들을 가지고 왔다",
      "왕의 지혜를 보고 넋을 잃었다"
    ],
    59: [
      "채찍",
      "분열",
      "백성의 요청을 거절해 나라가 둘로 갈라졌다",
      "아버지의 조언자 대신 젊은 친구들의 말을 들었다",
      "열두 지파 중 둘만 남았다"
    ],
    60: [
      "금 송아지",
      "제단",
      "북쪽 왕국의 첫 번째 왕",
      "백성이 예루살렘에 가지 못하게 금 우상을 만들었다",
      "이스라엘이 죄를 짓게 한 왕으로 기록되었다"
    ],
    61: [
      "불",
      "까마귀",
      "하늘에서 불이 내려와 제물을 태운 선지자",
      "까마귀가 음식을 가져다주었다",
      "회오리바람을 타고 하늘로 올라갔다"
    ],
    62: [
      "화장",
      "포도원",
      "이웃의 밭을 빼앗기 위해 거짓 재판을 꾸몄다",
      "하느님의 선지자들을 죽이려 했다",
      "창문에서 떨어져 최후를 맞았다"
    ],
    63: [
      "상아",
      "포도원",
      "이웃의 땅이 탐나 우울해진 왕",
      "아내의 부추김에 넘어간 이스라엘의 왕",
      "바알 숭배를 퍼뜨린 왕"
    ],
    64: [
      "겉옷",
      "곰",
      "스승의 겉옷을 물려받은 선지자",
      "도끼 머리를 물 위에 뜨게 했다",
      "나아만의 병을 요르단 강에서 고쳤다"
    ],
    65: [
      "요르단 강",
      "일곱 번",
      "강에서 일곱 번 씻고 피부병이 나은 장군",
      "처음에는 선지자의 지시를 거부했다",
      "적국의 어린 소녀 덕분에 치료법을 알게 되었다"
    ],
    66: [
      "탐욕",
      "나병",
      "주인 몰래 선물을 받으러 뛰어간 종",
      "거짓말을 하고 피부병에 걸렸다",
      "선지자의 종이었지만 욕심에 넘어갔다"
    ],
    67: [
      "해시계",
      "터널",
      "수명이 15년 연장된 왕",
      "적이 쳐들어왔을 때 기도로 구원받았다",
      "해 그림자가 뒤로 물러나는 표징을 받았다"
    ],
    68: [
      "율법책",
      "8세",
      "여덟 살에 왕이 된 소년",
      "성전 수리 중 발견된 책을 읽고 옷을 찢었다",
      "우상을 철저히 파괴한 개혁의 왕"
    ],
    69: [
      "숯불",
      "처녀",
      "입술을 숯불로 정결하게 한 선지자",
      "메시아에 대한 예언을 가장 많이 남겼다",
      "여기 있습니다 나를 보내소서라고 말했다"
    ],
    70: [
      "눈물",
      "토기장이",
      "눈물의 선지자라 불린 사람",
      "진흙 웅덩이에 갇혀 구출된 적이 있다",
      "예루살렘의 멸망을 예언하고 슬퍼했다"
    ],
    71: [
      "마른 뼈",
      "환상",
      "마른 뼈가 살아나는 환상을 본 선지자",
      "옆으로 누워 수백 일을 보냈다",
      "하느님의 보좌와 네 생물의 환상을 보았다"
    ],
    72: [
      "사자굴",
      "해석",
      "왕의 꿈을 해석해 높은 자리에 오른 사람",
      "사자굴에 던져졌으나 해를 입지 않았다",
      "저녁마다 창문을 열고 기도한 사람"
    ],
    73: [
      "풀무불",
      "네 번째 사람",
      "금 신상에 절하기를 거부한 세 청년",
      "불 속에서 네 번째 사람이 보였다",
      "불에 들어갔지만 머리카락 하나 타지 않았다"
    ],
    74: [
      "벽",
      "잔치",
      "성전의 그릇으로 술잔치를 벌인 왕",
      "벽에 나타난 글씨를 아무도 읽지 못했다",
      "그날 밤 나라를 잃었다"
    ],
    75: [
      "칙령",
      "사자굴",
      "자기가 내린 명령 때문에 괴로워한 왕",
      "충신을 사자굴에 넣을 수밖에 없었다",
      "다음 날 아침 서둘러 달려가 안부를 물었다"
    ],
    76: [
      "금 신상",
      "풀",
      "거대한 금 신상을 세우고 절하라 명한 왕",
      "교만하여 들짐승처럼 풀을 먹게 되었다",
      "예루살렘 성전을 파괴한 바빌론의 왕"
    ],
    77: [
      "결혼",
      "용서",
      "하느님의 명으로 특별한 여인과 결혼한 선지자",
      "배신한 아내를 다시 데려온 이야기",
      "이스라엘의 불충실을 자기 결혼으로 보여주었다"
    ],
    78: [
      "웅변",
      "알렉산드리아",
      "열정적으로 말했지만 아직 배울 것이 있던 전도자",
      "부부에게서 더 정확한 가르침을 배웠다",
      "바울이 심고 이 사람이 물을 주었다"
    ],
    79: [
      "뽕나무",
      "목자",
      "목자이자 뽕나무 재배자였던 선지자",
      "가난한 자를 압제하는 것을 꾸짖었다",
      "전문 선지자가 아니었지만 하느님께 부름받았다"
    ],
    80: [
      "에돔",
      "심판",
      "에돔에 대한 심판을 예언한 사람",
      "성서에서 가장 짧은 예언서를 남겼다",
      "형제 민족의 배신을 질책했다"
    ],
    81: [
      "물고기",
      "박넝쿨",
      "하느님의 명령을 피해 배를 탔다",
      "큰 물고기 뱃속에서 3일을 보냈다",
      "적국이 회개하자 오히려 화를 냈다"
    ],
    82: [
      "베들레헴",
      "겸손",
      "메시아의 탄생지를 예언한 선지자",
      "공의를 행하고 인자를 사랑하라고 말했다",
      "작은 마을에서 위대한 통치자가 나올 것이라 했다"
    ],
    83: [
      "포로",
      "종",
      "적국 장군의 아내에게 선지자를 알려준 아이",
      "포로로 잡혀갔지만 신앙을 잃지 않았다",
      "이름 없는 어린 종이 큰 기적의 계기가 되었다"
    ],
    84: [
      "질문",
      "망대",
      "하느님께 왜 악을 허용하시냐고 물은 선지자",
      "망대에 서서 하느님의 대답을 기다렸다",
      "의인은 믿음으로 살 것이라는 말씀을 받았다"
    ],
    85: [
      "심판의 날",
      "겸손",
      "여호와의 큰 날이 가깝다고 선포한 선지자",
      "겸손한 자를 찾으라고 호소했다",
      "요시야 왕 시대에 활동했다"
    ],
    86: [
      "자주색",
      "강가",
      "강가에서 기도하다 복음을 받아들인 여인",
      "자주색 옷감을 파는 장사꾼이었다",
      "집을 열어 전도자들을 환대했다"
    ],
    87: [
      "말",
      "등잔대",
      "성전 재건을 격려한 선지자",
      "여러 가지 색깔의 말 환상을 보았다",
      "금 등잔대와 올리브 나무의 환상을 기록했다"
    ],
    88: [
      "십일조",
      "태양",
      "의의 태양이 떠오를 것이라 예언했다",
      "하느님을 속이고 있다며 백성을 꾸짖었다",
      "구약의 마지막 선지자"
    ],
    89: [
      "율법",
      "서기관",
      "포로에서 돌아와 율법을 가르친 제사장",
      "이방인과의 결혼 문제로 옷을 찢고 슬퍼했다",
      "백성 앞에서 율법을 읽어주었다"
    ],
    90: [
      "성벽",
      "술 관원",
      "왕의 술 시중을 들다가 고향의 성벽을 재건한 사람",
      "52일 만에 성벽을 완성했다",
      "한 손에 무기, 한 손에 연장을 들고 일했다"
    ],
    91: [
      "왕비",
      "금 홀",
      "부름받지 않고 왕 앞에 나선 용감한 여인",
      "자기 민족을 구하기 위해 목숨을 걸었다",
      "이때를 위해 왕비가 된 것이 아니겠느냐는 말을 들었다"
    ],
    92: [
      "성문",
      "절하지 않음",
      "적에게 절하기를 거부한 유대인",
      "왕의 암살 음모를 고발했다",
      "조카딸에게 용기를 준 사람"
    ],
    93: [
      "교수대",
      "제비",
      "자기가 만든 교수대에 매달린 관리",
      "한 민족을 멸절시키려는 계획을 세웠다",
      "제비를 뽑아 날짜를 정했다"
    ],
    94: [
      "백부장",
      "환상",
      "기도와 구제로 하느님의 주목을 받은 이방인",
      "이방인 최초로 성령을 받았다",
      "베드로를 초대해 복음을 들었다"
    ],
    95: [
      "바늘",
      "옷",
      "과부들을 위해 옷을 만들어 준 여인",
      "죽었다가 기도로 다시 살아났다",
      "선행과 자선으로 가득했던 제자"
    ],
    96: [
      "구유",
      "십자가",
      "물을 포도주로 바꾼 첫 기적을 행했다",
      "목수의 아들로 자란 인류의 구원자",
      "죽은 자를 살리고 병든 자를 고쳤다"
    ],
    97: [
      "구유",
      "천사",
      "천사의 방문을 받고 순종한 젊은 여인",
      "마구간에서 아기를 낳았다",
      "여호와의 종이라 자처한 믿음의 여인"
    ],
    98: [
      "목수",
      "꿈",
      "꿈에서 천사의 지시를 받은 사람",
      "가족을 데리고 이집트로 피난했다",
      "의로운 사람으로 기록된 목수"
    ],
    99: [
      "메뚜기",
      "요르단 강",
      "광야에서 회개를 외친 선구자",
      "메뚜기와 야생 꿀을 먹으며 살았다",
      "세상 죄를 지고 가는 어린 양이라 선포했다"
    ],
    100: [
      "그물",
      "닭",
      "물 위를 걷다가 빠진 어부",
      "세 번 부인하고 닭이 울자 울었다",
      "교회의 반석이라 불린 사도"
    ],
    101: [
      "무화과나무",
      "솔직",
      "나사렛에서 무슨 좋은 것이 나올 수 있느냐고 말했다",
      "무화과나무 아래에서 기도하던 것을 알아맞혔다",
      "거짓이 없는 사람이라는 칭찬을 받았다"
    ],
    102: [
      "우레",
      "칼",
      "사도 중 첫 번째로 순교한 사람",
      "우레의 아들이라는 별명을 가졌다",
      "형제와 함께 예수의 가까운 제자였다"
    ],
    103: [
      "사랑",
      "밧모 섬",
      "예수가 사랑한 제자라 불린 사람",
      "섬으로 유배되어 계시록을 기록했다",
      "십자가 아래서 예수의 어머니를 맡았다"
    ],
    104: [
      "빵",
      "제자",
      "오천 명을 먹이기 전 비용을 계산하라는 질문을 받았다",
      "나다나엘에게 와서 보라고 초대한 사도",
      "주님, 아버지를 보여주소서라고 요청했다"
    ],
    105: [
      "춤",
      "접시",
      "생일잔치에서 끔찍한 약속을 한 왕",
      "선지자의 머리를 접시에 달라는 요청을 거절하지 못했다",
      "예수를 심문했지만 돌려보냈다"
    ],
    106: [
      "세관",
      "잔치",
      "세금 걷는 자리에서 일어나 따라간 사람",
      "죄인과 세리를 초대해 큰 잔치를 베풀었다",
      "예수의 족보를 기록한 복음서 기자"
    ],
    107: [
      "상처",
      "의심",
      "직접 보고 만져봐야 믿겠다고 했다",
      "나의 주 나의 하나님이라 고백했다",
      "못 자국을 확인한 뒤 믿음을 고백한 사도"
    ],
    108: [
      "대제사장",
      "옷을 찢음",
      "한 사람이 백성을 위해 죽는 것이 낫다고 말했다",
      "예수 재판을 주도한 대제사장",
      "자기 옷을 찢으며 신성모독이라 선언했다"
    ],
    109: [
      "열두",
      "질문",
      "우리에게만 나타내시고 세상에는 안 하시냐고 물은 사도",
      "열두 사도 목록에 이름이 있는 인물",
      "야고보의 아들이라고도 불린 제자"
    ],
    110: [
      "열심",
      "열두",
      "열심당원이었던 사도",
      "정치적 열정을 가졌다가 예수의 제자가 됐다",
      "열두 사도 중 과격한 배경을 가진 사람"
    ],
    111: [
      "은 서른",
      "입맞춤",
      "돈주머니를 관리하던 제자",
      "입맞춤으로 스승을 넘겨주었다",
      "후회하고 은전을 돌려주었지만 돌이킬 수 없었다"
    ],
    112: [
      "향유",
      "부활",
      "부활하신 예수를 처음 만난 여인",
      "빈 무덤에서 울고 있을 때 이름을 불러주셨다",
      "일곱 귀신에서 해방된 여인"
    ],
    113: [
      "접대",
      "부엌",
      "손님 접대에 분주했던 여인",
      "동생은 가만히 앉아 있는데 혼자 일한다고 불평했다",
      "주님이 말씀하시면 죽은 자도 살아난다고 고백했다"
    ],
    114: [
      "발",
      "향유",
      "예수의 발치에 앉아 말씀을 들은 여인",
      "비싼 향유를 부어 장례를 준비했다",
      "좋은 편을 택했다는 칭찬을 받았다"
    ],
    115: [
      "무덤",
      "나흘",
      "죽은 지 나흘 만에 무덤에서 나온 사람",
      "예수가 그의 이름을 부르자 살아났다",
      "붕대에 감긴 채 걸어나왔다"
    ],
    116: [
      "뽕나무",
      "세리",
      "키가 작아 나무에 올라간 부자",
      "오늘 이 집에 구원이 왔다는 말씀을 들었다",
      "재산의 절반을 가난한 자에게 주겠다고 했다"
    ],
    117: [
      "밤",
      "거듭남",
      "밤에 몰래 예수를 찾아온 바리새인",
      "어떻게 사람이 늙은 후에 다시 태어날 수 있느냐고 물었다",
      "예수의 장례 때 많은 향료를 가져왔다"
    ],
    118: [
      "학살",
      "성전",
      "아기들을 죽이라 명한 잔인한 왕",
      "예루살렘 성전을 웅장하게 재건했다",
      "동방의 박사들에게 속았다며 분노했다"
    ],
    119: [
      "손 씻기",
      "재판",
      "나는 이 사람의 피에 대해 무죄하다며 손을 씻었다",
      "진리가 무엇이냐고 물은 총독",
      "군중의 압력에 무죄한 사람을 넘겨주었다"
    ],
    120: [
      "제비",
      "열두 번째",
      "제비뽑기로 사도가 된 사람",
      "배반한 제자의 빈자리를 채웠다",
      "처음부터 예수와 함께했던 제자 중 하나"
    ],
    121: [
      "다마스쿠스",
      "서신",
      "그리스도인을 박해하다 극적으로 회심한 사람",
      "다마스쿠스 길에서 빛에 눈이 멀었다",
      "감옥에서도 편지를 써서 교회를 세웠다"
    ],
    122: [
      "격려",
      "밭",
      "위로의 아들이라는 별명을 가진 사도",
      "밭을 팔아 그 값을 공동체에 바쳤다",
      "아무도 신뢰하지 않던 회심자를 소개해 주었다"
    ],
    123: [
      "돌",
      "하늘",
      "돌에 맞아 죽으면서 용서를 빈 첫 순교자",
      "천사 같은 얼굴을 하고 있다고 묘사되었다",
      "하늘이 열리고 인자가 서 계신 것을 보았다"
    ],
    124: [
      "전차",
      "사막길",
      "사막 길에서 외국 관리의 전차에 올라탔다",
      "성경 구절을 설명해주고 물에서 침례를 주었다",
      "일곱 봉사자 중 하나이자 네 딸의 아버지"
    ],
    125: [
      "청년",
      "할머니",
      "할머니와 어머니에게서 믿음을 물려받은 젊은이",
      "바울이 아들처럼 사랑한 동역자",
      "청년의 때를 사람들이 업신여기지 못하게 하라는 격려를 받았다"
    ],
    126: [
      "의사",
      "기록",
      "사랑하는 의사로 불린 복음서 기자",
      "바울과 함께 여행하며 기록을 남겼다",
      "이방인에게 복음을 전하기 위해 글을 썼다"
    ],
    127: [
      "천막",
      "부부",
      "천막 만드는 일을 하며 바울과 함께 일한 부부",
      "열정적인 전도자에게 더 정확한 길을 가르쳐 주었다",
      "자기 집을 교회로 사용한 헌신적인 동역자"
    ],
    128: [
      "감옥",
      "찬양",
      "한밤중 감옥에서 찬송가를 부른 사람",
      "지진이 일어나 감옥 문이 열렸다",
      "바울과 함께 전도 여행을 다닌 동역자"
    ],
    129: [
      "장수",
      "969년",
      "성서에서 가장 오래 산 사람",
      "홍수가 나던 해에 세상을 떠났다",
      "아들의 이름에 심판에 대한 의미가 담겨 있었다"
    ],
    130: [
      "섬나라",
      "넓히다",
      "노아의 세 아들 중 하나",
      "유럽과 소아시아 민족들의 조상",
      "형과 함께 아버지의 벗은 몸을 덮어주었다"
    ],
    131: [
      "빵과 포도주",
      "제사장 왕",
      "왕이면서 동시에 제사장이었던 인물",
      "아브라함에게 축복하고 십일조를 받았다",
      "족보에 시작과 끝이 기록되지 않은 신비로운 사람"
    ],
    132: [
      "부싯돌",
      "할례",
      "남편의 목숨을 구하기 위해 긴급한 행동을 한 아내",
      "미디안 제사장의 딸",
      "우물가에서 양에게 물을 먹이던 중 미래의 남편을 만났다"
    ],
    133: [
      "창",
      "열심",
      "여호와를 향한 열심으로 재앙을 멈춘 제사장",
      "죄악을 즉각 처단해 전염병이 그쳤다",
      "영원한 제사장직의 계약을 받았다"
    ],
    134: [
      "금",
      "장막 밑",
      "전리품을 몰래 숨긴 사람",
      "장막 밑에 보물을 감추었다가 들통났다",
      "한 사람의 죄 때문에 전체가 패배했다"
    ],
    135: [
      "맷돌",
      "가시나무",
      "형제 70명을 죽이고 왕이 되려 한 사람",
      "가시나무 비유의 대상이 된 인물",
      "여자가 던진 맷돌에 머리가 부서졌다"
    ],
    136: [
      "비밀",
      "무릎",
      "연인의 힘의 비밀을 캐내려 집요하게 물었다",
      "은을 받고 사랑하는 사람을 배신했다",
      "무릎 위에서 잠든 사이 머리카락을 잘랐다"
    ],
    137: [
      "여덟 아들",
      "베들레헴",
      "베들레헴의 양 치는 집안의 가장",
      "가장 어린 아들이 왕으로 선택되었다",
      "선지자가 찾아왔을 때 막내를 부르러 보냈다"
    ],
    138: [
      "전쟁터",
      "충성",
      "왕의 음모로 최전방에 배치된 충직한 군인",
      "동료가 싸우고 있는데 집에서 편히 쉴 수 없다고 했다",
      "자기 아내가 왕에게 빼앗긴 것을 모르고 있었다"
    ],
    139: [
      "절뚝발이",
      "왕의 식탁",
      "어릴 때 떨어져 두 발을 쓰지 못하게 된 왕손",
      "아버지의 친구 덕분에 왕의 식탁에서 먹게 되었다",
      "죽은 개 같은 자가 무슨 은혜를 받으냐고 겸손히 말했다"
    ],
    140: [
      "장군",
      "성문",
      "다윗의 군대 사령관이었던 조카",
      "왕의 명령으로 충직한 군인을 죽게 만든 공범",
      "전쟁에서는 유능했지만 권력 앞에서 잔인했다"
    ],
    141: [
      "조언",
      "목맴",
      "하느님의 신탁처럼 여겨지던 지략가",
      "자기 조언이 받아들여지지 않자 스스로 목숨을 끊었다",
      "반란에 가담해 옛 주인을 배신한 모사꾼"
    ],
    142: [
      "다락방",
      "아들",
      "선지자를 위해 방을 마련해 준 부유한 여인",
      "약속대로 아들을 얻었지만 아이가 죽었다",
      "선지자에게 달려가 아들을 다시 살려달라고 했다"
    ],
    143: [
      "전차",
      "미친 듯이",
      "미친 듯이 전차를 몰아 쿠데타를 일으킨 왕",
      "바알 숭배자들을 속여 모아놓고 처단했다",
      "이세벨의 최후를 명한 사람"
    ],
    144: [
      "왕좌",
      "학살",
      "왕의 씨를 모두 죽이고 스스로 왕이 된 여인",
      "손자 하나가 몰래 숨겨져 살아남았다",
      "6년간 통치하다 제사장의 반란으로 제거되었다"
    ],
    145: [
      "성전",
      "대관식",
      "어린 왕자를 숨겨 키운 대제사장",
      "바알 신전을 허물고 참된 예배를 회복했다",
      "130세까지 살며 왕들의 무덤에 장사되었다"
    ],
    146: [
      "화살",
      "수리",
      "일곱 살에 왕이 되어 성전을 수리한 왕",
      "은인인 제사장이 죽자 바로 타락했다",
      "헌금함을 만들어 성전 수리 기금을 모았다"
    ],
    147: [
      "우상",
      "회개",
      "유다 역사상 가장 악한 왕이었다가 회개했다",
      "성전 안에 우상을 세운 왕",
      "포로로 잡혀간 뒤 겸손해져 하느님께 돌아왔다"
    ],
    148: [
      "메뚜기",
      "성령",
      "메뚜기 떼의 재앙을 예언한 선지자",
      "내 영을 모든 사람에게 부어주겠다는 약속을 전했다",
      "여호와의 큰 날 전에 이루어질 일들을 예고했다"
    ],
    149: [
      "니느웨",
      "멸망",
      "니느웨의 멸망을 예언한 선지자",
      "잔인한 제국의 종말을 선포했다",
      "여호와는 분노가 느리시지만 결코 무죄한 자로 여기지 않으신다고 했다"
    ],
    150: [
      "성전",
      "총독",
      "포로 후 돌아와 성전 재건을 이끈 지도자",
      "큰 산아 네가 무엇이냐 평지가 되리라는 말씀을 받았다",
      "다윗 왕가의 후손으로 총독이 된 사람"
    ],
    151: [
      "집",
      "영광",
      "자기 집만 돌보고 하느님의 집은 방치한다고 꾸짖은 선지자",
      "이 성전의 나중 영광이 이전보다 크리라 예언했다",
      "백성에게 성전 건축을 재개하라고 촉구했다"
    ],
    152: [
      "태동",
      "늦은 나이",
      "나이 들어 아들을 낳은 제사장의 아내",
      "친족이 방문했을 때 뱃속의 아이가 뛰었다",
      "여인 중에 네가 복이 있다고 인사한 사람"
    ],
    153: [
      "성전",
      "여선지자",
      "성전을 떠나지 않고 밤낮으로 기도한 여선지자",
      "84세에 아기 예수를 보고 구원을 전했다",
      "과부로 오랜 세월을 하느님께 봉사했다"
    ],
    154: [
      "안다",
      "약속",
      "그리스도를 보기 전에는 죽지 않으리라는 약속을 받은 노인",
      "아기를 안고 이제 평안히 눈을 감겠다고 말했다",
      "이 아이는 많은 사람의 마음을 드러낼 것이라 예언했다"
    ],
    155: [
      "물고기",
      "형제",
      "베드로의 동생이자 처음 부름받은 제자 중 하나",
      "보리떡 다섯 개와 물고기 두 마리를 가진 소년을 데려왔다",
      "먼저 형을 찾아가 메시아를 만났다고 전했다"
    ],
    156: [
      "딸",
      "회당장",
      "딸이 죽어가자 예수의 발 앞에 엎드린 회당장",
      "아이가 죽은 게 아니라 잠자는 것이라는 말을 들었다",
      "두려워하지 말고 믿기만 하라는 격려를 받았다"
    ],
    157: [
      "키스",
      "작별",
      "시어머니에게 작별 키스를 하고 돌아간 며느리",
      "함께 가겠다고 했지만 결국 고향으로 돌아갔다",
      "동서는 시어머니를 따라갔지만 이 사람은 떠났다"
    ],
    158: [
      "꿈",
      "의인",
      "남편에게 그 의인에게 손을 대지 말라고 경고한 여인",
      "꿈에서 괴로움을 당해 남편에게 전갈을 보냈다",
      "재판 중에 급히 메시지를 전한 사람"
    ],
    159: [
      "다락방",
      "젊은이",
      "바울과 바나바의 전도 여행에 동행했다가 돌아간 청년",
      "그의 어머니 집이 초대교회의 모임 장소였다",
      "나중에 바울에게도 인정받은 동역자가 되었다"
    ],
    160: [
      "기둥",
      "무릎",
      "예수의 형제로 예루살렘 교회를 이끈 지도자",
      "기도를 너무 많이 해서 무릎이 낙타 가죽처럼 되었다고 전해진다",
      "행함이 없는 믿음은 죽은 것이라고 가르쳤다"
    ],
    161: [
      "거짓말",
      "값",
      "밭을 팔고 값의 일부를 속여 바쳤다",
      "거짓말이 드러나자 그 자리에서 쓰러졌다",
      "아내와 함께 공동체를 속인 대가를 치렀다"
    ],
    162: [
      "공모",
      "세 시간",
      "남편과 함께 거짓말한 사실이 세 시간 후 드러났다",
      "남편이 이미 죽은 줄 모르고 같은 거짓말을 했다",
      "부부가 함께 성령을 시험한 비극적인 사례"
    ],
    163: [
      "관망",
      "바리새인",
      "만일 하느님에게서 난 것이면 무너뜨릴 수 없다고 충고했다",
      "사도들을 죽이려는 산헤드린을 말린 랍비",
      "바울의 스승으로 알려진 존경받는 율법학자"
    ],
    164: [
      "벌레",
      "천사",
      "하느님의 영광을 자기 것으로 받아들이다 벌레에게 먹혀 죽은 왕",
      "야고보를 칼로 죽이고 베드로도 잡아 가둔 사람",
      "군중이 신의 소리라 외칠 때 거부하지 않았다"
    ],
    165: [
      "편지",
      "주인",
      "바울에게 도망친 종을 다시 받아달라는 편지를 받은 사람",
      "종이 아니라 형제로 받아주라는 요청을 받았다",
      "집에서 교회 모임을 열었던 부유한 그리스도인"
    ],
    166: [
      "도망",
      "유익한",
      "주인에게서 도망쳐 바울을 만나 그리스도인이 된 종",
      "이름이 '유익한'이라는 뜻이다",
      "편지 한 통과 함께 주인에게 돌아갔다"
    ],
    167: [
      "그레데",
      "질서",
      "교회의 질서를 세우라는 사명을 받은 바울의 동역자",
      "그레데 섬에서 장로를 임명하는 일을 맡았다",
      "이방인이면서 할례를 강요받지 않은 모범적 사례"
    ],
    168: [
      "골로새",
      "기도",
      "골로새 교회를 세운 것으로 알려진 전도자",
      "성도들을 위해 항상 기도하며 씨름했다",
      "바울과 함께 감옥에 갇힌 동역자"
    ]
  },
  "en": {
    1: [
      "Eden",
      "dust",
      "The first of all mankind",
      "Ate what was forbidden in the garden",
      "Named every living creature"
    ],
    2: [
      "rib",
      "serpent",
      "The mother of all living",
      "Was deceived by a talking creature",
      "Took the fruit first"
    ],
    3: [
      "shepherd",
      "offering",
      "His gift pleased God more than his brother's",
      "The first to die at another's hand",
      "His blood cried out from the ground"
    ],
    4: [
      "mark",
      "wanderer",
      "Became the first to build a city",
      "His offering was rejected",
      "Bore a sign of divine protection"
    ],
    5: [
      "walked",
      "taken",
      "Never experienced death",
      "Lived in close fellowship with God",
      "Disappeared from the earth without dying"
    ],
    6: [
      "ark",
      "flood",
      "Built something massive on dry land",
      "Saved his family through obedience",
      "Released birds to find land"
    ],
    7: [
      "blessing",
      "tent",
      "His father's blessing covered him",
      "Ancestor of many ancient nations",
      "One of three brothers who survived the flood"
    ],
    8: [
      "stars",
      "covenant",
      "Left his homeland for a promise",
      "Almost sacrificed his own son",
      "Was told his descendants would be countless"
    ],
    9: [
      "tent",
      "laughter",
      "Became a mother in old age",
      "Laughed at an impossible promise",
      "Was once taken into a foreign palace"
    ],
    10: [
      "Sodom",
      "cave",
      "Escaped a city destroyed by fire",
      "His wife looked back and was lost",
      "Chose the well-watered plain"
    ],
    11: [
      "wilderness",
      "well",
      "A servant who bore her master's child",
      "Sent away into the desert",
      "An angel found her by a spring"
    ],
    12: [
      "archer",
      "twelve",
      "Grew up in the wilderness",
      "His mother was a servant",
      "Became father of twelve princes"
    ],
    13: [
      "laughter",
      "ram",
      "His name means laughter",
      "Was bound on an altar as a boy",
      "Was nearly sacrificed by his own father"
    ],
    14: [
      "veil",
      "well",
      "Watered camels for a stranger",
      "Helped one twin deceive their father",
      "Covered her face when she first saw her husband"
    ],
    15: [
      "hunter",
      "birthright",
      "Sold something precious for a meal",
      "Was covered in red hair",
      "Lost his blessing to a disguise"
    ],
    16: [
      "ladder",
      "wrestle",
      "Dreamed of angels going up and down",
      "Wrestled all night with a mysterious figure",
      "Worked fourteen years for love"
    ],
    17: [
      "beauty",
      "sheep",
      "Died giving birth on the road",
      "Her father tricked her future husband",
      "Was loved more than her older sister"
    ],
    18: [
      "eyes",
      "unloved",
      "Bore many sons but felt unwanted",
      "Her sister was preferred over her",
      "Had weak or tender eyes"
    ],
    19: [
      "dreams",
      "coat",
      "Sold by his own brothers",
      "Rose from prison to rule a nation",
      "Wore a special garment that caused jealousy"
    ],
    20: [
      "lion",
      "staff",
      "His line carried the royal promise",
      "Mistook his daughter-in-law for a stranger",
      "Was the fourth son of his father"
    ],
    21: [
      "veil",
      "twins",
      "Disguised herself to claim justice",
      "Bore twin sons through deception",
      "Was wrongly accused but proved righteous"
    ],
    22: [
      "firstborn",
      "unstable",
      "Lost his birthright due to his actions",
      "Tried to save his youngest brother",
      "Compared to uncontrolled water"
    ],
    23: [
      "wolf",
      "youngest",
      "His birth cost his mother's life",
      "Was framed with a silver cup",
      "His older brother wept upon seeing him"
    ],
    24: [
      "patience",
      "ashes",
      "Lost everything but kept his integrity",
      "Sat among ruins scraping his skin",
      "His friends argued with him for days"
    ],
    25: [
      "tablets",
      "burning bush",
      "Raised in a palace but born a slave",
      "Struck a rock for water",
      "Spoke with God face to face"
    ],
    26: [
      "rod",
      "spokesman",
      "His staff turned into a serpent",
      "Spoke on behalf of his brother",
      "Made a golden idol for the people"
    ],
    27: [
      "tambourine",
      "song",
      "Led women in a victory dance",
      "Was struck with a skin disease for complaining",
      "Watched over her baby brother in a river"
    ],
    28: [
      "plague",
      "throne",
      "His heart was hardened repeatedly",
      "Lost his firstborn in a final judgment",
      "Refused to let an entire nation leave"
    ],
    29: [
      "plot",
      "warning",
      "Overheard a secret plan to kill",
      "Warned a relative through a commander",
      "Saved a life by reporting conspirators"
    ],
    30: [
      "priest",
      "advice",
      "A foreign priest who worshiped the true God",
      "Gave wise counsel about delegation",
      "His daughter married a great leader"
    ],
    31: [
      "swallowed",
      "rebellion",
      "The earth opened beneath his feet",
      "Challenged the appointed leadership",
      "Sought priestly authority that wasn't his"
    ],
    32: [
      "donkey",
      "curse",
      "His animal spoke to him",
      "Hired to curse but could only bless",
      "An angel blocked his path three times"
    ],
    33: [
      "grapes",
      "spy",
      "Brought back an encouraging report",
      "Was one of only two who entered the land",
      "Remained strong in old age"
    ],
    34: [
      "walls",
      "sun",
      "Made the sun stand still",
      "Led the people after Moses died",
      "Walls fell at a shout under his command"
    ],
    35: [
      "scarlet",
      "wall",
      "Hid spies on her rooftop",
      "A cord in her window saved her family",
      "Once lived in the walls of a doomed city"
    ],
    36: [
      "palm tree",
      "judge",
      "Judged Israel under a tree",
      "A woman who led in a time of war",
      "Summoned a commander to fight"
    ],
    37: [
      "lightning",
      "hesitant",
      "Refused to go to battle alone",
      "Fought alongside a female leader",
      "Lost credit for the final victory to a woman"
    ],
    38: [
      "tent peg",
      "hammer",
      "Killed an enemy commander in her tent",
      "Offered milk instead of water",
      "Drove a stake through a sleeping man's head"
    ],
    39: [
      "fleece",
      "three hundred",
      "Tested God with wool on the ground",
      "Reduced his army to a tiny force",
      "Used torches hidden inside jars"
    ],
    40: [
      "vow",
      "outcast",
      "Made a rash promise that cost him dearly",
      "Was rejected by his own brothers",
      "A daughter paid for her father's words"
    ],
    41: [
      "hair",
      "pillars",
      "His strength was in what grew on his head",
      "Brought down a building on himself",
      "Was betrayed by the woman he loved"
    ],
    42: [
      "window",
      "sleep",
      "Fell from a high place during a sermon",
      "Was brought back to life after a fall",
      "Dozed off listening to a long speech"
    ],
    43: [
      "gleaner",
      "loyalty",
      "Gathered leftover grain in a foreign field",
      "Refused to leave her mother-in-law",
      "A foreigner who became an ancestor of kings"
    ],
    44: [
      "bitter",
      "return",
      "Lost her husband and sons in a foreign land",
      "Asked to be called by a name meaning bitter",
      "Returned home empty after leaving full"
    ],
    45: [
      "field",
      "redeemer",
      "A wealthy landowner who showed kindness",
      "Spread his cloak over a woman at night",
      "Redeemed a relative's inheritance"
    ],
    46: [
      "prayer",
      "vow",
      "Prayed so fervently she was mistaken for drunk",
      "Promised her child to God's service",
      "Brought a small coat each year to the temple"
    ],
    47: [
      "anointing",
      "voice",
      "Heard God calling him as a child at night",
      "Anointed the first two kings",
      "Was raised in the temple from boyhood"
    ],
    48: [
      "blind",
      "sons",
      "His wicked sons brought shame on the priesthood",
      "Fell from his seat and died at bad news",
      "Raised a child who was not his own"
    ],
    49: [
      "donkey",
      "tall",
      "Stood head and shoulders above everyone",
      "Went looking for lost animals and found a crown",
      "Threw a spear at his own musician"
    ],
    50: [
      "harp",
      "giant",
      "A shepherd boy who became king",
      "Played music to soothe a troubled ruler",
      "Danced before the ark with all his might"
    ],
    51: [
      "giant",
      "stone",
      "Towered over an entire army",
      "Was felled by a single smooth stone",
      "Wore armor too heavy for others to carry"
    ],
    52: [
      "friendship",
      "arrow",
      "Made a covenant of deep friendship",
      "Used a signal with arrows to warn his friend",
      "His father tried to kill his closest companion"
    ],
    53: [
      "wisdom",
      "provisions",
      "Brought food to prevent bloodshed",
      "Her foolish husband nearly caused disaster",
      "Her quick thinking saved her household"
    ],
    54: [
      "rooftop",
      "seen",
      "Was seen bathing from a palace roof",
      "Her first husband was sent to die in battle",
      "Became mother of the wisest king"
    ],
    55: [
      "parable",
      "prophet",
      "Told a story about a stolen lamb",
      "Confronted a king about hidden sin",
      "Said four words that shook a ruler"
    ],
    56: [
      "hair",
      "tree",
      "His beautiful hair led to his downfall",
      "Was caught hanging from a tree branch",
      "Tried to steal his father's throne"
    ],
    57: [
      "wisdom",
      "temple",
      "Asked for wisdom instead of wealth",
      "Built a magnificent house for God",
      "Judged between two women claiming one baby"
    ],
    58: [
      "spices",
      "visit",
      "Traveled far to test a king's wisdom",
      "Brought lavish gifts of gold and perfume",
      "Said the half had not been told"
    ],
    59: [
      "foolish",
      "split",
      "His harsh words split a kingdom",
      "Rejected the counsel of the elders",
      "Kept only a fraction of his father's realm"
    ],
    60: [
      "calves",
      "sin",
      "Set up golden calves for worship",
      "Led ten tribes away from the kingdom",
      "Was the first king of the northern tribes"
    ],
    61: [
      "fire",
      "chariot",
      "Called down fire from heaven",
      "Was taken up in a fiery vehicle",
      "Fed by ravens near a brook"
    ],
    62: [
      "paint",
      "dogs",
      "Painted her face before her final moment",
      "Promoted foreign gods in the land",
      "Met a gruesome end as prophesied"
    ],
    63: [
      "vineyard",
      "sulking",
      "Wanted a neighbor's garden so badly he sulked",
      "His wife arranged a murder for land",
      "Was called out by a prophet in the vineyard"
    ],
    64: [
      "mantle",
      "bones",
      "Received his mentor's cloak",
      "Healed a foreign general's skin disease",
      "Even his remains brought someone back to life"
    ],
    65: [
      "leprosy",
      "river",
      "Dipped seven times in a river to be healed",
      "A proud commander humbled by simple instructions",
      "His healing came from washing in muddy waters"
    ],
    66: [
      "greed",
      "leprosy",
      "Chased after gifts his master refused",
      "Lied about where he had been",
      "Received the disease his master had cured"
    ],
    67: [
      "sundial",
      "tunnel",
      "Was given extra years of life",
      "The shadow moved backward as a sign",
      "Built a tunnel to bring water into the city"
    ],
    68: [
      "scroll",
      "young",
      "Found a lost sacred book during temple repairs",
      "Tore his garments when he heard the words read",
      "Began his reforms while very young"
    ],
    69: [
      "virgin",
      "coal",
      "Had his lips touched by a burning ember",
      "Prophesied about a child born of a maiden",
      "Saw the Lord seated on a high throne"
    ],
    70: [
      "tears",
      "cistern",
      "Known as the weeping prophet",
      "Was thrown into a muddy pit",
      "Told people to surrender to the enemy"
    ],
    71: [
      "wheels",
      "bones",
      "Saw a valley of dry bones come alive",
      "Described creatures with four faces",
      "Saw wheels within wheels in a vision"
    ],
    72: [
      "lions",
      "dreams",
      "Spent a night with hungry beasts",
      "Interpreted mysterious writing on a wall",
      "Refused the king's rich food"
    ],
    73: [
      "furnace",
      "three",
      "Walked through flames unharmed",
      "Refused to bow to a golden image",
      "A fourth figure appeared beside them in the fire"
    ],
    74: [
      "feast",
      "writing",
      "Saw mysterious fingers write on a wall",
      "Used sacred vessels for a drunken party",
      "His kingdom fell that very night"
    ],
    75: [
      "decree",
      "lions",
      "Was tricked into signing an irrevocable law",
      "Could not save a friend from his own order",
      "Ruled over a vast empire of many provinces"
    ],
    76: [
      "statue",
      "madness",
      "Built an enormous golden image",
      "Lived like a wild animal for years",
      "Dreamed of a great tree being cut down"
    ],
    77: [
      "unfaithful",
      "marriage",
      "Married someone who was unfaithful",
      "His family life illustrated a spiritual message",
      "Gave his children symbolic names of judgment"
    ],
    78: [
      "eloquent",
      "Alexandria",
      "A gifted speaker who knew only part of the truth",
      "Was taught more accurately by a married couple",
      "Came from a great center of learning"
    ],
    79: [
      "shepherd",
      "fig tree",
      "Was a simple farmer called to prophesy",
      "Spoke against the wealthy who oppressed the poor",
      "Declared that God does nothing without revealing it first"
    ],
    80: [
      "Edom",
      "vision",
      "Prophesied against a neighboring mountain nation",
      "Wrote the shortest book in the Hebrew scriptures",
      "Warned about pride leading to downfall"
    ],
    81: [
      "whale",
      "vine",
      "Ran away from his divine assignment",
      "Was swallowed by a great sea creature",
      "Was angry when a plant that shaded him died"
    ],
    82: [
      "Bethlehem",
      "justice",
      "Foretold that a ruler would come from a small town",
      "Spoke of doing justice and loving mercy",
      "His prophecy pinpointed a future birthplace"
    ],
    83: [
      "servant",
      "captive",
      "A young girl taken from her homeland",
      "Told her mistress about a prophet who could heal",
      "Her simple faith led to a great miracle"
    ],
    84: [
      "watchtower",
      "complaint",
      "Questioned God about why evil goes unpunished",
      "Stood on a watchtower waiting for an answer",
      "Declared he would rejoice even if everything failed"
    ],
    85: [
      "hidden",
      "judgment",
      "His name means hidden or protected",
      "Prophesied during a time of great wickedness",
      "Spoke of a day of darkness and gloom"
    ],
    86: [
      "purple",
      "merchant",
      "A businesswoman who sold expensive fabric",
      "The first convert in a European city",
      "Opened her home to traveling preachers"
    ],
    87: [
      "temple",
      "mute",
      "Was struck speechless for doubting an angel",
      "His speech returned when his son was named",
      "Served as a priest burning incense"
    ],
    88: [
      "tithes",
      "messenger",
      "Spoke about robbing God",
      "The last prophetic voice before a long silence",
      "Called for a return of the full offering"
    ],
    89: [
      "scribe",
      "law",
      "Led a group of exiles back to rebuild",
      "Was a skilled teacher of the sacred writings",
      "Tore his garments over mixed marriages"
    ],
    90: [
      "wall",
      "cup",
      "Rebuilt a city's broken walls",
      "Served wine to a foreign king",
      "Organized builders with swords at their sides"
    ],
    91: [
      "beauty",
      "banquet",
      "Won a royal beauty contest",
      "Risked her life to approach the king uninvited",
      "Saved her people from a planned massacre"
    ],
    92: [
      "gate",
      "sackcloth",
      "Sat at the palace gate and uncovered a plot",
      "Refused to bow to a high official",
      "Was honored with a royal parade through the city"
    ],
    93: [
      "gallows",
      "lots",
      "Built a tall structure for his enemy",
      "Cast lots to choose a date for destruction",
      "Was hanged on the very device he built"
    ],
    94: [
      "centurion",
      "vision",
      "A Roman soldier whose prayers were noticed by God",
      "Saw an angel telling him to send for someone",
      "The first non-Jewish household to receive the spirit"
    ],
    95: [
      "sewing",
      "gazelle",
      "Known for making clothes for the poor",
      "Was raised from the dead by an apostle",
      "Her name means gazelle in another language"
    ],
    96: [
      "carpenter",
      "cross",
      "Turned water into wine at a wedding",
      "Washed his followers' feet at supper",
      "Rose from the dead on the third day"
    ],
    97: [
      "manger",
      "pondering",
      "Treasured events and pondered them in her heart",
      "Gave birth in a place for animals",
      "Was visited by shepherds on a special night"
    ],
    98: [
      "carpenter",
      "dreams",
      "Received warnings through dreams",
      "Took his family to Egypt for safety",
      "A quiet man who obeyed without question"
    ],
    99: [
      "wilderness",
      "locusts",
      "Wore animal skins and ate insects",
      "Baptized in a river and called for repentance",
      "Was imprisoned for speaking against a ruler's marriage"
    ],
    100: [
      "rock",
      "keys",
      "Walked on water but then began to sink",
      "Denied knowing his master three times",
      "Was given the keys of authority"
    ],
    101: [
      "fig tree",
      "honest",
      "Was seen sitting under a tree before being called",
      "Was called a man with no deceit in him",
      "Asked if anything good could come from a small town"
    ],
    102: [
      "thunder",
      "sword",
      "Was one of the inner circle of three",
      "The first apostle to die by execution",
      "Called a son of thunder"
    ],
    103: [
      "beloved",
      "thunder",
      "Leaned against his teacher at the last supper",
      "Was entrusted with caring for his master's mother",
      "Exiled to an island where he received visions"
    ],
    104: [
      "chariot",
      "bread",
      "Encountered a foreign official reading scripture in a chariot",
      "Asked how five loaves could feed thousands",
      "Brought seekers to meet Jesus"
    ],
    105: [
      "fox",
      "birthday",
      "Held a birthday feast that ended in death",
      "Was called a fox by Jesus",
      "Wanted to see miracles performed for entertainment"
    ],
    106: [
      "tax",
      "banquet",
      "Left his tax booth to follow a teacher",
      "Hosted a feast for his new master",
      "Wrote a detailed account of his teacher's ancestry"
    ],
    107: [
      "doubt",
      "wounds",
      "Refused to believe without touching the evidence",
      "Offered to die alongside his teacher",
      "Put his fingers in the marks of nails"
    ],
    108: [
      "plot",
      "robes",
      "Tore his garments during a trial",
      "Orchestrated the arrest of an innocent man",
      "Held his position through political maneuvering"
    ],
    109: [
      "question",
      "heart",
      "Asked how his teacher would reveal himself",
      "One of the lesser-known among the twelve",
      "Also called by another name meaning courageous"
    ],
    110: [
      "zealot",
      "chosen",
      "Bore a title suggesting political passion",
      "One of the twelve but rarely mentioned individually",
      "Shared a name with the most famous apostle"
    ],
    111: [
      "silver",
      "kiss",
      "Betrayed with a sign of affection",
      "Carried the money bag for the group",
      "Returned his payment but could not undo his deed"
    ],
    112: [
      "tomb",
      "morning",
      "Was the first to see the risen Lord",
      "Had been freed from seven dark spirits",
      "Went to a burial place while it was still dark"
    ],
    113: [
      "serving",
      "kitchen",
      "Complained that her sister was not helping",
      "Was busy with preparations while others listened",
      "Declared her faith even in the face of death"
    ],
    114: [
      "perfume",
      "feet",
      "Poured expensive oil on her teacher's feet",
      "Sat and listened while others worked",
      "Was defended for choosing the better part"
    ],
    115: [
      "tomb",
      "four days",
      "Was called out of a grave after four days",
      "His sisters sent word that he was sick",
      "His resurrection caused many to believe"
    ],
    116: [
      "tree",
      "short",
      "Climbed a tree because he was too small to see",
      "Was a wealthy tax collector who gave half away",
      "Hosted a dinner that changed his life"
    ],
    117: [
      "night",
      "ruler",
      "Came to ask questions under cover of darkness",
      "A religious leader who defended Jesus in council",
      "Helped prepare a body for burial with expensive spices"
    ],
    118: [
      "massacre",
      "star",
      "Ordered the killing of infant boys",
      "Was visited by wise men from the east",
      "Feared losing his throne to a newborn"
    ],
    119: [
      "hands",
      "judge",
      "Washed his hands to claim innocence",
      "Found no fault but gave in to the crowd",
      "Asked a famous question about truth"
    ],
    120: [
      "lots",
      "replaced",
      "Was chosen by drawing lots",
      "Replaced a traitor among the twelve",
      "Had been a witness from the very beginning"
    ],
    121: [
      "shipwreck",
      "letters",
      "Was blinded by a light on the road",
      "Wrote many letters from prison",
      "Survived a shipwreck on the way to trial"
    ],
    122: [
      "encourager",
      "Cyprus",
      "Was known as the son of encouragement",
      "Sold a field and gave the money away",
      "Gave a rejected man a second chance"
    ],
    123: [
      "stones",
      "face",
      "His face shone like an angel during his trial",
      "Was the first follower to be killed for his faith",
      "Forgave his attackers as stones struck him"
    ],
    124: [
      "chariot",
      "Samaria",
      "Explained scripture to a traveler in a chariot",
      "Brought revival to a region despised by many",
      "Was transported away by the spirit after a baptism"
    ],
    125: [
      "grandmother",
      "youth",
      "Was mentored by an older spiritual leader",
      "Received letters of personal instruction",
      "Was told not to let anyone look down on his youth"
    ],
    126: [
      "physician",
      "detail",
      "A doctor who wrote an orderly account",
      "Accompanied a missionary on dangerous journeys",
      "Addressed his writings to a man named Theophilus"
    ],
    127: [
      "tentmakers",
      "couple",
      "A married couple who worked with leather",
      "Taught a gifted speaker more accurately",
      "Risked their lives for a fellow worker"
    ],
    128: [
      "prison",
      "singing",
      "Sang hymns in prison at midnight",
      "An earthquake opened his cell doors",
      "Traveled with an apostle on missionary journeys"
    ],
    129: [
      "oldest",
      "long life",
      "Lived longer than any other recorded person",
      "Died in the same year the great flood came",
      "His name is synonymous with extreme old age"
    ],
    130: [
      "flood",
      "brother",
      "One of three sons who entered the ark",
      "His descendants spread to distant coastlands",
      "Shared the boat with every kind of animal"
    ],
    131: [
      "bread",
      "king",
      "A mysterious priest-king with no recorded ancestry",
      "Brought out bread and wine to bless a victor",
      "His priesthood was compared to an eternal one"
    ],
    132: [
      "bird",
      "inn",
      "Her father was a priest of a foreign land",
      "Met her future husband at a well",
      "Performed a rite that saved her husband's life on the road"
    ],
    133: [
      "spear",
      "zeal",
      "Drove a spear through two people at once",
      "His bold action stopped a deadly plague",
      "Was rewarded with a covenant of peace"
    ],
    134: [
      "Jericho",
      "hidden",
      "Hid forbidden plunder under his tent",
      "His secret sin caused a military defeat",
      "Was exposed by a process of elimination"
    ],
    135: [
      "bramble",
      "seventy",
      "Killed seventy of his own brothers",
      "Was compared to a worthless thornbush",
      "Died when a woman dropped a stone on his head"
    ],
    136: [
      "secret",
      "betrayal",
      "Lured a strong man into revealing his weakness",
      "Persisted until she discovered the source of his power",
      "Was paid silver to deliver her lover to his enemies"
    ],
    137: [
      "Bethlehem",
      "father",
      "A farmer from a small town",
      "Father of the greatest king",
      "Had eight sons and the youngest was chosen"
    ],
    138: [
      "loyalty",
      "battlefield",
      "A faithful soldier placed in the front lines to die",
      "His wife was taken while he was away at war",
      "Refused comfort while his comrades were fighting"
    ],
    139: [
      "lame",
      "table",
      "Was crippled in both feet since childhood",
      "Ate at the king's table for his father's sake",
      "Was dropped by a nurse while fleeing as a child"
    ],
    140: [
      "commander",
      "cunning",
      "A fierce military leader who served the king",
      "Killed a rival commander during a greeting",
      "Was too clever for his own good in the end"
    ],
    141: [
      "counsel",
      "traitor",
      "His advice was considered like the word of God",
      "Switched sides during a rebellion",
      "Took his own life when his counsel was rejected"
    ],
    142: [
      "hospitality",
      "room",
      "Built a guest room for a traveling prophet",
      "Her son died and was brought back to life",
      "Was promised a son though her husband was old"
    ],
    143: [
      "chariot",
      "fury",
      "Drove his chariot like a madman",
      "Was anointed to destroy a wicked royal house",
      "Threw a queen from a window"
    ],
    144: [
      "throne",
      "massacre",
      "Seized the throne after her son died",
      "Tried to destroy the entire royal line",
      "The only ruling queen in the southern kingdom"
    ],
    145: [
      "priest",
      "temple",
      "Hid a young prince in the temple for six years",
      "Overthrew a wicked queen and restored the rightful king",
      "Made a covenant between God, king, and people"
    ],
    146: [
      "arrow",
      "repair",
      "Was hidden as a baby to save his life",
      "Repaired the temple but later turned away from God",
      "Was assassinated by his own officials"
    ],
    147: [
      "wicked",
      "repentance",
      "The most wicked king who later repented",
      "Was taken captive with hooks and chains",
      "Reversed his evil ways after being humbled"
    ],
    148: [
      "locusts",
      "spirit",
      "Described a devastating locust invasion",
      "Called for repentance with fasting and weeping",
      "Prophesied an outpouring of the spirit on all people"
    ],
    149: [
      "Nineveh",
      "lion",
      "Prophesied the fall of a great enemy city",
      "Used the image of a lion's den being emptied",
      "Brought comfort to those long oppressed"
    ],
    150: [
      "foundation",
      "governor",
      "Laid the foundation for the rebuilt temple",
      "Led a group of exiles back to their homeland",
      "Was appointed governor of the restored province"
    ],
    151: [
      "temple",
      "shake",
      "Urged the people to rebuild God's house",
      "Asked why they lived in fine houses while the temple lay in ruins",
      "Prophesied that the glory of the new house would surpass the old"
    ],
    152: [
      "barren",
      "old",
      "Became pregnant in her old age",
      "Her baby leaped inside her at a visitor's greeting",
      "Was a relative of the mother of Jesus"
    ],
    153: [
      "temple",
      "widow",
      "An elderly widow who never left the temple",
      "Recognized the promised child when he was presented",
      "Had served God with fasting and prayer for decades"
    ],
    154: [
      "arms",
      "peace",
      "Held the baby and said he could now die in peace",
      "Was promised he would see the Messiah before death",
      "Blessed the parents and spoke of a sword piercing the mother's heart"
    ],
    155: [
      "fisherman",
      "brother",
      "Was the first disciple called to follow",
      "Brought his brother to meet the teacher",
      "Was a fisherman before he left his nets"
    ],
    156: [
      "daughter",
      "twelve",
      "Fell at a teacher's feet begging for his dying child",
      "His twelve-year-old daughter was raised from death",
      "Was a leader of the local synagogue"
    ],
    157: [
      "departure",
      "crossroads",
      "Kissed her mother-in-law goodbye and turned back",
      "Chose to return to her own people and gods",
      "Stood at a crossroads and made the opposite choice of her sister-in-law"
    ],
    158: [
      "dream",
      "warning",
      "Sent a message warning about an innocent man",
      "Had a troubling dream about a prisoner on trial",
      "Her words were ignored by her husband"
    ],
    159: [
      "ran away",
      "cousin",
      "Left a dangerous journey and went home",
      "Later proved himself faithful and useful",
      "Wrote an account focusing on a servant's deeds"
    ],
    160: [
      "brother",
      "pillar",
      "Was a brother of the Lord but did not believe at first",
      "Became a pillar of the early community",
      "Wrote a letter about faith and works"
    ],
    161: [
      "lie",
      "death",
      "Lied about the price of property they sold",
      "Dropped dead after being confronted about deception",
      "Conspired with a spouse to hold back money"
    ],
    162: [
      "conspiracy",
      "sudden",
      "Agreed with her husband to deceive the community",
      "Was given a chance to tell the truth but lied",
      "Met the same sudden fate as her spouse"
    ],
    163: [
      "teacher",
      "caution",
      "Advised the council to wait and see",
      "A respected teacher of the law",
      "Warned that fighting against God's work would fail"
    ],
    164: [
      "sword",
      "worms",
      "Executed an apostle with a sword",
      "Accepted worship as if he were a god",
      "Was struck down for not giving glory to God"
    ],
    165: [
      "slave",
      "letter",
      "Received a personal letter asking a favor",
      "Was asked to welcome back a runaway as a brother",
      "A wealthy man whose house served as a meeting place"
    ],
    166: [
      "runaway",
      "useful",
      "A slave who ran away from his master",
      "Became spiritually transformed while away",
      "His name means useful and he finally lived up to it"
    ],
    167: [
      "Crete",
      "order",
      "Was left on an island to set things in order",
      "Appointed leaders in every town",
      "Received instructions about dealing with divisive people"
    ],
    168: [
      "prayer",
      "Colossae",
      "Wrestled in prayer for distant believers",
      "Represented a community he deeply cared for",
      "Was commended as a faithful servant by an apostle"
    ]
  },
  "zh": {
    1: [
      "伊甸",
      "尘土",
      "全人类的起源",
      "在园中吃了禁物",
      "亲自给妻子起名"
    ],
    2: [
      "禁果",
      "肋骨",
      "被蛇所诱惑",
      "第一位母亲",
      "与丈夫一同被逐出乐园"
    ],
    3: [
      "牧羊",
      "祭物",
      "献上头生的羊",
      "被至亲所害",
      "血从地里发出呼声"
    ],
    4: [
      "农夫",
      "记号",
      "祭物未蒙悦纳",
      "流浪在地上",
      "杀害了自己的兄弟"
    ],
    5: [
      "行走",
      "升天",
      "与上帝同行三百年",
      "未曾经历死亡",
      "活了三百六十五岁"
    ],
    6: [
      "方舟",
      "洪水",
      "建造了巨大的船",
      "带动物成对上船",
      "用鸽子探测陆地"
    ],
    7: [
      "长子",
      "帐篷",
      "洪水后的祝福",
      "父亲醉酒时尊重他",
      "弥赛亚的族谱经过他"
    ],
    8: [
      "迦南",
      "星辰",
      "离开本族本地",
      "百岁得子",
      "被称为信心之父"
    ],
    9: [
      "帐篷",
      "欢笑",
      "九十岁怀孕生子",
      "曾对应许发笑",
      "最初叫撒莱"
    ],
    10: [
      "所多玛",
      "盐柱",
      "住在罪恶之城",
      "天使拉着他的手逃离",
      "妻子回头变成盐柱"
    ],
    11: [
      "使女",
      "旷野",
      "主母苦待她",
      "在旷野中遇见天使",
      "为主人生了一个儿子"
    ],
    12: [
      "弓箭",
      "旷野",
      "母亲是埃及使女",
      "成为大国之父",
      "住在巴兰旷野"
    ],
    13: [
      "燔祭",
      "祝福",
      "父亲举刀要杀他",
      "在田间默想时遇见妻子",
      "眼睛昏花时被骗"
    ],
    14: [
      "井旁",
      "水瓶",
      "在井旁打水遇见仆人",
      "偏爱小儿子",
      "帮小儿子骗取祝福"
    ],
    15: [
      "红豆汤",
      "猎人",
      "为一碗汤卖了长子名分",
      "浑身是毛",
      "与弟弟和好拥抱"
    ],
    16: [
      "天梯",
      "摔跤",
      "在伯特利梦见梯子",
      "与天使摔跤到天亮",
      "被改名为以色列"
    ],
    17: [
      "美貌",
      "牧羊",
      "在井旁遇见未来丈夫",
      "为丈夫劳作十四年",
      "临死生下小儿子"
    ],
    18: [
      "姐姐",
      "眼睛",
      "因眼睛柔弱被记载",
      "代替妹妹成新娘",
      "生了六个儿子"
    ],
    19: [
      "彩衣",
      "异梦",
      "穿彩色外衣的少年",
      "被兄弟卖到埃及",
      "成为埃及宰相"
    ],
    20: [
      "狮子",
      "王族",
      "用印和杖作当头",
      "弥赛亚出自他的支派",
      "愿代替弟弟留下"
    ],
    21: [
      "面纱",
      "双生",
      "假扮身份在路旁等候",
      "生了一对双胞胎",
      "公公不认识她"
    ],
    22: [
      "长子",
      "水池",
      "与父亲的妾同寝",
      "劝弟弟们不要杀约瑟",
      "失去了长子名分"
    ],
    23: [
      "幼子",
      "银杯",
      "母亲生他时难产而死",
      "银杯藏在他口袋里",
      "哥哥流泪拥抱他"
    ],
    24: [
      "苦难",
      "灰烬",
      "失去一切仍不犯罪",
      "坐在炉灰中刮疮",
      "最终得到双倍祝福"
    ],
    25: [
      "燃烧",
      "石板",
      "从水中被救起",
      "在燃烧的荆棘前脱鞋",
      "带领百姓出埃及"
    ],
    26: [
      "杖变蛇",
      "金牛犊",
      "说自己口才不好",
      "杖变成了蛇",
      "铸造了金牛犊"
    ],
    27: [
      "鼓",
      "歌唱",
      "在海边击鼓跳舞",
      "因说闲话长了大麻风",
      "看守弟弟的摇篮"
    ],
    28: [
      "十灾",
      "追赶",
      "心刚硬不让人走",
      "国中遭受十灾",
      "追到海边军队覆没"
    ],
    29: [
      "阴谋",
      "警告",
      "听到暗杀计划",
      "把消息告诉亲人",
      "救了舅舅的性命"
    ],
    30: [
      "祭司",
      "旷野",
      "牧羊时遇见女婿",
      "提出管理百姓的建议",
      "米甸的祭司"
    ],
    31: [
      "香炉",
      "地裂",
      "反叛领袖的权威",
      "地开口吞灭他家",
      "带二百五十人作乱"
    ],
    32: [
      "驴子",
      "咒诅",
      "驴子开口说话",
      "被请去咒诅以色列",
      "三次被天使拦阻"
    ],
    33: [
      "葡萄",
      "勇气",
      "四十五岁去窥探迦南",
      "带回巨大的葡萄",
      "八十五岁仍有力量"
    ],
    34: [
      "城墙",
      "太阳",
      "绕城七日城墙倒塌",
      "命令太阳停住",
      "窥探迦南地的首领"
    ],
    35: [
      "红绳",
      "城墙",
      "住在城墙上",
      "窗户上挂红绳得救",
      "隐藏了两个探子"
    ],
    36: [
      "棕榈树",
      "女士师",
      "坐在棕榈树下审判",
      "以色列唯一的女士师",
      "与将军一起出征"
    ],
    37: [
      "闪电",
      "将军",
      "名字意为闪电",
      "需要女士师陪同出征",
      "一万人跟随他上山"
    ],
    38: [
      "帐篷钉",
      "牛奶",
      "用帐篷钉杀敌军将领",
      "给逃跑的将军喝奶",
      "在帐篷中完成使命"
    ],
    39: [
      "羊毛",
      "火把",
      "用羊毛试验上帝",
      "三百人用火把和号角",
      "拆毁了巴力的祭坛"
    ],
    40: [
      "许愿",
      "女儿",
      "流浪者成为领袖",
      "许下轻率的誓言",
      "女儿迎接他跳舞"
    ],
    41: [
      "长发",
      "力量",
      "头发是力量的来源",
      "徒手撕裂狮子",
      "推倒柱子与敌同亡"
    ],
    42: [
      "窗台",
      "睡着",
      "从三楼掉下去",
      "听讲道时睡着",
      "死后被救活"
    ],
    43: [
      "麦田",
      "忠诚",
      "在田间拾取麦穗",
      "不离弃婆婆",
      "外邦女子嫁入以色列"
    ],
    44: [
      "苦涩",
      "归回",
      "失去丈夫和两个儿子",
      "从摩押地回伯利恒",
      "让人改叫她玛拉"
    ],
    45: [
      "麦田",
      "鞋子",
      "让她在田间拾穗",
      "脱鞋为赎买凭据",
      "近亲救赎者"
    ],
    46: [
      "祷告",
      "许愿",
      "在殿中默祷被误为醉酒",
      "许愿将儿子献给上帝",
      "每年做小外袍送给儿子"
    ],
    47: [
      "膏油",
      "呼唤",
      "夜间听到呼唤声",
      "膏立了以色列第一位王",
      "从小在圣殿服事"
    ],
    48: [
      "灯台",
      "眼花",
      "儿子作恶他不管教",
      "从座位上跌落而死",
      "听到约柜被掳的消息"
    ],
    49: [
      "膏立",
      "嫉妒",
      "以色列第一位王",
      "嫉妒牧童的歌声",
      "去找交鬼的妇人"
    ],
    50: [
      "竖琴",
      "牧童",
      "弹琴驱赶恶灵",
      "用甩石打倒巨人",
      "是合神心意的王"
    ],
    51: [
      "巨人",
      "铜盔",
      "身高六肘零一虎口",
      "被一颗石子击倒",
      "向以色列军队叫阵"
    ],
    52: [
      "盟约",
      "弓箭",
      "与牧童结盟",
      "用箭传递暗号",
      "为朋友冒生命危险"
    ],
    53: [
      "聪明",
      "食物",
      "带着食物去迎接",
      "丈夫是愚顽人",
      "成为王的妻子"
    ],
    54: [
      "屋顶",
      "沐浴",
      "在屋顶被王看见",
      "丈夫被设计送死",
      "所罗门的母亲"
    ],
    55: [
      "比喻",
      "先知",
      "用穷人羊羔的故事",
      "指出王的罪",
      "对王说你就是那人"
    ],
    56: [
      "头发",
      "叛逆",
      "骑骡子头发挂在树上",
      "俊美却叛逆父亲",
      "为自己立了柱子"
    ],
    57: [
      "智慧",
      "圣殿",
      "求智慧不求财富",
      "建造了第一座圣殿",
      "审判两个母亲争子"
    ],
    58: [
      "财宝",
      "远方",
      "带着香料和金子来访",
      "从远方来试问智慧",
      "看到一切心中惊叹"
    ],
    59: [
      "分裂",
      "鞭子",
      "不听老臣的忠告",
      "用更重的鞭子待百姓",
      "王国在他手中分裂"
    ],
    60: [
      "金牛犊",
      "分裂",
      "设立两个金牛犊",
      "成为北国第一位王",
      "使以色列人犯罪"
    ],
    61: [
      "火车",
      "乌鸦",
      "乌鸦叼饼和肉喂他",
      "从天上降火",
      "乘火车火马升天"
    ],
    62: [
      "邪恶",
      "王后",
      "引进巴力崇拜",
      "要杀害所有先知",
      "最终从窗户被扔下"
    ],
    63: [
      "葡萄园",
      "偶像",
      "贪图邻舍的葡萄园",
      "被邪恶妻子引诱",
      "拜偶像的北国王"
    ],
    64: [
      "外套",
      "双倍",
      "接住了老师的外套",
      "要求双倍的灵",
      "使铁斧头浮在水面"
    ],
    65: [
      "大麻风",
      "河水",
      "在约旦河洗了七次",
      "外国将军得了洁净",
      "开始只带了礼物来"
    ],
    66: [
      "贪心",
      "仆人",
      "追赶客人索取礼物",
      "向主人撒谎",
      "贪财而得了大麻风"
    ],
    67: [
      "日晷",
      "祷告",
      "日影后退十度",
      "祷告得延寿十五年",
      "引水入城的隧道"
    ],
    68: [
      "律法书",
      "修殿",
      "修圣殿时发现律法书",
      "八岁登基的好王",
      "拆毁偶像祭坛"
    ],
    69: [
      "嘴唇",
      "以马内利",
      "看见上帝坐在宝座上",
      "火炭沾他的嘴唇",
      "预言童女怀孕生子"
    ],
    70: [
      "眼泪",
      "监牢",
      "流泪的先知",
      "被投入泥泞的水牢",
      "预言七十年被掳"
    ],
    71: [
      "异象",
      "枯骨",
      "看见枯骨复活的异象",
      "吃了书卷",
      "看见四活物的异象"
    ],
    72: [
      "狮子坑",
      "异梦",
      "被扔进狮子坑",
      "解开墙上文字的意思",
      "在异邦坚持祷告"
    ],
    73: [
      "火窑",
      "拒绝",
      "被扔进火窑",
      "拒绝拜金像",
      "火中出现第四个人"
    ],
    74: [
      "宴会",
      "文字",
      "大摆宴席用圣殿器皿",
      "墙上出现神秘文字",
      "当夜被杀"
    ],
    75: [
      "法令",
      "狮子",
      "被迫签署禁令",
      "喜爱忠臣却无力救他",
      "最终承认真神"
    ],
    76: [
      "金像",
      "野兽",
      "造了巨大的金像",
      "吃草如牛七年",
      "攻灭耶路撒冷"
    ],
    77: [
      "婚姻",
      "不忠",
      "娶不忠的妻子",
      "用婚姻比喻背约",
      "以爱挽回妻子"
    ],
    78: [
      "雄辩",
      "亚历山大",
      "来自亚历山大的学者",
      "大有口才引用圣经",
      "受了夫妇指教后更准确"
    ],
    79: [
      "牧人",
      "公义",
      "修剪桑树的牧人",
      "被呼召成为先知",
      "宣告对列国的审判"
    ],
    80: [
      "仆人",
      "以东",
      "最短的先知书",
      "预言以东的结局",
      "隐藏了一百个先知"
    ],
    81: [
      "大鱼",
      "植物",
      "在鱼腹中三天三夜",
      "逃往他施躲避使命",
      "为一棵蓖麻发怒"
    ],
    82: [
      "伯利恒",
      "公义",
      "预言弥赛亚生在小城",
      "行公义好怜悯",
      "与以赛亚同时代"
    ],
    83: [
      "仆人",
      "建议",
      "被掳到外邦为奴",
      "建议主人去找先知",
      "小女孩改变将军命运"
    ],
    84: [
      "了望",
      "信心",
      "站在了望台上等候",
      "义人因信而活",
      "质问上帝为何容许恶"
    ],
    85: [
      "审判",
      "欢呼",
      "宣告耶路撒冷的审判",
      "预言上帝要欢呼喜乐",
      "约西亚时代的先知"
    ],
    86: [
      "紫色",
      "河边",
      "在河边听道信主",
      "卖紫色布匹的商人",
      "第一个欧洲信徒"
    ],
    87: [
      "圣殿",
      "异象",
      "鼓励百姓重建圣殿",
      "看见金灯台和橄榄树",
      "预言王骑驴进城"
    ],
    88: [
      "十分之一",
      "使者",
      "旧约最后一位先知",
      "斥责不交十分之一",
      "预言以利亚要来"
    ],
    89: [
      "律法",
      "抄写",
      "精通律法的文士",
      "带领百姓学习律法",
      "从巴比伦回归"
    ],
    90: [
      "城墙",
      "酒政",
      "重建耶路撒冷城墙",
      "曾是波斯王的酒政",
      "五十二天建成城墙"
    ],
    91: [
      "王后",
      "勇气",
      "若死就死吧",
      "隐藏民族身份入宫",
      "宴会上揭露阴谋"
    ],
    92: [
      "城门",
      "忠诚",
      "坐在王宫门前",
      "不肯向恶人跪拜",
      "养大了孤女侄女"
    ],
    93: [
      "木架",
      "骄傲",
      "造了高大的木架",
      "抽签决定灭族日期",
      "最终挂在自己造的架上"
    ],
    94: [
      "百夫长",
      "异象",
      "虔诚的外邦军官",
      "看见天使的异象",
      "第一个受洗的外邦人"
    ],
    95: [
      "针线",
      "善行",
      "做了许多善事和衣裳",
      "死后被复活",
      "又名大比大"
    ],
    96: [
      "十字架",
      "复活",
      "在水上行走",
      "用五饼二鱼喂饱众人",
      "第三天从死里复活"
    ],
    97: [
      "马槽",
      "宝剑",
      "在马棚中生下婴孩",
      "心被刀刺透",
      "在迦拿婚宴上"
    ],
    98: [
      "木匠",
      "梦境",
      "天使在梦中向他显现",
      "带家人逃往埃及",
      "拿撒勒的木匠"
    ],
    99: [
      "旷野",
      "蝗虫",
      "在旷野吃蝗虫野蜜",
      "为弥赛亚预备道路",
      "被关进监狱斩首"
    ],
    100: [
      "渔夫",
      "磐石",
      "在水上行走又沉下去",
      "三次不认主",
      "拿着天国的钥匙"
    ],
    101: [
      "无花果树",
      "真诚",
      "在无花果树下被看见",
      "心里没有诡诈",
      "起初质疑拿撒勒"
    ],
    102: [
      "雷子",
      "渔网",
      "被称为雷子之一",
      "想从天上降火",
      "第一个殉道的使徒"
    ],
    103: [
      "雷子",
      "爱",
      "靠在老师胸前",
      "被称为爱的使徒",
      "在拔摩岛写下异象"
    ],
    104: [
      "饼",
      "计算",
      "带领埃塞俄比亚太监",
      "对五千人说饼不够",
      "在撒玛利亚传道"
    ],
    105: [
      "狐狸",
      "舞蹈",
      "被称为狐狸",
      "因舞蹈许下承诺",
      "下令斩首先知"
    ],
    106: [
      "税关",
      "筵席",
      "坐在税关上被呼召",
      "为老师摆设筵席",
      "写了第一卷福音书"
    ],
    107: [
      "怀疑",
      "伤痕",
      "要看见才肯相信",
      "摸了复活者的伤痕",
      "后来到印度传道"
    ],
    108: [
      "大祭司",
      "预言",
      "当年的大祭司",
      "无意中说了预言",
      "在审判中撕裂衣服"
    ],
    109: [
      "安静",
      "使徒",
      "又名犹大不是加略人",
      "十二使徒中较少记载",
      "问了关于显现的问题"
    ],
    110: [
      "热心",
      "使徒",
      "被称为热心党的人",
      "十二使徒之一",
      "跟从了新的道路"
    ],
    111: [
      "钱袋",
      "亲吻",
      "管理钱袋却偷取",
      "以亲吻出卖老师",
      "三十块银币的代价"
    ],
    112: [
      "清晨",
      "墓园",
      "第一个看见复活的人",
      "清晨去到坟墓",
      "曾被赶出七个鬼"
    ],
    113: [
      "厨房",
      "忙碌",
      "在厨房忙碌服事",
      "抱怨妹妹不帮忙",
      "相信朋友能复活"
    ],
    114: [
      "膏油",
      "脚前",
      "用香膏抹老师的脚",
      "坐在老师脚前听道",
      "打碎了玉瓶"
    ],
    115: [
      "坟墓",
      "复活",
      "死了四天被叫出坟墓",
      "姐姐们哭着求救",
      "被裹着布走出来"
    ],
    116: [
      "桑树",
      "矮小",
      "爬上桑树要看耶稣",
      "身材矮小的税吏长",
      "把一半家产给穷人"
    ],
    117: [
      "夜晚",
      "重生",
      "夜里来访问老师",
      "听到必须重生",
      "带香料安葬耶稣"
    ],
    118: [
      "屠杀",
      "星星",
      "下令杀害伯利恒婴孩",
      "东方博士来见他",
      "重建了圣殿"
    ],
    119: [
      "洗手",
      "审判",
      "在众人面前洗手",
      "查不出他的罪来",
      "妻子做梦警告他"
    ],
    120: [
      "抽签",
      "替补",
      "抽签被选为使徒",
      "替补出卖者的位置",
      "一直跟随从受洗到升天"
    ],
    121: [
      "书信",
      "转变",
      "从迫害者变为传道者",
      "在大马色路上失明",
      "写了最多的书信"
    ],
    122: [
      "鼓励",
      "同工",
      "被称为劝慰之子",
      "变卖田产奉献",
      "带领新人踏上旅途"
    ],
    123: [
      "石头",
      "荣光",
      "第一位殉道者",
      "满面发光如天使",
      "被石头打死时祷告"
    ],
    124: [
      "旷野",
      "马车",
      "在旷野路上遇见马车",
      "为太监解释经文",
      "被灵带到别处"
    ],
    125: [
      "年轻",
      "书信",
      "从小学习圣经",
      "被称为真儿子",
      "母亲和外祖母教导他"
    ],
    126: [
      "医生",
      "详细",
      "是一位医生",
      "详细考查写下记录",
      "陪伴到最后的同伴"
    ],
    127: [
      "帐篷",
      "夫妻",
      "以制造帐篷为业",
      "夫妻同心教导真理",
      "冒着生命危险帮助人"
    ],
    128: [
      "监狱",
      "歌唱",
      "在监狱中唱歌赞美",
      "地震使监门大开",
      "忠实的旅行同伴"
    ],
    129: [
      "长寿",
      "等待",
      "活了九百六十九岁",
      "圣经中最长寿的人",
      "在洪水那年去世"
    ],
    130: [
      "海洋",
      "扩张",
      "名字意为扩张",
      "挪亚的第三个儿子",
      "沿海的民族出自他"
    ],
    131: [
      "饼和酒",
      "祭司",
      "没有族谱的祭司",
      "带出饼和酒祝福",
      "至高上帝的祭司"
    ],
    132: [
      "割礼",
      "旅途",
      "在路上替儿子行割礼",
      "救了丈夫的性命",
      "米甸祭司的女儿"
    ],
    133: [
      "枪",
      "热心",
      "用枪刺穿犯罪之人",
      "为上帝大发热心",
      "止住了瘟疫"
    ],
    134: [
      "隐藏",
      "外衣",
      "私藏了当灭之物",
      "金子和外衣藏在帐篷下",
      "全家因此受罚"
    ],
    135: [
      "荆棘",
      "残忍",
      "基甸的儿子夺权",
      "杀了七十个兄弟",
      "被妇人用磨石击中"
    ],
    136: [
      "剪刀",
      "诱惑",
      "三次试探力士的秘密",
      "剪去了他的头发",
      "用甜言蜜语套出真相"
    ],
    137: [
      "伯利恒",
      "儿子",
      "有八个儿子",
      "最小的儿子被膏立为王",
      "伯利恒的老人"
    ],
    138: [
      "忠诚",
      "战场",
      "忠心的外族战士",
      "被安排在最前线",
      "即使有机会也不回家享乐"
    ],
    139: [
      "跛脚",
      "恩典",
      "双脚残疾",
      "在王的桌前吃饭",
      "为了父亲的缘故被善待"
    ],
    140: [
      "元帅",
      "诡计",
      "用拥抱暗杀对手",
      "攻城夺地的勇士",
      "违抗王命杀了叛逆者"
    ],
    141: [
      "谋士",
      "背叛",
      "智慧如神的谋士",
      "背叛了自己的主人",
      "计策不被采纳后自尽"
    ],
    142: [
      "客房",
      "孩子",
      "为先知预备阁楼客房",
      "儿子暴毙后求先知",
      "孩子打了七个喷嚏复活"
    ],
    143: [
      "战车",
      "疯狂",
      "驾车如疯狂的人",
      "消灭了全部巴力崇拜者",
      "被膏立为以色列王"
    ],
    144: [
      "篡位",
      "屠杀",
      "杀害王室后代夺权",
      "唯一的犹大女王",
      "在圣殿门口被处死"
    ],
    145: [
      "修复",
      "大祭司",
      "藏匿王子保住血脉",
      "主持修复圣殿",
      "活到一百三十岁的大祭司"
    ],
    146: [
      "修殿",
      "箭",
      "被藏匿的王子",
      "修复了圣殿",
      "大祭司死后转离正道"
    ],
    147: [
      "悔改",
      "偶像",
      "在位期间极其邪恶",
      "被掳后真心悔改",
      "使犹大陷入偶像崇拜"
    ],
    148: [
      "蝗虫",
      "圣灵",
      "蝗灾的异象",
      "预言圣灵浇灌万人",
      "呼吁百姓归向上帝"
    ],
    149: [
      "尼尼微",
      "毁灭",
      "预言大城的毁灭",
      "上帝是忌邪施报的",
      "安慰受压迫的百姓"
    ],
    150: [
      "根基",
      "总督",
      "重建圣殿的总督",
      "带领第一批回归者",
      "大卫的后裔"
    ],
    151: [
      "圣殿",
      "催促",
      "催促百姓建殿",
      "责备只顾自己房屋",
      "与所罗巴伯同期的先知"
    ],
    152: [
      "老年",
      "怀孕",
      "老年怀孕生子",
      "丈夫因不信而哑口",
      "亲戚来访婴孩在腹中跳动"
    ],
    153: [
      "圣殿",
      "等候",
      "在圣殿中等了许多年",
      "八十四岁的女先知",
      "看见婴孩就感谢上帝"
    ],
    154: [
      "婴孩",
      "安息",
      "抱着婴孩说可以安息了",
      "等候以色列的安慰者",
      "圣灵指示他不死前必看见"
    ],
    155: [
      "渔网",
      "兄弟",
      "先跟随了施洗者",
      "把哥哥带来见老师",
      "五饼二鱼的男孩是他找到的"
    ],
    156: [
      "女儿",
      "跪下",
      "跪求医治十二岁女儿",
      "被告知女儿已死",
      "只要信不要怕"
    ],
    157: [
      "离别",
      "亲吻",
      "与婆婆吻别离去",
      "回到自己的本族",
      "选择了不同于妯娌的路"
    ],
    158: [
      "噩梦",
      "警告",
      "做了不安的梦",
      "差人警告丈夫",
      "那义人的事你不可管"
    ],
    159: [
      "年轻人",
      "逃跑",
      "逃跑时丢了麻布",
      "是巴拿巴的表弟",
      "写了最短的福音书"
    ],
    160: [
      "兄弟",
      "教会",
      "耶稣的亲弟弟",
      "起初不信后来相信",
      "写了关于信心与行为的书信"
    ],
    161: [
      "欺骗",
      "倒地",
      "卖了田产却私藏价银",
      "在使徒面前说谎",
      "听到责备就倒地死了"
    ],
    162: [
      "同谋",
      "倒地",
      "与丈夫同谋说谎",
      "三小时后进来",
      "不知丈夫已死也说了同样的谎"
    ],
    163: [
      "法利赛人",
      "忠告",
      "受人尊敬的法利赛人",
      "劝公会谨慎行事",
      "若出于上帝就不能推翻"
    ],
    164: [
      "虫咬",
      "荣耀",
      "被虫咬死",
      "接受百姓称他为神",
      "杀害了使徒雅各"
    ],
    165: [
      "书信",
      "主人",
      "保罗写信给他",
      "被请求接纳逃奴",
      "歌罗西的信徒"
    ],
    166: [
      "逃跑",
      "有用",
      "从主人家逃跑的奴隶",
      "名字意为有用的人",
      "信主后被送回去"
    ],
    167: [
      "克里特",
      "秩序",
      "被留在克里特建立教会",
      "设立长老治理教会",
      "保罗的真儿子"
    ],
    168: [
      "代祷",
      "歌罗西",
      "为教会多多祷告",
      "歌罗西教会的创建者",
      "保罗称他为忠心的仆人"
    ]
  },
  "zh-TW": {
    1: [
      "伊甸",
      "尘土",
      "全人类的起源",
      "在園中吃了禁物",
      "親自給妻子起名"
    ],
    2: [
      "禁果",
      "肋骨",
      "被蛇所诱惑",
      "第一位母親",
      "與丈夫一同被逐出樂園"
    ],
    3: [
      "牧羊",
      "祭物",
      "獻上頭生的羊",
      "被至親所害",
      "血從地里髮出呼聲"
    ],
    4: [
      "农夫",
      "记號",
      "祭物未蒙悦纳",
      "流浪在地上",
      "殺害了自己的兄弟"
    ],
    5: [
      "行走",
      "升天",
      "與上帝同行三百年",
      "未曾經歷死亡",
      "活了三百六十五岁"
    ],
    6: [
      "方舟",
      "洪水",
      "建造了巨大的船",
      "帶動物成對上船",
      "用鴿子探测陆地"
    ],
    7: [
      "長子",
      "帐篷",
      "洪水後的祝福",
      "父親醉酒時尊重他",
      "弥賽亞的族谱經過他"
    ],
    8: [
      "迦南",
      "星辰",
      "離開本族本地",
      "百岁得子",
      "被稱為信心之父"
    ],
    9: [
      "帐篷",
      "欢笑",
      "九十岁懷孕生子",
      "曾對应许髮笑",
      "最初叫撒莱"
    ],
    10: [
      "所多瑪",
      "盐柱",
      "住在罪恶之城",
      "天使拉著他的手逃離",
      "妻子回頭變成盐柱"
    ],
    11: [
      "使女",
      "旷野",
      "主母苦待她",
      "在旷野中遇見天使",
      "為主人生了一個儿子"
    ],
    12: [
      "弓箭",
      "旷野",
      "母親是埃及使女",
      "成為大國之父",
      "住在巴蘭旷野"
    ],
    13: [
      "燔祭",
      "祝福",
      "父親举刀要殺他",
      "在田間默想時遇見妻子",
      "眼睛昏花時被骗"
    ],
    14: [
      "井旁",
      "水瓶",
      "在井旁打水遇見仆人",
      "偏爱小儿子",
      "帮小儿子骗取祝福"
    ],
    15: [
      "红豆汤",
      "猎人",
      "為一碗汤卖了長子名分",
      "浑身是毛",
      "與弟弟和好拥抱"
    ],
    16: [
      "天梯",
      "摔跤",
      "在伯特利梦見梯子",
      "與天使摔跤到天亮",
      "被改名為以色列"
    ],
    17: [
      "美貌",
      "牧羊",
      "在井旁遇見未來丈夫",
      "為丈夫劳作十四年",
      "臨死生下小儿子"
    ],
    18: [
      "姐姐",
      "眼睛",
      "因眼睛柔弱被记载",
      "代替妹妹成新娘",
      "生了六個儿子"
    ],
    19: [
      "彩衣",
      "異梦",
      "穿彩色外衣的少年",
      "被兄弟卖到埃及",
      "成為埃及宰相"
    ],
    20: [
      "狮子",
      "王族",
      "用印和杖作當頭",
      "弥賽亞出自他的支派",
      "願代替弟弟留下"
    ],
    21: [
      "面纱",
      "雙生",
      "假扮身份在路旁等候",
      "生了一對雙胞胎",
      "公公不認識她"
    ],
    22: [
      "長子",
      "水池",
      "與父親的妾同寝",
      "劝弟弟们不要殺約瑟",
      "失去了長子名分"
    ],
    23: [
      "幼子",
      "银杯",
      "母親生他時難产而死",
      "银杯藏在他口袋里",
      "哥哥流泪拥抱他"
    ],
    24: [
      "苦難",
      "灰烬",
      "失去一切仍不犯罪",
      "坐在炉灰中刮疮",
      "最終得到雙倍祝福"
    ],
    25: [
      "燃燒",
      "石板",
      "從水中被救起",
      "在燃燒的荆棘前脱鞋",
      "帶領百姓出埃及"
    ],
    26: [
      "杖變蛇",
      "金牛犊",
      "說自己口才不好",
      "杖變成了蛇",
      "铸造了金牛犊"
    ],
    27: [
      "鼓",
      "歌唱",
      "在海边击鼓跳舞",
      "因說闲話長了大麻风",
      "看守弟弟的摇篮"
    ],
    28: [
      "十災",
      "追赶",
      "心刚硬不讓人走",
      "國中遭受十災",
      "追到海边軍队覆沒"
    ],
    29: [
      "阴謀",
      "警告",
      "聽到暗殺計划",
      "把消息告诉親人",
      "救了舅舅的性命"
    ],
    30: [
      "祭司",
      "旷野",
      "牧羊時遇見女婿",
      "提出管理百姓的建议",
      "米甸的祭司"
    ],
    31: [
      "香炉",
      "地裂",
      "反叛領袖的权威",
      "地開口吞灭他家",
      "帶二百五十人作乱"
    ],
    32: [
      "驴子",
      "咒诅",
      "驴子開口說話",
      "被请去咒诅以色列",
      "三次被天使拦阻"
    ],
    33: [
      "葡萄",
      "勇气",
      "四十五岁去窥探迦南",
      "帶回巨大的葡萄",
      "八十五岁仍有力量"
    ],
    34: [
      "城墙",
      "太阳",
      "绕城七日城墙倒塌",
      "命令太阳停住",
      "窥探迦南地的首領"
    ],
    35: [
      "红绳",
      "城墙",
      "住在城墙上",
      "窗户上挂红绳得救",
      "隐藏了兩個探子"
    ],
    36: [
      "棕榈樹",
      "女士师",
      "坐在棕榈樹下审判",
      "以色列唯一的女士师",
      "與將軍一起出征"
    ],
    37: [
      "闪电",
      "將軍",
      "名字意為闪电",
      "需要女士师陪同出征",
      "一万人跟随他上山"
    ],
    38: [
      "帐篷钉",
      "牛奶",
      "用帐篷钉殺敌軍將領",
      "給逃跑的將軍喝奶",
      "在帐篷中完成使命"
    ],
    39: [
      "羊毛",
      "火把",
      "用羊毛试验上帝",
      "三百人用火把和號角",
      "拆毁了巴力的祭坛"
    ],
    40: [
      "许願",
      "女儿",
      "流浪者成為領袖",
      "许下轻率的誓言",
      "女儿迎接他跳舞"
    ],
    41: [
      "長髮",
      "力量",
      "頭髮是力量的來源",
      "徒手撕裂狮子",
      "推倒柱子與敌同亡"
    ],
    42: [
      "窗台",
      "睡著",
      "從三楼掉下去",
      "聽讲道時睡著",
      "死後被救活"
    ],
    43: [
      "麦田",
      "忠诚",
      "在田間拾取麦穗",
      "不離棄婆婆",
      "外邦女子嫁入以色列"
    ],
    44: [
      "苦涩",
      "归回",
      "失去丈夫和兩個儿子",
      "從摩押地回伯利恒",
      "讓人改叫她瑪拉"
    ],
    45: [
      "麦田",
      "鞋子",
      "讓她在田間拾穗",
      "脱鞋為贖买凭据",
      "近親救贖者"
    ],
    46: [
      "祷告",
      "许願",
      "在殿中默祷被误為醉酒",
      "许願將儿子獻給上帝",
      "每年做小外袍送給儿子"
    ],
    47: [
      "膏油",
      "呼唤",
      "夜間聽到呼唤聲",
      "膏立了以色列第一位王",
      "從小在聖殿服事"
    ],
    48: [
      "灯台",
      "眼花",
      "儿子作恶他不管教",
      "從座位上跌落而死",
      "聽到約柜被掳的消息"
    ],
    49: [
      "膏立",
      "嫉妒",
      "以色列第一位王",
      "嫉妒牧童的歌聲",
      "去找交鬼的婦人"
    ],
    50: [
      "竖琴",
      "牧童",
      "弹琴驱赶恶靈",
      "用甩石打倒巨人",
      "是合神心意的王"
    ],
    51: [
      "巨人",
      "铜盔",
      "身高六肘零一虎口",
      "被一颗石子击倒",
      "向以色列軍队叫阵"
    ],
    52: [
      "盟約",
      "弓箭",
      "與牧童結盟",
      "用箭傳递暗號",
      "為朋友冒生命危險"
    ],
    53: [
      "聪明",
      "食物",
      "帶著食物去迎接",
      "丈夫是愚顽人",
      "成為王的妻子"
    ],
    54: [
      "屋顶",
      "沐浴",
      "在屋顶被王看見",
      "丈夫被设計送死",
      "所羅門的母親"
    ],
    55: [
      "比喻",
      "先知",
      "用穷人羊羔的故事",
      "指出王的罪",
      "對王說你就是那人"
    ],
    56: [
      "頭髮",
      "叛逆",
      "骑骡子頭髮挂在樹上",
      "俊美卻叛逆父親",
      "為自己立了柱子"
    ],
    57: [
      "智慧",
      "聖殿",
      "求智慧不求财富",
      "建造了第一座聖殿",
      "审判兩個母親争子"
    ],
    58: [
      "财寶",
      "遠方",
      "帶著香料和金子來访",
      "從遠方來试問智慧",
      "看到一切心中惊叹"
    ],
    59: [
      "分裂",
      "鞭子",
      "不聽老臣的忠告",
      "用更重的鞭子待百姓",
      "王國在他手中分裂"
    ],
    60: [
      "金牛犊",
      "分裂",
      "设立兩個金牛犊",
      "成為北國第一位王",
      "使以色列人犯罪"
    ],
    61: [
      "火車",
      "乌鸦",
      "乌鸦叼饼和肉喂他",
      "從天上降火",
      "乘火車火馬升天"
    ],
    62: [
      "邪恶",
      "王後",
      "引進巴力崇拜",
      "要殺害所有先知",
      "最終從窗户被扔下"
    ],
    63: [
      "葡萄園",
      "偶像",
      "贪图邻舍的葡萄園",
      "被邪恶妻子引诱",
      "拜偶像的北國王"
    ],
    64: [
      "外套",
      "雙倍",
      "接住了老师的外套",
      "要求雙倍的靈",
      "使铁斧頭浮在水面"
    ],
    65: [
      "大麻风",
      "河水",
      "在約旦河洗了七次",
      "外國將軍得了潔净",
      "開始只帶了礼物來"
    ],
    66: [
      "贪心",
      "仆人",
      "追赶客人索取礼物",
      "向主人撒谎",
      "贪财而得了大麻风"
    ],
    67: [
      "日晷",
      "祷告",
      "日影後退十度",
      "祷告得延寿十五年",
      "引水入城的隧道"
    ],
    68: [
      "律法書",
      "修殿",
      "修聖殿時髮現律法書",
      "八岁登基的好王",
      "拆毁偶像祭坛"
    ],
    69: [
      "嘴唇",
      "以馬内利",
      "看見上帝坐在寶座上",
      "火炭沾他的嘴唇",
      "預言童女懷孕生子"
    ],
    70: [
      "眼泪",
      "监牢",
      "流泪的先知",
      "被投入泥泞的水牢",
      "預言七十年被掳"
    ],
    71: [
      "異象",
      "枯骨",
      "看見枯骨复活的異象",
      "吃了書卷",
      "看見四活物的異象"
    ],
    72: [
      "狮子坑",
      "異梦",
      "被扔進狮子坑",
      "解開墙上文字的意思",
      "在異邦坚持祷告"
    ],
    73: [
      "火窑",
      "拒绝",
      "被扔進火窑",
      "拒绝拜金像",
      "火中出現第四個人"
    ],
    74: [
      "宴會",
      "文字",
      "大摆宴席用聖殿器皿",
      "墙上出現神秘文字",
      "當夜被殺"
    ],
    75: [
      "法令",
      "狮子",
      "被迫签署禁令",
      "喜爱忠臣卻無力救他",
      "最終承認真神"
    ],
    76: [
      "金像",
      "野獸",
      "造了巨大的金像",
      "吃草如牛七年",
      "攻灭耶路撒冷"
    ],
    77: [
      "婚姻",
      "不忠",
      "娶不忠的妻子",
      "用婚姻比喻背約",
      "以爱挽回妻子"
    ],
    78: [
      "雄辩",
      "亞歷山大",
      "來自亞歷山大的学者",
      "大有口才引用聖經",
      "受了夫婦指教後更准确"
    ],
    79: [
      "牧人",
      "公義",
      "修剪桑樹的牧人",
      "被呼召成為先知",
      "宣告對列國的审判"
    ],
    80: [
      "仆人",
      "以东",
      "最短的先知書",
      "預言以东的結局",
      "隐藏了一百個先知"
    ],
    81: [
      "大鱼",
      "植物",
      "在鱼腹中三天三夜",
      "逃往他施躲避使命",
      "為一棵蓖麻髮怒"
    ],
    82: [
      "伯利恒",
      "公義",
      "預言弥賽亞生在小城",
      "行公義好憐憫",
      "與以賽亞同時代"
    ],
    83: [
      "仆人",
      "建议",
      "被掳到外邦為奴",
      "建议主人去找先知",
      "小女孩改變將軍命运"
    ],
    84: [
      "了望",
      "信心",
      "站在了望台上等候",
      "義人因信而活",
      "质問上帝為何容许恶"
    ],
    85: [
      "审判",
      "欢呼",
      "宣告耶路撒冷的审判",
      "預言上帝要欢呼喜樂",
      "約西亞時代的先知"
    ],
    86: [
      "紫色",
      "河边",
      "在河边聽道信主",
      "卖紫色布匹的商人",
      "第一個欧洲信徒"
    ],
    87: [
      "聖殿",
      "異象",
      "鼓励百姓重建聖殿",
      "看見金灯台和橄榄樹",
      "預言王骑驴進城"
    ],
    88: [
      "十分之一",
      "使者",
      "旧約最後一位先知",
      "斥責不交十分之一",
      "預言以利亞要來"
    ],
    89: [
      "律法",
      "抄写",
      "精通律法的文士",
      "帶領百姓学习律法",
      "從巴比倫回归"
    ],
    90: [
      "城墙",
      "酒政",
      "重建耶路撒冷城墙",
      "曾是波斯王的酒政",
      "五十二天建成城墙"
    ],
    91: [
      "王後",
      "勇气",
      "若死就死吧",
      "隐藏民族身份入宫",
      "宴會上揭露阴謀"
    ],
    92: [
      "城門",
      "忠诚",
      "坐在王宫門前",
      "不肯向恶人跪拜",
      "养大了孤女侄女"
    ],
    93: [
      "木架",
      "骄傲",
      "造了高大的木架",
      "抽签决定灭族日期",
      "最終挂在自己造的架上"
    ],
    94: [
      "百夫長",
      "異象",
      "虔诚的外邦軍官",
      "看見天使的異象",
      "第一個受洗的外邦人"
    ],
    95: [
      "针线",
      "善行",
      "做了许多善事和衣裳",
      "死後被复活",
      "又名大比大"
    ],
    96: [
      "十字架",
      "复活",
      "在水上行走",
      "用五饼二鱼喂饱眾人",
      "第三天從死里复活"
    ],
    97: [
      "馬槽",
      "寶剑",
      "在馬棚中生下婴孩",
      "心被刀刺透",
      "在迦拿婚宴上"
    ],
    98: [
      "木匠",
      "梦境",
      "天使在梦中向他顯現",
      "帶家人逃往埃及",
      "拿撒勒的木匠"
    ],
    99: [
      "旷野",
      "蝗虫",
      "在旷野吃蝗虫野蜜",
      "為弥賽亞預备道路",
      "被关進监狱斩首"
    ],
    100: [
      "渔夫",
      "磐石",
      "在水上行走又沉下去",
      "三次不認主",
      "拿著天國的钥匙"
    ],
    101: [
      "無花果樹",
      "真诚",
      "在無花果樹下被看見",
      "心里沒有诡诈",
      "起初质疑拿撒勒"
    ],
    102: [
      "雷子",
      "渔网",
      "被稱為雷子之一",
      "想從天上降火",
      "第一個殉道的使徒"
    ],
    103: [
      "雷子",
      "爱",
      "靠在老师胸前",
      "被稱為爱的使徒",
      "在拔摩岛写下異象"
    ],
    104: [
      "饼",
      "計算",
      "帶領埃塞俄比亞太监",
      "對五千人說饼不够",
      "在撒瑪利亞傳道"
    ],
    105: [
      "狐狸",
      "舞蹈",
      "被稱為狐狸",
      "因舞蹈许下承諾",
      "下令斩首先知"
    ],
    106: [
      "税关",
      "筵席",
      "坐在税关上被呼召",
      "為老师摆设筵席",
      "写了第一卷福音書"
    ],
    107: [
      "懷疑",
      "伤痕",
      "要看見才肯相信",
      "摸了复活者的伤痕",
      "後來到印度傳道"
    ],
    108: [
      "大祭司",
      "預言",
      "當年的大祭司",
      "無意中說了預言",
      "在审判中撕裂衣服"
    ],
    109: [
      "安静",
      "使徒",
      "又名猶大不是加略人",
      "十二使徒中较少记载",
      "問了关于顯現的問题"
    ],
    110: [
      "热心",
      "使徒",
      "被稱為热心党的人",
      "十二使徒之一",
      "跟從了新的道路"
    ],
    111: [
      "钱袋",
      "親吻",
      "管理钱袋卻偷取",
      "以親吻出卖老师",
      "三十块银币的代价"
    ],
    112: [
      "清晨",
      "墓園",
      "第一個看見复活的人",
      "清晨去到坟墓",
      "曾被赶出七個鬼"
    ],
    113: [
      "厨房",
      "忙碌",
      "在厨房忙碌服事",
      "抱怨妹妹不帮忙",
      "相信朋友能复活"
    ],
    114: [
      "膏油",
      "脚前",
      "用香膏抹老师的脚",
      "坐在老师脚前聽道",
      "打碎了玉瓶"
    ],
    115: [
      "坟墓",
      "复活",
      "死了四天被叫出坟墓",
      "姐姐们哭著求救",
      "被裹著布走出來"
    ],
    116: [
      "桑樹",
      "矮小",
      "爬上桑樹要看耶稣",
      "身材矮小的税吏長",
      "把一半家产給穷人"
    ],
    117: [
      "夜晚",
      "重生",
      "夜里來访問老师",
      "聽到必须重生",
      "帶香料安葬耶稣"
    ],
    118: [
      "屠殺",
      "星星",
      "下令殺害伯利恒婴孩",
      "东方博士來見他",
      "重建了聖殿"
    ],
    119: [
      "洗手",
      "审判",
      "在眾人面前洗手",
      "查不出他的罪來",
      "妻子做梦警告他"
    ],
    120: [
      "抽签",
      "替补",
      "抽签被選為使徒",
      "替补出卖者的位置",
      "一直跟随從受洗到升天"
    ],
    121: [
      "書信",
      "转變",
      "從迫害者變為傳道者",
      "在大馬色路上失明",
      "写了最多的書信"
    ],
    122: [
      "鼓励",
      "同工",
      "被稱為劝慰之子",
      "變卖田产奉獻",
      "帶領新人踏上旅途"
    ],
    123: [
      "石頭",
      "榮光",
      "第一位殉道者",
      "滿面髮光如天使",
      "被石頭打死時祷告"
    ],
    124: [
      "旷野",
      "馬車",
      "在旷野路上遇見馬車",
      "為太监解释經文",
      "被靈帶到別處"
    ],
    125: [
      "年轻",
      "書信",
      "從小学习聖經",
      "被稱為真儿子",
      "母親和外祖母教导他"
    ],
    126: [
      "医生",
      "详细",
      "是一位医生",
      "详细考查写下记录",
      "陪伴到最後的同伴"
    ],
    127: [
      "帐篷",
      "夫妻",
      "以制造帐篷為业",
      "夫妻同心教导真理",
      "冒著生命危險帮助人"
    ],
    128: [
      "监狱",
      "歌唱",
      "在监狱中唱歌赞美",
      "地震使监門大開",
      "忠實的旅行同伴"
    ],
    129: [
      "長寿",
      "等待",
      "活了九百六十九岁",
      "聖經中最長寿的人",
      "在洪水那年去世"
    ],
    130: [
      "海洋",
      "扩张",
      "名字意為扩张",
      "挪亞的第三個儿子",
      "沿海的民族出自他"
    ],
    131: [
      "饼和酒",
      "祭司",
      "沒有族谱的祭司",
      "帶出饼和酒祝福",
      "至高上帝的祭司"
    ],
    132: [
      "割礼",
      "旅途",
      "在路上替儿子行割礼",
      "救了丈夫的性命",
      "米甸祭司的女儿"
    ],
    133: [
      "枪",
      "热心",
      "用枪刺穿犯罪之人",
      "為上帝大髮热心",
      "止住了瘟疫"
    ],
    134: [
      "隐藏",
      "外衣",
      "私藏了當灭之物",
      "金子和外衣藏在帐篷下",
      "全家因此受罚"
    ],
    135: [
      "荆棘",
      "残忍",
      "基甸的儿子奪权",
      "殺了七十個兄弟",
      "被婦人用磨石击中"
    ],
    136: [
      "剪刀",
      "诱惑",
      "三次试探力士的秘密",
      "剪去了他的頭髮",
      "用甜言蜜語套出真相"
    ],
    137: [
      "伯利恒",
      "儿子",
      "有八個儿子",
      "最小的儿子被膏立為王",
      "伯利恒的老人"
    ],
    138: [
      "忠诚",
      "戰场",
      "忠心的外族戰士",
      "被安排在最前线",
      "即使有机會也不回家享樂"
    ],
    139: [
      "跛脚",
      "恩典",
      "雙脚残疾",
      "在王的桌前吃饭",
      "為了父親的缘故被善待"
    ],
    140: [
      "元帅",
      "诡計",
      "用拥抱暗殺對手",
      "攻城奪地的勇士",
      "违抗王命殺了叛逆者"
    ],
    141: [
      "謀士",
      "背叛",
      "智慧如神的謀士",
      "背叛了自己的主人",
      "計策不被采纳後自尽"
    ],
    142: [
      "客房",
      "孩子",
      "為先知預备阁楼客房",
      "儿子暴毙後求先知",
      "孩子打了七個喷嚏复活"
    ],
    143: [
      "戰車",
      "疯狂",
      "驾車如疯狂的人",
      "消灭了全部巴力崇拜者",
      "被膏立為以色列王"
    ],
    144: [
      "篡位",
      "屠殺",
      "殺害王室後代奪权",
      "唯一的猶大女王",
      "在聖殿門口被處死"
    ],
    145: [
      "修复",
      "大祭司",
      "藏匿王子保住血脉",
      "主持修复聖殿",
      "活到一百三十岁的大祭司"
    ],
    146: [
      "修殿",
      "箭",
      "被藏匿的王子",
      "修复了聖殿",
      "大祭司死後转離正道"
    ],
    147: [
      "悔改",
      "偶像",
      "在位期間極其邪恶",
      "被掳後真心悔改",
      "使猶大陷入偶像崇拜"
    ],
    148: [
      "蝗虫",
      "聖靈",
      "蝗災的異象",
      "預言聖靈浇灌万人",
      "呼吁百姓归向上帝"
    ],
    149: [
      "尼尼微",
      "毁灭",
      "預言大城的毁灭",
      "上帝是忌邪施報的",
      "安慰受压迫的百姓"
    ],
    150: [
      "根基",
      "總督",
      "重建聖殿的總督",
      "帶領第一批回归者",
      "大衛的後裔"
    ],
    151: [
      "聖殿",
      "催促",
      "催促百姓建殿",
      "責备只顾自己房屋",
      "與所羅巴伯同期的先知"
    ],
    152: [
      "老年",
      "懷孕",
      "老年懷孕生子",
      "丈夫因不信而哑口",
      "親戚來访婴孩在腹中跳動"
    ],
    153: [
      "聖殿",
      "等候",
      "在聖殿中等了许多年",
      "八十四岁的女先知",
      "看見婴孩就感谢上帝"
    ],
    154: [
      "婴孩",
      "安息",
      "抱著婴孩說可以安息了",
      "等候以色列的安慰者",
      "聖靈指示他不死前必看見"
    ],
    155: [
      "渔网",
      "兄弟",
      "先跟随了施洗者",
      "把哥哥帶來見老师",
      "五饼二鱼的男孩是他找到的"
    ],
    156: [
      "女儿",
      "跪下",
      "跪求医治十二岁女儿",
      "被告知女儿已死",
      "只要信不要怕"
    ],
    157: [
      "離別",
      "親吻",
      "與婆婆吻別離去",
      "回到自己的本族",
      "選择了不同于妯娌的路"
    ],
    158: [
      "噩梦",
      "警告",
      "做了不安的梦",
      "差人警告丈夫",
      "那義人的事你不可管"
    ],
    159: [
      "年轻人",
      "逃跑",
      "逃跑時丢了麻布",
      "是巴拿巴的表弟",
      "写了最短的福音書"
    ],
    160: [
      "兄弟",
      "教會",
      "耶稣的親弟弟",
      "起初不信後來相信",
      "写了关于信心與行為的書信"
    ],
    161: [
      "欺骗",
      "倒地",
      "卖了田产卻私藏价银",
      "在使徒面前說谎",
      "聽到責备就倒地死了"
    ],
    162: [
      "同謀",
      "倒地",
      "與丈夫同謀說谎",
      "三小時後進來",
      "不知丈夫已死也說了同样的谎"
    ],
    163: [
      "法利賽人",
      "忠告",
      "受人尊敬的法利賽人",
      "劝公會谨慎行事",
      "若出于上帝就不能推翻"
    ],
    164: [
      "虫咬",
      "榮耀",
      "被虫咬死",
      "接受百姓稱他為神",
      "殺害了使徒雅各"
    ],
    165: [
      "書信",
      "主人",
      "保羅写信給他",
      "被请求接纳逃奴",
      "歌羅西的信徒"
    ],
    166: [
      "逃跑",
      "有用",
      "從主人家逃跑的奴隶",
      "名字意為有用的人",
      "信主後被送回去"
    ],
    167: [
      "克里特",
      "秩序",
      "被留在克里特建立教會",
      "设立長老治理教會",
      "保羅的真儿子"
    ],
    168: [
      "代祷",
      "歌羅西",
      "為教會多多祷告",
      "歌羅西教會的创建者",
      "保羅稱他為忠心的仆人"
    ]
  },
  "my": {
    1: [
      "ဧဒင်",
      "မြေစာ",
      "လူသားအားလုံး၏အစ",
      "ဥယျာဉ်တွင်တားမြစ်ထားသည့်အရာကိုစားခဲ့သည်",
      "ဇနီးကိုကိုယ်တိုင်အမည်ပေးခဲ့သည်"
    ],
    2: [
      "နံရိုး",
      "အသီး",
      "ပထမဆုံးဖန်ဆင်းခံရသောအမျိုးသမီး",
      "မြွေ၏စကားကိုနားထောင်ခဲ့သည်",
      "သားနှစ်ယောက်၏မိခင်"
    ],
    3: [
      "သိုးထိန်း",
      "ယဇ်ပူဇော်",
      "ညီအစ်ကိုအငြိုးကြောင့်အသက်ဆုံးရှုံးခဲ့သည်",
      "ဘုရားသခင်လက်ခံသောပူဇော်သက္ကာ",
      "ပထမဆုံးအသတ်ခံရသူ"
    ],
    4: [
      "လယ်သမား",
      "အမှတ်အသား",
      "ညီကိုသတ်ခဲ့သည်",
      "မြေကြီးကိုထွန်ယက်ရန်ကျိန်ခံရသည်",
      "ဘုရားသခင့်ရှေ့မှထွက်ပြေးသွားသူ"
    ],
    5: [
      "လမ်းလျှောက်",
      "ပြောင်းရွှေ့",
      "ဘုရားသခင်နှင့်အတူလမ်းလျှောက်ခဲ့သည်",
      "သေခြင်းကိုမမြင်ဘဲယူဆောင်ခြင်းခံရသည်",
      "မသေဘဲကောင်းကင်သို့သွားခဲ့သည်"
    ],
    6: [
      "သင်္ဘော",
      "ရေလွှမ်းမိုး",
      "တိရစ္ဆာန်များကိုအစုံလိုက်စုဆောင်းခဲ့သည်",
      "ဖြောင့်မတ်သောသူတစ်ဦးတည်း",
      "စပျစ်ရည်သောက်ပြီးမူးယစ်ခဲ့သည်"
    ],
    7: [
      "သားကြီး",
      "ကောင်းချီး",
      "ရေလွှမ်းမိုးအပြီးတွင်ဖခင်ကိုလေးစားခဲ့သည်",
      "အာရှလူမျိုးများ၏ဘိုးဘွား",
      "ညီအစ်ကိုသုံးယောက်ထဲမှတစ်ယောက်"
    ],
    8: [
      "ကြယ်များ",
      "ခရီးသည်",
      "သားကိုယဇ်ပူဇော်ရန်စမ်းသပ်ခံရသည်",
      "ယုံကြည်ခြင်း၏ဖခင်ဟုခေါ်ခံရသည်",
      "အသက်ကြီးမှသားရခဲ့သည်"
    ],
    9: [
      "ရယ်မော",
      "တဲ",
      "အသက်ကိုးဆယ်တွင်သားဖွားခဲ့သည်",
      "ကတိတော်ကိုကြားသောအခါရယ်မောခဲ့သည်",
      "မူလအမည်မှာစာရဲဖြစ်သည်"
    ],
    10: [
      "ဆိုဒုံ",
      "ဂေါမောရ",
      "ဆားတိုင်ဖြစ်သွားသောဇနီးရှိသည်",
      "မြို့ပျက်မှထွက်ပြေးခဲ့ရသည်",
      "ဦးလေးသမီးများနှင့်အတူနေခဲ့သည်"
    ],
    11: [
      "ကျွန်မ",
      "သဲကန္တာရ",
      "သခင်မ၏ကျွန်မဖြစ်ခဲ့သည်",
      "သဲကန္တာရထဲတွင်ကောင်းကင်တမန်နှင့်တွေ့ခဲ့သည်",
      "သားအတွက်ရေကိုရှာဖွေခဲ့သည်"
    ],
    12: [
      "လေး",
      "သဲကန္တာရ",
      "အမျိုးကြီးတစ်ခု၏ဖခင်ဖြစ်လာခဲ့သည်",
      "ကျွန်မမှဖွားသောသား",
      "ကြယ်ဆယ့်နှစ်လုံးနှင့်ပတ်သက်သောကတိစကား"
    ],
    13: [
      "တောင်ပေါ်",
      "ယဇ်ပလ္လင်",
      "ဖခင်ကသတ်ရန်ယူဆောင်သွားခဲ့သည်",
      "မျက်စိကန်းသွားသောအခါသားကိုကောင်းချီးပေးခဲ့သည်",
      "အမွာသားနှစ်ဦး၏ဖခင်"
    ],
    14: [
      "ရေတွင်း",
      "အုပ်",
      "ဝေးလံသောနေရာမှလာသောသတို့သမီး",
      "သားငယ်ကိုဖခင်၏ကောင်းချီးခိုးယူရန်ကူညီခဲ့သည်",
      "အမွာသားနှစ်ဦး၏မိခင်"
    ],
    15: [
      "အမဲလိုက်",
      "အမွှေး",
      "မွေးရာပါအခွင့်အရေးကိုစွန့်လွှတ်ခဲ့သည်",
      "ဟင်းတစ်ခွက်အတွက်အမွေကိုရောင်းစားခဲ့သည်",
      "ကိုယ်ခန္ဓာတွင်အမွှေးထူသူ"
    ],
    16: [
      "လှေကား",
      "နပန်းလုံး",
      "ကောင်းကင်တမန်များနှင့်အိပ်မက်မက်ခဲ့သည်",
      "ဦးလေးထံတွင်နှစ်ပေါင်းများစွာအလုပ်လုပ်ခဲ့သည်",
      "အမည်ကိုဣသရေလဟုပြောင်းခံရသည်"
    ],
    17: [
      "အလှ",
      "သိုးကျောင်း",
      "ချစ်သူကိုရရန်နှစ်ပေါင်းများစွာစောင့်ဆိုင်းခံရသည်",
      "သားဖွားရင်းသေဆုံးခဲ့သည်",
      "အစ်မနှင့်ယောက်ျားတစ်ယောက်တည်းကိုလက်ထပ်ခဲ့သည်"
    ],
    18: [
      "မျက်စိ",
      "အစ်မ",
      "မျက်စိအားနည်းသောအမျိုးသမီး",
      "ချစ်ခြင်းမရဘဲလက်ထပ်ခံရသည်",
      "သားခြောက်ယောက်ဖွားမြင်ခဲ့သည်"
    ],
    19: [
      "အိပ်မက်",
      "အင်္ကျီ",
      "ညီအစ်ကိုများကရောင်းစားခဲ့သည်",
      "အကျဉ်းထောင်မှဘုရင့်လက်ယာလက်ဖြစ်လာခဲ့သည်",
      "အရောင်စုံအင်္ကျီကိုဝတ်ဆင်ခဲ့သည်"
    ],
    20: [
      "ခြင်္သေ့",
      "တောင်ဝှေး",
      "မိမိချွေးမကိုအဖြစ်မှန်မသိဘဲပေါင်းသင်းခဲ့သည်",
      "ညီကိုမသတ်ဘဲရောင်းစားရန်အကြံပေးခဲ့သည်",
      "ဣသရေလမျိုးနွယ်တစ်ခု၏ဘိုးဘွား"
    ],
    21: [
      "မျက်နှာဖုံး",
      "ဆိတ်သငယ်",
      "ယောက်ျားအဝတ်ဝတ်ပြီးလမ်းဘေးတွင်ထိုင်ခဲ့သည်",
      "ချွေးမဘဝဖြင့်မျိုးနွယ်ကိုဆက်ခဲ့သည်",
      "အမွာသားနှစ်ဦးကိုဖွားမြင်ခဲ့သည်"
    ],
    22: [
      "သားကြီး",
      "တည်ငြိမ်",
      "ဖခင်၏အိပ်ရာကိုရှုပ်ထွေးစေခဲ့သည်",
      "သားအကြီးဆုံးဖြစ်သော်လည်းမွေးရာပါအခွင့်အရေးဆုံးရှုံးခဲ့သည်",
      "ညီကိုသတ်ခြင်းမှကယ်တင်ခဲ့သည်"
    ],
    23: [
      "အငယ်ဆုံး",
      "ဝံပုလွေ",
      "ဖခင်အလွန်ချစ်သောသားငယ်",
      "ညီအစ်ကိုများ၏အိတ်ထဲတွင်ငွေခွက်ကိုတွေ့ရသည်",
      "မိခင်ဖွားရင်းသေဆုံးခဲ့သည်"
    ],
    24: [
      "ဆင်းရဲဒုက္ခ",
      "အနာ",
      "ဆုံးရှုံးမှုအားလုံးကိုခံစားခဲ့ရသည်",
      "မိတ်ဆွေသုံးယောက်နှင့်ငြင်းခုံခဲ့သည်",
      "နောက်ဆုံးတွင်ယခင်ထက်နှစ်ဆပြန်ရခဲ့သည်"
    ],
    25: [
      "တောင်ဝှေး",
      "ကျောက်ပြား",
      "ပင်လယ်နီကိုခွဲခဲ့သည်",
      "မီးလောင်နေသောချုံပုတ်တွင်ဘုရားသခင်နှင့်တွေ့ခဲ့သည်",
      "ကတိမြေသို့မဝင်ခဲ့ရ"
    ],
    26: [
      "တောင်ဝှေး",
      "ရွှေနွား",
      "ညီ၏ကိုယ်စားပြောဆိုပေးသူ",
      "ပန်းပွင့်ပွင့်သောတောင်ဝှေးကိုကိုင်ဆောင်ခဲ့သည်",
      "ရွှေနွားရုပ်ကိုပြုလုပ်ပေးခဲ့သည်"
    ],
    27: [
      "ဒိုင်း",
      "သီချင်း",
      "ပင်လယ်ကိုဖြတ်ပြီးနောက်ချီးမွမ်းသီချင်းဆိုခဲ့သည်",
      "ညီ၏ခေါင်းဆောင်မှုကိုဝေဖန်ခဲ့သည်",
      "အနူရောဂါဖြင့်အပြစ်ဒဏ်ခံရသည်"
    ],
    28: [
      "သရဖူ",
      "ကျွန်",
      "ဣသရေလလူမျိုးများကိုကျွန်အဖြစ်ချုပ်နှောင်ထားခဲ့သည်",
      "ဘေးဒဏ်ဆယ်ခုကိုခံစားရသည်",
      "ပင်လယ်နီတွင်စစ်တပ်ပျက်စီးခဲ့သည်"
    ],
    29: [
      "သတင်းပို့",
      "ကယ်တင်",
      "ဦးလေးကိုသတ်ရန်ကြံစည်မှုကိုသတင်းပို့ခဲ့သည်",
      "ငယ်ရွယ်သော်လည်းသတ္တိရှိသည်",
      "ရောမစစ်တပ်စခန်းတွင်အရေးကြီးသတင်းကိုပေးခဲ့သည်"
    ],
    30: [
      "ယဇ်ပုရောဟိတ်",
      "အကြံဉာဏ်",
      "သမက်ကိုတရားစီရင်နည်းသင်ပေးခဲ့သည်",
      "မိဒျန်ပြည်၏ယဇ်ပုရောဟိတ်",
      "သမီးကိုသိုးထိန်းနှင့်လက်ထပ်ပေးခဲ့သည်"
    ],
    31: [
      "ပုန်ကန်",
      "မြေမျိုခြင်း",
      "ခေါင်းဆောင်မှုကိုပုန်ကန်ခဲ့သည်",
      "မြေကြီးကွဲပြီးမျိုချခံရသည်",
      "ယဇ်ပုရောဟိတ်ရာထူးကိုလိုချင်ခဲ့သည်"
    ],
    32: [
      "မြည်း",
      "ကြယ်",
      "မြည်းကစကားပြောခဲ့သည်",
      "ကျိန်ဆဲရန်ငှားခံရသော်လည်းကောင်းချီးပေးခဲ့သည်",
      "ကောင်းကင်တမန်ကိုမမြင်ဘဲမြည်းကမြင်ခဲ့သည်"
    ],
    33: [
      "စပျစ်သီး",
      "သတ္တိ",
      "စူးစမ်းသူဆယ့်နှစ်ဦးထဲမှတစ်ဦး",
      "ယုံကြည်ချက်ကြောင့်ကတိမြေသို့ဝင်ခွင့်ရခဲ့သည်",
      "အသက်ရှစ်ဆယ်ငါးနှစ်တွင်လည်းခွန်အားမလျော့ဟုဆိုခဲ့သည်"
    ],
    34: [
      "နေ",
      "လှံ",
      "ယော်ဒန်မြစ်ကိုခွဲခဲ့သည်",
      "ယေရိခေါမြို့ရိုးကိုပတ်လည်ပတ်ခဲ့သည်",
      "နေကိုရပ်တန့်စေခဲ့သည်"
    ],
    35: [
      "ကြိုး",
      "ပြတင်းပေါက်",
      "အနီရောင်ကြိုးကိုပြတင်းပေါက်တွင်ချိတ်ခဲ့သည်",
      "သူလျှိုများကိုဝှက်ထားပေးခဲ့သည်",
      "ယုံကြည်ခြင်းကြောင့်ကယ်တင်ခံရသောအမျိုးသမီး"
    ],
    36: [
      "စွန်ပလွံပင်",
      "တရားသူကြီး",
      "ဣသရေလကိုတရားစီရင်သောအမျိုးသမီး",
      "စစ်ပွဲတွင်ခေါင်းဆောင်ကိုအားပေးခဲ့သည်",
      "အပင်အောက်တွင်ထိုင်ပြီးတရားစီရင်ခဲ့သည်"
    ],
    37: [
      "စစ်သူရဲ",
      "တောင်",
      "အမျိုးသမီးမပါဘဲမသွားဟုဆိုခဲ့သည်",
      "ကာနန်စစ်သူကြီးကိုတိုက်ခိုက်ခဲ့သည်",
      "တရားသူကြီးမနှင့်အတူတိုက်ခိုက်ခဲ့သူ"
    ],
    38: [
      "တဲတိုင်",
      "နို့",
      "ရန်သူစစ်သူကြီးကိုတဲတိုင်ဖြင့်သတ်ခဲ့သည်",
      "နို့ကိုသောက်ရန်ပေးပြီးနောက်အိပ်ပျော်စေခဲ့သည်",
      "သတ္တိရှိသောအမျိုးသမီးတစ်ဦး"
    ],
    39: [
      "သိုးမွှေး",
      "နှင်းဆီ",
      "သိုးမွှေးဖြင့်ဘုရားသခင်ကိုစမ်းသပ်ခဲ့သည်",
      "လူသုံးရာဖြင့်စစ်ပွဲနိုင်ခဲ့သည်",
      "မီးတုတ်နှင့်အိုးခွံများဖြင့်တိုက်ခိုက်ခဲ့သည်"
    ],
    40: [
      "သစ္စာ",
      "သမီး",
      "သမီးကိုယဇ်ပူဇော်မည်ဟုသစ္စာဆိုခဲ့သည်",
      "ဂိလဒ်ပြည်မှတရားသူကြီး",
      "အောင်ပွဲမတိုင်မီကတိကဝတ်ပြုခဲ့သည်"
    ],
    41: [
      "ဆံပင်",
      "ခွန်အား",
      "ဆံပင်ကိုညှပ်လိုက်သောအခါခွန်အားကုန်ခဲ့သည်",
      "ခြင်္သေ့ကိုလက်ဗလာဖြင့်သတ်ခဲ့သည်",
      "ဖိလိတ္တိဘုရားကျောင်းတိုင်များကိုတွန်းချခဲ့သည်"
    ],
    42: [
      "ပြတင်းပေါက်",
      "အိပ်ပျော်",
      "တရားဟောချက်ကိုနားထောင်ရင်းအိပ်ပျော်ခဲ့သည်",
      "ထပ်ခိုးပြတင်းပေါက်မှပြုတ်ကျခဲ့သည်",
      "သေသွားပြီးမှပြန်ရှင်လာခဲ့သည်"
    ],
    43: [
      "ကောက်ရိုးကောက်",
      "သစ္စာ",
      "ယောက္ခမနှင့်အတူမွေးရပ်မဟုတ်သောပြည်သို့သွားခဲ့သည်",
      "ကောက်ရိုးကောက်ရင်းချမ်းသာသူနှင့်တွေ့ခဲ့သည်",
      "မင်းသွားရာအရပ်ကိုကျွန်မသွားမည်ဟုဆိုခဲ့သည်"
    ],
    44: [
      "ခါးသီး",
      "ပြန်လာ",
      "သားနှစ်ယောက်နှင့်ခင်ပွန်းကိုဆုံးရှုံးခဲ့သည်",
      "ချွေးမကိုတိုင်းတစ်ပါးမှပြန်ခေါ်ခဲ့သည်",
      "မိမိကိုယ်ကိုမာရဟုခေါ်ရန်ဆိုခဲ့သည်"
    ],
    45: [
      "ကောက်လှိုင်း",
      "ရွေးနုတ်",
      "ချွေးမကျွန်ကိုစေးနုတ်ခဲ့သည်",
      "ကောက်ခင်းပိုင်ရှင်ဖြစ်ပြီးကျေးဇူးပြုခဲ့သည်",
      "ဒါဝိဒ်မင်း၏ဘိုးဖြစ်လာခဲ့သည်"
    ],
    46: [
      "ဆုတောင်း",
      "မျက်ရည်",
      "ဘုရားကျောင်းတွင်မျက်ရည်ကျကာဆုတောင်းခဲ့သည်",
      "သားကိုဘုရားသခင့်အတွက်ပေးအပ်ခဲ့သည်",
      "မူးယစ်သူဟုအထင်မှားခံရသည်"
    ],
    47: [
      "အသံ",
      "ညဘက်",
      "ညဘက်တွင်ဘုရားသခင်၏အသံကိုကြားခဲ့သည်",
      "ဘုရင်ကိုဆီလိမ်းခဲ့သည်",
      "ငယ်စဉ်ကတည်းကဘုရားကျောင်းတွင်အမှုဆောင်ခဲ့သည်"
    ],
    48: [
      "ယဇ်ပုရောဟိတ်",
      "ထိုင်ခုံ",
      "သားနှစ်ယောက်ကအဆိုးလုပ်ခဲ့သည်",
      "ထိုင်ခုံမှပြုတ်ကျပြီးသေဆုံးခဲ့သည်",
      "ငယ်ရွယ်သောအမှုဆောင်ကိုကြီးပြင်းစေခဲ့သည်"
    ],
    49: [
      "လှံ",
      "မနာလို",
      "ဣသရေလ၏ပထမဆုံးဘုရင်",
      "သိုးထိန်းလူငယ်ကိုလှံဖြင့်ပစ်ခဲ့သည်",
      "နတ်ဘုရားဆရာထံသွားခဲ့သည်"
    ],
    50: [
      "စောင်းတီး",
      "ကျောက်ခဲ",
      "ကျောက်ခဲတစ်လုံးဖြင့်စစ်သူကြီးကိုသတ်ခဲ့သည်",
      "သိုးထိန်းမှဘုရင်ဖြစ်လာခဲ့သည်",
      "ဆာလံအများအပြားကိုရေးသားခဲ့သည်"
    ],
    51: [
      "ကြီးမား",
      "ခြောက်လက်မ",
      "စစ်မြေပြင်တွင်ဣသရေလကိုစိန်ခေါ်ခဲ့သည်",
      "ကျောက်ခဲတစ်လုံးဖြင့်လဲကျခဲ့သည်",
      "ဖိလိတ္တိလူမျိုးမှကြီးမားသောစစ်သည်"
    ],
    52: [
      "မိတ်ဆွေ",
      "လေး",
      "ဘုရင်၏သားဖြစ်သော်လည်းသိုးထိန်းနှင့်ချစ်ခင်ခဲ့သည်",
      "မိတ်ဆွေကိုကယ်တင်ရန်လေးကိုပစ်ခဲ့သည်",
      "ဖခင်ဘုရင်၏အမျက်ကိုဆန့်ကျင်ခဲ့သည်"
    ],
    53: [
      "ဉာဏ်ပညာ",
      "အစာရေစာ",
      "မိုက်မဲသောခင်ပွန်းရှိသည်",
      "ဘုရင်ကိုအစာရေစာယူဆောင်သွားပြီးအသက်ချမ်းသာခဲ့သည်",
      "ဉာဏ်ပညာဖြင့်သွေးထွက်သံယိုမှုကိုကာကွယ်ခဲ့သည်"
    ],
    54: [
      "အိမ်မိုး",
      "ရေချိုး",
      "အိမ်မိုးပေါ်မှအလှကိုဘုရင်မြင်ခဲ့သည်",
      "စစ်သားခင်ပွန်းကိုဆုံးရှုံးခဲ့ရသည်",
      "ရှောလမုန်မင်း၏မိခင်"
    ],
    55: [
      "ပရောဖက်",
      "ပုံပြင်",
      "သိုးတစ်ကောင်အကြောင်းပုံပြင်ဖြင့်ဘုရင်ကိုသတိပေးခဲ့သည်",
      "မင်းကိုယ်တိုင်ကထိုသူပါဟုဆိုခဲ့သည်",
      "ဒါဝိဒ်ဘုရင်၏အကြံပေး"
    ],
    56: [
      "ဆံပင်ရှည်",
      "ပုန်ကန်",
      "ဖခင်ဘုရင်ကိုပုန်ကန်ခဲ့သည်",
      "သစ်ပင်ကိုင်းတွင်ဆံပင်သဖြင့်ဆွဲကပ်ခဲ့သည်",
      "အလွန်ချောမော၍ဆံပင်ရှည်သူ"
    ],
    57: [
      "ဉာဏ်ပညာ",
      "ဘုရားကျောင်း",
      "ဘုရားသခင်ထံဉာဏ်ပညာကိုတောင်းခဲ့သည်",
      "ကလေးကိုနှစ်ပိုင်းပိုင်းမည်ဟုစီရင်ခဲ့သည်",
      "ဘုရားကျောင်းတော်ကိုတည်ဆောက်ခဲ့သည်"
    ],
    58: [
      "ရွှေ",
      "ဉာဏ်စမ်း",
      "ဝေးလံသောပြည်မှဉာဏ်ပညာကိုစမ်းသပ်ရန်လာခဲ့သည်",
      "ရွှေနှင့်မွှေးနံ့သာများကိုဆောင်ယူလာခဲ့သည်",
      "ကြားသိသမျှထက်ပိုမိုအံ့သြခဲ့သည်"
    ],
    59: [
      "ခွဲခြား",
      "မိုက်မဲ",
      "ဖခင်၏နိုင်ငံကိုအမွေဆက်ခံခဲ့သည်",
      "အကြံပေးအသက်ကြီးသူများ၏စကားကိုမနာခံခဲ့",
      "နိုင်ငံကွဲသွားစေခဲ့သည်"
    ],
    60: [
      "ရွှေနွား",
      "ပုန်ကန်",
      "မြောက်ပိုင်းနိုင်ငံကိုတည်ထောင်ခဲ့သည်",
      "ရွှေနွားနှစ်ကောင်ကိုပြုလုပ်ခဲ့သည်",
      "ပရောဖက်၏သတိပေးချက်ကိုလျစ်လျူရှုခဲ့သည်"
    ],
    61: [
      "မီး",
      "ကျီးကန်း",
      "ကောင်းကင်မှမီးကျစေခဲ့သည်",
      "ကျီးကန်းများကအစာကျွေးခဲ့သည်",
      "မီးရထားဖြင့်ကောင်းကင်သို့တက်သွားခဲ့သည်"
    ],
    62: [
      "ဘုရင်မ",
      "အဆိပ်",
      "ဗာလဘုရားကိုကိုးကွယ်ခဲ့သည်",
      "ပရောဖက်ကိုသတ်မည်ဟုခြိမ်းခြောက်ခဲ့သည်",
      "ပြတင်းပေါက်မှပစ်ချခံရသည်"
    ],
    63: [
      "စပျစ်ခြံ",
      "ဆိုးသွမ်း",
      "အိမ်နီးနားချင်း၏စပျစ်ခြံကိုလိုချင်ခဲ့သည်",
      "ဆိုးသွမ်းသောဘုရင်မ၏ခင်ပွန်း",
      "ဗာလဘုရားကိုကိုးကွယ်ခဲ့သည်"
    ],
    64: [
      "လိမ်ပါး",
      "ကျီးကန်း",
      "ဆရာ၏အဝတ်ကိုအမွေဆက်ခံခဲ့သည်",
      "ဆားဖြင့်ရေကိုသန့်စင်ခဲ့သည်",
      "မီးရထားနှင့်မီးမြင်းကိုမြင်ခဲ့သည်"
    ],
    65: [
      "နူနာ",
      "ယော်ဒန်မြစ်",
      "ယော်ဒန်မြစ်တွင်ခုနစ်ကြိမ်ရေစိမ်ခဲ့သည်",
      "ရန်သူနိုင်ငံမှစစ်သူကြီး",
      "နူနာပျောက်ကင်းခဲ့သည်"
    ],
    66: [
      "လောဘ",
      "နူနာ",
      "ဆရာ၏နာမည်ဖြင့်လက်ဆောင်တောင်းခဲ့သည်",
      "လောဘကြောင့်နူနာရောဂါခံရသည်",
      "ပရောဖက်၏အစေခံ"
    ],
    67: [
      "နေနာရီ",
      "ဆုတောင်း",
      "ဆုတောင်းခြင်းဖြင့်အသက်ဆယ်ငါးနှစ်တိုးခဲ့သည်",
      "အာရှုရိစစ်တပ်ကိုကောင်းကင်တမန်ဖျက်ဆီးခဲ့သည်",
      "နေနာရီအရိပ်ကိုနောက်ပြန်ဆုတ်စေခဲ့သည်"
    ],
    68: [
      "ပညတ်စာစောင်",
      "ပြုပြင်",
      "ဘုရားကျောင်းတွင်ပညတ်စာစောင်ကိုတွေ့ရှိခဲ့သည်",
      "အသက်ငယ်စဉ်ကတည်းကဘုရင်ဖြစ်ခဲ့သည်",
      "ရုပ်ထုကိုးကွယ်မှုကိုဖျက်ဆီးခဲ့သည်"
    ],
    69: [
      "ရှေ့ပြေး",
      "အပျိုကညာ",
      "မေရှိယအကြောင်းပရောဖက်ပြုခဲ့သည်",
      "ဘုရားသခင်၏ပလ္လင်ခန်းကိုရူပါရုံမြင်ခဲ့သည်",
      "ကျွန်ုပ်ရှိပါသည်ကျွန်ုပ်ကိုစေလွှတ်ပါဟုဆိုခဲ့သည်"
    ],
    70: [
      "မျက်ရည်",
      "တွင်း",
      "ငိုကြွေးသောပရောဖက်ဟုခေါ်ခံရသည်",
      "ရွှံ့တွင်းထဲသို့ပစ်ချခံရသည်",
      "လူများအလိုမကျသောအမှန်တရားကိုဟောခဲ့သည်"
    ],
    71: [
      "ဘီး",
      "အရိုး",
      "ခြောက်သွေ့သောအရိုးများပြန်ရှင်လာသည်ကိုမြင်ခဲ့သည်",
      "ဘီးတပ်ထားသောရထားကိုရူပါရုံမြင်ခဲ့သည်",
      "ကေဗာမြစ်နားတွင်ပရောဖက်ပြုခဲ့သည်"
    ],
    72: [
      "ခြင်္သေ့တွင်း",
      "အိပ်မက်",
      "ခြင်္သေ့တွင်းထဲတွင်မထိခိုက်ခဲ့",
      "ဘုရင်များ၏အိပ်မက်ကိုဖော်ပြခဲ့သည်",
      "မီးလောင်နေသောမီးဖိုထဲသို့မဝင်ခဲ့"
    ],
    73: [
      "မီးဖို",
      "သုံးယောက်",
      "မီးဖိုထဲတွင်မလောင်ခဲ့",
      "ရွှေရုပ်ထုကိုမကိုးကွယ်ခဲ့",
      "မီးထဲတွင်စတုတ္ထပုဂ္ဂိုလ်ကိုမြင်ခဲ့သည်"
    ],
    74: [
      "လက်ဖျား",
      "နံရံ",
      "နံရံပေါ်တွင်ရေးသောလက်ဖျားကိုမြင်ခဲ့သည်",
      "ပွဲတော်ကျင်းပနေစဉ်နိမိတ်လက္ခဏာပေါ်ခဲ့သည်",
      "ထိုညတွင်ပင်အသက်ဆုံးရှုံးခဲ့သည်"
    ],
    75: [
      "ခြင်္သေ့",
      "အမိန့်",
      "ခြင်္သေ့တွင်းထဲသို့ပစ်ချရန်အမိန့်ပေးခဲ့သည်",
      "ဆုတောင်းခြင်းကိုတားမြစ်သောအမိန့်ကိုထုတ်ခဲ့သည်",
      "ပရောဖက်ကိုချစ်သော်လည်းကယ်တင်ရန်ခက်ခဲခဲ့သည်"
    ],
    76: [
      "ရွှေရုပ်ထု",
      "အိပ်မက်",
      "ကြီးမားသောရွှေရုပ်ထုကိုတည်ဆောက်ခဲ့သည်",
      "တိရစ္ဆာန်ကဲ့သို့မြက်စားနေရသည်",
      "ဗာဗုလုန်၏အင်အားကြီးဘုရင်"
    ],
    77: [
      "ပြည့်တန်ဆာ",
      "ချစ်ခြင်း",
      "မယုံကြည်သောဇနီးကိုယူရန်ဆိုခံရသည်",
      "ဘုရားသခင်၏မပြောင်းလဲသောချစ်ခြင်းကိုကိုယ်စားပြုသည်",
      "သစ္စာမဲ့သောဣသရေလကိုပြန်လည်ချစ်ခဲ့သည်"
    ],
    78: [
      "ဟောပြော",
      "အလက္ဇန္ဒြီးယား",
      "ကျမ်းစာကိုကောင်းစွာသိသောဟောပြောသူ",
      "ဇနီးမောင်နှံကပိုမိုတိကျစွာသင်ပေးခဲ့သည်",
      "ကောရိန္သုတွင်ရေလောင်းပေးခဲ့သည်"
    ],
    79: [
      "သိုးထိန်း",
      "တရားမျှတ",
      "မတရားမှုကိုဆန့်ကျင်ဟောပြောခဲ့သည်",
      "သိုးထိန်းဘဝမှပရောဖက်ဖြစ်လာခဲ့သည်",
      "ဆင်းရဲသားများအတွက်တရားမျှတမှုကိုတောင်းဆိုခဲ့သည်"
    ],
    80: [
      "ရူပါရုံ",
      "ဧဒုံ",
      "ဧဒုံလူမျိုးအကြောင်းပရောဖက်ပြုခဲ့သည်",
      "အတိုဆုံးပရောဖက်စာအုပ်ကိုရေးသားခဲ့သည်",
      "ညီအစ်ကိုနိုင်ငံ၏ပျက်စီးခြင်းကိုဟောပြောခဲ့သည်"
    ],
    81: [
      "ငါးကြီး",
      "ထွက်ပြေး",
      "ဘုရားသခင်၏အမိန့်ကိုလျစ်လျူရှုပြီးထွက်ပြေးခဲ့သည်",
      "ငါးကြီးဝမ်းထဲတွင်သုံးရက်နေခဲ့သည်",
      "နိနဝေမြို့ကိုဟောပြောရန်ငြင်းဆိုခဲ့သည်"
    ],
    82: [
      "ဗက်လင်",
      "အစိုးရသူ",
      "ဗက်လင်မှအစိုးရသူထွက်ပေါ်မည်ဟုပရောဖက်ပြုခဲ့သည်",
      "တရားမျှတမှုကိုနှစ်သက်သောဘုရားသခင့်အကြောင်းဟောခဲ့သည်",
      "နှိမ့်ချမှုဖြင့်လမ်းလျှောက်ရန်သင်ပေးခဲ့သည်"
    ],
    83: [
      "ကျွန်မ",
      "နူနာ",
      "ရန်သူစစ်သူကြီး၏ဇနီးကိုပရောဖက်ထံသွားရန်အကြံပေးခဲ့သည်",
      "ဖမ်းဆီးခံရသောဣသရေလအမျိုးသမီးငယ်",
      "ယုံကြည်ခြင်းဖြင့်နူနာပျောက်ကင်းရန်လမ်းပြခဲ့သည်"
    ],
    84: [
      "မေးခွန်း",
      "ခံတပ်",
      "ဘုရားသခင်ကိုမေးခွန်းထုတ်ခဲ့သည်",
      "ယုံကြည်ခြင်းဖြင့်စောင့်ဆိုင်းရန်သင်ပေးခဲ့သည်",
      "ခံတပ်ပေါ်တွင်ရပ်ပြီးစောင့်ကြည့်ခဲ့သည်"
    ],
    85: [
      "တရားစီရင်",
      "ယုဒ",
      "ယုဒပြည်၏ကျဆင်းခြင်းကိုပရောဖက်ပြုခဲ့သည်",
      "ထာဝရဘုရားကိုရှာရန်နှိမ့်ချသောသူများကိုတိုက်တွန်းခဲ့သည်",
      "ယောရှိဘုရင်လက်ထက်တွင်ဟောပြောခဲ့သည်"
    ],
    86: [
      "ခရမ်းရောင်",
      "ကုန်သည်",
      "ခရမ်းရောင်အထည်ရောင်းသောကုန်သည်မ",
      "ဥရောပတွင်ပထမဆုံးယုံကြည်သူဖြစ်ခဲ့သည်",
      "မြစ်နားတွင်ဆုတောင်းနေစဉ်သတင်းကောင်းကိုကြားခဲ့သည်"
    ],
    87: [
      "မြင်းများ",
      "ဘုရားကျောင်း",
      "ဘုရားကျောင်းပြန်လည်တည်ဆောက်ရေးကိုအားပေးခဲ့သည်",
      "ညဘက်ရူပါရုံရှစ်ခုကိုမြင်ခဲ့သည်",
      "မေရှိယ၏ကြွလာခြင်းကိုပရောဖက်ပြုခဲ့သည်"
    ],
    88: [
      "စာတမန်",
      "ဆယ်ဖို့တစ်ဖို့",
      "ဆယ်ဖို့တစ်ဖို့ပေးခြင်းကိုသတိပေးခဲ့သည်",
      "ဓမ္မဟောင်း၏နောက်ဆုံးပရောဖက်",
      "ဘုရားသခင်၏စာတမန်ဟုအမည်ရသည်"
    ],
    89: [
      "ကျမ်းစာ",
      "ပြန်လာ",
      "ဗာဗုလုန်အကျဉ်းသုံ့ပန်းမှပြန်လာပြီးကိုးကွယ်မှုကိုပြန်လည်ထူထောင်ခဲ့သည်",
      "ပညတ်တရားကိုပြည်သူများအားဖတ်ပြခဲ့သည်",
      "ရောနှောအိမ်ထောင်ပြုခြင်းကိုတားမြစ်ခဲ့သည်"
    ],
    90: [
      "မြို့ရိုး",
      "ခွက်စား",
      "ဂျေရုဆလင်မြို့ရိုးကိုပြန်လည်တည်ဆောက်ခဲ့သည်",
      "ညဘက်မြို့ရိုးကိုစစ်ဆေးခဲ့သည်",
      "ဘုရင်၏ခွက်စားအဖြစ်အမှုထမ်းခဲ့သည်"
    ],
    91: [
      "အလှ",
      "ဘုရင်မ",
      "လူမျိုးကိုကယ်တင်ရန်ဘုရင်ရှေ့သို့ဝင်ခဲ့သည်",
      "ပွဲတော်တစ်ခုကိုစီစဉ်ခဲ့သည်",
      "အပျိုကညာအလှပြိုင်ပွဲတွင်ရွေးချယ်ခံရသည်"
    ],
    92: [
      "တံခါး",
      "ကြံစည်",
      "တူမကိုဘုရင်မဖြစ်အောင်ကြံစည်ခဲ့သည်",
      "ရန်သူရှေ့တွင်ဒူမထောက်ခဲ့",
      "ဘုရင့်အသက်ကိုကယ်တင်ခဲ့သည်"
    ],
    93: [
      "ကြိုး",
      "အနာဂတ်",
      "ယုဒလူမျိုးအားလုံးကိုသတ်ရန်ကြံစည်ခဲ့သည်",
      "မိမိပြင်ဆင်ထားသောကြိုးတွင်ကိုယ်တိုင်ဆွဲကြိုးကျခဲ့သည်",
      "ဘုရင့်အကြိုက်ဆုံးအမတ်ဖြစ်ခဲ့သည်"
    ],
    94: [
      "ရာစုမှူး",
      "ရူပါရုံ",
      "တစ်ပါးအမျိုးသားပထမဆုံးယုံကြည်သူ",
      "ကောင်းကင်တမန်၏ရူပါရုံကိုမြင်ခဲ့သည်",
      "ရောမစစ်သားတစ်ဦးဖြစ်ခဲ့သည်"
    ],
    95: [
      "အပ်ချုပ်",
      "ကသာ",
      "ဆင်းရဲသူများအတွက်အဝတ်အစားချုပ်ပေးခဲ့သည်",
      "သေပြီးမှပြန်ရှင်ထမြောက်ခဲ့သည်",
      "ကျေးဇူးပြုခြင်းများဖြင့်လူသိများသည်"
    ],
    96: [
      "ကားတိုင်",
      "ရှင်ပြန်ထမြောက်",
      "ရေပေါ်တွင်လမ်းလျှောက်ခဲ့သည်",
      "သေခြင်းမှရှင်ပြန်ထမြောက်ခဲ့သည်",
      "ပုံဥပမာများဖြင့်သင်ပေးခဲ့သည်"
    ],
    97: [
      "နွယ်ပင်",
      "ကျေးဇူးတော်",
      "ကောင်းကင်တမန်၏သတင်းကိုနှိမ့်ချစွာလက်ခံခဲ့သည်",
      "နွယ်ပင်ထိုးခံရမည်ဟုကြိုတင်ပြောခံရသည်",
      "ဗက်လင်မြို့တွင်သားဖွားခဲ့သည်"
    ],
    98: [
      "လက်သမား",
      "အိပ်မက်",
      "အိပ်မက်တွင်ကောင်းကင်တမန်ကညွှန်ကြားခဲ့သည်",
      "အီဂျစ်ပြည်သို့ထွက်ပြေးခဲ့သည်",
      "နာဇရက်မြို့မှလက်သမား"
    ],
    99: [
      "ကန္တာရ",
      "ချောင်းဖလံ",
      "ကန္တာရတွင်နေထိုင်ခဲ့သည်",
      "ယော်ဒန်မြစ်တွင်နှစ်ခြင်းပေးခဲ့သည်",
      "ခေါင်းဖြတ်ခံရသည်"
    ],
    100: [
      "ကျောက်",
      "ငါးဖမ်း",
      "ငါးဖမ်းသမားမှတမန်တော်ဖြစ်လာခဲ့သည်",
      "ရေပေါ်တွင်လမ်းလျှောက်ရာနစ်မြုပ်ခဲ့သည်",
      "သုံးကြိမ်ငြင်းပယ်ခဲ့သည်"
    ],
    101: [
      "သင်္ဘောသဖန်း",
      "သံသယ",
      "သင်္ဘောသဖန်းပင်အောက်တွင်ထိုင်နေစဉ်ခေါ်ခံရသည်",
      "နာဇရက်မှကောင်းသောအရာထွက်နိုင်ပါသလားဟုမေးခဲ့သည်",
      "စစ်မှန်သောဣသရေလသားဟုချီးကျူးခံရသည်"
    ],
    102: [
      "မိုးကြိုး",
      "ငါးဖမ်း",
      "ညီနှင့်အတူမိုးကြိုးသားများဟုခေါ်ခံရသည်",
      "ပထမဆုံးအသေခံတမန်တော်",
      "အတွင်းတန်းတမန်တော်သုံးဦးထဲမှတစ်ဦး"
    ],
    103: [
      "ချစ်ခြင်း",
      "ဗျာဒိတ်",
      "ယေရှုချစ်သောတပည့်တော်ဟုခေါ်ခံရသည်",
      "ဗျာဒိတ်ကျမ်းကိုရေးသားခဲ့သည်",
      "ကားတိုင်အောက်တွင်မိခင်ကိုစောင့်ရှောက်ရန်တာဝန်ယူခဲ့သည်"
    ],
    104: [
      "ရေတပ်",
      "သမာရိ",
      "သမာရိတွင်ဧဝံဂေလိသတင်းကောင်းဟောခဲ့သည်",
      "အယ်သီယိုးပီးယားလူကိုနှစ်ခြင်းပေးခဲ့သည်",
      "လမ်းမှာလိုက်ကြပါဟုဆိုခဲ့သည်"
    ],
    105: [
      "တောင်ဝှေး",
      "လူသတ်",
      "နှစ်ခြင်းဆရာကိုခေါင်းဖြတ်သတ်ခဲ့သည်",
      "ညီ၏ဇနီးကိုယူထားခဲ့သည်",
      "ပွဲတော်ကျင်းပစဉ်ကတိပေးခဲ့သည်"
    ],
    106: [
      "အခွန်ကောက်",
      "စာရင်း",
      "အခွန်ကောက်ဘဝမှတပည့်တော်ဖြစ်လာခဲ့သည်",
      "ခရစ်တော်၏မျိုးရိုးစဉ်ဆက်ကိုမှတ်တမ်းတင်ခဲ့သည်",
      "အခွန်စားပွဲမှခေါ်ခံရသည်"
    ],
    107: [
      "သံသယ",
      "ဒဏ်ရာ",
      "ဒဏ်ရာမမြင်ရလျှင်မယုံဟုဆိုခဲ့သည်",
      "ကျွန်ုပ်၏အရှင်ဟုဝန်ခံခဲ့သည်",
      "အိန္ဒိယသို့သာသနာပြုသွားခဲ့သည်ဟုယူဆကြသည်"
    ],
    108: [
      "ယဇ်ပုရောဟိတ်",
      "တရားရုံး",
      "ထိုနှစ်၏ယဇ်ပုရောဟိတ်ကြီးဖြစ်ခဲ့သည်",
      "လူတစ်ဦးသေခြင်းသည်လူများအတွက်ကောင်းသည်ဟုဆိုခဲ့သည်",
      "တရားစွဲဆိုခြင်းကိုဦးဆောင်ခဲ့သည်"
    ],
    109: [
      "နှလုံးသား",
      "တပည့်တော်",
      "တပည့်တော်ဆယ့်နှစ်ပါးထဲမှတစ်ပါး",
      "ယုဒ(ဣသကာရုတ်မဟုတ်)ဟုလည်းခေါ်ခံရသည်",
      "အများမသိကြသောတပည့်တော်တစ်ဦး"
    ],
    110: [
      "စိတ်အား",
      "မီးအိမ်",
      "ဇီလုတ်ဟုခေါ်ခံရသည်",
      "နိုင်ငံရေးစိတ်ပါဝင်စားသူ",
      "တပည့်တော်ဆယ့်နှစ်ပါးထဲမှအမည်သာရှိသူ"
    ],
    111: [
      "ငွေအိတ်",
      "နမ်း",
      "နမ်းရှုပ်ခြင်းဖြင့်သခင်ကိုသစ္စာဖောက်ခဲ့သည်",
      "ငွေအပြားသုံးဆယ်ဖြင့်ရောင်းစားခဲ့သည်",
      "နောင်တရပြီးကိုယ့်ကိုကိုယ်သတ်သေခဲ့သည်"
    ],
    112: [
      "မနက်စောစော",
      "နတ်ဆိုး",
      "နတ်ဆိုးခုနစ်ကောင်မှလွတ်မြောက်ခဲ့သည်",
      "ရှင်ပြန်ထမြောက်ပြီးပထမဆုံးတွေ့ခဲ့သည်",
      "ကားတိုင်အောက်တွင်ရပ်နေခဲ့သည်"
    ],
    113: [
      "မီးဖို",
      "အလုပ်များ",
      "အစ်မကအိမ်မှုကိစ္စများဖြင့်အလုပ်ရှုပ်နေသည်",
      "ညီမကထိုင်နားထောင်နေခြင်းကိုမကျေနပ်ခဲ့",
      "ညီအစ်ကို၏ရှင်ပြန်ထမြောက်ခြင်းကိုမြင်ခဲ့သည်"
    ],
    114: [
      "ခြေတော်",
      "ထိုင်",
      "ဆရာ့ခြေရင်းတွင်ထိုင်ပြီးနားထောင်ခဲ့သည်",
      "ကောင်းမွန်သောအပိုင်းကိုရွေးချယ်ခဲ့သည်ဟုချီးကျူးခံရသည်",
      "မွှေးနံ့သာဆီဖြင့်ခြေတော်ကိုလိမ်းခဲ့သည်"
    ],
    115: [
      "သင်္ချိုင်း",
      "ခေါ်",
      "လေးရက်ကြာသေပြီးမှပြန်ရှင်လာခဲ့သည်",
      "ဗေသနိမြို့မှလာသူ",
      "ညီအမနှစ်ယောက်ရှိသည်"
    ],
    116: [
      "သင်္ဘောသဖန်း",
      "ပု",
      "သင်္ဘောသဖန်းပင်ပေါ်တွင်တက်ကြည့်ခဲ့သည်",
      "အခွန်ကောက်အကြီးအကဲဖြစ်ခဲ့သည်",
      "ပိုင်ဆိုင်မှုတစ်ဝက်ကိုဆင်းရဲသူများကိုပေးမည်ဟုဆိုခဲ့သည်"
    ],
    117: [
      "ည",
      "ဆရာ",
      "ညဘက်လာရောက်တွေ့ဆုံခဲ့သည်",
      "ဖာရိရှဲအဖွဲ့ဝင်တစ်ဦးဖြစ်ခဲ့သည်",
      "ဒုတိယမွေးခြင်းအကြောင်းမေးခဲ့သည်"
    ],
    118: [
      "ကလေးသတ်",
      "ဘုရင်",
      "ဗက်လင်ရှိကလေးငယ်များကိုသတ်စေခဲ့သည်",
      "ဘုရားကျောင်းတော်ကိုပြန်လည်တည်ဆောက်ခဲ့သည်",
      "အာဏာအတွက်မိမိသားကိုပင်သတ်ခဲ့သည်"
    ],
    119: [
      "လက်ဆေး",
      "တရားသူကြီး",
      "လက်ကိုဆေးပြီးတာဝန်မှရှောင်ခဲ့သည်",
      "အပြစ်ကိုမတွေ့ဘဲလည်းသေဒဏ်ချခဲ့သည်",
      "ရောမအုပ်ချုပ်ရေးမှူးဖြစ်ခဲ့သည်"
    ],
    120: [
      "မဲ",
      "အစားထိုး",
      "မဲနိုက်ပြီးရွေးချယ်ခံရသည်",
      "သစ္စာဖောက်သူ၏နေရာကိုအစားထိုးခဲ့သည်",
      "တမန်တော်ဆယ့်နှစ်ပါးထဲသို့ဝင်ခဲ့သည်"
    ],
    121: [
      "ခရီးသွား",
      "စာ",
      "ဒမတ်စကုလမ်းတွင်အလင်းကိုမြင်ခဲ့သည်",
      "ဧဝံဂေလိခရီးစဉ်သုံးခုသွားခဲ့သည်",
      "ထောင်ထဲမှစာများရေးသားခဲ့သည်"
    ],
    122: [
      "အားပေး",
      "ကျပြူ",
      "အားပေးသူဟုအမည်ရခဲ့သည်",
      "ပထမဧဝံဂေလိခရီးစဉ်တွင်အတူသွားခဲ့သည်",
      "သာသနာပြုအဖြစ်ခွဲခွာသွားခဲ့သည်"
    ],
    123: [
      "ကျောက်",
      "ပထမ",
      "ပထမဆုံးယုံကြည်ချက်ကြောင့်အသေခံသူ",
      "ကောင်းကင်တမန်ကဲ့သို့မျက်နှာထွန်းလင်းခဲ့သည်",
      "ကျောက်ခဲဖြင့်ပစ်သတ်ခံရသည်"
    ],
    124: [
      "ရထား",
      "သမာရိ",
      "အယ်သီယိုးပီးယားလူကိုရထားပေါ်တွင်နှစ်ခြင်းပေးခဲ့သည်",
      "သမာရိတွင်သတင်းကောင်းဟောခဲ့သည်",
      "သမီးလေးယောက်ကပရောဖက်ပြုကြသည်"
    ],
    125: [
      "ငယ်ရွယ်",
      "ယုံကြည်",
      "ငယ်ရွယ်သောခေါင်းဆောင်တစ်ဦး",
      "ဆရာကနာမကျန်းမဖြစ်ရန်စပျစ်ရည်အနည်းငယ်သောက်ရန်ညွှန်ကြားခဲ့သည်",
      "အဖွားဆီမှယုံကြည်ခြင်းကိုအမွေဆက်ခံခဲ့သည်"
    ],
    126: [
      "ဆရာဝန်",
      "စာရေး",
      "ဆရာဝန်ဖြစ်ပြီးသမိုင်းရေးသားသူ",
      "တမန်တော်ဝတ္ထုကိုရေးသားခဲ့သည်",
      "ခရီးစဉ်တစ်လျှောက်မှတ်တမ်းတင်ခဲ့သည်"
    ],
    127: [
      "တဲ",
      "ဇနီးမောင်နှံ",
      "တဲချုပ်လုပ်ငန်းဖြင့်အသက်မွေးခဲ့သည်",
      "ဟောပြောသူတစ်ဦးကိုပိုမိုတိကျစွာသင်ပေးခဲ့သည်",
      "ဇနီးမောင်နှံအတူသာသနာပြုခဲ့သည်"
    ],
    128: [
      "ထောင်",
      "သီချင်း",
      "ထောင်ထဲတွင်ချီးမွမ်းသီချင်းဆိုနေစဉ်ငလျင်လှုပ်ခဲ့သည်",
      "ဒုတိယဧဝံဂေလိခရီးစဉ်တွင်အတူသွားခဲ့သည်",
      "ထောင်မှလွတ်မြောက်ခဲ့သည်"
    ],
    129: [
      "အသက်ရှည်",
      "ဘိုးဘွား",
      "လူသားအားလုံးထဲမှအသက်အရှည်ဆုံး",
      "နှစ်ပေါင်းကိုးရာ့ခြောက်ဆယ့်ကိုးနှစ်အသက်ရှင်ခဲ့သည်",
      "ရေလွှမ်းမိုးသောနှစ်တွင်သေဆုံးခဲ့သည်"
    ],
    130: [
      "သင်္ဘော",
      "တတိယ",
      "ရေလွှမ်းမိုးမှကယ်တင်ခံရသောသားသုံးယောက်ထဲမှတစ်ယောက်",
      "ဥရောပလူမျိုးများ၏ဘိုးဘွားဟုယူဆကြသည်",
      "သားအငယ်ဆုံးဖြစ်ခဲ့သည်"
    ],
    131: [
      "မုန့်",
      "စပျစ်ရည်",
      "ရာဇဝင်မရှိဘဲပေါ်ထွက်လာသူ",
      "မုန့်နှင့်စပျစ်ရည်ဖြင့်ကြိုဆိုခဲ့သည်",
      "ဘုရင်နှင့်ယဇ်ပုရောဟိတ်နှစ်မျိုးလုံးဖြစ်သူ"
    ],
    132: [
      "မိဒျန်",
      "ညှပ်ဖြတ်",
      "ယဇ်ပုရောဟိတ်၏သမီး",
      "ခင်ပွန်း၏အသက်ကိုကယ်တင်ရန်သားကိုအရေဖျားလှီးပေးခဲ့သည်",
      "မိဒျန်ပြည်မှလာသောဇနီး"
    ],
    133: [
      "လှံ",
      "စိတ်အား",
      "ရုပ်ထုကိုးကွယ်မှုကိုအဆုံးသတ်ခဲ့သည်",
      "လှံဖြင့်ထိုးပြီးဘေးဒဏ်ကိုရပ်တန့်စေခဲ့သည်",
      "ယဇ်ပုရောဟိတ်၏သား"
    ],
    134: [
      "ခိုးယူ",
      "ကျိန်ခြင်း",
      "ယေရိခေါမှကျိန်ပစ္စည်းကိုခိုးယူခဲ့သည်",
      "ဣသရေလစစ်တပ်ကိုရှုံးနိမ့်စေခဲ့သည်",
      "ကျောက်ခဲဖြင့်ပစ်သတ်ခံရသည်"
    ],
    135: [
      "သားငယ်",
      "ရက်စက်",
      "ညီအစ်ကိုခုနစ်ဆယ်ကိုသတ်ခဲ့သည်",
      "ကျောက်ဆုံပင်ပုံပြင်ကိုပြောခဲ့သူကလွတ်ခဲ့သည်",
      "အမျိုးသမီးတစ်ဦးကကျောက်ဆုံဖြင့်သတ်ခဲ့သည်"
    ],
    136: [
      "လှည့်ဖြား",
      "ချစ်ခြင်း",
      "ခွန်အားလျှို့ဝှက်ချက်ကိုထုတ်ဖော်စေခဲ့သည်",
      "ငွေကြေးအတွက်သစ္စာဖောက်ခဲ့သည်",
      "ချစ်ခြင်းကိုအသုံးချပြီးလှည့်ဖြားခဲ့သည်"
    ],
    137: [
      "ဗက်လင်",
      "ဖခင်",
      "သားရှစ်ယောက်၏ဖခင်",
      "ဗက်လင်မှလူကြီး",
      "သားအငယ်ဆုံးကဘုရင်ဖြစ်လာခဲ့သည်"
    ],
    138: [
      "သစ္စာ",
      "စစ်သည်",
      "သစ္စာရှိသောစစ်သည်တစ်ဦး",
      "ဘုရင်၏ကြံစည်မှုကြောင့်စစ်မြေပြင်တွင်သေခဲ့သည်",
      "ဇနီးကိုဘုရင်ယူခဲ့သည်"
    ],
    139: [
      "ခြေမ",
      "စားပွဲ",
      "ဘုရင်၏စားပွဲတွင်ထိုင်ခွင့်ရခဲ့သည်",
      "ဖခင်၏မိတ်ဆွေကကြင်နာမှုပြခဲ့သည်",
      "ခြေနှစ်ဖက်စလုံးမသန်စွမ်း"
    ],
    140: [
      "စစ်သူကြီး",
      "လျှို့ဝှက်",
      "ဘုရင်၏စစ်သူကြီးဖြစ်ခဲ့သည်",
      "အမိန့်ကိုဆန့်ကျင်ပြီးပုန်ကန်သူကိုသတ်ခဲ့သည်",
      "စစ်ပွဲတွင်ကြံစည်မှုများဖြင့်ကျော်ကြား"
    ],
    141: [
      "အကြံပေး",
      "ကြိုး",
      "ဉာဏ်ပညာရှိသောအကြံပေးတစ်ဦးဖြစ်ခဲ့သည်",
      "အကြံဉာဏ်ကိုမလိုက်နာသောအခါဆွဲကြိုးဆွဲခဲ့သည်",
      "ပုန်ကန်သူဘက်သို့ကူးပြောင်းခဲ့သည်"
    ],
    142: [
      "အခန်း",
      "သား",
      "ပရောဖက်အတွက်အခန်းကိုပြင်ဆင်ပေးခဲ့သည်",
      "သားကိုပြန်ရှင်ထမြောက်စေခဲ့သည်",
      "ဧည့်သည်ဝတ်ကိုကောင်းစွာပြုခဲ့သည်"
    ],
    143: [
      "ရထား",
      "ဆီ",
      "ဆိုးသွမ်းသောဘုရင်မ၏အမျိုးအနွယ်ကိုဖျက်ဆီးခဲ့သည်",
      "မိုက်မဲစွာရထားမောင်းသူဟုကျော်ကြားသည်",
      "ဆီလိမ်းခံရပြီးဘုရင်ဖြစ်လာခဲ့သည်"
    ],
    144: [
      "ဘုရင်မ",
      "သတ်ဖြတ်",
      "အာဏာအတွက်မိမိမြေးများကိုသတ်ခဲ့သည်",
      "ဘုရားကျောင်းတွင်သတ်ခံရသည်",
      "ဆိုးသွမ်းသောမိဖုရား၏သမီး"
    ],
    145: [
      "ယဇ်ပုရောဟိတ်",
      "ပြုပြင်",
      "ငယ်ရွယ်သောဘုရင်ကိုကြီးပြင်းစေခဲ့သည်",
      "ဘုရားကျောင်းကိုပြန်လည်ပြုပြင်ခဲ့သည်",
      "ဆိုးသွမ်းသောဘုရင်မကိုဖြုတ်ချခဲ့သည်"
    ],
    146: [
      "ငယ်ရွယ်",
      "ပြုပြင်",
      "ခုနစ်နှစ်အရွယ်တွင်ဘုရင်ဖြစ်ခဲ့သည်",
      "ယဇ်ပုရောဟိတ်သေပြီးနောက်ဆိုးသွမ်းသွားခဲ့သည်",
      "ဘုရားကျောင်းကိုပြုပြင်ခဲ့သည်"
    ],
    147: [
      "နောင်တ",
      "အကျဉ်း",
      "အကျဉ်းကျခဲ့ပြီးမှနောင်တရခဲ့သည်",
      "အဆိုးဆုံးဘုရင်များထဲမှတစ်ဦး",
      "သားကိုမီးထဲဖြတ်စေခဲ့သည်"
    ],
    148: [
      "ကျိုင်းကောင်",
      "ဝိညာဉ်",
      "ကျိုင်းကောင်ဘေးဒဏ်ကိုပရောဖက်ပြုခဲ့သည်",
      "ဝိညာဉ်တော်သွန်းလောင်းခြင်းကိုကြိုတင်ဟောပြောခဲ့သည်",
      "နောင်တရပြီးဘုရားသခင်ထံပြန်လှည့်ရန်တိုက်တွန်းခဲ့သည်"
    ],
    149: [
      "နိနဝေ",
      "ပျက်စီး",
      "နိနဝေမြို့၏ပျက်စီးခြင်းကိုပရောဖက်ပြုခဲ့သည်",
      "အာရှုရိအင်ပါယာ၏ကျဆင်းခြင်းကိုဟောပြောခဲ့သည်",
      "ဖိနှိပ်ချုပ်ချယ်သူကိုတရားစီရင်မည်ဟုကြေငြာခဲ့သည်"
    ],
    150: [
      "အုတ်မြစ်",
      "ဗိမာန်",
      "ဗိမာန်တော်ကိုပြန်လည်တည်ဆောက်ရာတွင်ဦးဆောင်ခဲ့သည်",
      "ဒါဝိဒ်မင်း၏မျိုးနွယ်မှဆင်းသက်လာသည်",
      "အုတ်မြစ်ကိုချသောအခါလူကြီးများငိုကြွေးခဲ့သည်"
    ],
    151: [
      "ဘုရားကျောင်း",
      "တည်ဆောက်",
      "ဘုရားကျောင်းပြန်လည်တည်ဆောက်ရေးကိုအားပေးခဲ့သည်",
      "ဘုရားသခင်၏အိမ်ကိုမေ့နေသောလူများကိုသတိပေးခဲ့သည်",
      "ဇာခရိနှင့်ခေတ်ပြိုင်ပရောဖက်"
    ],
    152: [
      "ကိုယ်ဝန်",
      "ဝမ်းမြောက်",
      "အသက်ကြီးသော်လည်းကိုယ်ဝန်ဆောင်ခဲ့သည်",
      "ဝမ်းထဲမှကလေးခုန်ပေါက်ခဲ့သည်",
      "ဆွေမျိုးတော်အမျိုးသမီးကိုလာရောက်တွေ့ဆုံခဲ့သည်"
    ],
    153: [
      "ဘုရားကျောင်း",
      "အသက်ကြီး",
      "ဘုရားကျောင်းတွင်ကလေးငယ်ကိုမြင်ခဲ့သည်",
      "နှစ်ပေါင်းများစွာဆုတောင်းပြီးစောင့်ဆိုင်းခဲ့သည်",
      "ကယ်တင်ခြင်းကိုမြင်ပြီးမှသေနိုင်တော့မည်ဟုဆိုခဲ့သူ"
    ],
    154: [
      "ကလေးငယ်",
      "ကတိ",
      "ကယ်တင်ရှင်ကိုမမြင်ရလျှင်မသေဟုကတိရခဲ့သည်",
      "ဘုရားကျောင်းတွင်ကလေးငယ်ကိုချီပွေ့ခဲ့သည်",
      "ဣသရေလ၏နှစ်သိမ့်ခြင်းကိုစောင့်မျှော်ခဲ့သည်"
    ],
    155: [
      "ငါးဖမ်း",
      "ညီ",
      "ညီဖြစ်သူကိုဆရာထံခေါ်ဆောင်ခဲ့သည်",
      "ငါးဖမ်းသမားဘဝမှတပည့်တော်ဖြစ်လာခဲ့သည်",
      "ဂရိလူများကိုဆရာထံခေါ်ဆောင်ခဲ့သည်"
    ],
    156: [
      "သမီး",
      "ယုံကြည်",
      "သမီးငယ်သေသွားသောအခါကိုယ်တိုင်လာရောက်တောင်းဆိုခဲ့သည်",
      "တရားဝင်ထံမှလာသောခေါင်းဆောင်",
      "သမီးကိုပြန်ရှင်ထမြောက်စေခဲ့သည်"
    ],
    157: [
      "ခွဲခွာ",
      "မွာဘ",
      "ယောက္ခမနှင့်ခွဲခွာခဲ့သည်",
      "မိမိလူမျိုးထံပြန်သွားရန်ရွေးချယ်ခဲ့သည်",
      "ချွေးမအဖော်ကမသွားဘဲလှည့်ပြန်ခဲ့သည်"
    ],
    158: [
      "အိပ်မက်",
      "သတိပေး",
      "ခင်ပွန်းကိုဖြောင့်မတ်သောသူနှင့်မပတ်သက်ရန်သတိပေးခဲ့သည်",
      "အိပ်မက်ထဲတွင်ဆင်းရဲခံရသည်",
      "တရားစီရင်နေသောခင်ပွန်းထံစာပို့ခဲ့သည်"
    ],
    159: [
      "ခြင်္သေ့",
      "ခရီးဖော်",
      "သတင်းကောင်းကိုမှတ်တမ်းတင်ခဲ့သည်",
      "ဗာနဗနှင့်ခွဲခွာသွားပြီးနောက်ပြန်လာခဲ့သည်",
      "အစကခရီးစဉ်မှအလယ်တွင်ပြန်သွားခဲ့သူ"
    ],
    160: [
      "ညီ",
      "ယေရုဆလင်",
      "ညီတော်ဟုခေါ်ခံရသောယုံကြည်သူခေါင်းဆောင်",
      "ယေရုဆလင်အစည်းအဝေးကိုဦးဆောင်ခဲ့သည်",
      "စာတစ်စောင်ရေးသားခဲ့သည်"
    ],
    161: [
      "လိမ်ညာ",
      "ချက်ခြင်း",
      "ပိုင်ဆိုင်မှုရောင်းချမှုတွင်လိမ်ညာခဲ့သည်",
      "ဇနီးနှင့်အတူချက်ခြင်းသေဆုံးခဲ့သည်",
      "သန့်ရှင်းသောဝိညာဉ်ကိုလိမ်ညာခဲ့သည်"
    ],
    162: [
      "ငွေ",
      "လိမ်ညာ",
      "ခင်ပွန်းနှင့်အတူမြေကွက်ဈေးကိုလိမ်ညာခဲ့သည်",
      "ခင်ပွန်းသေပြီးသုံးနာရီအကြာတွင်သေဆုံးခဲ့သည်",
      "သန့်ရှင်းသောဝိညာဉ်ကိုစမ်းသပ်ခဲ့သည်"
    ],
    163: [
      "ဆရာ",
      "သတိ",
      "ဘုရားသခင့်ထံမှဖြစ်လျှင်ရပ်တန့်၍မရဟုအကြံပေးခဲ့သည်",
      "ပညတ်တရားဆရာတစ်ဦးဖြစ်ခဲ့သည်",
      "တမန်တော်များကိုသတ်ခြင်းမှကာကွယ်ခဲ့သည်"
    ],
    164: [
      "အကျဉ်း",
      "တမန်တော်",
      "တမန်တော်ကိုထောင်ချပြီးသတ်စေခဲ့သည်",
      "ကောင်းကင်တမန်မှမဟုတ်ဘဲချီးကျူးမှုကိုလက်ခံခဲ့သည်",
      "ပိုးကိုက်ပြီးသေဆုံးခဲ့သည်"
    ],
    165: [
      "ကျွန်",
      "စာ",
      "ထွက်ပြေးသောကျွန်ကိုပြန်လည်လက်ခံရန်တောင်းခံခံရသည်",
      "ကျွန်ကိုညီအစ်ကိုကဲ့သို့ဆက်ဆံရန်တိုက်တွန်းခံရသည်",
      "ကောလောသဲမြို့မှယုံကြည်သူ"
    ],
    166: [
      "ထွက်ပြေး",
      "ညီအစ်ကို",
      "ထွက်ပြေးသောကျွန်တစ်ဦး",
      "ထောင်ထဲတွင်ယုံကြည်သူဖြစ်လာခဲ့သည်",
      "သခင်ထံပြန်ပို့ခံရသည်"
    ],
    167: [
      "ကျွန်း",
      "တည်ဆောက်",
      "ကရေတကျွန်းတွင်အသင်းတော်ကိုတည်ဆောက်ခဲ့သည်",
      "ယုံကြည်ခြင်းတွင်စစ်မှန်သောသားဟုခေါ်ခံရသည်",
      "ခေါင်းဆောင်များကိုခန့်အပ်ရန်တာဝန်ပေးခံရသည်"
    ],
    168: [
      "ဆုတောင်း",
      "ဖော်ပြ",
      "အမြဲတစေဆုတောင်းပေးသူ",
      "ကောလောသဲအသင်းတော်ကိုတည်ထောင်ခဲ့သည်",
      "ထောင်ထဲတွင်အတူပါဝင်ခဲ့သူ"
    ]
  },
  "th": {
    1: [
      "เอเดน",
      "ดิน",
      "จุดเริ่มต้นของมนุษยชาติ",
      "กินสิ่งต้องห้ามในสวน",
      "ตั้งชื่อสัตว์ทุกชนิดด้วยตนเอง"
    ],
    2: [
      "ผลไม้",
      "ซี่โครง",
      "ถูกหลอกลวงโดยสัตว์ในสวน",
      "มารดาของสิ่งมีชีวิตทั้งปวง",
      "ต้นกำเนิดของความเจ็บปวดในการคลอด"
    ],
    3: [
      "แกะ",
      "เลือด",
      "เครื่องบูชาที่พระเจ้าพอใจ",
      "พี่ชายอิจฉาจนทำสิ่งเลวร้าย",
      "เสียงร้องจากพื้นดิน"
    ],
    4: [
      "เครื่องหมาย",
      "คนเร่ร่อน",
      "ผู้เพาะปลูกคนแรก",
      "เครื่องบูชาที่ไม่ได้รับการยอมรับ",
      "ถูกสาปให้พเนจรไปทั่วแผ่นดิน"
    ],
    5: [
      "เดินกับพระเจ้า",
      "หายไป",
      "ไม่เคยลิ้มรสความตาย",
      "มีอายุยืนหลายร้อยปี",
      "ถูกรับขึ้นไปโดยไม่มีใครเห็น"
    ],
    6: [
      "เรือ",
      "น้ำท่วม",
      "สร้างสิ่งยิ่งใหญ่ตามคำสั่ง",
      "รวบรวมสัตว์ทีละคู่",
      "นกพิราบนำกิ่งมะกอกกลับมา"
    ],
    7: [
      "บุตรชาย",
      "พร",
      "ได้รับเกียรติจากบิดาหลังเหตุการณ์น่าอาย",
      "บรรพบุรุษของชนชาติมากมาย",
      "พี่น้องสามคนรอดจากน้ำ"
    ],
    8: [
      "ดาว",
      "ทราย",
      "ออกจากบ้านเกิดตามพระบัญชา",
      "เกือบถวายบุตรชายเป็นเครื่องบูชา",
      "บิดาแห่งชนชาติมากมายตอนอายุมาก"
    ],
    9: [
      "หัวเราะ",
      "เต็นท์",
      "ตั้งครรภ์เมื่ออายุเก้าสิบ",
      "หัวเราะเมื่อได้ยินคำสัญญา",
      "หญิงงามที่ถูกเรียกว่าน้องสาว"
    ],
    10: [
      "ถ้ำ",
      "เกลือ",
      "หนีจากเมืองที่ถูกทำลาย",
      "เลือกที่ราบอุดมสมบูรณ์",
      "ภรรยาหันกลับไปมองแล้วกลายเป็นอย่างอื่น"
    ],
    11: [
      "ทะเลทราย",
      "บ่อน้ำ",
      "สาวใช้ที่กลายเป็นมารดา",
      "ถูกขับไล่ออกไปกับบุตรชาย",
      "ทูตสวรรค์พบเธอริมบ่อน้ำ"
    ],
    12: [
      "ลูกธนู",
      "สิบสองเจ้านาย",
      "เติบโตในถิ่นทุรกันดาร",
      "บุตรชายของสาวใช้",
      "นักยิงธนูแห่งทะเลทราย"
    ],
    13: [
      "หัวเราะ",
      "บ่อน้ำ",
      "เกือบถูกถวายบนแท่นบูชา",
      "แต่งงานกับหญิงจากบ้านเกิดของบิดา",
      "ตาบอดตอนแก่แต่ยังให้พร"
    ],
    14: [
      "หม้อน้ำ",
      "อูฐ",
      "ให้น้ำอูฐดื่มที่บ่อน้ำ",
      "วางแผนช่วยบุตรชายคนเล็ก",
      "เดินทางไกลมาแต่งงาน"
    ],
    15: [
      "ขน",
      "ถ้วยซุป",
      "ขายสิทธิ์บุตรหัวปีเพื่ออาหาร",
      "พรานป่าที่มีขนดก",
      "ร้องไห้เมื่อรู้ว่าสูญเสียพร"
    ],
    16: [
      "บันได",
      "มวยปล้ำ",
      "หลอกบิดาด้วยหนังแพะ",
      "ปล้ำกับทูตสวรรค์ตลอดคืน",
      "ได้ชื่อใหม่หมายถึงผู้ต่อสู้กับพระเจ้า"
    ],
    17: [
      "สวย",
      "แกะ",
      "รอคอยเจ็ดปีเพื่อแต่งงาน",
      "เสียชีวิตขณะคลอดบุตร",
      "ขโมยรูปเคารพของบิดา"
    ],
    18: [
      "ตาอ่อน",
      "บุตรมาก",
      "แต่งงานก่อนน้องสาวโดยกลอุบาย",
      "คลอดบุตรชายหกคน",
      "รู้สึกว่าไม่ได้รับความรัก"
    ],
    19: [
      "ความฝัน",
      "เสื้อคลุม",
      "ถูกขายโดยพี่ชายตัวเอง",
      "ตีความฝันของฟาโรห์",
      "ผู้จัดการเสบียงอาหารในยามอดอยาก"
    ],
    20: [
      "สิงโต",
      "คทา",
      "รับประกันความปลอดภัยของน้องชาย",
      "ต้นตระกูลของกษัตริย์",
      "เสนอขายน้องชายแทนการฆ่า"
    ],
    21: [
      "ผ้าคลุม",
      "ฝาแฝด",
      "ปลอมตัวริมทางเพื่อความยุติธรรม",
      "คลอดฝาแฝดที่มีด้ายแดง",
      "สะใภ้ที่ถูกตัดสินอย่างไม่ยุติธรรม"
    ],
    22: [
      "บุตรหัวปี",
      "ไม่มั่นคง",
      "นอนบนที่นอนของบิดา",
      "สูญเสียสิทธิ์บุตรหัวปี",
      "พยายามช่วยน้องชายจากบ่อ"
    ],
    23: [
      "หมาป่า",
      "ถุงข้าว",
      "น้องสุดท้องที่ถูกรักมาก",
      "ถ้วยเงินถูกซ่อนในถุงของเขา",
      "มารดาเสียชีวิตขณะให้กำเนิด"
    ],
    24: [
      "ฝีหนอง",
      "ความอดทน",
      "สูญเสียทุกอย่างในวันเดียว",
      "เพื่อนสามคนมาปลอบแต่กลับกล่าวหา",
      "ได้รับคืนเป็นสองเท่า"
    ],
    25: [
      "พุ่มไม้ลุกไฟ",
      "แผ่นศิลา",
      "ลอยน้ำตั้งแต่เป็นทารก",
      "แยกทะเลออกเป็นสองฝั่ง",
      "ไม่ได้เข้าแผ่นดินแห่งคำสัญญา"
    ],
    26: [
      "ไม้เท้า",
      "ลูกวัวทองคำ",
      "พูดแทนพี่ชาย",
      "ไม้เท้าเปลี่ยนเป็นงู",
      "มหาปุโรหิตคนแรก"
    ],
    27: [
      "รำฉลอง",
      "ร้องเพลง",
      "นำหญิงร้องเพลงฉลองข้ามทะเล",
      "พี่สาวที่เฝ้าดูน้องชายลอยน้ำ",
      "เป็นโรคผิวหนังชั่วคราว"
    ],
    28: [
      "สิบภัยพิบัติ",
      "บัลลังก์",
      "หัวใจแข็งกระด้าง",
      "ไล่ตามจนถึงทะเล",
      "ปฏิเสธปล่อยทาสไป"
    ],
    29: [
      "แผนลับ",
      "ค่ายทหาร",
      "ได้ยินแผนสังหารและรีบแจ้ง",
      "วิ่งไปบอกลุงในคุก",
      "เด็กหนุ่มที่ช่วยชีวิตอัครสาวก"
    ],
    30: [
      "ทะเลทราย",
      "คำแนะนำ",
      "พ่อตาที่ให้คำปรึกษาเรื่องการจัดการ",
      "ปุโรหิตแห่งมีเดียน",
      "ต้อนรับลูกเขยที่หนีมา"
    ],
    31: [
      "แผ่นดินอ้า",
      "กบฏ",
      "ท้าทายผู้นำที่พระเจ้าแต่งตั้ง",
      "แผ่นดินแยกออกกลืนกิน",
      "ต้องการตำแหน่งปุโรหิต"
    ],
    32: [
      "ลา",
      "คำสาป",
      "ลาพูดได้",
      "ถูกจ้างให้สาปแช่งแต่กลับอวยพร",
      "ทูตสวรรค์ขวางทางบนถนน"
    ],
    33: [
      "องุ่น",
      "ศรัทธา",
      "สอดแนมแผ่นดินแห่งคำสัญญา",
      "ยังแข็งแรงตอนอายุแปดสิบห้า",
      "ขอภูเขาเป็นมรดก"
    ],
    34: [
      "กำแพง",
      "ดวงอาทิตย์หยุดนิ่ง",
      "ผู้นำหลังโมเสส",
      "กำแพงเมืองพังทลายด้วยเสียงแตร",
      "สั่งให้ดวงอาทิตย์หยุดเคลื่อนที่"
    ],
    35: [
      "เชือกแดง",
      "หน้าต่าง",
      "ซ่อนสายสืบไว้บนหลังคา",
      "ผูกเชือกแดงที่หน้าต่าง",
      "หญิงจากเมืองที่กำแพงพัง"
    ],
    36: [
      "ต้นอินทผลัม",
      "ผู้พิพากษา",
      "พิพากษาอิสราเอลใต้ต้นไม้",
      "หญิงผู้นำที่ปลุกใจนักรบ",
      "ร้องเพลงฉลองชัยชนะ"
    ],
    37: [
      "สายฟ้า",
      "ลังเล",
      "ไม่ยอมไปรบถ้าไม่มีผู้หญิงไปด้วย",
      "นักรบที่ต้องการกำลังใจ",
      "เกียรติยศตกเป็นของหญิง"
    ],
    38: [
      "หมุด",
      "น้ำนม",
      "ให้ศัตรูดื่มนมแล้วหลับ",
      "ใช้หมุดเต็นท์ปักศีรษะศัตรู",
      "หญิงกล้าหาญในเต็นท์"
    ],
    39: [
      "ขนแกะ",
      "คบเพลิง",
      "ทดสอบพระเจ้าด้วยขนแกะเปียกแห้ง",
      "ทหารสามร้อยคนกับคบเพลิง",
      "ทำลายแท่นบูชาของพ่อ"
    ],
    40: [
      "คำปฏิญาณ",
      "น้ำตา",
      "ให้คำปฏิญาณที่เสียดาย",
      "บุตรสาวออกมาต้อนรับด้วยรำฉลอง",
      "ผู้พิพากษาที่ถูกพี่น้องรังเกียจ"
    ],
    41: [
      "ผม",
      "สุนัขจิ้งจอก",
      "พลังอยู่ที่เส้นผม",
      "ทำลายวิหารด้วยสองมือ",
      "ถูกตัดผมขณะหลับ"
    ],
    42: [
      "หน้าต่าง",
      "หลับ",
      "ตกจากหน้าต่างขณะฟังเทศนา",
      "ถูกปลุกให้ฟื้นคืนชีพ",
      "หนุ่มน้อยที่หลับบนขอบหน้าต่าง"
    ],
    43: [
      "ทุ่งข้าว",
      "ความซื่อสัตย์",
      "เก็บข้าวตกตามหลังชาวนา",
      "ติดตามแม่สามีไปต่างแดน",
      "หญิงต่างชาติในสายตระกูลพระเยซู"
    ],
    44: [
      "ความขมขื่น",
      "การกลับบ้าน",
      "สูญเสียสามีและลูกชายทั้งสอง",
      "บอกให้เรียกนางว่าขมขื่น",
      "กลับบ้านเกิดพร้อมสะใภ้"
    ],
    45: [
      "ทุ่งข้าว",
      "ญาติสนิท",
      "เจ้าของนาที่ใจดี",
      "คลุมผ้าให้หญิงที่มานอนแทบเท้า",
      "ไถ่ที่ดินและแต่งงานกับหญิงต่างชาติ"
    ],
    46: [
      "คำอธิษฐาน",
      "น้ำตา",
      "อธิษฐานเงียบจนถูกเข้าใจผิดว่าเมา",
      "ถวายบุตรชายรับใช้ในพระวิหาร",
      "มารดาที่รอคอยด้วยความทุกข์"
    ],
    47: [
      "เสียง",
      "น้ำมัน",
      "ได้ยินเสียงเรียกตอนกลางคืน",
      "เจิมกษัตริย์องค์แรก",
      "ถูกเรียกตั้งแต่เป็นเด็ก"
    ],
    48: [
      "ปุโรหิต",
      "ตาบอด",
      "บุตรชายทำชั่วในพระวิหาร",
      "ล้มจากเก้าอี้เมื่อได้ยินข่าวร้าย",
      "เลี้ยงดูเด็กที่ถูกถวาย"
    ],
    49: [
      "สูงกว่าคนอื่น",
      "หอก",
      "กษัตริย์องค์แรกที่ถูกเลือก",
      "ขว้างหอกใส่คนเล่นพิณ",
      "ไปหาร่างทรงก่อนสงคราม"
    ],
    50: [
      "พิณ",
      "ก้อนหิน",
      "เด็กเลี้ยงแกะที่กลายเป็นกษัตริย์",
      "ฆ่ายักษ์ด้วยหนังสติ๊ก",
      "เต้นรำต่อหน้าหีบแห่งพันธสัญญา"
    ],
    51: [
      "ยักษ์",
      "หุบเขา",
      "สูงเกือบสามเมตร",
      "ท้าทายกองทัพทุกวัน",
      "ถูกฆ่าด้วยก้อนหินก้อนเดียว"
    ],
    52: [
      "มิตรภาพ",
      "ลูกธนู",
      "มิตรภาพที่ซื่อสัตย์กับผู้ถูกไล่ล่า",
      "ยิงลูกธนูเป็นสัญญาณ",
      "มอบเสื้อคลุมให้เพื่อน"
    ],
    53: [
      "ขนมปัง",
      "สติปัญญา",
      "นำอาหารไปถวายเพื่อระงับความโกรธ",
      "หญิงฉลาดที่ช่วยครอบครัว",
      "สามีโง่เขลาเสียชีวิตกะทันหัน"
    ],
    54: [
      "หลังคา",
      "อาบน้ำ",
      "ถูกมองเห็นจากหลังคาพระราชวัง",
      "สูญเสียบุตรคนแรก",
      "มารดาของกษัตริย์ผู้ทรงปัญญา"
    ],
    55: [
      "คำอุปมา",
      "แกะ",
      "เล่าเรื่องแกะตัวเดียวของคนจน",
      "ผู้เผยพระวจนะที่กล้าตำหนิกษัตริย์",
      "ชี้นิ้วพูดว่าท่านคือคนนั้น"
    ],
    56: [
      "เส้นผม",
      "ต้นโอ๊ก",
      "ผมยาวเป็นที่ชื่นชม",
      "ติดอยู่กับต้นไม้ขณะหนี",
      "บุตรชายกบฏต่อบิดา"
    ],
    57: [
      "ปัญญา",
      "พระวิหาร",
      "ขอปัญญาแทนที่จะขอทรัพย์สมบัติ",
      "ตัดสินคดีทารกด้วยดาบ",
      "สร้างพระวิหารที่งดงามที่สุด"
    ],
    58: [
      "ทองคำ",
      "ปริศนา",
      "เดินทางไกลมาทดสอบปัญญา",
      "นำของขวัญมากมายมาถวาย",
      "ราชินีที่ประทับใจในสิ่งที่เห็น"
    ],
    59: [
      "แส้",
      "แตกแยก",
      "ทำให้อาณาจักรแตกแยก",
      "ฟังคำปรึกษาของคนหนุ่ม",
      "บุตรชายของกษัตริย์ผู้ทรงปัญญา"
    ],
    60: [
      "ลูกวัวทองคำ",
      "กบฏ",
      "ตั้งรูปเคารพสองตัวที่ดานและเบธเอล",
      "กษัตริย์องค์แรกของอาณาจักรเหนือ",
      "มือแห้งตายขณะชี้ใส่ผู้เผยพระวจนะ"
    ],
    61: [
      "ไฟ",
      "อีกา",
      "เรียกไฟจากฟ้า",
      "อีกานำอาหารมาให้",
      "ถูกรับขึ้นไปในพายุหมุน"
    ],
    62: [
      "ราชินี",
      "สุนัข",
      "นำการบูชารูปเคารพเข้ามา",
      "ข่มขู่ผู้เผยพระวจนะ",
      "จุดจบที่ถูกทำนายไว้ล่วงหน้า"
    ],
    63: [
      "สวนองุ่น",
      "งาช้าง",
      "ต้องการสวนองุ่นของชาวนา",
      "ปลอมตัวไปรบแต่ก็ถูกธนูยิง",
      "กษัตริย์ที่ถูกภรรยาชักจูง"
    ],
    64: [
      "เสื้อคลุม",
      "กระดูก",
      "ขอรับวิญญาณสองเท่า",
      "ทำให้น้ำกลายเป็นน้ำดี",
      "กระดูกทำให้คนตายฟื้น"
    ],
    65: [
      "แม่น้ำ",
      "โรคผิวหนัง",
      "จุ่มตัวเจ็ดครั้งในแม่น้ำ",
      "นายทหารต่างชาติที่ถูกรักษา",
      "กลับไปพร้อมดินสองกระสอบ"
    ],
    66: [
      "ความโลภ",
      "โรคผิวหนัง",
      "วิ่งไปขอของขวัญลับๆ",
      "โกหกนายของตน",
      "ติดโรคผิวหนังเพราะความโลภ"
    ],
    67: [
      "อุโมงค์น้ำ",
      "คำอธิษฐาน",
      "เลื่อนเข็มนาฬิกาแดดถอยหลัง",
      "ป่วยหนักแต่ได้รับอายุเพิ่ม",
      "โชว์ทรัพย์สมบัติให้ทูตบาบิโลน"
    ],
    68: [
      "ม้วนหนังสือ",
      "การปฏิรูป",
      "พบม้วนหนังสือในพระวิหาร",
      "ทำลายรูปเคารพทั่วแผ่นดิน",
      "กษัตริย์เด็กที่ปฏิรูปศาสนา"
    ],
    69: [
      "ถ่านไฟ",
      "พรหมจารี",
      "ริมฝีปากถูกแตะด้วยถ่านร้อน",
      "เห็นนิมิตพระบัลลังก์สูงส่ง",
      "ทำนายเรื่องพรหมจารีจะตั้งครรภ์"
    ],
    70: [
      "บ่อ",
      "น้ำตา",
      "ถูกโยนลงในบ่อโคลน",
      "ร้องไห้เพื่อชนชาติ",
      "ผู้เผยพระวจนะที่ถูกห้ามแต่งงาน"
    ],
    71: [
      "ล้อ",
      "กระดูกแห้ง",
      "เห็นนิมิตกระดูกแห้งฟื้นคืนชีพ",
      "นอนตะแคงสามร้อยเก้าสิบวัน",
      "สิ่งมีชีวิตสี่หน้าในนิมิต"
    ],
    72: [
      "ถ้ำสิงโต",
      "ความฝัน",
      "ไม่หยุดอธิษฐานแม้ถูกห้าม",
      "รอดจากถ้ำสิงโต",
      "ตีความเรื่องนิ้วมือเขียนบนฝาผนัง"
    ],
    73: [
      "เตาไฟ",
      "สามคน",
      "ไม่ยอมกราบรูปทองคำ",
      "เดินในเตาไฟโดยไม่ไหม้",
      "มีคนที่สี่ปรากฏในเปลวไฟ"
    ],
    74: [
      "งานเลี้ยง",
      "ฝาผนัง",
      "เห็นนิ้วมือเขียนบนฝาผนัง",
      "ใช้ภาชนะจากพระวิหาร",
      "อาณาจักรล่มสลายในคืนเดียว"
    ],
    75: [
      "กฎ",
      "ถ้ำสิงโต",
      "ออกกฎที่หลอกให้โยนคนลงถ้ำ",
      "เสียใจที่ต้องลงโทษคนดี",
      "ดีใจเมื่อเห็นคนรอดจากสิงโต"
    ],
    76: [
      "รูปปั้น",
      "ความฝัน",
      "ฝันเห็นรูปปั้นยักษ์ที่ถูกทำลาย",
      "กินหญ้าเหมือนสัตว์เจ็ดปี",
      "สร้างรูปทองคำให้ทุกคนกราบ"
    ],
    77: [
      "การแต่งงาน",
      "ความซื่อสัตย์",
      "แต่งงานกับหญิงไม่ซื่อตามคำสั่งพระเจ้า",
      "ชีวิตครอบครัวเป็นคำเทศนา",
      "ตั้งชื่อลูกเป็นสัญลักษณ์"
    ],
    78: [
      "วาทศิลป์",
      "อเล็กซานเดรีย",
      "พูดจาไพเราะแต่ต้องเรียนรู้เพิ่ม",
      "สอนเรื่องบัพติศมาไม่ครบ",
      "คู่สามีภรรยาช่วยสอนเพิ่มเติม"
    ],
    79: [
      "ผู้เลี้ยงแกะ",
      "ลูกดิ่ง",
      "คนเลี้ยงสัตว์ที่กลายเป็นผู้เผยพระวจนะ",
      "ตำหนิการกดขี่คนจน",
      "เห็นนิมิตตะกร้าผลไม้ฤดูร้อน"
    ],
    80: [
      "เอโดม",
      "ความเย่อหยิ่ง",
      "ทำนายเรื่องชนชาติที่อาศัยบนที่สูง",
      "หนังสือสั้นที่สุดในพระคัมภีร์ภาคเดิม",
      "ตำหนิผู้ที่ดูดายเมื่อพี่น้องถูกโจมตี"
    ],
    81: [
      "ปลาใหญ่",
      "เรือ",
      "หนีจากพระบัญชาลงเรือ",
      "อยู่ในท้องปลาสามวัน",
      "โกรธเรื่องต้นไม้เฉาเหี่ยว"
    ],
    82: [
      "เบธเลเฮม",
      "ความยุติธรรม",
      "ทำนายสถานที่ประสูติของผู้ช่วยให้รอด",
      "ตำหนิผู้นำที่ฉ้อฉล",
      "เรียกร้องความยุติธรรมและความเมตตา"
    ],
    83: [
      "สาวใช้",
      "คำแนะนำ",
      "เด็กหญิงเชลยที่แนะนำนายให้ไปรักษาตัว",
      "รับใช้ภรรยาของนายทหาร",
      "คำแนะนำเล็กๆ ที่เปลี่ยนชีวิต"
    ],
    84: [
      "หอคอย",
      "คำถาม",
      "ยืนบนหอคอยรอคำตอบ",
      "ถามพระเจ้าว่าทำไมคนชั่วเจริญ",
      "เขียนนิมิตให้ชัดเจน"
    ],
    85: [
      "วันของพระเจ้า",
      "การพิพากษา",
      "ทำนายวันแห่งการพิพากษา",
      "ในสมัยกษัตริย์โยสิยาห์",
      "ชื่อหมายถึงพระเจ้าซ่อนไว้"
    ],
    86: [
      "ผ้าสีม่วง",
      "แม่น้ำ",
      "พ่อค้าผ้าม่วงริมแม่น้ำ",
      "ผู้เชื่อคนแรกในยุโรป",
      "เปิดบ้านต้อนรับมิชชันนารี"
    ],
    87: [
      "ม้า",
      "พระวิหาร",
      "นิมิตเรื่องกิ่งไม้และคันประทีป",
      "ทำนายเรื่องกษัตริย์ขี่ลาเข้าเมือง",
      "ปุโรหิตและผู้เผยพระวจนะ"
    ],
    88: [
      "ทศางค์",
      "ผู้ส่งสาร",
      "ผู้เผยพระวจนะคนสุดท้ายก่อนพระเยซู",
      "ตำหนิเรื่องทศางค์ไม่ครบ",
      "ทำนายเรื่องผู้ส่งสารจะมาก่อน"
    ],
    89: [
      "ม้วนหนังสือ",
      "ธรรมบัญญัติ",
      "นำประชาชนกลับมาศึกษาธรรมบัญญัติ",
      "ปุโรหิตที่กลับจากการเป็นเชลย",
      "ร้องไห้เมื่อเห็นการแต่งงานข้ามชาติ"
    ],
    90: [
      "กำแพง",
      "ถ้วย",
      "สร้างกำแพงใหม่ท่ามกลางการคุกคาม",
      "ผู้ถวายถ้วยของกษัตริย์",
      "ทำงานมือหนึ่งถือดาบมือหนึ่งสร้าง"
    ],
    91: [
      "มงกุฎ",
      "งานเลี้ยง",
      "เด็กกำพร้าที่กลายเป็นราชินี",
      "เสี่ยงชีวิตเข้าเฝ้าโดยไม่ได้รับเชิญ",
      "ช่วยชนชาติจากแผนสังหาร"
    ],
    92: [
      "ประตูวัง",
      "ไม่ยอมกราบ",
      "นั่งอยู่ที่ประตูวังทุกวัน",
      "ไม่ยอมก้มกราบขุนนาง",
      "เลี้ยงดูหลานสาวจนได้เป็นราชินี"
    ],
    93: [
      "ตะแลงแกง",
      "สลาก",
      "สร้างตะแลงแกงเพื่อแขวนศัตรู",
      "จับสลากเลือกวันทำลายล้าง",
      "ถูกแขวนบนตะแลงแกงที่ตัวเองสร้าง"
    ],
    94: [
      "นายร้อย",
      "นิมิต",
      "นายทหารโรมันที่ยำเกรงพระเจ้า",
      "เห็นทูตสวรรค์บอกให้เชิญคนมา",
      "คนต่างชาติคนแรกที่ได้รับพระวิญญาณ"
    ],
    95: [
      "เข็ม",
      "ละมั่ง",
      "หญิงใจดีที่เย็บเสื้อผ้าให้คนจน",
      "ถูกปลุกให้ฟื้นคืนชีพ",
      "ชื่ออีกชื่อหมายถึงละมั่ง"
    ],
    96: [
      "ไม้กางเขน",
      "น้ำ",
      "เปลี่ยนน้ำเป็นเหล้าองุ่น",
      "เลี้ยงอาหารห้าพันคน",
      "ฟื้นคืนชีพในวันที่สาม"
    ],
    97: [
      "รางหญ้า",
      "ทูตสวรรค์",
      "ได้รับข่าวจากทูตสวรรค์",
      "เก็บรักษาทุกเรื่องไว้ในใจ",
      "อยู่ที่เชิงไม้กางเขน"
    ],
    98: [
      "ช่างไม้",
      "ความฝัน",
      "ได้รับคำเตือนในฝัน",
      "พาครอบครัวหนีไปอียิปต์",
      "ชายชอบธรรมที่เชื่อฟัง"
    ],
    99: [
      "ตั๊กแตน",
      "แม่น้ำ",
      "กินตั๊กแตนและน้ำผึ้งป่า",
      "ให้บัพติศมาในแม่น้ำ",
      "ถูกตัดศีรษะเพราะคำขอของหญิง"
    ],
    100: [
      "กุญแจ",
      "ไก่",
      "เดินบนน้ำแล้วจม",
      "ปฏิเสธสามครั้งก่อนไก่ขัน",
      "ได้รับกุญแจแห่งราชอาณาจักร"
    ],
    101: [
      "ต้นมะเดื่อ",
      "ความสงสัย",
      "ถูกเห็นใต้ต้นมะเดื่อก่อนถูกเรียก",
      "ถามว่ามีสิ่งดีมาจากนาซาเร็ธได้หรือ",
      "เชื่อทันทีเมื่อได้ยินสิ่งเหนือธรรมชาติ"
    ],
    102: [
      "ฟ้าร้อง",
      "ถ้วย",
      "หนึ่งในสามคนที่อยู่วงใน",
      "ถูกฆ่าด้วยดาบเป็นคนแรก",
      "ขอนั่งข้างขวาในอาณาจักร"
    ],
    103: [
      "นกอินทรี",
      "ความรัก",
      "เอนพิงอกของพระเยซู",
      "ได้รับมอบให้ดูแลมารดาพระเยซู",
      "เห็นนิมิตบนเกาะ"
    ],
    104: [
      "ขนมปัง",
      "ปลา",
      "ถามว่าซื้อขนมปังเลี้ยงคนได้อย่างไร",
      "พาคนกรีกมาพบพระเยซู",
      "นำเด็กที่มีขนมปังห้าก้อนมาถวาย"
    ],
    105: [
      "สุนัขจิ้งจอก",
      "วันเกิด",
      "ตัดศีรษะผู้เผยพระวจนะในงานเลี้ยง",
      "ถูกเรียกว่าสุนัขจิ้งจอก",
      "สอบถามพระเยซูก่อนส่งไปตรึง"
    ],
    106: [
      "ด่านภาษี",
      "งานเลี้ยง",
      "ลุกจากด่านเก็บภาษีตามพระเยซู",
      "จัดงานเลี้ยงใหญ่ต้อนรับ",
      "เขียนบันทึกสายตระกูลของพระเยซู"
    ],
    107: [
      "บาดแผล",
      "ความสงสัย",
      "ไม่เชื่อจนกว่าจะเห็นกับตา",
      "ขอแตะบาดแผลเพื่อเชื่อ",
      "ประกาศว่าเป็นองค์พระผู้เป็นเจ้า"
    ],
    108: [
      "มหาปุโรหิต",
      "คำพยากรณ์",
      "ฉีกเสื้อตัวเองในการพิจารณาคดี",
      "ทำนายโดยไม่รู้ตัวว่าคนหนึ่งตายแทนชาติ",
      "วางแผนกำจัดพระเยซู"
    ],
    109: [
      "คำถาม",
      "เงียบ",
      "ถามเรื่องการสำแดงพระองค์ในวงแคบ",
      "สาวกที่ไม่ค่อยมีบันทึก",
      "มีชื่ออีกชื่อหนึ่งในรายชื่อสาวก"
    ],
    110: [
      "ความกระตือรือร้น",
      "กลุ่ม",
      "เคยเป็นพวกชาตินิยมหัวรุนแรง",
      "ถูกเรียกให้ติดตามเป็นสาวก",
      "อยู่ในรายชื่อสิบสองคน"
    ],
    111: [
      "เงิน",
      "จูบ",
      "ขายทรยศด้วยจูบ",
      "สามสิบเหรียญเงิน",
      "สำนึกผิดแต่สายเกินไป"
    ],
    112: [
      "น้ำหอม",
      "อรุณรุ่ง",
      "ไปที่อุโมงค์ตอนเช้ามืด",
      "เห็นพระเยซูฟื้นคืนพระชนม์เป็นคนแรก",
      "ถูกขับผีเจ็ดตนออก"
    ],
    113: [
      "ครัว",
      "การรับใช้",
      "ยุ่งกับการเตรียมอาหาร",
      "บ่นว่าน้องสาวไม่ช่วยงาน",
      "ออกไปต้อนรับพระเยซูก่อนเข้าหมู่บ้าน"
    ],
    114: [
      "เท้า",
      "น้ำหอม",
      "นั่งแทบพระบาทฟังสั่งสอน",
      "เทน้ำหอมราคาแพงลงที่พระบาท",
      "เลือกส่วนที่ดีที่สุด"
    ],
    115: [
      "อุโมงค์",
      "ผ้าพัน",
      "ถูกปลุกให้ฟื้นหลังตายสี่วัน",
      "เดินออกมาจากอุโมงค์พันผ้า",
      "พี่ชายของสองพี่น้องหญิง"
    ],
    116: [
      "ต้นไม้",
      "ตัวเตี้ย",
      "ปีนต้นไม้เพื่อมองให้เห็น",
      "คนเก็บภาษีที่กลับใจ",
      "สัญญาคืนสี่เท่าที่โกง"
    ],
    117: [
      "กลางคืน",
      "ลม",
      "มาหาพระเยซูตอนกลางคืน",
      "ถามเรื่องการเกิดใหม่",
      "นำเครื่องหอมมาฝังพระศพ"
    ],
    118: [
      "ทารก",
      "ดาว",
      "สั่งฆ่าทารกในเบธเลเฮม",
      "หลอกพวกนักปราชญ์ให้กลับมารายงาน",
      "กษัตริย์ที่หวาดระแวง"
    ],
    119: [
      "น้ำ",
      "มือ",
      "ล้างมือปฏิเสธความรับผิดชอบ",
      "ไม่พบความผิดแต่ยอมตัดสิน",
      "ถามว่าความจริงคืออะไร"
    ],
    120: [
      "สลาก",
      "ทดแทน",
      "ถูกเลือกโดยจับสลาก",
      "เข้ามาแทนที่ผู้ทรยศ",
      "หนึ่งในผู้ติดตามตั้งแต่แรก"
    ],
    121: [
      "ดามัสกัส",
      "โซ่ตรวน",
      "ตาบอดสามวันบนถนน",
      "เปลี่ยนจากผู้ข่มเหงเป็นผู้ประกาศ",
      "เขียนจดหมายมากที่สุดในพระคัมภีร์"
    ],
    122: [
      "กำลังใจ",
      "มิชชัน",
      "ขายที่ดินถวายเงินทั้งหมด",
      "ให้โอกาสคนที่ถูกปฏิเสธ",
      "เดินทางประกาศกับเปาโล"
    ],
    123: [
      "หิน",
      "ใบหน้าเหมือนทูตสวรรค์",
      "ถูกขว้างด้วยก้อนหินจนตาย",
      "เห็นสวรรค์เปิดออกก่อนตาย",
      "ผู้พลีชีพคนแรก"
    ],
    124: [
      "รถม้า",
      "ทะเลทราย",
      "อธิบายพระคัมภีร์บนรถม้า",
      "ให้บัพติศมาในทะเลทราย",
      "ถูกพระวิญญาณพาหายไป"
    ],
    125: [
      "หนุ่มน้อย",
      "จดหมาย",
      "ลูกศิษย์ที่รักเหมือนบุตร",
      "คุณยายและมารดาสอนพระคัมภีร์",
      "ร้องไห้ตอนอำลา"
    ],
    126: [
      "หมอ",
      "ปากกา",
      "แพทย์ที่เขียนบันทึก",
      "เดินทางร่วมกับเปาโล",
      "เขียนหนังสือสองเล่มในพระคัมภีร์"
    ],
    127: [
      "เต็นท์",
      "คู่สามีภรรยา",
      "ทำเต็นท์เป็นอาชีพ",
      "สอนผู้ประกาศให้เข้าใจลึกซึ้งขึ้น",
      "ย้ายที่อยู่หลายครั้งเพื่องานประกาศ"
    ],
    128: [
      "คุก",
      "แผ่นดินไหว",
      "ร้องเพลงในคุกตอนเที่ยงคืน",
      "แผ่นดินไหวเปิดประตูคุก",
      "เดินทางประกาศกับเปาโล"
    ],
    129: [
      "อายุยืน",
      "บันทึก",
      "มีชีวิตยาวนานที่สุดในพระคัมภีร์",
      "อายุเก้าร้อยหกสิบเก้าปี",
      "เสียชีวิตในปีเดียวกับน้ำท่วม"
    ],
    130: [
      "เรือ",
      "ชนชาติ",
      "บุตรชายที่ออกจากเรือ",
      "บรรพบุรุษของชนชาติต่างๆ",
      "พี่น้องสามคนแบ่งโลก"
    ],
    131: [
      "ขนมปัง",
      "เหล้าองุ่น",
      "กษัตริย์และปุโรหิตในคนเดียว",
      "ไม่มีบันทึกสายตระกูล",
      "ต้อนรับด้วยขนมปังและเหล้าองุ่น"
    ],
    132: [
      "ลูกชายขลิบ",
      "ทะเลทราย",
      "ภรรยาที่ขลิบลูกชายระหว่างทาง",
      "ช่วยชีวิตสามีจากพระพิโรธ",
      "ลูกสาวของปุโรหิตมีเดียน"
    ],
    133: [
      "หอก",
      "ความกระตือรือร้น",
      "แทงหอกทะลุสองคนในเต็นท์",
      "หยุดภัยพิบัติด้วยความเด็ดขาด",
      "ได้รับพันธสัญญาแห่งสันติภาพ"
    ],
    134: [
      "เสื้อคลุม",
      "ทองคำ",
      "ซ่อนของที่ถูกสาปไว้ในเต็นท์",
      "ทำให้กองทัพพ่ายแพ้เพราะบาป",
      "ถูกจับโดยจับสลากไล่เผ่า"
    ],
    135: [
      "หินโม่",
      "กษัตริย์",
      "ฆ่าพี่น้องเจ็ดสิบคนบนก้อนหิน",
      "ถูกหญิงทิ้งหินโม่ใส่หัว",
      "บุตรชายของผู้พิพากษาที่เกิดจากนางบำเรอ"
    ],
    136: [
      "ผม",
      "เงิน",
      "หลอกให้เปิดเผยความลับ",
      "ถามซ้ำแล้วซ้ำเล่าจนได้คำตอบ",
      "หญิงจากหุบเขาโสเรก"
    ],
    137: [
      "เบธเลเฮม",
      "รากไม้",
      "บิดาของกษัตริย์ที่ยิ่งใหญ่ที่สุด",
      "มีบุตรชายแปดคน",
      "ตอไม้ที่แตกหน่อ"
    ],
    138: [
      "จดหมาย",
      "สงคราม",
      "ถูกส่งไปตายในสนามรบ",
      "สามีที่ซื่อสัตย์ถูกทรยศ",
      "จดหมายมรณะจากกษัตริย์"
    ],
    139: [
      "ขาพิการ",
      "โต๊ะอาหาร",
      "ได้นั่งร่วมโต๊ะกับกษัตริย์",
      "พิการทั้งสองขา",
      "หลานชายของเพื่อนรักกษัตริย์"
    ],
    140: [
      "แม่ทัพ",
      "ดาบ",
      "แม่ทัพที่เก่งกาจแต่โหดเหี้ยม",
      "ฆ่าคนที่ประตูเมือง",
      "ไม่เชื่อฟังคำสั่งของกษัตริย์"
    ],
    141: [
      "ที่ปรึกษา",
      "เชือก",
      "คำปรึกษาฉลาดแต่ถูกปฏิเสธ",
      "ผูกคอตายเมื่อคำแนะนำไม่ถูกรับ",
      "ที่ปรึกษาที่หันไปช่วยศัตรู"
    ],
    142: [
      "ห้อง",
      "ขนมปัง",
      "จัดห้องพิเศษให้ผู้เผยพระวจนะ",
      "บุตรชายเสียชีวิตแต่ถูกปลุกฟื้น",
      "หญิงร่ำรวยที่มีศรัทธา"
    ],
    143: [
      "รถม้า",
      "ความเร็ว",
      "ขับรถม้าเร็วอย่างบ้าคลั่ง",
      "กำจัดราชวงศ์ชั่วร้ายทั้งหมด",
      "ถูกเจิมให้เป็นกษัตริย์โดยลับ"
    ],
    144: [
      "บัลลังก์",
      "เลือด",
      "ยึดบัลลังก์หลังหลานชายถูกฆ่า",
      "สั่งฆ่าเชื้อพระวงศ์ทั้งหมด",
      "ราชินีที่ปกครองด้วยความโหดร้าย"
    ],
    145: [
      "ปุโรหิต",
      "ม่าน",
      "ซ่อนเจ้าชายน้อยไว้ในพระวิหาร",
      "โค่นล้มราชินีชั่วร้าย",
      "ปุโรหิตที่ซ่อมแซมพระวิหาร"
    ],
    146: [
      "ลูกธนู",
      "พระวิหาร",
      "กษัตริย์เด็กที่ถูกปุโรหิตเลี้ยงดู",
      "ทำดีตราบที่มีที่ปรึกษา",
      "หลังที่ปรึกษาตายก็หันไปทางชั่ว"
    ],
    147: [
      "รูปเคารพ",
      "กลับใจ",
      "กษัตริย์ชั่วที่สุดที่กลับใจในคุก",
      "ตั้งรูปเคารพในพระวิหาร",
      "ถูกจับไปบาบิโลนด้วยตะขอ"
    ],
    148: [
      "ตั๊กแตน",
      "พระวิญญาณ",
      "ทำนายเรื่องฝูงตั๊กแตนทำลาย",
      "สัญญาว่าพระวิญญาณจะเทลงมา",
      "เรียกร้องให้กลับใจสุดหัวใจ"
    ],
    149: [
      "นีนะเวห์",
      "สิงโต",
      "ทำนายการล่มสลายของเมืองยิ่งใหญ่",
      "เมืองแห่งเลือดจะถูกทำลาย",
      "ผู้ปลอบโยนชนชาติที่ถูกกดขี่"
    ],
    150: [
      "รากฐาน",
      "ผู้ว่าราชการ",
      "วางรากฐานพระวิหารหลังที่สอง",
      "ผู้นำที่กลับจากการเป็นเชลย",
      "เปรียบเหมือนแหวนตรา"
    ],
    151: [
      "พระวิหาร",
      "การสร้าง",
      "กระตุ้นให้สร้างพระวิหารต่อ",
      "ถามว่าถึงเวลาอยู่บ้านหรูแล้วหรือ",
      "ทำนายว่าเกียรติจะยิ่งใหญ่กว่าเดิม"
    ],
    152: [
      "ทารก",
      "ความชรา",
      "ตั้งครรภ์ตอนอายุมาก",
      "สามีพูดไม่ได้จนทารกเกิด",
      "ญาติกับมารดาของพระเยซู"
    ],
    153: [
      "พระวิหาร",
      "คำเผยพระวจนะ",
      "ไม่เคยออกจากพระวิหาร",
      "หญิงสูงอายุที่อดอาหารอธิษฐาน",
      "จำทารกน้อยได้ทันทีที่เห็น"
    ],
    154: [
      "อ้อมแขน",
      "สันติสุข",
      "อุ้มทารกแล้วพร้อมตาย",
      "รอคอยการปลอบโยนมาทั้งชีวิต",
      "พระวิญญาณนำมาที่พระวิหาร"
    ],
    155: [
      "อวน",
      "พี่ชาย",
      "พาน้องชายมาพบพระเยซู",
      "เคยเป็นศิษย์ของยอห์นผู้บัพติศมา",
      "ชาวประมงที่ทิ้งอวน"
    ],
    156: [
      "ลูกสาว",
      "ฝูงชน",
      "ขอให้มารักษาลูกสาวที่ใกล้ตาย",
      "คนหัวเราะเยาะเมื่อถูกบอกว่าแค่หลับ",
      "ผู้นำธรรมศาลาที่มีศรัทธา"
    ],
    157: [
      "ทางแยก",
      "น้ำตา",
      "จูบแม่สามีแล้วกลับบ้าน",
      "เลือกกลับไปยังชนชาติของตน",
      "แยกทางกับสะใภ้ที่ซื่อสัตย์"
    ],
    158: [
      "ความฝัน",
      "คำเตือน",
      "ส่งข่าวเตือนสามีเรื่องความฝัน",
      "ฝันร้ายเกี่ยวกับชายผู้บริสุทธิ์",
      "พยายามหยุดการตัดสินที่อยุติธรรม"
    ],
    159: [
      "สิงโต",
      "ปากกา",
      "หนีไปตอนกลางคืนทิ้งผ้าไว้",
      "เขียนข่าวประเสริฐที่สั้นที่สุด",
      "เดินทางกับบารนาบัสหลังแยกจากเปาโล"
    ],
    160: [
      "พี่ชาย",
      "จดหมาย",
      "ไม่เชื่อตอนแรกแต่กลับใจ",
      "เป็นผู้นำคริสตจักรในเยรูซาเล็ม",
      "เขียนจดหมายเรื่องการงานกับความเชื่อ"
    ],
    161: [
      "ที่ดิน",
      "การหลอกลวง",
      "ขายที่ดินแต่เก็บเงินส่วนหนึ่งไว้",
      "โกหกเรื่องราคาขาย",
      "ล้มลงตายทันทีที่โกหก"
    ],
    162: [
      "สมรู้ร่วมคิด",
      "สามชั่วโมง",
      "สมคบกับสามีโกหก",
      "มาถึงสามชั่วโมงหลังสามี",
      "จุดจบเดียวกับสามี"
    ],
    163: [
      "สภา",
      "ความรอบคอบ",
      "แนะนำให้รอดูผลก่อนตัดสิน",
      "อาจารย์ที่เป็นที่เคารพของเปาโล",
      "ถ้ามาจากพระเจ้าก็หยุดไม่ได้"
    ],
    164: [
      "ดาบ",
      "หนอน",
      "ฆ่าอัครสาวกด้วยดาบ",
      "ถูกหนอนกัดกินเพราะรับเกียรติแทนพระเจ้า",
      "จับอัครสาวกเข้าคุก"
    ],
    165: [
      "ทาส",
      "จดหมาย",
      "เจ้าของทาสที่กลับใจ",
      "ได้รับจดหมายขอให้รับทาสกลับ",
      "เปิดบ้านเป็นที่ประชุม"
    ],
    166: [
      "หนีไป",
      "มีประโยชน์",
      "ทาสหนีที่กลับใจ",
      "ชื่อหมายถึงมีประโยชน์",
      "ถูกส่งกลับพร้อมจดหมายแนะนำ"
    ],
    167: [
      "เกาะ",
      "ระเบียบ",
      "ถูกทิ้งไว้จัดระเบียบคริสตจักร",
      "ดูแลงานบนเกาะครีต",
      "ลูกศิษย์ที่ได้รับมอบหมายงานยาก"
    ],
    168: [
      "โซ่ตรวน",
      "คำอธิษฐาน",
      "ส่งข่าวคราวจากคุก",
      "ร่วมทุกข์กับผู้ถูกจองจำ",
      "ปล้ำกันในคำอธิษฐานเพื่อคริสตจักร"
    ]
  }
};

export default clues;
