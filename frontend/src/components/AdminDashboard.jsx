import React, { useState } from 'react';
import {
  Settings, Cpu, Database, Users, Shield, Activity,
  CheckCircle2, XCircle, AlertTriangle, Server, HardDrive,
  Wifi, Monitor, RefreshCw, Zap
} from 'lucide-react';

const MOCK_MODELS = [
  { name: 'Qwen2.5 7B',      status: 'loaded',   size: '4.7 GB', type: 'Text',   vram: '6.2 GB' },
  { name: 'Qwen-Coder 7B',   status: 'loaded',   size: '4.7 GB', type: 'Code',   vram: '5.8 GB' },
  { name: 'Qwen2-VL 7B',     status: 'standby',  size: '6.1 GB', type: 'Vision', vram: '—' },
  { name: 'Llama 3.1 8B',    status: 'standby',  size: '4.9 GB', type: 'Text',   vram: '—' },
  { name: 'Mistral 7B',      status: 'unloaded', size: '4.1 GB', type: 'Text',   vram: '—' },
];

const MOCK_USERS = [
  { name: 'Priya Sharma',  role: 'Maintenance Engineer', status: 'online',     clearance: 'CONFIDENTIAL', color: '#f59e0b' },
  { name: 'Arun Menon',    role: 'Security Officer',      status: 'restricted', clearance: 'RESTRICTED',   color: '#f3b250' },
  { name: 'Sneha Iyer',    role: 'Data Analyst',          status: 'offline',    clearance: 'INTERNAL',     color: '#38bdf8' },
  { name: 'Vikram Singh',  role: 'Plant Operator',        status: 'offline',    clearance: 'INTERNAL',     color: '#38bdf8' },
];

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="ad-stat-card">
      <div className="ad-stat-icon" style={{ '--ic': color || 'var(--ochre)' }}><Icon size={18} /></div>
      <div className="ad-stat-body">
        <div className="ad-stat-value">{value}</div>
        <div className="ad-stat-label">{label}</div>
        {sub && <div className="ad-stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

export default function AdminDashboard({ currentUser }) {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="ad-root">
      <div className="ad-sidebar">
        <div className="ad-sidebar-title">Admin Console</div>
        {[
          { key: 'overview', label: 'Overview',     Icon: Monitor },
          { key: 'models',   label: 'Model Hub',    Icon: Cpu },
          { key: 'users',    label: 'RBAC Users',   Icon: Users },
          { key: 'system',   label: 'System Health', Icon: Activity },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`ad-nav-item${activeSection === key ? ' active' : ''}`}
            onClick={() => setActiveSection(key)}
          >
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      <div className="ad-main">
        <div className="ad-header">
          <div>
            <h2 className="ad-title">System Administration Console</h2>
            <p className="ad-subtitle">Logged in as <strong>{currentUser?.name}</strong> · {currentUser?.role}</p>
          </div>
          <span className="ad-badge">TOP SECRET</span>
        </div>

        {activeSection === 'overview' && (
          <>
            <div className="ad-stats-grid">
              <StatCard icon={Cpu}      label="GPU VRAM Used"     value="12.0 GB" sub="of 16 GB" color="#BD7035" />
              <StatCard icon={Database} label="Documents Indexed" value="1,247"   sub="ChromaDB" color="#38bdf8" />
              <StatCard icon={Users}    label="Active Sessions"   value="2"       sub="of 5 users" color="#22c55e" />
              <StatCard icon={Shield}   label="Egress Calls"      value="0"       sub="Fully air-gapped" color="#22c55e" />
              <StatCard icon={Activity} label="Queries Today"     value="84"      sub="Avg 1.4s response" color="#f59e0b" />
              <StatCard icon={Server}   label="Uptime"            value="99.9%"   sub="7d 4h 12m" color="#BD7035" />
            </div>
          </>
        )}

        {activeSection === 'models' && (
          <div className="ad-table-wrap">
            <div className="ad-table-header">
              <div className="ad-table-title"><Cpu size={15} /> Local Model Hub</div>
              <button className="ad-action-btn"><RefreshCw size={13} /> Refresh</button>
            </div>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Model</th><th>Type</th><th>Status</th><th>Size</th><th>VRAM</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_MODELS.map((m, i) => (
                  <tr key={i}>
                    <td className="ad-td-name">{m.name}</td>
                    <td><span className="ad-type-tag">{m.type}</span></td>
                    <td>
                      <span className={`ad-status-badge ${m.status}`}>
                        {m.status === 'loaded'   && <><CheckCircle2 size={11} /> Loaded</>}
                        {m.status === 'standby'  && <><AlertTriangle size={11} /> Standby</>}
                        {m.status === 'unloaded' && <><XCircle size={11} /> Unloaded</>}
                      </span>
                    </td>
                    <td className="ad-td-dim">{m.size}</td>
                    <td className="ad-td-dim">{m.vram}</td>
                    <td>
                      <button className="ad-row-btn">
                        {m.status === 'loaded' ? 'Unload' : 'Load'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'users' && (
          <div className="ad-table-wrap">
            <div className="ad-table-header">
              <div className="ad-table-title"><Users size={15} /> RBAC User Management</div>
            </div>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>User</th><th>Role</th><th>Clearance</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((u, i) => (
                  <tr key={i}>
                    <td className="ad-td-name">{u.name}</td>
                    <td className="ad-td-dim">{u.role}</td>
                    <td>
                      <span className="ad-clearance-tag" style={{ color: u.color, borderColor: u.color + '44' }}>
                        {u.clearance}
                      </span>
                    </td>
                    <td>
                      {u.status === 'restricted' ? (
                        <span className="ad-status-badge unloaded" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}>
                          <XCircle size={11} /> Restricted (Login Barred)
                        </span>
                      ) : (
                        <span className={`ad-status-badge ${u.status === 'online' ? 'loaded' : 'unloaded'}`}>
                          {u.status === 'online' ? <><CheckCircle2 size={11} /> Online</> : <><XCircle size={11} /> Offline</>}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'system' && (
          <div className="ad-stats-grid">
            <StatCard icon={Server}   label="FastAPI Backend"   value="Running" sub="Port 8000" color="#22c55e" />
            <StatCard icon={Database} label="ChromaDB"          value="Offline" sub="Demo mode" color="#ef4444" />
            <StatCard icon={Cpu}      label="Ollama"            value="Offline" sub="Demo mode" color="#ef4444" />
            <StatCard icon={Wifi}     label="Egress Monitor"    value="Active"  sub="0 outbound" color="#22c55e" />
            <StatCard icon={HardDrive} label="Disk Usage"       value="47 GB"   sub="of 150 GB SSD" color="#BD7035" />
            <StatCard icon={Zap}      label="GPU"               value="12 GB"   sub="RTX 3060 ready" color="#BD7035" />
          </div>
        )}
      </div>
    </div>
  );
}
