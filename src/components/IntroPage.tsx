import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Eye, Shield, Sparkles, Brain, ChevronRight } from 'lucide-react';

interface IntroPageProps {
  onEnter: () => void;
}

export default function IntroPage({ onEnter }: IntroPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragProgress, setDragProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Motion values for swipe to unlock
  const x = useMotionValue(0);
  const [trackWidth, setTrackWidth] = useState(200);

  useEffect(() => {
    if (trackRef.current) {
      setTrackWidth(trackRef.current.clientWidth - 64);
    }
    const handleResize = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.clientWidth - 64);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const opacity = useTransform(x, [0, trackWidth * 0.8], [1, 0.1]);
  const textOpacity = useTransform(x, [0, trackWidth * 0.5], [1, 0.2]);

  // Precise Hypnotic Optical Illusions & Vision Patterns Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse position state for subtle visual parallax and focus following
    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.tx = e.touches[0].clientX;
        mouse.ty = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic configuration for visual training simulations
    let time = 0;

    const render = () => {
      time += 0.8;
      
      // Obsidan background base with subtle trailing decay for fluid illusion after-images
      ctx.fillStyle = 'rgba(5, 5, 5, 0.18)';
      ctx.fillRect(0, 0, width, height);

      // Smooth interpolation for the gaze center
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      const centerX = width / 2 + (mouse.x - width / 2) * 0.08;
      const centerY = height / 2 + (mouse.y - height / 2) * 0.08;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // 1. Calibration Reticle Lines (Highly formal/professional visual layout)
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      
      // Horizontal and Vertical Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Precision Reticle Dials (Concentric dotted circles)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.setLineDash([4, 12]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, 220, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, 400, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // 2. Archimedean Double-Spiral Hypnotic Pattern
      // Creates a powerful visual illusion of expansion/contraction to train peripheral perception
      const numArms = 3;
      const spacing = 12; // Spacing of the spiral paths
      const maxRotations = 15; // Spiral expansion size
      
      ctx.lineWidth = 1.8;
      for (let arm = 0; arm < numArms; arm++) {
        ctx.beginPath();
        const armAngleOffset = (arm * Math.PI * 2) / numArms;
        
        // Use a subtle gradient to make it look highly professional and modern
        const spiralGrad = ctx.createRadialGradient(
          centerX, centerY, 10,
          centerX, centerY, Math.max(width, height) * 0.5
        );
        spiralGrad.addColorStop(0, '#f43f5e'); // Rose
        spiralGrad.addColorStop(0.5, '#6366f1'); // Indigo
        spiralGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.strokeStyle = spiralGrad;

        for (let theta = 0.1; theta < Math.PI * maxRotations; theta += 0.08) {
          const r = theta * spacing;
          if (r > Math.max(width, height) * 0.7) break;

          // Rotation rate modulated by time
          const angle = theta - time * 0.012 + armAngleOffset;
          const sx = centerX + Math.cos(angle) * r;
          const sy = centerY + Math.sin(angle) * r;

          if (theta === 0.1) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.stroke();
      }

      // 3. Counter-Rotating Interlocking Optical Rings
      // Stimulates binocular convergence and contrast adjustment
      ctx.lineWidth = 1.0;
      const numRings = 12;
      const maxRadius = Math.max(width, height) * 0.45;
      
      for (let i = 1; i <= numRings; i++) {
        const radius = (i * (maxRadius / numRings) + time * 0.4) % maxRadius;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        
        // Alternate clockwise/counter-clockwise dash rotation
        const direction = i % 2 === 0 ? 1 : -1;
        ctx.setLineDash([10, 25]);
        ctx.lineDashOffset = time * 0.3 * direction;
        
        ctx.strokeStyle = i % 2 === 0 
          ? 'rgba(168, 85, 247, 0.15)' // Violet
          : 'rgba(56, 189, 248, 0.12)'; // Sky Blue
          
        ctx.stroke();
      }
      ctx.setLineDash([]); // Reset

      // 4. Subtle Ambient Vision Field Aura (Central Warm/Cool gradient)
      const auraGradient = ctx.createRadialGradient(
        centerX, centerY, 5,
        centerX, centerY, Math.max(width, height) * 0.35
      );
      auraGradient.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
      auraGradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.03)');
      auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGradient;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Highly accurate swipe detection based on drag progress values
  const handleDrag = (_event: any, info: any) => {
    if (trackWidth <= 0) return;
    
    // Compute current progress relative to the slider track width
    const currentX = info.point.x - (trackRef.current?.getBoundingClientRect().left || 0) - 24;
    const progress = Math.min(Math.max(currentX / trackWidth, 0), 1);
    setDragProgress(progress);
    
    // Safely unlock when the drag hits the threshold
    if (progress >= 0.88 && !isUnlocked) {
      setIsUnlocked(true);
      setTimeout(() => {
        onEnter();
      }, 350);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050505] text-white overflow-hidden flex flex-col justify-center items-center z-50">
      {/* High-Precision Hypnotic Optical Illusion Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Grid overlay referencing professional medical visual scales */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none z-0" />

      {/* Intro Box Container with Blur Glass Theme */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 15 }}
        animate={isUnlocked ? { opacity: 0, scale: 1.05, y: -10 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-11/12 max-w-lg z-10 p-8 md:p-10 rounded-3xl backdrop-blur-3xl bg-black/55 border border-white/10 shadow-[0_30px_70px_-15px_rgba(99,102,241,0.2)] flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Glow corner effects */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

        {/* Pulsing Core Eye Logo with high-precision design */}
        <motion.div
          animate={{ 
            boxShadow: ["0 0 15px rgba(99,102,241,0.25)", "0 0 35px rgba(99,102,241,0.5)", "0 0 15px rgba(99,102,241,0.25)"],
            scale: [1, 1.02, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 relative"
        >
          {/* Subtle spinning reticle around the central logo */}
          <div className="absolute inset-0 border border-dashed border-indigo-400/20 rounded-full animate-[spin_10s_linear_infinite]" />
          <Eye size={34} className="drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-indigo-300 to-sky-400 mb-4 uppercase">
          VAYU VIEW
        </h1>

        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-sm font-light">
          GPU-Accelerated Visual Perception System. Designed for optical conditioning, contrast enhancement, and neural coordination.
        </p>

        {/* Core Value Props Grid */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8 text-left">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
            <div className="text-indigo-400 mt-0.5"><Sparkles size={16} /></div>
            <div>
              <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase">Visual Focus</h3>
              <p className="text-[10px] text-gray-400">Archimedean spirals &amp; custom-coded Gabor stimuli.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
            <div className="text-purple-400 mt-0.5"><Brain size={16} /></div>
            <div>
              <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase">Neurological</h3>
              <p className="text-[10px] text-gray-400">Conditioning ocular tracking and saccades.</p>
            </div>
          </div>
        </div>

        {/* Warning label / Safety indicator */}
        <div className="flex items-center gap-2 mb-8 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full">
          <Shield size={14} className="text-indigo-400" />
          <span className="text-[10px] text-indigo-300 font-semibold tracking-widest uppercase">Clinical Safety Protocols</span>
        </div>

        {/* SWIPE TO ENTER COMPONENT */}
        <div className="w-full space-y-2">
          <div 
            ref={trackRef}
            className="w-full h-14 bg-white/5 border border-white/10 rounded-full relative p-1 flex items-center overflow-hidden select-none"
          >
            {/* Shimmering text overlay inside track */}
            <motion.div 
              style={{ opacity: textOpacity }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <span className="text-xs font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-[length:200%_auto] animate-[shimmer_2s_infinite] uppercase">
                Swipe to Enter
              </span>
            </motion.div>

            {/* Glowing active background trail */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-rose-500/20 to-indigo-500/25 rounded-l-full pointer-events-none"
              style={{ width: `${dragProgress * 100}%`, transition: 'width 0.05s ease-out' }}
            />

            {/* Draggable Handle */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: trackWidth }}
              dragElastic={0.05}
              dragMomentum={false}
              onDrag={handleDrag}
              onDragEnd={() => {
                if (dragProgress < 0.88) {
                  setDragProgress(0);
                  x.set(0); // Safely reset motion value coordinates
                }
              }}
              style={{ x }}
              animate={dragProgress === 0 ? { x: 0 } : undefined}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 border border-white/20 flex items-center justify-center text-white cursor-grab active:cursor-grabbing shadow-[0_0_15px_rgba(99,102,241,0.5)] z-20 hover:scale-105 transition-transform"
            >
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronRight size={22} className="stroke-[2.5px]" />
              </motion.div>
            </motion.div>
          </div>
          <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-medium">
            Drag slider to verify calibration
          </span>
        </div>
      </motion.div>

      {/* Embedded CSS animation for text shimmer effect */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}

