<script setup lang="ts">
import { useQueryResultsStore } from '@/stores/query-results'
import { computed, ref, watch } from 'vue'
import AnnotationsMap from '@/components/query/AnnotationsMap.vue'
import {
    type FauxAnnotation,
    fauxAssociationToString,
    fauxAssociationToStringTrimmed,
} from '@/assets/ts/annosaurus/QueryResults'
import VamVideoPlayer from '@/components/vampiresquid/VamVideoPlayer.vue'
import SaveOptions from '@/components/query/SaveOptions.vue'

const emit = defineEmits(['selected-annotation'])
const queryResultsStore = useQueryResultsStore()
const allAnnotations = queryResultsStore.annotations
const imageOnlyAnnotations = computed(() =>
    allAnnotations.filter(a => a.images && a.images.length > 0),
)
const showImagesOnly = ref(false)
const search = ref('')
const selectedRow = ref([] as number[])
const hoveredImage = ref<string | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)
const tab = ref<string | null>(null)

const selectedAnnotation = computed(() => {
    if (selectedRow.value?.length === 1) {
        return allAnnotations.find(a => a.row === selectedRow.value[0])
    }
    return null as FauxAnnotation | null
})

const viewedAnnotations = computed(() => {
    if (showImagesOnly.value) {
        return imageOnlyAnnotations.value
    } else {
        return allAnnotations
    }
})

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

watch(selectedAnnotation, newVal => {
    if (newVal) {
        // console.log('selectedRow', newVal)
        emit('selected-annotation', newVal)
    }
})

function setSelectedFauxAnnotation(annotation: FauxAnnotation) {
    if (Array.isArray(annotation)) {
        annotation = annotation[0]
    }
    // console.log('setSelectedQueryResult', annotation)
    if (annotation.row) {
        selectedRow.value = [annotation.row]
    } else {
        selectedRow.value = []
    }
}

function nestedFilter(
    value: string,
    search: string,
    item?: any,
): boolean | number | [number, number] | [number, number][] {
    if (!search) return true
    if (!value) return false

    if (Array.isArray(value)) {
        return value.some(v => nestedFilter(v, search, item))
    } else if (typeof value === 'object') {
        return Object.values(value).some(v =>
            nestedFilter(`${v}`, search, item),
        )
    } else {
        return String(value).toLowerCase().includes(search.toLowerCase())
    }
}

function handleRowClick(event: MouseEvent, row: any) {
    // console.log('click', row)
    selectedRow.value = [row.item.row]
}

</script>

<template>
    <v-container fluid style="width:100%">
        <v-row>
            <!--<v-col>-->
                <router-link to="results-image-grid-view" class="view-link">View image grid</router-link>
            <!--</v-col>-->
                |
            <!--<v-col>-->
                <router-link to="results-summary-view" class="view-link">View summary</router-link>
            <!--</v-col>-->
        </v-row>
        <v-row>
            <v-col>
                <v-card>
                <v-tabs v-model="tab">
                    <v-tab value="map">Map</v-tab>
                    <v-tab value="video">Video</v-tab>
                </v-tabs>
                <v-tabs-window v-model="tab">
                    <v-tabs-window-item value="map">
                        <v-lazy>
                            <annotations-map
                                @selected-annotation="setSelectedFauxAnnotation"
                            ></annotations-map>
                        </v-lazy>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="video">
                        <v-lazy>
                            <vam-video-player
                                :source-video-uri="selectedAnnotation?.video_uri"
                                :recorded-timestamp="
                                selectedAnnotation?.index_recorded_timestamp
                            "
                            ></vam-video-player>
                        </v-lazy>
                    </v-tabs-window-item>
                </v-tabs-window>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card :title="allAnnotations.length + ' Results'" flat>
                    <template v-slot:text>
                        <v-container>
                            <v-row>
                                <v-col cols="9">
                                    <v-text-field
                                        v-model="search"
                                        label="Search"
                                        prepend-inner-icon="mdi-magnify"
                                        variant="outlined"
                                        hide-details
                                        clearable
                                        single-line
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-checkbox
                                        label="Images only"
                                        v-model="showImagesOnly"
                                    ></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-container>
                    </template>

                    <v-data-table
                        :items="viewedAnnotations"
                        :search="search"
                        :custom-filter="nestedFilter"
                        :hover="true"
                        @click:row="handleRowClick"
                        item-value="row"
                        select-strategy="single"
                        show-select
                        show-current-page
                        v-model="selectedRow"
                    >

                        <!-- Hide the images column -->
                        <template v-slot:item.images="{ item }"><span class="dimmer">&lt;hidden&gt;</span></template>


                        <!-- Define the image column with hover functionality -->
                        <template v-slot:item.image="{ item }">
                            <v-lazy>
                                <v-img
                                    :src="item.image"
                                    aspect-ratio="1"
                                    max-width="500"
                                    max-height="500"
                                    @mouseenter="
                                        (event: MouseEvent) =>
                                            showImagePreview(item.image, event)
                                    "
                                    @mouseleave="hideImagePreview"
                                    v-if="item.image"
                                >
                                </v-img>
                            </v-lazy>
                        </template>
                        <template v-slot:item.details="{ item }">
                            <div>
                                <v-chip
                                    v-for="(detail, idx) in item.details"
                                    :key="idx"
                                >
                                    {{
                                        fauxAssociationToStringTrimmed(
                                            detail,
                                            40,
                                        )
                                    }}
                                    <v-tooltip
                                        activator="parent"
                                        location="bottom"
                                        >{{ fauxAssociationToString(detail) }}
                                    </v-tooltip>
                                </v-chip>
                            </div>
                        </template>
                    </v-data-table>
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
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <save-options></save-options>
            </v-col>
        </v-row>

    </v-container>
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

.view-link {
    margin-left: 1em;
    margin-right: 1em;
}

.selected-row {
    background-color: rgba(255, 165, 0, 0.2); /* Dim orange color */
}

.dimmer {
    color: #484848;
}
</style>
<!--
Trying to highlight selected row in the table by adding
:item-class="(item) => (selectedRow.includes(item.row) ? 'selected-row' : '')"
to the v-data-table element, but it doesn't work.
-->
