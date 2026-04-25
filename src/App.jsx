import { useState, useEffect, useRef } from "react";

const ALERTS = [
  { id: 1, lat: -2.4821, lng: 29.2154, area: 3.2, date: "2026-04-22", severity: "high", zone: "NW Sector", status: "active" },
  { id: 2, lat: -2.5103, lng: 29.2567, area: 1.8, date: "2026-04-20", severity: "medium", zone: "Central Ridge", status: "active" },
  { id: 3, lat: -2.4567, lng: 29.3012, area: 7.5, date: "2026-04-18", severity: "critical", zone: "Eastern Buffer", status: "active" },
  { id: 4, lat: -2.5289, lng: 29.1987, area: 0.9, date: "2026-04-15", severity: "low", zone: "SW Corridor", status: "resolved" },
  { id: 5, lat: -2.4912, lng: 29.2789, area: 4.1, date: "2026-04-12", severity: "high", zone: "NE Boundary", status: "active" },
  { id: 6, lat: -2.5456, lng: 29.2345, area: 2.3, date: "2026-04-10", severity: "medium", zone: "Southern Edge", status: "resolved" },
  { id: 7, lat: -2.4678, lng: 29.2678, area: 5.6, date: "2026-04-08", severity: "high", zone: "Central Basin", status: "resolved" },
  { id: 8, lat: -2.5034, lng: 29.3156, area: 1.2, date: "2026-04-05", severity: "low", zone: "East Valley", status: "resolved" },
];

const NDVI_TREND = [
  { month: "Nov", value: 0.82 }, { month: "Dec", value: 0.79 },
  { month: "Jan", value: 0.76 }, { month: "Feb", value: 0.73 },
  { month: "Mar", value: 0.71 }, { month: "Apr", value: 0.68 },
];

const SEVERITY_COLORS = { critical: "#ef4444", high: "#f97316", medium: "#eab308", low: "#22c55e" };

function MiniMap({ alerts, selected, onSelect }) {
  const parkBounds = { minLat: -2.56, maxLat: -2.44, minLng: 29.18, maxLng: 29.33 };
  const w = 100, h = 100;
  const toX = lng => ((lng - parkBounds.minLng) / (parkBounds.maxLng - parkBounds.minLng)) * (w - 16) + 8;
  const toY = lat => ((parkBounds.maxLat - lat) / (parkBounds.maxLat - parkBounds.minLat)) * (h - 16) + 8;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" style={{ background: "linear-gradient(135deg, #0d3320, #1a5c38)" }}>
      {/* Park boundary */}
      <polygon points="15,10 85,8 92,45 80,90 50,95 12,80 8,40" fill="none" stroke="#40916c" strokeWidth="1.2" strokeDasharray="3,2" opacity="0.7" />
      <text x="50" y="52" textAnchor="middle" fill="#52b78855" fontSize="6" fontWeight="bold">NYUNGWE</text>
      {/* Grid */}
      {[25,50,75].map(v => <line key={`h${v}`} x1="0" y1={v} x2="100" y2={v} stroke="#ffffff08" strokeWidth="0.3" />)}
      {[25,50,75].map(v => <line key={`v${v}`} x1={v} y1="0" x2={v} y2="100" stroke="#ffffff08" strokeWidth="0.3" />)}
      {/* Alerts */}
      {alerts.map(a => {
        const cx = toX(a.lng), cy = toY(a.lat);
        const isSelected = selected?.id === a.id;
        const color = SEVERITY_COLORS[a.severity];
        return (
          <g key={a.id} onClick={() => onSelect(a)} style={{ cursor: "pointer" }}>
            {a.status === "active" && <circle cx={cx} cy={cy} r={isSelected ? 7 : 5} fill={color} opacity="0.25">
              <animate attributeName="r" values={isSelected ? "7;10;7" : "5;8;5"} dur="2s" repeatCount="indefinite" />
            </circle>}
            <circle cx={cx} cy={cy} r={isSelected ? 4.5 : 3} fill={color} stroke={isSelected ? "#fff" : "none"} strokeWidth="1" />
          </g>
        );
      })}
    </svg>
  );
}

function NdviChart() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      <defs>
        <linearGradient id="ndviFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#52b788" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#52b788" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Y axis labels */}
      {[0.6, 0.7, 0.8].map((v, i) => (
        <text key={v} x="18" y={65 - i * 25} fill="#8d99ae" fontSize="5" textAnchor="end">{v.toFixed(1)}</text>
      ))}
      {/* Grid */}
      {[0,1,2].map(i => <line key={i} x1="22" y1={65 - i * 25} x2="195" y2={65 - i * 25} stroke="#ffffff08" strokeWidth="0.3" />)}
      {/* Area fill */}
      <path d={`M${NDVI_TREND.map((d, i) => `${22 + i * 34.6},${65 - ((d.value - 0.6) / 0.25) * 50}`).join(" L")} L${22 + 5 * 34.6},65 L22,65 Z`} fill="url(#ndviFill)" />
      {/* Line */}
      <polyline points={NDVI_TREND.map((d, i) => `${22 + i * 34.6},${65 - ((d.value - 0.6) / 0.25) * 50}`).join(" ")} fill="none" stroke="#52b788" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Dots & labels */}
      {NDVI_TREND.map((d, i) => (
        <g key={d.month}>
          <circle cx={22 + i * 34.6} cy={65 - ((d.value - 0.6) / 0.25) * 50} r="2.5" fill="#0d3320" stroke="#52b788" strokeWidth="1" />
          <text x={22 + i * 34.6} y="74" fill="#8d99ae" fontSize="5" textAnchor="middle">{d.month}</text>
        </g>
      ))}
      {/* Trend arrow */}
      <text x="170" y="12" fill="#ef4444" fontSize="6" fontWeight="bold">-17%</text>
    </svg>
  );
}

