import './ChatArea.css';
import bottomArrow from '../assets/bottomArrow.svg';
// import NotificationCollapsed from './notificationCollapsed';
// import ReplyNoticeButton from './ReplyNoticeButton';
import ReplyContainer from './ReplyContainer';
import MyReplyContainer from './MyReplyContainer';
import { useCallback, useEffect, useState } from 'react';
import { getIssuesByUserId, type Issue } from '../api';

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ChatArea() {
  const [bottomSheet, setBottomSheet] = useState("notSlide");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState("");

  const loadIssues = useCallback(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    getIssuesByUserId(userId)
      .then((result) => {
        setIssues(result);
        setError("");
      })
      .catch((apiError) => {
        setError(apiError instanceof Error ? apiError.message : "履歴の取得に失敗しました");
      });
  }, []);

  useEffect(() => {
    loadIssues();

    const intervalId = window.setInterval(loadIssues, 10000);
    const handleFocus = () => loadIssues();
    const handleVisibilityChange = () => {
      if (!document.hidden) loadIssues();
    };
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === "ISSUE_UPDATED") loadIssues();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    navigator.serviceWorker?.addEventListener("message", handleServiceWorkerMessage);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      navigator.serviceWorker?.removeEventListener("message", handleServiceWorkerMessage);
    };
  }, [loadIssues]);

  const slideBottomSheet = () => {
    if(bottomSheet === "notSlide"){
      setBottomSheet("slide");
    } else if(bottomSheet === "slide"){
      setBottomSheet("notSlide");
    }
  }

  const renderMessages = () => (
    <>
      {error && <p className="chatError">{error}</p>}
      {issues.length === 0 && !error && <ReplyContainer message="まだ問題履歴がありません。" />}
      {issues.map((issue) => {
        const time = formatTime(issue.created_at);

        return (
          <div className="issueMessageGroup" key={issue.id}>
            <ReplyContainer message={issue.issue} time={time} />
            {issue.answer && <MyReplyContainer message={issue.answer} time={time} />}
            {issue.judgment && <ReplyContainer message={issue.judgment} time={time} />}
          </div>
        );
      })}
    </>
  );

  return(
    <>
      {/* <div className="NC">
        <NotificationCollapsed />
      </div>
      <div className="RNB">
        <ReplyNoticeButton />
      </div> */}
      { bottomSheet === "notSlide" && (
        <div className="chatContainer active">
          <button onClick={() => slideBottomSheet()}><img src={bottomArrow} alt="矢印" /></button>
          <div className="chatWrap">
            {renderMessages()}
          </div>
        </div>
      )}
      { bottomSheet === "slide" && (
        <div className="chatContainer">
          <button onClick={() => slideBottomSheet()}><img src={bottomArrow} alt="矢印" /></button>
          <div className="chatWrap">
            {renderMessages()}
          </div>
        </div>
      )}
    </>
  )
}

export default ChatArea
