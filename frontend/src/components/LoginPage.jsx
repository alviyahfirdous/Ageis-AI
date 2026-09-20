import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Eye, EyeOff, ArrowRight, Lock, User,
  AlertCircle, CheckCircle2, XCircle, Shield, Cpu, FileText, Users
} from 'lucide-react';

/* ─── User Credentials Database ─────────────────────────────────── */
export const USERS = [
  {
    id: 'admin-001',
    username: 'admin',
    password: 'Aegis@Admin2026',
    role: 'System Administrator',
    clearance: 'TOP SECRET',
    clearanceColor: '#ef4444',
    name: 'Rajesh Kumar',
    initials: 'RK',
    dept: 'IT Infrastructure',
    permissions: ['all'],
    dashboard: 'admin',
    dashboardName: 'System Administration Console',
    description: 'Full system access — GPU cluster, model hub, audit logs, RBAC management, egress monitor.',
  },
  {
    id: 'eng-002',
    username: 'm.engineer',
    password: 'Maint#Eng2026',
    role: 'Maintenance Engineer',
    clearance: 'CONFIDENTIAL',
    clearanceColor: '#f59e0b',
    name: 'Priya Sharma',
    initials: 'PS',
    dept: 'Plant Operations',
    permissions: ['rag', 'upload', 'hitl', 'download'],
    dashboard: 'maintenance',
    dashboardName: 'Maintenance Intelligence Workbench',
    description: 'Equipment telemetry, RAG diagnostics, P&ID visual extraction, HITL approval panel.',
  },
  {
    id: 'sec-003',
    username: 'sec.officer',
    password: 'Sec@Officer26',
    role: 'Security Officer',
    clearance: 'RESTRICTED',
    clearanceColor: '#f3b250',
    name: 'Arun Menon',
    initials: 'AM',
    dept: 'Cybersecurity',
    permissions: ['audit', 'egress', 'rbac', 'logs'],
    dashboard: 'security',
    dashboardName: 'Security & Air-Gap Compliance Console',
    description: 'Air-gap egress monitor, immutable cryptographic audit ledger, CERT-In compliance verification.',
    isRestricted: true,
    status: 'restricted',
    restrictionReason: 'RESTRICTED clearance level barred from direct dashboard session initialization.',
  },
  {
    id: 'ana-004',
    username: 'analyst',
    password: 'Data#Analyst26',
    role: 'Data Analyst',
    clearance: 'INTERNAL',
    clearanceColor: '#38bdf8',
    name: 'Sneha Iyer',
    initials: 'SI',
    dept: 'Research & Development',
    permissions: ['rag', 'download', 'view'],
    dashboard: 'analyst',
    dashboardName: 'Fleet Analytics & Deliverable Studio',
    description: 'Fleet reliability, MTBF metrics, automated cited deliverable generation (.docx/.pptx).',
    isRestricted: false,
  },
  {
    id: 'opr-005',
    username: 'operator',
    password: 'Plant@Ops2026',
    role: 'Plant Operator',
    clearance: 'INTERNAL',
    clearanceColor: '#38bdf8',
    name: 'Vikram Singh',
    initials: 'VS',
    dept: 'Field Operations',
    permissions: ['rag', 'view'],
    dashboard: 'operator',
    dashboardName: 'Plant Operations & Field Dispatch Console',
    description: 'Live asset annunciator, step-by-step SOP checklist execution, shift handover logging.',
    isRestricted: false,
  },
];

/* ─── Restricted User Check ─────────────────────────────────────── */
export const isUserRestricted = (u) => {
  if (!u) return false;
  return Boolean(
    u.clearance === 'RESTRICTED' ||
    u.isRestricted === true ||
    u.status === 'restricted' ||
    u.restricted === true
  );
};

/* ─── Clearance Badge ───────────────────────────────────────────── */
function ClearanceBadge({ level, color }) {
  return (
    <span className="lgn-clearance" style={{ '--cl': color }}>
      {level}
    </span>
  );
}

