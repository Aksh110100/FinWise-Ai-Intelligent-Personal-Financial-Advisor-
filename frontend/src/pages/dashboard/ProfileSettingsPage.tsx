import React, { useState } from 'react';
import { User, Mail, Shield, Bell, Key, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

export const ProfileSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '24px' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your profile, preferences, and account security.</p>
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        
        {/* Sidebar Navigation */}
        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'profile', icon: User, label: 'Profile Information' },
            { id: 'security', icon: Shield, label: 'Security & Login' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: activeTab === tab.id ? 'rgba(220, 190, 140, 0.1)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent-gold)' : 'var(--text-primary)',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: activeTab === tab.id ? 600 : 500,
                transition: 'all 0.2s ease',
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />
          
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'transparent',
              color: '#ef4444',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1 }}>
          <div className="glass-card" style={{ padding: '32px' }}>
            
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(220,190,140,0.2) 0%, rgba(220,190,140,0.05) 100%)', border: '1px solid rgba(220,190,140,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={32} color="var(--accent-gold)" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 600, marginBottom: '4px' }}>Alex Johnson</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Pro Member</p>
                    <button style={{ marginTop: '12px', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}>Change Avatar</button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Full Name</label>
                    <input type="text" defaultValue="Alex Johnson" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="email" defaultValue="alex.j@example.com" style={{ width: '100%', padding: '12px 16px 12px 42px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }} />
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button style={{ padding: '10px 24px', background: 'var(--accent-gold)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h2 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 600 }}>Security Settings</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Current Password</label>
                    <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>New Password</label>
                    <input type="password" placeholder="Enter new password" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 500, marginBottom: '4px' }}>Two-Factor Authentication</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Add an extra layer of security to your account</div>
                  </div>
                  <button style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(220,190,140,0.5)', color: 'var(--accent-gold)', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Enable</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h2 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 600 }}>Notification Preferences</h2>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Choose what alerts you want to receive.</div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
