import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Episodes, Season } from '../types/movie';

import CustomSelect from './CustomSelect';

import './scss/ContentsEpisode.scss';

interface EpisodeProps {
    episodes: Episodes[];
    seasons?: Season[];
    episodeImages?: string[];
    videoKey: string | undefined;
    selectedPerson: {
        id: number;
        name: string;
    } | null;
}

export interface SelectOption {
    label: string;
    path: string;
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const ContentsEpisode = ({
    episodes,
    seasons = [],
    episodeImages,
    videoKey,
    selectedPerson,
}: EpisodeProps) => {
    const navigate = useNavigate();

    //시즌 0 (스페셜) 제거하고 0개인 시즌도 제외
    const validSeasons = useMemo(() => {
        return seasons.filter(
            (s) =>
                s.season_number > 0 && // 시즌 0 제외
                (s.episode_count ?? 0) > 0 // 빈 에피소드 제외
        );
    }, [seasons]);

    // 첫 시즌 기본값
    const defaultSeason = validSeasons?.[0];
    const [selectedSeason, setSelectedSeason] = useState(defaultSeason ? defaultSeason.name : '');
    const [selectedSort, setSelectedSort] = useState('오래된 순');

    // 초기 에피소드 데이터
    const initialEpisodes = useMemo(() => {
        if (defaultSeason?.episodes) {
            return defaultSeason.episodes.filter((e) => (e.season_number ?? 0) > 0);
        }
        return episodes.filter((e) => (e.season_number ?? 0) > 0);
    }, [episodes, defaultSeason]);

    const [episodesState, setEpisodes] = useState<Episodes[]>([]);

    // 초기 데이터 설정
    useEffect(() => {
        setEpisodes(initialEpisodes);
    }, [initialEpisodes]);

    // 시즌 옵션
    const seasonOptions: SelectOption[] = validSeasons.length
        ? validSeasons.map((season) => ({
              label: season.name,
              path: season.season_number.toString(),
          }))
        : [];

    // 시즌 선택 핸들러
    const handleSeasonSelect = async (path: string, label: string) => {
        setSelectedSeason(label);
        const seasonNumber = path ? Number(path) : null;

        let filtered: Episodes[] = [];

        if (seasonNumber && seasonNumber > 0 && selectedPerson) {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/tv/${selectedPerson.id}/season/${seasonNumber}?api_key=${API_KEY}&language=ko-KR`
                );
                const data = await res.json();
                // 추가: 시즌 0 에피소드 필터링
                filtered = (data.episodes || []).filter(
                    (e: Episodes) => (e.season_number ?? 0) > 0
                );
            } catch (error) {
                console.error('에피소드 로드 실패:', error);
            }
        }

        // 선택된 정렬 기준 적용
        filtered.sort((a, b) =>
            selectedSort === '오래된 순'
                ? a.episode_number - b.episode_number
                : b.episode_number - a.episode_number
        );

        setEpisodes(filtered);
    };

    // 정렬 옵션
    const sortOptions: SelectOption[] = [
        { label: '오래된 순', path: '오래된 순' },
        { label: '최신 순', path: '최신 순' },
    ];

    const handleSortSelect = (label: string) => {
        setSelectedSort(label);
        // 정렬 즉시 적용
        setEpisodes((prev) =>
            [...prev].sort((a, b) =>
                label === '오래된 순'
                    ? a.episode_number - b.episode_number
                    : b.episode_number - a.episode_number
            )
        );
    };

    //썸네일 이미지 가져오기
    const getEpisodeImage = (episode: Episodes, index: number): string => {
        // 1순위: 에피소드 스틸 이미지
        if (episode.still_path) {
            return `https://image.tmdb.org/t/p/original${episode.still_path}`;
        }
        // 2순위: episodeImages 배열 (유틸 함수에서 만든 것)
        if (episodeImages && episodeImages[index]) {
            return episodeImages[index];
        }
        // 3순위: 기본 이미지
        return '/images/default-thumbnail.png';
    };

    // episodes + 이미지 처리, 정렬 적용
    const filteredEpisodes = episodesState
        .filter((e) => (e.season_number ?? 0) > 0) // 시즌 0 제거
        .map((e, index) => ({
            // index 추가!
            ...e,
            image: getEpisodeImage(e, index), // index 전달
        }))
        .sort((a, b) =>
            selectedSort === '오래된 순'
                ? a.episode_number - b.episode_number
                : b.episode_number - a.episode_number
        );

    return (
        <div className="episode-wrap">
            <div className="episode-menu">
                {seasonOptions.length > 0 && (
                    <div className="episode-select season">
                        <CustomSelect
                            options={seasonOptions}
                            selectedValue={selectedSeason}
                            onSelect={handleSeasonSelect}
                            label={selectedSeason}
                            width="100%"
                        />
                    </div>
                )}

                <div className="episode-select latest">
                    <CustomSelect
                        options={sortOptions}
                        selectedValue={selectedSort}
                        onSelect={handleSortSelect}
                        label="정렬"
                        width="100%"
                    />
                </div>
            </div>

            <ul className="episode-list">
                {filteredEpisodes.map((e) => (
                    <li key={e.id} className="episode-card">
                        <div
                            className="episodes-img"
                            onClick={() => navigate(`/player/${videoKey}`)}
                        >
                            <img className="play-default" src={e.image} alt={e.name} />
                            <img
                                className="play-hover"
                                src="/images/icons/icon-play-white.svg"
                                alt="playIcon"
                            />
                        </div>

                        <div className="episodes-text">
                            <h3>
                                시즌 {e.season_number} {e.episode_number}화
                            </h3>
                            {e.runtime ? <p>{e.runtime}분</p> : ''}
                            <p className="episode-overview">{e.overview}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContentsEpisode;
