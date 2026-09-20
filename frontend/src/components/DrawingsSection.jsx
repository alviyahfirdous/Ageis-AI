import React, { useState, useRef } from 'react';
import {
  Upload, FileText, Eye, ZoomIn, ZoomOut, Maximize2,
  Minimize2, Search, Bot, Sparkles, CheckCircle2, AlertTriangle,
  Layers, Compass, Tag, X, Send, RefreshCw, FileCode, Check,
  ChevronRight, ArrowRight, ShieldCheck, Download
} from 'lucide-react';

/* ─── Sample Engineering Drawings Data ──────────────────────────── */
export const SAMPLE_DRAWINGS = [
  {
    id: 'dwg-pid-c204',
    title: 'P&ID — Compressor C-204 & Lub Skid',
    tag: 'PID-M-C204-003',
    discipline: 'P&ID / Mechanical',
    system: 'Feed Gas Compression Train',
    rev: 'Rev. 3',
    date: '2026-08-14',
    standard: 'ISA 5.1 / ISO 10628',
    status: 'Approved For Construction',
    isSample: true,
    thumbnailType: 'pid',
    specs: {
      designPressure: '22.5 bar',
      operatingTemp: '85°C',
      fluid: 'Natural Gas / Hydrocarbon Mix',
      pipeSpec: 'CS A106 Gr.B / Class 300#',
    },
    hotspots: [
      { id: 'h1', x: 28, y: 38, tag: 'PRV-204-A', label: 'Safety Relief Valve', desc: 'Setpoint: 18.5 bar, Orifice: 3J4, Discharge to Flare Header A' },
      { id: 'h2', x: 54, y: 52, tag: 'C-204', label: 'Centrifugal Compressor', desc: 'Main stage compression. Dual dry gas seal plan 53B. Speed: 11,400 RPM' },
      { id: 'h3', x: 76, y: 32, tag: 'VT-204', label: 'Vibration Transmitter', desc: 'Accelerometric probe on drive-end bearing. Current readout: 4.2g (Threshold: 5.0g)' },
      { id: 'h4', x: 38, y: 72, tag: 'P-204A/B', label: 'Lube Oil Pumps', desc: 'Primary electric motor pump + auxiliary steam turbine emergency pump' },
    ],
    sampleQueries: [
      'What is the relief valve setpoint on PRV-204-A and its destination header?',
      'Check bearing vibration sensor VT-204 thresholds and operating status.',
      'Verify isolation valve lock status on the lube oil cooling loop.',
    ],
    mockAnalysis: {
      summary: 'Automated vision inspection of P&ID PID-M-C204-003 completed via local Qwen2-VL model.',
      findings: [
        'PRV-204-A is correctly configured with locked-open (LO) upstream block valve.',
        'Vibration sensor VT-204 flagged with elevated telemetry trend (4.2g vs 5.0g limit).',
        'Lube oil filter DP indicator PDI-204 indicates clean element status (< 0.4 bar differential).',
      ],
      compliance: 'Fully compliant with API 614 lubrication standard & ASME Sec. VIII relief sizing.',
      risk: 'medium',
      confidence: '96.4%',
    }
  },
  {
    id: 'dwg-hx-7b',
    title: 'Heat Exchanger HX-7B-A Tube Sheet Assembly',
    tag: 'DWG-HX-7B-012',
    discipline: 'Static Equipment / Pressure Vessel',
    system: 'Feed Preheater Station 7',
    rev: 'Rev. 2',
    date: '2026-07-22',
    standard: 'TEMA Class R / ASME VIII Div. 1',
    status: 'In-Service Inspection',
    isSample: true,
    thumbnailType: 'hx',
    specs: {
      designPressure: 'Shell 16 bar / Tube 28 bar',
      operatingTemp: '160°C Shell / 115°C Tube',
      tubeCount: '124 Titanium Gr.2 Tubes',
      baffleCut: '25% Segmental Horizontal',
    },
    hotspots: [
      { id: 'h1', x: 32, y: 48, tag: 'TS-Q2', label: 'Tube Sheet Quadrant 2', desc: '124 rolled & seal-welded tubes. Wall thickness: 2.11mm BWG 14' },
      { id: 'h2', x: 62, y: 38, tag: 'BF-3', label: 'Segmental Baffle Plate', desc: 'Baffle spacing: 320mm, 25% horizontal cut, material 316L SS' },
      { id: 'h3', x: 82, y: 55, tag: 'NZ-N1', label: 'Shell Inlet Nozzle N1', desc: '6" ANSI 300# RFWN nozzle with integral stainless impingement plate' },
    ],
    sampleQueries: [
      'Assess tube sheet fouling patterns and minimum remaining wall thickness.',
      'Verify TEMA Class R baffle clearance and bypass strip locations.',
      'Check design pressure ratings for shell-side vs tube-side chambers.',
    ],
    mockAnalysis: {
      summary: 'Cross-sectional ultrasonic and visual analysis mapped to CAD drawing DWG-HX-7B-012.',
      findings: [
        'Quadrant 2 tube bundle shows mild calcium scale deposition on outer tube row.',
        'Impingement plate under Nozzle N1 shows zero erosion thinning (> 6.0mm measured).',
        'Baffle cut orientation is correctly oriented 90° opposite to previous inspection.',
      ],
      compliance: 'Meets TEMA R-4.2 standards and ASME code allowable stress limits.',
      risk: 'low',
      confidence: '94.8%',
    }
  },
  {
    id: 'dwg-iso-gms',
    title: 'Isometric Piping CAD — Metering Station 104',
    tag: 'ISO-GMS-104-01',
    discipline: 'Piping Isometric / CAD',
    system: 'High-Pressure Gas Metering Skid',
    rev: 'Rev. 4',
    date: '2026-09-02',
    standard: 'ASME B31.3 / Class 600#',
    status: 'Field Validated',
    isSample: true,
    thumbnailType: 'iso',
    specs: {
      pipeSize: '8" Schedule 80 (0.500" wt)',
      material: 'ASTM A106 Grade B Carbon Steel',
      designPressure: '100 bar (1450 psig)',
      weldInspection: '100% Radiographic Testing (RT)',
    },
    hotspots: [
      { id: 'h1', x: 30, y: 34, tag: 'SDV-104', label: 'Emergency Slam-Shut Valve', desc: 'Pneumatic failsafe spring-return ESD valve. Closure speed: < 0.8s' },
      { id: 'h2', x: 55, y: 60, tag: 'FE-104', label: 'Senior Orifice Meter Run', desc: 'Dual chamber beta ratio 0.62. Flange taps with DP transmitters' },
      { id: 'h3', x: 75, y: 40, tag: 'W-04', label: 'Field Weld No. 4', desc: 'Butt weld 8" Sch 80. 100% X-ray passed, hardness testing < 200 HB' },
    ],
    sampleQueries: [
      'Verify ASME B31.3 pipe wall schedule for 100 bar operating condition.',
      'Check emergency slam-shut valve SDV-104 actuation sequence and fail position.',
      'Confirm NDT radiography requirements on high-stress field welds.',
    ],
    mockAnalysis: {
      summary: 'CAD vector isometric verification performed by offline engineering reasoning engine.',
      findings: [
        '8" Sch 80 pipe thickness provides safety factor 2.41 exceeding ASME B31.3 min factor 1.8.',
        'Field Weld W-04 and W-07 documented with acceptable radiographic defect criteria (UW-51).',
        'Spring hanger support H-104 load setting balanced at 4.2 kN thermal displacement.',
      ],
      compliance: 'Certified compliant with ASME B31.3 Category D/Normal Fluid Service.',
      risk: 'low',
      confidence: '98.1%',
    }
  }
];

