import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import './style/common-button.scss';
// 1. 공통 컴포넌트 및 로딩바
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import { BendNotice } from './components/BendNotice';
import SideMenu from './components/SideMenu';
import SearchOverlay from './components/SearchOverlay';

// 2. Zustand Stores
import { useAuthStore } from './stores/useAuthStore';
import { usePickStore } from './stores/usePickStore';
import BottomMenu from './components/BottomMenu';

// 3. 페이지 컴포넌트 Lazy Loading
// 초기 진입 시 필요한 페이지 일반 import
import Intro from './pages/Intro';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChoiceChar from './pages/ChoiceChar';
// 나머지 Lazy Loading
const Home = lazy(() => import('./pages/Home'));
const Common = lazy(() => import('./pages/Common'));
const Profile = lazy(() => import('./pages/Profile'));
const Entertainment = lazy(() => import('./pages/Entertainment'));
const Drama = lazy(() => import('./pages/Drama'));
const Movie = lazy(() => import('./pages/Movie'));
const OverseasSeries = lazy(() => import('./pages/OverseasSeries'));
const CurrentAffairs = lazy(() => import('./pages/CurrentAffairs'));
const Animation = lazy(() => import('./pages/Animation'));
const Kids = lazy(() => import('./pages/Kids'));
const Recap = lazy(() => import('./pages/Recap'));
const Mbc = lazy(() => import('./pages/Mbc'));
const Kbs = lazy(() => import('./pages/Kbs'));
const CJenm = lazy(() => import('./pages/Cjenm'));
const JTBC = lazy(() => import('./pages/Jtbc'));
const Welcome = lazy(() => import('./pages/Welcome'));
const ContentsDetail = lazy(() => import('./pages/ContentsDetail'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const MovieDetailEX = lazy(() => import('./pages/MovieDetailEX'));
const Player = lazy(() => import('./pages/Player'));
const Ticket = lazy(() => import('./pages/Ticket'));
const Payment = lazy(() => import('./pages/Payment'));
const PaymentFinish = lazy(() => import('./pages/PaymentFinish'));
const ServiceCenter = lazy(() => import('./pages/ServiceCenter'));
const Event = lazy(() => import('./pages/Event'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const EventGroup = lazy(() => import('./pages/EventGroup'));
const UserQna = lazy(() => import('./pages/UserQna'));
const Agreement = lazy(() => import('./pages/Agreement'));
const NoticeA = lazy(() => import('./pages/NoticeA'));
const NoticeAdetail = lazy(() => import('./pages/NoticeAdetail'));

// ---------------------------------------------------------
// 로그인 인증 가드 컴포넌트
// ---------------------------------------------------------
const ProtectedRoute = () => {
    const user = useAuthStore((state) => state.user);
    const isInitializing = useAuthStore((state) => state.isInitializing);

    if (isInitializing) return null; // 초기화 중에는 아무것도 렌더링하지 않음
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
    const location = useLocation();
    const currentPath = location.pathname.toLowerCase();

    const user = useAuthStore((state) => state.user);
    const selectedCharId = useAuthStore((state) => state.selectedCharId);
    const onFetchPick = usePickStore((state) => state.onFetchPick);

    useEffect(() => {
        if (user && selectedCharId) {
            onFetchPick();
        }
    }, [user, selectedCharId, onFetchPick]);

    const hideLayoutPaths = ['/', '/login', '/signup', '/choice-char'];
    const isHideLayout = hideLayoutPaths.includes(currentPath);

    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <Suspense fallback={null}>
            {!isHideLayout && (
                <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
            )}
            {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}

            {!isHideLayout && (
                <>
                    <ScrollTop />
                    <Header />
                </>
            )}

            <Routes>
                {/* 누구나 접근 가능한 페이지 */}
                <Route path="/" element={<Intro />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* 로그인한 사용자만 접근 가능한 보호된 경로 */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/choice-char" element={<ChoiceChar />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/entertainment" element={<Entertainment />} />
                    <Route path="/drama" element={<Drama />} />
                    <Route path="/movie" element={<Movie />} />
                    <Route path="/overseasSeries" element={<OverseasSeries />} />
                    <Route path="/currentAffairs" element={<CurrentAffairs />} />
                    <Route path="/animation" element={<Animation />} />
                    <Route path="/kids" element={<Kids />} />
                    <Route path="/recap" element={<Recap />} />
                    <Route path="/mbc" element={<Mbc />} />
                    <Route path="/kbs" element={<Kbs />} />
                    <Route path="/cjenm" element={<CJenm />} />
                    <Route path="/jtbc" element={<JTBC />} />
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/profile" element={<Profile />} />

                    <Route path="/contentsdetail/:type/:id" element={<ContentsDetail />} />
                    <Route path="/moviedetail/:type/:id" element={<MovieDetail />} />
                    <Route path="/moviedetailEX/:type/:id" element={<MovieDetailEX />} />
                    <Route path="/player/:videoKey" element={<Player />} />

                    <Route path="/ticket" element={<Ticket />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/payment-finish" element={<PaymentFinish />} />

                    <Route path="/service-center" element={<ServiceCenter />}>
                        <Route index element={<NoticeA />} />
                        <Route path="notice" element={<NoticeA />} />
                        <Route path="notice/:noticeId" element={<NoticeAdetail />} />
                        <Route path="userQna" element={<UserQna />} />
                        <Route path="agreement" element={<Agreement />} />
                    </Route>

                    <Route path="/event-group" element={<EventGroup />}>
                        <Route index element={<Event />} />
                        <Route path="event" element={<Event />} />
                        <Route path="event/:eventId" element={<EventDetail />} />
                    </Route>

                    <Route path="/common" element={<Common />} />
                </Route>
            </Routes>

            {!isHideLayout && (
                <>
                    <BendNotice />
                    <Footer />
                    <BottomMenu
                        onOpenCategory={() => setIsSideMenuOpen(true)}
                        onOpenSearch={() => setIsSearchOpen(true)}
                    />
                </>
            )}
        </Suspense>
    );
}

export default App;
