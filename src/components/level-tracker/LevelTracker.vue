<script setup lang="ts">
import { store } from "@/store/levelTrackerStore";
import InstantLevel from "./instant-level/InstantLevel.vue";
</script>

<template>
    <div id="level-tracker" class="panel">
        <header>
            <h2>Loud Tracker</h2>
        </header>

        <div id="#control-bar">
            <ScaleSelector />
        </div>
        <InstantLevel type="RMS" :value="store.instantRMS"/>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/base/colors-semantic";

#level-tracker{
    height: 35rem;
    width: 40rem;
}
</style>