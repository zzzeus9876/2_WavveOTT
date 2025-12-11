import "./scss/Login.scss";
import "../style/common-button.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useState, useEffect } from "react";
import EtcLogin from "../components/EtcLogin";

const Login = () => {
  const { onLogin, onGoogleLogin } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    () => localStorage.getItem("savedEmail") || ""
  );
  const [password, setPassword] = useState("");
  const [autoId, setautoId] = useState(
    () => !!localStorage.getItem("savedEmail")
  );
  const [autoPassword, setautoPassword] = useState(
    () => !!localStorage.getItem("autoLogin")
  );

  // 아이디 저장 체크박스 변경 시
  const handleautoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setautoId(checked);
    
    if (!checked) {
      // 체크 해제 시 즉시 삭제
      localStorage.removeItem("savedEmail");
      setEmail("");
    }
  };

  // 자동 로그인 체크박스 변경 시
  const handleautoPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setautoPassword(checked);
    
    if (!checked) {
      // 체크 해제 시 즉시 삭제
      localStorage.removeItem("autoLogin");
      localStorage.removeItem("savedPassword");
      setPassword("");
    }
  };

  // 페이지 로드 시 저장된 비밀번호 불러오기
  useEffect(() => {
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedPassword && autoPassword) {
      setPassword(savedPassword);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onLogin(email, password);
      
      // 아이디 저장
      if (autoId) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }

      // 자동 로그인 설정 (비밀번호 저장)
      if (autoPassword) {
        localStorage.setItem("autoLogin", "true");
        localStorage.setItem("savedPassword", password);
      } else {
        localStorage.removeItem("autoLogin");
        localStorage.removeItem("savedPassword");
      }

      setPassword("");
      navigate("/choice-char");
    } catch (err) {
      console.log("로그인 안됨....");
    }
  };

  const handleGoogle = async () => {
    const success = await onGoogleLogin();

    if (success) {
      navigate("/choice-char");
    }
  };

  return (
    <main>
      <div className="login">
        <div>
          <h2>로그인</h2>
          <p>Wavve 계정으로 로그인</p>
        </div>

        <form onSubmit={handleLogin}>
          <label className="input-text">
            <span className="label-text">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
            />
            <p className="text-info">
              로그인, 비밀번호 찾기, 알림에 사용되니 정확한 이메일을 입력해
              주세요.
            </p>
          </label>
          <label className="input-text">
            <span className="label-text">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
          </label>
          <div className="save-id">
            <label>
              <input
                type="checkbox"
                checked={autoId}
                onChange={handleautoIdChange}
              />{" "}
              아이디 저장
            </label>
            <label>
              <input
                type="checkbox"
                checked={autoPassword}
                onChange={handleautoPasswordChange}
              />{" "}
              자동로그인
            </label>
          </div>
          <div>
            <button type="submit" className="btn large primary wFull">
              로그인
            </button>
          </div>
        </form>
        <div className="btn-box">
          <ul className="division-list">
            <li>아이디 찾기</li>
            <li>비밀번호 재설정</li>
            <li>
              <Link to={"/signup"}>회원가입</Link>
            </li>
          </ul>
        </div>
        <EtcLogin handleGoogle={handleGoogle} />
      </div>
    </main>
  );
};

export default Login;