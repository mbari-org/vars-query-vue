<script setup lang="ts">
import { useQueryResultsStore } from '@/stores/query-results'
import { computed, onMounted, ref, watch } from 'vue'
import AnnotationsMap from '@/components/query/AnnotationsMap.vue'
import {
    type FauxAnnotation,
    fauxAssociationToString,
    fauxAssociationToStringTrimmed,
} from '@/assets/ts/annosaurus/QueryResults'
import VamVideoPlayer from '@/components/vampiresquid/VamVideoPlayer.vue'
import SaveOptions from '@/components/query/SaveOptions.vue'
import ImageThumbnail from '@/components/query/ImageThumbnail.vue'

const emit = defineEmits(['selected-annotation'])
const queryResultsStore = useQueryResultsStore()
const allAnnotations = queryResultsStore.annotations
const imageOnlyAnnotations = computed(() =>
    allAnnotations.filter(a => a.images && a.images.length > 0),
)
const showImagesOnly = ref(false)
const search = ref('')
const selectedRow = ref([] as number[])
const tab = ref<string | null>(null)
const annotationsMapRef = ref<InstanceType<typeof AnnotationsMap> | null>(null)
const minimizeMapAndVideo = ref(false)
const minimizeMapAndVideoKey = 'minimizeMapAndVideo'

const floatMapAndVideo = ref(false)
watch(floatMapAndVideo, newVal => {
    if (newVal) {
        document.getElementById('map-and-video')?.classList.add('fixed')
    } else {
        document.getElementById('map-and-video')?.classList.remove('fixed')
    }
})

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

watch (minimizeMapAndVideo, newVal => {
    window.localStorage.setItem(minimizeMapAndVideoKey, newVal.toString())
})

onMounted(() => {
    const val = window.localStorage.getItem(minimizeMapAndVideoKey)
    if (val) {
        minimizeMapAndVideo.value = val === 'true'
    }
})


watch(selectedAnnotation, newVal => {
    if (newVal) {
        // console.log('selectedRow', newVal)
        emit('selected-annotation', newVal)
        annotationsMapRef.value?.setSelectedFauxAnnotation(newVal)
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

function handleRowClick(event: MouseEvent, row: { item: { row: number } }) {
    // console.log('click', row)
    selectedRow.value = [row.item.row]
}


const rowProps = computed(() => {
    return (item: any) => {

        const clazz = selectedRow.value.includes(item.item.row) ? 'selected-row' : ''
        const color = selectedRow.value.includes(item.item.row) ? '#014260' : ''
        const p = {
            class: clazz,
            bgcolor: color /* Dim orange color */
        }

        // console.log('rowProps', p, selectedRow.value, item.item.row)
        return p
    }
})
//
// function rowProps(item: any) {
//     const clazz = selectedRow.value.includes(item.row) ? 'selected-row' : ''
//     const color = selectedRow.value.includes(item.row) ? 'red' : 'blue'
//     const p = {
//         class: clazz,
//         bgcolor: color /* Dim orange color */
//     }
//     console.log('rowProps', p)
//     return p
// }

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
<!--            <v-col>-->
<!--                <v-card>-->
<!--                <v-tabs v-model="tab">-->
<!--                    <v-tab value="map">Map</v-tab>-->
<!--                    <v-tab value="video">Video</v-tab>-->
<!--                </v-tabs>-->
<!--                <v-tabs-window v-model="tab">-->
<!--                    <v-tabs-window-item value="map">-->
<!--                        <v-lazy>-->
<!--                            <annotations-map-->
<!--                                ref="annotationsMapRef"-->
<!--                                @selected-annotation="setSelectedFauxAnnotation"-->
<!--                            ></annotations-map>-->
<!--                        </v-lazy>-->
<!--                    </v-tabs-window-item>-->
<!--                    <v-tabs-window-item value="video">-->
<!--                        <v-lazy>-->
<!--                            <vam-video-player-->
<!--                                :source-video-uri="selectedAnnotation?.video_uri"-->
<!--                                :recorded-timestamp="-->
<!--                                selectedAnnotation?.index_recorded_timestamp-->
<!--                            "-->
<!--                            ></vam-video-player>-->
<!--                        </v-lazy>-->
<!--                    </v-tabs-window-item>-->
<!--                </v-tabs-window>-->
<!--                </v-card>-->
<!--            </v-col>-->
            <v-col>
                <v-card id="map-and-video">
                    <v-row>
                        <v-col>
                                <annotations-map
                                    ref="annotationsMapRef"
                                    :hidden="minimizeMapAndVideo"
                                    @selected-annotation="setSelectedFauxAnnotation"
                                ></annotations-map>
                        </v-col>
                        <v-col>
                                <vam-video-player
                                    :hidden="minimizeMapAndVideo"
                                    :source-video-uri="selectedAnnotation?.video_uri"
                                    :recorded-timestamp="
                                    selectedAnnotation?.index_recorded_timestamp
                                "
                                ></vam-video-player>
                        </v-col>
                    </v-row>
                    <v-card-actions>
                        <v-checkbox label="Hide map and video" v-model="minimizeMapAndVideo"></v-checkbox>
                        <v-checkbox label="Float map and video" v-model="floatMapAndVideo"></v-checkbox>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card :title="viewedAnnotations.length + ' Results'" flat>
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
                                        density="compact"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-checkbox
                                        label="Images only"
                                        v-model="showImagesOnly"
                                        density="compact"
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
                        :row-props="rowProps"
                        select-strategy="single"
                        show-select
                        show-current-page
                        density="compact"
                        v-model="selectedRow"
                    >

                        <!-- Hide the images column -->
                        <template v-slot:item.images="{ item }"><span class="dimmer">&lt;hidden&gt;</span></template>

                        <!-- Define the image column with hover functionality -->
                        <template v-slot:item.image="{ item }">
                            <image-thumbnail :annotation="item"></image-thumbnail>
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

.view-link {
    margin-left: 1em;
    margin-right: 1em;
}

.selected-row {
    background-color: rgba(255, 165, 165, 0.8); /* Dim orange color */
}

.dimmer {
    color: #484848;
}

.fixed {
    position: fixed;
    top: 5%; /* Adjust as needed */
    right: 5%; /* Adjust as needed */
    width: 90%;
    z-index: 9999;
    //max-height: 40%;
}

.fixed > v-row > v-col {
    max-height: 40%;
    min-width: 45%;
}
</style>
<!--
Trying to highlight selected row in the table by adding
:item-class="(item) => (selectedRow.includes(item.row) ? 'selected-row' : '')"
to the v-data-table element, but it doesn't work.
-->
