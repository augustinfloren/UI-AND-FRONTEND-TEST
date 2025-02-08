<script setup lang="ts">
import { store } from "@/store/levelTrackerStore";
import { onMounted, ref, watch } from "vue";
import * as d3 from "d3";
import { createHistogram, createNeedles, createLine, updateLine, updateNeedle, resetLines } from "./d3Elements"; 

const histogram = ref<SVGSVGElement | null>(null);
const data = ref<{ time: number, RMS: number, LUFS: number }[]>([]);
const duration = 60;

const width = 368;
const height = width;
const innerRadius = 50;
const outerRadius = 180;

onMounted(() => {
    const x = d3.scaleLinear().domain([0, duration]).range([0, 2 * Math.PI]);
    const y = d3.scaleLinear().domain([0, 50]).range([innerRadius, outerRadius]);

    const { svg } = createHistogram(histogram.value!, data.value, width, height, innerRadius, outerRadius, x, y);
    
    const RMSYOffset = 80;
    const LUFSYOffset = 130;
    
    const RMSLine = createLine("RMS", histogram.value, data.value, x);
    const LUFSLine = createLine("LUFS", histogram.value, data.value, x);
    
    const { needle } = createNeedles(svg, outerRadius);
    
    let t: d3.Timer;
    let lastElapsed = 0;

    const smoothCurve = (value: number) => {
        let values = [];
        const windowSize = 10;
        
        let newValue = Math.round(value);
        values.push(newValue);

        if (values.length > windowSize) {
            values.shift();
        }

        let avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;

        return avgValue;
    }

    const updateTimer = (elapsed: number) => {
        store.elapsedTime = lastElapsed + elapsed;
        let parsedElapsed = Math.floor(store.elapsedTime) / 1000;
        const angle = x(parsedElapsed % duration);

        if (store.elapsedTime / 1000 >= duration && store.playing) {
            data.value = [];
            lastElapsed = 0;
            t.restart(updateTimer);
        }

        if (store.instantValues) {
            data.value.push({
                time: parsedElapsed,
                RMS: store.isMuted ? 0 : smoothCurve(store.instantValues.RMS ?? 0),
                LUFS: store.isMuted ? 0 : smoothCurve(store.instantValues.LUFS ?? 0)
            })
        }
        
        updateNeedle(needle, angle);
        updateLine("RMS", RMSLine, data.value, RMSYOffset);
        updateLine("LUFS", LUFSLine, data.value, LUFSYOffset);

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
                resetLines(histogram.value!) 
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
