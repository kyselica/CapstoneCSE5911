// Initially created with Cursor using claude-4-sonnet
import * as THREE from 'three';
import { CurveFunction, MotionCurves } from '../utils/curves.js';

interface BlendshapeCategory {
    categoryName: string;
    score: number;
}

interface BlendshapeData {
    categories: BlendshapeCategory[];
}

/**
 * Singleton HeartController manages heart animation using blendshapes
 * with a continuous clock system and lerp-based transitions
 */
export class HeartController {
    private static instance: HeartController;
    
    // Animation state
    private isRunning: boolean = false;
    private startTime: number = 0;
    private cycleDuration: number = 1000;
    private currentTime: number = 0;
    private motionCurveType: CurveFunction = MotionCurves.BATHTUB;
    
    // Blendshapes
    private morphTargetMeshes: THREE.Mesh[] = [];
    private currentBlendshapes: Map<string, number> = new Map();
    private targetBlendshapes: Map<string, number> = new Map();
    
    // Heart chamber names
    private readonly CHAMBER_NAMES = {
        LA: 'LA 0.5',
        RA: 'RA 0.5', 
        LV: 'LV 0.5',
        RV: 'RV 0.5'
    };
    
    private constructor() {
        // Initialize default blendshape values
        Object.values(this.CHAMBER_NAMES).forEach(name => {
            this.currentBlendshapes.set(name, 0);
            this.targetBlendshapes.set(name, 0);
        });
    }
    
    /**
     * Get the singleton instance
     */
    public static getInstance(): HeartController {
        if (!HeartController.instance) {
            HeartController.instance = new HeartController();
        }
        return HeartController.instance;
    }
    
    /**
     * Initialize the controller with morph target meshes
     */
    public initialize(meshes: THREE.Mesh[]): void {
        this.morphTargetMeshes = meshes;
    }
    
    /**
     * Start the heart animation
     */
    public start(): void {
        this.isRunning = true;
        this.startTime = performance.now();
    }
    
    /**
     * Stop the heart animation
     */
    public stop(): void {
        this.isRunning = false;
    }
    
    /**
     * Set the heart cycle duration in milliseconds
     */
    public setCycleDuration(duration: number): void {
        this.cycleDuration = duration;
        this.startTime = performance.now(); // Reset timing
    }
    
    /**
     * Set the heart rate in beats per minute (BPM)
     */
    public setBPM(bpm: number): void {
        // Convert BPM to milliseconds per beat
        // 60 BPM = 1 beat per second = 1000ms per beat
        this.cycleDuration = (60 / bpm) * 1000;
    }
    
    /**
     * Get current BPM
     */
    public getBPM(): number {
        // Convert milliseconds per beat back to BPM
        return (60 * 1000) / this.cycleDuration;
    }
    
    /**
     * Get current cycle duration
     */
    public getCycleDuration(): number {
        return this.cycleDuration;
    }
    
    /**
     * Set the motion curve type for heart animations
     */
    public setMotionCurveType(curveType: CurveFunction): void {
        this.motionCurveType = curveType;
    }
    
    /**
     * Get the current motion curve type
     */
    public getMotionCurveType(): CurveFunction {
        return this.motionCurveType;
    }
    
    /**
     * Check if animation is running
     */
    public isAnimating(): boolean {
        return this.isRunning;
    }
    
    /**
     * Update the animation - call this every frame
     */
    public update(): void {
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
    public applyExternalBlendshapes(blendshapes: BlendshapeData): void {
        const coefsMap = new Map<string, number>();
        
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
    private updateHeartCycle(): void {
        // Calculate progress within the current cycle (0 to 1)
        const elapsed = (this.currentTime - this.startTime) % this.cycleDuration;
        const cycleProgress = elapsed / this.cycleDuration;
        
        // Calculate target blendshape values based on 4-phase cycle
        const phaseLength = 0.25; // Each phase is 25% of the cycle
        let laTarget = 0, raTarget = 0, lvTarget = 0, rvTarget = 0;
        
        if (cycleProgress < phaseLength) {
            // Phase 1: LA and RA contract (0 to 1) over 0.25 seconds
            const phaseProgress = cycleProgress / phaseLength;
            laTarget = this.applyMotionCurve(phaseProgress);
            raTarget = this.applyMotionCurve(phaseProgress);
        } else if (cycleProgress < phaseLength * 2) {
            // Phase 2: LA and RA relax (1 to 0) over 0.25 seconds
            const phaseProgress = (cycleProgress - phaseLength) / phaseLength;
            laTarget = this.applyMotionCurve(1 - phaseProgress);
            raTarget = this.applyMotionCurve(1 - phaseProgress);
        } else if (cycleProgress < phaseLength * 3) {
            // Phase 3: LV and RV contract (0 to 1) over 0.25 seconds
            const phaseProgress = (cycleProgress - phaseLength * 2) / phaseLength;
            lvTarget = this.applyMotionCurve(phaseProgress);
            rvTarget = this.applyMotionCurve(phaseProgress);
        } else {
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
    private applyBlendshapes(): void {
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
    private applyMotionCurve(t: number): number {
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
    private lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
}
