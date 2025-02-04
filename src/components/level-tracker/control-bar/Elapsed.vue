<script setup lang="ts">
</script>

<template>
    <div class="elapsed">
        00:00
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