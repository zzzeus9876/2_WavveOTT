import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./scss/Event.scss";

const EventGroup = () => {
  const location = useLocation();

  // 현재 경로가 정확히 "/event" 이거나 "/event/" 일 때만 탭을 보여줌
  // (상세 페이지 주소인 /event/123 등에서는 false가 됨)
 const isListPage = 
    location.pathname === "/event-group" || 
    location.pathname === "/event-group/" || 
    location.pathname.includes("event-winner");

  return (
    <main className="event-group-wrap">
      <div className="inner">
        <section>
  
          <div>
           {/* 탭 노출 여부 조건부 렌더링 */}
            {isListPage && (
            <>
              <h2>EVENT</h2>
              <ul className="event-list-tab">
                <li>
                  <NavLink to="." end className={({ isActive }) => (isActive ? "active" : "")}>
                    진행중인 이벤트
                  </NavLink>
                </li>
                <li>
                  <NavLink to="event-winner" className={({ isActive }) => (isActive ? "active" : "")}>
                    당첨자 발표
                  </NavLink>
                </li>
              </ul>
            </>
          )}
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
};

export default EventGroup;
