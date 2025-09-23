import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

/**
 * Realistic heart rhythm with medically accurate timing and phases
 * Includes isovolumetric contraction and relaxation phases
 */
export const realisticRhythm: Rhythm = {
  name: "Realistic Heart Rhythm",
  animation: [
    // Atrial Systole (0-12% of cycle) - Atria contract to complete ventricular filling
    {
      time: 0,
      type: "ANIMATION",
      blendshape: ["LA", "RA"],
      animationEnd: 0.12,
      value: 1,
      curveFunction: MotionCurves.ATRIAL_CONTRACTION,
    },
    
    // Isovolumetric Contraction (12-15% of cycle) - Ventricles contract but valves closed
    {
      time: 0.12,
      type: "ANIMATION",
      blendshape: ["LV", "RV"],
      animationEnd: 0.15,
      value: 0.3, // Subtle contraction before ejection
      curveFunction: MotionCurves.HEART_CONTRACTION,
    },
    
    // Ventricular Ejection (15-60% of cycle) - Ventricles contract powerfully, ejecting blood
    {
      time: 0.15,
      type: "ANIMATION",
      blendshape: ["LV", "RV"],
      animationEnd: 0.6,
      value: 1,
      curveFunction: MotionCurves.VENTRICULAR_CONTRACTION,
    },
    
    // Isovolumetric Relaxation (60-65% of cycle) - Ventricles relax but valves closed
    {
      time: 0.6,
      type: "ANIMATION",
      blendshape: ["LV", "RV"],
      animationEnd: 0.65,
      value: 0.2, // Subtle relaxation before filling
      curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
    },
    
    // Ventricular Filling (65-100% of cycle) - Ventricles fill with blood
    {
      time: 0.65,
      type: "ANIMATION",
      blendshape: ["LV", "RV"],
      animationEnd: 1.0,
      value: 0,
      curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
    },
    
    // Atrial Filling Phase 1 (12-40% of cycle) - Early passive filling
    {
      time: 0.12,
      type: "ANIMATION",
      blendshape: ["LA", "RA"],
      animationEnd: 0.4,
      value: 0.1, // Very subtle filling
      curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
    },
    
    // Atrial Filling Phase 2 (40-100% of cycle) - Active filling
    {
      time: 0.4,
      type: "ANIMATION",
      blendshape: ["LA", "RA"],
      animationEnd: 1.0,
      value: 0.2, // Slightly more pronounced filling
      curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
    },
  ],
  sound: [
    // S1 sound - Closure of mitral and tricuspid valves (start of ventricular systole)
    {
      time: 0.13,
      type: "SOUND",
      soundPath: "sounds/heart-normal-S1.wav",
    },
    // S2 sound - Closure of aortic and pulmonary valves (end of ventricular systole)
    {
      time: 0.61,
      type: "SOUND",
      soundPath: "sounds/heart-normal-S2.wav",
    },
  ]
};

/**
 * Fast heart rhythm (tachycardia) - 100+ BPM
 * Shorter cycle with compressed phases
 */
export const tachycardiaRhythm: Rhythm = {
  name: "Tachycardia (Fast Heart)",
  animation: [
    // Compressed atrial systole (0-8% of cycle)
    {
      time: 0,
      type: "ANIMATION",
      blendshape: ["LA", "RA"],
      animationEnd: 0.08,
      value: 1,
      curveFunction: MotionCurves.ATRIAL_CONTRACTION,
    },
    
    // Compressed ventricular systole (8-50% of cycle)
    {
      time: 0.08,
      type: "ANIMATION",
      blendshape: ["LV", "RV"],
      animationEnd: 0.5,
      value: 1,
      curveFunction: MotionCurves.VENTRICULAR_CONTRACTION,
    },
    
    // Compressed diastole (50-100% of cycle)
    {
      time: 0.5,
      type: "ANIMATION",
      blendshape: ["LV", "RV"],
      animationEnd: 1.0,
      value: 0,
      curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
    },
    
    // Atrial filling (8-100% of cycle)
    {
      time: 0.08,
      type: "ANIMATION",
      blendshape: ["LA", "RA"],
      animationEnd: 1.0,
      value: 0.2,
      curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
    },
  ],
  sound: [
    {
      time: 0.09,
      type: "SOUND",
      soundPath: "sounds/heart-normal-S1.wav",
    },
    {
      time: 0.49,
      type: "SOUND",
      soundPath: "sounds/heart-normal-S2.wav",
    },
  ]
};

/**
 * Slow heart rhythm (bradycardia) - 40-60 BPM
 * Longer cycle with extended phases
 */
export const bradycardiaRhythm: Rhythm = {
  name: "Bradycardia (Slow Heart)",
  animation: [
    // Extended atrial systole (0-20% of cycle)
    {
      time: 0,
      type: "ANIMATION",
      blendshape: ["LA", "RA"],
      animationEnd: 0.2,
      value: 1,
      curveFunction: MotionCurves.ATRIAL_CONTRACTION,
    },
    
    // Extended ventricular systole (20-70% of cycle)
    {
      time: 0.2,
      type: "ANIMATION",
      blendshape: ["LV", "RV"],
      animationEnd: 0.7,
      value: 1,
      curveFunction: MotionCurves.VENTRICULAR_CONTRACTION,
    },
    
    // Extended diastole (70-100% of cycle)
    {
      time: 0.7,
      type: "ANIMATION",
      blendshape: ["LV", "RV"],
      animationEnd: 1.0,
      value: 0,
      curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
    },
    
    // Atrial filling (20-100% of cycle)
    {
      time: 0.2,
      type: "ANIMATION",
      blendshape: ["LA", "RA"],
      animationEnd: 1.0,
      value: 0.15,
      curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
    },
  ],
  sound: [
    {
      time: 0.22,
      type: "SOUND",
      soundPath: "sounds/heart-normal-S1.wav",
    },
    {
      time: 0.68,
      type: "SOUND",
      soundPath: "sounds/heart-normal-S2.wav",
    },
  ]
};
