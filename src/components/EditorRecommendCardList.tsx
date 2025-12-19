import EditorRecommendCard from "./EditorRecommendCard";
import type { MovieWithLogo } from "../types/movie";
import Marquee from "react-fast-marquee";
import "./scss/EditorRecommend.scss";

interface Props {
  title: string | null;
  list: MovieWithLogo[];
}

const EditorRecommendCardList = ({ title, list }: Props) => {
  return (
    <section className="rec-section">
      <h2 className="font-wave">{title}</h2>
      <div className="swiper-top">
        <Marquee direction="right" speed={60} pauseOnHover={true}>
          {list.map((l) => (
            <div key={l.id} className="marquee-item">
              <EditorRecommendCard
                backposter={l.backdrop_path ?? ""}
                id={l.id}
                title={l.logo ?? null}
              />
            </div>
          ))}
        </Marquee>
      </div>
      <div className="swiper-bot">
        <Marquee speed={60} pauseOnHover={true}>
          {list.map((l) => (
            <div key={l.id} className="marquee-item">
              <EditorRecommendCard
                backposter={l.backdrop_path ?? ""}
                id={l.id}
                title={l.logo ?? null}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default EditorRecommendCardList;
