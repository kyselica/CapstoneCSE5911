import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

export const splitS1Rhythm: Rhythm = {
    name: "Split S1",
    sound: [
        // Split S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/splitS1.wav",
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
        },
    ]
};