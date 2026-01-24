import React, { useEffect, useRef, useId, useState } from 'react';

/**
 * NEPHELE | SIGGRAPH L10 VOLUMETRIC ENGINE
 * v5.5 - "Atomic Symmetry" Patch
 * 
 * FIX: "Jumping Seed" / Loop Discontinuity
 * CAUSE: The infinite loop relies on duplicate clouds (Original & Offset Clone). 
 *        Previously, these were generated via two separate calls to a randomized function,
 *        resulting in different "puff" distributions. When the loop reset, the cloud would shapeshift.
 * SOLUTION: Generate the DOM structure ONCE, then use `cloneNode(true)` for the offset instance.
 *           This guarantees perfect visual symmetry at the loop boundary.
 */

export const CloudEngine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const filterDefsRef = useRef<SVGDefsElement>(null);
  const engineId = useId().replace(/:/g, "-");

  // Speed constants for the 3 layers (stratification)
  const speeds = [0.012, 0.028, 0.055]; 

  // --- 1. Deterministic Configuration (Stable across re-renders) ---
  const [cloudConfig] = useState(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const layerCount = 3;
    const cloudsPerLayer = isMobile ? 2 : 3;
    
    const clouds = [];

    for (let l = 0; l < layerCount; l++) {
      for (let i = 0; i < cloudsPerLayer; i++) {
        const basePos = (i / cloudsPerLayer) * 100; 
        const jitter = (Math.random() * 20 - 10);
        
        clouds.push({
            id: `l${l}-c${i}`,
            layer: l,
            x: basePos + jitter, 
            y: 5 + (l * 10) + (Math.random() * 15), 
            scale: (0.7 + Math.random() * 0.7) * (0.6 + l * 0.4),
            seed: Math.floor(Math.random() * 10000),
            type: Math.random() < 0.4 ? 'cumulus' : Math.random() < 0.8 ? 'stratus' : 'cirrus'
        });
      }
    }
    return clouds;
  });

  useEffect(() => {
    if (!containerRef.current || !filterDefsRef.current) return;

    const viewport = containerRef.current;
    const defs = filterDefsRef.current;
    
    // Reset DOM
    viewport.innerHTML = '';
    defs.innerHTML = '';

    const layerCount = 3;
    const layers: HTMLDivElement[] = [];
    const xPositions = [0, 0, 0];

    // --- 2. Create Layer Containers ---
    for (let l = 0; l < layerCount; l++) {
      const layer = document.createElement('div');
      Object.assign(layer.style, {
          position: 'absolute',
          inset: '0',
          willChange: 'transform', 
          pointerEvents: 'none',
          width: '200vw',
          height: '100%',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
      });
      viewport.appendChild(layer);
      layers.push(layer);
    }

    // --- 3. Generate Filters & Render Clouds ---
    cloudConfig.forEach(config => {
        const filterId = `${engineId}-${config.id}`;
        const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        
        // Tighter bounds for GPU performance
        filter.setAttribute("id", filterId);
        filter.setAttribute("filterUnits", "userSpaceOnUse");
        filter.setAttribute("x", "-50%");
        filter.setAttribute("y", "-50%");
        filter.setAttribute("width", "200%");
        filter.setAttribute("height", "200%");
        filter.setAttribute("color-interpolation-filters", "sRGB");
        
        const aspect = config.type === 'cirrus' ? 2.5 : config.type === 'stratus' ? 1.8 : 1.1;
        // Frequency: Lower = larger billows. Higher = gritty noise.
        const freq = 0.04 / config.scale; 

        // STRUCTURED FILTER CHAIN:
        filter.innerHTML = `
          <feTurbulence type="fractalNoise" baseFrequency="${freq} ${freq * aspect}" numOctaves="3" seed="${config.seed}" result="noise"/>
          <feColorMatrix in="noise" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 6 -1.5" result="sculptedNoise"/>
          <feDisplacementMap in="SourceGraphic" in2="sculptedNoise" scale="${35 * config.scale}" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="${(2 + (1 - config.layer * 0.5)) * config.scale}"/>
        `;
        defs.appendChild(filter);

        // --- ATOMIC DOM GENERATION ---
        // We create the DOM structure ONCE.
        const createCloudDOM = () => {
            const el = document.createElement('div');
            Object.assign(el.style, {
                position: 'absolute',
                top: `${config.y}%`,
                width: '70vmin',
                height: '70vmin',
                filter: `url(#${filterId})`,
                opacity: (0.25 + config.layer * 0.1).toString(), 
                mixBlendMode: 'overlay', 
                transform: 'translate(-50%, -50%)',
            });

            // "SOLID CORE" GEOMETRY:
            const puffCount = 6; 
            for (let j = 0; j < puffCount; j++) {
                const puff = document.createElement('div');
                const pScale = 0.8 + Math.random() * 0.8; 
                const pX = (Math.random() - 0.5) * 45; 
                const pY = (Math.random() - 0.5) * 25;
                
                Object.assign(puff.style, {
                    position: 'absolute',
                    width: `${25 * pScale}vmin`,
                    height: `${20 * pScale}vmin`, 
                    left: `calc(50% + ${pX}vmin)`,
                    top: `calc(50% + ${pY}vmin)`,
                    borderRadius: '50%',
                    background: 'radial-gradient(closest-side, rgba(255,255,255,1) 20%, rgba(255,255,255,0.5) 60%, transparent 100%)',
                });
                el.appendChild(puff);
            }
            return el;
        };

        // 1. Create Original
        const original = createCloudDOM();
        original.style.left = `${config.x}vw`;

        // 2. Clone for Wrap-around (Deep Clone ensures identical "random" puffs)
        const clone = original.cloneNode(true) as HTMLDivElement;
        clone.style.left = `${config.x + 100}vw`;

        layers[config.layer].appendChild(original);
        layers[config.layer].appendChild(clone);
    });

    // --- 4. Animation Loop ---
    let animationFrameId: number;
    
    const loop = () => {
      for (let l = 0; l < layerCount; l++) {
        xPositions[l] -= speeds[l];
        // Infinite loop logic: Reset from -100 to 0.
        // Since Clone(0) === Original(0), this is now seamless.
        if (xPositions[l] <= -100) {
            xPositions[l] += 100;
        }
        layers[l].style.transform = `translate3d(${xPositions[l]}vw, 0, 0)`;
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (viewport) viewport.innerHTML = '';
      if (defs) defs.innerHTML = '';
    };
  }, [engineId, cloudConfig]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div ref={containerRef} className="absolute inset-0" />
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs ref={filterDefsRef}></defs>
      </svg>
    </div>
  );
};
