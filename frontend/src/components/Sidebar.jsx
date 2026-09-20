import React, { useState } from 'react';
import {
  Cpu, Database, Eye, Code2, FileText, Settings,
  ChevronDown, ChevronRight, Bot, Zap, Shield, Activity,
  BookOpen, Upload, History, AlertCircle, Compass
} from 'lucide-react';

const WORKSPACES = [
  { id: 'maint',   label: 'Maintenance Intelligence', icon: Cpu },
  { id: 'inspect', label: 'Equipment Inspection',     icon: Eye },
  { id: 'code',    label: 'Code Analysis',            icon: Code2 },
  { id: 'docs',    label: 'Document Intelligence',    icon: FileText },
  { id: 'risk',    label: 'Risk Assessment',          icon: Shield },
];

const MODELS = [
  { id: 'Llama 3.1 8B',    label: 'Llama 3.1 8B',    tag: 'TEXT' },
  { id: 'Qwen2.5 7B',      label: 'Qwen2.5 7B',      tag: 'TEXT' },
  { id: 'Qwen-Coder 7B',   label: 'Qwen-Coder 7B',   tag: 'CODE' },
  { id: 'Qwen2-VL 7B',     label: 'Qwen2-VL 7B',     tag: 'VISION' },
  { id: 'Mistral 7B',      label: 'Mistral 7B',       tag: 'TEXT' },
];

const QUICK_ACTIONS = [
  { icon: Compass,     label: 'Engineering Drawings', tab: 'drawings' },
  { icon: Upload,      label: 'Upload Blueprint',     tab: 'drawings' },
  { icon: BookOpen,    label: 'Knowledge Base',        tab: 'context' },
  { icon: AlertCircle, label: 'HITL Approvals',        tab: 'hitl' },
];

export default function Sidebar({ activeWorkspace, setActiveWorkspace, activeModel, setActiveModel, onNavigateTab }) {
  const [wsOpen, setWsOpen] = useState(true);
  const [modelOpen, setModelOpen] = useState(true);

  return (
    <aside className="wb-sidebar">
      {/* Workspace Selector */}
      <div className="wb-sidebar-section">
        <button className="wb-sidebar-section-hdr" onClick={() => setWsOpen(!wsOpen)}>
          <Bot size={14} />
          <span>Workspaces</span>
          {wsOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>
        {wsOpen && (
          <div className="wb-sidebar-list">
            {WORKSPACES.map(ws => {
              const Icon = ws.icon;
              const active = activeWorkspace === ws.label;
              return (
                <button
                  key={ws.id}
                  className={`wb-sidebar-item${active ? ' active' : ''}`}
                  onClick={() => setActiveWorkspace(ws.label)}
                >
                  <Icon size={14} />
                  <span>{ws.label}</span>
                  {active && <span className="wb-sidebar-active-dot" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Model Selector */}
      <div className="wb-sidebar-section">
        <button className="wb-sidebar-section-hdr" onClick={() => setModelOpen(!modelOpen)}>
          <Zap size={14} />
          <span>Local Models</span>
          {modelOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>
        {modelOpen && (
          <div className="wb-sidebar-list">
            {MODELS.map(m => {
              const active = activeModel === m.id;
              return (
                <button
                  key={m.id}
                  className={`wb-sidebar-item model-item${active ? ' active' : ''}`}
                  onClick={() => setActiveModel(m.id)}
                >
                  <span className={`wb-model-tag tag-${m.tag.toLowerCase()}`}>{m.tag}</span>
                  <span>{m.label}</span>
                  {active && <span className="wb-sidebar-active-dot" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="wb-sidebar-section">
        <div className="wb-sidebar-section-hdr" style={{ cursor: 'default' }}>
          <Activity size={14} />
          <span>Quick Actions</span>
        </div>
        <div className="wb-sidebar-list">
          {QUICK_ACTIONS.map((a, i) => {
            const Icon = a.icon;
            return (
              <button
                key={i}
                className="wb-sidebar-item action-item"
                onClick={() => onNavigateTab?.(a.tab || 'context')}
              >
                <Icon size={14} />
                <span>{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Status Mini */}
      <div className="wb-sidebar-footer">
        <div className="wb-sidebar-sys">
          <div className="wb-sys-row">
            <Database size={12} />
            <span>ChromaDB</span>
            <span className="wb-sys-dot offline" />
          </div>
          <div className="wb-sys-row">
            <Cpu size={12} />
            <span>Ollama</span>
            <span className="wb-sys-dot offline" />
          </div>
          <div className="wb-sys-row">
            <Shield size={12} />
            <span>Egress</span>
            <span className="wb-sys-val">0 calls</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
