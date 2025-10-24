<script setup lang="ts">
import { ref, computed, defineProps, watch } from 'vue'
import  { type FauxAnnotation, fauxAssociationToString } from '@/assets/ts/annosaurus/QueryResults'
import FauxAnnotationRow from './FauxAnnotationRow.vue'
import VamVideoPlayer from '@/components/vampiresquid/VamVideoPlayer.vue'

const props = defineProps<{
    annotations: FauxAnnotation[]
}>()

// --- Filtered annotations ---

// Annotations that have images
const imageAnnotations = computed(() =>
    props.annotations.filter((a) => a.image !== undefined && a.image !== null)
)

// Annotations to show based on "images only" filter
const viewableAnnotations = computed(() =>{
    if (showImagesOnly.value) {
        return imageAnnotations.value
    } else {
        return props.annotations
    }
})

// Annotations to show based on a combination of the search filter and images only filter
const shownAnnotations = computed(() => {
    if (search.value?.trim() === '') {
        return viewableAnnotations.value
    } else {
        const lowerSearch = search.value?.toLowerCase()
        if (!lowerSearch) return viewableAnnotations.value
        return viewableAnnotations.value.filter((a) => {
            return (
                (a.concept && a.concept.toLowerCase().includes(lowerSearch)) ||
                (a.video_sequence_name &&
                    a.video_sequence_name.toLowerCase().includes(lowerSearch)) ||
                (a.observer && a.observer.toLowerCase().includes(lowerSearch)) ||
                (a.details &&
                    a.details.some((detail) =>
                        fauxAssociationToString(detail).toLowerCase().includes(lowerSearch)
                    )) ||
                (a.index_recorded_timestamp &&
                    a.index_recorded_timestamp.includes(lowerSearch))
            )
        })
    }
})

// --- Selected annotation when user clicks on row ---
const selectedAnnotation = ref<FauxAnnotation | null>(null)
function selectAnnotation(a: FauxAnnotation) {
    selectedAnnotation.value = a
}

// --- Filter state ---
const search = ref('')
const showImagesOnly = ref(false)

// --- Pagination state ---
const pageSizeOptions = [50, 100, 1000]
const pageSize = ref(50)
const currentPage = ref(1)
const pageInput = ref(1) // editable field

// --- Derived data ---
const totalPages = computed(() =>
    Math.max(1, Math.ceil(shownAnnotations.value.length / pageSize.value))
)

const pagedAnnotations = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return shownAnnotations.value.slice(start, end)
})

// --- Methods ---
function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

function changePageSize(size: number) {
    pageSize.value = size
    currentPage.value = 1
    pageInput.value = 1
}

watch(shownAnnotations, () => {
    // Reset to first page when filter changes
    currentPage.value = 1
})

// --- Keep pageInput and currentPage in sync both ways ---
watch(pageInput, (newVal) => {
    const page = Math.min(Math.max(1, newVal), totalPages.value)
    currentPage.value = page
})

watch(currentPage, (newVal) => {
    // Avoid unnecessary updates to prevent cursor jumps
    if (pageInput.value !== newVal) pageInput.value = newVal
})


</script>

<template>
    <div class="annotation-table">
        <div class="map-video-content">
            <vam-video-player
                hidden="hidden"
                :source-video-uri="selectedAnnotation?.video_uri"
                :recorded-timestamp="selectedAnnotation?.index_recorded_timestamp">
            </vam-video-player>
        </div>

        <h3>Total Annotations: {{annotations.length}} | Viewed Annotations: {{shownAnnotations.length}}</h3>
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
        <!-- Controls -->
        <div class="controls">
            <label>
                Page size:
                <select v-model.number="pageSize" @change="changePageSize(pageSize)">
                    <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">
                        {{ opt }}
                    </option>
                </select>
            </label>

            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">◀ Prev</button>

                <span>Page</span>
                <input
                    v-model.number="pageInput"
                    type="number"
                    min="1"
                    :max="totalPages"
                    class="page-input"
                />
                <span>/ {{ totalPages }}</span>

                <button @click="nextPage" :disabled="currentPage === totalPages">Next ▶</button>
            </div>
        </div>

        <!-- Table -->
        <table class="data-table">
            <thead>
                <tr>
                    <th>Row</th>
                    <th>Image</th>
                    <th>Concept</th>
                    <th>Video Sequence Name</th>
                    <th>Recorded Timestamp</th>
                    <th>Observer</th>
                    <th>Depth (m)</th>
                    <th>Details</th>
                </tr>
            </thead>

            <tbody>
                <FauxAnnotationRow
                    v-for="a in pagedAnnotations"
                    :key="a.row"
                    :annotation="a"
                    :class="{ selected: a === selectedAnnotation }"
                    @click="selectAnnotation(a)"
                />
            </tbody>
        </table>

        <!-- Controls -->
        <div class="controls">
            <label>
                Page size:
                <select v-model.number="pageSize" @change="changePageSize(pageSize)">
                    <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">
                        {{ opt }}
                    </option>
                </select>
            </label>

            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">◀ Prev</button>

                <span>Page</span>
                <input
                    v-model.number="pageInput"
                    type="number"
                    min="1"
                    :max="totalPages"
                    class="page-input"
                />
                <span>/ {{ totalPages }}</span>

                <button @click="nextPage" :disabled="currentPage === totalPages">Next ▶</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.annotation-table {
    overflow-x: auto;
    white-space: nowrap;
    font-size: 0.9rem;
}

.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.pagination {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.page-input {
    width: 4rem;
    padding: 0.2rem 0.3rem;
    text-align: center;
}

.data-table {
    border-collapse: collapse;
    width: 100%;
    table-layout: auto;
}

.data-table tr:nth-child(even) {
    background-color: #131313; /* dark gray for even rows */
}

.data-table tr:nth-child(odd) {
    background-color: #080808; /* black for odd rows */
}

.data-table tr.selected {
    background-color: #cce5ff; /* light blue highlight */
}

.data-table tr.selected:hover {
    background-color: #b3d8ff; /* slightly darker on hover */
}

.map-video-content {
    max-height: 60vh; /* adjust to taste */
}

th,
td {
    border: 1px solid #ddd;
    padding: 0.4rem 0.6rem;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

thead th {
    position: sticky;
    top: 0;
    background: #333333;
    z-index: 2;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
