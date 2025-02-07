<script setup lang="ts">
import { store } from "@/store/levelTrackerStore";
import { onMounted, ref, watch } from "vue";
import * as d3 from "d3";

const histogram = ref<SVGSVGElement | null>(null);
const data = ref<{ time: number | null, level: number | null }[]>([]);
const duration = ref<number>(3);

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
    
    // TIME
    const x = d3.scaleLinear() 
        .domain([0, duration.value])  // SCALE
        .range([0, 2 * Math.PI]);  // RADIAL WIDTH
    
    // LEVEL
    const y = d3.scaleLinear() 
        .domain([-50, 50])  // SCALE
        .range([innerRadius, outerRadius]);  // RADIAL HEIGHT
    
    // RMS Line
    const line = d3.lineRadial<[number, number]>() 
        .curve(d3.curveCatmullRom)
        .angle(d => x(d[0]))   

        
    // RMS Path
    const path = svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "purple")
    .attr("stroke-width", 2.5)
    .attr("d", line(
        data.value
        .filter(d => d.time !== null && d.level !== null)  
        .map(d => [d.time!, d.level!])
    ))
        
    // TICKS
    svg.append("g")
        .selectAll()
        .data(y.ticks())
        .join("g")
            .call(g => g.append("circle")
                .attr("fill", "none")
                .attr("stroke", "currentColor")
                .attr("stroke-opacity", 0.1)
                .attr("r", y));

    // moving Needle 
    const needle = svg.append("line")
        .attr("x1", 0)
        .attr("y1", -50)
        .attr("x2", 0) 
        .attr("y2", -outerRadius) // Longueur du rayon
        .attr("stroke", "#afb0be")
        .attr("stroke-width", 1.5);

        // static Needle 
    const firstNeedle = svg.append("line")
        .attr("x1", 0)
        .attr("y1", -50)
        .attr("x2", 0) 
        .attr("y2", -outerRadius) // Longueur du rayon
        .attr("stroke", "#afb0be")
        .attr("stroke-width", 1.5);

    // Inner C
    d3.selectAll("circle")
        .filter((d, i, nodes) => i === 0)  
        .attr("fill", "#1c1e30")
        .attr("stroke", "#afb0be")
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 1)

    // Outer C
    d3.selectAll("circle")
        .filter((d, i, nodes) => i === 10)  
        .attr("stroke", "#afb0be")
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 1)

    let t: d3.Timer;
    let rmsValues = []; 
    const windowSize = 10;
    let newLap = false;
    let lastElapsed = 0;

    const updateTimer = (elapsed:number) => {
        store.elapsedTime = lastElapsed + elapsed;
        let parsedElapsed = Math.floor(store.elapsedTime)/1000;

        if (store.elapsedTime/1000 >= duration.value) {
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


        const angle = x(parsedElapsed % duration.value);

        data.value.push( 
            { time: parsedElapsed, level: avgRMS }
        );
        
        needle
            .attr("transform", `rotate(${angle * (180 / Math.PI)})`);  

        path
            .attr("d", line(
                data.value
                    .filter(d => d.time !== null && d.level !== null) 
                    .map(d => [d.time!, d.level!])
            ));
        

        if (!store.measuring) {
            lastElapsed = store.elapsedTime;
            t.stop();
        } 
    }

    watch(() => store.measuring, () => { 
        if (store.measuring) {
            t = d3.timer(updateTimer);
        }
    })

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

    .histogram{
        width: 85%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>