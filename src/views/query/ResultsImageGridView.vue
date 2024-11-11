<script setup lang="ts">
import { useQueryResultsStore } from '@/stores/query-results'
import { computed, ref } from 'vue'

const queryResultsStore = useQueryResultsStore()
const allAnnotations = computed(() =>
    queryResultsStore.annotations.map(a => a.annotation),
)
const imageOnlyAnnotations = computed(() =>
    allAnnotations.value.filter(a => a.images && a.images.length > 0),
)

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


</script>

<template>
    <v-row>
        <v-col>
            <router-link to="/results-table-view">Back to results table</router-link>
        </v-col>
    </v-row>
    <v-row>
        <v-col
            v-for="i in imageOnlyAnnotations"
            :key="i.row ?? 1"
            class="d-flex child-flex"
            cols="4">
            <v-img
                :src="i.image"
                :lazy-src="i.image"
                :class="{ 'highlight-overlay': hoveredImage && hoveredImage !== i.image }"
                aspect-ratio="1"
                contain
                @mouseenter="(event: MouseEvent) =>showImagePreview(i.image, event)"
                @mouseleave="hideImagePreview">
                <template>
                    <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center">
                        <v-progress-circular
                            indeterminate
                        color="grey lighten-5">

                        </v-progress-circular>
                    </v-row>
                </template>
            </v-img>

        </v-col>
    </v-row>
    <!-- Floating enlarged image preview -->
    <div
        v-if="hoveredImage"
        class="image-preview">
        <img :src="hoveredImage" alt="Preview" />
    </div>
</template>

<style scoped>
.image-preview {
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    height: auto;
    max-height: 80vh;
    background: #181818;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    pointer-events: none;
    display: flex;
    justify-content: center;
}

.image-preview img {
    width: 100%;
    height: auto;
    max-height: 80vh;
    object-fit: contain;
}

/* Grey overlay for highlighted image */
.highlight-overlay {
    filter: brightness(0.3);
    transition: filter 0.3s ease;
}
</style>
