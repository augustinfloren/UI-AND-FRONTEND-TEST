<script setup lang="ts">
import { onMounted, ref, } from "vue";
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

const onVolumeChange = (
	e: CustomEvent<{ rms: number | null; lufs: number | null }>,
) => {
	store.instantValues.RMS = e.detail.rms;
	store.instantValues.LUFS = e.detail.lufs;
};

const onPlay = () => {
	store.playing = true;
};

const onPause = () => {
	store.playing = false;
};

const onMute = (
	e: CustomEvent<{ muted: boolean }>
) => {
	if (e.detail.muted) {
		store.isMuted = true;
	} else {
		store.isMuted = false;
	}
}

onMounted(() => {
	store.audioContext = new AudioContext();
})

</script>

<template>
	<div class="audio-player panel">
		<template v-if="store.audioContext">
		  <h2>{{ audioFiles[0].name }}</h2>
		  <h3>{{ audioFiles[0].author }}</h3>
		  <oh-audio-player 
		  	:audioContext="store.audioContext" 
		  	:src="audioFiles[0].path" 
			@audio-play="onPlay"
			@audio-pause="onPause"
			@volume-change="onVolumeChange"
			@audio-mute="onMute"
		  ></oh-audio-player>
	
		  <div>
			<div>RMS: {{ store.instantValues.RMS }}</div>
			<div>LUFS: {{ store.instantValues.LUFS }}</div>
		  </div>
		</template>
	</div>
</template>

<style scoped lang="scss">
</style>