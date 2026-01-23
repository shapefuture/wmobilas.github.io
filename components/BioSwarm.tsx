
import React, { useMemo } from 'react';

/**
 * BIO-SWARM SIMULATION
 * 
 * Merges two distinct particle systems:
 * 1. "Borboletas" (Butterflies): Complex nested rotational mechanics for organic flight paths.
 * 2. "Fireflies": Procedural wandering particles with randomized flash patterns.
 * 
 * Refined to focus butterfly activity centrally under the main hero CTA.
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

export const BioSwarm: React.FC = () => {
  const fireflyCount = 30;

  // Generate Procedural Keyframes for Fireflies to avoid CSS bloat
  const fireflyStyles = useMemo(() => {
    let styles = '';
    for (let i = 1; i <= fireflyCount; i++) {
      const steps = Math.floor(Math.random() * 12) + 16;
      const rotationSpeed = Math.floor(Math.random() * 10) + 8;
      
      styles += `
        .firefly:nth-child(${i}) {
          animation-name: move${i};
        }
        .firefly:nth-child(${i})::before {
          animation-duration: ${rotationSpeed}s;
        }
        .firefly:nth-child(${i})::after {
          animation-duration: ${rotationSpeed}s, ${Math.floor(Math.random() * 6000) + 5000}ms;
          animation-delay: 0ms, ${Math.floor(Math.random() * 8000) + 500}ms;
        }
        @keyframes move${i} {
          ${Array.from({ length: steps + 1 }).map((_, step) => {
             const percentage = step * (100 / steps);
             const tx = Math.random() * 90 - 45; 
             const ty = Math.random() * 50 - 25; 
             const scale = (Math.random() * 0.6) + 0.2; 
             return `${percentage}% { transform: translateX(${tx}vw) translateY(${ty}vh) scale(${scale}); }`;
          }).join('\n')}
        }
      `;
    }
    return styles;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <style>{`
        /* --- BUTTERFLY MECHANICS --- */
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

        /* --- FIREFLY MECHANICS --- */
        .firefly {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 0.3vw;
          height: 0.3vw;
          margin: -0.15vw 0 0 -0.15vw;
          animation: ease 200s alternate infinite;
          pointer-events: none;
        }

        .firefly::before, .firefly::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform-origin: -10vw;
        }

        .firefly::before {
          background: #1a1a1a;
          opacity: 0.4;
          animation: drift ease alternate infinite;
        }

        .firefly::after {
          background: #D4FF00;
          opacity: 0;
          box-shadow: 0 0 0vw 0vw #D4FF00;
          animation: drift ease alternate infinite, flash ease infinite;
        }

        @keyframes drift {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes flash {
          0%, 30%, 100% { opacity: 0; box-shadow: 0 0 0vw 0vw #D4FF00; }
          5% { opacity: 1; box-shadow: 0 0 1vw 0.2vw #D4FF00; }
        }

        ${fireflyStyles}
      `}</style>

      {/* 
          CONSOLIDATED CENTRAL BUTTERFLY CLUSTER
          Centered specifically under the main action area/pill.
      */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90" style={{ transform: 'scale(0.35) translateX(-50%) translateY(-50%)' }}>
         <div className="borboletas">
             <ButterflyUnit />
         </div>
      </div>

      {/* FIREFLY SWARM (Globally Distributed) */}
      {Array.from({ length: fireflyCount }).map((_, i) => (
        <div key={i} className="firefly" />
      ))}

    </div>
  );
};
