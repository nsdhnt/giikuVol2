import { useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import './Login.css';
import logo from '../assets/logo.svg';
import stepLoad from '../assets/stepLoad.svg';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api';

type FormValues = {
  userName: string;
  mailAddress: string;
  password: string;
};

type FormErrors = Partial<Pick<FormValues, 'mailAddress' | 'password'>>;

function Login() {
  const navigate = useNavigate()
  const initialValues = { userName: "", mailAddress: "", password: "" };
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    setApiError("");

    if (Object.keys(errors).length !== 0) return;

    setIsSubmitting(true);
    try {
      const user = await signup(formValues.mailAddress, formValues.password);
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("user_email", user.email);
      navigate("/Description");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validate = (values: FormValues) => {
    const errors: FormErrors = {};
    const regex = /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    
    if (!values.mailAddress) {
      errors.mailAddress = "メールアドレスを入力してください";
    } else if (!regex.test(values.mailAddress)) {
      errors.mailAddress = "正しいメールアドレスを入力してください";
    }
    
    if (!values.password) {
      errors.password = "パスワードを入力してください";
    } else if (values.password.length < 8) {
      errors.password = "8文字以上で入力してください";
    } else if (values.password.length > 15) {
      errors.password = "15文字以下で入力してください";
    }
    return errors;
  };

  return (
    <>
      <div className='login_page'>
        <h1><img src={logo} alt="繝ｭ繧ｴ" /></h1>
        <div className="formContainer">
          <img src={stepLoad} alt="繧ｹ繝・ャ繝・" />
          <div>
            <div className="uiForm">
              <div className="formField">
                <label>メールアドレス</label>
                <input
                  type="text"
                  placeholder='sample@missionmall.com'
                  name='mailAddress'
                  value={formValues.mailAddress}
                  onChange={handleChange}
                />
              </div>
              <p className="errorMsg" style={{ color: "red" }}>{formErrors.mailAddress}</p>

              <div className="formField">
                <label>パスワード</label>
                <input
                  type="password"
                  placeholder='8文字以上15文字以下'
                  name='password'
                  value={formValues.password}
                  onChange={handleChange}
                />
              </div>
              <p className="errorMsg" style={{ color: "red" }}>{formErrors.password}</p>
              {apiError && <p className="errorMsg" style={{ color: "red" }}>{apiError}</p>}

              <div className="consensus">
                <input type="checkbox" id="agree" required />
                <label htmlFor="agree">
                  <span>利用規約</span>と<span>プライバシーポリシー</span>に同意する
                </label>
              </div>

              <div className="entry_btn">
                <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "..." : "登録"}
                </button>
              </div>
              <p className='loginLink'>ログインの方はこちら</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
