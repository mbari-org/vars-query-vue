<script setup lang="ts">
import { useQueryResultsStore } from '@/stores/query-results'
import { computed, ref } from 'vue'
import type { FauxAnnotation, FauxImageReference } from '@/assets/ts/annosaurus/QueryResults'
import { useVampireSquidStore } from '@/stores/vampire-squid'
import type { PreviewMedia } from '@/assets/ts/vampiresquid/PreviewMedia'
import { MAX_NUMBER_OF_ANNOTATIONS } from '@/assets/ts/constants'

const queryResultsStore = useQueryResultsStore()
const allAnnotations =  queryResultsStore.annotations
const imageOnlyAnnotations = computed(() =>
    allAnnotations.filter(a => a.images && a.images.length > 0),
)

const hoveredImage = ref<string | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)
const imagesPerRow = ref(4)
const cols = computed(() => 12 / imagesPerRow.value)
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

function extension(image: string) {
    return image.split('.').pop()
}

function resolveCaption(annotation: FauxAnnotation) {

    if (annotation.video_sequence_name) {
        return annotation.video_sequence_name
    }
    if (annotation.camera_platform) {
        return annotation.camera_platform
    }
    if (annotation.video_name) {
        return annotation.video_name
    }
    if (annotation.chief_scientist) {
        return annotation.chief_scientist
    }
    return annotation.camera_platform ?? ''
}

function sortByUrl(a: FauxImageReference, b: FauxImageReference) {
    return a.url?.localeCompare(b.url ?? '') ?? 0
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

function isBigData(): boolean {
    return queryResultsStore.queryResults?.length > MAX_NUMBER_OF_ANNOTATIONS
}

</script>

<template>
    <v-row>
        <v-col>
            <router-link v-if="isBigData()" to="/large-results-view">Back to results table</router-link>
            <router-link v-else to="/results-table-view">Back to results table</router-link>
        </v-col>
<!--        <v-col cols="2">-->
<!--            <v-btn>Save Images</v-btn>-->
<!--        </v-col>-->
        <v-col cols="2">
            <v-select label="Images per row" v-model="imagesPerRow" :items="[1, 2, 3, 4, 6]"></v-select>
        </v-col>
    </v-row>
    <v-row>
        <v-col
            v-for="i in imageOnlyAnnotations"
            :key="i.row ?? 1"
            class="d-flex child-flex"
            :cols="cols"
        >
            <v-card :title="resolveCaption(i)" :subtitle="i.index_recorded_timestamp ?? ''">
                <v-lazy>
                    <v-img
                        :src="i.image"
                        :lazy-src="i.image"
                        :class="{
                            'highlight-overlay':
                                hoveredImage && hoveredImage !== i.image,
                        }"
                        width="500px"
                        aspect-ratio="1"
                        contain
                        @click="(event: MouseEvent) => showImagePreview(i.image, event)"
                    >
                    </v-img>
                </v-lazy>

                <v-card-text>
                    <span>{{i.concept}} | </span>
                    <v-icon size="small" @click="() => openVideo(i)">mdi-video</v-icon>
                    <a v-for="image in i.images?.sort(sortByUrl)" :key="image.url" :href="image.url"  target="_blank"
                        >{{ extension(image.url ?? '.unknown') }}</a>

                </v-card-text>

            </v-card>
            <!--            <span>{{i.index_recorded_timestamp ?? ''}}</span>-->
        </v-col>
    </v-row>
    <!-- Floating enlarged image preview -->
    <Transition>
        <div v-if="hoveredImage" class="image-preview" @click="hideImagePreview">
            <img :src="hoveredImage" alt="Preview" />
        </div>
    </Transition>
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
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.image-preview img {
    width: 100%;
    height: auto;
    max-height: 80vh;
    object-fit: contain;
    pointer-events: none;
}

/* Grey overlay for highlighted image */
.highlight-overlay {
    filter: brightness(0.3);
    transition: filter 0.3s ease;
}

.small-font {
    font-size: 1.0em;
}

/* Transition for image preview */
.v-enter-active,
.v-leave-active {
    transition: opacity 0.7s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
