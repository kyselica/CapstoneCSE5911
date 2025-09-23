// Initially created with Cursor using claude-4-sonnet
import * as THREE from 'three';
import { CurveFunction, MotionCurves } from '../utils/curves.js';
import { defaultRhythm, Rhythm } from './heartRhythms/Rhythm.js';

type AnimationKeyframe = {
    time: number;
    type: "ANIMATION";
    animationEnd: number;
    blendshape: ("LA" | "RA" | "LV" | "RV")[];
    value: number;
    curveFunction: CurveFunction;
};

type SoundKeyframe = {
    time: number;
    type: "SOUND";
    soundPath: string;
};

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
    private rhythm: Rhythm = defaultRhythm;
    
    // Sound management
    private audioContext: AudioContext | null = null;
    private soundBuffers: Map<string, AudioBuffer> = new Map();
    private lastPlayedSounds: Map<string, number> = new Map();
    
    // Blendshapes
    private morphTargetMeshes: THREE.Mesh[] = [];
    private currentBlendshapes: Map<string, number> = new Map();
    private targetBlendshapes: Map<string, number> = new Map();
    
    // Heart chamber names mapping from rhythm names to actual blendshape names
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
        this.initializeAudio();
    }
    
    /**
     * Initialize audio context for sound playback
     */
    private initializeAudio(): void {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
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
     * Set the heart rhythm pattern
     */
    public setRhythm(rhythm: Rhythm): void {
        this.rhythm = rhythm;
    }
    
    /**
     * Get the current rhythm
     */
    public getRhythm(): Rhythm {
        return this.rhythm;
    }
    
    /**
     * Example method to demonstrate rhythm switching
     * You can call this to switch to a different rhythm pattern
     */
    public switchToRhythm(rhythm: Rhythm): void {
        this.setRhythm(rhythm);
        console.log(`Switched to rhythm: ${rhythm.name}`);
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
     * Update the heart cycle animation based on the current rhythm
     */
    // Generated with Cursor using claude-4-sonnet
    private updateHeartCycle(): void {
        // Calculate progress within the current cycle (0 to 1)
        const elapsed = (this.currentTime - this.startTime) % this.cycleDuration;
        const cycleProgress = elapsed / this.cycleDuration;
        
        // Reset all target values to 0
        for (const chamberName of Object.values(this.CHAMBER_NAMES)) {
            this.targetBlendshapes.set(chamberName, 0);
        }
        
        // Process animation keyframes from the rhythm
        if (this.rhythm.animation) {
            for (const keyframe of this.rhythm.animation) {
                this.processAnimationKeyframe(keyframe, cycleProgress);
            }
        }
        
        // Process sound keyframes from the rhythm
        if (this.rhythm.sound) {
            for (const keyframe of this.rhythm.sound) {
                this.processSoundKeyframe(keyframe, cycleProgress);
            }
        }
        
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
     * Process an animation keyframe based on cycle progress
     */
    private processAnimationKeyframe(keyframe: AnimationKeyframe, cycleProgress: number): void {
        const { time, animationEnd, blendshape, value, curveFunction } = keyframe;
        
        // Check if we're within the keyframe's time range
        if (cycleProgress >= time && cycleProgress <= animationEnd) {
            // Calculate progress within this keyframe (0 to 1)
            const keyframeDuration = animationEnd - time;
            const keyframeProgress = (cycleProgress - time) / keyframeDuration;
            
            // Apply the curve function to get the animated value
            const animatedValue = curveFunction(keyframeProgress) * value;
            
            // Apply to all specified blendshapes
            for (const chamber of blendshape) {
                const chamberName = this.CHAMBER_NAMES[chamber as keyof typeof this.CHAMBER_NAMES];
                if (chamberName) {
                    this.targetBlendshapes.set(chamberName, animatedValue);
                }
            }
        }
    }
    
    /**
     * Process a sound keyframe based on cycle progress
     */
    private processSoundKeyframe(keyframe: SoundKeyframe, cycleProgress: number): void {
        const { time, soundPath } = keyframe;
        
        // Check if we're at the exact time for this sound
        const timeTolerance = 0.01; // 1% tolerance for timing
        if (Math.abs(cycleProgress - time) < timeTolerance) {
            // Prevent playing the same sound multiple times in the same cycle
            const lastPlayed = this.lastPlayedSounds.get(soundPath) || 0;
            const currentCycle = Math.floor((this.currentTime - this.startTime) / this.cycleDuration);
            
            if (lastPlayed < currentCycle) {
                this.playSound(soundPath);
                this.lastPlayedSounds.set(soundPath, currentCycle);
            }
        }
    }
    
    /**
     * Play a sound from the given path
     */
    private async playSound(soundPath: string): Promise<void> {
        if (!this.audioContext) {
            console.warn('Audio context not available');
            return;
        }
        
        try {
            // Check if we already have the buffer cached
            let buffer = this.soundBuffers.get(soundPath);
            
            if (!buffer) {
                // Load the sound file
                const response = await fetch(soundPath);
                const arrayBuffer = await response.arrayBuffer();
                buffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.soundBuffers.set(soundPath, buffer);
            }
            
            // Create and play the sound
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioContext.destination);
            source.start();
            
        } catch (error) {
            console.warn(`Failed to play sound ${soundPath}:`, error);
        }
    }
    
    /**
     * Lerp function for more natural transitions
     */
    private lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
}
