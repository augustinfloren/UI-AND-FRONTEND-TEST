<script setup lang="ts">
import { store } from "@/store/levelTrackerStore";

const restart = () => {
    store.restart = true;
}

</script>

<template>
    <div class="reset-button" @click="restart">
        <img src="/img/reset.png" alt="reset button">
    </div>
</template>

<style scoped lang="scss">
.reset-button {
    width: 15%;
    display: flex;
    justify-content: center;
    img {
        width: 1.7rem;
    }
}
</style>