/* ─── Login Page ────────────────────────────────────────────────── */
export default function LoginPage({ onLogin }) {
  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [denied, setDenied]         = useState(false);
  const [showCreds, setShowCreds]   = useState(false);
  const [selectedUser, setSelected] = useState(null);
  const [attempts, setAttempts]     = useState(0);
  const heroBgRef                   = useRef(null);

  // Parallax on bg
  useEffect(() => {
    const h = () => {
      if (heroBgRef.current)
        heroBgRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Auto-fill on quick-select
  const quickFill = (user) => {
    setSelected(user);
    setUsername(user.username);
    setPassword(user.password);
    if (isUserRestricted(user)) {
      setDenied(true);
      setError(
        `Access Restricted: Account '${user.name}' (${user.clearance}) is barred from logging into the ${user.dashboardName}. RBAC policy SIH26117 blocks dashboard access.`
      );
    } else {
      setDenied(false);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (attempts >= 5) {
      setError('Account locked — too many failed attempts. Contact your administrator.');
      return;
    }
    setLoading(true);
    setError('');
    setDenied(false);

    // Simulate authentication delay
    await new Promise(r => setTimeout(r, 900));

    const user = USERS.find(
      u => u.username === username.trim() && u.password === password
    );

    if (user) {
      if (isUserRestricted(user)) {
        setLoading(false);
        setDenied(true);
        setError(
          `ACCESS DENIED (RBAC Air-Gap Security Protocol): User '${user.name}' has RESTRICTED clearance. You are prohibited from logging into '${user.dashboardName}'. Direct dashboard sessions are barred. Security violation recorded in sovereign audit ledger.`
        );
        return;
      }
      setSuccess(true);
      setTimeout(() => onLogin(user), 900);
    } else {
      setAttempts(a => a + 1);
      setError(
        attempts >= 4
          ? 'Account locked — too many failed attempts.'
          : `Invalid credentials. ${4 - attempts} attempt${4 - attempts !== 1 ? 's' : ''} remaining.`
      );
      setLoading(false);
    }
  };

  return (
    <div className="lgn-root">
      {/* Background */}
      <div className="lgn-bg" ref={heroBgRef} />
      <div className="lgn-overlay" />
      <div className="lgn-grid" />

      {/* Glow orbs */}
      <div className="lgn-glow lgn-glow-1" />
      <div className="lgn-glow lgn-glow-2" />

      <div className="lgn-layout">
        {/* ── Left Panel ──────────────────────────────────────── */}
        <div className="lgn-left">
          <div className="lgn-brand">
            <div className="lgn-brand-logo">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="lgn-brand-name">AegisAI</span>
              <span className="lgn-brand-tag">Sovereign Agentic Workbench</span>
            </div>
          </div>

          <div className="lgn-left-body">
            <div className="lgn-left-badge">
              <span className="lgn-badge-dot" />
              Smart India Hackathon 2026 · SIH26117
            </div>
            <h1 className="lgn-left-title">
              Secure Access<br />
              <em>to your sovereign</em><br />
              AI workbench
            </h1>
            <p className="lgn-left-sub">
              All sessions are encrypted end-to-end, air-gapped from external networks,
              and logged in the immutable audit ledger.
            </p>

            {/* Security features */}
            <div className="lgn-features">
              <div className="lgn-feat-item">
                <div className="lgn-feat-icon"><Shield size={16} /></div>
                <div>
                  <span className="lgn-feat-title">Zero Trust Auth</span>
                  <span className="lgn-feat-sub">RBAC enforced at every query</span>
                </div>
              </div>
              <div className="lgn-feat-item">
                <div className="lgn-feat-icon"><FileText size={16} /></div>
                <div>
                  <span className="lgn-feat-title">Audit Logged</span>
                  <span className="lgn-feat-sub">Every login recorded with timestamp</span>
                </div>
              </div>
              <div className="lgn-feat-item">
                <div className="lgn-feat-icon"><Cpu size={16} /></div>
                <div>
                  <span className="lgn-feat-title">On-Premise Only</span>
                  <span className="lgn-feat-sub">No external auth providers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Credentials reference panel */}
          <button className="lgn-creds-toggle" onClick={() => setShowCreds(!showCreds)}>
            <Users size={15} />
            {showCreds ? 'Hide' : 'View'} Demo Credentials
          </button>
          {showCreds && (
            <div className="lgn-creds-panel">
              <div className="lgn-creds-header">
                <Lock size={13} /> Demo User Accounts — Click to auto-fill
              </div>
              <div className="lgn-creds-list">
                {USERS.map(u => (
                  <button
                    key={u.id}
                    className={`lgn-cred-row${selectedUser?.id === u.id ? ' selected' : ''}`}
                    onClick={() => quickFill(u)}
                  >
                    <div className="lgn-cred-avatar" style={{ '--av': u.clearanceColor }}>
                      {u.initials}
                    </div>
                    <div className="lgn-cred-info">
                      <div className="lgn-cred-name">
                        {u.name}
                        <span style={{ marginLeft: '6px', fontSize: '0.62rem', color: u.clearanceColor, fontWeight: '700' }}>
                          ({u.role})
                        </span>
                        {isUserRestricted(u) && (
                          <span className="lgn-badge-restricted">
                            <Lock size={9} /> ACCESS RESTRICTED
                          </span>
                        )}
                      </div>
                      <div className="lgn-cred-un">@{u.username} · {u.password}</div>
                    </div>
                    <ClearanceBadge level={u.clearance} color={u.clearanceColor} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right Panel: Login Form ──────────────────────────── */}
        <div className="lgn-right">
          <div className="lgn-card">
            {/* Card header */}
            <div className="lgn-card-top">
              <div className="lgn-card-logo"><ShieldCheck size={20} /></div>
              <div>
                <h2 className="lgn-card-title">Sign In</h2>
                <p className="lgn-card-sub">AegisAI Secure Portal</p>
              </div>
            </div>

            {/* Selected user info */}
            {selectedUser && (
              <>
                <div className="lgn-selected-user">
                  <div className="lgn-sel-avatar" style={{ '--av': selectedUser.clearanceColor }}>
                    {selectedUser.initials}
                  </div>
                  <div className="lgn-sel-info">
                    <span className="lgn-sel-name">{selectedUser.name}</span>
                    <span className="lgn-sel-role">{selectedUser.role} · {selectedUser.dept}</span>
                  </div>
                  <ClearanceBadge level={selectedUser.clearance} color={selectedUser.clearanceColor} />
                </div>
                {isUserRestricted(selectedUser) && (
                  <div className="lgn-restricted-alert">
                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>RESTRICTED CLEARANCE ACCOUNT:</strong> Dashboard session initialization is barred for {selectedUser.name}. Zero-trust policy SIH26117 prohibits access to '{selectedUser.dashboardName}'.
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Form */}
            <form className="lgn-form" onSubmit={handleSubmit}>
              {/* Username */}
              <div className="lgn-field">
                <label className="lgn-label">Username</label>
                <div className="lgn-input-wrap">
                  <User size={16} className="lgn-input-icon" />
                  <input
                    type="text"
                    className="lgn-input"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError(''); setDenied(false); }}
                    autoComplete="username"
                    spellCheck="false"
                    disabled={loading || success}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="lgn-field">
                <label className="lgn-label">Password</label>
                <div className="lgn-input-wrap">
                  <Lock size={16} className="lgn-input-icon" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="lgn-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); setDenied(false); }}
                    autoComplete="current-password"
                    disabled={loading || success}
                    required
                  />
                  <button
                    type="button"
                    className="lgn-pass-toggle"
                    onClick={() => setShowPass(!showPass)}
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="lgn-error">
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>{error}</div>
                </div>
              )}

              {/* Attempt indicator */}
              {attempts > 0 && attempts < 5 && !error && (
                <div className="lgn-attempts">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`lgn-attempt-dot${i < attempts ? ' used' : ''}`} />
                  ))}
                  <span>{5 - attempts} attempts left</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className={`lgn-submit${loading ? ' loading' : ''}${success ? ' success' : ''}${denied ? ' denied' : ''}`}
                disabled={loading || success || attempts >= 5}
              >
                {denied ? (
                  <><XCircle size={17} /> Access Denied — Restricted Account</>
                ) : success ? (
                  <><CheckCircle2 size={17} /> Access Granted — Opening {selectedUser?.role || 'Portal'}</>
                ) : loading ? (
                  <><span className="lgn-spinner" /> Authenticating...</>
                ) : (
                  <>Sign In to {selectedUser?.role ? `${selectedUser.role} Portal` : 'Portal'} <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Footer info */}
            <div className="lgn-card-footer">
              <div className="lgn-security-line">
                <span className="lgn-sec-dot" />
                Secured · Air-Gapped · All sessions logged
              </div>
              <div className="lgn-cert-badges">
                <span className="lgn-cert">CERT-In Aligned</span>
                <span className="lgn-cert">NCIIPC Compliant</span>
              </div>
            </div>
          </div>

          {/* Role permissions hint */}
          {selectedUser && (
            <div className="lgn-perm-card">
              <div className="lgn-perm-header">
                <Shield size={14} /> Access Profile: <strong>{selectedUser.role}</strong>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#f3b250', fontWeight: '800' }}>
                Portal: {selectedUser.dashboardName}
              </div>
              <p className="lgn-perm-desc">{selectedUser.description}</p>
              <div className="lgn-perm-tags">
                {selectedUser.permissions.map(p => (
                  <span key={p} className="lgn-perm-tag">{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="lgn-bottom-bar">
        <span>AegisAI v1.0 · Team GLITCH · SIH26117</span>
        <span>All activity is monitored and logged. Unauthorized access is prohibited.</span>
      </div>
    </div>
  );
}
