import { MotionCurves } from "../../utils/curves.js";
export const lubDubRhythm = {
    name: "Lub-Dub",
    animation: [
        // Atrial Systole (0-15% of cycle) - Atria contract to push blood into ventricles
        {
            time: 0,
            blendshape: ["LA", "RA"],
            animationEnd: 0.15,
            value: 1,
            curveFunction: MotionCurves.ATRIAL_CONTRACTION,
        },
        // Atrial Diastole (15-30% of cycle) - Atria relax and begin filling
        {
            time: 0.15,
            blendshape: ["LA", "RA"],
            animationEnd: 0.3,
            value: 0,
            curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
        },
        // Ventricular Systole (30-65% of cycle) - Ventricles contract powerfully
        {
            time: 0.3,
            blendshape: ["LV", "RV"],
            animationEnd: 0.65,
            value: 1,
            curveFunction: MotionCurves.VENTRICULAR_CONTRACTION,
        },
        // Ventricular Diastole (65-100% of cycle) - Ventricles relax and fill
        {
            time: 0.65,
            blendshape: ["LV", "RV"],
            animationEnd: 1.0,
            value: 0,
            curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
        },
        // Atrial filling continues throughout diastole (30-100% of cycle)
        {
            time: 0.3,
            blendshape: ["LA", "RA"],
            animationEnd: 1.0,
            value: 0.3, // Subtle filling movement
            curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
        },
    ],
    sound: [
        // S1 sound - Closure of mitral and tricuspid valves (start of ventricular systole)
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
        },
        // S2 sound - Closure of aortic and pulmonary valves (end of ventricular systole)
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
        },
    ]
};
//# sourceMappingURL=LubDub.js.map