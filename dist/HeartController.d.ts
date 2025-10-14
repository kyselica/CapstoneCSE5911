import * as THREE from 'three';
import { CurveFunction } from './curves.js';
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
export declare class HeartController {
    private static instance;
    private isRunning;
    private startTime;
    private cycleDuration;
    private currentTime;
    private motionCurveType;
    private morphTargetMeshes;
    private currentBlendshapes;
    private targetBlendshapes;
    private readonly CHAMBER_NAMES;
    private constructor();
    /**
     * Get the singleton instance
     */
    static getInstance(): HeartController;
    /**
     * Initialize the controller with morph target meshes
     */
    initialize(meshes: THREE.Mesh[]): void;
    /**
     * Start the heart animation
     */
    start(): void;
    /**
     * Stop the heart animation
     */
    stop(): void;
    /**
     * Set the heart cycle duration in milliseconds
     */
    setCycleDuration(duration: number): void;
    /**
     * Set the heart rate in beats per minute (BPM)
     */
    setBPM(bpm: number): void;
    /**
     * Get current BPM
     */
    getBPM(): number;
    /**
     * Get current cycle duration
     */
    getCycleDuration(): number;
    /**
     * Set the motion curve type for heart animations
     */
    setMotionCurveType(curveType: CurveFunction): void;
    /**
     * Get the current motion curve type
     */
    getMotionCurveType(): CurveFunction;
    /**
     * Check if animation is running
     */
    isAnimating(): boolean;
    /**
     * Update the animation - call this every frame
     */
    update(): void;
    /**
     * Apply external blendshape data (e.g., from MediaPipe)
     */
    applyExternalBlendshapes(blendshapes: BlendshapeData): void;
    /**
     * Update the 4-phase heart cycle animation
     */
    private updateHeartCycle;
    /**
     * Apply current blendshape values to the meshes
     */
    private applyBlendshapes;
    /**
     * Apply the selected motion curve to a progress value (0 to 1)
     */
    private applyMotionCurve;
    /**
     * Lerp function for more natural transitions
     */
    private lerp;
}
export {};
//# sourceMappingURL=HeartController.d.ts.map