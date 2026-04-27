import './Description.css';
import logo from '../assets/logo.svg';
import smartphone1 from '../assets/smartphone1.svg';
import smartphone2 from '../assets/smartphone2.svg';
import smartphone3 from '../assets/smartphone3.svg';
import slideCicle1 from '../assets/slideCircle1.svg';
import slideCicle2 from '../assets/slideCircle2.svg';
import slideCicle3 from '../assets/slideCircle3.svg';
import { useState } from 'react';
import Top from './top';

function Description() {
  const [mode, setMode] = useState("slide1");

  const hundleNext1 = () => {
    setMode("slide2");
  }
  const hundleNext2 = () => {
    setMode("slide3");
  }
  const hundleNext3 = () => {
    setMode("moveTop");
  }

  return(
    <>
    { mode === "slide1" && (
      <div className="description_page">
        <h1><img src={logo} alt="ロゴ" /></h1>
        <div className='slideWholeWrap'>
          <div className='slideWrap'>
            <p>リプ単は勉強を</p>
            <p>もっと楽に気軽にします</p>
            <img src={smartphone1} alt="スマホ１" />
            <p>通知から問題を表示</p>
          </div>
          <div className='slideWrap'>
            <p>まずはあなたの、勉強</p>
            <p>したい教科を追加・選択</p>
            <img src={smartphone2} alt="スマホ２" />
          </div>
          <div className='slideWrap'>
            <p>あとは通知がくる</p>
            <p>時間間隔を設定するだけ</p>
            <img src={smartphone3} alt="スマホ３" />
          </div>
        </div>
        <div className="slideCircle">
          <img src={slideCicle1} alt="" />
        </div>
        <div className="nextButton">
          <button onClick={() => hundleNext1()}>はじめよう</button>
        </div>
      </div>
    )}
    { mode === "slide2" && (
      <div className="description_page">
        <h1><img src={logo} alt="ロゴ" /></h1>
        <div className='slideWholeWrap slide2'>
          <div className='slideWrap'>
            <p>リプ単は勉強を</p>
            <p>もっと楽に気軽にします</p>
            <img src={smartphone1} alt="スマホ１" />
            <p>通知から問題を表示</p>
          </div>
          <div className='slideWrap'>
            <p>まずはあなたの、勉強</p>
            <p>したい教科を追加・選択</p>
            <img src={smartphone2} alt="スマホ２" />
          </div>
          <div className='slideWrap'>
            <p>あとは通知がくる</p>
            <p>時間間隔を設定するだけ</p>
            <img src={smartphone3} alt="スマホ３" />
          </div>
        </div>
        <div className="slideCircle">
          <img src={slideCicle2} alt="" />
        </div>
        <div className="nextButton">
          <button onClick={() => hundleNext2()}>次へ</button>
        </div>
      </div>
    )}
    { mode === "slide3" && (
      <div className="description_page">
        <h1><img src={logo} alt="ロゴ" /></h1>
        <div className='slideWholeWrap slide3'>
          <div className='slideWrap'>
            <p>リプ単は勉強を</p>
            <p>もっと楽に気軽にします</p>
            <img src={smartphone1} alt="スマホ１" />
            <p>通知から問題を表示</p>
          </div>
          <div className='slideWrap'>
            <p>まずはあなたの、勉強</p>
            <p>したい教科を追加・選択</p>
            <img src={smartphone2} alt="スマホ２" />
          </div>
          <div className='slideWrap'>
            <p>あとは通知がくる</p>
            <p>時間間隔を設定するだけ</p>
            <img src={smartphone3} alt="スマホ３" />
          </div>
        </div>
        <div className="slideCircle">
          <img src={slideCicle3} alt="" />
        </div>
        <div className="nextButton">
          <button onClick={() => hundleNext3()}>次へ</button>
        </div>
      </div>
    )}
    { mode === "moveTop" && (
      <Top />
    )}
    </>
  )
}

export default Description