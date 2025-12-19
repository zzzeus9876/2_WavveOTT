import React, { useRef, useEffect } from 'react';

const AnimationVisual: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        // 1. 몽환적인 유리 레이어 (주석 버전 복구)
        const shapes = Array.from({ length: 8 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            width: Math.random() * 150 + 80,
            height: 700,
            speed: Math.random() * 0.15 + 0.05,
        }));

        const resize = () => {
            if (containerRef.current) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            shapes.forEach((shape) => {
                ctx.save();
                ctx.translate((shape.x * canvas.width) / 100, (shape.y * canvas.height) / 100);
                ctx.rotate(-Math.PI / 4);

                ctx.beginPath();
                ctx.roundRect(0, 0, shape.width, shape.height, 100);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
                ctx.fill();
                ctx.restore();

                shape.y -= shape.speed;
                if (shape.y < -80) shape.y = 120;
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '843px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #28E7C5 0%, #A3E04E 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* 배경 캔버스 */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                }}
            />

            {/* 캐릭터 레이어 - 양 끝에 딱 붙임 */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    zIndex: 2,
                }}
            >
                {/* 왼쪽 캐릭터: 왼쪽 끝에 밀착 + 하단 여유 */}
                <div
                    style={{
                        height: '90%',
                        position: 'relative',
                        left: '0',
                        bottom: '-30px', // 짤린 바닥면 숨김
                        animation:
                            'slideInLeft 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards, idleSway 4s ease-in-out infinite 1.3s',
                    }}
                >
                    <img
                        src="/images/bg-animation-left.svg"
                        style={{ height: '100%', width: 'auto', display: 'block' }}
                        alt="left"
                    />
                </div>

                {/* 오른쪽 캐릭터: 오른쪽 끝에 밀착 + 하단 여유 */}
                <div
                    style={{
                        height: '90%',
                        position: 'relative',
                        right: '0',
                        bottom: '-30px',
                        animation:
                            'slideInRight 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards, idleSway 4.5s ease-in-out infinite reverse 1.3s',
                    }}
                >
                    <img
                        src="/images/bg-animation-right.svg"
                        style={{ height: '100%', width: 'auto', display: 'block' }}
                        alt="right"
                    />
                </div>
            </div>

            {/* 중앙 타이포그래피 */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 3,
                    textAlign: 'center',
                    color: '#fff',
                }}
            >
                <h2
                    style={{
                        fontSize: '120px',
                        fontWeight: 900,
                        margin: 0,
                        letterSpacing: '-0.05em',
                        animation: 'textFocus 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
                        textShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    }}
                >
                    애니메이션
                </h2>
                <p
                    style={{
                        fontSize: '24px',
                        opacity: 0,
                        marginTop: '10px',
                        fontWeight: 300,
                        animation: 'fadeInUp 0.8s ease-out forwards 1.2s',
                    }}
                >
                    아이부터 어른까지, 모두의 애니메이션
                </p>
            </div>

            <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-150px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(150px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes idleSway {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes textFocus {
          0% { filter: blur(15px); opacity: 0; transform: scale(1.1); }
          100% { filter: blur(0); opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 0.9; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default AnimationVisual;

// import React, { useRef, useEffect } from 'react';

// const AnimationVisual: React.FC = () => {
//     const canvasRef = useRef<HTMLCanvasElement | null>(null);
//     const containerRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;
//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;

//         let animationFrameId: number;

//         // 1. 주석 처리되었던 그 몽환적인 알약/유리 레이어 객체들
//         const shapes = Array.from({ length: 8 }, () => ({
//             x: Math.random() * 100, // % 단위
//             y: Math.random() * 100,
//             width: Math.random() * 150 + 80, // 너비 살짝 조정 (더 세련되게)
//             height: 700, // 길게 쭉 뺌
//             speed: Math.random() * 0.15 + 0.05, // 몽환적으로 아주 천천히
//         }));

//         const resize = () => {
//             if (containerRef.current) {
//                 canvas.width = containerRef.current.clientWidth;
//                 canvas.height = containerRef.current.clientHeight;
//             }
//         };

//         const draw = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);

//             // 배경의 반투명 타원들 (요청하신 그 느낌 그대로)
//             shapes.forEach((shape) => {
//                 ctx.save();
//                 ctx.translate((shape.x * canvas.width) / 100, (shape.y * canvas.height) / 100);
//                 ctx.rotate(-Math.PI / 4); // 45도 회전

//                 ctx.beginPath();
//                 ctx.roundRect(0, 0, shape.width, shape.height, 100);
//                 ctx.fillStyle = 'rgba(255, 255, 255, 0.07)'; // 은은한 불투명도
//                 ctx.fill();
//                 ctx.restore();

//                 // 위로 서서히 이동
//                 shape.y -= shape.speed;
//                 if (shape.y < -80) shape.y = 120;
//             });

//             animationFrameId = requestAnimationFrame(draw);
//         };

//         window.addEventListener('resize', resize);
//         resize();
//         draw();

//         return () => {
//             window.removeEventListener('resize', resize);
//             cancelAnimationFrame(animationFrameId);
//         };
//     }, []);

//     return (
//         <div
//             ref={containerRef}
//             style={{
//                 position: 'relative',
//                 width: '100%',
//                 height: '843px', // 원본 높이 고정
//                 overflow: 'hidden',
//                 background: 'linear-gradient(135deg, #28E7C5 0%, #A3E04E 100%)', // 요청하신 색감
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//             }}
//         >
//             {/* 1. 배경 캔버스 (유리 레이어 무빙) */}
//             <canvas
//                 ref={canvasRef}
//                 style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     width: '100%',
//                     height: '100%',
//                     pointerEvents: 'none',
//                 }}
//             />

//             {/* 2. 캐릭터 레이어 (하단 짤림 방지를 위해 위치 조정) */}
//             <div
//                 style={{
//                     position: 'absolute',
//                     inset: 0,
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'flex-end', // 바닥에 붙임
//                     zIndex: 2,
//                     padding: '0 20px',
//                 }}
//             >
//                 {/* 왼쪽 캐릭터 (나루토/사스케) - 아래로 살짝 내림 (bottom 조정) */}
//                 <div
//                     style={{
//                         height: '92%', // 살짝 작게 조절해서 여유 공간 확보
//                         position: 'relative',
//                         bottom: '-20px', // 짤린 부분이 화면 밖으로 나가도록 살짝 내림
//                         animation:
//                             'slideInLeft 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards, idleSway 4s ease-in-out infinite 1.3s',
//                     }}
//                 >
//                     <img
//                         src="/images/bg-animation-left.svg"
//                         style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
//                         alt="left"
//                     />
//                 </div>

//                 {/* 오른쪽 캐릭터 (원펀맨) */}
//                 <div
//                     style={{
//                         height: '92%',
//                         position: 'relative',
//                         bottom: '-20px',
//                         animation:
//                             'slideInRight 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards, idleSway 4.5s ease-in-out infinite reverse 1.3s',
//                     }}
//                 >
//                     <img
//                         src="/images/bg-animation-right.svg"
//                         style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
//                         alt="right"
//                     />
//                 </div>
//             </div>

//             {/* 3. 중앙 타이포그래피 (세련된 초점 효과) */}
//             <div
//                 style={{
//                     position: 'relative',
//                     zIndex: 3,
//                     textAlign: 'center',
//                     color: '#fff',
//                 }}
//             >
//                 <h2
//                     style={{
//                         fontSize: '120px',
//                         fontWeight: 900,
//                         margin: 0,
//                         letterSpacing: '-0.05em',
//                         animation: 'textFocus 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
//                         textShadow: '0 10px 40px rgba(0,0,0,0.15)',
//                     }}
//                 >
//                     애니메이션
//                 </h2>
//                 <p
//                     style={{
//                         fontSize: '24px',
//                         opacity: 0,
//                         marginTop: '10px',
//                         fontWeight: 300,
//                         animation: 'fadeInUp 0.8s ease-out forwards 1.2s',
//                     }}
//                 >
//                     아이부터 어른까지, 모두의 애니메이션
//                 </p>
//             </div>

//             {/* Vite 환경용 인라인 스타일 정의 */}
//             <style>{`
//         @keyframes slideInLeft {
//           from { opacity: 0; transform: translateX(-120px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes slideInRight {
//           from { opacity: 0; transform: translateX(120px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         /* 등장 후 숨쉬는 듯한 미세 흔들림 */
//         @keyframes idleSway {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-15px); }
//         }
//         /* 몽환적인 텍스트 등장 (블러 효과) */
//         @keyframes textFocus {
//           0% { filter: blur(15px); opacity: 0; transform: scale(1.1); }
//           100% { filter: blur(0); opacity: 1; transform: scale(1); }
//         }
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 0.9; transform: translateY(0); }
//         }
//       `}</style>
//         </div>
//     );
// };

// export default AnimationVisual;

// import React, { useRef, useEffect } from 'react';

// const AnimationVisual: React.FC = () => {
//     const canvasRef = useRef<HTMLCanvasElement | null>(null);
//     const containerRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;
//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;

//         let animationFrameId: number;

//         // 1. 더 얇고 몽환적인 유리 레이어 설정
//         const shapes = Array.from({ length: 10 }, () => ({
//             x: Math.random() * 100,
//             y: Math.random() * 100,
//             width: Math.random() * 80 + 40, // 더 얇게 수정
//             height: Math.random() * 400 + 300, // 길게 쭉 뺌
//             speed: Math.random() * 0.15 + 0.05, // 아주 천천히 움직여서 몽환적으로
//             opacity: Math.random() * 0.1 + 0.05, // 은은하게
//         }));

//         const resize = () => {
//             if (containerRef.current) {
//                 canvas.width = containerRef.current.clientWidth;
//                 canvas.height = containerRef.current.clientHeight;
//             }
//         };

//         const draw = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);

//             shapes.forEach((shape) => {
//                 ctx.save();
//                 ctx.translate((shape.x * canvas.width) / 100, (shape.y * canvas.height) / 100);
//                 ctx.rotate(-Math.PI / 4); // 45도 기울기 고정

//                 // 2. 색감이랑 어우러지는 그라데이션 유리 효과
//                 const gradient = ctx.createLinearGradient(0, 0, shape.width, 0);
//                 gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
//                 gradient.addColorStop(0.5, `rgba(255, 255, 255, ${shape.opacity})`);
//                 gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

//                 ctx.beginPath();
//                 ctx.roundRect(0, 0, shape.width, shape.height, 100);
//                 ctx.fillStyle = gradient;
//                 ctx.fill();
//                 ctx.restore();

//                 shape.y -= shape.speed;
//                 if (shape.y < -50) shape.y = 120;
//             });

//             animationFrameId = requestAnimationFrame(draw);
//         };

//         window.addEventListener('resize', resize);
//         resize();
//         draw();

//         return () => {
//             window.removeEventListener('resize', resize);
//             cancelAnimationFrame(animationFrameId);
//         };
//     }, []);

//     return (
//         <div
//             ref={containerRef}
//             style={{
//                 position: 'relative',
//                 width: '100%',
//                 height: '843px', // 요청한 원본 높이 고정
//                 overflow: 'hidden',
//                 background: 'linear-gradient(135deg, #28E7C5 0%, #A3E04E 100%)', // 이미지 색감 추출
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//             }}
//         >
//             {/* 배경 캔버스 */}
//             <canvas
//                 ref={canvasRef}
//                 style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     width: '100%',
//                     height: '100%',
//                     pointerEvents: 'none',
//                 }}
//             />

//             {/* 캐릭터 레이어 */}
//             <div
//                 style={{
//                     position: 'absolute',
//                     inset: 0,
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'flex-end',
//                     zIndex: 2,
//                     padding: '0 20px',
//                 }}
//             >
//                 {/* 왼쪽: 나루토/사스케 - 등장 후 미세 흔들림(Idle) 애니메이션 추가 */}
//                 <div
//                     style={{
//                         height: '95%',
//                         animation:
//                             'slideInLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards, idleSway 4s ease-in-out infinite 1.2s',
//                     }}
//                 >
//                     <img
//                         src="/images/bg-animation-left.svg"
//                         style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
//                         alt="left"
//                     />
//                 </div>

//                 {/* 오른쪽: 원펀맨 - 등장 후 미세 흔들림(Idle) 애니메이션 추가 */}
//                 <div
//                     style={{
//                         height: '95%',
//                         animation:
//                             'slideInRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards, idleSway 4.5s ease-in-out infinite reverse 1.2s',
//                     }}
//                 >
//                     <img
//                         src="/images/bg-animation-right.svg"
//                         style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
//                         alt="right"
//                     />
//                 </div>
//             </div>

//             {/* 텍스트 컨텐츠 */}
//             <div
//                 style={{
//                     position: 'relative',
//                     zIndex: 3,
//                     textAlign: 'center',
//                     color: '#fff',
//                 }}
//             >
//                 <h2
//                     style={{
//                         fontSize: '120px',
//                         fontWeight: 900,
//                         margin: 0,
//                         letterSpacing: '-0.05em',
//                         animation: 'textFocus 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
//                         textShadow: '0 10px 40px rgba(0,0,0,0.15)',
//                     }}
//                 >
//                     애니메이션
//                 </h2>
//                 <p
//                     style={{
//                         fontSize: '24px',
//                         opacity: 0,
//                         marginTop: '10px',
//                         fontWeight: 300,
//                         animation: 'fadeInUp 0.8s ease-out forwards 1s',
//                     }}
//                 >
//                     아이부터 어른까지, 모두의 애니메이션
//                 </p>
//             </div>

//             <style>{`
//         @keyframes slideInLeft {
//           from { opacity: 0; transform: translateX(-100px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes slideInRight {
//           from { opacity: 0; transform: translateX(100px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         /* 들어온 뒤에 숨쉬듯 미세하게 흔들리는 효과 */
//         @keyframes idleSway {
//           0%, 100% { transform: translateY(0) rotate(0deg); }
//           50% { transform: translateY(-10px) rotate(0.5deg); }
//         }
//         @keyframes textFocus {
//           0% { filter: blur(12px); opacity: 0; transform: scale(1.1); }
//           100% { filter: blur(0); opacity: 1; transform: scale(1); }
//         }
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 0.8; transform: translateY(0); }
//         }
//       `}</style>
//         </div>
//     );
// };

// export default AnimationVisual;

// import React, { useRef, useEffect } from 'react';

// const AnimationVisual: React.FC = () => {
//     const canvasRef = useRef<HTMLCanvasElement | null>(null);
//     const containerRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;
//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;

//         let animationFrameId: number;

//         // 배경의 불투명한 타원(거울 효과) 객체들
//         const shapes = Array.from({ length: 8 }, () => ({
//             x: Math.random() * 100, // % 단위
//             y: Math.random() * 100,
//             width: Math.random() * 200 + 100,
//             speed: Math.random() * 0.2 + 0.1,
//         }));

//         const resize = () => {
//             if (containerRef.current) {
//                 canvas.width = containerRef.current.clientWidth;
//                 canvas.height = containerRef.current.clientHeight;
//             }
//         };

//         const draw = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);

//             // 배경의 반투명 타원들 그리기 (원본 이미지의 불투명 효과 재현)
//             shapes.forEach((shape) => {
//                 ctx.save();
//                 ctx.translate((shape.x * canvas.width) / 100, (shape.y * canvas.height) / 100);
//                 ctx.rotate(-Math.PI / 4); // 45도 회전

//                 ctx.beginPath();
//                 ctx.roundRect(0, 0, shape.width, 600, 100); // 알약 모양
//                 ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
//                 ctx.fill();
//                 ctx.restore();

//                 // 위로 서서히 이동하는 애니메이션
//                 shape.y -= shape.speed;
//                 if (shape.y < -50) shape.y = 120; // 화면 밖으로 나가면 아래에서 재등장
//             });

//             animationFrameId = requestAnimationFrame(draw);
//         };

//         window.addEventListener('resize', resize);
//         resize();
//         draw();

//         return () => {
//             window.removeEventListener('resize', resize);
//             cancelAnimationFrame(animationFrameId);
//         };
//     }, []);

//     return (
//         <div
//             ref={containerRef}
//             style={{
//                 position: 'relative',
//                 width: '100%',
//                 height: '843px', // 이미지 원본 높이에 맞춤
//                 overflow: 'hidden',
//                 background: 'linear-gradient(135deg, #00D2FF 0%, #92FE9D 100%)', // 원본 톤의 그라데이션
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//             }}
//         >
//             {/* 1. 배경 애니메이션 (반투명 레이어 이동) */}
//             <canvas
//                 ref={canvasRef}
//                 style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     width: '100%',
//                     height: '100%',
//                     pointerEvents: 'none',
//                 }}
//             />

//             {/* 2. 캐릭터 레이어 (양 끝 배정) */}
//             <div
//                 style={{
//                     position: 'absolute',
//                     inset: 0,
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'flex-end',
//                     zIndex: 2,
//                 }}
//             >
//                 {/* 왼쪽: 나루토 & 사스케 (왼쪽에서 등장) */}
//                 <div
//                     style={{
//                         height: '100%',
//                         transform: 'translateX(-20%)', // 살짝 걸치게 시작
//                         animation: 'charSlideInLeft 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
//                     }}
//                 >
//                     <img
//                         src="/images/bg-animation-left.svg"
//                         alt=""
//                         style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
//                     />
//                 </div>

//                 {/* 오른쪽: 원펀맨 크루 (오른쪽에서 등장) */}
//                 <div
//                     style={{
//                         height: '100%',
//                         transform: 'translateX(20%)',
//                         animation: 'charSlideInRight 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
//                     }}
//                 >
//                     <img
//                         src="/images/bg-animation-right.svg"
//                         alt=""
//                         style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
//                     />
//                 </div>
//             </div>

//             {/* 3. 중앙 타이포그래피 */}
//             <div
//                 style={{
//                     position: 'relative',
//                     zIndex: 3,
//                     textAlign: 'center',
//                     color: '#fff',
//                 }}
//             >
//                 <h2
//                     style={{
//                         fontSize: '120px', // 크기 대폭 키움
//                         fontWeight: 900,
//                         margin: 0,
//                         letterSpacing: '-0.05em',
//                         animation: 'textReveal 1.2s ease-out both 0.5s',
//                         textShadow: '0 10px 30px rgba(0,0,0,0.15)',
//                     }}
//                 >
//                     애니메이션
//                 </h2>
//                 <p
//                     style={{
//                         fontSize: '24px',
//                         opacity: 0,
//                         marginTop: '20px',
//                         animation: 'fadeIn 1s ease-out forwards 1.2s',
//                     }}
//                 >
//                     아이부터 어른까지, 모두의 애니메이션
//                 </p>
//             </div>

//             <style>{`
//         @keyframes charSlideInLeft {
//           from { opacity: 0; transform: translateX(-150px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes charSlideInRight {
//           from { opacity: 0; transform: translateX(150px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes textReveal {
//           from { opacity: 0; transform: scale(0.9) translateY(30px); filter: blur(10px); }
//           to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
//         }
//         @keyframes fadeIn {
//           to { opacity: 0.8; }
//         }
//       `}</style>
//         </div>
//     );
// };

// export default AnimationVisual;
