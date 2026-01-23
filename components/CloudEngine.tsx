
import React, { useEffect, useRef, useId } from 'react';

/**
 * NEPHELE | SIGGRAPH L10 VOLUMETRIC ENGINE
 * v3.3 - "Seamless Flow" Refactor
 * 
 * FIXES: 
 * 1. Resolved sharp clipping lines by adding <feTile> after the noise offsets. 
 *    This ensures the displacement map is infinite and doesn't "run out" of 
 *    pixels when shifted by wind dx/dy.
 * 2. Switched to filterUnits="userSpaceOnUse" for absolute coordinate precision.
 */

class CloudInstance {
    id: string;
    x: number = 0;
    y: number = 0;
    z: number = 0;
    scale: number = 1;
    speed: number = 0;
    seed: number = 0;
    color: string = '';
    noiseAspect: number = 1.0;
    flowOffset: number = 0;
    flowRate: number = 12;

    // DOM References
    el: HTMLDivElement | null = null;
    filterEl: SVGFilterElement | null = null;
    turbEl: SVGFETurbulenceElement | null = null;
    dispEl: SVGFEDisplacementMapElement | null = null;
    offsetBaseEl: SVGFEOffsetElement | null = null;
    offsetDetailEl: SVGFEOffsetElement | null = null;

    filterId: string;
    offsetBaseId: string;
    offsetDetailId: string;

    constructor(index: number, instanceId: string, totalCount: number, viewport: HTMLDivElement, filterDefs: SVGDefsElement) {
        const uid = `${instanceId}-${index}`;
        this.id = uid;
        this.filterId = `f-shred-${uid}`;
        this.offsetBaseId = `o-base-${uid}`;
        this.offsetDetailId = `o-det-${uid}`;
        
        const initialX = (index / totalCount) * 160 - 30;
        this.initPhysicals(initialX, index);
        this.createPermanentDOM(viewport, filterDefs);
    }

    private seededRandom(s: number) {
        const x = Math.sin(s) * 10000;
        return x - Math.floor(x);
    }

    initPhysicals(forceX: number, seedModifier: number) {
        const rand = this.seededRandom(seedModifier + 0.5);
        let type: 'cumulus' | 'stratus' | 'cirrus';
        if (rand < 0.4) type = 'cumulus';
        else if (rand < 0.8) type = 'stratus';
        else type = 'cirrus';

        const altRand = this.seededRandom(seedModifier + 0.123);
        const scaleRand = this.seededRandom(seedModifier + 0.456);

        if (type === 'cirrus') {
            this.y = 5 + altRand * 15;
            this.scale = 0.5 + scaleRand * 0.4;
            this.noiseAspect = 2.0; 
        } else if (type === 'stratus') {
            this.y = 15 + altRand * 20;
            this.scale = 0.8 + scaleRand * 1.0;
            this.noiseAspect = 2.5; 
        } else {
            this.y = 10 + altRand * 35;
            this.scale = 0.7 + scaleRand * 1.3;
            this.noiseAspect = 1.1; 
        }

        this.z = Math.max(0.1, (40 - this.y) / 40); 
        this.x = forceX;
        this.speed = 0.9 * (0.3 + this.z * 0.7);
        this.seed = Math.floor(this.seededRandom(seedModifier + 0.99) * 10000);
        this.flowOffset = this.seededRandom(seedModifier + 0.77) * 1000; 

        const blueTint = (1 - this.z) * 15;
        this.color = `rgb(${255 - blueTint}, ${255 - blueTint/2}, 255)`;
    }

    createPermanentDOM(viewport: HTMLDivElement, filterDefs: SVGDefsElement) {
        this.el = document.createElement('div');
        this.el.style.position = 'absolute';
        this.el.style.width = '100vmin';
        this.el.style.height = '100vmin';
        this.el.style.pointerEvents = 'none';
        this.el.style.willChange = 'transform, opacity, left';
        this.el.style.filter = `url(#${this.filterId})`;
        this.el.style.mixBlendMode = 'overlay'; 
        
        const baseR = 14 * this.scale;
        const iterations = 8;
        
        let curX = 50; 
        let curY = 50;
        
        for (let i = 0; i < iterations; i++) {
            const puff = document.createElement('div');
            const pRand = this.seededRandom(i + this.seed);
            const aspect = 0.6 + pRand * 1.4;
            const w = baseR * aspect;
            const h = baseR / aspect;
            
            puff.style.position = 'absolute';
            puff.style.width = `${w}vmin`;
            puff.style.height = `${h}vmin`;
            puff.style.left = `${curX - (w/2)}vmin`;
            puff.style.top = `${curY - (h/2)}vmin`;
            puff.style.borderRadius = `${30 + pRand * 40}% ${30 + pRand * 40}%`;
            puff.style.background = `radial-gradient(circle at center, ${this.color} 0%, transparent 80%)`;
            puff.style.opacity = (0.4 + (1-this.z) * 0.5).toString();
            puff.style.transform = `rotate(${pRand * 360}deg)`;
            
            this.el.appendChild(puff);
            curX += (this.seededRandom(i + 1.1) - 0.3) * (baseR * 0.7);
            curY += (this.seededRandom(i + 1.2) - 0.5) * (baseR * 0.3);
        }

        this.filterEl = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        this.filterEl.setAttribute("id", this.filterId);
        
        // Use userSpaceOnUse to avoid scaling issues and set a massive region
        this.filterEl.setAttribute("filterUnits", "userSpaceOnUse");
        this.filterEl.setAttribute("primitiveUnits", "userSpaceOnUse");
        this.filterEl.setAttribute("x", "-200vmin");
        this.filterEl.setAttribute("y", "-200vmin");
        this.filterEl.setAttribute("width", "500vmin");
        this.filterEl.setAttribute("height", "500vmin");
        this.filterEl.setAttribute("color-interpolation-filters", "sRGB");

        const freq = 0.012 / (this.scale * 0.9);
        
        // Added <feTile> nodes. This is the fix for the "sharp edge".
        // When feOffset moves a primitive, feTile can repeat it across the whole filter region.
        this.filterEl.innerHTML = `
            <feTurbulence type="fractalNoise" baseFrequency="${freq} ${freq * this.noiseAspect}" numOctaves="5" seed="${this.seed}" result="bRaw"/>
            <feOffset in="bRaw" dx="0" dy="0" id="${this.offsetBaseId}" result="bShift"/>
            <feTile in="bShift" result="bTiled" />
            
            <feTurbulence type="fractalNoise" baseFrequency="${freq * 4}" numOctaves="2" seed="${this.seed + 1}" result="dRaw"/>
            <feOffset in="dRaw" dx="0" dy="0" id="${this.offsetDetailId}" result="dShift"/>
            <feTile in="dShift" result="dTiled" />

            <feComposite in="bTiled" in2="dTiled" operator="arithmetic" k2="0.8" k3="0.2" result="mix"/>
            <feColorMatrix in="mix" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -3" result="edge"/>
            <feDisplacementMap in="SourceGraphic" in2="edge" scale="${90 * this.scale}" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="${(1.5 - this.z) * 2 + 1}"/>
        `;

        viewport.appendChild(this.el);
        filterDefs.appendChild(this.filterEl);

        this.turbEl = this.filterEl.querySelector('feTurbulence') as SVGFETurbulenceElement;
        this.dispEl = this.filterEl.querySelector('feDisplacementMap') as SVGFEDisplacementMapElement;
        this.offsetBaseEl = this.filterEl.querySelector(`#${this.offsetBaseId}`) as SVGFEOffsetElement;
        this.offsetDetailEl = this.filterEl.querySelector(`#${this.offsetDetailId}`) as SVGFEOffsetElement;
    }

