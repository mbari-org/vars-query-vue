<script setup lang="ts">
import { useQueryResultsStore } from '@/stores/query-results'
import { computed, onMounted, ref, watch } from 'vue'
import AnnotationsMap from '@/components/results/AnnotationsMap.vue'
import {
    type FauxAnnotation,
    fauxAssociationToString,
    fauxAssociationToStringTrimmed,
} from '@/assets/ts/annosaurus/QueryResults'
import VamVideoPlayer from '@/components/vampiresquid/VamVideoPlayer.vue'
import SaveOptions from '@/components/results/SaveOptions.vue'
import ImageThumbnail from '@/components/results/ImageThumbnail.vue'
import { useSelectedColumnsStore } from '@/stores/query-params'

const emit = defineEmits(['selected-annotation'])
const queryResultsStore = useQueryResultsStore()
const allAnnotations = queryResultsStore.annotations
const imageOnlyAnnotations = computed(() =>
    allAnnotations.filter(a => a.images && a.images.length > 0),
)
const showImagesOnly = ref(false)
const search = ref('')
const selectedColumnsStore = useSelectedColumnsStore()
const tableHeader = computed(() => {
    const columns = Array.from(selectedColumnsStore.selectableColumns)
    columns.push('details')
    columns.sort()
    const prepend = ["row", "image", "concept", "video_sequence_name", "index_recorded_timestamp", "observer"]
    for (let i = prepend.length - 1; i >= 0; i--) {
        const col = prepend[i]
        const idx = columns.indexOf(col)
        if (idx !== -1) {
            columns.splice(idx, 1)
        }
        columns.unshift(col)
    }
    // columns.unshift("observer")
    // columns.unshift("video_sequence_name")
    // columns.unshift("concept")
    // columns.unshift('image')
    // columns.unshift("row")
    // remove associations
    const idx = columns.indexOf('associations')
    if (idx !== -1) {
        columns.splice(idx, 1)
    }

    return columns.map(c => {
        return {
            title: c.replace(/_/g, " "), // Replace all underscores with spaces
            key: c,
            value: c,
        }
    })
})
const selectedRow = ref([] as number[])
const annotationsMapRef = ref<InstanceType<typeof AnnotationsMap> | null>(null)
const minimizeMapAndVideo = ref(false)
const minimizeMapAndVideoKey = 'minimizeMapAndVideo'

const floatMapAndVideo = ref(false)
watch(floatMapAndVideo, newVal => {
    if (newVal) {
        document.getElementById('map-and-video')?.classList.add('fixed')
        document.getElementById('annotation-table')?.classList.add('fixed-table')
    } else {
        document.getElementById('map-and-video')?.classList.remove('fixed')
        document.getElementById('annotation-table')?.classList.remove('fixed-table')
    }
})

const compactMapAndVideo = ref(false)

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
            |
            <router-link to="large-results-view" class="view-link">View "big data" table</router-link>
        </v-row>
        <v-row>
            <v-col>
                <v-card id="map-and-video" :class="{ compact: compactMapAndVideo, fixed: floatMapAndVideo }">
                    <div class="map-video-content">
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
                    </div>
                    <v-card-actions>
                        <v-checkbox label="Hide map and video" v-model="minimizeMapAndVideo"></v-checkbox>
                        <v-checkbox label="Float map and video" v-model="floatMapAndVideo"></v-checkbox>
                        <v-checkbox label="Compact map and video" v-model="compactMapAndVideo" />
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card :title="viewedAnnotations.length + ' Results'" flat id="annotation-table">
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
                        :headers="tableHeader"
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
    /*max-height: 40%;*/
}

@media (min-width: 2048px) {
    .fixed > v-row > v-col{
        max-height: 25%;
        min-width: 25%;
    }

    .fixed-table {
        margin-top: calc(25vh + 10px);
    }
}


.fixed > v-row > v-col {
    max-height: 40%;
    min-width: 45%;
}

.fixed-table {
    margin-top: calc(40vh + 10px);
}

.map-video-content {
    transition: max-height 0.3s ease;
}

/* normal size */
#map-and-video .map-video-content {
    max-height: 60vh; /* adjust to taste */
}

/* compact size */
#map-and-video.compact .map-video-content {
    max-height: 25vh; /* shrinks proportionally */
}

/* ensure children fill available height */
.map-video-content .v-row,
.map-video-content .v-col {
    height: 100%;
}
</style>

