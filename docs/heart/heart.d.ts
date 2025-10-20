import * as THREE from 'three';
import { HeartController } from './HeartController.js';
export declare function init(): void;
declare global {
    interface Window {
        resetCamera: () => void;
        toggleAnimation: () => void;
        setHeartCycleDuration: (duration: number) => void;
        setHeartBPM: (bpm: number) => void;
        updateBlendshapes: (blendshapes: any) => void;
        heartController: HeartController;
        morphTargetMeshes: THREE.Mesh[];
        heartMorphTargets: any;
        switchHeartRhythm: (rhythmName: string) => void;
        setHeartSoundVolume: (volume: number) => void;
        toggleHeartSoundVariations: () => void;
        getAvailableHeartRhythms: () => string[];
    }
}
//# sourceMappingURL=heart.d.ts.map