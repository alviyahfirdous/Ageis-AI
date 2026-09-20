import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Paperclip, Zap, Bot, User, FileText,
  AlertTriangle, CheckCircle2, Clock, Loader2, Download,
  RefreshCw, ChevronDown, Compass, Eye
} from 'lucide-react';
import { sendChatMessage, uploadDocument } from '../services/api';

/* Demo responses for when backend is offline */
const DEMO_RESPONSES = [
  {
    answer: "Based on the equipment telemetry data retrieved from the knowledge base, the vibration anomaly in Compressor Unit C-204 indicates a **Level 2 bearing wear** pattern consistent with pages 14-17 of the Maintenance Manual.\n\n**Recommended Actions:**\n1. Schedule immediate inspection of bearing assembly\n2. Check lubrication levels — last service was 847 hours ago\n3. Monitor vibration amplitude (currently 4.2g, threshold is 5g)\n\n> [!NOTE] HITL approval required before scheduling shutdown.\n\n**Confidence:** 94.2% · Source: MaintManual_Rev3.pdf p.14-17",
    citations: [{ doc: 'MaintManual_Rev3.pdf', page: 14, score: 0.94 }, { doc: 'TelemetryLog_C204.csv', page: 1, score: 0.88 }],
    risk: 'medium',
    model: 'Qwen2.5 7B',
    tokens: 312,
  },
  {
    answer: "The P&ID diagram for Section 7B has been analyzed using **Qwen2-VL vision model**. I identified:\n\n- **3 pressure relief valves** (PRV-7B-01, PRV-7B-02, PRV-7B-03)\n- **2 isolation valves** currently in CLOSED position\n- Heat exchanger HX-7B-A showing scaling deposits on eastern inlet\n\nAll findings are traceable to the uploaded document with pixel-level bounding box annotations.\n\n**Confidence:** 91.7% · Source: PID_Section7B_Rev2.pdf",
    citations: [{ doc: 'PID_Section7B_Rev2.pdf', page: 3, score: 0.91 }],
    risk: 'low',
    model: 'Qwen2-VL 7B',
    tokens: 248,
  },
  {
    answer: "Code analysis complete. Found **2 critical issues** in the PLC ladder logic:\n\n```python\n# Issue 1 — Division by zero risk (Line 142)\nflow_rate = sensor_reading / time_delta  # time_delta can be 0\n\n# Fix:\nif time_delta > 0:\n    flow_rate = sensor_reading / time_delta\nelse:\n    flow_rate = 0.0\n```\n\nA **safety interlock bypass** was also detected at Line 891. This requires immediate review.\n\n**Risk Level: HIGH** — HITL approval gate triggered.",
    citations: [{ doc: 'PLC_Logic_Rev5.py', page: 1, score: 0.99 }],
    risk: 'high',
    model: 'Qwen-Coder 7B',
    tokens: 189,
  },
];

let demoIdx = 0;

function TypingIndicator() {
  return (
    <div className="wb-chat-msg assistant typing">
      <div className="wb-msg-avatar"><Bot size={15} /></div>
      <div className="wb-msg-bubble">
        <span className="wb-typing-dot" /><span className="wb-typing-dot" /><span className="wb-typing-dot" />
      </div>
    </div>
  );
}

function RiskBadge({ level }) {
  const map = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
  return (
    <span className="wb-risk-badge" style={{ '--rc': map[level] || '#5a5a5a' }}>
      {level === 'high' && <AlertTriangle size={10} />}
      {level === 'medium' && <Clock size={10} />}
      {level === 'low' && <CheckCircle2 size={10} />}
      {(level || 'unknown').toUpperCase()}
    </span>
  );
}

