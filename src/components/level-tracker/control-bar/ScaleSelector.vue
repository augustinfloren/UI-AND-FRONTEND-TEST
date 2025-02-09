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
.scale-selector{
    display: flex;
    justify-content: center;
    select {
        margin-right: 3rem;
        text-align: center;
    }
}
</style>
