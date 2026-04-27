import { useState } from 'react';
import './Login.css';
import logo from '../assets/logo.svg';
import stepLoad from '../assets/stepLoad.svg';

function Login() {
  const initialValues = { userName: "", mailAddress: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // リロード防止
    const errors = validate(formValues);
    setFormErrors(errors);
    setIsSubmit(true);

    // エラーがなければ送信処理へ
    if (Object.keys(errors).length === 0) {
      console.log("送信成功！", formValues);
    }
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    
    if (!values.mailAddress) {
      errors.mailAddress = "メールアドレスを入力してください";
    } else if (!regex.test(values.mailAddress)) {
      errors.mailAddress = "正しいメールアドレスを入力してください";
    }
    
    if (!values.password) {
      errors.password = "パスワードを入力してください";
    } else if (values.password.length < 8) { // 8文字以上推奨
      errors.password = "8文字以上15文字以下で入力してください";
    } else if (values.password.length > 15) {
      errors.password = "15文字以下で入力してください";
    }
    return errors;
  };

  return (
    <div className='login_page'>
      <h1><img src={logo} alt="ロゴ" /></h1>
      <div className="formContainer">
        <img src={stepLoad} alt="ステップ" />
        {/* onSubmit を追加 */}
        <form onSubmit={handleSubmit}>
          <div className="uiForm">
            <div className="formField">
              <label>メールアドレス</label>
              <input
                type="text"
                placeholder='sample@missionmall.com'
                name='mailAddress'
                value={formValues.mailAddress}
                onChange={handleChange}
                style={{ border: "solid 1px red" }}
              />
            </div>
            {/* 波括弧を1つに修正 */}
            <p className="errorMsg" style={{ color: "red" }}>{formErrors.mailAddress}</p>

            <div className="formField">
              <label>パスワード</label>
              <input
                type="password" /* password型に変更 */
                placeholder='パスワード(英数字を含めた８文字以上)'
                name='password'
                value={formValues.password}
                onChange={handleChange}
                style={{ border: "solid 1px red" }}
              />
            </div>
            <p className="errorMsg" style={{ color: "red" }}>{formErrors.password}</p>

            <div className="consensus">
              <input type="checkbox" id="agree" required />
              <label htmlFor="agree">
                <span>利用規約</span>と<span>プライバシーポリシー</span>に同意する
              </label>
            </div>

            <div className="entry_btn">
              <button type="submit">登録</button>
            </div>
            <p className='loginLink'>ログインの方はこちら</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;