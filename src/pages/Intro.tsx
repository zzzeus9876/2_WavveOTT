import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingBar from "../components/LoadingBar"; 
import "../style/common-button.scss";
import "./scss/Intro.scss";

const Intro = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 페이지 로딩 시뮬레이션 (이미지 로딩이나 데이터 페칭 시간 고려)
    // 실제 데이터가 있다면 해당 로직 완료 후 setIsLoading(false)를 호출.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1초 후 로딩 종료

    return () => clearTimeout(timer); // 언마운트 시 타이머 제거
  }, []);

  // 로딩 중일 때 로딩바 표시
  if (isLoading) {
    return <LoadingBar />;
  }

  return (
    <div className="intro-wrap">
      <section className="intro1">
        <p className="double-logo">
          <img src="/images/double-logo.png" alt="웨이브 티빙" />
        </p>
        <p className="text-intro1">
          <img src="/images/text-intro-enjoy.svg" alt="왜 웨이브인가요?" />
        </p>
        <div className="btn-box">
          <Link to={'/login'} className="btn default primary">웨이브 시작하기</Link>
        </div>
      </section>

      <section className="intro2">
        <p className="text-intro2">
          <img src="/images/text-intro-why.svg" alt="왜 웨이브인가요?" />
        </p>
        <ul>
          <li>
            <p>
              <span>지상파 3사(KBS·MBC·SBS)</span>
              <span>콘텐츠를 한 곳에서</span>
            </p>
            <p>
              <span>본방부터 최신 회차까지</span>
              <span>드라마, 예능, 시사교양을 빠르게 시청하세요.</span>
            </p>
          </li>
          <li>
            <p>
              <span>국내 콘텐츠에</span>
              <span>특화된 큐레이션</span>
            </p>
            <p>
              <span>실시간 트렌드, 화제작, 요일별 편성 기반 추천으로</span>
              <span>‘지금 볼 것’을 바로 찾을 수 있어요.</span>
            </p>
          </li>
          <li>
            <p>
              <span>Wavve 오리지널</span>
              <span>오직 Wavve에서만</span>
            </p>
            <p>
              <span>차별화된 오리지널 드라마와 예능으로</span>
              <span>새로운 한국 콘텐츠의 기준을 만듭니다.</span>
            </p>
          </li>
        </ul>
      </section>

      <section className="intro3">
        <p className="text-intro3">
          <img src="/images/text-intro-only.png" alt="오직 웨이브에서만" />
        </p>
        <div className="img-box">
          <div className="img-top">
            <div className="roll-track">
              <img src="/images/visual/visual-intro1.svg" alt="image" />
              <img src="/images/visual/visual-intro1.svg" alt="image" />
            </div>
          </div>
          <div className="img-bottom">
            <div className="roll-track">
              <img src="/images/visual/visual-intro2.svg" alt="image" />
              <img src="/images/visual/visual-intro2.svg" alt="image" />
            </div>
          </div>
        </div>
      </section>

      <section className="intro4">
        <p className="text-intro4">
          <img
            src="/images/text-intro-now.svg"
            alt="지금 웨이브에서 시작해보세요"
          />
        </p>
        <div className="btn-box">
          <Link className="btn default primary" to={"/login"}>
            웨이브 시작하기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Intro;