    respawn() {
        this.x = -60; 
        const newSeedModifier = Math.floor(Date.now() / 1000) + this.seed;
        this.initPhysicals(-60, newSeedModifier);
        
        if (this.turbEl) {
            const freq = 0.012 / (this.scale * 0.9);
            this.turbEl.setAttribute("baseFrequency", `${freq} ${freq * this.noiseAspect}`);
            this.turbEl.setAttribute("seed", this.seed.toString());
        }
        if (this.dispEl) {
            this.dispEl.setAttribute("scale", (90 * this.scale).toString());
        }
    }

    update(dt: number) {
        this.x += this.speed * dt;
        if (this.x > 160) {
            this.respawn();
        }

        this.flowOffset -= dt * this.flowRate;

        // Keep flowOffset manageable to avoid floating point precision issues in SVG attributes
        if (Math.abs(this.flowOffset) > 10000) {
            this.flowOffset %= 10000;
        }

        if (this.offsetBaseEl) this.offsetBaseEl.setAttribute('dx', this.flowOffset.toFixed(1));
        if (this.offsetDetailEl) {
            this.offsetDetailEl.setAttribute('dx', (this.flowOffset * 1.4).toFixed(1));
            this.offsetDetailEl.setAttribute('dy', (Math.sin(this.flowOffset * 0.01) * 2).toFixed(1));
        }

        if (this.el) {
            this.el.style.left = `${this.x}%`;
            this.el.style.top = `${this.y}%`;
            
            const fadeStart = -40;
            const fadeEnd = 140;
            const fadeIn = (this.x - fadeStart) / 25;
            const fadeOut = (fadeEnd - this.x) / 35;
            const edgeFade = Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)));
            
            this.el.style.opacity = (edgeFade * (0.2 + this.z * 0.7)).toString();
            this.el.style.transform = `translate(-50%, -50%) skewX(${Math.sin(this.flowOffset * 0.002) * 4}deg)`;
        }
    }
}

export const CloudEngine: React.FC = () => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const filterDefsRef = useRef<SVGDefsElement>(null);
    const instanceId = useId().replace(/:/g, "-");

    const engineRef = useRef<{
        clouds: CloudInstance[];
        lastTime: number;
        animationFrameId: number;
        running: boolean;
    }>({
        clouds: [],
        lastTime: 0,
        animationFrameId: 0,
        running: true
    });

    useEffect(() => {
        if (!viewportRef.current || !filterDefsRef.current) return;
        
        engineRef.current.running = true;
        engineRef.current.clouds = [];
        engineRef.current.lastTime = performance.now();

        const count = 7;
        for (let i = 0; i < count; i++) {
            engineRef.current.clouds.push(
                new CloudInstance(i, instanceId, count, viewportRef.current, filterDefsRef.current)
            );
        }

        const loop = (now: number) => {
            if (!engineRef.current.running) return;
            let dt = (now - engineRef.current.lastTime) / 1000;
            if (dt > 0.1) dt = 0.016; 
            engineRef.current.lastTime = now;

            for (const cloud of engineRef.current.clouds) {
                cloud.update(dt);
            }
            engineRef.current.animationFrameId = requestAnimationFrame(loop);
        };

        engineRef.current.animationFrameId = requestAnimationFrame(loop);

        return () => {
            engineRef.current.running = false;
            cancelAnimationFrame(engineRef.current.animationFrameId);
            if (viewportRef.current) viewportRef.current.innerHTML = '';
            if (filterDefsRef.current) filterDefsRef.current.innerHTML = '';
        };
    }, [instanceId]);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div ref={viewportRef} className="absolute inset-0 z-10" />
            <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
                <defs ref={filterDefsRef}></defs>
            </svg>
        </div>
    );
};
