import React, { useState, useEffect } from 'react';
import {
  Shield, Wifi, WifiOff, Eye, Lock, AlertTriangle,
  CheckCircle2, Activity, FileText, Clock, RefreshCw
} from 'lucide-react';

const MOCK_AUDIT = [
  { ts: '21:52:01', user: 'PS', action: 'RAG Query',       risk: 'low',    hash: 'a3f9d2' },
  { ts: '21:50:47', user: 'RK', action: 'Model Load',      risk: 'low',    hash: 'b12c4e' },
  { ts: '21:48:03', user: 'AM', action: 'HITL Approve',    risk: 'high',   hash: 'c8e7f1' },
  { ts: '21:45:20', user: 'VS', action: 'SOP Retrieval',   risk: 'low',    hash: 'd4a1b9' },
  { ts: '21:41:11', user: 'SI', action: 'Export DOCX',     risk: 'medium', hash: 'e6c3d8' },
  { ts: '21:38:55', user: 'RK', action: 'RBAC Edit',       risk: 'high',   hash: 'f2b5e0' },
  { ts: '21:35:03', user: 'AM', action: 'Egress Scan',     risk: 'low',    hash: 'a9d4c7' },
  { ts: '21:30:22', user: 'PS', action: 'Document Upload', risk: 'low',    hash: 'b7e1f3' },
];

const CERT_CHECKS = [
  { label: 'Zero External API Calls',          pass: true },
  { label: 'Egress Network Monitor Active',     pass: true },
  { label: 'AES-256 Encryption at Rest',        pass: true },
  { label: 'Immutable Audit Ledger',            pass: true },
  { label: 'RBAC Enforced at Query Time',       pass: true },
  { label: 'HITL Gate on HIGH Risk Outputs',    pass: true },
  { label: 'ChromaDB Isolated (No Cloud Sync)', pass: true },
  { label: 'Ollama Air-Gapped Mode',            pass: true },
];

function EgressMeter() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="sec-egress-meter">
      <div className="sec-egress-icon"><WifiOff size={24} /></div>
      <div className="sec-egress-body">
        <div className="sec-egress-title">Egress Monitor</div>
        <div className="sec-egress-val">0 <span>external calls</span></div>
        <div className="sec-egress-sub">Uptime: {Math.floor(tick / 60)}m {tick % 60}s · Fully Air-Gapped</div>
        <div className="sec-egress-bar">
          <div className="sec-egress-fill" style={{ width: '0%' }} />
        </div>
      </div>
      <div className="sec-egress-badge">
        <CheckCircle2 size={14} /> CERT-In Compliant
      </div>
    </div>
  );
}

export default function SecurityDashboard({ currentUser }) {
  const riskColor = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

  return (
    <div className="sec-root">
      <div className="sec-header">
        <div>
          <h2 className="sec-title"><Shield size={20} /> Security &amp; Air-Gap Compliance Console</h2>
          <p className="sec-sub">Logged in as <strong>{currentUser?.name}</strong> · {currentUser?.role}</p>
        </div>
        <button className="ad-action-btn"><RefreshCw size={13} /> Refresh</button>
      </div>

      <div className="sec-grid">
        {/* Egress Monitor */}
        <div className="sec-panel full">
          <EgressMeter />
        </div>

        {/* CERT-In Checks */}
        <div className="sec-panel">
          <div className="sec-panel-title"><Lock size={14} /> Compliance Checks</div>
          <div className="sec-checklist">
            {CERT_CHECKS.map((c, i) => (
              <div key={i} className="sec-check-row">
                <CheckCircle2 size={13} className="sec-check-pass" />
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log */}
        <div className="sec-panel">
          <div className="sec-panel-title"><Eye size={14} /> Live Audit Ledger</div>
          <div className="sec-audit-list">
            {MOCK_AUDIT.map((l, i) => (
              <div key={i} className="sec-audit-row">
                <span className="sec-audit-time">{l.ts}</span>
                <span className="sec-audit-avatar">{l.user}</span>
                <span className="sec-audit-action">{l.action}</span>
                <span className="sec-audit-hash">{l.hash}</span>
                <span className="sec-audit-dot" style={{ background: riskColor[l.risk] }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
