import { reactive } from "vue";

export const store = reactive({
    playing: <boolean>(false),
    instantRMS: <number | null>(null),
    instantLUFS: <number | null>(null),
    audioContext: <AudioContext | null>(null),
})