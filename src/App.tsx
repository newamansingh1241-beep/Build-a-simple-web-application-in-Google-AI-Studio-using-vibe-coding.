import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Snowflake, 
  Wind, 
  Settings2, 
  Activity, 
  Clock, 
  SlidersHorizontal,
  Info,
  RefreshCw,
  TrendingUp,
  Globe,
  Layers
} from 'lucide-react';

// Interfaces for our state elements
interface Particle {
  id: string;
  type: 'snowflake' | 'balloon';
  left: number;       // Percent position horizontally (5% to 95%)
  size: number;       // Dimension size (medium)
  duration: number;   // Travel transition duration (seconds)
  delay: number;      // Stagger delay (seconds, negative for initial pre-warm)
  color: string;      // Formal color scheme gradient or solid hex
  wind: number;       // Active drift offset
  createdAt: number;  // Spawning timestamp
}

// Sophisticated corporate/formal balloon palette
const BALLOON_COLORS = [
  'radial-gradient(circle at 35% 30%, #4f46e5 0%, #1e1b4b 100%)', // Midnight Indigo
  'radial-gradient(circle at 35% 30%, #be123c 0%, #4c0519 100%)', // Bordeaux Crimson
  'radial-gradient(circle at 35% 30%, #047857 0%, #022c22 100%)', // Forest Emerald
  'radial-gradient(circle at 35% 30%, #b45309 0%, #451a03 100%)', // Warm Amber Gold
  'radial-gradient(circle at 35% 30%, #0369a1 0%, #0c4a6e 100%)', // Regal Ocean Blue
  'radial-gradient(circle at 35% 30%, #4b5563 0%, #111827 100%)', // Executive Charcoal
];

