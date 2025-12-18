// // 최근검색어(로컬 저장용)
// export interface Search{
//   id: number;
//   text: string;
// }

// // 영화 검색 결과
// export interface TmdbMovie {
//   id: number;
//   title: string;
//   overview?: string;
//   poster_path?: string | null;
//   backdrop_path?: string | null;
//   release_date?: string;
// }

// export interface TmdbMovieResponse {
//   page: number;
//   results: TmdbMovie[];
//   total_pages: number;
//   total_results: number;
// }

// // 컬렉션 검색 결과(시리즈 묶음)
// export interface TmdbCollection {
//   id: number;
//   name: string;
//   overview?: string;
//   poster_path?: string | null;
//   backdrop_path?: string | null;
// }

// export interface TmdbCollectionResponse {
//   page: number;
//   results: TmdbCollection[];
//   total_pages: number;
//   total_results: number;
// }

// // 인물(배우/감독) 검색 결과
// export interface TmdbPerson {
//   id: number;
//   name: string;
//   profile_path?: string | null;
//   known_for_department?: string; // Acting, Directing 등
// }

// export interface TmdbPersonResponse {
//   page: number;
//   results: TmdbPerson[];
//   total_pages: number;
//   total_results: number;
// }

// // 오버레이 화면에 뿌릴 “통합 결과” 타입 (label로 통일)
// export type SearchKind = "movie" | "collection" | "person";

// // export interface SearchResultItem {
// //   id: number;
// //   kind: SearchKind;
// //   label: string; // 화면에 보여줄 제목/이름
// //   overview?: string;
// //   poster_path?: string | null;
// //   backdrop_path?: string | null;
// //   profile_path?: string | null; // person용
// // }

// export type SearchResultItem =
//   | {
//       id: number;
//       kind: "movie";
//       label: string;
//       overview?: string;
//       poster_path: string | null;
//       backdrop_path: string | null;
//     }
//   | {
//       id: number;
//       kind: "collection";
//       label: string;
//       overview?: string;
//       poster_path: string | null;
//       backdrop_path: string | null;
//     }
//   | {
//       id: number;
//       kind: "person";
//       label: string;
//       profile_path: string | null;
//     };

// // TMDB Trending (movie / tv 공통)
// export interface TmdbTrendingMovie {
//   id: number;
//   media_type: "movie";
//   title: string;
// }

// export interface TmdbTrendingTv {
//   id: number;
//   media_type: "tv";
//   name: string;
// }

// export interface TmdbTrendingPerson {
//   id: number;
//   media_type: "person";
//   name: string;
// }

// export type TmdbTrendingItem = TmdbTrendingMovie | TmdbTrendingTv | TmdbTrendingPerson;

// export interface TmdbTrendingResponse {
//   page: number;
//   results: TmdbTrendingItem[];
//   total_pages: number;
//   total_results: number;
// }

// // zustand 타입(최근검색어)
// export interface SearchText {
//   todos: Search[];
//   onAddTextTodo: (text: string) => void;
//   onRemoveTodos: (id: number) => void;
//   onRemoveAll: () => void;
// }

// 최근검색어(로컬 저장용)
export interface Search {
  id: number;
  text: string;
}

// TMDB 공통 응답
export interface TmdbListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/** search/multi 아이템(핵심 필드만) */
export type TmdbMultiItem =
  | {
      media_type: "movie";
      id: number;
      title: string;
      overview?: string;
      poster_path?: string | null;
      backdrop_path?: string | null;
      release_date?: string;
    }
  | {
      media_type: "tv";
      id: number;
      name: string;
      overview?: string;
      poster_path?: string | null;
      backdrop_path?: string | null;
      first_air_date?: string;
    }
  | {
      media_type: "person";
      id: number;
      name: string;
      profile_path?: string | null;
      known_for_department?: string;
    };

export type TmdbMultiResponse = TmdbListResponse<TmdbMultiItem>;

/** 오버레이에 뿌릴 통합 kind */
export type SearchKind = "movie" | "tv" | "person" | "collection"; // collection은 multi에선 안 옴(확장 대비)

/** 오버레이에 뿌릴 통합 결과 */
export type SearchResultItem =
  | {
      id: number;
      kind: "movie";
      label: string; // title
      overview?: string;
      poster_path: string | null;
      backdrop_path: string | null;
    }
  | {
      id: number;
      kind: "tv";
      label: string; // name
      overview?: string;
      poster_path: string | null;
      backdrop_path: string | null;
    }
  | {
      id: number;
      kind: "person";
      label: string; // name
      profile_path: string | null;
    }
  | {
      id: number;
      kind: "collection";
      label: string;
      overview?: string;
      poster_path: string | null;
      backdrop_path: string | null;
    };

/** Trending */
export interface TmdbTrendingMovie {
  id: number;
  media_type: "movie";
  title: string;
}
export interface TmdbTrendingTv {
  id: number;
  media_type: "tv";
  name: string;
}
export interface TmdbTrendingPerson {
  id: number;
  media_type: "person";
  name: string;
}
export type TmdbTrendingItem =
  | TmdbTrendingMovie
  | TmdbTrendingTv
  | TmdbTrendingPerson;
export type TmdbTrendingResponse = TmdbListResponse<TmdbTrendingItem>;

/** zustand 타입(최근검색어) */
export interface SearchText {
  todos: Search[];
  onAddTextTodo: (text: string) => void;
  onRemoveTodos: (id: number) => void;
  onRemoveAll: () => void;
}

/** zustand store 전체 타입 */
export interface SearchState extends SearchText {
  results: SearchResultItem[];
  loading: boolean;

  onFetchSearch: (query: string, maxPages?: number) => Promise<void>;
  onClearResults: () => void;

  trendingKeywords: string[];
  onFetchTrendingKeywords: () => Promise<void>;

  fetchSearchAndGetFirst: (
    query: string,
    maxPages?: number
  ) => Promise<SearchResultItem | null>;
}
