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
    transition: all 0.1s ease;
    
    img {
        width: 1.7rem;
    }
    
    &:hover {
        cursor: pointer;
        transform: rotate(15deg);
        opacity: 0.8;
    }
}
</style>