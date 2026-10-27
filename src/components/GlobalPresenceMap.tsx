import { useState, useRef } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const DC_COORDS: [number, number] = [-77.0369, 38.9072];
const NOIDA_COORDS: [number, number] = [77.4538, 28.4744];

export default function GlobalPresenceMap() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (rafId.current !== null) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: clientX - rect.left,
          y: clientY - rect.top,
        });
      }
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full rounded-[3rem] overflow-hidden border border-white/5 mb-16 relative bg-[#05070a] group"
    >
      <div
        className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
        style={{
          left: mousePos.x - 250,
          top: mousePos.y - 250,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0" />

      <div className="flex items-center justify-end gap-6 px-10 pt-8 pb-2 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
          <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Global HQ</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Neural Hub</span>
        </div>
      </div>

      <div className="px-6 py-4">
        <ComposableMap
          width={960}
          height={320}
          projectionConfig={{ scale: 150, center: [20, 10] }}
          style={{ width: '100%', height: 'auto', display: 'block', position: 'relative', zIndex: 10 }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(255,215,0,0.02)"
                  stroke="rgba(255,215,0,0.1)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none', transition: 'all 0.3s' },
                    hover: { outline: 'none', fill: 'rgba(250,204,21,0.2)', stroke: 'rgba(250,204,21,0.6)', transition: 'all 0.3s' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          <Marker coordinates={DC_COORDS}>
            <circle r={18} fill="#facc15" opacity={0}>
              <animate attributeName="r" values="6;22;6" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle r={7} fill="#facc15" />
            <circle r={3.5} fill="#05070a" />
            <text textAnchor="middle" y={-16} style={{ fill: '#facc15', fontSize: '11px', fontWeight: '900', fontFamily: 'Inter', textShadow: '0 0 10px rgba(250,204,21,0.8)' }}>USA HQ</text>
          </Marker>

          <Marker coordinates={NOIDA_COORDS}>
            <circle r={15} fill="#3b82f6" opacity={0}>
              <animate attributeName="r" values="5;20;5" dur="3s" begin="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" begin="1.5s" repeatCount="indefinite" />
            </circle>
            <circle r={6} fill="#3b82f6" />
            <circle r={3} fill="#ffffff" />
            <text textAnchor="middle" y={-15} style={{ fill: '#60a5fa', fontSize: '10px', fontWeight: '900', fontFamily: 'Inter' }}>INDIA HUB</text>
          </Marker>
        </ComposableMap>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 px-10 pb-10 relative z-10 max-w-5xl mx-auto">
        {[
          { city: 'Washington, DC', status: 'Global HQ', flag: '🇺🇸', pill: 'bg-primary/20 border-primary/40', text: 'text-primary' },
          { city: 'Noida (Sector 2)', status: 'Neural Hub', flag: '🇮🇳', pill: 'bg-blue-500/20 border-blue-500/40', text: 'text-blue-400' },
          { city: 'Dubai', status: 'Coming Soon', flag: '🇦🇪', pill: 'bg-white/10 border-white/20', text: 'text-slate-300' }
        ].map((office, idx) => (
          <div key={idx} className="glass-card p-5 rounded-3xl border-white/10 bg-[#080b11]/80 hover:border-primary/40 transition-all group shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{office.flag}</span>
              <div className={`px-2.5 py-1 rounded-full ${office.pill} border text-[9px] font-black uppercase tracking-wider ${office.text}`}>
                {office.status}
              </div>
            </div>
            <h4 className="text-white font-black text-lg">{office.city}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