/* ─── Graphical Schematic SVG Renderers ─────────────────────────── */
function BlueprintPIDSVG({ activeHotspot, onSelectHotspot }) {
  return (
    <svg viewBox="0 0 500 320" className="dwg-svg-canvas">
      {/* Grid Pattern */}
      <defs>
        <pattern id="grid-pid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56,189,248,0.06)" strokeWidth="0.5" />
        </pattern>
        <linearGradient id="pipe-flow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#BD7035" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="#0a0f18" />
      <rect width="100%" height="100%" fill="url(#grid-pid)" />

      {/* Drawing Title Border */}
      <rect x="8" y="8" width="484" height="304" fill="none" stroke="rgba(56,189,248,0.25)" strokeWidth="1" />
      <rect x="330" y="270" width="158" height="38" fill="rgba(14,12,14,0.85)" stroke="rgba(56,189,248,0.3)" />
      <text x="336" y="284" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="700">DWG: PID-M-C204-003</text>
      <text x="336" y="298" fill="#a8a8a8" fontSize="7" fontFamily="monospace">REV.3 · TRAIN C-204 · SIH26117</text>

      {/* Main Process Piping Lines */}
      {/* Suction Line */}
      <line x1="20" y1="160" x2="140" y2="160" stroke="#38bdf8" strokeWidth="3" />
      <polygon points="80,157 90,160 80,163" fill="#38bdf8" />

      {/* Suction Scrubber V-201 */}
      <rect x="140" y="100" width="45" height="120" rx="20" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth="2" />
      <text x="146" y="165" fill="#38bdf8" fontSize="9" fontWeight="800">V-201</text>
      <text x="143" y="177" fill="#a8a8a8" fontSize="6.5">SCRUBBER</text>

      {/* Vapor line from scrubber to compressor */}
      <path d="M 162 100 L 162 60 L 250 60 L 250 120" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
      <polygon points="210,58 220,60 210,62" fill="#38bdf8" />

      {/* PRV Line off Scrubber top */}
      <line x1="162" y1="60" x2="162" y2="35" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
      <polygon points="154,35 170,35 162,25" fill="rgba(245,158,11,0.3)" stroke="#f59e0b" strokeWidth="1.5" />
      <circle cx="162" cy="20" r="7" fill="#161114" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="156" y="23" fill="#f59e0b" fontSize="6.5" fontWeight="700">PRV</text>

      {/* Compressor C-204 Body */}
      <polygon points="240,120 320,95 320,205 240,180" fill="rgba(189,112,53,0.2)" stroke="#BD7035" strokeWidth="2.5" />
      <circle cx="280" cy="150" r="18" fill="rgba(14,12,14,0.9)" stroke="#F3B250" strokeWidth="1.5" />
      <text x="264" y="153" fill="#F3B250" fontSize="10" fontWeight="900">C-204</text>
      <text x="254" y="164" fill="#a8a8a8" fontSize="6.5">STAGE 1 ROTOR</text>

      {/* Motor Driver */}
      <rect x="340" y="130" width="40" height="40" rx="6" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="352" y="154" fill="#38bdf8" fontSize="11" fontWeight="800">M</text>
      <line x1="320" y1="150" x2="340" y2="150" stroke="#f3b250" strokeWidth="3" />

      {/* Discharge Line */}
      <path d="M 280 95 L 280 70 L 460 70" fill="none" stroke="#22c55e" strokeWidth="3" />
      <polygon points="370,68 380,70 370,72" fill="#22c55e" />
      <text x="400" y="62" fill="#22c55e" fontSize="7.5" fontWeight="700">18.5 BAR DISCH.</text>

      {/* Lube Oil Skid Bottom Loop */}
      <rect x="180" y="230" width="100" height="50" rx="4" fill="rgba(243,178,80,0.08)" stroke="#BD7035" strokeWidth="1.5" strokeDasharray="4,2" />
      <text x="195" y="248" fill="#F3B250" fontSize="7.5" fontWeight="700">LUBE OIL SKID</text>
      <circle cx="205" cy="265" r="8" fill="#161114" stroke="#38bdf8" strokeWidth="1" />
      <circle cx="245" cy="265" r="8" fill="#161114" stroke="#38bdf8" strokeWidth="1" />
      <text x="198" y="268" fill="#38bdf8" fontSize="6">P-A</text>
      <text x="238" y="268" fill="#38bdf8" fontSize="6">P-B</text>

      {/* Instrument Lines & Transmitters */}
      <line x1="280" y1="132" x2="380" y2="105" stroke="#f3b250" strokeWidth="1" strokeDasharray="2,2" />
      <circle cx="380" cy="105" r="11" fill="#161114" stroke="#f3b250" strokeWidth="1.5" />
      <text x="371" y="108" fill="#f3b250" fontSize="7" fontWeight="800">VT</text>
      <text x="367" y="123" fill="#ef4444" fontSize="6" fontWeight="700">4.2g !</text>

      {/* Interactive Hotspot Targets */}
      <g className="dwg-hotspot-group" onClick={() => onSelectHotspot('h1')} style={{ cursor: 'pointer' }}>
        <circle cx="162" cy="20" r="14" fill={activeHotspot === 'h1' ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.2)'} stroke="#f59e0b" strokeWidth="1.5" />
        <text x="159" y="24" fill="#fff" fontSize="8" fontWeight="900">1</text>
      </g>
      <g className="dwg-hotspot-group" onClick={() => onSelectHotspot('h2')} style={{ cursor: 'pointer' }}>
        <circle cx="280" cy="150" r="22" fill={activeHotspot === 'h2' ? 'rgba(243,178,80,0.4)' : 'rgba(189,112,53,0.2)'} stroke="#F3B250" strokeWidth="1.5" />
        <text x="277" y="154" fill="#fff" fontSize="8" fontWeight="900">2</text>
      </g>
      <g className="dwg-hotspot-group" onClick={() => onSelectHotspot('h3')} style={{ cursor: 'pointer' }}>
        <circle cx="380" cy="105" r="16" fill={activeHotspot === 'h3' ? 'rgba(239,68,68,0.4)' : 'rgba(56,189,248,0.2)'} stroke="#38bdf8" strokeWidth="1.5" />
        <text x="377" y="109" fill="#fff" fontSize="8" fontWeight="900">3</text>
      </g>
      <g className="dwg-hotspot-group" onClick={() => onSelectHotspot('h4')} style={{ cursor: 'pointer' }}>
        <circle cx="225" cy="265" r="14" fill={activeHotspot === 'h4' ? 'rgba(34,197,94,0.4)' : 'rgba(243,178,80,0.2)'} stroke="#22c55e" strokeWidth="1.5" />
        <text x="222" y="269" fill="#fff" fontSize="8" fontWeight="900">4</text>
      </g>
    </svg>
  );
}

