import './Top.css';
import planet1 from '../assets/planet_1.png';
import planet2 from '../assets/planet_2.png';
import additionBtn from '../assets/addition_btn.png';
import MinutesSlider from '../components/MinutesSlider';
import rocket from '../assets/rocket.png';
import smoke from '../assets/smoke.png';
import { useEffect, useState } from 'react';
import ChatArea from '../components/ChatArea';
import { getSettings, saveSettings, startIssue } from '../api';
import { showIssueNotification } from '../notifications';

function Top() {
  const [mode, setMode] = useState("selection");
  const [count, setCount] = useState(3);
  const [selectedTopic, setSelectedTopic] = useState("英単語");
  const [minutes, setMinutes] = useState(10);
  const [apiError, setApiError] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    getSettings(userId)
      .then((settings) => {
        if ("message" in settings) return;
        setSelectedTopic(settings.topic);
        setMinutes(settings.time);
      })
      .catch((error) => {
        setApiError(error instanceof Error ? error.message : "設定の取得に失敗しました");
      });
  }, []);

  const handleClick = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setApiError("ユーザー情報がありません。もう一度登録してください。");
      return;
    }

    setIsStarting(true);
    setApiError("");

    try {
      await saveSettings(userId, selectedTopic, minutes);
      const firstIssue = await startIssue(userId);
      localStorage.setItem("current_issue_id", firstIssue.id);
      localStorage.setItem("current_issue", firstIssue.issue);
      await showIssueNotification(firstIssue);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "問題の取得に失敗しました");
      setIsStarting(false);
      return;
    }

    setMode("countdown");
    const timer = setInterval(() => {
      setCount((prev) => {
        if(prev <= 1){
          clearInterval(timer);
          setMode("launchLocket");
          setTimeout(() => {
            setMode("changeBGImg");
          }, 3000);
          setTimeout(() => {
            setMode("chatArea");
          }, 3500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIsStarting(false);
  }

  return (
    <>
      <div className='top_page'>
        { mode === "selection" && (
          <div className="container">
            <h1>学習内容</h1>
            <div className="content">
              <div className="learn_content">
                <div className={selectedTopic === "HTML" ? "planet1 selectedTopic" : "planet1"}>
                  <button onClick={() => setSelectedTopic("HTML")}><img src={planet1} alt="" /></button>
                  <p>HTML</p>
                </div>
                <div className={selectedTopic === "英単語" ? "planet2 selectedTopic" : "planet2"}>
                  <button onClick={() => setSelectedTopic("英単語")}><img src={planet2} alt="" /></button>
                  <p>英単語</p>
                </div>
                <div className="addition_btn">
                  <button><img src={additionBtn} alt="" /></button>
                </div>
              </div>
              <div className="timer_content">
                <MinutesSlider min={1} max={60} initialValue={minutes} onChange={setMinutes} />
              </div>
              {apiError && <p className="topError">{apiError}</p>}
              <div className="start_btn">
                <button onClick={() => handleClick()} disabled={isStarting}>
                  {isStarting ? "..." : "スタート"}
                </button>
              </div>
            </div>
          </div>
        )}
        { mode === "countdown" && (
          <div className="countdown_container">
            <h1>{count}</h1>
          </div>
        )}
      </div>
      { mode === "launchLocket" && (
        <div className="top_page launchLocket">
          <img src={rocket} alt="" className='rocket' />
          <img src={smoke} alt="" className='smoke' />
        </div>
      )}
      { mode === "changeBGImg" && (
        <div className="top_page changeBGImg">
        </div>
      )}
      { mode === "chatArea" && (
        <ChatArea />
      )}
    </>
  )
}

export default Top;
