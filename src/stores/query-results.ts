import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
    crushQueryResultToAnnotations,
    extractRepresentativeImage, type FauxAnnotation,
    GeoFauxAnnotation,
    type QueryResult
} from '@/assets/ts/annosaurus/QueryResults'

export const useQueryResultsStore = defineStore('query-results', () => {
    const queryResults = ref([] as QueryResult[])

    const annotations = computed(() => {
        return crushQueryResultToAnnotations(queryResults.value)
            .map((a, id) => {
                const image = extractRepresentativeImage(a)
                const newAnno = {id, image, ...a} as FauxAnnotation
                return new GeoFauxAnnotation(newAnno)
            })
    })


    function reset() {
        queryResults.value = []
    }

    function setQueryResults(results: Record<string, string | null>[]) {
        queryResults.value = results
    }

    return { queryResults, annotations, reset, updateQueryResults: setQueryResults }

})


