<script setup lang="ts">
import { onMounted, ref } from "vue";
import { store } from "@/store/levelTrackerStore";
import "@/components/lit/audio-player/AudioPlayer";

const audioFiles = [
  { name: "Verano Sensual", author: "Kevin McLeod", path: "audio/verano.mp3" },
  { name: "Monkeys spinning monkeys", author: "Kevin McLeod", path: "audio/monkeys.mp3" },
  { name: "Canon in D", author: "Kevin McLeod/Johann Pachelbel", path: "audio/canon.mp3" },
];

const currentTrackIndex = ref(0);

const changeTrack = (direction: "prev" | "next") => {
	store.playing = false;
  if (direction === "next") {
    currentTrackIndex.value = (currentTrackIndex.value + 1) % audioFiles.length;
  } else {
    currentTrackIndex.value = (currentTrackIndex.value - 1 + audioFiles.length) % audioFiles.length;
  }
};

const onVolumeChange = (e: CustomEvent<{ rms: number | null; lufs: number | null }>) => {
  store.instantValues.RMS = e.detail.rms;
  store.instantValues.LUFS = e.detail.lufs;
};

const onPlay = () => {
  store.playing = true;
};

const onPause = () => {
  store.playing = false;
};

const onMute = (e: CustomEvent<{ muted: boolean }>) => {
  store.isMuted = e.detail.muted;
};

onMounted(() => {
  store.audioContext = new AudioContext();
});
</script>


<template>
	<div class="audio-player panel">
	<header>
		
	</header>
	  <template v-if="store.audioContext">
		<div class="title-container">
		  <button class="arrow-button left" @click="changeTrack('prev')">&#8592;</button>
		  <div>
			<h2>{{ audioFiles[currentTrackIndex].name }}</h2>
			<h3>{{ audioFiles[currentTrackIndex].author }}</h3>
		  </div>
		  <button class="arrow-button right" @click="changeTrack('next')">&#8594;</button>
		</div>
  
		<oh-audio-player 
		  :audioContext="store.audioContext" 
		  :src="audioFiles[currentTrackIndex].path" 
		  @audio-play="onPlay"
		  @audio-pause="onPause"
		  @volume-change="onVolumeChange"
		  @audio-mute="onMute"
		></oh-audio-player>

	  </template>
	</div>
  </template>

<style scoped lang="scss">
@use "@/styles/base/colors-extended";
@use "@/styles/base/colors-semantic";
@use "@/styles/base/typography";
@use "@/styles/base/space";
@use "@/styles/base/decoration";

.audio-player {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  @include decoration.box-shadow-bottom;

  header{
		width: 100%;
        height: 7%;
        display: flex;
        align-items: center;
        background-color: colors-semantic.$color-background-layer-3;

        h2{
            padding-left: space.$space-fixed-double;
            font-size: typography.$font-size-6;
            line-height: 0%;
        }
    }

  .title-container {
	width: 20rem;
	height: 10rem;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .arrow-button {
      background: none;
      border: none;
      color: colors-semantic.$color-foreground-highlighted;
      font-size: 2rem;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: colors-extended.$color-yellow-20;
      }

      &.left {
        margin-right: 20px;
      }

      &.right {
        margin-left: 20px;
      }
    }

	h2, h3 {
		text-align: center;
	}

	h2 {
		color: colors-semantic.$color-foreground-highlighted;
		font-size: typography.$font-size-4;
	}

	h3 {
		font-size: typography.$font-size-6;
	}
  }
}


</style>