import { reactive } from "vue";

export const store = reactive({
    instantRMS: <number | null>(null),
    instantLUFS: <number | null>(null),
    audioContext: <AudioContext | null>(null),

    restart: <boolean>(false),
    playing: <boolean>(false),
    elapsedTime: <number>(0),
})