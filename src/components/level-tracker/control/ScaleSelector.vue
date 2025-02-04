<script setup lang="ts">
import { ref } from 'vue';

const options = ref([
    { value: 1, unit: "m" },
    { value: 4, unit: "m" },
    { value: 12, unit: "m" },
    { value: 30, unit: "m" },
    { value: 1, unit: "h" },
    { value: 30, unit: "s" },
]);

const scale = ref<number | null>(options.value[0]?.value ?? null);
</script>

<template>
    <div class="scale-selector">
        <select v-model="scale" id="options">
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.value }}{{ option.unit }}
            </option>
        </select>
    </div>
</template>

<style scoped lang="scss">
.scale-selector{
    width: 85%;
    display: flex;
    justify-content: center;
    select {
        text-align: center;
    }
}
</style>