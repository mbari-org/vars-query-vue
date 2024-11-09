import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
    crushQueryResultToAnnotations,
    extractRepresentativeImage, type FauxAnnotation,
    GeoFauxAnnotation, type QueryResult
} from '@/assets/ts/annosaurus/QueryResults'
import { tabDelimitedToObject } from '@/assets/ts/util'

export const useQueryResultsStore = defineStore('query-results', () => {

    const rawQueryResults = ref([] as string[])

    // const queryResults = ref([] as QueryResult[])

    const queryResults = computed(() => tabDelimitedToObject(rawQueryResults.value) as QueryResult[])

    const annotations = computed(() => {
        return crushQueryResultToAnnotations(queryResults.value)
            .map((a, row) => {
                const image = extractRepresentativeImage(a)
                const newAnno = {row, image, ...a} as FauxAnnotation
                return new GeoFauxAnnotation(newAnno)
            })
    })


    function reset() {
        rawQueryResults.value = []
    }

    function appendRawQueryResults(results: string[]) {
        rawQueryResults.value = rawQueryResults.value.concat(results)
    }



    return { rawQueryResults, queryResults, annotations, reset, appendRawQueryResults }

})


