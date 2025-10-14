import * as THREE from 'three';
import { HeartController } from './HeartController.js';
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
    }
}
//# sourceMappingURL=heart.d.ts.map