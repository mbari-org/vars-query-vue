<script setup lang="ts">

import { useQueryResultsStore } from '@/stores/query-results'
import { nowAsCompactString } from '@/assets/ts/util'
import {
    fauxAnnotationsToTsv,
    type FauxAssociation,
    fauxAssociationToString
} from '@/assets/ts/annosaurus/QueryResults'

const queryResultsStore = useQueryResultsStore()

function saveRawTab() {
    console.log("Save Raw")
    const filename = `vars-raw-${nowAsCompactString()}.tsv`
    const data = queryResultsStore.rawQueryResults
    download(data, filename, "text/tab-separated-values")
}

function saveRawJson() {
    const filename = `vars-raw-${nowAsCompactString()}.json`
    const data = queryResultsStore.queryResults
    const json = JSON.stringify(data, null, 2)
    download(json, filename, "application/json")
}

function saveJson() {
    const filename = `vars-${nowAsCompactString()}.json`
    const data = queryResultsStore.annotations.map((a) => a.annotation)
    const json = JSON.stringify(data, null, 2)
    download(json, filename, "application/json")
}

function saveTab() {
    // convert JSON to tsv
    // details get split into columns by link_name
    // Values in same column are separated by semicolon

    const filename = `vars-${nowAsCompactString()}.tsv`
    const data = queryResultsStore.annotations.map((a) => a.annotation)
    const tsvData = fauxAnnotationsToTsv(data)
    download(tsvData, filename, "text/tab-separated-values")
}

function download(data: any, filename: string, mediaType: string) {
    const blob = new Blob([data], {type: mediaType});
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);

}

</script>

<template>
<v-container>
    <v-row align="end">
        <v-col>
            <v-btn @click="saveRawTab">
                Save Raw as TSV
                <v-tooltip activator="parent" location="top">
                    Save the raw query results, as would be returned by a SQL query, as a tab-separated-values file
                </v-tooltip></v-btn>
        </v-col>
        <v-col>
            <v-btn @click="saveRawJson">
                Save Raw as JSON
                <v-tooltip activator="parent" location="top">
                    Save the raw query results, as would be returned by a SQL query, as a JSON
                </v-tooltip>
            </v-btn>
        </v-col>
        <v-col>
            <v-btn @click="saveJson">
                Save JSON
                <v-tooltip activator="parent" location="top">
                    Save the query results as JSON. Best for importing into other applications or python.
                </v-tooltip>
            </v-btn>
        </v-col>
        <v-col>
            <v-btn @click="saveTab">
                <v-tooltip activator="parent" location="top">
                    Save the query results as tab separated values. Great for importing into Excel.
                </v-tooltip>
            </v-btn>
        </v-col>
    </v-row>
</v-container>
</template>

<style scoped>

</style>
