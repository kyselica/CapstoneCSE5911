import { MotionCurves } from '../utils/curves.js';
import { defaultRhythm, availableRhythms } from './heartRhythms/Rhythm.js';
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
        this.prevTime = 0;
        this.motionCurveType = MotionCurves.BATHTUB;
        this.rhythm = defaultRhythm;
        // Sound management
        this.audioContext = null;
        this.soundBuffers = new Map();
        this.lastPlayedSounds = new Map();
        this.soundVolume = 0.7; // Default volume
        // Blendshapes
        this.morphTargetMeshes = [];
        this.currentBlendshapes = new Map();
        this.targetBlendshapes = new Map();
        // Heart chamber names mapping from rhythm names to actual blendshape names
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
        this.initializeAudio();
    }
    /**
     * Initialize audio context for sound playback
     */
    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }
    /**
     * Start the heart animation
     */
    start() {
        this.isRunning = true;
        this.startTime = performance.now();
        this.lastPlayedSounds.clear();
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
        this.startTime = performance.now();
        this.lastPlayedSounds.clear();
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
     * Set the heart rhythm pattern
     */
    setRhythm(rhythm) {
        this.rhythm = rhythm;
    }
    /**
     * Get the current rhythm
     */
    getRhythm() {
        return this.rhythm;
    }
    /**
     * Switch to a different rhythm pattern
     */
    switchToRhythm(rhythm) {
        this.setRhythm(rhythm);
    }
    /**
     * Get all available rhythm patterns
     */
    getAvailableRhythms() {
        return availableRhythms;
    }
    /**
     * Switch to rhythm by name
     */
    switchToRhythmByName(name) {
        const rhythm = availableRhythms.find(r => r.name === name);
        if (rhythm) {
            this.switchToRhythm(rhythm);
            return true;
        }
        console.warn(`Rhythm "${name}" not found`);
        return false;
    }
    /**
     * Get current rhythm name
     */
    getCurrentRhythmName() {
        return this.rhythm.name;
    }
    /**
     * Set sound volume (0.0 to 1.0)
     */
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
    }
    /**
     * Get current sound volume
     */
    getSoundVolume() {
        return this.soundVolume;
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
        this.prevTime = this.currentTime;
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
     * Update the heart cycle animation based on the current rhythm
     */
    // Generated with Cursor using claude-4-sonnet
    updateHeartCycle() {
        // Calculate progress within the current cycle (0 to 1)
        const elapsed = (this.currentTime - this.startTime) % this.cycleDuration;
        const cycleProgress = elapsed / this.cycleDuration;
        // Get the animation and sound keyframes from the current rhythm
        const animationKeyframes = this.rhythm.animation ?? defaultRhythm.animation;
        const soundKeyframes = this.rhythm.sound ?? defaultRhythm.sound;
        // Reset all target values to 0
        for (const chamberName of Object.values(this.CHAMBER_NAMES)) {
            this.targetBlendshapes.set(chamberName, 0);
        }
        // Process animation keyframes from the rhythm
        if (animationKeyframes) {
            for (const keyframe of animationKeyframes) {
                this.processAnimationKeyframe(keyframe, cycleProgress);
            }
        }
        // Process sound keyframes from the rhythm
        if (soundKeyframes) {
            for (const keyframe of soundKeyframes) {
                this.processSoundKeyframe(keyframe);
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
     * Process an animation keyframe based on cycle progress
     */
    processAnimationKeyframe(keyframe, cycleProgress) {
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
                const chamberName = this.CHAMBER_NAMES[chamber];
                if (chamberName) {
                    this.targetBlendshapes.set(chamberName, animatedValue);
                }
            }
        }
    }
    /**
     * Process a sound keyframe based on cycle progress
     */
    processSoundKeyframe(keyframe) {
        const { time, soundPath } = keyframe;
        const currentCycle = Math.floor((this.currentTime - this.startTime) / this.cycleDuration);
        // Gets the exact moment the sound should be played within the current cycle
        const beatTime = this.startTime + (currentCycle + time) * this.cycleDuration;
        // This checks to make sure we have passed the exact time when the sound should play
        if (this.prevTime < beatTime && this.currentTime >= beatTime) {
            const lastPlayed = this.lastPlayedSounds.get(soundPath) || -1;
            // Only play sound if it wasn't played during the current cycle (every keyframe sound only plays once during the cycle)
            if (lastPlayed < currentCycle) {
                this.playSound(soundPath);
                this.lastPlayedSounds.set(soundPath, currentCycle);
            }
        }
    }
    /**
     * Play a sound from the given path
     */
    async playSound(soundPath) {
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
            // Create and play the sound with volume control
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            // Set volume
            gainNode.gain.value = this.soundVolume;
            // Add subtle pitch variation for realism (±3%)
            const pitchVariation = 1 + (Math.random() - 0.5) * 0.06; // ±3%
            source.playbackRate.value = pitchVariation;
            // Connect audio nodes
            source.buffer = buffer;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            source.start();
        }
        catch (error) {
            console.warn(`Failed to play sound ${soundPath}:`, error);
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