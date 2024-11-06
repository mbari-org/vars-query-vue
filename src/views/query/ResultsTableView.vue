<script setup lang="ts">

import {useQueryResultsStore} from '@/stores/query-results'
import { computed, ref, watch } from 'vue'
import AnnotationsMap from '@/components/query/AnnotationsMap.vue'
import { type FauxAnnotation, GeoFauxAnnotation } from '@/assets/ts/annosaurus/QueryResults'

const queryResultsStore = useQueryResultsStore()

const search = ref('')

const selectedRow = ref(null as number | null)

const emit = defineEmits(['selected-annotation'])

// const fauxAnnotations = computed(() => queryResultsStore.annotations.map((a) => a.annotation))

const fauxAnnotations = computed(() =>
    queryResultsStore.annotations.map((a, id) => {
        const annotation = a.annotation;
        const imageUrl = a.image; // Extract first image URL if available
        return {imageUrl, ...annotation} as FauxAnnotation;
    })
)

watch(selectedRow, (newVal) => {
    if (newVal) {
        const selection = fauxAnnotations.value.find((a) => a.id === newVal)
        // console.log('selectedRow', newVal)
        emit('selected-annotation', selection)
    }
})

function setSelectedFauxAnnotation(annotation: FauxAnnotation) {
    if (Array.isArray(annotation)) {
        annotation = annotation[0]
    }
    // console.log('setSelectedQueryResult', annotation)
    selectedRow.value = annotation
}

</script>

<template>
    <annotations-map @selected-annotation="setSelectedFauxAnnotation"></annotations-map>
    <v-card title="Results" flat>
        <template v-slot:text>
            <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line>
            </v-text-field>
        </template>

        <v-data-table
            :items="fauxAnnotations"
            :search="search"
            select-strategy="single"
            show-select
            show-current-page="true"
            v-model="selectedRow">
            <template v-slot:item.images="{ item }">
            </template>
            <template v-slot:item.imageUrl="{ item }">
<!--                <v-hover v-slot:default="{ isHovering }">-->
                    <v-img :src="item.imageUrl" max-width="500" max-height="500" v-if="item.imageUrl">
                    </v-img>
<!--                    <div class="thumbnail-container">-->
<!--                    <v-img-->
<!--                        v-if="isHovering && item.imageUrl"-->
<!--                        :src="item.imageUrl"-->
<!--                        max-width="500"-->
<!--                        max-height="500"-->
<!--                        class="popup-image"></v-img>-->
<!--                    </div>-->
<!--                </v-hover>-->
            </template>
        </v-data-table>
    </v-card>

</template>

<style scoped>
.thumbnail-container {
    position: relative;
    display: inline-block;
}

.popup-image {
    position: absolute;
    top: 0;
    //left: 200px; /* Adjust this to control popup position */
    z-index: 10;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    border: 1px solid #ddd;
    border-radius: 4px;
}
</style>
