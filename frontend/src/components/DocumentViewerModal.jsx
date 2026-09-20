import React, { useState } from 'react';
import {
  X, ZoomIn, ZoomOut, Maximize2, Download, FileText,
  Compass, Eye, CheckCircle2, AlertTriangle, ShieldCheck,
  Search, BookOpen, Layers, Tag, ExternalLink, RefreshCw
} from 'lucide-react';

/* ─── Pre-built Document Mock Contents ──────────────────────────── */
export const DOCUMENT_STORE = {
  'MaintManual_Rev3.pdf': {
    title: 'Centrifugal Compressor C-204 Maintenance Manual',
    type: 'pdf',
    discipline: 'Mechanical Maintenance',
    pageCount: 48,
    activePage: 14,
    docTag: 'MAN-C204-REV3',
    revision: 'Rev. 3 (2026)',
    compliance: 'API 617 / ISO 10439',
    pages: [
      {
        pageNum: 14,
        header: 'SECTION 4.2 — BEARING VIBRATION & WEAR ANALYSIS',
        highlightText: 'Bearing wear pattern classification Level 1-3 based on vibration amplitude thresholds. Amplitude exceeding 4.0g at operating speed indicates incipient roller raceway spalling.',
        content: `
CENTRIFUGAL COMPRESSOR TRAIN C-204 — MAINTENANCE SPECIFICATION
DOCUMENT NO: MAN-M-C204-003 | REV 3.2 | CLASSIFICATION: CONFIDENTIAL

4.2 BEARING VIBRATION MONITORING CRITERIA
--------------------------------------------------------------------------------
Peak Vibration (RMS)   Classification     Action Required
--------------------------------------------------------------------------------
< 2.5 g                Level 0 (Normal)   Routine monitoring every 500 operating hours.
2.5 g - 4.0 g          Level 1 (Alert)    Increase logging frequency to 24h intervals.
4.0 g - 5.0 g          Level 2 (Warning)  SCHEDULE IMMEDIATE BEARING HOUSING INSPECTION.
                                          Inspect lube oil ISO 4406 cleanliness code.
> 5.0 g                Level 3 (Danger)   TRIGGER AUTOMATIC EMERGENCY TRIP / HITL SHUTDOWN.

[RAG CITATION MATCH: PAGE 14, PARAGRAPH 3]
"Compressor Unit C-204 bearing telemetry indicates operating baseline 4.2g at 847
continuous run hours. This falls strictly within Level 2 Warning category requiring
borescope examination of drive-end journal and tilt-pad assemblies within 48 hours."

4.3 LUBRICATION OIL FLUSH PROCEDURE (PLAN 53B)
Synthetic ISO VG 46 turbine oil required. Minimum differential pressure across
duplex filter element must remain <= 0.35 bar. Check magnetic chip detector for
ferrous particle accumulation.
        `,
      },
      {
        pageNum: 15,
        header: 'SECTION 4.3 — TILT-PAD JOURNAL BEARING CLEARANCES',
        content: `
RECOMMENDED CLEARANCES & TOLERANCES (MILLIMETERS):
- Journal diameter: 120.000 mm (+0.000 / -0.015 mm)
- Diametral clearance: 0.140 mm - 0.180 mm
- Maximum allowable wear clearance before replacement: 0.250 mm
- Preload factor: 0.30 - 0.50
        `,
      }
    ]
  },
  'TelemetryLog_C204.csv': {
    title: 'Compressor C-204 Real-time Vibration Telemetry Log',
    type: 'csv',
    discipline: 'Condition Monitoring Telemetry',
    pageCount: 1,
    activePage: 1,
    docTag: 'LOG-C204-2026Q3',
    revision: 'Telemetry Feed Live',
    compliance: 'ISA-95 Level 2 SCADA Export',
    csvRows: [
      { timestamp: '2026-09-19 21:00:00', hours: '845.2', vibDE: '3.92g', vibNDE: '2.10g', tempDE: '78.4°C', oilPress: '3.4 bar', status: 'ALERT' },
      { timestamp: '2026-09-19 21:15:00', hours: '845.5', vibDE: '4.01g', vibNDE: '2.14g', tempDE: '79.2°C', oilPress: '3.4 bar', status: 'WARNING' },
      { timestamp: '2026-09-19 21:30:00', hours: '846.0', vibDE: '4.12g', vibNDE: '2.20g', tempDE: '81.0°C', oilPress: '3.3 bar', status: 'WARNING' },
      { timestamp: '2026-09-19 21:45:00', hours: '846.5', vibDE: '4.18g', vibNDE: '2.22g', tempDE: '82.6°C', oilPress: '3.3 bar', status: 'WARNING' },
      { timestamp: '2026-09-19 22:00:00', hours: '847.0', vibDE: '4.22g', vibNDE: '2.28g', tempDE: '84.1°C', oilPress: '3.2 bar', status: 'WARNING (PEAK)' },
    ]
  },
  'SOP_CompressorMaint.pdf': {
    title: 'Standard Operating Procedure — Compressor Inspection & LOTO',
    type: 'pdf',
    discipline: 'Plant Safety & Operations',
    pageCount: 22,
    activePage: 8,
    docTag: 'SOP-OPS-042',
    revision: 'Rev. 5 (2026)',
    compliance: 'OSHA 1910.147 / OHSAS 18001',
    pages: [
      {
        pageNum: 8,
        header: 'STEP 4 — LOCKOUT / TAGOUT (LOTO) & DEPRESSURIZATION',
        highlightText: 'Standard procedure for compressor bearing inspection and replacement schedule requiring verifiable double-block and bleed isolation.',
        content: `
STANDARD OPERATING PROCEDURE: COMPRESSOR C-204 OVERHAUL
DOCUMENT ID: SOP-OPS-042 | REVISION: 5 | PLANT AREA: SECTOR 4

MANDATORY SAFETY ISOLATION STEPS BEFORE BEARING CASING DISASSEMBLY:
1. Trip main 6.6 kV circuit breaker at Substation MCC-4B (Tag: LOTO-EE-204).
2. Close Suction Isolation Valve MOV-201 and Discharge Isolation Valve MOV-204.
3. Lock open vent valve VNT-204 to low-pressure flare header.
4. Verify residual nitrogen purge pressure reads 0.00 bar on gauge PI-204.
5. Permit required: Hot Work & Enclosed Space Entry Class A (signed by Arun Menon).
6. Verify oil skid heater power is locked out before oil drain.
        `,
      }
    ]
  }
};

