<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  type: string
  value: number | null
}>()

</script>

<template>
    <div class="instant-level">
        <span class="instant-level__type">{{ type }}</span>
        <span v-if="value" class="instant-level__value">0</span>
        <span v-else class="instant-level__value">0</span>
    </div>
</template>

<style lang="scss" scoped>
@use "@/styles/base/typography";
@use "@/styles/base/colors-semantic";

.instant-level{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: typography.$font-size-3;
    color: colors-semantic.$color-foreground-highlighted;
}
</style>
  