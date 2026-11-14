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
          { en: "today", ko: "오늘" },
          { en: "fine", ko: "괜찮은" },
        ],
        [
          { en: "Hello, I am Minji.", ko: "안녕하세요, 저는 민지예요." },
          { en: "Thank you very much.", ko: "정말 고맙습니다." },
          { en: "What is your name?", ko: "이름이 뭐예요?" },
          { en: "Nice to meet you.", ko: "만나서 반가워요." },
          { en: "I am sorry.", ko: "미안해요." },
          { en: "Goodbye, see you tomorrow.", ko: "안녕히 가세요, 내일 봐요." },
          { en: "Good morning, teacher.", ko: "좋은 아침이에요, 선생님." },
          { en: "How are you today?", ko: "오늘 어떻게 지내세요?" },
          { en: "I am fine, thank you.", ko: "저는 잘 지내요, 고마워요." },
          { en: "Yes, that is my name.", ko: "네, 그게 제 이름이에요." },
          { en: "No, I am not Minji.", ko: "아니요, 저는 민지가 아니에요." },
          { en: "Please come in and sit down.", ko: "들어와서 앉으세요." },
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
          { en: "cold", ko: "차가운" },
          { en: "order", ko: "주문하다" },
        ],
        [
          { en: "I want a coffee.", ko: "커피 한 잔 주세요." },
          { en: "The water is cold.", ko: "그 물은 차가워요." },
          { en: "She drinks tea every morning.", ko: "그녀는 매일 아침 차를 마셔요." },
          { en: "Do you want milk?", ko: "우유 넣어 드릴까요?" },
          { en: "The bread is very hot.", ko: "그 빵은 아주 뜨거워요." },
          { en: "Two cups, please.", ko: "두 잔 주세요." },
          { en: "I would like to order now.", ko: "지금 주문하고 싶어요." },
          { en: "How much is the coffee?", ko: "커피는 얼마예요?" },
          { en: "No sugar for me, please.", ko: "저는 설탕은 빼 주세요." },
          { en: "This tea is too hot.", ko: "이 차는 너무 뜨거워요." },
          { en: "Can I have some water?", ko: "물 좀 주시겠어요?" },
          { en: "The bread here is very good.", ko: "여기 빵은 아주 맛있어요." },
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
          { en: "child", ko: "아이" },
          { en: "kind", ko: "친절한" },
        ],
        [
          { en: "He is my friend.", ko: "그는 제 친구예요." },
          { en: "The girl reads a book.", ko: "그 소녀는 책을 읽어요." },
          { en: "My teacher is very kind.", ko: "제 선생님은 아주 친절해요." },
          { en: "We are a small family.", ko: "우리는 작은 가족이에요." },
          { en: "That man drinks water.", ko: "저 남자는 물을 마셔요." },
          { en: "The woman is my mother.", ko: "그 여자는 제 어머니예요." },
          { en: "My friend has two children.", ko: "제 친구는 아이가 둘 있어요." },
          { en: "The boy wants bread.", ko: "그 소년은 빵을 원해요." },
          { en: "They study together every day.", ko: "그들은 매일 함께 공부해요." },
          { en: "Is she your teacher?", ko: "그녀가 당신의 선생님인가요?" },
          { en: "This book is for children.", ko: "이 책은 아이들을 위한 거예요." },
          { en: "My family lives in Seoul.", ko: "제 가족은 서울에 살아요." },
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
          { en: "sleep", ko: "자다" },
          { en: "window", ko: "창문" },
        ],
        [
          { en: "I cook dinner every evening.", ko: "저는 매일 저녁에 저녁을 요리해요." },
          { en: "My room is very small.", ko: "제 방은 아주 작아요." },
          { en: "She cleans the kitchen after dinner.", ko: "그녀는 저녁 식사 후에 부엌을 청소해요." },
          { en: "We wake up early on weekdays.", ko: "우리는 평일에 일찍 일어나요." },
          { en: "He is too tired to cook.", ko: "그는 너무 피곤해서 요리를 못 해요." },
          { en: "Please close the window.", ko: "창문을 닫아 주세요." },
          { en: "I go to sleep at eleven.", ko: "저는 11시에 자러 가요." },
          { en: "Our house has three rooms.", ko: "우리 집에는 방이 세 개 있어요." },
          { en: "Who cooks dinner in your house?", ko: "당신 집에서는 누가 저녁을 요리해요?" },
          { en: "The kitchen is next to my room.", ko: "부엌은 제 방 옆에 있어요." },
          { en: "I clean my room on Sunday.", ko: "저는 일요일에 제 방을 청소해요." },
          { en: "She came home early today.", ko: "그녀는 오늘 일찍 집에 왔어요." },
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
          { en: "hour", ko: "시간" },
          { en: "plan", ko: "계획" },
        ],
        [
          { en: "Let us meet on Saturday morning.", ko: "토요일 아침에 만나요." },
          { en: "I am busy tonight.", ko: "저는 오늘 밤에 바빠요." },
          { en: "Sorry, I am a little late.", ko: "미안해요, 제가 조금 늦었어요." },
          { en: "Can you wait for ten minutes?", ko: "10분만 기다려 줄 수 있어요?" },
          { en: "We have dinner together on the weekend.", ko: "우리는 주말에 함께 저녁을 먹어요." },
          { en: "What are your plans for tomorrow?", ko: "내일 무슨 계획이 있어요?" },
          { en: "The meeting starts in an hour.", ko: "회의는 한 시간 뒤에 시작해요." },
          { en: "I will call you tonight.", ko: "오늘 밤에 전화할게요." },
          { en: "Are you free this weekend?", ko: "이번 주말에 시간 있어요?" },
          { en: "He is always late for class.", ko: "그는 항상 수업에 늦어요." },
          { en: "Let us plan something for Friday.", ko: "금요일에 뭔가 계획해 봐요." },
          { en: "I waited for you for an hour.", ko: "저는 당신을 한 시간 기다렸어요." },
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
          { en: "far", ko: "먼" },
          { en: "walk", ko: "걷다" },
        ],
        [
          { en: "Where is the station?", ko: "역이 어디에 있어요?" },
          { en: "The bus arrives at nine.", ko: "그 버스는 9시에 도착해요." },
          { en: "Turn left at the next street.", ko: "다음 거리에서 왼쪽으로 도세요." },
          { en: "I need two tickets, please.", ko: "표 두 장이 필요해요." },
          { en: "Could you show me on the map?", ko: "지도에서 보여 주실 수 있어요?" },
          { en: "Is it far from here?", ko: "여기서 멀어요?" },
          { en: "I usually walk to work.", ko: "저는 보통 걸어서 출근해요." },
          { en: "The station is on the right.", ko: "역은 오른쪽에 있어요." },
          { en: "How long does the bus take?", ko: "버스로 얼마나 걸려요?" },
          { en: "We arrived late because of traffic.", ko: "교통 때문에 우리는 늦게 도착했어요." },
          { en: "This ticket is for tomorrow.", ko: "이 표는 내일 거예요." },
          { en: "Walk straight for five minutes.", ko: "5분 동안 직진하세요." },
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
          { en: "budget", ko: "예산" },
          { en: "team", ko: "팀" },
        ],
        [
          { en: "We need to move the meeting to Friday.", ko: "회의를 금요일로 옮겨야 해요." },
          { en: "She decided to take the job.", ko: "그녀는 그 일을 맡기로 결정했어요." },
          { en: "The report is due before the deadline.", ko: "보고서는 마감 기한 전까지 내야 해요." },
          { en: "My manager has not approved the budget yet.", ko: "제 관리자가 아직 예산을 승인하지 않았어요." },
          { en: "Let me check my schedule and get back to you.", ko: "일정을 확인하고 다시 알려 드릴게요." },
          { en: "The client asked for a new proposal.", ko: "고객사가 새 제안서를 요청했어요." },
          { en: "Our team finished the project last week.", ko: "우리 팀은 지난주에 프로젝트를 끝냈어요." },
          { en: "Could you send me the report today?", ko: "오늘 보고서를 보내 주실 수 있을까요?" },
          { en: "I have a meeting with the client tomorrow.", ko: "내일 고객사와 회의가 있어요." },
          { en: "We should decide this by the end of the week.", ko: "이번 주 안에 이걸 결정해야 해요." },
          { en: "The deadline was moved to next month.", ko: "마감 기한이 다음 달로 옮겨졌어요." },
          { en: "She manages a team of ten people.", ko: "그녀는 열 명으로 된 팀을 관리해요." },
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
          { en: "hotel", ko: "호텔" },
          { en: "cancel", ko: "취소하다" },
        ],
        [
          { en: "My flight was delayed by two hours.", ko: "제 항공편이 두 시간 지연되었어요." },
          { en: "I have never traveled abroad alone.", ko: "저는 혼자 해외여행을 해 본 적이 없어요." },
          { en: "Could I get a refund for this ticket?", ko: "이 표를 환불받을 수 있을까요?" },
          { en: "She reserved a room near the station.", ko: "그녀는 역 근처에 방을 예약했어요." },
          { en: "Please keep your passport with you at all times.", ko: "여권을 항상 몸에 지니고 계세요." },
          { en: "I lost my luggage at the airport.", ko: "공항에서 짐을 잃어버렸어요." },
          { en: "We had to cancel the hotel.", ko: "우리는 호텔을 취소해야 했어요." },
          { en: "How long does it take to cross the border?", ko: "국경을 넘는 데 얼마나 걸려요?" },
          { en: "The hotel is fully booked this weekend.", ko: "그 호텔은 이번 주말에 예약이 꽉 찼어요." },
          { en: "My flight leaves early in the morning.", ko: "제 항공편은 아침 일찍 떠나요." },
          { en: "They refunded the money in three days.", ko: "그들은 사흘 만에 돈을 환불해 줬어요." },
          { en: "Did you reserve a seat by the window?", ko: "창가 자리를 예약했어요?" },
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
          { en: "expert", ko: "전문가" },
          { en: "cost", ko: "비용" },
        ],
        [
          { en: "The research suggests that the policy had little impact.", ko: "그 연구는 해당 정책이 거의 영향을 주지 못했다고 시사해요." },
          { en: "Experts argue that the evidence is not clear enough.", ko: "전문가들은 증거가 충분히 명확하지 않다고 주장해요." },
          { en: "The survey shows a sharp increase in housing prices.", ko: "그 설문 조사는 집값의 가파른 상승을 보여 줘요." },
          { en: "The city reduced traffic by raising parking fees.", ko: "그 도시는 주차 요금을 올려 교통량을 줄였어요." },
          { en: "The cost of living has increased again.", ko: "생활비가 또 올랐어요." },
          { en: "Few experts expected such a large impact.", ko: "그런 큰 영향을 예상한 전문가는 거의 없었어요." },
          { en: "The government will review the policy next year.", ko: "정부는 내년에 그 정책을 재검토할 거예요." },
          { en: "There is little evidence that the plan worked.", ko: "그 계획이 효과가 있었다는 증거는 거의 없어요." },
          { en: "Researchers surveyed more than two thousand people.", ko: "연구자들은 2천 명이 넘는 사람을 조사했어요." },
          { en: "Critics argue that the cost is too high.", ko: "비평가들은 비용이 너무 높다고 주장해요." },
          { en: "The report reduced public concern about the issue.", ko: "그 보고서는 그 문제에 대한 대중의 우려를 줄였어요." },
          { en: "We need better data before we decide.", ko: "결정하기 전에 더 나은 자료가 필요해요." },
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
          { en: "however", ko: "하지만" },
          { en: "whether", ko: "~인지" },
        ],
        [
          { en: "Although it was expensive, she decided to buy it.", ko: "비싸긴 했지만 그녀는 그것을 사기로 했어요." },
          { en: "We should consider the long-term effects first.", ko: "우리는 장기적인 영향을 먼저 고려해야 해요." },
          { en: "Despite the delay, the team finished on time.", ko: "지연에도 불구하고 팀은 제시간에 끝냈어요." },
          { en: "It seems unlikely that the trend will continue.", ko: "그 경향이 계속될 것 같지는 않아 보여요." },
          { en: "I would rather wait than decide too quickly.", ko: "너무 빨리 결정하기보다는 기다리는 게 나아요." },
          { en: "However, there is another way to look at it.", ko: "하지만 그것을 보는 다른 방법이 있어요." },
          { en: "Let us not assume that everyone agrees.", ko: "모두가 동의한다고 가정하지는 맙시다." },
          { en: "Every choice involves some kind of trade-off.", ko: "모든 선택에는 어떤 상충 관계가 따라요." },
          { en: "I am not sure whether this is the right call.", ko: "이게 옳은 판단인지 잘 모르겠어요." },
          { en: "The trend has changed over the last five years.", ko: "그 경향은 지난 5년 동안 바뀌었어요." },
          { en: "Despite everything, I still think it is worth trying.", ko: "모든 걸 떠나서 여전히 시도해 볼 가치가 있다고 생각해요." },
          { en: "Although we disagree, the conversation was useful.", ko: "의견은 다르지만 대화는 유용했어요." },
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
