import './NotificationCollapsed.css';
import NCicon from '../assets/NCicon.svg';

function NotificationCollapsed() {
  return(
    <>
      <div className="NCcontainer">
        <div className='NCcontent'>
          <div className="NCicon">
            <img src={NCicon} alt="通知のアイコン" />
          </div>
          <div className="NCname">
            <p>学習ポータル</p>
            <p>apple</p>
          </div>
          <div className="NCtime">
            <p>9:41 AM</p>
          </div>
        </div>
      </div>
    </>
  )
}
export default NotificationCollapsed