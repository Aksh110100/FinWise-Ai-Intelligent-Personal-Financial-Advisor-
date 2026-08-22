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
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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
        <Link to="/dashboard" className="sidebar-logo" style={{ textDecoration: 'none' }}>
          <img src="/logo.png" alt="FinWise AI" style={{ height: '52px', objectFit: 'contain', transform: 'translateX(-32px)' }} />
        </Link>
        
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
          <Link to="/settings" className={`sidebar-link ${location.pathname === '/settings' ? 'active' : ''}`}>
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          <button className="sidebar-link" onClick={handleLogout}>
            <User size={18} />
            <span>Logout</span>
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
          <div className="topbar-actions" style={{ position: 'relative' }}>
            <button 
              className="icon-btn" 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              style={{ position: 'relative' }}
            >
              <Bell size={18} />
              {/* Notification dot indicator */}
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', background: 'var(--accent-gold)', borderRadius: '50%', border: '2px solid rgba(5,5,5,1)' }} />
            </button>
            
            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: '48px',
                width: '320px',
                background: 'rgba(15, 15, 15, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                zIndex: 100,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>Notifications</h3>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold)', fontSize: '0.75rem', cursor: 'pointer' }}>Mark all read</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '300px', overflowY: 'auto' }}>
                  {[
                    { id: 1, title: 'Unusual Spending Detected', desc: 'Dining out is 30% higher than usual this week.', time: '2h ago', unread: true },
                    { id: 2, title: 'Savings Goal Reached', desc: 'Congratulations! You hit your Emergency Fund goal.', time: '1d ago', unread: true },
                    { id: 3, title: 'Investment Update', desc: 'Your portfolio is up 2.4% this month.', time: '2d ago', unread: false }
                  ].map(notif => (
                    <div key={notif.id} style={{ 
                      padding: '16px', 
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: notif.unread ? 'rgba(255,255,255,0.02)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = notif.unread ? 'rgba(255,255,255,0.02)' : 'transparent'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: notif.unread ? 600 : 500, color: notif.unread ? '#fff' : 'var(--text-secondary)' }}>{notif.title}</div>
                        {notif.unread && <div style={{ width: '6px', height: '6px', background: 'var(--accent-gold)', borderRadius: '50%', marginTop: '6px' }} />}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>{notif.desc}</div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{notif.time}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  <button style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}>View All Notifications</button>
                </div>
              </div>
            )}

            <button className="icon-btn" onClick={() => navigate('/settings')}><User size={18} /></button>
          </div>
        </header>

        {/* Page Content with Transition */}
        <div className={`page-transition-wrapper ${isTransitioning ? 'exiting' : 'entering'} ${location.pathname === '/advisor' ? 'no-padding' : ''}`}>
          <DashboardProvider>
            <Outlet />
          </DashboardProvider>
        </div>
      </main>
    </div>
  );
};
