<script setup lang="ts">
import type { FauxAnnotation } from '@/assets/ts/annosaurus/QueryResults'
import { computed, ref } from 'vue'

interface Props {
    annotation: FauxAnnotation
}

const props = defineProps<Props>()

const hoveredImage = ref<string | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)

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

</script>

<template>
    <div class="thumbnail">
        <v-lazy v-if="props.annotation.image">
            <v-img
                :src="props.annotation.image"
                aspect-ratio="1"
                max-width="500"
                max-height="500"
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
}

</style>
