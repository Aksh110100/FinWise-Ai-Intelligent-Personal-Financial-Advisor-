import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Wallet, PiggyBank, TrendingUp, Target, Sparkles, FileText, Settings, User, Search, Bell } from 'lucide-react';
import { DashboardProvider } from '../context/DashboardContext';
import '../styles/dashboard.css';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/expenses', label: 'Expenses', icon: Wallet },
  { path: '/budget', label: 'Budget', icon: Wallet }, // Optional placeholder
  { path: '/savings', label: 'Savings', icon: PiggyBank },
  { path: '/investments', label: 'Investments', icon: TrendingUp },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/advisor', label: 'AI Advisor', icon: Sparkles },
  { path: '/reports', label: 'Reports', icon: FileText },
];

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayPath, setDisplayPath] = useState(location.pathname);

  useEffect(() => {
    const idx = NAV_ITEMS.findIndex(item => item.path === location.pathname);
    if (idx !== -1) setActiveIndex(idx);

    if (location.pathname !== displayPath) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayPath(location.pathname);
        setIsTransitioning(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, displayPath]);

  const handleLogout = () => {
    localStorage.removeItem('finwise_authenticated');
    navigate('/login');
  };

  return (
    <div className="dashboard-app-container">
      {/* Sidebar */}
      <aside className="premium-sidebar">
        <div className="sidebar-logo">FINWISE<br/>AI</div>
        
        <nav className="sidebar-nav">
          <div className="active-indicator" style={{ transform: `translateY(${activeIndex * 48}px)` }} />
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-divider"></div>
          <button className="sidebar-link">
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <button className="sidebar-link" onClick={handleLogout}>
            <User size={18} />
            <span>Profile</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main-area">
        {/* Topbar */}
        <header className="premium-topbar">
          <div className="topbar-search">
            <Search size={18} color="var(--text-secondary)" />
            <input type="text" placeholder="Search transactions, insights..." />
          </div>
          <div className="topbar-actions">
            <button className="icon-btn"><Bell size={18} /></button>
            <button className="icon-btn" onClick={handleLogout}><User size={18} /></button>
          </div>
        </header>

        {/* Page Content with Transition */}
        <div className={`page-transition-wrapper ${isTransitioning ? 'exiting' : 'entering'}`}>
          <DashboardProvider>
            <Outlet />
          </DashboardProvider>
        </div>
      </main>
    </div>
  );
};
