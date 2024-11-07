<script setup lang="ts">

import { onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'
import { videoOverlay } from 'leaflet'

interface Props {
    videoUrl: string
    mediaType: string
    seekTime: number
}

const props = defineProps<Props>()

const hasSeeked = ref(false)
const hasEventListener = ref(false)

// IMPORTANT: variable needs to be the same name as the element ref
const video = ref(null as HTMLVideoElement | null)

function seekHandler() {
    if (video.value) {
        if (!hasSeeked.value) {
            video.value.currentTime = props.seekTime
            hasSeeked.value = true
            window.dispatchEvent(new Event('resize'));
        }
    }
}

onMounted(() => {
    if (props.videoUrl) {
        document.getElementById("video-player")?.addEventListener("loadeddata", seekHandler)
        hasEventListener.value = true
    }
})

onBeforeUnmount(() => {
    if (hasEventListener.value) {
        document.getElementById("video-player")?.removeEventListener("loadeddata", seekHandler)
    }
})


</script>

<template>
    <div>
        <video
            v-if="props.videoUrl"
            id="video-player"
            ref="video"
            preload="auto"
            controls
        >
            <source :src="props.videoUrl" :type="props.mediaType">
        </video>
        <div v-if="!props.videoUrl">No web friendly video available</div>
    </div>
</template>

<style scoped>
#video-player {
    width: 100%;
    object-fit: cover;
}
</style>
