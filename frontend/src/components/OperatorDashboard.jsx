import React, { useState } from 'react';
import {
  Terminal, AlertTriangle, CheckCircle2, Clock,
  Play, Pause, RotateCcw, Activity, Radio, FileText
} from 'lucide-react';

const ASSETS = [
  { id: 'C-204', name: 'Compressor C-204',        status: 'warning', reading: '4.2g vibration', updated: '2m ago' },
  { id: 'P-112', name: 'Pump P-112',               status: 'normal',  reading: 'Flow: 42 L/min',  updated: '1m ago' },
  { id: 'HX-7B', name: 'Heat Exchanger HX-7B',    status: 'alarm',   reading: 'Temp: 87°C',       updated: '30s ago' },
  { id: 'T-01',  name: 'Turbine T-01',             status: 'normal',  reading: 'RPM: 3600',        updated: '5m ago' },
  { id: 'V-304', name: 'Isolation Valve V-304',    status: 'warning', reading: 'Position: 73%',    updated: '3m ago' },
];

const SOP_STEPS = [
  { id: 1, label: 'Isolate energy sources (LOTO procedure)',         done: true },
  { id: 2, label: 'Verify zero-energy state with test equipment',    done: true },
  { id: 3, label: 'Remove bearing housing cover (4× M12 bolts)',    done: false },
  { id: 4, label: 'Extract worn bearing using bearing puller tool',  done: false },
  { id: 5, label: 'Inspect shaft journal for scoring/damage',        done: false },
  { id: 6, label: 'Install new bearing — torque to 45 Nm',          done: false },
  { id: 7, label: 'Replace housing cover and seal with Loctite 243',done: false },
  { id: 8, label: 'Restore energy sources and verify operation',     done: false },
];

const statusColor  = { normal: '#22c55e', warning: '#f59e0b', alarm: '#ef4444' };
const statusLabel  = { normal: 'Normal', warning: 'Warning', alarm: 'Alarm' };
const StatusIcon   = { normal: CheckCircle2, warning: AlertTriangle, alarm: AlertTriangle };

export default function OperatorDashboard({ currentUser }) {
  const [steps, setSteps] = useState(SOP_STEPS);
  const [activeAsset, setActiveAsset] = useState('C-204');

  const toggleStep = (id) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, done: !s.done } : s));
  };

  const doneCount = steps.filter(s => s.done).length;

  return (
    <div className="op-root">
      <div className="op-header">
        <div>
          <h2 className="op-title"><Terminal size={20} /> Plant Operations &amp; Field Dispatch Console</h2>
          <p className="op-sub">Logged in as <strong>{currentUser?.name}</strong> · {currentUser?.role}</p>
        </div>
      </div>

      <div className="op-grid">
        {/* Asset Annunciator */}
        <div className="op-panel">
          <div className="op-panel-title"><Radio size={14} /> Live Asset Annunciator</div>
          <div className="op-asset-list">
            {ASSETS.map(a => {
              const Icon = StatusIcon[a.status];
              const active = a.id === activeAsset;
              return (
                <div
                  key={a.id}
                  className={`op-asset-row${active ? ' active' : ''}`}
                  style={{ '--ac': statusColor[a.status] }}
                  onClick={() => setActiveAsset(a.id)}
                >
                  <Icon size={14} color={statusColor[a.status]} />
                  <div className="op-asset-info">
                    <span className="op-asset-name">{a.name}</span>
                    <span className="op-asset-reading">{a.reading}</span>
                  </div>
                  <div className="op-asset-right">
                    <span className="op-asset-status" style={{ color: statusColor[a.status] }}>
                      {statusLabel[a.status]}
                    </span>
                    <span className="op-asset-time">{a.updated}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SOP Checklist */}
        <div className="op-panel">
          <div className="op-panel-title">
            <FileText size={14} /> SOP — Compressor Bearing Replacement
            <span className="op-sop-progress">{doneCount}/{steps.length}</span>
          </div>
          <div className="op-sop-bar">
            <div className="op-sop-fill" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
          </div>
          <div className="op-step-list">
            {steps.map(s => (
              <button
                key={s.id}
                className={`op-step-row${s.done ? ' done' : ''}`}
                onClick={() => toggleStep(s.id)}
              >
                <div className={`op-step-check${s.done ? ' checked' : ''}`}>
                  {s.done && <CheckCircle2 size={13} />}
                </div>
                <span className="op-step-num">{s.id}</span>
                <span className="op-step-label">{s.label}</span>
              </button>
            ))}
          </div>
          {doneCount === steps.length && (
            <div className="op-sop-complete">
              <CheckCircle2 size={16} /> All steps complete — Shift handover ready
            </div>
          )}
        </div>

        {/* Shift Handover */}
        <div className="op-panel">
          <div className="op-panel-title"><Activity size={14} /> Shift Handover Log</div>
          <textarea
            className="op-handover-input"
            placeholder="Record shift handover notes here... Include equipment status, open issues, and pending work orders."
            rows={8}
          />
          <button className="op-handover-btn">
            <FileText size={13} /> Submit Handover Log
          </button>
        </div>
      </div>
    </div>
  );
}
