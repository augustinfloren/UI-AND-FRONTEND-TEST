<script setup lang="ts">
import { ref, watch } from 'vue';
import { store } from '@/store/levelTrackerStore';

const options = ref([
    { time: 1, unit: "m", scaleFactor: 1 },
    { time: 4, unit: "m", scaleFactor: 4 },
    { time: 12, unit: "m", scaleFactor: 12 },
    { time: 30, unit: "m", scaleFactor: 30 },
    { time: 1, unit: "h", scaleFactor: 60 },
    { time: 24, unit: "h", scaleFactor: 1440 },
]);

const scale = ref(options.value[0]);

watch(scale, (newScale) => {
    if (newScale) {
        store.duration = { ...newScale }; 
    }
}, { deep: true });

</script>

<template>
    <div class="scale-selector">
        <select v-model="scale" id="options">
            <option v-for="option in options" :key="option.time" :value="option">
                {{ option.time }}{{ option.unit }}
            </option>
        </select>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/base/colors-semantic";
@use "@/styles/base/typography";
@use "@/styles/base/space";
@use "@/styles/base/decoration";

.scale-selector{
    display: flex;
    justify-content: center;
    select {
        margin-left: -5rem;
        text-align: center;

        /* Reset */
        appearance: none;
        border: 0;
        outline: 0;
        font: inherit;

        width: 5rem;
        padding: 0.5rem 0.5rem;
        background-color: colors-semantic.$color-background-layer-3;
        color: white;
        border-radius: 0.25em;
        box-shadow: 0 0 1em 0 rgba(0, 0, 0, 0.2);
        cursor: pointer;

        &:focus {
            outline: none;
        }
        
        option {
            color: inherit;
            background-color: var(--option-bg);
        }
    }
}
</style>
