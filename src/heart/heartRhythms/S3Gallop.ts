import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

export const s3GallopRhythm: Rhythm = {
    name: "S3 Gallop",
    sound: [
        // S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
        },
        // S3 sound
        {
            time: 0.72,
            soundPath: "assets/sounds/s3.wav",
        },
    ]
};