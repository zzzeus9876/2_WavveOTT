import { SwiperSlide, Swiper } from "swiper/react";
import { backgroundImage, logoImage } from "../utils/getListData";
import { getGenres, getGrades } from "../utils/mapping";
import { Link, useNavigate } from "react-router-dom";
import { usePickStore } from "../stores/usePickStore";
import Modal from "./Modal";
import type { Pick } from "../types/pick";
import { useState } from "react";

const SwiperDefault = ({ data }: { data: Pick[] }) => {
  const { onTogglePick, pickAction } = usePickStore();

  const [hoverId, setHoverId] = useState<number | null>(null);
  const list = Array.isArray(data) ? data : [];

  const [modalSize, setModalSize] = useState<"xsmall" | "small" | "default" | "large">("default");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleHeart = async (item: Pick) => {
    await onTogglePick(item);
    setModalSize("small");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  /** 🔑 공통 UID */
  const getUid = (d: Pick) => Number(d.contentId ?? d.tmdb_id ?? d.id);

  return (
    <div className="default-list">
      <Swiper slidesPerView="auto" spaceBetween={24}>
        {list
          .filter((d) => !Number.isNaN(getUid(d)))
          .map((d, i) => {
            const uid = getUid(d);
            const title = d.title ?? d.name ?? d.programtitle ?? d.series_title ?? "제목 없음";
            const isOnly = list.length === 1;
            const videoKey = d.tvsVideo?.key ?? d.videos?.[0]?.key ?? null;

            return (
              <SwiperSlide
                key={uid}
                className={[
                  i === 0 ? "first" : "",
                  i === list.length - 1 ? "last" : "",
                  isOnly ? "only" : "",
                ].join(" ")}>
                <div className="poster-wrap badge-new">
                  {/* ===== 메인 포스터 ===== */}
                  <img
                    className="main"
                    src={
                      d.poster_path
                        ? `https://image.tmdb.org/t/p/original${d.poster_path}`
                        : d.seasonposterimage
                        ? `https://${d.seasonposterimage}`
                        : undefined
                    }
                    alt={title}
                  />

                  <div className="preview-wrap">
                    <div
                      className="img-box"
                      onMouseEnter={() => setHoverId(uid)}
                      onMouseLeave={() => setHoverId(null)}>
                      {/* ===== hover 영역 ===== */}
                      {videoKey && hoverId === uid ? (
                        <iframe
                          className="hover video"
                          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1`}
                          allowFullScreen
                          title={title}
                        />
                      ) : (
                        <img
                          className="hover image"
                          src={
                            backgroundImage(uid) ??
                            (d.backdrop_path
                              ? `https://image.tmdb.org/t/p/original${d.backdrop_path}`
                              : d.backdrop
                              ? `https://image.tmdb.org/t/p/original${d.backdrop}`
                              : d.season_horizontal_logoN_image
                              ? `https://${d.season_horizontal_logoN_image}`
                              : undefined)
                          }
                          alt={title}
                        />
                      )}

                      {/* ===== 로고 ===== */}
                      <div className="logo-box">
                        <p className="content-logo">
                          {(() => {
                            const logoSrc =
                              logoImage(uid) ??
                              (d.logo
                                ? `https://image.tmdb.org/t/p/original${d.logo}`
                                : d.seasontitlelogoimage
                                ? `https://${d.seasontitlelogoimage}`
                                : null);

                            return logoSrc ? <img src={logoSrc} alt="content-logo" /> : null;
                          })()}
                        </p>

                        {hoverId === uid && d.videos?.[0]?.key && (
                          <img
                            src="/images/icons/icon-volume-off.svg"
                            alt="sound-icon"
                            className="sound-icon"
                          />
                        )}
                      </div>
                    </div>

                    {/* ===== 상단 뱃지 ===== */}
                    <div className="preview-badge-top">
                      <p>
                        <img
                          src={getGrades(d.certificationMovie ?? d.targetage)}
                          alt="certification"
                        />
                      </p>
                      <p className="preview-genre">
                        {d.genre_ids
                          ? getGenres(d.genre_ids).slice(0, 2).join(" · ")
                          : d.genretext ?? "기타"}
                      </p>
                    </div>

                    {/* ===== 하단 버튼 ===== */}
                    <div className="preview-badge-bottom">
                      <div className="preview-btn-wrap">
                        <button className="preview-play-btn" />
                        <button
                          className="preview-heart-btn active"
                          onClick={() => handleHeart(d)}
                        />
                      </div>

                      <Link
                        to={
                          d.media_type === "movie"
                            ? `/moviedetail/movie/${uid}`
                            : `/contentsdetail/tv/${uid}`
                        }
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>

      {/* ===== 찜 모달 ===== */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size={modalSize}>
        <div className="modal-header">
          <h3 className="modal-title">알림</h3>
          <button className="close-button" onClick={handleCloseModal}>
            <span>닫기</span>
          </button>
        </div>

        <div className="modal-content">
          <p>
            {pickAction === "add" ? "찜 리스트에 추가되었습니다!" : "찜 리스트에서 제거되었습니다!"}
          </p>
        </div>

        <div className="modal-footer">
          <button
            className="btn default primary"
            onClick={() => {
              handleCloseModal();
              navigate("/profile");
            }}>
            찜 바로가기
          </button>
          <button className="btn default secondary-line" onClick={handleCloseModal}>
            닫기
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SwiperDefault;
