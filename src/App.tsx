import { Routes, Route } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAppStore } from './store/appStore';
import useMqtt from './hooks/useMqtt';

// Lazy pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Advice = lazy(() => import('./pages/Advice'));
const History = lazy(() => import('./pages/History'));
const Standards = lazy(() => import('./pages/Standards'));
const Market = lazy(() => import('./pages/Market'));
import SensorDisplay from './components/SensorDisplay';
const Settings = lazy(() => import('./pages/Settings'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function App() {
  // Mobile sidebar state
  const [mobileOpen, setMobileOpen] = useState(false);
  // ✅ lấy thêm fontSize
  const { activePage, setActivePage, fontSize } = useAppStore();
  // token is read inside ProtectedRoute; App itself doesn't need it here

  // ✅ tạo class thay đổi cỡ chữ toàn app
  const sizeClass =
    fontSize === 'xl'
      ? 'text-[16.5px] md:text-[17.5px]'
      : fontSize === 'lg'
      ? 'text-[15.5px] md:text-[16.5px]'
      : 'text-[14.5px] md:text-[15.5px]';

  // Prefetch frequently visited routes after mount (non-blocking)
  useEffect(() => {
    const timer = setTimeout(() => {
      import('./pages/History');
      import('./pages/Standards');
      import('./pages/Market');
      import('./pages/Settings');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Start MQTT (no-op if VITE_MQTT_URL is not provided)
  useMqtt();

  // ✅ xác định trang hiển thị
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'advice':
        return <Advice />;
      case 'history':
        return <History />;
      case 'standards':
        return <Standards />;
      case 'market':
        return <Market />;
      case 'settings':
        return <Settings />;
      case 'pricing':
        return <Pricing />;
      default:
        return <Dashboard />;
    }
  };
  // Keep a simple route-based protection: if there's no token, / routes redirect to /login

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-lg font-semibold text-slate-600">Đang tải...</div>}>
    <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/ping" element={<div className="p-8 text-lg font-bold">App mounted — ping OK</div>} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/*"
          element={(
            // ✅ áp dụng sizeClass cho toàn bộ giao diện
            <div
              className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex relative overflow-hidden ${sizeClass}`}
            >
              {/* Hiệu ứng nền */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50"></div>
              <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-gradient-to-r from-teal-200/15 to-emerald-200/15 rounded-full blur-3xl animate-bounce"></div>

              {/* Sidebar desktop */}
                <aside className="hidden md:block w-60 xl:w-64 fixed left-0 top-0 h-full z-30 shadow-2xl overflow-y-auto sidebar-root">
                <Sidebar activePage={activePage} onNavigate={setActivePage} />
              </aside>

              {/* Sidebar mobile (drawer) */}
              {mobileOpen && (
                <div
                  className="fixed inset-0 bg-black/40 z-40 md:hidden"
                  onClick={() => setMobileOpen(false)}
                />
              )}
              <div
                className={`fixed inset-y-0 left-0 z-50 w-60 bg-white shadow-2xl transform transition-transform duration-300 md:hidden overflow-y-auto ${
                  mobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                aria-hidden={!mobileOpen}
              >
                <div className="sidebar-root">
                <Sidebar
                  activePage={activePage}
                  onNavigate={(p) => {
                    setActivePage(p);
                    setMobileOpen(false);
                  }}
                />
                </div>
              </div>

              {/* Nội dung chính */}
              <main className="flex-1 md:ml-60 xl:ml-64 ml-0 px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10">
                <div className="w-full max-w-6xl mx-auto">
                  {/* Thanh trên cùng */}
                  <div className="flex justify-between items-center mb-6 md:mb-8">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Hamburger cho mobile */}
                      <button
                        type="button"
                        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow hover:bg-gray-50 border border-gray-200"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Mở menu"
                      >
                        <span className="text-xl">☰</span>
                      </button>
                      <div className="hidden sm:block truncate">
                        <div className="text-sm text-slate-500 mb-1 truncate">Xin chào, Nguyễn Văn A</div>
                        <div className="text-xs text-slate-400 truncate">Trang trại Lợi Có • Quận 9, TP.HCM</div>
                      </div>
                    </div>

                    {/* Pro button: compact on small screens to prevent overflow */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => setActivePage('pricing')}
                        className="hidden sm:inline-flex px-5 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        Nâng cấp Pro
                      </button>
                      <button
                        onClick={() => setActivePage('pricing')}
                        className="sm:hidden inline-flex items-center px-3 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-md"
                        aria-label="Nâng cấp Pro"
                      >
                        Pro
                      </button>
                    </div>
                  </div>

                  {/* Hiển thị trang hiện tại */}
                  {renderPage()}
                </div>
              </main>
            </div>
          )}
        />
      </Route>
    </Routes>
    </Suspense>
  );
}

export default App;
