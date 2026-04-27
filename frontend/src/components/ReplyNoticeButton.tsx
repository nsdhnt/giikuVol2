import './ReplyNoticeButton.css';
import replyButton from '../assets/replyButton.svg';
import noticeButton from '../assets/noticeButton.svg';

function ReplyNoticeButton() {
  return(
    <>
      <div className="RNcontainer">
        <div className="replyContainer">
          <div className="replyWrap">
            <p>返信</p>
            <img src={replyButton} alt="返信ボタン" />
          </div>
        </div>
        <hr />
        <div className="noticeContainer">
          <div className="noticeWrap">
            <p>通知オフ</p>
            <img src={noticeButton} alt="通知ボタン" />
          </div>
        </div>
      </div>
    </>
  )
}

export default ReplyNoticeButton