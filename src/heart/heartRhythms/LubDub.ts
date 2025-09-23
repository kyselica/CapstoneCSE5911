import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

export const lubDubRhythm: Rhythm = {
  name: "Lub-Dub",
  animation: [
    {
      time: 0,
      type: "ANIMATION",
      blendshape: ["LA", "RA"],
      animationEnd: 0.5,
      value: 1,
      curveFunction: MotionCurves.BATHTUB,
    },
    {
      time: 0.25,
      type: "ANIMATION",
      blendshape: ["LA", "RA"],
      animationEnd: 0.5,
      value: 0,
      curveFunction: MotionCurves.BELL,
    },
    {
      time: 0.5,
      type: "ANIMATION",
      blendshape: ["LV", "RV"],
      animationEnd: 0.75,
      value: 1,
      curveFunction: MotionCurves.LERP,
    },
    {
      time: 0.75,
      type: "ANIMATION",
      blendshape: ["LV", "RV"],
      animationEnd: 1,
      value: 0,
      curveFunction: MotionCurves.BELL,
    },
  ],
  sound: [
    {
      time: .11,
      type: "SOUND",
      soundPath: "sounds/heart-normal-S1.wav",
    },
    {
      time: 0.7,
      type: "SOUND",
      soundPath: "sounds/heart-normal-S2.wav",
    },
  ]
};
