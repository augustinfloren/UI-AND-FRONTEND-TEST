<script setup lang="ts">
import { store } from '@/store/levelTrackerStore';

const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

</script>

<template>
    <div class="elapsed">
        {{ formatTime(Math.floor(store.elapsedTime/1000)) }}
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/base/space";
@use "@/styles/base/typography";

.elapsed{
    padding-left: space.$space-fixed-double;
    font-size: typography.$font-size-4;
}
</style>
