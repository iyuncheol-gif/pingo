import { useState } from "react";
import { browserName, canOpenExternally, copyUrl, envSummary, openExternally } from "../../lib/browser";
import { canSpeak } from "../../lib/speech";
import { IconX } from "../../art/brand";

/**
 * 카카오톡 등 앱 내장 브라우저 안내.
 * 이 웹뷰들은 음성 합성을 제공하지 않아 듣기 문제를 들을 수 없다.
 * 기기 설정 문제가 아니므로 외부 브라우저로 열도록 안내한다.
 */
export function InAppNotice() {
  const [closed, setClosed] = useState(false);
  const [copied, setCopied] = useState(false);

  // 음성이 되는 브라우저면 알릴 것이 없다
  if (canSpeak() || closed) return null;

  return (
    <div className="inapp" role="status">
      <div className="inapp__body">
        <strong>{browserName()}에서는 발음을 들을 수 없어요</strong>
        <p>
          이 브라우저가 음성 기능을 지원하지 않아 듣기 문제를 빼고 보여 드리고 있어요. 크롬이나
          사파리에서 열면 발음까지 들을 수 있습니다. ({envSummary()})
        </p>
      </div>
      <div className="inapp__actions">
        {!canOpenExternally() ? (
          <button
            type="button"
            onClick={async () => setCopied(await copyUrl())}
          >
            {copied ? "주소 복사됨" : "주소 복사"}
          </button>
        ) : (
          <button type="button" onClick={() => openExternally()}>
            브라우저로 열기
          </button>
        )}
        <button type="button" className="inapp__close" aria-label="닫기" onClick={() => setClosed(true)}>
          <IconX size={18} />
        </button>
      </div>
    </div>
  );
}
