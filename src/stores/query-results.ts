import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
    crushQueryResultToAnnotations,
    extractRepresentativeImage, type FauxAnnotation,
    GeoFauxAnnotation, parseFauxAnnotation, type QueryResult
} from '@/assets/ts/annosaurus/QueryResults'
import { tabDelimitedToObject } from '@/assets/ts/util'

export const useQueryResultsStore = defineStore('query-results', () => {

    const rawQueryResults = ref([] as string[])

    // const queryResults = ref([] as QueryResult[])

    const queryResults = computed(() => tabDelimitedToObject(rawQueryResults.value) as QueryResult[])

    const annotations = computed(() => {
        return crushQueryResultToAnnotations(queryResults.value)
            .map((a, row) => {
                const b = parseFauxAnnotation(a) // convert strings in query results to numbers

                // recorder results so they appear in the data table in the given order
                const image = extractRepresentativeImage(b)
                const concept = a['concept']
                const video_sequence_name = a['video_sequence_name']
                const index_recorded_timestamp = a['index_recorded_timestamp']
                const depth_meters = a['depth_meters']
                const observer = a['observer']
                const details = a['details']
                delete b['concept']
                delete b['video_sequence_name']
                delete b['index_recorded_timestamp']
                delete b['depth_meters']
                delete b['observer']
                delete b['details']
                return {image, concept, video_sequence_name, index_recorded_timestamp, depth_meters, observer, details, ...b, row} as FauxAnnotation
            })
    })

    const geoAnnotations = computed(() => annotations.value.map(a => new GeoFauxAnnotation(a)))

    const selectedAnnotations = ref([] as FauxAnnotation[] | [])

    function reset() {
        rawQueryResults.value = []
    }

    function appendRawQueryResults(results: string[]) {
        rawQueryResults.value = rawQueryResults.value.concat(results)
    }



    return { rawQueryResults, queryResults, annotations, geoAnnotations, selectedAnnotations, reset, appendRawQueryResults }

})


