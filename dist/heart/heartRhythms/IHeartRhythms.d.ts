declare namespace HeartRhythms {
    interface IHeartRhythms {
        playAnimation(): void;
        playSound(): void;
        update(): void;
    }
}
type Keyframe = {
    time: number;
    type: n;
};
type rhythm = {
    keyframe: Keyframe[];
};
//# sourceMappingURL=IHeartRhythms.d.ts.map