<script setup lang="ts">

import {useQueryResultsStore} from '@/stores/query-results'
import { ref, watch } from 'vue'
import AnnotationsMap from '@/components/query/AnnotationsMap.vue'

const queryResultsStore = useQueryResultsStore()

const search = ref('')

const selectedRow = ref(null)

const emit = defineEmits(['selected-annotation'])

watch(selectedRow, (newVal) => {
    if (newVal) {
        console.log('selectedRow', newVal)
        emit('selected-annotation', newVal)
    }
})

function setSelectedQueryResult(queryResult: any) {
    if (Array.isArray(queryResult)) {
        queryResult = queryResult[0]
    }
    console.log('setSelectedQueryResult', queryResult)
    selectedRow.value = queryResult
}

</script>

<template>
    <annotations-map @selected-annotation="setSelectedQueryResult"></annotations-map>
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
            :items="queryResultsStore.queryResults"
            :search="search"
            select-strategy="single"
            show-select
            return-object
            v-model="selectedRow"></v-data-table>

    </v-card>

</template>

<style scoped>

</style>
