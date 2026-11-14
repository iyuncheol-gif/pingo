/* ============================================================
   코스 콘텐츠 — 영어(한국어 화자용)
   난이도 4단계(CEFR A1~B2)를 섹션으로 나누고,
   섹션 tier 값이 문제 생성 난이도(보기 수·미끼 수·타이핑 비중)를 좌우한다.
   ============================================================ */

export type Tier = 1 | 2 | 3 | 4;

export interface Word {
  en: string;
  ko: string;
}

export interface Sentence {
  en: string;
  ko: string;
  /** 영문 토큰(단어 은행용). 비우면 en을 공백으로 분해 */
  tokens?: string[];
  /** 한국어 조립용 토큰 */
  koTokens?: string[];
}

export interface Unit {
  id: string;
  title: string;
  blurb: string;
  hue: string;
  words: Word[];
  sentences: Sentence[];
  lessonCount: number;
}

export interface Section {
  id: string;
  tier: Tier;
  cefr: string;
  title: string;
  blurb: string;
  hue: string;
  units: Unit[];
}

const u = (
  id: string,
  title: string,
  blurb: string,
  hue: string,
  words: Word[],
  sentences: Sentence[],
  lessonCount = 4,
): Unit => ({ id, title, blurb, hue, words, sentences, lessonCount });

