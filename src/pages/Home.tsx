import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useMovieStore } from '../stores/useMovieStore';
import { useWavveStore } from '../stores/useWavveStore';
import { useTvStore } from '../stores/useTvStore';
import { usePeopleStore } from '../stores/usePeopleStore';
import { useVarietyStore } from '../stores/useVarietyStore';

import MainSlider from '../components/MainSection';
import BroadcastList from '../components/BroadcastList';
import MainNomination from '../components/MainNomination';
import RankingCardList from '../components/RankingCardList';
import WavveList from '../components/WavveList';
import PeopleList from '../components/PeopleList';
import PrimaryList from '../components/PrimaryList';
import NewMovieList from '../components/NewMovieList';
import EditorRecommendCardList from '../components/EditorRecommendCardList';
import NewTvList from '../components/NewTvList';
import VarietyLiveList from '../components/VarietyLiveList';
import AniHotList from '../components/AniHotList';
import UserWatchList from '../components/UserWatchList';

import type { PrimaryItem } from '../types/movie';

import { randomArray } from '../utils/randomData';

// import { varietyTop50 } from '../data/2025_varietyTop50_tmdb';
// import { aniTop50 } from '../data/2025_aniTop50_tmdb';

import './scss/Home.scss';
import '../style/common-button.scss';

const Home = () => {
    const { popularMovies, newMovies, onFetchPopular, onFetchNewMovie } = useMovieStore();
    const { wavves, fetchWavves } = useWavveStore();
    const { tvs, fetchTvs } = useTvStore();
    const { people, onFetchPeople } = usePeopleStore();
    const { tvVideos } = useVarietyStore();

    // useEffect(() => {
    //   onFetchPopular();
    //   fetchWavves();
    //   onFetchNewMovie();
    //   fetchTvs();
    //   onFetchPeople();
    //   varietyTop50.forEach((v) => {
    //     if (v.tmdb_id) {
    //       onFetchVariety(v.tmdb_id);
    //     }
    //   });
    //   aniTop50.forEach((v) => {
    //     if (v.tmdb_id) {
    //       onFetchVariety(v.tmdb_id);
    //     }
    //   });
    // }, [
    //   onFetchPopular,
    //   fetchWavves,
    //   onFetchNewMovie,
    //   fetchTvs,
    //   onFetchPeople,
    //   onFetchVariety,
    // ]);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                //1. 데이터 파일 fetch 작업 promise 배열로 만들기
                // const varietyPromises = varietyTop50
                //     .slice(0, 20)
                //     .filter((v) => v.tmdb_id)
                //     .map((v) => onFetchVariety(v.tmdb_id));
                // const aniPromises = aniTop50
                //     .slice(0, 20)
                //     .filter((a) => a.tmdb_id)
                //     .map((a) => onFetchVariety(a.tmdb_id));

                //2.
                await Promise.all([
                    onFetchPopular(),
                    fetchWavves(),
                    onFetchNewMovie(),
                    fetchTvs(),
                    onFetchPeople(),
                    // ...varietyPromises,
                    // ...aniPromises,
                ]);

                console.log('모든 데이터 로딩 완료!');
            } catch (error) {
                console.error('하나 이상의 요청이 실패했습니다.', error);
            }
        };
        loadHomeData();
    }, []);

    const randomList = useMemo<PrimaryItem[]>(() => {
        return randomArray([
            ...wavves.map((v) => ({ ...v, mediaType: 'tv' as const })),
            ...tvs.map((v) => ({ ...v, mediaType: 'tv' as const })),
        ])
            .filter((v) => v.poster_path) // 이미지 없는 거 제거
            .slice(0, 20);
    }, [wavves, tvs]);

    // 모든 데이터가 로드되었는지 확인하는 변수(스켈레톤 UI를 위한 변수)
    const isAllLoaded = wavves.length > 0 && popularMovies.length > 0 && tvs.length > 0;

    // 1. 데이터가 아직 로딩 중일 때 보여줄 전체 스켈레톤 레이아웃
    if (!isAllLoaded) {
        return (
            <main className="main-home">
                {/* 상단 슬라이더 스켈레톤 */}
                <div className="skeleton-item" style={{ width: '100%', height: '500px' }} />

                <div className="inner" style={{ marginTop: '40px' }}>
                    {/* 반복되는 리스트 구조를 스켈레톤으로 재현 */}
                    {[1, 2, 3].map((section) => (
                        <section
                            key={section}
                            className="card-list"
                            style={{ marginBottom: '50px' }}
                        >
                            <div
                                className="skeleton-item"
                                style={{ width: '200px', height: '30px', marginBottom: '20px' }}
                            />
                            <div style={{ display: 'flex', gap: '24px', overflow: 'hidden' }}>
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div
                                        key={i}
                                        className="skeleton-item"
                                        style={{ width: '215px', height: '310px', flexShrink: 0 }}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        );
    }

    return (
        <main className="main-home">
            <div className="" style={{ minHeight: '200px' }}>
                <MainSlider />
            </div>
            <div className="inner">
                <BroadcastList />
                <section className="card-list">
                    <h2>지금 시청중인 컨텐츠</h2>
                    <UserWatchList />
                </section>
            </div>
            <MainNomination />

            <div className="inner">
                <RankingCardList title={'실시간 TOP 20'} RankingData={popularMovies} />
                <WavveList title="오직 웨이브에서만" wavves={wavves} />
                <div className="banner-event">
                    <Link to={'/event-group'}>
                        <img src="/images/banner/banner-main-event.png" alt="banner event" />
                    </Link>
                </div>
                <PeopleList title="지금 주목받는 스타들" people={people} />
                <PrimaryList title="이건 꼭 봐야해!" randomList={randomList} />
                <NewMovieList title="NEW! 새로 올라온 영화" newMovies={newMovies} />
            </div>
            <EditorRecommendCardList title="믿고보는 에디터 추천작" list={popularMovies} />
            <div className="inner">
                <NewTvList title="NEW! 새로 올라온 시리즈" tvs={tvs} />
                <VarietyLiveList title="지금 방영중인 예능" video={tvVideos} />
                <AniHotList title="NEW! 새로 올라온 애니" video={tvVideos} />
            </div>
        </main>
    );
};

export default Home;
