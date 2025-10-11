import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

export const midSystolicClickRhythm: Rhythm = {
    name: "Mid-Systolic Click",
    sound: [
        // S1 sound
        {
            time: 0.32,
            type: "SOUND",
            soundPath: "sounds/heart-normal-S1.wav",
        },
        // Click sound
        {
            time: 0.42,
            type: "SOUND",
            soundPath: "sounds/click.wav",
        },
        // S2 sound
        {
            time: 0.62,
            type: "SOUND",
            soundPath: "sounds/heart-normal-S2.wav",
        },
    ]
};