<script setup lang="ts">

import { useQueryResultsStore } from '@/stores/query-results'

const queryResultsStore = useQueryResultsStore()

function saveRaw() {
    console.log("Save Raw")
    queryResultsStore.queryResults
}

function saveTab() {
    console.log("Save Tab")
}

function saveJSON() {
    console.log("Save JSON")
}
</script>

<template>
<v-container>
    <v-row align="end">
        <v-col>
            <v-btn @click="saveRaw">Save Raw</v-btn>
        </v-col>
        <v-col>
            <v-btn @click="saveTab">Save Tab</v-btn>
        </v-col>
        <v-col>
            <v-btn @click="saveJSON">Save JSON</v-btn>
        </v-col>
    </v-row>
</v-container>
</template>

<style scoped>

</style>
