import './ReplyContainer.css';
import replyIcon from '../assets/replyIcon.svg';

type ReplyContainerProps = {
  message: string;
  time?: string;
};

function ReplyContainer({ message, time }: ReplyContainerProps) {
  return(
    <>
      <div className='RCwhole'>
        <div className="RCcontainer">
          <div className="RCwrap">
            <img src={replyIcon} alt="" />
            <p>{message}</p>
          </div>
        </div>
        {time && <p className="RCtime">{time}</p>}
      </div>
    </>
  )
}

export default ReplyContainer
