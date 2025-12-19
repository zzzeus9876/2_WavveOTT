import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './scss/Player.scss';

const Player = () => {
    const { videoKey } = useParams();

    const navigate = useNavigate();

    const iframeRef = useRef<HTMLIFrameElement>(null);

    return (
        <div className="player-page">
            <button className="btn default primary" onClick={() => navigate(-1)}>
                <img src="/images/button/btn-close.svg" alt="back" />
                <span>뒤로가기</span>
            </button>
            <div className="player-container">
                <iframe
                    ref={iframeRef}
                    src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=1&rel=0&playsinline=1`}
                    allowFullScreen={true}
                    title="youtube-player"
                />
            </div>
        </div>
    );
};

export default Player;
