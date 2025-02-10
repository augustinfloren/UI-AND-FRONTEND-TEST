<script setup lang="ts">

const props = defineProps<{
  type: string
}>()

</script>

<template>
    <div class="instant-level">
        <span :class="`instant-level__${type}`">{{ type }}</span>
        <span :class="`instant-level__${type}-value`">0</span>
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
  