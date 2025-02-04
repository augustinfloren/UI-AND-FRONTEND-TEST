<script setup lang="ts">
const props = defineProps<{
  type: string
  value: number | null
}>()
</script>

<template>
    <div class="level-indicator">
        <span class="level-indicator__type">{{ type }}</span>
        <span class="level-indicator__value">{{ value }}</span>
    </div>
</template>

<style lang="scss" scoped>
@use "@/styles/base/typography";
@use "@/styles/base/colors-semantic";

.level-indicator {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
 
    &__type {
      font-size: typography.$font-size-6;
      color: colors-semantic.$color-foreground-highlighted;
    }
}
</style>
  