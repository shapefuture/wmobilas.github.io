import React, { useEffect, useRef } from 'react';

const BASE_URL = "https://cdn.jsdelivr.net/gh/wmobilas/wmobilas.github.io@master/";

/**
 * SIGGRAPH TIER FLOATING WORLD
 * Constrained to top 30% of viewport.
 * Ultra-slow drift, zoomed-out scaling, and opposite directions.
 */
const ASSETS = [
    // ship_back and all balloons move LEFT -> RIGHT (reverse: true)
    // others move RIGHT -> LEFT (reverse: false)
    // Negative delays ensure items are already distributed across the screen on load.
    { src: "baloon_large.png", w: 5, duration: 180, delay: -45, top: 12, rotate: 2, reverse: true },
    { src: "baloon_large2.png", w: 4, duration: 220, delay: -110, top: 22, rotate: -3, reverse: true },
    { src: "baloon_medium.png", w: 3, duration: 150, delay: -15, top: 8, rotate: 1, reverse: true },
    { src: "baloon_small.png", w: 2, duration: 110, delay: -70, top: 25, rotate: 4, reverse: true },
    { src: "ship_back.png", w: 8, duration: 280, delay: -140, top: 18, rotate: 0, reverse: true },
    
    // Airships moving Right to Left
    { src: "ship_far.png", w: 4, duration: 320, delay: -160, top: 14, rotate: -1, reverse: false },
    { src: "ship_front.png", w: 12, duration: 240, delay: -80, top: 24, rotate: 1, reverse: false },
    { src: "ship_very_far.png", w: 2.5, duration: 420, delay: -210, top: 6, rotate: 0, reverse: false },
];

function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

const FloatingItem: React.FC<{ item: typeof ASSETS[0] }> = ({ item }) => {
    const ref = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Zoomed out scaling factor
        const scaleBase = 0.4 + Math.random() * 0.15;
        
        /**
         * Boundaries increased to -60vw and 160vw.
         * Using negative delays starts the animation mid-flight.
         */
        const startX = item.reverse ? "-60vw" : "160vw";
        const endX = item.reverse ? "160vw" : "-60vw";

        const anim = el.animate([
            { transform: `translateX(${startX}) translateY(0px) rotate(${item.rotate}deg) scale(${scaleBase})`, opacity: 0 },
            { opacity: 0.8, offset: 0.1 },
            { opacity: 0.8, offset: 0.9 },
            { transform: `translateX(${endX}) translateY(${random(-10, 10)}px) rotate(${item.rotate}deg) scale(${scaleBase})`, opacity: 0 }
        ], {
            duration: item.duration * 1000,
            iterations: Infinity,
            delay: item.delay * 1000,
            easing: 'linear'
        });

        return () => anim.cancel();
    }, [item]);

    return (
        <img 
            ref={ref}
            src={`${BASE_URL}${item.src}`}
            alt="floating craft"
            className="absolute left-0 opacity-0 will-change-transform filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.3)]"
            style={{
                top: `${item.top}%`,
                width: `${item.w}vw`,
                maxWidth: '280px',
                zIndex: Math.floor(item.w),
            }}
        />
    );
};

export const FloatingWorld: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;

        const resize = () => {
            width = canvas.parentElement?.offsetWidth || window.innerWidth;
            height = canvas.parentElement?.offsetHeight || window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        resize();
        window.addEventListener('resize', resize);

        const birds: any[] = [];
        const birdCount = 18;

        /**
         * IMPLEMENTATION: Bird logic from user snippet
         * Distributed across the screen immediately.
         */
        function createInitialBirds() {
            for(let i=0; i<birdCount; i++) {
                birds.push({
                    x: random(0, width),
                    y: random(0, height * 0.35), 
                    s: random(1, 3) * 0.25,
                    vx: random(1.2, 3.5),
                    vy: Math.sin(random(0, 10)) * 0.4,
                    wing: random(0, Math.PI * 2)
                });
            }
        }
        createInitialBirds();

        let frameId: number;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 1.0;
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'rgba(0,0,0,0.25)'; 

            birds.forEach(b => {
                b.x -= b.vx; 
                b.y += b.vy;
                b.wing += 0.15;

                if (b.x < -100) b.x = width + 100;
                if (b.y < -100) b.y = height * 0.4;
                if (b.y > height * 0.4) b.y = -100;

                const wingY = Math.sin(b.wing) * 3 * b.s;
                
                ctx.beginPath();
                ctx.moveTo(b.x, b.y);
                ctx.lineTo(b.x + 8 * b.s, b.y - wingY);
                ctx.moveTo(b.x, b.y);
                ctx.lineTo(b.x - 8 * b.s, b.y - wingY);
                ctx.stroke();
            });

            frameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-5 pointer-events-none select-none overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 opacity-60" />
            {ASSETS.map((asset, i) => (
                <FloatingItem key={i} item={asset} />
            ))}
        </div>
    );
};