export const SECTIONS: Section[] = [
  {
    id: "s1",
    tier: 1,
    cefr: "A1",
    title: "첫걸음",
    blurb: "인사하고, 주문하고, 사람을 소개해요",
    hue: "#6c4cf1",
    units: [
      u(
        "u1",
        "첫 인사",
        "만나고 헤어질 때 쓰는 말",
        "#6c4cf1",
        [
          { en: "hello", ko: "안녕하세요" },
          { en: "goodbye", ko: "안녕히 가세요" },
          { en: "thank you", ko: "고맙습니다" },
          { en: "sorry", ko: "미안합니다" },
          { en: "yes", ko: "네" },
          { en: "no", ko: "아니요" },
          { en: "please", ko: "부탁해요" },
          { en: "name", ko: "이름" },
        ],
        [
          { en: "Hello, I am Minji.", ko: "안녕하세요, 저는 민지예요." },
          { en: "Thank you very much.", ko: "정말 고맙습니다." },
          { en: "What is your name?", ko: "이름이 뭐예요?" },
          { en: "Nice to meet you.", ko: "만나서 반가워요." },
          { en: "I am sorry.", ko: "미안해요." },
          { en: "Goodbye, see you tomorrow.", ko: "안녕히 가세요, 내일 봐요." },
        ],
      ),
      u(
        "u2",
        "카페에서",
        "마실 것과 간단한 주문",
        "#16b1c7",
        [
          { en: "coffee", ko: "커피" },
          { en: "tea", ko: "차" },
          { en: "water", ko: "물" },
          { en: "milk", ko: "우유" },
          { en: "bread", ko: "빵" },
          { en: "sugar", ko: "설탕" },
          { en: "cup", ko: "컵" },
          { en: "hot", ko: "뜨거운" },
        ],
        [
          { en: "I want a coffee.", ko: "커피 한 잔 주세요." },
          { en: "The water is cold.", ko: "그 물은 차가워요." },
          { en: "She drinks tea every morning.", ko: "그녀는 매일 아침 차를 마셔요." },
          { en: "Do you want milk?", ko: "우유 넣어 드릴까요?" },
          { en: "The bread is very hot.", ko: "그 빵은 아주 뜨거워요." },
          { en: "Two cups, please.", ko: "두 잔 주세요." },
        ],
      ),
      u(
        "u3",
        "사람과 가족",
        "주변 사람을 가리키는 말",
        "#ffb020",
        [
          { en: "man", ko: "남자" },
          { en: "woman", ko: "여자" },
          { en: "boy", ko: "소년" },
          { en: "girl", ko: "소녀" },
          { en: "friend", ko: "친구" },
          { en: "teacher", ko: "선생님" },
          { en: "family", ko: "가족" },
          { en: "book", ko: "책" },
        ],
        [
          { en: "He is my friend.", ko: "그는 제 친구예요." },
          { en: "The girl reads a book.", ko: "그 소녀는 책을 읽어요." },
          { en: "My teacher is very kind.", ko: "제 선생님은 아주 친절해요." },
          { en: "We are a small family.", ko: "우리는 작은 가족이에요." },
          { en: "That man drinks water.", ko: "저 남자는 물을 마셔요." },
        ],
      ),
    ],
  },
  {
    id: "s2",
    tier: 2,
    cefr: "A2",
    title: "일상 회화",
    blurb: "하루 일과와 약속, 길 찾기",
    hue: "#16b1c7",
    units: [
      u(
        "u4",
        "집과 하루",
        "집 안의 물건과 일상 동작",
        "#16b1c7",
        [
          { en: "house", ko: "집" },
          { en: "kitchen", ko: "부엌" },
          { en: "room", ko: "방" },
          { en: "clean", ko: "청소하다" },
          { en: "cook", ko: "요리하다" },
          { en: "dinner", ko: "저녁 식사" },
          { en: "early", ko: "일찍" },
          { en: "tired", ko: "피곤한" },
        ],
        [
          { en: "I cook dinner every evening.", ko: "저는 매일 저녁에 저녁을 요리해요." },
          { en: "My room is very small.", ko: "제 방은 아주 작아요." },
          { en: "She cleans the kitchen after dinner.", ko: "그녀는 저녁 식사 후에 부엌을 청소해요." },
          { en: "We wake up early on weekdays.", ko: "우리는 평일에 일찍 일어나요." },
          { en: "He is too tired to cook.", ko: "그는 너무 피곤해서 요리를 못 해요." },
        ],
      ),
      u(
        "u5",
        "시간과 약속",
        "날짜를 정하고 약속 잡기",
        "#27ae60",
        [
          { en: "morning", ko: "아침" },
          { en: "tonight", ko: "오늘 밤" },
          { en: "weekend", ko: "주말" },
          { en: "late", ko: "늦은" },
          { en: "meet", ko: "만나다" },
          { en: "busy", ko: "바쁜" },
          { en: "wait", ko: "기다리다" },
          { en: "together", ko: "함께" },
        ],
        [
          { en: "Let us meet on Saturday morning.", ko: "토요일 아침에 만나요." },
          { en: "I am busy tonight.", ko: "저는 오늘 밤에 바빠요." },
          { en: "Sorry, I am a little late.", ko: "미안해요, 제가 조금 늦었어요." },
          { en: "Can you wait for ten minutes?", ko: "10분만 기다려 줄 수 있어요?" },
          { en: "We usually have dinner together on the weekend.", ko: "우리는 보통 주말에 함께 저녁을 먹어요." },
        ],
      ),
      u(
        "u6",
        "길과 이동",
        "역, 표, 방향 묻기",
        "#ff8a3d",
        [
          { en: "station", ko: "역" },
          { en: "ticket", ko: "표" },
          { en: "left", ko: "왼쪽" },
          { en: "right", ko: "오른쪽" },
          { en: "bus", ko: "버스" },
          { en: "arrive", ko: "도착하다" },
          { en: "street", ko: "거리" },
          { en: "map", ko: "지도" },
        ],
        [
          { en: "Where is the station?", ko: "역이 어디에 있어요?" },
          { en: "The bus arrives at nine.", ko: "그 버스는 9시에 도착해요." },
          { en: "Turn left at the next street.", ko: "다음 거리에서 왼쪽으로 도세요." },
          { en: "I need two tickets, please.", ko: "표 두 장이 필요해요." },
          { en: "Could you show me on the map?", ko: "지도에서 보여 주실 수 있어요?" },
        ],
      ),
    ],
  },
  {
    id: "s3",
    tier: 3,
    cefr: "B1",
    title: "실전 영어",
    blurb: "직장과 여행에서 쓰는 표현",
    hue: "#ff8a3d",
    units: [
      u(
        "u7",
        "직장에서",
        "회의, 일정, 의사 결정",
        "#ff8a3d",
        [
          { en: "meeting", ko: "회의" },
          { en: "deadline", ko: "마감 기한" },
          { en: "report", ko: "보고서" },
          { en: "manager", ko: "관리자" },
          { en: "decide", ko: "결정하다" },
          { en: "schedule", ko: "일정" },
          { en: "client", ko: "고객사" },
          { en: "approve", ko: "승인하다" },
        ],
        [
          { en: "We need to move the meeting to Friday.", ko: "회의를 금요일로 옮겨야 해요." },
          { en: "She decided to take the job.", ko: "그녀는 그 일을 맡기로 결정했어요." },
          { en: "The report is due before the deadline.", ko: "보고서는 마감 기한 전까지 내야 해요." },
          { en: "My manager has not approved the budget yet.", ko: "제 관리자가 아직 예산을 승인하지 않았어요." },
          { en: "Let me check my schedule and get back to you.", ko: "일정을 확인하고 다시 알려 드릴게요." },
        ],
      ),
      u(
        "u8",
        "여행",
        "공항과 숙소에서 생기는 일",
        "#e0459a",
        [
          { en: "flight", ko: "항공편" },
          { en: "luggage", ko: "짐" },
          { en: "delay", ko: "지연" },
          { en: "reserve", ko: "예약하다" },
          { en: "abroad", ko: "해외로" },
          { en: "passport", ko: "여권" },
          { en: "refund", ko: "환불" },
          { en: "border", ko: "국경" },
        ],
        [
          { en: "My flight was delayed by two hours.", ko: "제 항공편이 두 시간 지연되었어요." },
          { en: "I have never traveled abroad alone.", ko: "저는 혼자 해외여행을 해 본 적이 없어요." },
          { en: "Could I get a refund for this ticket?", ko: "이 표를 환불받을 수 있을까요?" },
          { en: "She reserved a room near the station.", ko: "그녀는 역 근처에 방을 예약했어요." },
          { en: "Please keep your passport with you at all times.", ko: "여권을 항상 몸에 지니고 계세요." },
        ],
      ),
    ],
  },
  {
    id: "s4",
    tier: 4,
    cefr: "B2",
    title: "심화",
    blurb: "의견을 세우고 근거를 들어 말해요",
    hue: "#e0459a",
    units: [
      u(
        "u9",
        "뉴스와 사회",
        "자료와 근거를 다루는 말",
        "#e0459a",
        [
          { en: "policy", ko: "정책" },
          { en: "research", ko: "연구" },
          { en: "impact", ko: "영향" },
          { en: "argue", ko: "주장하다" },
          { en: "evidence", ko: "증거" },
          { en: "increase", ko: "증가하다" },
          { en: "reduce", ko: "줄이다" },
          { en: "survey", ko: "설문 조사" },
        ],
        [
          { en: "The research suggests that the policy had little impact.", ko: "그 연구는 해당 정책이 거의 영향을 주지 못했다고 시사해요." },
          { en: "Experts argue that the evidence is not clear enough.", ko: "전문가들은 증거가 충분히 명확하지 않다고 주장해요." },
          { en: "The survey shows a sharp increase in housing prices.", ko: "그 설문 조사는 집값의 가파른 상승을 보여 줘요." },
          { en: "The city reduced traffic by raising parking fees.", ko: "그 도시는 주차 요금을 올려 교통량을 줄였어요." },
        ],
      ),
      u(
        "u10",
        "생각 말하기",
        "양보와 가정, 완곡한 표현",
        "#8b5cf6",
        [
          { en: "although", ko: "비록 ~이지만" },
          { en: "despite", ko: "~에도 불구하고" },
          { en: "assume", ko: "가정하다" },
          { en: "rather", ko: "오히려" },
          { en: "trend", ko: "경향" },
          { en: "consider", ko: "고려하다" },
          { en: "unlikely", ko: "~할 것 같지 않은" },
          { en: "trade-off", ko: "상충 관계" },
        ],
        [
          { en: "Although it was expensive, she decided to buy it.", ko: "비싸긴 했지만 그녀는 그것을 사기로 했어요." },
          { en: "We should consider the long-term effects first.", ko: "우리는 장기적인 영향을 먼저 고려해야 해요." },
          { en: "Despite the delay, the team finished on time.", ko: "지연에도 불구하고 팀은 제시간에 끝냈어요." },
          { en: "It seems unlikely that the trend will continue.", ko: "그 경향이 계속될 것 같지는 않아 보여요." },
        ],
      ),
    ],
  },
];

/* ---- 조회 헬퍼 ---- */

export interface UnitRef {
  section: Section;
  unit: Unit;
  /** 코스 전체에서의 0-based 유닛 순서 */
  order: number;
}

export const ALL_UNITS: UnitRef[] = SECTIONS.flatMap((section) =>
  section.units.map((unit) => ({ section, unit, order: 0 })),
).map((ref, order) => ({ ...ref, order }));

export const unitRefById = (unitId: string): UnitRef | undefined =>
  ALL_UNITS.find((ref) => ref.unit.id === unitId);

/** 유닛당 노드 수 = 일반 레슨 + 유닛 복습(트로피) 1개 */
export const nodeCount = (unit: Unit): number => unit.lessonCount + 1;

export const TOTAL_NODES = ALL_UNITS.reduce((sum, ref) => sum + nodeCount(ref.unit), 0);

export const TIER_LABEL: Record<Tier, string> = {
  1: "기초",
  2: "초급",
  3: "중급",
  4: "상급",
};
