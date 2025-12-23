import { useParams, useNavigate } from "react-router-dom";
import { eventData } from "../data/eventData";
import "./scss/EventDetail.scss";

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = eventData.find((e) => e.id === Number(eventId));

  if (!event) {
    return (
      <>
        <p>존재하지 않는 이벤트입니다.</p>
        <button
          className="btn default primary"
          onClick={() => navigate("/event")}
        >
          이벤트 목록
        </button>
      </>
    );
  }
  return (
    <>
      <div className="event-detail-wrap">
        <div className="event-detail">
          <div className="event-detail-top">
            <div className="event-title-wrap">
              <h3>{event.title}</h3>
              <p>{event.date}</p>
            </div>
            <button
              className="btn default primary"
              onClick={() => navigate("/event-group")}
            >
              이벤트 목록
            </button>
          </div>


          <div className="img-box">
            <img src={event.imgUrl} alt={event.title} />
          </div>
          <button className="btn default primary" onClick={() => navigate("/event-group")}>이벤트 목록</button>
        </div>
      </div>
    </>
  );
};

export default EventDetail;
