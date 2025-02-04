<script setup lang="ts">
import ScaleSelector from "./ScaleSelector.vue";
import ResetButton from "./ResetButton.vue";
import Elapsed from "./Elapsed.vue";
</script>

<template>
    <div class="control-bar">
        <Elapsed />
        <ScaleSelector />
        <ResetButton />
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/base/colors-semantic";

.control-bar{
    height: 15%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: colors-semantic.$color-background-layer-1;
}
</style>