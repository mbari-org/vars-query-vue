<script setup lang="ts">

import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import { videoOverlay } from 'leaflet'

interface Props {
    videoUrl: string
    mediaType: string
    seekTimeSeconds: number
}

const props = defineProps<Props>()

const hasSeeked = ref(false)
const hasEventListener = ref(false)

// IMPORTANT: variable needs to be the same name as the element ref
const video = ref(null as HTMLVideoElement | null)

watch(() => props.videoUrl, () => {
    hasSeeked.value = false
})

function seekHandler() {
    if (video.value) {
        if (!hasSeeked.value) {
            video.value.currentTime = props.seekTimeSeconds
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

onUnmounted(() => {
    if (hasEventListener.value) {
        document.getElementById("video-player")?.removeEventListener("loadeddata", seekHandler)
        hasEventListener.value = false
    }
})

function togglePictureInPicture() {
    if (video.value) {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture()
        } else {
            video.value.requestPictureInPicture()
        }
    }
}


</script>

<template>
    <v-container>
        <v-row>
            <v-col>
                <video
                    v-if="props.videoUrl"
                    id="video-player"
                    ref="video"
                    preload="auto"
                    controls
                    :src="props.videoUrl"
                >
                </video>
                <div v-if="!props.videoUrl">No web friendly video available</div>
            </v-col>
        </v-row>
        <v-row align="center">
            <v-col cols="1">
                <v-btn icon="mdi-open-in-new" @click="togglePictureInPicture"></v-btn>
            </v-col>
            <v-col>
                <a :href="videoUrl">{{props.videoUrl}}</a>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
#video-player {
    width: 100%;
    object-fit: cover;
}
</style>
