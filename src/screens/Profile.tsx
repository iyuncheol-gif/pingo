import { IconCheck, IconCrown, IconFlame, IconGem, IconLeague, IconMoon, IconSun, Mascot } from "../art/brand";
import { Bar, Button } from "../components/ui";
import { LEAGUES, leagueTier } from "../data/league";
import { TIER_LABEL } from "../data/course";
import { useActions, useCourseProgress, useStore } from "../state/store";
import { canSpeak, englishVoices, lastSpeechError, speak } from "../lib/speech";
import { envSummary } from "../lib/browser";
import { useEffect, useState } from "react";
import { IconSpeaker } from "../art/brand";

const BADGES = [
  { id: "first", name: "첫걸음", need: (s: Stats) => s.lessons >= 1, hint: "레슨 1개 완료" },
  { id: "ten", name: "열 번의 반복", need: (s: Stats) => s.lessons >= 10, hint: "레슨 10개 완료" },
  { id: "streak3", name: "사흘의 힘", need: (s: Stats) => s.streak >= 3, hint: "3일 연속 학습" },
  { id: "streak7", name: "일주일", need: (s: Stats) => s.streak >= 7, hint: "7일 연속 학습" },
  { id: "perfect", name: "무결점", need: (s: Stats) => s.perfect >= 1, hint: "만점 레슨 1회" },
  { id: "xp300", name: "300 XP", need: (s: Stats) => s.xp >= 300, hint: "누적 300 XP" },
  { id: "half", name: "절반", need: (s: Stats) => s.percent >= 50, hint: "코스 50% 달성" },
  { id: "all", name: "완주", need: (s: Stats) => s.percent >= 100, hint: "코스 100% 달성" },
];

interface Stats {
  lessons: number;
  streak: number;
  perfect: number;
  xp: number;
  percent: number;
}

