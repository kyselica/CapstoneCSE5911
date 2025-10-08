import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

export const s4GallopRhythm: Rhythm = {
	name: "S4 Gallop",
    animation: [],
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