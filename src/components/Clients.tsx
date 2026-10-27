import { motion } from 'framer-motion';
import { 
  Building2, Laptop, Globe, Shield, Rocket, 
  Cpu, Activity, Anchor, Aperture, Award,
  Briefcase, Code, Database, Hexagon, Network,
  PieChart, Server, Star, Target, Zap, 
  Cloud, Command, Compass, Cpu as CpuIcon, Feather
} from 'lucide-react';

// Pool of icons to simulate different company logos
const iconPool = [
  Building2, Laptop, Globe, Shield, Rocket, Cpu, Activity, Anchor, 
  Aperture, Award, Briefcase, Code, Database, Hexagon, Network,
  PieChart, Server, Star, Target, Zap, Cloud, Command, Compass, Feather
];

// Pre-calculate positions so they don't jump around on re-renders
const nodes = Array.from({ length: 45 }).map((_, i) => {
  const isRing1 = i < 8;
  const isRing2 = i >= 8 && i < 22;
  const isRing3 = i >= 22 && i < 38;
  const isRing4 = i >= 38;

  // Very tight radii to match the dense cluster in the screenshot
  const ringRadius = isRing1 ? 100 : isRing2 ? 170 : isRing3 ? 240 : 310;
  
  // Add randomness to the radius for an organic scatter effect
  const radius = ringRadius + (Math.random() * 40 - 20);
  
  // Distribute evenly per ring
  const itemsInRing = isRing1 ? 8 : isRing2 ? 14 : isRing3 ? 16 : 12;
  const angleSpread = (Math.PI * 2) / itemsInRing;
  
  // Index within the ring
  const ringIndex = isRing1 ? i : isRing2 ? i - 8 : isRing3 ? i - 22 : i - 38;
  
  const angle = ringIndex * angleSpread + (Math.random() * 0.4 - 0.2);

  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  
  // Varied sizes like the screenshot
  const size = Math.random() * 25 + 45; 
  
  const IconComponent = iconPool[Math.floor(Math.random() * iconPool.length)];

  // Random colors to make it look like actual diverse logos
  const colors = ['text-blue-600', 'text-red-500', 'text-emerald-600', 'text-purple-600', 'text-orange-500', 'text-indigo-600'];
  const iconColor = colors[Math.floor(Math.random() * colors.length)];
  
  // 15% chance to be a dark logo node like the screenshot
  const isDark = Math.random() < 0.15;

  return {
    id: i,
    x,
    y,
    size,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 3,
    Icon: IconComponent,
    color: isDark ? 'text-white' : iconColor,
    bg: isDark ? 'bg-[#0a0a0a]' : 'bg-white',
  };
});

export default function Clients() {
  // Total duration for one full orbit (in seconds)
  const orbitDuration = 60;

  return (
    <section className="py-20 bg-white relative overflow-hidden flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-10 relative z-10">
        <h2 className="text-5xl md:text-6xl font-medium text-black tracking-tight">
          Our <span className="text-[#FBBF24]">Clients</span>
        </h2>
      </div>

      {/* Orbit Container */}
      <div className="relative w-full max-w-[900px] h-[800px] flex items-center justify-center mt-4">
        
        {/* The Central Node (Static) */}
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="absolute z-30 w-[140px] h-[140px] rounded-full bg-[#0a0a0a] flex items-center justify-center shadow-2xl border-[6px] border-white"
        >
          <div className="text-center">
            <h3 className="text-white font-black text-lg uppercase tracking-[0.2em] leading-none mb-1">
              Rank
            </h3>
            <h3 className="text-[#FBBF24] font-black text-lg uppercase tracking-[0.2em] leading-none italic">
              Rise
            </h3>
          </div>
        </motion.div>

        {/* Orbiting Nodes Container (Spins continuously) */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-20"
          animate={{ rotate: 360 }}
          transition={{ duration: orbitDuration, repeat: Infinity, ease: "linear" }}
        >
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute"
              style={{
                transform: `translate(${node.x}px, ${node.y}px)`,
              }}
            >
              {/* Counter-spin so the icons stay upright */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: orbitDuration, repeat: Infinity, ease: "linear" }}
              >
                {/* Floating animation and Entrance */}
                <motion.div
                  className={`rounded-full ${node.bg} shadow-[0_8px_20px_rgba(0,0,0,0.08)] flex items-center justify-center border border-gray-100/50 hover:scale-125 hover:shadow-2xl hover:border-primary/50 transition-all cursor-pointer relative group`}
                  style={{
                    width: node.size,
                    height: node.size,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "50px" }}
                  animate={{
                    y: [-8, 8, -8],
                  }}
                  transition={{
                    opacity: { delay: node.delay * 0.1, duration: 0.5 },
                    scale: { delay: node.delay * 0.1, duration: 0.5, type: 'spring', bounce: 0.4 },
                    y: {
                      repeat: Infinity,
                      duration: node.duration,
                      ease: "easeInOut",
                      delay: node.delay,
                    }
                  }}
                >
                  <node.Icon 
                    className={`${node.color} transition-transform group-hover:scale-110`} 
                    size={node.size * 0.45} 
                    strokeWidth={node.bg === 'bg-white' ? 2 : 1.5}
                  />
                </motion.div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