export default function App() {
  // Application State
  const [activeEffect, setActiveEffect] = useState<'snowflakes' | 'balloons' | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Custom Controls (adds a touch of luxury features while keeping default triggers perfect)
  const [windSelection, setWindSelection] = useState<number>(0); // manual wind coefficient (-30 to +30 px)
  const [densitySetting, setDensitySetting] = useState<'medium' | 'high'>('medium');
  const [sessionCount, setSessionCount] = useState<number>(0);

  // References for keeping dynamic handlers fresh
  const uniqueIdCounter = useRef<number>(0);

  // Generate a distinct formal particle
  const createParticle = useCallback((
    type: 'snowflakes' | 'balloons', 
    isWarmup: boolean
  ): Particle => {
    uniqueIdCounter.current += 1;
    const id = `${type}-${uniqueIdCounter.current}-${Math.random().toString(36).substring(2, 5)}`;
    
    const left = Math.random() * 90 + 5; // 5% to 95% width spread
    
    // Medium-size definitions requested by user
    const size = type === 'snowflakes'
      ? Math.random() * 8 + 18       // 18px to 26px (perfect crisp medium snowflake)
      : Math.random() * 12 + 42;     // 42px to 54px (perfect legible medium balloon)

    // Symmetrical, organic durations
    const duration = type === 'snowflakes'
      ? Math.random() * 1.5 + 3.5    // 3.5s to 5s descent
      : Math.random() * 2.0 + 4.5;   // 4.5s to 6.5s ascent

    // Initial pre-warm shifts the animation start timeline backwards by animation duration percentage
    // which renders the particles pre-distributed throughout the screen immediately inside the iframe.
    const delay = isWarmup ? -(Math.random() * duration) : 0;
    
    const color = type === 'snowflakes' 
      ? '#ffffff' 
      : BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];

    return {
      id,
      type: type === 'snowflakes' ? 'snowflake' : 'balloon',
      left,
      size,
      duration,
      delay,
      color,
      wind: windSelection + (Math.random() - 0.5) * 15,
      createdAt: Date.now()
    };
  }, [windSelection]);

  // Activate environment effect
  const handleTrigger = (mode: 'snowflakes' | 'balloons') => {
    // Increment logs
    setSessionCount(prev => prev + 1);
    
    // Warm state and clear foreign particles instantly to pivot simulation cleanly
    setActiveEffect(mode);
    setTimeLeft(5.0);

    // Filter out previous styles to ensure crisp visual theme swap
    setParticles(prev => prev.filter(p => (mode === 'snowflakes' ? p.type === 'snowflake' : p.type === 'balloon')));

    // Generate beautiful initial scatter cohort to immediately occupy the stage elegantly
    const initialBatchSize = densitySetting === 'medium' ? 24 : 45;
    const warmBatch: Particle[] = [];
    for (let i = 0; i < initialBatchSize; i++) {
      warmBatch.push(createParticle(mode, true));
    }
    setParticles(prev => [...prev, ...warmBatch]);
  };

  // 1-second interval Garbage Collector to prevent state bloat/excess elements in DOM
  useEffect(() => {
    const gc = setInterval(() => {
      const now = Date.now();
      setParticles(prev => prev.filter(p => {
        const ageMs = now - p.createdAt;
        // Keep particles alive for at least 8.5 seconds to complete their motion path, 
        // especially offset warmup ones which are instantly recycled.
        return ageMs < 9000;
      }));
    }, 1000);

    return () => clearInterval(gc);
  }, []);

  // Timer loop & dynamic micro-spawner over the active 5 seconds
  useEffect(() => {
    if (!activeEffect) return;

    const startTime = Date.now();
    const durationMs = 5000; // strictly 5 seconds

    // Calculate spawn rate based on user performance selection
    const spawnPeriod = densitySetting === 'medium' ? 140 : 80;

    // Spawner tick
    const spawner = setInterval(() => {
      setParticles(prev => [...prev, createParticle(activeEffect, false)]);
    }, spawnPeriod);

    // Countdown clock using high performance render-frame animation loop
    let frameId: number;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, (durationMs - elapsed) / 1000);
      setTimeLeft(remaining);

      if (remaining > 0) {
        frameId = requestAnimationFrame(tick);
      } else {
        setActiveEffect(null);
        clearInterval(spawner);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(spawner);
    };
  }, [activeEffect, createParticle, densitySetting]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#fdfcfb] text-[#1a1a1a] p-6 md:p-12 select-none font-sans">
      
      {/* Absolute high-end subtle grain or elegant aesthetic structure */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-[radial-gradient(#1a1a1a_0.75px,transparent_0.75px)] [background-size:24px_24px]" />

      {/* NAV BAR */}
      <nav className="relative z-20 w-full flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-black/5 pb-8 mb-8">
        <div className="text-xs tracking-[0.3em] uppercase font-bold font-sans">
          Atmosphere Control System
        </div>
        <div className="text-xs tracking-[0.1em] uppercase font-sans opacity-50 font-mono">
          Ref. 8820-X // Winter-Spring Edition
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <main className="relative z-10 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
        
        {/* LEFT COLUMN: HERO TYPOGRAPHY & DISCOVERY INTERACTIVE DRIVERS */}
        <section className="col-span-1 lg:col-span-7 flex flex-col justify-center">
          <h1 className="text-[64px] sm:text-[90px] md:text-[110px] leading-[0.9] font-medium tracking-tighter mb-8 font-serif">
            Formal<br />
            <span className="italic font-light opacity-80">Dynamics</span>
          </h1>
          
          <p className="text-sm leading-relaxed max-w-lg opacity-70 mb-10 font-sans">
            Engineered for sophisticated visual environments. Our proprietary particle engine allows for the precise manifestation of seasonal and celebratory elements within high-end architectural contexts. Average snowflake diameters are calibrated at 22px; balloon spheres at 48px.
          </p>

          {/* DUAL INTERACTIVE PRIMARY EMITTERS */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch mb-10">
            {/* SNOWFLAKES EMITTER */}
            <button
              id="trigger-snowflakes-button"
              onClick={() => handleTrigger('snowflakes')}
              disabled={timeLeft > 0 && activeEffect === 'snowflakes'}
              className={`group relative px-10 py-5 overflow-hidden transition-all duration-300 font-sans text-xs uppercase tracking-widest cursor-pointer border flex items-center justify-between gap-4 select-none h-16 sm:w-64
                ${activeEffect === 'snowflakes'
                  ? 'bg-sky-50 border-sky-400 text-sky-900 pr-14'
                  : 'bg-[#1a1a1a] text-white border-[#1a1a1a] hover:bg-black hover:pr-14'
                }`}
            >
              <span className="relative z-10 font-bold">Snowflakes</span>
              <span className="relative z-10 font-mono opacity-50 lowercase text-[10px]">
                {activeEffect === 'snowflakes' ? `${timeLeft.toFixed(1)}s` : '5.0s'}
              </span>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                →
              </span>
            </button>

            {/* BALLOONS EMITTER */}
            <button
              id="trigger-balloons-button"
              onClick={() => handleTrigger('balloons')}
              disabled={timeLeft > 0 && activeEffect === 'balloons'}
              className={`group relative px-10 py-5 overflow-hidden transition-all duration-300 font-sans text-xs uppercase tracking-widest cursor-pointer border flex items-center justify-between gap-4 select-none h-16 sm:w-64
                ${activeEffect === 'balloons'
                  ? 'bg-rose-50 border-rose-400 text-rose-900 hover:bg-rose-100/70'
                  : 'border-black/20 text-[#1a1a1a] hover:bg-black/5 hover:border-black/40'
                }`}
            >
              <span className="relative z-10 font-bold">Balloons</span>
              <span className="relative z-10 font-mono opacity-50 lowercase text-[10px]">
                {activeEffect === 'balloons' ? `${timeLeft.toFixed(1)}s` : '5.0s'}
              </span>
            </button>
          </div>

          {/* FLUID CONSTANTS & CUSTOM PHYSICAL CONTROLS BRIEFBOARD */}
          <div className="border-t border-black/5 pt-8 max-w-xl">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-3.5 h-3.5 opacity-60" />
              <span className="text-[10px] uppercase tracking-widest opacity-60 font-sans font-bold">
                Fluid Calibration Constants
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Density Preset Config */}
              <div className="space-y-3">
                <label className="text-[11px] font-mono opacity-50 block uppercase tracking-wider">
                  Atmospheric Density Ratio
                </label>
                <div className="flex border border-black/10 rounded-none overflow-hidden p-0.5 bg-black/[0.02]">
                  <button
                    onClick={() => setDensitySetting('medium')}
                    className={`flex-1 text-center py-2 text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer
                      ${densitySetting === 'medium' ? 'bg-[#1a1a1a] text-white font-medium shadow-xs' : 'text-black/60 hover:text-black hover:bg-black/5'}`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setDensitySetting('high')}
                    className={`flex-1 text-center py-2 text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer
                      ${densitySetting === 'high' ? 'bg-[#1a1a1a] text-white font-medium shadow-xs' : 'text-black/60 hover:text-black hover:bg-black/5'}`}
                  >
                    High
                  </button>
                </div>
              </div>

              {/* Wind Offset Slider Config */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-mono opacity-50 uppercase tracking-wider">
                  <span>Wind Drift Vector</span>
                  <span className="font-bold text-black">{windSelection > 0 ? `+${windSelection}` : windSelection} px</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={windSelection}
                  onChange={(e) => setWindSelection(Number(e.target.value))}
                  className="w-full accent-[#1a1a1a] bg-black/10 h-[2px] appearance-none rounded-none cursor-ew-resize py-2"
                />
                <div className="flex justify-between font-mono text-[9px] opacity-40">
                  <span>West Drift</span>
                  <span>Neutral</span>
                  <span>East Drift</span>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: SOPHISTICATED EDITORIAL STATUS BOARD & GAUGES */}
        <section className="col-span-1 lg:col-span-5 border-t lg:border-t-0 lg:border-l border-black/5 pt-8 lg:pt-0 lg:pl-16 flex flex-col gap-10">
          
          {/* ATMOSPHERIC STATS GAUGES */}
          <div className="space-y-8">
            <div className="group transition-opacity duration-300">
              <div className="text-[10px] uppercase tracking-widest opacity-40 font-mono mb-2">Current State</div>
              <div className="text-3xl font-serif font-light italic text-[#1a1a1a] tracking-tight flex items-center gap-2">
                {activeEffect ? (
                  <>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    Simulating {activeEffect === 'snowflakes' ? 'Snow' : 'Balloons'}
                  </>
                ) : (
                  'Equilibrium'
                )}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest opacity-40 font-mono mb-2">Simulation Frequency</div>
              <div className="text-3xl font-light font-mono tabular-nums text-[#1a1a1a] tracking-tight">
                60.00Hz
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest opacity-40 font-mono mb-2">Atmospheric Density</div>
              <div className="text-3xl font-light font-mono tabular-nums text-[#1a1a1a] tracking-tight">
                {densitySetting === 'medium' ? '1.225 kg/m³' : '1.875 kg/m³'}
              </div>
            </div>
          </div>

          {/* MOLECULAR / PARTICLE DIAGNOSTIC STATS SUMMARY */}
          <div className="border-t border-black/5 pt-8 font-mono text-xs text-black/60 space-y-3.5">
            <span className="text-[10px] text-black/40 uppercase block tracking-widest font-bold mb-4 font-sans">
              System Diagnostics
            </span>
            <div className="flex justify-between border-b border-black/[0.04] pb-2">
              <span className="opacity-70">Active Render Buffer:</span>
              <span className="text-black font-semibold font-mono">{particles.length} particles</span>
            </div>
            <div className="flex justify-between border-b border-black/[0.04] pb-2">
              <span className="opacity-70">Buoyancy Rate Vector:</span>
              <span className="text-black font-semibold font-mono">
                {activeEffect === 'snowflakes' ? '-1.50 m/s' : activeEffect === 'balloons' ? '+2.20 m/s' : '0.00 m/s'}
              </span>
            </div>
            <div className="flex justify-between border-b border-black/[0.04] pb-2">
              <span className="opacity-70">Active Drift Angle:</span>
              <span className="text-black font-semibold font-mono">{windSelection}°</span>
            </div>
            <div className="flex justify-between border-b border-black/[0.04] pb-2">
              <span className="opacity-70">Cumulative Cycles:</span>
              <span className="text-black font-semibold font-mono">{sessionCount} cycles</span>
            </div>

            <div className="pt-2 flex justify-between gap-4 items-center">
              <button
                onClick={() => {
                  setParticles([]);
                  setActiveEffect(null);
                  setTimeLeft(0);
                }}
                className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-60 hover:opacity-100 border-b border-black pb-0.5 cursor-pointer transition-opacity"
              >
                Clear State Memory
              </button>
            </div>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="relative z-20 w-full border-t border-black/5 pt-8 mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-[10px] tracking-widest uppercase opacity-40">
        <div>Atmosphere Module v4.22.0</div>
        <div className="md:text-center">Authorized Engineering Hub</div>
        <div className="md:text-right">© 2026 Kinetic Arts Ltd.</div>
      </footer>

      {/* ========================================================== */}
      {/* ABSOLUTE BACKGROUND CANVAS CONTAINER FOR RENDERED PARTICLES */}
      {/* ========================================================== */}
      <div className="absolute inset-0 pointer-events-none z-30 w-full h-full overflow-hidden">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                opacity: 0,
                x: `${particle.left}vw`,
                y: particle.type === 'snowflake' ? '-10vh' : '110vh',
                scale: 0.8
              }}
              animate={{
                opacity: [0, 1, 1, 0.4, 0], // beautifully dissolve near edges
                x: [
                  `${particle.left}vw`, 
                  `calc(${particle.left}vw + ${particle.wind}px)`,
                  `calc(${particle.left}vw + ${particle.wind * 1.5}px)`,
                ],
                y: particle.type === 'snowflake' ? '110vh' : '-20vh',
                scale: 1,
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: "linear",
              }}
              style={{
                position: 'absolute',
                width: particle.size,
                height: particle.size,
                willChange: 'transform, opacity',
              }}
            >
              {particle.type === 'snowflake' ? (
                // Crisp Crystal Snowflake Vector Model modified for Editorial luxury palette
                <svg viewBox="0 0 24 24" className="w-full h-full text-indigo-400/70 drop-shadow-sm filter">
                  <path 
                    fill="currentColor" 
                    d="M12,2A1,1 0 0,0 11,3V6.36L8,4.63A1,1 0 0,0 6.63,4.93A1,1 0 0,0 6.93,6.3L9.93,8.03L6.93,9.76A1,1 0 0,0 6.63,11.13A1,1 0 0,0 8,11.43L11,9.7V14.3C10.59,14.63 10.3,15.11 10.13,15.68L6.44,14.3C6.44,14.3 6.44,14.3 6.43,14.3A1,1 0 0,0 5.06,14.93A1,1 0 0,0 5.69,16.3L9.38,17.68C9.55,18.25 10.03,18.7 10.61,18.89L10.61,21A1,1 0 0,0 11.61,22A1,1 0 0,0 12.61,21V18.89C13.19,18.7 13.67,18.25 13.84,17.68L17.53,16.3A1,1 0 0,0 18.16,14.93A1,1 0 0,0 16.79,14.3L13.1,15.68C12.93,15.11 12.64,14.63 12.23,14.3V9.7L15.23,11.43A1,1 0 0,0 16.6,11.13A1,1 0 0,0 16.3,9.76L13.3,8.03L16.3,6.3A1,1 0 0,0 16.6,4.93A1,1 0 0,0 15.23,4.63L12.23,6.36V3A1,1 0 0,0 11.23,2" 
                  />
                </svg>
              ) : (
                // Elegant Formal Rubber Balloon Vector Model with Gloss Highlights
                <div className="relative w-full h-full">
                  <svg 
                    viewBox="0 0 100 130" 
                    className="w-full h-full drop-shadow-md select-none pointer-events-none"
                    style={{ filter: "drop-shadow(0px 3px 5px rgba(0,0,0,0.12))" }}
                  >
                    {/* Gloss / highlight layer inside balloon backplane */}
                    <defs>
                      <radialGradient id={`shimmer-${particle.id}`} cx="35%" cy="30%" r="60%">
                        <stop offset="0%" stopColor="#fff" stopOpacity="0.32" />
                        <stop offset="60%" stopColor="transparent" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Rubber Balloon Main Inflatable Sphere */}
                    <path
                      d="M 50,15 A 32,36 0 1 1 50,87 A 32,36 0 1 1 50,15 Z"
                      fill={particle.color}
                    />

                    {/* Specular Shimmer overlay */}
                    <path
                      d="M 50,15 A 32,36 0 1 1 50,87 A 32,36 0 1 1 50,15 Z"
                      fill={`url(#shimmer-${particle.id})`}
                    />

                    {/* Tying Elastic Triangle Knot at the base */}
                    <polygon
                      points="46,86 54,86 50,93"
                      fill={particle.color.split(',')[1]?.trim()?.replace('100%)', '') || '#475569'}
                      opacity="0.9"
                    />

                    {/* Highly Fine String dangling behind the balloon body */}
                    <path
                      d="M 50,93 Q 44,105 52,114 T 47,128"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.2"
                      strokeDasharray="1.5 1.5"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
