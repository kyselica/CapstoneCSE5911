import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

export const s4GallopRhythm: Rhythm = {
	name: "S4 Gallop",
    animation: [
        // Atria contract
        {
            time: 0,
            type: "ANIMATION",
            blendshape: ["LA", "RA"],
            animationEnd: 0.15,
            value: 1,
            curveFunction: MotionCurves.ATRIAL_CONTRACTION,
        },
        // Atria relax
        {
            time: 0.15,
            type: "ANIMATION",
            blendshape: ["LA", "RA"],
            animationEnd: 0.3,
            value: 0,
            curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
        },
        // Ventricles contract 
        {
            time: 0.3,
            type: "ANIMATION",
            blendshape: ["LV", "RV"],
            animationEnd: 0.65,
            value: 1,
            curveFunction: MotionCurves.VENTRICULAR_CONTRACTION,
        },
        // Ventricles relax
        {
            time: 0.65,
            type: "ANIMATION",
            blendshape: ["LV", "RV"],
            animationEnd: 1.0,
            value: 0,
            curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
        },
        // Atrial filling continues throughout diastole (30-100% of cycle)
        {
            time: 0.3,
            type: "ANIMATION",
            blendshape: ["LA", "RA"],
            animationEnd: 1.0,
            value: 0.3, // Subtle filling movement
            curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
        },
    ],
    sound: [
        // S4 sound
        {
            time: 0.22,
            type: "SOUND",
            soundPath: "sounds/s4.wav",
        },
        // S1 sound
        {
            time: 0.32,
            type: "SOUND",
            soundPath: "sounds/heart-normal-S1.wav",
        },
        // S2 sound
        {
            time: 0.62,
            type: "SOUND",
            soundPath: "sounds/heart-normal-S2.wav",
        },
    ]
};