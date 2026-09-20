import React, { useState } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, FileText,
  Download, Activity, Zap, Clock, CheckCircle2
} from 'lucide-react';

const FLEET_DATA = [
  { unit: 'Compressor C-204', mtbf: '847h', mttr: '4.2h', status: 'warn',   failures: 3 },
  { unit: 'Pump P-112',       mtbf: '1240h', mttr: '2.1h', status: 'ok',   failures: 1 },
  { unit: 'Heat Exchanger HX-7B', mtbf: '620h', mttr: '6.8h', status: 'crit', failures: 5 },
  { unit: 'Turbine T-01',     mtbf: '2100h', mttr: '8.5h', status: 'ok',   failures: 0 },
  { unit: 'Valve V-304',      mtbf: '390h',  mttr: '1.2h', status: 'warn', failures: 4 },
];

const RECENT_REPORTS = [
  { name: 'Fleet_Reliability_Q3.docx',   size: '1.2 MB', date: '2026-09-18', type: 'docx' },
  { name: 'MTBF_Analysis_Sep.xlsx',       size: '840 KB', date: '2026-09-17', type: 'xlsx' },
  { name: 'Maintenance_Summary.pptx',     size: '3.4 MB', date: '2026-09-15', type: 'pptx' },
  { name: 'Anomaly_Report_C204.pdf',      size: '560 KB', date: '2026-09-14', type: 'pdf' },
];

function MiniBar({ value, max, color }) {
  return (
    <div className="an-bar-wrap">
      <div className="an-bar-fill" style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: color }} />
    </div>
  );
}

const typeColor = { docx: '#38bdf8', xlsx: '#22c55e', pptx: '#f59e0b', pdf: '#BD7035' };
const statusColor = { ok: '#22c55e', warn: '#f59e0b', crit: '#ef4444' };

export default function AnalystDashboard({ currentUser }) {
  const [generating, setGenerating] = useState(null);

  const handleGenerate = (type) => {
    setGenerating(type);
    setTimeout(() => setGenerating(null), 2500);
  };

  return (
    <div className="an-root">
      <div className="an-header">
        <div>
          <h2 className="an-title"><BarChart3 size={20} /> Fleet Analytics &amp; Deliverable Studio</h2>
          <p className="an-sub">Logged in as <strong>{currentUser?.name}</strong> · {currentUser?.role}</p>
        </div>
      </div>

      <div className="an-grid">
        {/* Fleet Table */}
        <div className="an-panel wide">
          <div className="an-panel-title"><Activity size={14} /> Fleet Reliability Overview</div>
          <table className="ad-table">
            <thead>
              <tr><th>Unit</th><th>MTBF</th><th>MTTR</th><th>Failures</th><th>Health</th><th>Trend</th></tr>
            </thead>
            <tbody>
              {FLEET_DATA.map((d, i) => (
                <tr key={i}>
                  <td className="ad-td-name">{d.unit}</td>
                  <td className="ad-td-dim">{d.mtbf}</td>
                  <td className="ad-td-dim">{d.mttr}</td>
                  <td>{d.failures}</td>
                  <td>
                    <MiniBar value={d.failures} max={6} color={statusColor[d.status]} />
                  </td>
                  <td>
                    {d.status === 'ok'   && <TrendingDown size={14} color="#22c55e" />}
                    {d.status === 'warn' && <TrendingUp size={14} color="#f59e0b" />}
                    {d.status === 'crit' && <TrendingUp size={14} color="#ef4444" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Generate Reports */}
        <div className="an-panel">
          <div className="an-panel-title"><Zap size={14} /> Generate Cited Deliverable</div>
          <div className="an-gen-list">
            {[
              { type: 'docx', label: 'Word Report (.docx)' },
              { type: 'xlsx', label: 'Excel Analysis (.xlsx)' },
              { type: 'pptx', label: 'PowerPoint Deck (.pptx)' },
            ].map(({ type, label }) => (
              <button
                key={type}
                className={`an-gen-btn${generating === type ? ' loading' : ''}`}
                style={{ '--gc': typeColor[type] }}
                onClick={() => handleGenerate(type)}
                disabled={!!generating}
              >
                {generating === type
                  ? <><Clock size={13} className="spin" /> Generating...</>
                  : <><Download size={13} /> {label}</>}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="an-panel">
          <div className="an-panel-title"><FileText size={14} /> Recent Deliverables</div>
          <div className="an-report-list">
            {RECENT_REPORTS.map((r, i) => (
              <div key={i} className="an-report-row">
                <span className="an-report-type" style={{ color: typeColor[r.type], borderColor: typeColor[r.type] + '44' }}>
                  .{r.type}
                </span>
                <div className="an-report-info">
                  <span className="an-report-name">{r.name}</span>
                  <span className="an-report-meta">{r.size} · {r.date}</span>
                </div>
                <button className="an-report-dl"><Download size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
