<script setup lang="ts">
import { store } from "@/store/levelTrackerStore";
import { onMounted, ref, watch } from "vue";
import * as d3 from "d3";
import { createHistogram, createNeedles, updateRMSPath, updateNeedle } from "./d3Elements"; 

const histogram = ref<SVGSVGElement | null>(null);
const data = ref<{ time: number | null, level: number | null }[]>([]);
const duration = 60;

const width = 368;
const height = width;
const innerRadius = 50;
const outerRadius = 180;

onMounted(() => {
    const x = d3.scaleLinear().domain([0, duration]).range([0, 2 * Math.PI]);
    const y = d3.scaleLinear().domain([0, 50]).range([innerRadius, outerRadius]);

    const { svg, RMSpath, line } = createHistogram(histogram.value!, data.value, width, height, innerRadius, outerRadius, x, y);
    const { needle, firstNeedle } = createNeedles(svg, outerRadius);

    let t: d3.Timer;
    let rmsValues = [];
    const windowSize = 10;
    let lastElapsed = 0;

    const updateTimer = (elapsed: number) => {
        store.elapsedTime = lastElapsed + elapsed;
        let parsedElapsed = Math.floor(store.elapsedTime) / 1000;

        if (store.elapsedTime / 1000 >= duration && store.playing) {
            data.value = [];
            lastElapsed = 0;
            t.restart(updateTimer);
        }

        if (store.instantRMS) {
            let newValue = Math.round(store.instantRMS) + 80;
            rmsValues.push(newValue);
        }

        if (rmsValues.length > windowSize) {
            rmsValues.shift();
        }

        let avgRMS = rmsValues.reduce((sum, val) => sum + val, 0) / rmsValues.length;
        const angle = x(parsedElapsed % duration);

        data.value.push({
            time: parsedElapsed,
            level: store.isMuted ? 80 : avgRMS
        });

        updateNeedle(needle, angle);
        updateRMSPath(RMSpath, data.value, line);

        if (!store.playing) {
            lastElapsed = store.elapsedTime;
            t.stop();
        }
    };

    watch(() => store.playing, () => {
        if (store.playing) {
            setTimeout(() => {
                t = d3.timer(updateTimer);
            }, 150);
        }
    });

    watch(() => store.restart, () => {
        if (store.restart) {
            store.restart = false;
            data.value = [];
            lastElapsed = 0;

            if (store.playing) {
                t.restart(updateTimer);
            } else {
                t.stop();
                RMSpath.attr("d", "");
                needle.attr("transform", "rotate(0)");
            }
        }
    });
});
</script>

<template>
    <div class="histogram">
        <div class="histogram__container">
            <svg class="histogram__circle" ref="histogram"></svg>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/base/colors-semantic";

.histogram {
    width: 85%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
