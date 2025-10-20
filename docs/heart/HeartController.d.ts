import * as THREE from 'three';
import { CurveFunction } from '../utils/curves.js';
import { Rhythm } from './heartRhythms/Rhythm.js';
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
    private prevTime;
    private motionCurveType;
    private rhythm;
    private audioContext;
    private soundBuffers;
    private lastPlayedSounds;
    private soundVolume;
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
     * Initialize audio context for sound playback
     */
    private initializeAudio;
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
     * Set the heart rhythm pattern
     */
    setRhythm(rhythm: Rhythm): void;
    /**
     * Get the current rhythm
     */
    getRhythm(): Rhythm;
    /**
     * Switch to a different rhythm pattern
     */
    switchToRhythm(rhythm: Rhythm): void;
    /**
     * Get all available rhythm patterns
     */
    getAvailableRhythms(): Rhythm[];
    /**
     * Switch to rhythm by name
     */
    switchToRhythmByName(name: string): boolean;
    /**
     * Get current rhythm name
     */
    getCurrentRhythmName(): string;
    /**
     * Set sound volume (0.0 to 1.0)
     */
    setSoundVolume(volume: number): void;
    /**
     * Get current sound volume
     */
    getSoundVolume(): number;
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
     * Update the heart cycle animation based on the current rhythm
     */
    private updateHeartCycle;
    /**
     * Apply current blendshape values to the meshes
     */
    private applyBlendshapes;
    /**
     * Process an animation keyframe based on cycle progress
     */
    private processAnimationKeyframe;
    /**
     * Process a sound keyframe based on cycle progress
     */
    private processSoundKeyframe;
    /**
     * Play a sound from the given path
     */
    private playSound;
    /**
     * Lerp function for more natural transitions
     */
    private lerp;
}
export {};
//# sourceMappingURL=HeartController.d.ts.map