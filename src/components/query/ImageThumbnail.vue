<script setup lang="ts">
import type { FauxAnnotation } from '@/assets/ts/annosaurus/QueryResults'
import { computed, ref } from 'vue'
import type { PreviewMedia } from '@/assets/ts/vampiresquid/PreviewMedia'
import { useVampireSquidStore } from '@/stores/vampire-squid'

interface Props {
    annotation: FauxAnnotation
}

const props = defineProps<Props>()

const hoveredImage = ref<string | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)

const vampireSquidStore = useVampireSquidStore()

function showImagePreview(image: string | undefined, event: MouseEvent) {
    if (image) {
        hoveredImage.value = image
        mouseX.value = event.clientX
        mouseY.value = event.clientY
    }
}

function hideImagePreview() {
    hoveredImage.value = null
}

function openImageInNewTab(image: string | undefined) {
    if (image) {
        window.open(image, '_blank')?.focus()
    }
}

function openVideo(a: FauxAnnotation) {
    if (a.video_uri && a.index_recorded_timestamp) {

        vampireSquidStore.api
            .findPreviewMediaByUriAndTimestamp(a.video_uri, a.index_recorded_timestamp)
            .then((pm: PreviewMedia) => {
                if (pm.media && pm.media.uri) {
                    const start = pm.seekTimeSeconds ?? 0
                    const seekUri = `${pm.media.uri}#t=${start}`
                    window.open(seekUri, '_blank')?.focus()
                }
            })
    }
}

</script>

<template>
    <div class="thumbnail">
        <v-lazy v-if="props.annotation.image">
            <v-img
                :src="props.annotation.image"
                aspect-ratio="1"
                max-width="250"
                max-height="250"
                min-width="250"
                min-height="250"
                @mouseenter="
                    (event: MouseEvent) =>
                        showImagePreview(props.annotation.image, event)
                "
                @mouseleave="hideImagePreview"
                @click="() => openImageInNewTab(props.annotation.image)"
                v-if="props.annotation.image"
            >
            </v-img>

        </v-lazy>
<!--        <v-icon icon="mdi-video" size="x-small"></v-icon>-->

        <!-- Floating enlarged image preview -->
        <!-- Disabled hover at video labs request
        <div
            v-if="hoveredImage"
            class="image-preview"
            :style="{
                top: `${mouseY - 120}px`,
                left: `${mouseX}px`,
            }"
        >
            <img :src="hoveredImage" alt="Preview" />
        </div>
        -->

        <v-icon
            size="small"
            class="video-icon"
            @click="() => openVideo(props.annotation)">mdi-video</v-icon>
    </div>
</template>

<style scoped>
.image-preview {
    position: fixed;
    top: 10px;
    left: 10px;
    width: 500px;
    height: 281px;
    border: 2px solid #ccc;
    background: #181818;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    pointer-events: none;
    transform: translate(15px, 15px);
}

.image-preview img {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    object-fit: contain;
}

.thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensure the image fits well */
    position: relative;
}

.video-icon {
    position: absolute;
    color: white;
    bottom: 10px;
    right: 10px;
}
</style>
