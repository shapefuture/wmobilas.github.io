
import React, { useEffect, useRef } from 'react';

/**
 * BIO-SWARM SIMULATION v3
 * 
 * 1. "Borboletas" (Butterflies): Complex CSS rotational mechanics for 2 high-fidelity hero insects.
 * 2. "Fireflies" (Canvas): Multi-waypoint path system emulating the long, wandering 
 *    movement found in fly.txt (200s cycle, 16-28 random steps).
 */

const ButterflyUnit = () => (
    <>
        <div className="borboleta-1">
            <div className="borboleta-oval-squish">
                <div className="borboleta-oval">
                    <div className="borboleta-radial">
                        <div className="borboleta-gfx">
                            <div className="borboleta-anim"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="borboleta-2">
            <div className="borboleta-oval-squish">
                <div className="borboleta-oval">
                    <div className="borboleta-radial">
                        <div className="borboleta-gfx">
                            <div className="borboleta-anim"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);

const FireflyCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let frameId: number;

        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (rect) {
                width = rect.width;
                height = rect.height;
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                ctx.scale(dpr, dpr);
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;
            }
        };

        const quantity = 45;
        const waypointCount = 20; // Emulating steps: random(12) + 16 from fly.txt
        
        interface Waypoint {
            x: number;
            y: number;
            scale: number;
        }

        interface Firefly {
            path: Waypoint[];
            currentIdx: number;
            moveProgress: number;
            moveSpeed: number;
            
            orbitAngle: number;
            orbitSpeed: number;
            orbitRadius: number;
            
            flashProgress: number;
            flashSpeed: number;
            flashDelay: number;
            
            baseSize: number;
        }

        const createWaypoint = (): Waypoint => ({
            x: (Math.random() * 100) - 50, // -50vw to 50vw range as per fly.txt
            y: (Math.random() * 100) - 50, // -50vh to 50vh
            scale: (Math.random() * 0.75) + 0.25 // scale(random(75)/100 + .25)
        });

        const createFirefly = (): Firefly => ({
            path: Array.from({ length: waypointCount }, createWaypoint),
            currentIdx: 0,
            moveProgress: Math.random(),
            // Very slow movement to emulate 200s total cycle
            moveSpeed: 0.0005 + Math.random() * 0.001, 
            
            orbitAngle: Math.random() * Math.PI * 2,
            orbitSpeed: (Math.random() * 0.003 + 0.002), // 8-18s rotation
            orbitRadius: (window.innerWidth * 0.1), // 10vw pivot
            
            flashProgress: 0,
            flashSpeed: 1 / (4000 + Math.random() * 6000) * 60,
            flashDelay: Math.random() * 5000,
            
            baseSize: Math.max(1.5, window.innerWidth * 0.0035)
        });

        const fireflies: Firefly[] = Array.from({ length: quantity }, createFirefly);

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const draw = () => {
            if (!width || !height) return;
            ctx.clearRect(0, 0, width, height);

            fireflies.forEach(f => {
                // 1. Flight Path Logic (Multi-waypoint transition)
                f.moveProgress += f.moveSpeed;
                if (f.moveProgress >= 1) {
                    f.moveProgress = 0;
                    f.currentIdx = (f.currentIdx + 1) % waypointCount;
                }

                const curr = f.path[f.currentIdx];
                const next = f.path[(f.currentIdx + 1) % waypointCount];
                
                const t = easeInOut(f.moveProgress);
                const currentScale = lerp(curr.scale, next.scale, t);
                
                // Position anchor point (translate steps)
                const anchorX = (width / 2) + (lerp(curr.x, next.x, t) * (width / 100));
                const anchorY = (height / 2) + (lerp(curr.y, next.y, t) * (height / 100));

                // 2. Orbital Drift (transform-origin: -10vw logic)
                f.orbitAngle += f.orbitSpeed;
                const fx = anchorX + Math.cos(f.orbitAngle) * f.orbitRadius;
                const fy = anchorY + Math.sin(f.orbitAngle) * f.orbitRadius;

                const currentSize = f.baseSize * currentScale;

                // 3. Render Shadow Dot (Strict sharp dot)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.beginPath();
                ctx.arc(fx, fy, currentSize / 2, 0, Math.PI * 2);
                ctx.fill();

                // 4. Flash Logic (Pop timing)
                let flashOpacity = 0;
                if (f.flashDelay > 0) {
                    f.flashDelay -= 16;
                } else {
                    f.flashProgress += f.flashSpeed;
                    if (f.flashProgress >= 1) {
                        f.flashProgress = 0;
                        f.flashDelay = Math.random() * 6000 + 500;
                    }
                    
                    if (f.flashProgress < 0.05) {
                        flashOpacity = f.flashProgress / 0.05;
                    } else if (f.flashProgress < 0.3) {
                        flashOpacity = 1 - (f.flashProgress - 0.05) / 0.25;
                    } else {
                        flashOpacity = 0;
                    }
                }

                if (flashOpacity > 0) {
                    // Sharp White Core
                    ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacity})`;
                    ctx.beginPath();
                    ctx.arc(fx, fy, currentSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Tiny Yellow Core
                    ctx.fillStyle = `rgba(212, 255, 0, ${flashOpacity * 0.8})`;
                    ctx.beginPath();
                    ctx.arc(fx, fy, currentSize / 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            frameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

export const BioSwarm: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <style>{`
        /* --- BUTTERFLY MECHANICS (GPU Composited) --- */
        @keyframes borboletas-pos-loop {
          0% { transform: translate(0,0); }
          25% { transform: translate(100px,0); }
          50% { transform: translate(30px,-70px); }
          75% { transform: translate(0px,20px); }
          100% { transform: translate(-100px,-50px); }
        }
        
        @keyframes borboleta-radial-loop {
          0% { transform: rotate(0); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes borboleta-oval-loop {
          0% { transform: rotate(0) scale(3.3, 1); }
          100% { transform: rotate(-360deg) scale(3.3, 1); }
        }
        
        @keyframes borboleta-gfx-upright-loop {
          0% { transform: rotate(0); }
          100% { transform: rotate(-360deg); }
        }
        
        @keyframes borboleta-anim-loop {
          0% { transform: scale(1, 1.2) rotate(40deg); }
          100% { transform: scale(0.7, -1) rotate(-40deg); }
        }

        .borboletas {
          position: absolute;
          animation: borboletas-pos-loop 12s ease-in-out infinite alternate-reverse;
          filter: drop-shadow(0 0 5px rgba(212, 255, 0, 0.4));
        }

        .borboleta-oval-squish {
          transform: scale(0.3, 1);
        }

        .borboleta-1 { animation: borboleta-radial-loop 10s linear infinite; }
        .borboleta-2 { animation: borboleta-radial-loop 15s linear infinite; }

        .borboleta-oval {
          position: absolute;
          animation: borboleta-radial-loop 1.2s linear infinite;
        }
        
        .borboleta-radial {
          position: absolute;
          left: 80px;
          top: 0;
          animation: borboleta-oval-loop 1.2s linear infinite;
        }

        .borboleta-2 .borboleta-oval { animation: borboleta-radial-loop 1.5s linear infinite; }
        .borboleta-2 .borboleta-radial { animation: borboleta-oval-loop 1.5s linear infinite; }

        .borboleta-gfx {
          position: absolute;
          top: 0; left: 0;
          width: 25px; height: 20px;
        }

        .borboleta-1 .borboleta-gfx { animation: borboleta-gfx-upright-loop 10s linear infinite; }
        .borboleta-2 .borboleta-gfx { animation: borboleta-gfx-upright-loop 15s linear infinite; }

        .borboleta-anim {
          background: radial-gradient(closest-side at 50% 50%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 50%),
                      radial-gradient(closest-side at 50% 50%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 50%);
          background-repeat: no-repeat;
          background-size: 90% 70%, 100% 70%;
          background-position: 20% -40%, 0 40%;
          width: 25px; height: 20px;
          animation: borboleta-anim-loop 150ms ease-in-out infinite alternate-reverse;
        }
      `}</style>

      {/* CENTRAL BUTTERFLY CLUSTER */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90" style={{ transform: 'scale(0.35) translateX(-50%) translateY(-50%)' }}>
         <div className="borboletas">
             <ButterflyUnit />
         </div>
      </div>

      {/* FIREFLY SWARM (Cleaned of all outer glows, quantity set to 45, natural wandering paths) */}
      <FireflyCanvas />

    </div>
  );
};
