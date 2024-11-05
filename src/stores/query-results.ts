import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQueryResultsStore = defineStore('query-results', () => {
    const queryResults = ref([] as Record<string, string | null>[])

    function reset() {
        queryResults.value = []
    }

    function setQueryResults(results: Record<string, string | null>[]) {
        queryResults.value = results
    }

    return { queryResults, reset, updateQueryResults: setQueryResults }

})
