import { CurveFunction } from "../../utils/curves.js";
export type AnimationKeyframe = {
    time: number;
    animationEnd: number;
    blendshape: ("LA" | "RA" | "LV" | "RV")[];
    value: number;
    curveFunction: CurveFunction;
};
export type SoundKeyframe = {
    time: number;
    soundPath: string;
};
export type Rhythm = {
    name: string;
    animation?: AnimationKeyframe[];
    sound?: SoundKeyframe[];
};
export declare const defaultRhythm: Rhythm;
export declare const availableRhythms: Rhythm[];
//# sourceMappingURL=Rhythm.d.ts.map