import './ReplyContainer.css';
import replyIcon from '../assets/replyIcon.svg';

function ReplyContainer() {
  return(
    <>
      <div className='RCwhole'>
        <div className="RCcontainer">
          <div className="RCwrap">
            <img src={replyIcon} alt="" />
            <p>果物のバナナを指す名詞で、数えられる名詞（可算名詞）として扱われるため、1本なら "a banana"、複数なら "bananas" と表現します。</p>
          </div>
        </div>
        <p className="RCtime">9:41</p>
      </div>
    </>
  )
}

export default ReplyContainer