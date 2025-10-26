import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

export const clickLateSystolicMurmurRhythm: Rhythm = {
    name: "Click w/ Late Systolic Murmur",
    sound: [
        // S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
        },
        // Click sound
        {
            time: 0.48,
            soundPath: "assets/sounds/click.wav",
        },
        // Late Systolic Murmur sound
        {
            time: 0.50,
            soundPath: "assets/sounds/late-Systolic-Murmur.wav",
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
        },
    ]
};