import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from './lib/store';
import { AnimatePresence, motion } from 'motion/react';
import { Star } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Eager load LandingPage
import LandingView from './views/LandingView';

// Lazy load views
const MainMenuView = lazy(() => import('./views/MainMenuView'));
const HijaiyahView = lazy(() => import('./views/HijaiyahView'));
const DoaView = lazy(() => import('./views/DoaView'));
const SholatView = lazy(() => import('./views/SholatView'));
const ProfileView = lazy(() => import('./views/ProfileView'));

// Lazy load components
const KuisView = lazy(() => import('./components/KuisView').then(m => ({ default: m.KuisView })));
const HafalanView = lazy(() => import('./components/HafalanView').then(m => ({ default: m.HafalanView })));
const GameZoneView = lazy(() => import('./components/GameZoneView').then(m => ({ default: m.GameZoneView })));

// Animate wrapper for routing transitions
function AnimatedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}

function RouteWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isReady, currentUserUid, users } = useAppStore();

  useEffect(() => {
    if (currentUserUid && users[currentUserUid] && location.pathname !== '/') {
       const user = users[currentUserUid];
       if (user?.theme) {
         document.body.className = `theme-${user.theme}`;
       }
    }
  }, [currentUserUid, users, location]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Star className="text-blue-500 w-16 h-16" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Toaster position="top-center" />
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="flex-1 flex justify-center items-center"><Star className="text-blue-300 w-10 h-10 animate-spin" /></div>}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedRoute><LandingView /></AnimatedRoute>} />
            <Route path="/menu" element={<AnimatedRoute><MainMenuView /></AnimatedRoute>} />
            <Route path="/hijaiyah" element={<AnimatedRoute><HijaiyahView /></AnimatedRoute>} />
            <Route path="/doa" element={<AnimatedRoute><DoaView /></AnimatedRoute>} />
            <Route path="/sholat" element={<AnimatedRoute><SholatView /></AnimatedRoute>} />
            <Route path="/profile" element={<AnimatedRoute><ProfileView /></AnimatedRoute>} />
            <Route path="/kuis" element={<AnimatedRoute><KuisView /></AnimatedRoute>} />
            <Route path="/hafalan" element={<AnimatedRoute><HafalanView /></AnimatedRoute>} />
            <Route path="/gamezone" element={<AnimatedRoute><GameZoneView /></AnimatedRoute>} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const { initializeApp } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <BrowserRouter>
      <RouteWrapper />
    </BrowserRouter>
  );
}
