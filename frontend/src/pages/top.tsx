import './Top.css';
import planet1 from '../assets/planet_1.png';
import planet2 from '../assets/planet_2.png';
import additionBtn from '../assets/addition_btn.png';
import MinutesSlider from '../components/MinutesSlider';
import rocket from '../assets/rocket.png';
import smoke from '../assets/smoke.png';
import { useState } from 'react';
import ChatArea from '../components/ChatArea';
// import topBackground from '../assets/top_background.png';
// import topBlack from '../assets/top_black.png';

function Top() {
  const [mode, setMode] = useState("selection");
  const [count, setCount] = useState(3);

  const handleClick = () => {
    // setMode("launchLocket");
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
  }
  // if(count === 0){
  //   setMode("launchLocket");
  // }

  return (
    <>
      <div className='top_page'>
        { mode === "selection" && (
          <div className="container">
            <h1>学習内容</h1>
            <div className="content">
              <div className="learn_content">
                <div className="planet1">
                  <button><img src={planet1} alt="" /></button>
                  <p>HTML</p>
                </div>
                <div className="planet2">
                  <button><img src={planet2} alt="" /></button>
                  <p>英単語</p>
                </div>
                <div className="addition_btn">
                  <button><img src={additionBtn} alt="" /></button>
                </div>
              </div>
              <div className="timer_content">
                <MinutesSlider />
              </div>
              <div className="start_btn">
                <button onClick={() => handleClick()}>スタート</button>
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