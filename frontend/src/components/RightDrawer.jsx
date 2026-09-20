import React, { useState } from 'react';
import {
  FileText, AlertTriangle, CheckCircle2, XCircle,
  Clock, BookOpen, Shield, ChevronRight, Eye, Compass
} from 'lucide-react';
import DrawingsSection from './DrawingsSection';

const SAMPLE_CITATIONS = [
  { doc: 'MaintManual_Rev3.pdf', page: 14, score: 0.94, excerpt: 'Bearing wear pattern classification Level 1-3 based on vibration amplitude thresholds...' },
  { doc: 'TelemetryLog_C204.csv', page: 1, score: 0.88, excerpt: 'Compressor C-204 vibration readings 2024-Q3: peak 4.2g at 847 operating hours...' },
  { doc: 'SOP_CompressorMaint.pdf', page: 8, score: 0.82, excerpt: 'Standard procedure for compressor bearing inspection and replacement schedule...' },
];

const SAMPLE_HITL = {
  taskId: 'TASK-2024-0891',
  created: '2026-09-19 21:48:03',
  risk: 'high',
  description: 'PLC ladder logic safety interlock bypass detected at Line 891. Automatic correction has been staged but requires human approval before deployment.',
  proposedAction: 'Revert Line 891 to safety interlock ON state and flag for code review.',
  approvedBy: null,
};

function ContextTab({ response, onOpenDoc }) {
  const citations = response?.meta?.citations?.length ? response.meta.citations : SAMPLE_CITATIONS;
  return (
    <div className="wb-drawer-content">
      <div className="wb-drawer-section-title"><BookOpen size={13} /> Retrieved Sources</div>
      {citations.map((c, i) => (
        <div
          key={i}
          className="wb-citation-card clickable"
          onClick={() => onOpenDoc?.(c)}
          title="Click to view full document & citation page"
        >
          <div className="wb-citation-top">
            <FileText size={13} />
            <span className="wb-citation-doc">{c.doc}</span>
            <span className="wb-citation-page">p.{c.page}</span>
            <span className="wb-citation-score">{(c.score * 100).toFixed(0)}%</span>
            <span className="wb-citation-view-hint"><Eye size={11} /> View</span>
          </div>
          {c.excerpt && <p className="wb-citation-excerpt">{c.excerpt}</p>}
        </div>
      ))}
      {response?.meta?.risk && (
        <div className="wb-drawer-section-title" style={{ marginTop: '20px' }}><Shield size={13} /> Risk Assessment</div>
      )}
      {response?.meta?.risk && (
        <div className={`wb-risk-card level-${response.meta.risk}`}>
          <div className="wb-risk-level">
            {response.meta.risk === 'high' && <AlertTriangle size={16} />}
            {response.meta.risk === 'medium' && <Clock size={16} />}
            {response.meta.risk === 'low' && <CheckCircle2 size={16} />}
            Risk Level: <strong>{response.meta.risk?.toUpperCase()}</strong>
          </div>
          {response.meta.risk === 'high' && (
            <p className="wb-risk-note">HITL approval required before any action is taken.</p>
          )}
        </div>
      )}
    </div>
  );
}

function HITLTab({ currentUser }) {
  const [decision, setDecision] = useState(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (dec) => {
    setDecision(dec);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="wb-drawer-content">
        <div className="wb-hitl-success">
          {decision === 'approve' ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
          <div className="wb-hitl-success-title">
            {decision === 'approve' ? 'Approved' : 'Rejected'}
          </div>
          <div className="wb-hitl-success-sub">
            Decision recorded by {currentUser?.name}. Audit ledger updated.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wb-drawer-content">
      <div className="wb-drawer-section-title"><AlertTriangle size={13} /> Pending HITL Review</div>
      <div className="wb-hitl-card">
        <div className="wb-hitl-header">
          <span className="wb-hitl-task-id">{SAMPLE_HITL.taskId}</span>
          <span className="wb-hitl-ts">{SAMPLE_HITL.created}</span>
        </div>
        <div className="wb-hitl-risk-badge">HIGH RISK</div>
        <p className="wb-hitl-desc">{SAMPLE_HITL.description}</p>
        <div className="wb-hitl-action">
          <div className="wb-hitl-action-label">Proposed Action:</div>
          <div className="wb-hitl-action-text">{SAMPLE_HITL.proposedAction}</div>
        </div>
        <textarea
          className="wb-hitl-comment"
          placeholder="Add review comment (optional)..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
        />
        <div className="wb-hitl-actions">
          <button className="wb-hitl-btn approve" onClick={() => handleSubmit('approve')}>
            <CheckCircle2 size={14} /> Approve
          </button>
          <button className="wb-hitl-btn reject" onClick={() => handleSubmit('reject')}>
            <XCircle size={14} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function AuditTab() {
  const logs = [
    { time: '21:48:03', user: 'PS', action: 'RAG Query', doc: 'MaintManual_Rev3.pdf', risk: 'low' },
    { time: '21:46:31', user: 'RK', action: 'HITL Approve', doc: 'TASK-0890', risk: 'high' },
    { time: '21:44:12', user: 'AM', action: 'Audit Export', doc: 'AuditLog_Sep.csv', risk: 'medium' },
    { time: '21:41:57', user: 'SI', action: 'Document Upload', doc: 'FleetData_Q3.xlsx', risk: 'low' },
    { time: '21:38:20', user: 'VS', action: 'SOP Retrieval', doc: 'SOP_Pump_Maint.pdf', risk: 'low' },
  ];
  const riskColor = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

  return (
    <div className="wb-drawer-content">
      <div className="wb-drawer-section-title"><Eye size={13} /> Immutable Audit Trail</div>
      {logs.map((l, i) => (
        <div key={i} className="wb-audit-row">
          <span className="wb-audit-time">{l.time}</span>
          <div className="wb-audit-avatar">{l.user}</div>
          <div className="wb-audit-info">
            <span className="wb-audit-action">{l.action}</span>
            <span className="wb-audit-doc">{l.doc}</span>
          </div>
          <span className="wb-audit-dot" style={{ background: riskColor[l.risk] }} />
        </div>
      ))}
    </div>
  );
}

const TABS = [
  { key: 'context',  label: 'Context',  Icon: BookOpen },
  { key: 'drawings', label: 'Drawings', Icon: Compass },
  { key: 'hitl',     label: 'HITL',     Icon: AlertTriangle },
  { key: 'audit',    label: 'Audit',    Icon: Eye },
];

export default function RightDrawer({ response, activeTab, setActiveTab, currentUser, onSendToChat, onOpenItem }) {
  return (
    <aside className={`wb-drawer${activeTab === 'drawings' ? ' expanded' : ''}`}>
      <div className="wb-drawer-tabs">
        {TABS.map(t => {
          const Icon = t.Icon;
          return (
            <button
              key={t.key}
              className={`wb-drawer-tab${activeTab === t.key ? ' active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'context'  && <ContextTab response={response} onOpenDoc={onOpenItem} />}
      {activeTab === 'drawings' && <DrawingsSection onSendToChat={onSendToChat} onOpenDrawing={onOpenItem} />}
      {activeTab === 'hitl'     && <HITLTab currentUser={currentUser} />}
      {activeTab === 'audit'    && <AuditTab />}
    </aside>
  );
}
