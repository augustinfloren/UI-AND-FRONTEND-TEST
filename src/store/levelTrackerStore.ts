import { reactive } from "vue";

interface InstantValues {
    RMS: number | null;
    LUFS: number | null;
}

export const store = reactive({
    instantRMS: <number | null>(null),
    instantLUFS: <number | null>(null),
    instantValues: {
        RMS: <number | null>(null),
        LUFS: <number | null>(null),
    } as InstantValues,

    audioContext: <AudioContext | null>(null),
    isMuted: <boolean>(false),

    restart: <boolean>(false),
    playing: <boolean>(false),
    elapsedTime: <number>(0),

})