/* ================================================================
   AegisAI — API Service Layer
   Connects to FastAPI backend at http://localhost:8000
   ================================================================ */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[AegisAI API] ${path} ->`, err.message);
    return null;
  }
}

/* Health */
export async function fetchHealthStatus() {
  const data = await apiFetch('/health');
  return data || {
    status: 'demo',
    ollama: 'offline',
    chromadb: 'offline',
    egress_calls: 0,
    uptime: '0s',
    models_loaded: [],
  };
}

/* Chat */
export async function sendChatMessage({ query, model, workspace, history = [] }) {
  return await apiFetch('/chat', {
    method: 'POST',
    body: JSON.stringify({ query, model, workspace, history }),
  });
}

/* RAG */
export async function ragQuery({ query, workspace }) {
  return await apiFetch('/rag/query', {
    method: 'POST',
    body: JSON.stringify({ query, workspace }),
  });
}

/* Upload */
export async function uploadDocument(file, workspace) {
  const form = new FormData();
  form.append('file', file);
  form.append('workspace', workspace);
  try {
    const res = await fetch(`${BASE_URL}/upload`, { method: 'POST', body: form });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[AegisAI API] upload ->', err.message);
    return null;
  }
}

/* HITL */
export async function submitHITLDecision({ taskId, decision, comment }) {
  return await apiFetch('/hitl/decide', {
    method: 'POST',
    body: JSON.stringify({ task_id: taskId, decision, comment }),
  });
}

/* Audit */
export async function fetchAuditLog(limit = 50) {
  return await apiFetch(`/audit?limit=${limit}`);
}

/* Models */
export async function fetchAvailableModels() {
  return await apiFetch('/models');
}

/* Egress Monitor */
export async function fetchEgressStats() {
  return await apiFetch('/egress');
}
