import './MyReplyContainer.css';
import replyIcon from '../assets/replyIcon.svg';

type MyReplyContainerProps = {
  message: string;
  time?: string;
};

function MyReplyContainer({ message, time }: MyReplyContainerProps) {
  return(
    <>
      <div className='MRCwhole'>
        {time && <p className="MRCtime">{time}</p>}
        <div className="MRCcontainer">
          <div className="MRCwrap">
            <p>{message}</p>
            <img src={replyIcon} alt="" />
          </div>
        </div>
      </div>
    </>
  )
}

export default MyReplyContainer
