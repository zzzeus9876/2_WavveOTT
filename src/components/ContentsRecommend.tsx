import { useNavigate } from 'react-router-dom';
import type { OnlyWavve } from '../types/movie';
import { getGenres } from '../utils/mapping';

import './scss/ContentsRecommend.scss';

interface RecommendProps {
    wavves: OnlyWavve[];
    videoKey: string | undefined;
}

const ContentsRecommend = ({ wavves }: RecommendProps) => {
    const navigate = useNavigate();
    return (
        <div className="recommend-wrap">
            <ul className="recommend-list">
                {wavves.map((w) => (
                    <li className="recommend-card" key={w.id}>
                        <div
                            className="recommend-img"
                            onClick={() => navigate(`/contentsdetail/tv/${w.id}`)}
                        >
                            {/* {w.episodes[0]?.still_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/original${w.episodes[0]?.still_path}`}
                                    alt="thum"
                                />
                            ) : ( */}
                            <img
                                src={`https://image.tmdb.org/t/p/original${w.backdrop_path}`}
                                alt="thum"
                                className="play-default"
                            />
                            <img
                                className="play-hover"
                                src="/images/icons/icon-play-white.svg"
                                alt="playIcon"
                            />
                            {/* )} */}
                        </div>
                        <div className="recommend-text">
                            <h3 className="recommend-title">{w.name}</h3>

                            <div className="recommend-middle">
                                <p className="recommend-star"></p>
                                <p className="recommend-vote seperate">
                                    {(w.vote_average ?? 0).toFixed(1)}
                                </p>
                                <p className="recommend-date seperate">
                                    {w.first_air_date?.slice(0, 4)}년
                                </p>
                                <p className="recommend-genre">
                                    {getGenres(w.genre_ids).slice(0, 2).join(' · ') || '기타'}
                                </p>
                            </div>
                            <div className="recommend-overview">{w.overview}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContentsRecommend;
