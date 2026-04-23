import './Top.css';
import planet1 from '../assets/planet_1.png';
import planet2 from '../assets/planet_2.png';
import additionBtn from '../assets/addition_btn.png';
// import topBackground from '../assets/top_background.png';
// import topBlack from '../assets/top_black.png';

function Top() {
    return(
        <>
        <div className='top_page'>
            {/* <img src={topBackground} alt="" />
            <img src={topBlack} alt="" /> */}
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

                    </div>
                    <div className="start_btn">
                        <button>スタート</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Top;