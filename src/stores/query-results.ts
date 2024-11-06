import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { crushQueryResultToAnnotations, GeoFauxAnnotation, type QueryResult } from '@/assets/ts/annosaurus/QueryResults'

export const useQueryResultsStore = defineStore('query-results', () => {
    const queryResults = ref([] as QueryResult[])

    const annotations = computed(() => {
        return crushQueryResultToAnnotations(queryResults.value)
            .map((a) => new GeoFauxAnnotation(a))
    })


    function reset() {
        queryResults.value = []
    }

    function setQueryResults(results: Record<string, string | null>[]) {
        queryResults.value = results
    }

    return { queryResults, annotations, reset, updateQueryResults: setQueryResults }

})
