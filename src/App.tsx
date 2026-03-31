/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useStore, VisionMode } from './store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import VayuCanvas from './components/VayuCanvas';
import GlassPanel from './components/GlassPanel';
import { SHADERS } from './lib/ShaderLibrary';
import { Settings, Eye, Shield, Zap, Maximize, Minimize, ChevronDown, ChevronUp } from 'lucide-react';

export default function App() {
  const { 
    visionType, setVisionType, 
    mode, setMode,
    patternStack, setPatternStack,
    intensity, setIntensity,
    sessionTime, setSessionTime,
    isSafetyMode, setIsSafetyMode
  } = useStore();

  const [activeTab, setActiveTab] = useState('controls');
  const [isUIVisible, setIsUIVisible] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(sessionTime + 1);
      if (isSafetyMode && sessionTime >= 300) {
        setSessionTime(0);
        // Avoid alert in iframe
        console.log("Session time limit reached. Please take a break.");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionTime, isSafetyMode, setSessionTime]);

  const modes: VisionMode[] = ['precision', 'immersion', 'reaction', 'recovery'];
  const patternNames = Object.keys(SHADERS);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050505] text-white font-sans overflow-hidden flex flex-col">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <VayuCanvas />
      </div>

      <AnimatePresence>
        {!isUIVisible && (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed top-6 left-6 z-50 p-4 bg-black/50 backdrop-blur-xl border border-pink-500/50 rounded-full text-pink-400 shadow-[0_0_25px_rgba(236,72,153,0.6)] flex items-center justify-center"
            >
              <Eye size={28} className="drop-shadow-[0_0_12px_rgba(236,72,153,0.9)]" />
            </motion.div>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsUIVisible(true)}
              className="fixed top-6 right-6 z-50 p-4 bg-black/50 hover:bg-black/70 backdrop-blur-xl border border-white/20 rounded-full text-white shadow-lg transition-all flex items-center justify-center group"
              title="Restore UI"
            >
              <Minimize size={24} className="group-hover:scale-110 transition-transform" />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isUIVisible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full w-full absolute inset-0 z-10 pointer-events-none"
          >
            <header className="w-full p-4 pointer-events-auto shrink-0">
              <div className="glass header-glow flex items-center justify-between px-5 py-3 rounded-2xl shadow-[0_20px_50px_-10px_rgba(236,72,153,0.6)] border-b-2 border-pink-500/40 bg-black/40 backdrop-blur-md">
                <h1 className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">VAYU VIEW</h1>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-300 bg-white/10 px-2.5 py-1 rounded-md border border-white/5 shadow-inner">{Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}</span>
                  <button 
                    onClick={() => setIsUIVisible(false)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white border border-white/5"
                    title="Hide UI (Full View)"
                  >
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-grow w-full overflow-y-auto overflow-x-hidden pointer-events-auto px-4 pb-32 pt-2 scrollbar-hide">
              <div className="max-w-xl mx-auto w-full">
                <AnimatePresence mode="wait">
                  {activeTab === 'controls' && (
                    <motion.div 
                      key="controls"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 gap-6"
                    >
                      <GlassPanel className="w-full overflow-hidden">
                        <button 
                          onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
                          className="w-full flex items-center justify-start gap-2 text-left outline-none group"
                        >
                          <motion.div 
                            animate={{ rotate: isControlsCollapsed ? -90 : 0 }} 
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="text-gray-400 group-hover:text-white transition-colors flex-shrink-0"
                          >
                            <ChevronDown size={20} />
                          </motion.div>
                          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
                            <Eye size={20} className="text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"/> Vision Simulation
                          </h2>
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {!isControlsCollapsed && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col gap-6 pt-6">
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Vision Type</label>
                                  <div className="relative">
                                    <select 
                                      value={visionType}
                                      onChange={(e) => setVisionType(e.target.value as any)}
                                      className="w-full bg-black/40 p-4 pr-10 rounded-xl border border-white/10 focus:ring-2 focus:ring-pink-500 outline-none transition-all appearance-none text-sm"
                                    >
                                      <option value="normal">Normal</option>
                                      <option value="myopia">Myopia</option>
                                      <option value="hyperopia">Hyperopia</option>
                                      <option value="astigmatism">Astigmatism</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Pattern</label>
                                  <div className="relative">
                                    <select 
                                      value={patternStack[0] || 'spiral'}
                                      onChange={(e) => setPatternStack([e.target.value])}
                                      className="w-full bg-black/40 p-4 pr-10 rounded-xl border border-white/10 focus:ring-2 focus:ring-pink-500 outline-none transition-all appearance-none text-sm"
                                    >
                                      {patternNames.map(name => <option key={name} value={name}>{name}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                  </div>
                                </div>
      
                                <div className="space-y-3 pt-2">
                                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex justify-between">
                                    <span>Intensity</span>
                                    <span className="text-pink-500 font-mono bg-pink-500/10 px-2 py-0.5 rounded">{intensity}</span>
                                  </label>
                                  <input 
                                    type="range" min="1" max="10" value={intensity}
                                    onChange={(e) => setIntensity(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GlassPanel>
                    </motion.div>
                  )}
                  {activeTab === 'modes' && (
                    <motion.div 
                      key="modes"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      {modes.map((m) => (
                        <button 
                          key={m}
                          onClick={() => setMode(m)}
                          className={`p-6 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center ${mode === m ? 'bg-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.2)] border border-pink-500/50' : 'bg-white/5 hover:bg-white/10 border border-white/5'}`}
                        >
                          <Zap size={24} className={`mb-3 ${mode === m ? 'text-pink-400' : 'text-gray-400'}`} />
                          <span className={`text-sm font-medium ${mode === m ? 'text-pink-100' : 'text-gray-300'}`}>{m.charAt(0).toUpperCase() + m.slice(1)}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>

            <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-auto flex justify-center px-4">
              <AnimatePresence mode="wait">
                {!isNavCollapsed ? (
                  <motion.nav 
                    key="full-nav"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="glass flex justify-around items-center p-2 rounded-2xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] w-full max-w-sm bg-black/40 backdrop-blur-xl relative"
                  >
                    <button 
                      onClick={() => setIsNavCollapsed(true)}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/10 rounded-full p-1 text-gray-400 hover:text-white shadow-lg transition-colors"
                      title="Collapse Menu"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button onClick={() => setActiveTab('controls')} className={`flex-1 py-3 rounded-xl transition-all flex flex-col items-center gap-1.5 ${activeTab === 'controls' ? 'bg-white/10 text-pink-400 shadow-inner' : 'text-gray-400 hover:text-gray-200'}`}>
                      <Settings size={20} className={activeTab === 'controls' ? 'fill-pink-500/20' : ''}/>
                      <span className="text-[10px] uppercase tracking-wider font-bold">Controls</span>
                    </button>
                    <button onClick={() => setActiveTab('modes')} className={`flex-1 py-3 rounded-xl transition-all flex flex-col items-center gap-1.5 ${activeTab === 'modes' ? 'bg-white/10 text-pink-400 shadow-inner' : 'text-gray-400 hover:text-gray-200'}`}>
                      <Zap size={20} className={activeTab === 'modes' ? 'fill-pink-500/20' : ''}/>
                      <span className="text-[10px] uppercase tracking-wider font-bold">Modes</span>
                    </button>
                    <button onClick={() => setIsSafetyMode(!isSafetyMode)} className={`flex-1 py-3 rounded-xl transition-all flex flex-col items-center gap-1.5 ${isSafetyMode ? 'bg-green-500/20 text-green-400 shadow-inner border border-green-500/30' : 'text-gray-400 hover:text-gray-200'}`}>
                      <Shield size={20} className={isSafetyMode ? 'fill-green-500/20' : ''}/>
                      <span className="text-[10px] uppercase tracking-wider font-bold">Safety</span>
                    </button>
                  </motion.nav>
                ) : (
                  <motion.button
                    key="collapsed-nav"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    onClick={() => setIsNavCollapsed(false)}
                    className="glass px-6 py-3 rounded-full border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] bg-black/40 backdrop-blur-xl text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <ChevronUp size={18} />
                    <span className="text-xs font-bold tracking-wider uppercase">Menu</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
