import { useNavigate } from 'react-router-dom';
import type { Movie } from '../types/movie';

import { getGenres } from '../utils/mapping';

import './scss/MovieRecommend.scss';

interface RecommendProps {
    popularMovies: Movie[];
    videoKey: string | undefined;
}

const MovieRecommend = ({ popularMovies }: RecommendProps) => {
    const navigate = useNavigate();
    return (
        <div className="recommend-wrap">
            <ul className="recommend-list">
                {popularMovies.map((p) => (
                    <li className="recommend-card" key={p.id}>
                        <div
                            className="recommend-img"
                            onClick={() => navigate(`/moviedetail/movie/${p.id}`)}
                        >
                            {/* {w.episodes[0]?.still_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/original${w.episodes[0]?.still_path}`}
                                    alt="thum"
                                />
                            ) : ( */}
                            <img
                                src={`https://image.tmdb.org/t/p/original${p.backdrop_path}`}
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
                            <h3 className="recommend-title">{p.title}</h3>

                            <div className="recommend-middle">
                                {/* <img src="/images/icons/icon-star.svg" alt="starIcon" /> */}
                                <p className="recommend-star"></p>
                                <p className="recommend-vote seperate">
                                    {(p.vote_average ?? 0).toFixed(1)}
                                </p>
                                <p className="recommend-date seperate">
                                    {p.release_date?.slice(0, 4)}년
                                </p>
                                <p className="recommend-genre">
                                    {getGenres(p.genre_ids).slice(0, 2).join(' · ') || '기타'}
                                </p>
                            </div>
                            <div className="recommend-overview">{p.overview}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MovieRecommend;
