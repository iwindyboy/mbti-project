import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdMob } from '@capacitor-community/admob';
import { showBanner } from './utils/adMobService';
import { getOrCreateUserId } from './utils/uuid';
import { LandingPage } from './pages/LandingPage';
import { QuestionPage } from './pages/QuestionPage';
import { ResultPageWrapper } from './pages/ResultPageWrapper';
import ResultPage from './pages/result';
import { TypeDetailPage } from './pages/TypeDetailPage';
import { IntroPage } from './pages/IntroPage';
import { DatingPage } from './pages/DatingPage';
import { DatingIntroPage } from './pages/DatingIntroPage';
import { DatingMyTypePage } from './pages/DatingMyTypePage';
import { DatingResultPage } from './pages/DatingResultPage';
import { CareerPage } from './pages/CareerPage';
import { PersonaPage } from './pages/PersonaPage';
import { SharePage } from './pages/SharePage';
import { HistoryPage } from './pages/HistoryPage';
import { LanguagePage } from './pages/LanguagePage';
import { MyResultsPage } from './pages/MyResultsPage';
import { FortunePage } from './pages/FortunePage';
import { FortuneResultPage } from './pages/FortuneResultPage';
import { FortuneReportPage } from './pages/FortuneReportPage';
import { ScanResultPage } from './pages/ScanResultPage';
import { IntegratedResultPage } from './pages/IntegratedResultPage';
import { IntegratedReportPage } from './pages/IntegratedReportPage';
import { PremiumCoachingPage } from './pages/PremiumCoachingPage';
import { SpectrumIntroPage } from './pages/SpectrumIntroPage';
import { SajuIntroPage } from './pages/SajuIntroPage';
import { SideMenu } from './components/SideMenu';
import { HamburgerMenu } from './components/HamburgerMenu';
import { ComingSoonPage } from './pages/ComingSoonPage';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 앱 시작 시 UUID 및 AdMob 초기화
  useEffect(() => {
    getOrCreateUserId();

    const initAds = async () => {
      await AdMob.initialize({
        testingDevices: ['EMULATOR'],
        initializeForTesting: true,
      });
      // 배너 광고 표시
      await showBanner();
    };

    void initAds();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <BrowserRouter>
      {/* 배너에 가려지지 않도록 전체 레이아웃에 하단 패딩 추가 */}
      <div style={{ paddingBottom: '60px' }}>
        <HamburgerMenu onClick={toggleMenu} />
        <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
        <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/spectrum-intro" element={<SpectrumIntroPage />} />
          <Route path="/saju-intro" element={<SajuIntroPage />} />
          <Route path="/survey" element={<QuestionPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/result-old" element={<ResultPageWrapper />} />
          <Route path="/type/:typeCode" element={<TypeDetailPage />} />
          <Route path="/dating" element={<DatingPage />} />
          <Route path="/dating/intro" element={<DatingIntroPage />} />
          <Route path="/dating/my-type" element={<DatingMyTypePage />} />
          <Route path="/dating/result" element={<DatingResultPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/persona" element={<PersonaPage />} />
          <Route path="/share" element={<SharePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/language" element={<LanguagePage />} />
          <Route path="/my-results" element={<MyResultsPage />} />
          <Route path="/fortune" element={<FortunePage />} />
          <Route path="/fortune-result" element={<FortuneResultPage />} />
          <Route path="/fortune-report" element={<FortuneReportPage />} />
          <Route path="/scan-result" element={<ScanResultPage />} />
          <Route path="/integrated-result" element={<IntegratedResultPage />} />
          <Route path="/integrated-report" element={<IntegratedReportPage />} />
          <Route path="/ai-coaching" element={<PremiumCoachingPage />} />
          <Route path="/coming-soon/love/:slug" element={<ComingSoonPage />} />
          <Route path="/integrated-result-card" element={<Navigate to="/integrated-report" replace />} />
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
