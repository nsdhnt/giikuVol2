import './ChatArea.css';
import bottomArrow from '../assets/bottomArrow.svg';
// import NotificationCollapsed from './notificationCollapsed';
// import ReplyNoticeButton from './ReplyNoticeButton';
import ReplyContainer from './ReplyContainer';
import MyReplyContainer from './MyReplyContainer';
import { useState } from 'react';

function ChatArea() {
  const [bottomSheet, setBottomSheet] = useState("notSlide");
  const slideBottomSheet = () => {
    if(bottomSheet === "notSlide"){
      setBottomSheet("slide");
    } else if(bottomSheet === "slide"){
      setBottomSheet("notSlide");
    }
  }

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
            <ReplyContainer />
            <MyReplyContainer />
            <ReplyContainer />
            <MyReplyContainer />
            <ReplyContainer />
            <MyReplyContainer />
          </div>
        </div>
      )}
      { bottomSheet === "slide" && (
        <div className="chatContainer">
          <button onClick={() => slideBottomSheet()}><img src={bottomArrow} alt="矢印" /></button>
          <div className="chatWrap">
            <ReplyContainer />
            <MyReplyContainer />
            <ReplyContainer />
            <MyReplyContainer />
            <ReplyContainer />
            <MyReplyContainer />
          </div>
        </div>
      )}
    </>
  )
}

export default ChatArea