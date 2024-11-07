<script setup lang="ts">

import {useQueryResultsStore} from '@/stores/query-results'
import { computed, ref, watch } from 'vue'
import AnnotationsMap from '@/components/query/AnnotationsMap.vue'
import {
    type FauxAnnotation,
    fauxAssociationToString,
    fauxAssociationToStringTrimmed,
} from '@/assets/ts/annosaurus/QueryResults'
import VamVideoPlayer from '@/components/vampiresquid/VamVideoPlayer.vue'


const emit = defineEmits(['selected-annotation'])
const queryResultsStore = useQueryResultsStore()
const allAnnotations = computed(() => queryResultsStore.annotations.map((a) => a.annotation))


const search = ref('')

const selectedRow = ref(null as number | null)

const selectedAnnotation = computed(() => {
    if (!selectedRow.value) {
        return null as FauxAnnotation | null
    }
    return allAnnotations.value.find((a) => a.id === selectedRow.value)
})


watch(selectedAnnotation, (newVal) => {
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
    selectedRow.value = annotation.id || null
}

</script>

<template>
    <annotations-map @selected-annotation="setSelectedFauxAnnotation"></annotations-map>
    <vam-video-player :source-video-uri="selectedAnnotation?.video_uri" :recorded-timestamp="selectedAnnotation?.index_recorded_timestamp"></vam-video-player>
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
            :items="allAnnotations"
            :search="search"
            select-strategy="single"
            show-select
            show-current-page
            v-model="selectedRow">
            <template v-slot:item.images="{ item }">
            </template>
            <template v-slot:item.image="{ item }">
<!--                <v-hover v-slot:default="{ isHovering }">-->
                    <v-img :src="item.image" aspect-ratio="1" max-width="500" max-height="500" v-if="item.image">
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
            <template v-slot:item.details="{ item }">
                <div>
                    <v-chip v-for="(detail, idx) in item.details" :key="idx">
                        {{ fauxAssociationToStringTrimmed(detail, 40) }}
                        <v-tooltip activator="parent" location="bottom">{{ fauxAssociationToString(detail) }}</v-tooltip>
                    </v-chip>
                </div>
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
