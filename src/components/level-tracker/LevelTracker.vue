<script setup lang="ts">
import { store } from "@/store/levelTrackerStore";
import InstantLevel from "./instant-level/InstantLevel.vue";
import ControlBar from "./control-bar/Control-bar.vue";
import Histogram from "./histogram/Histogram.vue";
</script>

<template>
    <div class="level-tracker panel">
        <header>
            <h2>Loud Tracker</h2>
        </header>

        <ControlBar />

        <div class="level-tracker__main">
            <Histogram />
            <div class="instant-level-container">
                <InstantLevel type="RMS" :value="store.instantRMS"/>
                <InstantLevel type="LUFS" :value="store.instantLUFS"/>              
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/base/colors-semantic";
@use "@/styles/base/typography";
@use "@/styles/base/space";
@use "@/styles/base/decoration";

.level-tracker{
    height: 35rem;
    width: 37rem;
    display: flex;
    flex-direction: column;
    @include decoration.box-shadow-bottom;

    header{
        height: 7%;
        display: flex;
        align-items: center;
        background-color: colors-semantic.$color-background-layer-3;

        h2{
            padding-left: space.$space-fixed-double;
            font-size: typography.$font-size-6;
            line-height: 0%;
        }
    }

    &__main{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        .instant-level-container{
            height: 100%;
            padding: 24px 0;
            padding-right: 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-grow: 1;
        }
    }
}
</style>