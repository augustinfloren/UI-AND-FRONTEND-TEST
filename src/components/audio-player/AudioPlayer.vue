<script setup lang="ts">
import { store } from "@/store/levelTrackerStore";

import "@/components/lit/audio-player/AudioPlayer";

const audioFiles = [
	{ name: "Verano Sensual", author: "Kevin McLeod", path: "audio/verano.mp3" },
	{
		name: "Monkeys spinning monkeys",
		author: "Kevin McLeod",
		path: "audio/monkeys.mp3",
	},
	{
		name: "Canon in D",
		author: "Kevin McLeod/Johann Pachelbel",
		path: "audio/canon.mp3",
	},
];

const startAudioContext = () => {
	store.audioContext = new AudioContext();
};
const onVolumeChange = (
	e: CustomEvent<{ rms: number | null; lufs: number | null }>,
) => {
	store.instantRMS = e.detail.rms;
	store.instantLUFS = e.detail.lufs;
};
</script>

<template>
	<div id="audio-player" class="panel">
		<template v-if="store.audioContext">
		  <h2>{{ audioFiles[0].name }}</h2>
		  <h3>{{ audioFiles[0].author }}</h3>
		  <oh-audio-player :audioContext="store.audioContext" :src="audioFiles[0].path" @volume-change="onVolumeChange"></oh-audio-player>
	
		  <div>
			<div>RMS: {{ store.instantRMS }}</div>
			<div>LUFS: {{ store.instantLUFS }}</div>
		  </div>
		</template>
		<template v-else>
			<button @click="startAudioContext">Start</button>
		  </template>
	</div>
</template>

<style scoped lang="scss">
@use "@/styles/base/colors-semantic";
#audio-player {
}
</style>