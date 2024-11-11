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
                const image = extractRepresentativeImage(b)
                return {row, image, ...b} as FauxAnnotation
            })
    })

    const geoAnnotations = computed(() => annotations.value.map(a => new GeoFauxAnnotation(a)))


    function reset() {
        rawQueryResults.value = []
    }

    function appendRawQueryResults(results: string[]) {
        rawQueryResults.value = rawQueryResults.value.concat(results)
    }



    return { rawQueryResults, queryResults, annotations, geoAnnotations, reset, appendRawQueryResults }

})


