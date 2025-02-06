<script setup lang="ts">
import { store } from "@/store/levelTrackerStore";
import { onMounted, ref, watch } from "vue";
import * as d3 from "d3";

const histogram = ref<SVGSVGElement | null>(null);
const data = ref<{ time: number | null, level: number | null }[]>([]);
let lastElapsed = 0;

const width  = 368
const height = width
const innerRadius = 50
const outerRadius = 180

onMounted(() => {
    const svg = d3.select(histogram.value)  
        .attr("width", width)
        .attr("height", height)
        .style("background", "grey")
        .attr("viewBox", [-width / 2, -height / 2, width, height]) 
        .attr("style", "width: 100%; height: auto;")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round");
    
    const x = d3.scaleLinear() // TIME
        .domain([0, 60])  // SCALE
        .range([0, 2 * Math.PI]);  // RADIAL WIDTH
    
    const y = d3.scaleLinear() // LEVEL
        .domain([0, 60])  // SCALE
        .range([innerRadius, outerRadius]);  // RADIAL HEIGHT
    
    const line = d3.lineRadial<[number, number]>() 
        .curve(d3.curveLinear)
        .angle(d => x(d[0]))   
    
    const path = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line(
            data.value
                .filter(d => d.time !== null && d.level !== null)  
                .map(d => [d.time!, d.level!])
        ));
           
    // TICKS
    svg.append("g")
        .selectAll()
        .data(y.ticks())
        .join("g")
            .call(g => g.append("circle")
                .attr("fill", "none")
                .attr("stroke", "currentColor")
                .attr("stroke-opacity", 0.2)
                .attr("r", y));
    
    // HISTOGRAM UPDATE - TO REFACTO
    watch(() => store.playing, () => {
        if (store.playing) {
            let t = d3.timer((elapsed) => {
                store.elapsedTime = lastElapsed + elapsed;
    
                data.value.push(
                    { time: store.elapsedTime/1000, level: 50 }
                );
                
                path
                    .transition()  
                    .duration(500) 
                    .attr("d", line(
                        data.value
                            .filter(d => d.time !== null && d.level !== null) 
                            .map(d => [d.time!, d.level!])
                    ));
                if (!store.playing) {
                    t.stop();
                    lastElapsed = store.elapsedTime;
                } 
            }, 150);
        }
    });
})
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

    .histogram{
        width: 85%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>