/* ─── Document / Drawing Viewer Modal ────────────────────────────── */
export default function DocumentViewerModal({ item, onClose, onQueryInChat }) {
  const [zoom, setZoom] = useState(1);
  const [activePage, setActivePage] = useState(item?.page || 1);

  if (!item) return null;

  // Determine if viewing a drawing or document
  const isDrawing = Boolean(item.hotspots || item.thumbnailType || item.isDrawing);
  const docData = DOCUMENT_STORE[item.doc || item.title] || (isDrawing ? null : {
    title: item.title || item.doc || 'Uploaded Document',
    type: item.type || 'Document',
    discipline: item.discipline || 'Engineering Asset',
    pageCount: 1,
    activePage: 1,
    docTag: item.tag || 'DOC-UP-2026',
    revision: item.rev || 'Live',
    compliance: 'Local Air-Gapped Storage',
    pages: [{
      pageNum: 1,
      header: 'INGESTED DOCUMENT TEXT',
      content: item.text || item.excerpt || 'Document loaded in air-gapped sovereign workspace. ChromaDB vector embeddings generated.'
    }]
  });

  return (
    <div className="doc-modal-overlay" onClick={onClose}>
      <div className="doc-modal-container" onClick={e => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="doc-modal-header">
          <div className="doc-modal-title-wrap">
            {isDrawing ? (
              <Compass size={18} className="doc-modal-icon drawing" />
            ) : (
              <FileText size={18} className="doc-modal-icon doc" />
            )}
            <div>
              <div className="doc-modal-title">{item.title || item.doc}</div>
              <div className="doc-modal-meta">
                <span>{item.tag || docData?.docTag || 'DOC-2026'}</span>
                <span>·</span>
                <span>{item.standard || docData?.compliance || 'Air-Gapped Document'}</span>
                <span>·</span>
                <span className="doc-modal-badge">{isDrawing ? 'ENGINEERING BLUEPRINT' : 'RAG GROUNDED SOURCE'}</span>
              </div>
            </div>
          </div>

          <div className="doc-modal-actions">
            {/* Zoom Controls */}
            <div className="doc-modal-zoom">
              <button
                className="doc-zoom-btn"
                onClick={() => setZoom(z => Math.max(0.7, z - 0.15))}
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span className="doc-zoom-val">{Math.round(zoom * 100)}%</span>
              <button
                className="doc-zoom-btn"
                onClick={() => setZoom(z => Math.min(2.2, z + 0.15))}
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
              <button
                className="doc-zoom-btn"
                onClick={() => setZoom(1)}
                title="Reset Zoom"
              >
                <RefreshCw size={12} />
              </button>
            </div>

            {/* Query AI Button */}
            <button
              className="doc-modal-query-btn"
              onClick={() => {
                onQueryInChat?.(`Run detailed technical query on ${item.title || item.doc}`);
                onClose();
              }}
            >
              <Search size={13} />
              <span>Query Document in Chat</span>
            </button>

            {/* Close Button */}
            <button className="doc-modal-close-btn" onClick={onClose} title="Close (Esc)">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="doc-modal-body">
          {/* Left Canvas / Document Viewer */}
          <div className="doc-canvas-pane">
            <div
              className="doc-viewport-content"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}
            >
              {/* If User Uploaded Image */}
              {item.imageSrc && (
                <div className="doc-image-display">
                  <img src={item.imageSrc} alt={item.title} className="doc-full-img" />
                </div>
              )}

              {/* If Drawing Vector SVG */}
              {isDrawing && !item.imageSrc && item.renderSvg && (
                <div className="doc-svg-display">
                  {item.renderSvg()}
                </div>
              )}

              {/* If CSV Telemetry Log */}
              {docData?.type === 'csv' && docData?.csvRows && (
                <div className="doc-csv-sheet">
                  <div className="doc-sheet-header">
                    <FileText size={14} />
                    <span>Real-time Telemetry Ledger ({docData.docTag})</span>
                    <span className="doc-sheet-rows">{docData.csvRows.length} sample points</span>
                  </div>
                  <table className="doc-csv-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Run Hours</th>
                        <th>Vib DE (RMS)</th>
                        <th>Vib NDE</th>
                        <th>Bearing Temp</th>
                        <th>Lube Pressure</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docData.csvRows.map((row, idx) => (
                        <tr key={idx} className={row.status.includes('PEAK') ? 'peak-row' : ''}>
                          <td className="mono">{row.timestamp}</td>
                          <td className="mono">{row.hours} h</td>
                          <td className="mono alert-val">{row.vibDE}</td>
                          <td className="mono">{row.vibNDE}</td>
                          <td className="mono">{row.tempDE}</td>
                          <td className="mono">{row.oilPress}</td>
                          <td>
                            <span className={`doc-csv-badge ${row.status.includes('WARNING') ? 'warn' : 'alert'}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* If PDF / Text Document Page */}
              {docData?.pages && (
                <div className="doc-pdf-page">
                  <div className="doc-pdf-page-top">
                    <div className="doc-pdf-seal">
                      <ShieldCheck size={14} /> AEGIS-AI LOCAL AIR-GAP REPOSITORY
                    </div>
                    <div className="doc-pdf-page-no">
                      PAGE {docData.pages[0]?.pageNum || 1} OF {docData.pageCount || 1}
                    </div>
                  </div>

                  <h3 className="doc-pdf-header">{docData.pages[0]?.header}</h3>

                  {docData.pages[0]?.highlightText && (
                    <div className="doc-pdf-highlight-box">
                      <div className="doc-highlight-title">
                        <BookOpen size={13} /> Grounded Citation Matching RAG Retrieval
                      </div>
                      <p className="doc-highlight-body">{docData.pages[0].highlightText}</p>
                    </div>
                  )}

                  <pre className="doc-pdf-text">{docData.pages[0]?.content}</pre>
                </div>
              )}
            </div>
          </div>

          {/* Right Inspector Sidebar */}
          <div className="doc-inspector-pane">
            <div className="doc-inspect-title">
              <Tag size={14} /> Metadata & Inspection Ledger
            </div>

            <div className="doc-inspect-list">
              <div className="doc-inspect-item">
                <span className="doc-k">Document / Drawing ID</span>
                <span className="doc-v mono">{item.tag || docData?.docTag || 'N/A'}</span>
              </div>
              <div className="doc-inspect-item">
                <span className="doc-k">Discipline & Category</span>
                <span className="doc-v">{item.discipline || docData?.discipline || 'Engineering'}</span>
              </div>
              <div className="doc-inspect-item">
                <span className="doc-k">Standard / Compliance</span>
                <span className="doc-v">{item.standard || docData?.compliance || 'On-Premise Vault'}</span>
              </div>
              <div className="doc-inspect-item">
                <span className="doc-k">Air-Gap Egress Audit</span>
                <span className="doc-v safe">
                  <CheckCircle2 size={12} /> 0 Outbound Packets (Provably Air-Gapped)
                </span>
              </div>
            </div>

            {/* Hotspots or Equipment Tags if available */}
            {item.hotspots && item.hotspots.length > 0 && (
              <div className="doc-hotspot-list-wrap">
                <div className="doc-hotspot-hdr">
                  <Layers size={13} /> Tagged Equipment Components ({item.hotspots.length})
                </div>
                {item.hotspots.map((h, i) => (
                  <div key={h.id} className="doc-hotspot-card">
                    <div className="doc-hotspot-card-top">
                      <span className="doc-pin-idx">{i + 1}</span>
                      <strong>{h.tag}</strong>
                      <span className="doc-hotspot-lbl">{h.label}</span>
                    </div>
                    <div className="doc-hotspot-card-desc">{h.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions Footer */}
            <div className="doc-inspect-footer">
              <button
                className="doc-footer-btn primary"
                onClick={() => {
                  onQueryInChat?.(`Explain safety margins and operational recommendations for ${item.title || item.doc}`);
                  onClose();
                }}
              >
                Ask Assistant About This Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