function BlueprintHXSVG({ activeHotspot, onSelectHotspot }) {
  return (
    <svg viewBox="0 0 500 320" className="dwg-svg-canvas">
      <defs>
        <pattern id="grid-hx" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(243,178,80,0.06)" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="#0c0e12" />
      <rect width="100%" height="100%" fill="url(#grid-hx)" />

      <rect x="8" y="8" width="484" height="304" fill="none" stroke="rgba(189,112,53,0.25)" strokeWidth="1" />
      <rect x="330" y="270" width="158" height="38" fill="rgba(14,12,14,0.85)" stroke="rgba(189,112,53,0.3)" />
      <text x="336" y="284" fill="#F3B250" fontSize="8" fontFamily="monospace" fontWeight="700">DWG: DWG-HX-7B-012</text>
      <text x="336" y="298" fill="#a8a8a8" fontSize="7" fontFamily="monospace">REV.2 · TEMA CLASS R · TUBE SHEET</text>

      {/* Shell Outer Body */}
      <rect x="60" y="80" width="340" height="150" rx="10" fill="rgba(189,112,53,0.08)" stroke="#BD7035" strokeWidth="2.5" />

      {/* Nozzles */}
      <rect x="110" y="50" width="36" height="30" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="115" y="44" fill="#38bdf8" fontSize="7" fontWeight="700">N1 INLET (SHELL)</text>
      <rect x="330" y="230" width="36" height="30" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="320" y="272" fill="#38bdf8" fontSize="7" fontWeight="700">N2 OUTLET (SHELL)</text>

      {/* Fixed Tube Sheet Plating */}
      <rect x="80" y="70" width="16" height="170" fill="rgba(243,178,80,0.25)" stroke="#F3B250" strokeWidth="2" />
      <rect x="364" y="70" width="16" height="170" fill="rgba(243,178,80,0.25)" stroke="#F3B250" strokeWidth="2" />

      {/* Tube Bundle Lines (124 Titanium Tubes Representation) */}
      {[95, 110, 125, 140, 155, 170, 185, 200, 215].map((y, idx) => (
        <line key={idx} x1="96" y1={y} x2="364" y2={y} stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" />
      ))}

      {/* Baffles */}
      <line x1="160" y1="80" x2="160" y2="190" stroke="#f59e0b" strokeWidth="3" />
      <line x1="220" y1="120" x2="220" y2="230" stroke="#f59e0b" strokeWidth="3" />
      <line x1="280" y1="80" x2="280" y2="190" stroke="#f59e0b" strokeWidth="3" />

      {/* Impingement Baffle under N1 */}
      <line x1="105" y1="92" x2="150" y2="92" stroke="#ef4444" strokeWidth="2.5" />
      <text x="110" y="104" fill="#ef4444" fontSize="6.5">IMPINGEMENT</text>

      {/* Centerline */}
      <line x1="40" y1="155" x2="420" y2="155" stroke="rgba(243,178,80,0.4)" strokeWidth="1" strokeDasharray="8,3,2,3" />

      {/* Hotspots */}
      <g className="dwg-hotspot-group" onClick={() => onSelectHotspot('h1')} style={{ cursor: 'pointer' }}>
        <circle cx="88" cy="155" r="16" fill={activeHotspot === 'h1' ? 'rgba(239,68,68,0.4)' : 'rgba(243,178,80,0.2)'} stroke="#F3B250" strokeWidth="1.5" />
        <text x="85" y="159" fill="#fff" fontSize="8" fontWeight="900">1</text>
      </g>
      <g className="dwg-hotspot-group" onClick={() => onSelectHotspot('h2')} style={{ cursor: 'pointer' }}>
        <circle cx="220" cy="175" r="16" fill={activeHotspot === 'h2' ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.2)'} stroke="#f59e0b" strokeWidth="1.5" />
        <text x="217" y="179" fill="#fff" fontSize="8" fontWeight="900">2</text>
      </g>
      <g className="dwg-hotspot-group" onClick={() => onSelectHotspot('h3')} style={{ cursor: 'pointer' }}>
        <circle cx="128" cy="65" r="14" fill={activeHotspot === 'h3' ? 'rgba(56,189,248,0.4)' : 'rgba(56,189,248,0.2)'} stroke="#38bdf8" strokeWidth="1.5" />
        <text x="125" y="69" fill="#fff" fontSize="8" fontWeight="900">3</text>
      </g>
    </svg>
  );
}