export function Profile() {
  const { state } = useStore();
  const actions = useActions();
  const progress = useCourseProgress();
  const tier = leagueTier(state.leagueXp);

  const stats: Stats = {
    lessons: state.totalLessons,
    streak: state.streak,
    perfect: state.perfectLessons,
    xp: state.xp,
    percent: progress.percent,
  };

  const currentSection = progress.unitStatus.find((entry) => entry.unlocked && entry.done < entry.total);

  return (
    <div className="page">
      <header className="profile__head card">
        <Mascot size={132} mood="happy" />
        <div className="grow">
          <h1 className="t-title">{state.name}</h1>
          <p className="t-cap">
            {currentSection
              ? `${TIER_LABEL[currentSection.section.tier]} · ${currentSection.section.cefr} · ${currentSection.unit.title}`
              : "코스를 모두 마쳤어요"}
          </p>
          <div style={{ marginTop: 12 }}>
            <Bar value={progress.completedNodes} max={progress.totalNodes} thin />
            <p className="t-cap" style={{ marginTop: 6 }}>
              {progress.completedNodes}/{progress.totalNodes} 노드 · {progress.percent}%
            </p>
          </div>
        </div>
      </header>

      <section className="tiles">
        <Tile icon={<IconFlame size={22} />} tone="var(--gold)" value={`${state.streak}일`} label="연속 학습" />
        <Tile icon={<IconCrown size={22} />} tone="var(--brand)" value={`${state.xp}`} label="누적 XP" />
        <Tile icon={<IconGem size={22} />} tone="var(--teal)" value={`${state.gems}`} label="크리스털" />
        <Tile icon={<IconLeague size={22} />} tone={LEAGUES[tier].hue} value={LEAGUES[tier].name} label="현재 리그" />
      </section>

      <section className="card panel">
        <h3 className="panel__title">업적</h3>
        <ul className="badges">
          {BADGES.map((badge) => {
            const earned = badge.need(stats);
            return (
              <li key={badge.id} className={`badge ${earned ? "is-on" : ""}`}>
                <span className="badge__mark">
                  {earned ? <IconCheck size={20} /> : <IconCrown size={20} />}
                </span>
                <strong>{badge.name}</strong>
                <span className="t-cap">{badge.hint}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card panel">
        <h3 className="panel__title">설정</h3>
        <div className="setting">
          <div className="grow">
            <strong className="t-head">화면 테마</strong>
            <p className="t-cap">시스템 설정을 따르거나 직접 고정할 수 있어요</p>
          </div>
          <div className="segmented">
            {(["system", "light", "dark"] as const).map((value) => (
              <button
                key={value}
                type="button"
                className={state.settings.theme === value ? "is-on" : ""}
                onClick={() => actions.setSettings({ theme: value })}
              >
                {value === "system" ? "자동" : value === "light" ? <IconSun size={16} /> : <IconMoon size={16} />}
              </button>
            ))}
          </div>
        </div>
        <div className="setting">
          <div className="grow">
            <strong className="t-head">효과음</strong>
            <p className="t-cap">정답·오답 피드백 사운드</p>
          </div>
          <Toggle on={state.settings.sound} onChange={(on) => actions.setSettings({ sound: on })} />
        </div>
        <div className="setting">
          <div className="grow">
            <strong className="t-head">듣기 문제 자동 재생</strong>
            <p className="t-cap">문제가 나오면 바로 읽어 줘요</p>
          </div>
          <Toggle on={state.settings.autoSpeak} onChange={(on) => actions.setSettings({ autoSpeak: on })} />
        </div>
        <div className="setting">
          <div className="grow">
            <strong className="t-head">듣기 문제 출제</strong>
            <p className="t-cap">기기에 영어 음성이 없으면 꺼 두세요</p>
          </div>
          <Toggle on={state.settings.listening} onChange={(on) => actions.setSettings({ listening: on })} />
        </div>
      </section>

      <section className="card panel">
        <h3 className="panel__title">영어 음성</h3>
        <VoicePicker />
      </section>

      <section className="card panel">
        <h3 className="panel__title">학습자 프로필</h3>
        <p className="t-cap" style={{ marginBottom: 12 }}>
          한 기기를 여러 명이 쓸 때 프로필을 나누면 진도가 섞이지 않아요.
        </p>
        <ul className="profiles">
          {state.profiles.map((profile) => {
            const active = profile.id === state.profileId;
            return (
              <li key={profile.id} className={`profiles__row ${active ? "is-on" : ""}`}>
                <span className="ava" style={{ width: 34, height: 34, fontSize: 13 }}>
                  {profile.name.slice(0, 1)}
                </span>
                <button
                  type="button"
                  className="profiles__name"
                  onClick={() => !active && actions.switchProfile(profile.id)}
                >
                  {profile.name}
                  {active && <em>사용 중</em>}
                </button>
                {state.profiles.length > 1 && !active && (
                  <button
                    type="button"
                    className="profiles__remove"
                    aria-label={`${profile.name} 프로필 삭제`}
                    onClick={() => {
                      if (window.confirm(`'${profile.name}' 프로필과 진도를 지울까요?`)) {
                        actions.removeProfile(profile.id);
                      }
                    }}
                  >
                    삭제
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <Button tone="ghost" style={{ marginTop: 12 }} onClick={actions.addProfile}>
          새 학습자 추가
        </Button>
      </section>

      <section className="card panel">
        <h3 className="panel__title">데이터</h3>
        <p className="t-cap" style={{ marginBottom: 12 }}>
          진도와 재화는 이 브라우저의 프로필별로 저장됩니다. 서버에 올라가지 않아요.
        </p>
        <Button
          tone="ghost"
          onClick={() => {
            if (window.confirm("모든 학습 기록을 지우고 처음부터 시작할까요?")) actions.reset();
          }}
        >
          이 프로필 진도 초기화
        </Button>
      </section>
    </div>
  );
}

function VoicePicker() {
  const { state } = useStore();
  const actions = useActions();
  const [voices, setVoices] = useState(() => englishVoices());
  const [check, setCheck] = useState<null | { ok: boolean; detail: string }>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // 음성 목록은 비동기로 채워진다 — 한 번 더 읽어 준다
    const timer = window.setTimeout(() => setVoices(englishVoices()), 600);
    return () => window.clearTimeout(timer);
  }, []);

  /* speak()는 반드시 클릭 핸들러 안에서 동기로 호출해야 iOS에서 소리가 난다 */
  const test = () => {
    setTesting(true);
    setCheck(null);
    speak("This is how your lessons will sound.").then((ok) => {
      setTesting(false);
      setCheck({
        ok,
        detail: ok
          ? "재생이 시작됐어요. 소리가 안 들리면 기기 음량과 무음 모드를 확인해 주세요."
          : describeFailure(),
      });
    });
  };

  const describeFailure = () => {
    if (!canSpeak()) return "이 브라우저가 음성 합성을 지원하지 않아요.";
    if (voices.length === 0) return "기기에 영어 음성이 설치돼 있지 않아요.";
    const err = lastSpeechError();
    if (err === "not-allowed") return "브라우저가 재생을 막았어요. 화면을 한 번 탭한 뒤 다시 시도해 주세요.";
    if (err === "synthesis-failed") return "음성 엔진이 재생에 실패했어요. 다른 음성을 골라 보세요.";
    if (err === "language-unavailable" || err === "voice-unavailable")
      return "선택한 음성을 쓸 수 없어요. 목록에서 다른 음성을 골라 주세요.";
    return "재생이 시작되지 않았어요. 다른 음성을 고르거나 듣기 문제를 꺼 주세요.";
  };

  if (voices.length === 0) {
    return (
      <>
        <p className="t-cap" style={{ marginBottom: 12 }}>
          {canSpeak()
            ? "이 기기에서 영어 음성을 찾지 못했어요. 듣기 문제를 꺼 두고 학습하시는 걸 권합니다."
            : "이 브라우저가 음성 기능을 지원하지 않아요. 크롬이나 사파리에서 열면 발음을 들을 수 있습니다."}{" "}
          ({envSummary()})
        </p>
        <Button tone="ghost" onClick={() => actions.setSettings({ listening: false })}>
          듣기 문제 끄기
        </Button>
      </>
    );
  }

  const selected = state.settings.voiceURI ?? voices[0].voiceURI;

  return (
    <>
      <p className="t-cap" style={{ marginBottom: 10 }}>
        가장 자연스러운 음성을 자동으로 고르지만, 직접 바꿀 수 있어요. 목록은 기기에 설치된 음성입니다.
      </p>
      <div className="voice-row">
        <select
          className="field field--select"
          value={selected}
          onChange={(event) => {
            actions.setSettings({ voiceURI: event.target.value });
            setCheck(null);
          }}
          aria-label="영어 음성 선택"
        >
          {voices.map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
        <Button tone="ghost" onClick={test} disabled={testing} aria-label="선택한 음성 들어보기">
          <IconSpeaker size={18} /> {testing ? "재생 중…" : "들어보기"}
        </Button>
      </div>

      {check && (
        <p className={`voice-check ${check.ok ? "is-ok" : "is-no"}`} role="status">
          {check.detail}
        </p>
      )}

      <p className="t-cap voice-diag">
        음성 {voices.length}개 인식 · 사용 중{" "}
        {voices.find((v) => v.voiceURI === selected)?.name ?? "자동"} · {envSummary()}
      </p>
    </>
  );
}

function Tile({
  icon,
  tone,
  value,
  label,
}: {
  icon: React.ReactNode;
  tone: string;
  value: string;
  label: string;
}) {
  return (
    <div className="tile-stat card card--flat">
      <span style={{ color: tone, display: "grid" }}>{icon}</span>
      <strong className="t-title">{value}</strong>
      <span className="t-cap">{label}</span>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={`toggle ${on ? "is-on" : ""}`}
      onClick={() => onChange(!on)}
    >
      <span />
    </button>
  );
}
