import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, List, PieChart, Info, Menu } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    if (tapCount > 0) {
      const timer = setTimeout(() => setTapCount(0), 1500);
      return () => clearTimeout(timer);
    }
  }, [tapCount]);

  const handleAdminTap = () => {
    setTapCount(prev => {
      if (prev + 1 >= 3) {
        navigate('/admin');
        return 0;
      }
      return prev + 1;
    });
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Report Issue', path: '/report', icon: AlertTriangle },
    { name: 'Public Issues', path: '/issues', icon: List },
    { name: 'Dashboard', path: '/dashboard', icon: PieChart },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Ticker Tape */}
      <div className="bg-[#111111] text-white overflow-hidden w-full relative z-50 py-2 border-b border-black">
        <div className="animate-marquee inline-flex whitespace-nowrap min-w-full">
          <div className="flex items-center w-max">
            {[...Array(5)].map((_, i) => (
              <span key={`a-${i}`} className="flex items-center text-[10px] sm:text-xs font-bold tracking-widest px-8 uppercase">
                <span className="mr-3 text-red-500">⚡</span> 
                பிறப்பொக்கும் எல்லா உயிர்க்கும் ! 
                <span className="px-8 font-normal">Tamilaga Vettri Kazhagam ! MELVISHARAM TVK MAKKAL SEVAI</span>
              </span>
            ))}
          </div>
          <div className="flex items-center w-max">
            {[...Array(5)].map((_, i) => (
              <span key={`b-${i}`} className="flex items-center text-[10px] sm:text-xs font-bold tracking-widest px-8 uppercase">
                <span className="mr-3 text-red-500">⚡</span> 
                பிறப்பொக்கும் எல்லா உயிர்க்கும் ! 
                <span className="px-8 font-normal">Tamilaga Vettri Kazhagam ! MELVISHARAM TVK MAKKAL SEVAI</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <div>
                <Link to="/" className="font-bold text-lg leading-tight text-red-700 block">
                  Melvisharam
                  <span className="hidden sm:inline"> TVK</span>
                </Link>
                <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">Portal</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-red-50 text-red-700 font-bold" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-red-600"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-red-600 hover:bg-slate-50 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-lg absolute w-full">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-md text-base font-medium",
                      isActive
                        ? "bg-red-50 text-red-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-red-600"
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 text-slate-500 py-6 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <p className="text-sm font-medium">© {new Date().getFullYear()} Melvisharam TVK</p>
          <div 
            className="flex items-center gap-1 text-xs mt-2 opacity-75 cursor-pointer select-none"
            onClick={handleAdminTap}
          >
            <Info className="w-3 h-3" />
            <span>Resolution System v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