function ChatMessage({ msg, onOpenHitl, onOpenDoc }) {
  return (
    <div className={`wb-chat-msg ${msg.role}`}>
      <div className="wb-msg-avatar">
        {msg.role === 'assistant' ? <Bot size={15} /> : <User size={15} />}
      </div>
      <div className="wb-msg-content">
        <div className="wb-msg-bubble">
          {/* Render markdown-ish content */}
          {msg.text.split('\n').map((line, i) => {
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={i}><strong>{line.slice(2, -2)}</strong></p>;
            }
            if (line.startsWith('> [!NOTE]')) {
              return <div key={i} className="wb-msg-note">{line.slice(9).trim()}</div>;
            }
            if (line.startsWith('```')) return null;
            if (line.match(/^(\d+)\. /)) {
              return <p key={i} style={{ paddingLeft: '1rem' }}>{line}</p>;
            }
            if (line.startsWith('- ')) {
              return <p key={i} style={{ paddingLeft: '1rem' }}>• {line.slice(2)}</p>;
            }
            if (line.trim()) return <p key={i}>{line}</p>;
            return null;
          })}

          {msg.uploadedFile && (
            <button
              className="wb-uploaded-chip"
              onClick={() => onOpenDoc?.(msg.uploadedFile)}
              title="Click to view full uploaded document or drawing"
            >
              <Eye size={12} />
              <span>Click to View Document ({msg.uploadedFile.title})</span>
            </button>
          )}
        </div>

        {msg.role === 'assistant' && msg.meta && (
          <div className="wb-msg-meta">
            <RiskBadge level={msg.meta.risk} />
            <span className="wb-meta-pill"><Zap size={10} /> {msg.meta.model}</span>
            <span className="wb-meta-pill">{msg.meta.tokens} tokens</span>
            {msg.meta.citations?.length > 0 && (
              <span className="wb-meta-pill citations">
                <FileText size={10} /> {msg.meta.citations.length} source{msg.meta.citations.length !== 1 ? 's' : ''}
              </span>
            )}
            {msg.meta.risk === 'high' && (
              <button className="wb-hitl-trigger" onClick={onOpenHitl}>
                <AlertTriangle size={10} /> Requires HITL Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatWindow({
  activeWorkspace,
  activeModel,
  setActiveModel,
  onNewResponse,
  currentUser,
  onOpenHitl,
  injectedQuery,
  onClearInjectedQuery,
  onOpenDoc
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: `Hello ${currentUser?.name?.split(' ')[0] || 'Engineer'}, I'm AegisAI — your sovereign on-premise AI workbench. I'm operating in **${activeWorkspace}** mode.\n\nAll processing happens locally. Zero external API calls. How can I assist you today?`,
      meta: null,
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (injectedQuery) {
      setInput(injectedQuery);
      onClearInjectedQuery?.();
    }
  }, [injectedQuery]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: q, meta: null };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Try real API, fall back to demo
    const history = messages.slice(-6).map(m => ({ role: m.role, content: m.text }));
    const data = await sendChatMessage({ query: q, model: activeModel, workspace: activeWorkspace, history });

    let assistantMsg;
    if (data) {
      assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.answer || data.response || 'Response received.',
        meta: {
          risk: data.risk_level || 'low',
          model: data.model_used || activeModel,
          tokens: data.tokens_used || 0,
          citations: data.citations || [],
        }
      };
    } else {
      // Demo mode
      const demo = DEMO_RESPONSES[demoIdx % DEMO_RESPONSES.length];
      demoIdx++;
      assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: demo.answer,
        meta: { risk: demo.risk, model: demo.model, tokens: demo.tokens, citations: demo.citations },
      };
    }

    setMessages(prev => [...prev, assistantMsg]);
    onNewResponse?.(assistantMsg);
    setLoading(false);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImg = file.type.startsWith('image/');

    const processUpload = (imgSrc = null) => {
      const docItem = {
        title: file.name,
        doc: file.name,
        tag: `UP-${Math.floor(1000 + Math.random() * 9000)}`,
        discipline: file.name.toLowerCase().includes('pid') ? 'P&ID / Schematics' : 'Ingested File',
        standard: 'Local ChromaDB Vector Vault',
        imageSrc: imgSrc,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        text: `Ingested document '${file.name}' (${(file.size / 1024).toFixed(1)} KB). Processed via Surya OCR & Qwen2-VL local vector pipeline.`
      };

      const userMsg = {
        id: Date.now(),
        role: 'user',
        text: `📎 Uploaded: ${file.name}`,
        meta: null,
        uploadedFile: docItem
      };
      setMessages(prev => [...prev, userMsg]);
      setLoading(true);

      uploadDocument(file, activeWorkspace).then(() => {
        const resp = {
          id: Date.now() + 1,
          role: 'assistant',
          text: `Document **${file.name}** has been ingested into the knowledge base. ChromaDB embeddings generated. Click below to view the full document content.`,
          meta: { risk: 'low', model: 'Embedding Model', tokens: 0, citations: [{ doc: file.name, page: 1, score: 0.99 }] },
          uploadedFile: docItem
        };
        setMessages(prev => [...prev, resp]);
        setLoading(false);
      });
    };

    if (isImg) {
      const reader = new FileReader();
      reader.onload = (ev) => processUpload(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      processUpload(null);
    }

    e.target.value = '';
  };

  const handleClear = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      text: `Session cleared. Ready for new queries in **${activeWorkspace}** mode.`,
      meta: null,
    }]);
  };

  return (
    <main className="wb-chat">
      {/* Chat header */}
      <div className="wb-chat-topbar">
        <div className="wb-chat-title">
          <Bot size={17} />
          <span>{activeWorkspace}</span>
        </div>
        <div className="wb-chat-topbar-actions">
          <span className="wb-model-pill">
            <Zap size={11} /> {activeModel}
          </span>
          <button className="wb-topbar-btn" onClick={handleClear} title="Clear chat">
            <RefreshCw size={14} />
          </button>
          <button className="wb-topbar-btn" title="Export chat">
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="wb-chat-messages">
        {messages.map(msg => (
          <ChatMessage key={msg.id} msg={msg} onOpenHitl={onOpenHitl} onOpenDoc={onOpenDoc} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="wb-chat-input-area">
        <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleFile} accept=".pdf,.png,.jpg,.jpeg,.txt,.csv,.py" />
        <button className="wb-input-attach" onClick={() => fileRef.current?.click()} title="Upload document">
          <Paperclip size={16} />
        </button>
        <button
          className="wb-input-attach"
          onClick={() => onOpenHitl?.('drawings')}
          title="Open Engineering Drawings & Blueprints"
          style={{ color: '#F3B250' }}
        >
          <Compass size={16} />
        </button>
        <div className="wb-input-wrap">
          <textarea
            className="wb-chat-input"
            placeholder={`Query the ${activeWorkspace} knowledge base...`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            rows={1}
          />
        </div>
        <button
          className={`wb-send-btn${loading ? ' loading' : ''}`}
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          {loading ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
        </button>
      </div>
    </main>
  );
}
