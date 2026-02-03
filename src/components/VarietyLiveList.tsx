import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import { useVarietyStore } from '../stores/useVarietyStore';
import { usePickStore } from '../stores/usePickStore';

import { getGrades } from '../utils/mapping';

import { varietyTop50 } from '../data/2025_varietyTop50_tmdb';

import type { Episodes, Variety, Video } from '../types/movie';

import Modal from './Modal';
import type { Pick } from '../types/pick';

interface VarietyLiveList {
    title: string;
    video: Record<number, { tvsVideo: Video | null; episodes: Episodes[] }>;
}

const VarietyLiveList = ({ title, video }: VarietyLiveList) => {
    // const { id } = useParams();
    const { onTogglePick, pickList, pickAction } = usePickStore();
    const { tvVideos, onFetchVariety } = useVarietyStore();

    //어떤거가 호버됐는지 체크
    const [hoverId, setHoverId] = useState<number | null>(null); //숫자로 받기
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSize, setModalSize] = useState<'xsmall' | 'small' | 'default' | 'large'>('default');

    useEffect(() => {
        // varietyTop50 데이터를 돌면서 비디오 정보가 없는 것만 요청하도록 수정
        varietyTop50.forEach((t) => {
            // 이미 tvVideos 객체에 해당 id의 데이터가 있다면 다시 호출하지 않음
            if (t.tmdb_id && !tvVideos[t.tmdb_id]) {
                onFetchVariety(t.tmdb_id);
            }
        });
    }, []);

    //스와이퍼 슬라이드 첫번째,마지막 슬라이더 버튼 숨기기
    const prevBtn = useRef<HTMLDivElement>(null);
    const nextBtn = useRef<HTMLDivElement>(null);

    const videoKey = hoverId ? video[hoverId]?.tvsVideo?.key : undefined;
    const episodes = hoverId ? video[hoverId]?.episodes : null;

    const navigate = useNavigate();

    const handleSwiperBtns = (swiper: SwiperClass) => {
        const isFirst = swiper.activeIndex === 0;
        const isLast = swiper.activeIndex === 13;

        if (prevBtn.current) {
            if (isFirst) prevBtn.current.classList.add('hidden');
            else prevBtn.current.classList.remove('hidden');
        }

        if (nextBtn.current) {
            if (isLast) nextBtn.current.classList.add('hidden');
            else nextBtn.current.classList.remove('hidden');
        }
    };

    const handleBeforeInit = (swiper: SwiperClass) => {
        // navigation params 타입 체크
        if (typeof swiper.params.navigation !== 'boolean') {
            const navigation = swiper.params.navigation;
            if (navigation) {
                navigation.prevEl = prevBtn.current;
                navigation.nextEl = nextBtn.current;
            }
        }
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleHeart = async (e: React.MouseEvent, item: Pick) => {
        e.stopPropagation(); // 부모의 onClick 방지
        await onTogglePick(item);
        setModalSize('small');
        setIsModalOpen(true);
    };

    // ========== 재생 함수 ==========

    const handlePlayClick = (e: React.MouseEvent, t: Variety) => {
        e.stopPropagation(); // 부모의 onClick(상세페이지 이동)이 실행되지 않게 막음
        console.log('클릭한 아이템:', t);
        console.log('전체 비디오 객체:', video);
        console.log('찾은 키:', video[t.tmdb_id!]?.tvsVideo?.key);
        const targetId = t.tmdb_id;
        if (!targetId) return;

        const currentVideoKey = video[targetId]?.tvsVideo?.key || t.videos?.[0]?.key;

        if (!currentVideoKey) {
            console.log('재생할 비디오 키를 찾을 수 없습니다.');
            return;
        }
        navigate(`/player/${currentVideoKey}`);
    };

    // ===================================================

    // ========== 모바일을 위한 클릭 버튼 ==========
    const handleOpenDetailPage = (id: number | null) => {
        if (window.innerWidth <= 1200) {
            navigate(`/contentsdetail/tv/${id}`);
        }
    };
    // ===================================================

    return (
        <section className="card-list">
            <div className="title-wrap">
                <h2>{title}</h2>
                <Link to="/entertainment">더보기</Link>
            </div>
            <Swiper
                modules={[Navigation]}
                navigation={false}
                onBeforeInit={handleBeforeInit}
                onSwiper={handleSwiperBtns}
                onSlideChange={handleSwiperBtns}
                onReachEnd={handleSwiperBtns}
                slidesPerView="auto"
                spaceBetween={24}
                slidesOffsetBefore={0}
                slidesOffsetAfter={0}
                watchSlidesProgress={true}
            >
                {varietyTop50.map((t, id) => (
                    <SwiperSlide key={id}>
                        <div
                            className="poster-wrap badge-new"
                            // onMouseEnter={() => setHoverId(t.tmdb_id)}
                            // onMouseLeave={() => setHoverId(null)}
                            onMouseEnter={() => setHoverId(t.tmdb_id)}
                            onClick={() => handleOpenDetailPage(t.tmdb_id)}
                        >
                            <img
                                className="main"
                                // src={`https://image.tmdb.org/t/p/original${t.poster_path}`}
                                src={`https://${t.seasonposterimage}`}
                                alt={t.series_title}
                            />
                            {(videoKey ||
                                t.season_horizontal_logoN_image ||
                                t.seasonposterimage) && (
                                <div className="preview-wrap">
                                    <div className="img-box">
                                        {videoKey && hoverId === t.tmdb_id ? (
                                            <iframe
                                                className="hover video"
                                                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1`}
                                                allowFullScreen
                                                title={t.series_title}
                                            />
                                        ) : (
                                            <img
                                                className="hover image"
                                                src={`https://${t.season_horizontal_logoN_image}`}
                                                alt={t.series_title}
                                            />
                                        )}

                                        <div className="logo-box">
                                            <p className="content-logo">
                                                <img
                                                    src={`https://${t.seasontitlelogoimage}`}
                                                    // logoImage(t.index) ||
                                                    // (t.seasontitlelogoimage?
                                                    // `https://image.tmdb.org/t/p/original${t.seasontitlelogoimage}`
                                                    // : undefined)

                                                    alt="content-logo"
                                                />
                                            </p>
                                            {hoverId === t.index && (
                                                <img
                                                    src="/images/icons/icon-volume-off.svg"
                                                    alt="sound-icon"
                                                    className="sound-icon"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="preview-badge-top">
                                        <p>
                                            <img src={getGrades(t.targetage)} alt="certification" />
                                        </p>
                                        <p className="preview-genre">{t.genretext}</p>
                                        {episodes?.length ? (
                                            <p>에피소드 {episodes.length}</p>
                                        ) : null}
                                    </div>
                                    <div className="preview-badge-bottom">
                                        <div className="preview-btn-wrap">
                                            <button
                                                className="preview-play-btn"
                                                onClick={(e) => handlePlayClick(e, t)}
                                            />
                                            <button
                                                className={`preview-heart-btn ${
                                                    typeof t.tmdb_id === 'number' &&
                                                    pickList.some(
                                                        (p) => (p.tmdb_id ?? p.id) === t.tmdb_id,
                                                    )
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                onClick={(e) => handleHeart(e, t)}
                                            ></button>
                                        </div>
                                        <Link to={`/contentsdetail/tv/${t.tmdb_id}`}></Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
                <div className="prev-wrap">
                    <div ref={prevBtn} className="swiper-button-prev"></div>
                </div>
                <div className="next-wrap">
                    <div ref={nextBtn} className="swiper-button-next"></div>
                </div>
            </Swiper>
            {/* 찜 모달 */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} size={modalSize}>
                {/* 모달 내부 콘텐츠: Header, Body, Footer를 직접 구성 */}
                <div className="modal-header">
                    <h3 className="modal-title">알림</h3>
                    {/* 닫기 버튼은 onCLose 핸들러를 호출 */}
                    <button className="close-button" onClick={handleCloseModal}>
                        <span>닫기</span>
                    </button>
                </div>
                <div className="modal-content">
                    <p>
                        {pickAction === 'add'
                            ? '찜 리스트에 추가되었습니다!'
                            : '찜 리스트에서 제거되었습니다!'}
                    </p>
                </div>
                <div className="modal-footer">
                    <button
                        className="btn default primary"
                        onClick={() => {
                            handleCloseModal();
                            navigate('/profile');
                        }}
                    >
                        찜 바로가기
                    </button>
                    <button className="btn default secondary-line" onClick={handleCloseModal}>
                        닫기
                    </button>
                </div>
            </Modal>
        </section>
    );
};

export default VarietyLiveList;
