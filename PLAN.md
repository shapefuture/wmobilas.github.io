# Architecture Plan: Optical Physics Transition System

## Objective
Replace the standard "fade-to-white" loading sequence with a high-fidelity "Implosion-to-Bloom" transition that simulates a camera sensor overload followed by a macroscopic focus pull. This aligns the user experience with the "Visionary/Futurepreneur" persona.

## Core Mechanics

### 1. The Preloader (Microscopic Phase)
**Current State:** Simple particle orbit with linear progress.
**New Behavior (The Singularity):**
- **Phase A (Loading):** Particles orbit a gravitational center.
- **Phase B (Implosion):** Upon asset load completion (`progress === 100%`), gravity inverts drastically (`force = 5000 / dist`). Particles are sucked into the center (Z-depth 0).
- **Phase C (Ignition):** As particles hit the singularity, a "Chromatic Bloom" triggers.
    - **Flash Intensity:** Ramps from 0 to 1.
    - **Color Shift:** Interpolates from Void Black -> Lime Green (`#D4FF00` - Energy) -> Pure White (Sensor Saturation).
- **Exit Strategy:** The component remains mounted until the flash hits peak intensity, ensuring zero frame gaps.

### 2. The Reveal (Macroscopic Phase)
**Current State:** White curtain fades out; content fades in static.
**New Behavior (The Focus Pull):**
- **Z-Axis Travel:** The main application container initializes with a "Macro" state:
    - `scale: 1.15` (Zoomed in)
    - `filter: blur(12px)` (Out of focus)
- **Materialization:** As the Preloader's white flash dissipates (alpha fade), the application executes a spring-physics transition to:
    - `scale: 1.0`
    - `filter: blur(0px)`
- **Timing:** The two animations overlap. The Preloader fades *out* while the App zooms *out*.

## Technical Implementation Details

### `components/Preloader.tsx`
- **Particle System Upgrade:** Introduce `vz` (Z-velocity) and `isImploding` physics states.
- **Canvas Compositing:** Use `ctx.globalCompositeOperation = 'source-over'` but manipulate alpha layers to create the "Bloom" effect directly on canvas before unmounting.
- **Lifecycle Management:** The `onComplete` callback is now delayed until the *visual* flash reaches 100% opacity, not just when assets are loaded.

### `App.tsx`
- **Bridge Removal:** Delete the "White Bridge" `div`. It is no longer needed as the Preloader generates the whiteout.
- **Layering:** Ensure `Preloader` has `z-index: 50` and `App` has `z-index: 0`.
- **AnimatePresence:** Remove `mode='wait'`. The exit and enter animations must occur simultaneously (cross-dissolve).

## Aesthetics & Polish
- **Color Palette:** The flash must pass through the brand's `Accent Lime` before hitting White to reinforce identity subliminally.
- **Easing:** Use `[0.16, 1, 0.3, 1]` (hyper-exponential) for the zoom-out to give it weight.
