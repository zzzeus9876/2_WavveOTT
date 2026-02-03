import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import { usePickStore } from '../stores/usePickStore';

import type { Movie } from '../types/movie';

import { getGenres, getGrades } from '../utils/mapping';
import { backgroundImage, logoImage } from '../utils/getListData';

import type { Pick } from '../types/pick';

import Modal from './Modal';

interface NewMovieListProps {
    title: string;
    newMovies: Movie[];
}

const NewMovieList = ({ title, newMovies }: NewMovieListProps) => {
    const { onTogglePick, pickList, pickAction } = usePickStore();

    //어떤거가 호버됐는지 체크
    const [hoverId, setHoverId] = useState<number | null>(null); //숫자로 받기
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSize, setModalSize] = useState<'xsmall' | 'small' | 'default' | 'large'>('default');

    //스와이퍼 슬라이드 첫번째,마지막 슬라이더 버튼 숨기기
    const prevBtn = useRef<HTMLDivElement>(null);
    const nextBtn = useRef<HTMLDivElement>(null);

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
    const handlePlayClick = (e: React.MouseEvent, t: Movie) => {
        e.stopPropagation(); // 부모의 onClick 방지
        if (!t.videos?.length) return;
        navigate(`/player/${t.videos?.[0]?.key}`);
    };
    // ===================================================

    // ========== 모바일을 위한 클릭 버튼 ==========
    const handleOpenDetailPage = (id: number) => {
        if (window.innerWidth <= 1200) {
            navigate(`/moviedetail/movie/${id}`);
        }
    };
    // ===================================================

    // 데이터가 없을 때 (로딩 중일 때) 스켈레톤 표시
    if (!newMovies || newMovies.length === 0) {
        return (
            <section className="card-list">
                <h2>{title}</h2> {/* 제목은 미리 보여주는 게 사용자 경험에 좋습니다 */}
                <div
                    style={{ display: 'flex', gap: '24px', overflow: 'hidden', padding: '10px 0' }}
                >
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}
                        >
                            {/* 순위 숫자 자리 스켈레톤 (선택 사항) */}
                            <div
                                className="skeleton-item"
                                style={{ width: '40px', height: '80px' }}
                            />
                            {/* 카드 이미지 스켈레톤 */}
                            <div
                                className="skeleton-item"
                                style={{ width: '215px', height: '310px', flexShrink: 0 }}
                            />
                        </div>
                    ))}
                </div>
            </section>
        );
    }
    return (
        <section className="card-list">
            <div className="title-wrap">
                <h2>{title}</h2>
                <Link to="/movie">더보기</Link>
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
                {newMovies.map((t, id) => (
                    <SwiperSlide key={id}>
                        <div
                            className="poster-wrap badge-new"
                            onMouseEnter={() => setHoverId(t.id)}
                            onMouseLeave={() => setHoverId(null)}
                            onClick={() => handleOpenDetailPage(t.id)}
                        >
                            <img
                                className="main"
                                src={`https://image.tmdb.org/t/p/original${t.poster_path}`}
                                alt={t.title}
                            />
                            {(t.videos?.[0]?.key || t.backdrop_path || t.poster_path) && (
                                <div className="preview-wrap">
                                    <div className="img-box">
                                        {t.videos?.[0]?.key && hoverId === t.id ? (
                                            <iframe
                                                className="hover video"
                                                src={`https://www.youtube.com/embed/${t.videos[0].key}?autoplay=1&mute=1`}
                                                allowFullScreen
                                                title={t.title}
                                            />
                                        ) : (
                                            <img
                                                className="hover image"
                                                src={
                                                    backgroundImage(t.id) ||
                                                    (t.backdrop_path
                                                        ? `https://image.tmdb.org/t/p/original${t.backdrop_path}`
                                                        : undefined)
                                                }
                                                alt={t.title}
                                            />
                                        )}

                                        <div className="logo-box">
                                            <p className="content-logo">
                                                <img
                                                    src={
                                                        logoImage(t.id) ||
                                                        (t.logo
                                                            ? `https://image.tmdb.org/t/p/original${t.logo}`
                                                            : undefined)
                                                    }
                                                    alt="content-logo"
                                                />
                                            </p>
                                            {hoverId === t.id && t.videos?.[0]?.key && (
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
                                            <img
                                                src={getGrades(t.certificationMovie)}
                                                alt="certification"
                                            />
                                        </p>
                                        <p className="preview-genre">
                                            {getGenres(t.genre_ids).slice(0, 2).join(' · ') ||
                                                '기타'}
                                        </p>
                                        {/* <p>에피소드 {t.episodes.length}</p> */}
                                    </div>
                                    <div className="preview-badge-bottom">
                                        <div className="preview-btn-wrap">
                                            <button
                                                className="preview-play-btn"
                                                onClick={(e) => handlePlayClick(e, t)}
                                            ></button>
                                            <button
                                                className={`preview-heart-btn ${
                                                    pickList.some(
                                                        (p) => (p.tmdb_id ?? p.id) === t.id,
                                                    )
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                onClick={(e) => handleHeart(e, t)}
                                            ></button>
                                        </div>
                                        <Link to={`/moviedetail/movie/${t.id}`}></Link>
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

export default NewMovieList;
