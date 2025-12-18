import { create } from 'zustand';

import { ACTOR_ID_LIST } from '../constants/actor';
import type {
    Episodes,
    PeopleState,
    Video,
    PersonCast,
    CreditPerson,
    TMDBTvCast,
} from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const usePeopleStore = create<PeopleState>((set) => ({
    people: [],
    selectedPeople: null,

    //PeopleList
    onFetchPeople: async () => {
        try {
            const results = await Promise.all(
                ACTOR_ID_LIST.map(async (id) => {
                    /* 배우 출연작 */
                    const res = await fetch(
                        `https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${API_KEY}&language=ko-KR`
                    );
                    const data = await res.json();

                    const castWithExtra: PersonCast[] = await Promise.all(
                        data.cast.map(async (tv: TMDBTvCast) => {
                            /* TV 상세 */
                            const tvRes = await fetch(
                                `https://api.themoviedb.org/3/tv/${tv.id}?api_key=${API_KEY}&language=ko-KR`
                            );
                            const tvData = await tvRes.json();

                            /* 등급 */
                            const ratingRes = await fetch(
                                `https://api.themoviedb.org/3/tv/${tv.id}/content_ratings?api_key=${API_KEY}`
                            );
                            const ratingData = await ratingRes.json();
                            const kr = ratingData.results?.find(
                                (r: { iso_3166_1: string }) => r.iso_3166_1 === 'KR'
                            );
                            const certification = kr?.rating || 'NR';

                            /* 비디오 */
                            const videoRes = await fetch(
                                `https://api.themoviedb.org/3/tv/${tv.id}/videos?api_key=${API_KEY}&language=ko-KR`
                            );
                            const videoData = await videoRes.json();
                            const videos: Video[] = videoData.results || [];

                            /* 크레딧 */
                            const creditRes = await fetch(
                                `https://api.themoviedb.org/3/tv/${tv.id}/credits?api_key=${API_KEY}&language=ko-KR`
                            );
                            const creditData = await creditRes.json();

                            const director: CreditPerson[] =
                                creditData.crew?.filter(
                                    (c: CreditPerson) => c.known_for_department === 'Directing'
                                ) || [];

                            const writer: CreditPerson[] =
                                creditData.crew?.filter(
                                    (c: CreditPerson) => c.known_for_department === 'Writing'
                                ) || [];

                            /* 에피소드 (시즌1) */
                            const epRes = await fetch(
                                `https://api.themoviedb.org/3/tv/${tv.id}/season/1?api_key=${API_KEY}&language=ko-KR`
                            );
                            const epData = await epRes.json();
                            const episodes: Episodes[] = epData.episodes || [];

                            return {
                                id: tv.id,
                                name: tv.name,
                                character: tv.character,
                                poster_path: tv.poster_path,
                                certification,
                                videos,
                                creditData,
                                director,
                                writer,
                                episodes,
                                runtime: tvData.episode_run_time?.[0] ?? null,
                                logo: null,
                            };
                        })
                    );

                    return {
                        id: data.id,
                        name: data.name,
                        profile_path: data.profile_path,
                        cast: castWithExtra,
                    };
                })
            );

            set({ people: results });
        } catch (error) {
            console.error('배우 데이터 로딩 실패', error);
        }
    },

    setSelectedPeople: (id: number) =>
        set((state) => {
            for (const person of state.people) {
                const found = person.cast.find((c) => c.id === id);
                if (found) return { selectedPeople: found };
            }
            return { selectedPeople: null };
        }),
}));
