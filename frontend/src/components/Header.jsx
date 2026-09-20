import React, { useState } from 'react';
import {
  ShieldCheck, Activity, AlertTriangle, Search, Bell,
  LogOut, ChevronDown, Cpu, Wifi, WifiOff, Shield,
  BarChart3, Settings, Users, Terminal, Lock
} from 'lucide-react';

const DASHBOARD_OPTIONS = [
  { key: 'maintenance', label: 'Maintenance Workbench', icon: Cpu, role: 'Maintenance Engineer', allowedRoles: ['System Administrator', 'Maintenance Engineer'] },
  { key: 'admin',       label: 'Admin Console',          icon: Settings, role: 'System Administrator', allowedRoles: ['System Administrator'] },
  { key: 'security',    label: 'Security Console',        icon: Shield, role: 'Security Officer', allowedRoles: ['System Administrator', 'Security Officer'] },
  { key: 'analyst',     label: 'Analytics Studio',        icon: BarChart3, role: 'Data Analyst', allowedRoles: ['System Administrator', 'Data Analyst'] },
  { key: 'operator',    label: 'Operator Console',        icon: Terminal, role: 'Plant Operator', allowedRoles: ['System Administrator', 'Plant Operator'] },
];

export default function Header({ systemHealth, currentUser, activeDashboard, setActiveDashboard, onLogout, onSearch }) {
  const [searchVal, setSearchVal] = useState('');
  const [showDashMenu, setShowDashMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isOnline = systemHealth?.status !== 'demo' && systemHealth?.status !== undefined;
  const activeDash = DASHBOARD_OPTIONS.find(d => d.key === activeDashboard) || DASHBOARD_OPTIONS[0];
  const DashIcon = activeDash.icon;

  return (
    <header className="wb-header">
      {/* Brand */}
      <div className="wb-header-brand">
        <div className="wb-header-logo"><ShieldCheck size={18} /></div>
        <div>
          <div className="wb-header-name">AegisAI</div>
          <div className="wb-header-tag">Sovereign Workbench</div>
        </div>
      </div>

      {/* Dashboard Switcher */}
      <div className="wb-dash-switcher" onClick={() => setShowDashMenu(!showDashMenu)}>
        <DashIcon size={15} />
        <span>{activeDash.label}</span>
        <ChevronDown size={13} className={showDashMenu ? 'rotated' : ''} />
        {showDashMenu && (
          <div className="wb-dash-menu" onClick={e => e.stopPropagation()}>
            {DASHBOARD_OPTIONS.map(d => {
              const Icon = d.icon;
              const isAllowed =
                currentUser?.role === 'System Administrator' ||
                (d.allowedRoles ? d.allowedRoles.includes(currentUser?.role) : true);
              return (
                <button
                  key={d.key}
                  className={`wb-dash-item${d.key === activeDashboard ? ' active' : ''}${!isAllowed ? ' restricted' : ''}`}
                  onClick={() => {
                    if (!isAllowed) return;
                    setActiveDashboard(d.key);
                    setShowDashMenu(false);
                  }}
                  title={!isAllowed ? `Restricted: requires ${d.role} role` : d.label}
                >
                  <Icon size={14} />
                  <div style={{ flex: 1 }}>
                    <div className="wb-dash-item-label">{d.label}</div>
                    <div className="wb-dash-item-role">{d.role}</div>
                  </div>
                  {!isAllowed && (
                    <span className="wb-dash-item-lock">
                      <Lock size={9} /> Restricted
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="wb-search-wrap">
        <Search size={14} className="wb-search-icon" />
        <input
          className="wb-search"
          placeholder="Search knowledge base..."
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { onSearch?.(searchVal); setSearchVal(''); } }}
        />
      </div>

      {/* Status Pills */}
      <div className="wb-header-status">
        <span className={`wb-status-pill ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
          {isOnline ? 'Backend Online' : 'Demo Mode'}
        </span>
        <span className="wb-status-pill egress">
          <Activity size={12} />
          0 ext. calls
        </span>
      </div>

      {/* Notifications */}
      <button className="wb-icon-btn">
        <Bell size={17} />
        <span className="wb-notif-dot" />
      </button>

      {/* User Menu */}
      <div className="wb-user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
        <div className="wb-user-avatar" style={{ '--av': currentUser?.clearanceColor || '#BD7035' }}>
          {currentUser?.initials || '??'}
        </div>
        <div className="wb-user-info">
          <div className="wb-user-name">{currentUser?.name || 'User'}</div>
          <div className="wb-user-role">{currentUser?.role || 'Unknown'}</div>
        </div>
        <ChevronDown size={13} />

        {showUserMenu && (
          <div className="wb-user-menu" onClick={e => e.stopPropagation()}>
            <div className="wb-user-menu-header">
              <div className="wb-user-avatar lg" style={{ '--av': currentUser?.clearanceColor || '#BD7035' }}>
                {currentUser?.initials || '??'}
              </div>
              <div>
                <div className="wb-user-menu-name">{currentUser?.name}</div>
                <div className="wb-user-menu-dept">{currentUser?.dept}</div>
                <span className="wb-clearance-badge" style={{ '--cl': currentUser?.clearanceColor }}>
                  {currentUser?.clearance}
                </span>
              </div>
            </div>
            <div className="wb-user-menu-divider" />
            <button className="wb-user-menu-item logout" onClick={onLogout}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
