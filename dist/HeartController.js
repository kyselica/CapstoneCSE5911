import { MotionCurves } from './curves.js';
/**
 * Singleton HeartController manages heart animation using blendshapes
 * with a continuous clock system and lerp-based transitions
 */
export class HeartController {
    constructor() {
        // Animation state
        this.isRunning = false;
        this.startTime = 0;
        this.cycleDuration = 1000;
        this.currentTime = 0;
        this.motionCurveType = MotionCurves.BATHTUB;
        // Blendshapes
        this.morphTargetMeshes = [];
        this.currentBlendshapes = new Map();
        this.targetBlendshapes = new Map();
        // Heart chamber names
        this.CHAMBER_NAMES = {
            LA: 'LA 0.5',
            RA: 'RA 0.5',
            LV: 'LV 0.5',
            RV: 'RV 0.5'
        };
        // Initialize default blendshape values
        Object.values(this.CHAMBER_NAMES).forEach(name => {
            this.currentBlendshapes.set(name, 0);
            this.targetBlendshapes.set(name, 0);
        });
    }
    /**
     * Get the singleton instance
     */
    static getInstance() {
        if (!HeartController.instance) {
            HeartController.instance = new HeartController();
        }
        return HeartController.instance;
    }
    /**
     * Initialize the controller with morph target meshes
     */
    initialize(meshes) {
        this.morphTargetMeshes = meshes;
    }
    /**
     * Start the heart animation
     */
    start() {
        this.isRunning = true;
        this.startTime = performance.now();
    }
    /**
     * Stop the heart animation
     */
    stop() {
        this.isRunning = false;
    }
    /**
     * Set the heart cycle duration in milliseconds
     */
    setCycleDuration(duration) {
        this.cycleDuration = duration;
        this.startTime = performance.now(); // Reset timing
    }
    /**
     * Set the heart rate in beats per minute (BPM)
     */
    setBPM(bpm) {
        // Convert BPM to milliseconds per beat
        // 60 BPM = 1 beat per second = 1000ms per beat
        this.cycleDuration = (60 / bpm) * 1000;
    }
    /**
     * Get current BPM
     */
    getBPM() {
        // Convert milliseconds per beat back to BPM
        return (60 * 1000) / this.cycleDuration;
    }
    /**
     * Get current cycle duration
     */
    getCycleDuration() {
        return this.cycleDuration;
    }
    /**
     * Set the motion curve type for heart animations
     */
    setMotionCurveType(curveType) {
        this.motionCurveType = curveType;
    }
    /**
     * Get the current motion curve type
     */
    getMotionCurveType() {
        return this.motionCurveType;
    }
    /**
     * Check if animation is running
     */
    isAnimating() {
        return this.isRunning;
    }
    /**
     * Update the animation - call this every frame
     */
    update() {
        if (!this.isRunning || this.morphTargetMeshes.length === 0) {
            return;
        }
        this.currentTime = performance.now();
        this.updateHeartCycle();
        this.applyBlendshapes();
    }
    /**
     * Apply external blendshape data (e.g., from MediaPipe)
     */
    applyExternalBlendshapes(blendshapes) {
        const coefsMap = new Map();
        // Build coefficients map from categories
        for (const category of blendshapes.categories) {
            coefsMap.set(category.categoryName, category.score);
        }
        // Apply coefficients to all morph target meshes
        for (const mesh of this.morphTargetMeshes) {
            if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) {
                continue;
            }
            for (const [name, value] of coefsMap) {
                if (!Object.keys(mesh.morphTargetDictionary).includes(name)) {
                    continue;
                }
                const idx = mesh.morphTargetDictionary[name];
                if (typeof idx === 'number' && mesh.morphTargetInfluences) {
                    mesh.morphTargetInfluences[idx] = value;
                }
            }
        }
    }
    /**
     * Update the 4-phase heart cycle animation
     */
    updateHeartCycle() {
        // Calculate progress within the current cycle (0 to 1)
        const elapsed = (this.currentTime - this.startTime) % this.cycleDuration;
        const cycleProgress = elapsed / this.cycleDuration;
        // Calculate target blendshape values based on 4-phase cycle
        const phaseLength = 0.25; // Each phase is 25% of the cycle
        let laTarget = 0, raTarget = 0, lvTarget = 0, rvTarget = 0;
        if (cycleProgress < phaseLength) {
            // Phase 1: LA and RA contract (0 to 1) over 0.25 seconds
            const phaseProgress = cycleProgress / phaseLength * .6;
            laTarget = this.applyMotionCurve(phaseProgress);
            raTarget = this.applyMotionCurve(phaseProgress);
        }
        else if (cycleProgress < phaseLength * 2) {
            // Phase 2: LA and RA relax (1 to 0) over 0.25 seconds
            const phaseProgress = (cycleProgress - phaseLength) / phaseLength;
            laTarget = this.applyMotionCurve(1 - phaseProgress);
            raTarget = this.applyMotionCurve(1 - phaseProgress);
        }
        else if (cycleProgress < phaseLength * 3) {
            // Phase 3: LV and RV contract (0 to 1) over 0.25 seconds
            const phaseProgress = (cycleProgress - phaseLength * 2) / phaseLength * .7;
            lvTarget = this.applyMotionCurve(phaseProgress);
            rvTarget = this.applyMotionCurve(phaseProgress);
        }
        else {
            // Phase 4: LV and RV relax (1 to 0) over 0.25 seconds
            const phaseProgress = (cycleProgress - phaseLength * 3) / phaseLength;
            lvTarget = this.applyMotionCurve(1 - phaseProgress);
            rvTarget = this.applyMotionCurve(1 - phaseProgress);
        }
        // Update target values
        this.targetBlendshapes.set(this.CHAMBER_NAMES.LA, laTarget);
        this.targetBlendshapes.set(this.CHAMBER_NAMES.RA, raTarget);
        this.targetBlendshapes.set(this.CHAMBER_NAMES.LV, lvTarget);
        this.targetBlendshapes.set(this.CHAMBER_NAMES.RV, rvTarget);
        // Use smooth transitions between current and target values
        const lerpFactor = 0.1; // Smooth interpolation factor
        for (const [name, target] of this.targetBlendshapes) {
            const current = this.currentBlendshapes.get(name) || 0;
            const newValue = this.lerp(current, target, lerpFactor);
            this.currentBlendshapes.set(name, newValue);
        }
    }
    /**
     * Apply current blendshape values to the meshes
     */
    applyBlendshapes() {
        for (const mesh of this.morphTargetMeshes) {
            if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) {
                continue;
            }
            for (const [name, value] of this.currentBlendshapes) {
                if (!Object.keys(mesh.morphTargetDictionary).includes(name)) {
                    continue;
                }
                const idx = mesh.morphTargetDictionary[name];
                if (typeof idx === 'number' && mesh.morphTargetInfluences) {
                    mesh.morphTargetInfluences[idx] = value;
                }
            }
        }
    }
    /**
     * Apply the selected motion curve to a progress value (0 to 1)
     */
    applyMotionCurve(t) {
        switch (this.motionCurveType) {
            case MotionCurves.BELL:
                return MotionCurves.BELL(t);
            case MotionCurves.BATHTUB:
                return MotionCurves.BATHTUB(t);
            case MotionCurves.LERP:
                return MotionCurves.LERP(t);
            default:
                return MotionCurves.BELL(t);
        }
    }
    /**
     * Lerp function for more natural transitions
     */
    lerp(a, b, t) {
        return a + (b - a) * t;
    }
}
//# sourceMappingURL=HeartController.js.map