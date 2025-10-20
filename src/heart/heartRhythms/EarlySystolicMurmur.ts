import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

export const earlySystolicMurmurRhythm: Rhythm = {
    name: "Early Systolic Murmur",
    sound: [
        // S1 sound
        {
            time: 0.32,
            soundPath: "sounds/heart-normal-S1.wav",
        },
        // Early Systolic Murmur sound
        {
            time: 0.35,
            soundPath: "sounds/early-Systolic-Murmur.wav",
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "sounds/heart-normal-S2.wav",
        },
    ]
};