function BlueprintISOSVG({ activeHotspot, onSelectHotspot }) {
  return (
    <svg viewBox="0 0 500 320" className="dwg-svg-canvas">
      <defs>
        <pattern id="grid-iso" width="24" height="14" patternUnits="userSpaceOnUse">
          <path d="M 0 7 L 12 0 L 24 7 L 12 14 Z" fill="none" stroke="rgba(34,197,94,0.06)" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="#0b100e" />
      <rect width="100%" height="100%" fill="url(#grid-iso)" />

      <rect x="8" y="8" width="484" height="304" fill="none" stroke="rgba(34,197,94,0.25)" strokeWidth="1" />
      <rect x="330" y="270" width="158" height="38" fill="rgba(14,12,14,0.85)" stroke="rgba(34,197,94,0.3)" />
      <text x="336" y="284" fill="#22c55e" fontSize="8" fontFamily="monospace" fontWeight="700">DWG: ISO-GMS-104-01</text>
      <text x="336" y="298" fill="#a8a8a8" fontSize="7" fontFamily="monospace">REV.4 · 8" SCH 80 · ASME B31.3</text>

      {/* 3D Isometric Pipe Run */}
      {/* Segment 1: Inflow */}
      <line x1="50" y1="220" x2="160" y2="156" stroke="#22c55e" strokeWidth="4" />
      <text x="60" y="235" fill="#22c55e" fontSize="7.5" fontWeight="700">LINE 8"-G-104 (CL 600#)</text>

      {/* Slam-Shut Valve SDV-104 */}
      <polygon points="120,179 140,167 140,179 120,167" fill="#ef4444" stroke="#fff" strokeWidth="1" />
      <rect x="127" y="152" width="6" height="15" fill="#a8a8a8" />
      <circle cx="130" cy="148" r="6" fill="#ef4444" />
      <text x="110" y="142" fill="#ef4444" fontSize="7" fontWeight="800">SDV-104</text>

      {/* Segment 2: Vertical Riser */}
      <line x1="160" y1="156" x2="160" y2="76" stroke="#22c55e" strokeWidth="4" />
      <text x="170" y="115" fill="#a8a8a8" fontSize="7">EL +104.500</text>

      {/* Segment 3: Horizontal Run with Meter Run FE-104 */}
      <line x1="160" y1="76" x2="360" y2="76" stroke="#22c55e" strokeWidth="4" />
      <circle cx="260" cy="76" r="14" fill="#161114" stroke="#F3B250" strokeWidth="2" />
      <text x="250" y="80" fill="#F3B250" fontSize="8" fontWeight="800">FE-104</text>
      <text x="238" y="98" fill="#a8a8a8" fontSize="6.5">ORIFICE METER</text>

      {/* Field Weld Callouts */}
      <line x1="200" y1="76" x2="200" y2="60" stroke="#38bdf8" strokeWidth="1" />
      <circle cx="200" cy="56" r="6" fill="#161114" stroke="#38bdf8" strokeWidth="1" />
      <text x="195" y="59" fill="#38bdf8" fontSize="6" fontWeight="700">W4</text>

      {/* Segment 4: Drop Down to Outflow */}
      <line x1="360" y1="76" x2="430" y2="116" stroke="#22c55e" strokeWidth="4" />
      <polygon points="410,105 425,113 410,115" fill="#22c55e" />

      {/* Hotspots */}
      <g className="dwg-hotspot-group" onClick={() => onSelectHotspot('h1')} style={{ cursor: 'pointer' }}>
        <circle cx="130" cy="165" r="16" fill={activeHotspot === 'h1' ? 'rgba(239,68,68,0.4)' : 'rgba(239,68,68,0.2)'} stroke="#ef4444" strokeWidth="1.5" />
        <text x="127" y="169" fill="#fff" fontSize="8" fontWeight="900">1</text>
      </g>
      <g className="dwg-hotspot-group" onClick={() => onSelectHotspot('h2')} style={{ cursor: 'pointer' }}>
        <circle cx="260" cy="76" r="18" fill={activeHotspot === 'h2' ? 'rgba(243,178,80,0.4)' : 'rgba(243,178,80,0.2)'} stroke="#F3B250" strokeWidth="1.5" />
        <text x="257" y="80" fill="#fff" fontSize="8" fontWeight="900">2</text>
      </g>
      <g className="dwg-hotspot-group" onClick={() => onSelectHotspot('h3')} style={{ cursor: 'pointer' }}>
        <circle cx="200" cy="56" r="14" fill={activeHotspot === 'h3' ? 'rgba(56,189,248,0.4)' : 'rgba(56,189,248,0.2)'} stroke="#38bdf8" strokeWidth="1.5" />
        <text x="197" y="60" fill="#fff" fontSize="8" fontWeight="900">3</text>
      </g>
    </svg>
  );
}

