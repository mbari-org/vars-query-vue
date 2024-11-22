<script setup lang="ts">

import { onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
    videoUrl: string
    mediaType: string
    seekTimeSeconds: number
}

const props = defineProps<Props>()

const hasSeeked = ref(false)
const video = ref(null as HTMLVideoElement | null)

watch(() => props.videoUrl, () => {
    hasSeeked.value = false
})

watch(() => props.seekTimeSeconds, () => {
    hasSeeked.value = false
    if (video.value && !hasSeeked.value) {
        seekHandler()
    }
})

function seekHandler() {
    if (video.value) {
        video.value.currentTime = props.seekTimeSeconds
    }
}

function onCanPlay() {
    if (video.value && !hasSeeked.value) {
        video.value.currentTime = props.seekTimeSeconds
    }
}

function onSeeked() {
    hasSeeked.value = true
}

onMounted(() => {
    if (video.value) {
        video.value.addEventListener('canplay', onCanPlay)
        video.value.addEventListener('seeked', onSeeked)
    }
})

onUnmounted(() => {
    if (video.value) {
        video.value.removeEventListener('canplay', onCanPlay)
        video.value.removeEventListener('seeked', onSeeked)
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
                <div v-if="!props.videoUrl">No web-friendly video available</div>
            </v-col>
        </v-row>
        <v-row align="center">
            <v-col cols="1">
                <v-btn icon="mdi-open-in-new" @click="togglePictureInPicture">
                    <v-icon icon="mdi-open-in-new"></v-icon>
                    <v-tooltip activator="parent" location="bottom">Toggle Picture in Picture</v-tooltip>
                </v-btn>
            </v-col>
            <v-col>
                <a :href="props.videoUrl" target="_blank" class="small-font">{{props.videoUrl}}</a>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
#video-player {
    width: 100%;
    object-fit: cover;
}

.small-font {
    font-size: 0.6em;
}
</style>
