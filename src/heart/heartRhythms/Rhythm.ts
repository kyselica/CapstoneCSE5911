import { CurveFunction } from "../../utils/curves.js";
import { normalS1S2Rhythm } from "./NormalS1S2.js";
import { s4GallopRhythm } from "./S4Gallop.js";
import { s3GallopRhythm } from "./S3Gallop.js";
import { midSystolicClickRhythm } from "./Mid-SystolicClick.js";
import { splitS1Rhythm } from "./SplitS1.js"
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

export const defaultRhythm: Rhythm = normalS1S2Rhythm;

// Export all available rhythms
export const availableRhythms: Rhythm[] = [
	normalS1S2Rhythm,
	//realisticRhythm,
	//tachycardiaRhythm,
	//bradycardiaRhythm,
	s4GallopRhythm,
	s3GallopRhythm,
	midSystolicClickRhythm,
	splitS1Rhythm
];