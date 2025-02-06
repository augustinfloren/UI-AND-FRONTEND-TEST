<script setup lang="ts">
import { store } from "@/store/levelTrackerStore";
import { onMounted, ref, watch } from "vue";
import * as d3 from "d3";

const histogram = ref<SVGSVGElement | null>(null);
// Quand la lecture démarre, démarrer un compteur 
// et envoyer les données 
//  : Poser un watcher sur la ref playing et faire quelque chose
// Créer une data dynamique avec les valeurs du compteur et des données de l'audioplayer
//  : svg.enter { merge(path) }
// Quand la lecture est stopée arreter le compteur

let totalElapsed = 0;
let lastElapsed = 0;

watch(() => store.playing, () => {
    if (store.playing) {
        let t = d3.timer((elapsed) => {
            totalElapsed = lastElapsed + elapsed;
            console.log(totalElapsed)
            if (!store.playing) {
                t.stop();
                lastElapsed = totalElapsed;
            } 
        }, 150);
    }
});

const data: {time: number, level: number} [] = [
    {time: 0, level : 50}, 
    {time: 5, level : 60},
    {time: 10, level : 80},
    {time: 15, level : 80}, 
    {time: 20, level : 90},
    {time: 25, level : 80},
    {time: 30, level : 70},
    {time: 35, level : 60},
    {time: 40, level : 80},
    {time: 45, level : 90},
    {time: 50, level : 80},
    {time: 55, level : 70},
    {time: 60, level : 114},
]

const width  = 368
const height = width
const innerRadius = 50
const outerRadius = 180


onMounted(() => {
    const svg = d3.select(histogram.value)  // Création du svg avec sa taille
        .attr("width", width)
        .attr("height", height)
        .style("background", "grey")
        .attr("viewBox", [-width / 2, -height / 2, width, height]) 
        .attr("style", "width: 100%; height: auto; font: 10px sans-serif;")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round");
    
    const x = d3.scaleLinear()  
        .domain([0, 60])  // Echelle des données
        .range([0, 2 * Math.PI]);  // Longueur de l'anneau 
    
    const y = d3.scaleLinear()
        .domain([0, 100])  // Echelle des données 
        .range([innerRadius, outerRadius]);  // Largeur de l'anneau en px
    
    const line = d3.lineRadial<[number, number]>() // Définition de la ligne
        .curve(d3.curveLinear)
        .angle(d => x(d[0]))   
    
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line(
            data.map(d => [d.time, d.level]) 
        ));
            
    svg.append("g")
        .selectAll()
        .data(y.ticks())
        .join("g")
            .call(g => g.append("circle")
                .attr("fill", "none")
                .attr("stroke", "currentColor")
                .attr("stroke-opacity", 0.2)
                .attr("r", y));
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