function SeverityBar({ alerts }) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  alerts.filter(a => a.status === "active").forEach(a => counts[a.severity]++);
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="flex rounded-full overflow-hidden h-3 w-full" style={{ background: "#0d1b2a" }}>
      {Object.entries(counts).map(([sev, count]) => count > 0 && (
        <div key={sev} style={{ width: `${(count / total) * 100}%`, background: SEVERITY_COLORS[sev] }} />
      ))}
    </div>
  );
}

export default function GeoSentinelDashboard() {
  const [view, setView] = useState("map");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [smsDemo, setSmsDemo] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const filtered = ALERTS.filter(a => filter === "all" || a.status === filter);
  const activeAlerts = ALERTS.filter(a => a.status === "active");
  const totalArea = activeAlerts.reduce((s, a) => s + a.area, 0);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0a0f1a", color: "#e2e8f0", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "#1b4332", borderBottom: "1px solid #2d6a4f" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#52b788", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: "bold", color: "#0a0f1a" }}>G</div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>GeoSentinel</span>
          <span style={{ fontSize: 10, color: "#95d5b2", marginLeft: 4 }}>DEMO</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: "#95d5b2" }}>
          <span>{time.toLocaleTimeString()}</span>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
          <span>LIVE</span>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 200, background: "#0d1b2a", borderRight: "1px solid #1e3a2f", display: "flex", flexDirection: "column", padding: "12px 0" }}>
          {[
            { id: "map", icon: "🗺", label: "Map View" },
            { id: "alerts", icon: "🔔", label: "Alerts" },
            { id: "trends", icon: "📊", label: "NDVI Trends" },
          ].map(nav => (
            <button key={nav.id} onClick={() => setView(nav.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", border: "none", background: view === nav.id ? "#1b4332" : "transparent", color: view === nav.id ? "#95d5b2" : "#6b7280", cursor: "pointer", fontSize: 13, textAlign: "left", borderLeft: view === nav.id ? "3px solid #52b788" : "3px solid transparent", transition: "all 0.2s" }}>
              <span>{nav.icon}</span>{nav.label}
              {nav.id === "alerts" && <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{activeAlerts.length}</span>}
            </button>
          ))}

          {/* Stats */}
          <div style={{ marginTop: "auto", padding: "12px 16px", borderTop: "1px solid #1e3a2f" }}>
            <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Quick Stats</div>
            {[
              { label: "Active Alerts", value: activeAlerts.length, color: "#f97316" },
              { label: "Area at Risk", value: `${totalArea.toFixed(1)} ha`, color: "#eab308" },
              { label: "Last Scan", value: "2 days ago", color: "#0096c7" },
              { label: "NDVI Avg", value: "0.68", color: "#52b788" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 11 }}>
                <span style={{ color: "#8d99ae" }}>{s.label}</span>
                <span style={{ color: s.color, fontWeight: 700 }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* SMS Demo Button */}
          <div style={{ padding: "8px 16px" }}>
            <button onClick={() => { setSmsDemo(true); setTimeout(() => setSmsDemo(false), 3000); }}
              style={{ width: "100%", padding: "8px 0", background: smsDemo ? "#22c55e" : "#2d6a4f", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600, transition: "all 0.3s" }}>
              {smsDemo ? "SMS Sent to Rangers!" : "Simulate SMS Alert"}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* View header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "#0f1729", borderBottom: "1px solid #1e293b" }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
              {view === "map" ? "Nyungwe National Park — Live Map" : view === "alerts" ? "Deforestation Alerts" : "NDVI Vegetation Trends"}
            </h2>
            {view === "alerts" && (
              <div style={{ display: "flex", gap: 6 }}>
                {["all", "active", "resolved"].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{ padding: "4px 12px", border: "1px solid " + (filter === f ? "#52b788" : "#1e293b"), borderRadius: 14, background: filter === f ? "#1b4332" : "transparent", color: filter === f ? "#95d5b2" : "#6b7280", cursor: "pointer", fontSize: 11, textTransform: "capitalize" }}>
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content area */}
          <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
            {view === "map" && (
              <div style={{ display: "flex", gap: 16, height: "100%" }}>
                <div style={{ flex: 1, borderRadius: 10, overflow: "hidden", border: "1px solid #1e3a2f", position: "relative" }}>
                  <MiniMap alerts={ALERTS} selected={selected} onSelect={setSelected} />
                  {/* Legend */}
                  <div style={{ position: "absolute", bottom: 10, left: 10, background: "#0a0f1aee", borderRadius: 8, padding: "8px 12px", fontSize: 10 }}>
                    {Object.entries(SEVERITY_COLORS).map(([sev, col]) => (
                      <div key={sev} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: col }} />
                        <span style={{ color: "#8d99ae", textTransform: "capitalize" }}>{sev}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detail panel */}
                <div style={{ width: 220, background: "#0d1b2a", borderRadius: 10, padding: 14, border: "1px solid #1e3a2f" }}>
                  {selected ? (
                    <>
                      <div style={{ fontSize: 12, color: "#52b788", fontWeight: 700, marginBottom: 8 }}>Alert #{selected.id}</div>
                      <div style={{ fontSize: 11, color: "#8d99ae", lineHeight: 2 }}>
                        <div><strong style={{ color: "#e2e8f0" }}>Zone:</strong> {selected.zone}</div>
                        <div><strong style={{ color: "#e2e8f0" }}>Area:</strong> <span style={{ color: SEVERITY_COLORS[selected.severity], fontWeight: 700 }}>{selected.area} ha</span></div>
                        <div><strong style={{ color: "#e2e8f0" }}>Severity:</strong> <span style={{ color: SEVERITY_COLORS[selected.severity], textTransform: "capitalize" }}>{selected.severity}</span></div>
                        <div><strong style={{ color: "#e2e8f0" }}>Date:</strong> {selected.date}</div>
                        <div><strong style={{ color: "#e2e8f0" }}>Status:</strong> <span style={{ color: selected.status === "active" ? "#f97316" : "#22c55e", textTransform: "capitalize" }}>{selected.status}</span></div>
                        <div><strong style={{ color: "#e2e8f0" }}>GPS:</strong> {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</div>
                      </div>
                    </>
                  ) : (
                    <div style={{ color: "#6b7280", fontSize: 12, textAlign: "center", marginTop: 30 }}>Click a marker on the map to view alert details</div>
                  )}
                </div>
              </div>
            )}

            {view === "alerts" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: "#8d99ae", marginBottom: 6 }}>Severity Distribution</div>
                  <SeverityBar alerts={ALERTS} />
                </div>
                {filtered.map(a => (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#0d1b2a", borderRadius: 8, border: `1px solid ${a.status === "active" ? "#1e3a2f" : "#1e293b"}`, cursor: "pointer", transition: "all 0.2s" }}
                    onClick={() => { setSelected(a); setView("map"); }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: SEVERITY_COLORS[a.severity], flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{a.zone}</div>
                      <div style={{ fontSize: 10, color: "#6b7280" }}>{a.date}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: SEVERITY_COLORS[a.severity] }}>{a.area} ha</div>
                    <div style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: a.status === "active" ? "#7c2d1244" : "#16532544", color: a.status === "active" ? "#f97316" : "#22c55e", textTransform: "capitalize" }}>{a.status}</div>
                  </div>
                ))}
              </div>
            )}

            {view === "trends" && (
              <div>
                <div style={{ background: "#0d1b2a", borderRadius: 10, padding: 16, border: "1px solid #1e3a2f", marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>NDVI Vegetation Index — 6 Month Trend</div>
                  <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 12 }}>Nyungwe National Park average. Values below 0.7 indicate significant canopy loss.</div>
                  <div style={{ height: 160 }}>
                    <NdviChart />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Baseline NDVI (2025)", value: "0.82", color: "#52b788" },
                    { label: "Current NDVI (Apr 2026)", value: "0.68", color: "#ef4444" },
                    { label: "Total Area Cleared (2026)", value: "47.2 ha", color: "#f97316" },
                    { label: "Alerts Generated", value: "34", color: "#0096c7" },
                  ].map(s => (
                    <div key={s.label} style={{ background: "#0d1b2a", borderRadius: 8, padding: 14, border: "1px solid #1e3a2f" }}>
                      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 6 }}>{s.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SMS notification toast */}
      {smsDemo && (
        <div style={{ position: "fixed", bottom: 20, right: 20, background: "#1b4332", border: "1px solid #52b788", borderRadius: 10, padding: "12px 20px", boxShadow: "0 8px 30px #00000066", zIndex: 100, animation: "slideIn 0.3s ease", maxWidth: 300 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#52b788", marginBottom: 4 }}>SMS Alert Dispatched</div>
          <div style={{ fontSize: 10, color: "#8d99ae" }}>
            "GEOSENTINEL ALERT: New deforestation detected in NW Sector. Area: 3.2ha. GPS: -2.4821, 29.2154. Respond immediately."
          </div>
          <div style={{ fontSize: 9, color: "#6b7280", marginTop: 4 }}>Sent to 5 registered rangers</div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1a; }
        ::-webkit-scrollbar-thumb { background: #1e3a2f; border-radius: 3px; }
      `}</style>
    </div>
  );
}
