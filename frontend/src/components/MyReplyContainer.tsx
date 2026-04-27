import './MyReplyContainer.css';
import replyIcon from '../assets/replyIcon.svg';

function MyReplyContainer() {
  return(
    <>
      <div className='MRCwhole'>
        <p className="MRCtime">9:41</p>
        <div className="MRCcontainer">
          <div className="MRCwrap">
            <p>apple</p>
            <img src={replyIcon} alt="" />
          </div>
        </div>
      </div>
    </>
  )
}

export default MyReplyContainer