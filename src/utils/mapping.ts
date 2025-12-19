import { GENRE_MAP } from '../constants/genre';
import { GRADE_MAP } from '../constants/grade';

// 시청연령등급 문자열로 통일 후 맵핑
export const getGrades = (cert?: string | number) => {
    return GRADE_MAP[String(cert)] ?? '/images/15.svg';
};

// 장르 이름으로 반환 후 맵핑
// export const getGenres = (genre?: number[]) => {
//     if (!genre) return [];

//     return genre.map((id) => GENRE_MAP[id]).filter(Boolean);
// };

// 배우 추가
type GenreInput =
    | number[]
    | { genre_ids?: number[] }
    | { cast?: Array<{ genre_ids?: number[] }> }
    | undefined;

export const getGenres = (genre: GenreInput) => {
    if (!genre) return [];

    // 일반 숫자 배열
    if (Array.isArray(genre)) {
        return genre.map((id) => GENRE_MAP[id]).filter(Boolean);
    }

    // 일반 객체 (genre_ids 직접 포함)
    if ('genre_ids' in genre && Array.isArray(genre.genre_ids)) {
        return genre.genre_ids.map((id) => GENRE_MAP[id]).filter(Boolean);
    }

    // 배우 객체 (cast 안에 genre_ids)
    if ('cast' in genre && Array.isArray(genre.cast) && genre.cast[0]?.genre_ids) {
        return genre.cast[0].genre_ids.map((id) => GENRE_MAP[id]).filter(Boolean);
    }

    return [];
};
