import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

export const holosystolicMurmurRhythm: Rhythm = {
    name: "Holosystolic Murmur",
    sound: [
        // S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
        },
        // Holosystolic Murmur sound
        {
            time: 0.35,
            soundPath: "assets/sounds/holosystolic-Murmur.wav",
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
        },
    ]
};