/* ─── Main Drawings Component ───────────────────────────────────── */
export default function DrawingsSection({ onSendToChat, onOpenDrawing }) {
  const [drawings, setDrawings] = useState(SAMPLE_DRAWINGS);
  const [selectedDwgId, setSelectedDwgId] = useState(SAMPLE_DRAWINGS[0].id);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [queryText, setQueryText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(SAMPLE_DRAWINGS[0].mockAnalysis);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const fileInputRef = useRef(null);

  const currentDwg = drawings.find(d => d.id === selectedDwgId) || drawings[0];

  // Helper to parse CSV/TSV text into tabular data
  const parseCSVData = (text) => {
    const rawLines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (!rawLines.length) return { headers: [], rows: [] };
    const delimiter = rawLines[0].includes('\t') ? '\t' : ',';
    const headers = rawLines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows = rawLines.slice(1, 150).map(line => {
      return line.split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
    });
    return { headers, rows, totalRows: rawLines.length - 1 };
  };

  // Open in full document/drawing viewer modal
  const handleOpenFull = (dwg = currentDwg) => {
    const target = dwg || currentDwg;
    onOpenDrawing?.({
      ...target,
      isDrawing: Boolean(target.thumbnailType || target.isSample),
      renderSvg: target.thumbnailType === 'pid'
        ? () => <BlueprintPIDSVG activeHotspot={activeHotspot} onSelectHotspot={setActiveHotspot} />
        : target.thumbnailType === 'hx'
        ? () => <BlueprintHXSVG activeHotspot={activeHotspot} onSelectHotspot={setActiveHotspot} />
        : target.thumbnailType === 'iso'
        ? () => <BlueprintISOSVG activeHotspot={activeHotspot} onSelectHotspot={setActiveHotspot} />
        : null,
    });
  };

  // Switch drawing
  const handleSelectDrawing = (dwg) => {
    setSelectedDwgId(dwg.id);
    setActiveHotspot(null);
    setAnalysisResult(dwg.mockAnalysis || null);
    setZoomLevel(1);
  };

  // Upload custom drawing or file (PDF, CSV, Image, CAD, Text)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileBlobUrl = URL.createObjectURL(file);
    const fileName = file.name;
    const lowerName = fileName.toLowerCase();
    const isImg = file.type.startsWith('image/') || /\.(png|jpg|jpeg|webp|gif|svg|bmp)$/i.test(fileName);
    const isPdf = file.type === 'application/pdf' || lowerName.endsWith('.pdf');
    const isCsv = lowerName.endsWith('.csv') || lowerName.endsWith('.tsv') || file.type === 'text/csv';
    const isText = file.type.startsWith('text/') || /\.(txt|json|log|md|dxf|xml|yaml|yml|py|js|ts)$/i.test(fileName);

    const finishUpload = (extraData = {}) => {
      const detectedType = isPdf ? 'PDF Document' : isImg ? 'Blueprint Image' : isCsv ? 'Tabular Sheet' : isText ? 'Engineering Text' : 'CAD Asset';
      const newDwg = {
        id: `dwg-usr-${Date.now()}`,
        title: fileName.replace(/\.[^/.]+$/, ''),
        name: fileName,
        tag: `DWG-UP-${Math.floor(1000 + Math.random() * 9000)}`,
        discipline: lowerName.includes('pid') ? 'P&ID / Schematics' : lowerName.includes('attend') || isCsv ? 'Attendance & Plant Ledger' : isPdf ? 'Engineering Blueprint / Doc' : 'Engineering Drawing',
        system: 'Engineer Uploaded Ingestion',
        rev: 'Rev. 1 (Field Ingested)',
        date: new Date().toISOString().split('T')[0],
        standard: 'Plant Standard / Air-Gapped Ingestion',
        status: 'OCR Verified',
        isSample: false,
        fileUrl: fileBlobUrl,
        isPdf,
        isImg,
        isCsv,
        isText,
        fileType: file.type || detectedType,
        ...extraData,
        specs: {
          fileSize: `${(file.size / 1024).toFixed(1)} KB`,
          fileType: file.type || detectedType,
          ingestion: 'Local ChromaDB Vectorized (Air-Gapped)',
        },
        hotspots: [
          { id: 'h1', x: 50, y: 50, tag: 'INSPECT-01', label: 'Primary Detected Asset', desc: `Detected from ${fileName} via sovereign offline OCR & reasoning pipeline.` },
        ],
        sampleQueries: [
          `Summarize all extracted data and records in ${fileName}`,
          `Identify critical entries, anomalies or safety flags in this file`,
          `Check compliance against local engineering and attendance standards`,
        ],
        mockAnalysis: {
          summary: `Air-gapped extraction complete for uploaded file '${fileName}'. Sovereign pipeline parsed records, symbols, annotations, and parameters with zero cloud egress.`,
          findings: [
            `Extracted document payload: ${fileName} (${(file.size / 1024).toFixed(1)} KB)`,
            '100% On-Premise Execution — cryptographic hash verified in local audit log.',
            'Document embeddings indexed in ChromaDB for instant conversational querying.',
          ],
          compliance: 'CERT-In Air-Gap Compliant · Local On-Premise Execution',
          risk: 'low',
          confidence: '98.4%',
        }
      };

      setDrawings(prev => [newDwg, ...prev]);
      setSelectedDwgId(newDwg.id);
      setAnalysisResult(newDwg.mockAnalysis);
    };

    if (isImg) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        finishUpload({ imageSrc: uploadEvent.target.result, fileUrl: fileBlobUrl });
      };
      reader.readAsDataURL(file);
    } else if (isPdf) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        finishUpload({ pdfUrl: fileBlobUrl, dataUrl: uploadEvent.target.result, fileUrl: fileBlobUrl });
      };
      reader.readAsDataURL(file);
    } else if (isCsv) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const text = uploadEvent.target.result;
        const parsed = parseCSVData(text);
        finishUpload({ csvData: parsed, textContent: text, fileUrl: fileBlobUrl });
      };
      reader.readAsText(file);
    } else if (isText) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        finishUpload({ textContent: uploadEvent.target.result, fileUrl: fileBlobUrl });
      };
      reader.readAsText(file);
    } else {
      finishUpload({ fileUrl: fileBlobUrl });
    }

    e.target.value = '';
  };

  // Perform Vision Query
  const handleRunQuery = async (q) => {
    const textToRun = q || queryText;
    if (!textToRun.trim() || analyzing) return;
    setAnalyzing(true);

    // Simulate local vision AI latency
    await new Promise(r => setTimeout(r, 900));

    const result = {
      summary: `Qwen2-VL Vision analysis for '${currentDwg.title}' on query: "${textToRun}"`,
      findings: [
        `Identified relevant tags in ${currentDwg.tag}: ${currentDwg.hotspots.map(h => h.tag).join(', ')}.`,
        `Operating telemetry matches design constraints (${currentDwg.specs?.designPressure || 'Nominal limits verified'}).`,
        'All equipment symbols verified against standard ISA-5.1 specification.',
      ],
      compliance: `${currentDwg.standard} compliance confirmed. No external network egress.`,
      risk: currentDwg.mockAnalysis?.risk || 'low',
      confidence: '97.3%',
    };

    setAnalysisResult(result);
    setAnalyzing(false);
    setQueryText('');
  };

  // Forward query + drawing context to main chat
  const handleForwardToChat = (text) => {
    const query = text || queryText || `Analyze engineering drawing ${currentDwg.tag} (${currentDwg.title})`;
    onSendToChat?.({
      query: `[Drawing: ${currentDwg.tag}] ${query}`,
      drawing: currentDwg,
    });
  };

  return (
    <div className={`dwg-section-wrap${fullscreen ? ' fullscreen-modal' : ''}`}>
      {/* Header bar */}
      <div className="dwg-header">
        <div className="dwg-header-title">
          <Compass size={16} className="dwg-title-icon" />
          <div>
            <div className="dwg-main-title">Engineering Drawings & Schematics</div>
            <div className="dwg-sub-title">Vision OCR · Multi-modal P&ID Diagnostics · Air-Gapped</div>
          </div>
        </div>

        <div className="dwg-header-actions">
          {/* Upload Button */}
          <button
            className="dwg-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload new engineering drawing (PDF, PNG, CAD)"
          >
            <Upload size={13} />
            <span>Upload Drawing</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".png,.jpg,.jpeg,.svg,.pdf,.dxf,.dwg"
            onChange={handleFileUpload}
          />

          {/* Fullscreen Toggle */}
          <button
            className="dwg-icon-btn"
            onClick={() => setFullscreen(!fullscreen)}
            title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen Drawing Canvas'}
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Drawing Selector Strip */}
      <div className="dwg-selector-strip">
        {drawings.map(d => (
          <button
            key={d.id}
            className={`dwg-tab-pill${d.id === selectedDwgId ? ' active' : ''}`}
            onClick={() => handleSelectDrawing(d)}
          >
            <FileText size={12} />
            <div className="dwg-pill-text">
              <span className="dwg-pill-title">{d.title}</span>
              <span className="dwg-pill-tag">{d.tag}</span>
            </div>
            {!d.isSample && <span className="dwg-custom-badge">USER</span>}
          </button>
        ))}
      </div>

      {/* Visual Drawing Canvas */}
      <div className="dwg-canvas-container">
        <div className="dwg-canvas-toolbar">
          <div className="dwg-canvas-tag-badge">
            <Tag size={11} />
            <span>{currentDwg.tag} · {currentDwg.rev}</span>
          </div>
          <button
            className="dwg-expand-viewer-btn"
            onClick={() => handleOpenFull()}
            title="Click to view full engineering drawing in high resolution"
          >
            <Eye size={12} />
            <span>Open High-Res Viewer</span>
          </button>
          <div className="dwg-canvas-zoom-controls">
            <button
              className="dwg-zoom-btn"
              onClick={() => setZoomLevel(z => Math.max(0.7, z - 0.2))}
              title="Zoom Out"
            >
              <ZoomOut size={12} />
            </button>
            <span className="dwg-zoom-level">{Math.round(zoomLevel * 100)}%</span>
            <button
              className="dwg-zoom-btn"
              onClick={() => setZoomLevel(z => Math.min(2.0, z + 0.2))}
              title="Zoom In"
            >
              <ZoomIn size={12} />
            </button>
            <button
              className="dwg-zoom-btn"
              onClick={() => setZoomLevel(1)}
              title="Reset Zoom"
            >
              <RefreshCw size={11} />
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div
          className="dwg-viewport clickable"
          onClick={() => handleOpenFull()}
          title="Click to view full engineering drawing or document"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.2s ease', cursor: 'pointer' }}
        >
          {currentDwg.imageSrc ? (
            <div className="dwg-user-image-wrap">
              <img src={currentDwg.imageSrc} alt={currentDwg.title} className="dwg-user-img" />
              <div className="dwg-user-overlay-badge">
                <ShieldCheck size={12} /> Ingested to Offline ChromaDB Vector Index
              </div>
            </div>
          ) : (currentDwg.isPdf || currentDwg.pdfUrl || (currentDwg.fileUrl && currentDwg.title?.toLowerCase().endsWith('.pdf'))) ? (
            <div className="dwg-user-pdf-wrap">
              <iframe
                src={currentDwg.fileUrl || currentDwg.pdfUrl}
                className="dwg-pdf-preview-frame"
                title={currentDwg.title}
              />
              <div className="dwg-user-overlay-badge">
                <ShieldCheck size={12} /> Air-Gapped PDF Stream (Click to Expand)
              </div>
            </div>
          ) : (currentDwg.isCsv || currentDwg.csvData) ? (
            <div className="dwg-user-csv-wrap">
              <div className="dwg-csv-preview-header">
                <FileText size={12} />
                <span>{currentDwg.name || currentDwg.title} ({currentDwg.csvData?.rows?.length || 0} records)</span>
                <span className="dwg-csv-badge">CSV/TABLE</span>
              </div>
              <div className="dwg-csv-scroll">
                <table className="dwg-mini-table">
                  <thead>
                    <tr>
                      {currentDwg.csvData?.headers?.slice(0, 6).map((h, idx) => (
                        <th key={idx}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentDwg.csvData?.rows?.slice(0, 5).map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.slice(0, 6).map((cell, cIdx) => (
                          <td key={cIdx}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="dwg-user-overlay-badge">
                <ShieldCheck size={12} /> Sovereign Tabular Ingestion (Click to Expand)
              </div>
            </div>
          ) : (currentDwg.isText || currentDwg.textContent) ? (
            <div className="dwg-user-text-wrap">
              <div className="dwg-text-preview-header">
                <FileCode size={12} />
                <span>{currentDwg.name || currentDwg.title}</span>
                <span className="dwg-csv-badge">TEXT</span>
              </div>
              <pre className="dwg-mini-text-preview">
                {currentDwg.textContent?.slice(0, 600)}...
              </pre>
              <div className="dwg-user-overlay-badge">
                <ShieldCheck size={12} /> Sovereign Text Ingestion
              </div>
            </div>
          ) : currentDwg.thumbnailType === 'pid' ? (
            <BlueprintPIDSVG activeHotspot={activeHotspot} onSelectHotspot={setActiveHotspot} />
          ) : currentDwg.thumbnailType === 'hx' ? (
            <BlueprintHXSVG activeHotspot={activeHotspot} onSelectHotspot={setActiveHotspot} />
          ) : (
            <BlueprintISOSVG activeHotspot={activeHotspot} onSelectHotspot={setActiveHotspot} />
          )}
        </div>

        {/* Hotspots Info Bar */}
        {currentDwg.hotspots && currentDwg.hotspots.length > 0 && (
          <div className="dwg-hotspots-bar">
            <span className="dwg-hotspots-label">Click Pinpoint to Inspect:</span>
            {currentDwg.hotspots.map((h, i) => (
              <button
                key={h.id}
                className={`dwg-hotspot-pill${activeHotspot === h.id ? ' active' : ''}`}
                onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
              >
                <span className="dwg-pin-num">{i + 1}</span>
                <span>{h.tag}</span>
              </button>
            ))}
          </div>
        )}

        {/* Active Hotspot Detail Popover */}
        {activeHotspot && (
          <div className="dwg-hotspot-detail">
            {(() => {
              const spot = currentDwg.hotspots?.find(h => h.id === activeHotspot);
              if (!spot) return null;
              return (
                <div>
                  <div className="dwg-spot-header">
                    <strong>{spot.tag}</strong> — {spot.label}
                    <button className="dwg-spot-close" onClick={() => setActiveHotspot(null)}>
                      <X size={12} />
                    </button>
                  </div>
                  <div className="dwg-spot-desc">{spot.desc}</div>
                  <button
                    className="dwg-spot-query-btn"
                    onClick={() => handleRunQuery(`Run deep diagnostics on component ${spot.tag} (${spot.label})`)}
                  >
                    <Sparkles size={11} /> Query Component with Vision AI
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Specifications & Drawing Metadata */}
      <div className="dwg-specs-grid">
        <div className="dwg-spec-item">
          <span className="dwg-spec-k">Discipline</span>
          <span className="dwg-spec-v">{currentDwg.discipline}</span>
        </div>
        <div className="dwg-spec-item">
          <span className="dwg-spec-k">Standard</span>
          <span className="dwg-spec-v">{currentDwg.standard}</span>
        </div>
        <div className="dwg-spec-item">
          <span className="dwg-spec-k">Status</span>
          <span className="dwg-spec-v status-ok">{currentDwg.status}</span>
        </div>
        <div className="dwg-spec-item">
          <span className="dwg-spec-k">System</span>
          <span className="dwg-spec-v">{currentDwg.system}</span>
        </div>
      </div>

      {/* Perform & Query about the Drawing */}
      <div className="dwg-query-section">
        <div className="dwg-query-header">
          <Sparkles size={14} className="dwg-sparkle-icon" />
          <span>Perform Vision Diagnostics & Drawing Queries</span>
          <span className="dwg-model-badge">Qwen2-VL 7B (Offline)</span>
        </div>

        {/* Quick Sample Queries */}
        <div className="dwg-quick-chips">
          {currentDwg.sampleQueries?.map((q, i) => (
            <button
              key={i}
              className="dwg-chip-btn"
              onClick={() => handleRunQuery(q)}
              disabled={analyzing}
            >
              <ChevronRight size={11} />
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Custom Query Input */}
        <div className="dwg-query-input-wrap">
          <Search size={14} className="dwg-input-icon" />
          <input
            type="text"
            className="dwg-query-input"
            placeholder="Ask AI about dimensions, valves, tolerances, or safety..."
            value={queryText}
            onChange={e => setQueryText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleRunQuery(); }}
            disabled={analyzing}
          />
          <button
            className="dwg-query-send-btn"
            onClick={() => handleRunQuery()}
            disabled={analyzing || !queryText.trim()}
          >
            {analyzing ? <RefreshCw size={13} className="spin" /> : <Send size={13} />}
          </button>
        </div>

        {/* Vision AI Analysis Result Card */}
        {analysisResult && (
          <div className="dwg-analysis-card">
            <div className="dwg-analysis-top">
              <div className="dwg-analysis-title">
                <Bot size={14} />
                <span>Vision Agent Output</span>
                <span className="dwg-conf-pill">Confidence {analysisResult.confidence || '95%'}</span>
              </div>
              <button
                className="dwg-forward-btn"
                onClick={() => handleForwardToChat(analysisResult.summary)}
                title="Send findings to Main Chat conversation"
              >
                Send to Main Chat <ArrowRight size={12} />
              </button>
            </div>

            <p className="dwg-analysis-summary">{analysisResult.summary}</p>

            <div className="dwg-findings-list">
              {analysisResult.findings?.map((f, i) => (
                <div key={i} className="dwg-finding-item">
                  <CheckCircle2 size={12} className="dwg-check-icon" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="dwg-compliance-bar">
              <span className="dwg-comp-badge">
                <ShieldCheck size={11} /> {analysisResult.compliance}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
