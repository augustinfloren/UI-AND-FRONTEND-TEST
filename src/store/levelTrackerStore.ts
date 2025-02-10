import { reactive } from "vue";

interface Duration {
    time: number;
    unit: string;
    scaleFactor: number;
}

interface InstantValues {
    RMS: number | null;
    LUFS: number | null;
}

export const store = reactive({
    instantValues: {
        RMS: null,
        LUFS: null,
    } as InstantValues,

    audioContext: null as AudioContext | null,
    isMuted: false,
    restart: false,
    playing: false,
    elapsedTime: 60,

    duration: reactive<Duration>({
        time: 1,
        unit: "m",
        scaleFactor: 1
    })
});
