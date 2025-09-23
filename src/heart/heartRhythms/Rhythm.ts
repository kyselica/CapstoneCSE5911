import { CurveFunction } from "../../utils/curves.js";
import { lubDubRhythm } from "./lubDub.js";
import { realisticRhythm, tachycardiaRhythm, bradycardiaRhythm } from "./RealisticRhythm.js";

type AnimationKeyframe = {
	time: number;
	type: "ANIMATION";
	animationEnd: number;
	blendshape: ("LA" | "RA" | "LV" | "RV")[];
	value: number;
	curveFunction: CurveFunction;
}

type SoundKeyframe = {
	time: number;
	type: "SOUND";
	soundPath: string;
};

export type Rhythm = {
	name: string;
	animation?: AnimationKeyframe[];
	sound?: SoundKeyframe[];
};

export const defaultRhythm: Rhythm = realisticRhythm;

// Export all available rhythms
export const availableRhythms: Rhythm[] = [
  realisticRhythm,
  lubDubRhythm,
  tachycardiaRhythm,
  bradycardiaRhythm
];