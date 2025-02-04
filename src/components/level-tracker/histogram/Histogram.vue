<script setup lang="ts">
</script>

<template>
    <div class="histogram">
        <div class="histogram__circle">
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

        &__circle {
            width: 23rem;
            height: 23rem;
            border-radius: 50%;
            border: 1px solid colors-semantic.$color-foreground-default;
        }
    }
</style>