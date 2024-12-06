<script setup lang="ts">

import { useQueryResultsStore } from '@/stores/query-results'
import { nowAsCompactString, generateZipDownloadFromAnnotations } from '@/assets/ts/util'
import {
    fauxAnnotationsToTsv,
    type FauxAssociation,
    fauxAssociationToString
} from '@/assets/ts/annosaurus/QueryResults'
import { useAnnosaurusStore } from '@/stores/annosaurus'
import { QueryRunner } from '@/assets/ts/annosaurus/QueryRunner'
import { computed, ref } from 'vue'
import { useVampireSquidStore } from '@/stores/vampire-squid'

const queryResultsStore = useQueryResultsStore()
const vampreSquidStore = useVampireSquidStore()


const saveQueries = () => {
    const api = useAnnosaurusStore().api
    const queryRunner = new QueryRunner(api)
    const data = queryRunner.buildQueries()
    const filename = `vars-queries-${nowAsCompactString()}.json`
    const json = JSON.stringify(data, null, 2)
    download(json, filename, "application/json")
}

const numberOfResults = computed(() => queryResultsStore.annotations.length)

const includePreviewMedia = ref(false)
const okToIncludePreviewMedia = computed(() => numberOfResults.value < 1000)

const saveIsRunning = ref(false)

function saveRawTab() {
    saveIsRunning.value = true
    console.log("Save Raw")
    const filename = `vars-raw-${nowAsCompactString()}.tsv`
    const data = queryResultsStore.rawQueryResults
    download(data, filename, "text/tab-separated-values")
    saveIsRunning.value = false
}

function saveRawJson() {
    saveIsRunning.value = true
    const filename = `vars-raw-${nowAsCompactString()}.json`
    const data = queryResultsStore.queryResults
    const json = JSON.stringify(data, null, 2)
    download(json, filename, "application/json")
    saveIsRunning.value = false
}

async function saveJson() {
    saveIsRunning.value = true
    await addPreviewMediaToAnnotations()
    const filename = `vars-${nowAsCompactString()}.json`
    const data = queryResultsStore.annotations
    const json = JSON.stringify(data, null, 2)
    download(json, filename, "application/json")
    saveIsRunning.value = false
}

async function saveImages() {
    saveIsRunning.value = true
    await addPreviewMediaToAnnotations()
    const filename = `vars-images-${nowAsCompactString()}.zip`
    const data = queryResultsStore.annotations
    const zip = await generateZipDownloadFromAnnotations(data)
    download(zip, filename, "application/zip")
    saveIsRunning.value = false
}

async function saveTab() {
    // convert JSON to tsv
    // details get split into columns by link_name
    // Values in same column are separated by semicolon
    saveIsRunning.value = true
    await addPreviewMediaToAnnotations()
    const filename = `vars-${nowAsCompactString()}.tsv`
    const data = queryResultsStore.annotations
    const tsvData = fauxAnnotationsToTsv(data)
    download(tsvData, filename, "text/tab-separated-values")
    saveIsRunning.value = false
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

async function addPreviewMediaToAnnotations() {
    if (includePreviewMedia.value) {
        // for (const a of queryResultsStore.annotations) {
        //     if (!a.preview_media_uri && a.video_uri && a.index_recorded_timestamp) {
        //         const pm = await vampreSquidStore.api.findPreviewMediaByUriAndTimestamp(a.video_uri, a.index_recorded_timestamp)
        //         a.preview_media_uri = pm.media.uri
        //         a.preview_media_index_seconds = pm.seekTimeSeconds
        //     }
        // }
        const previewableAnnotations = queryResultsStore.annotations.filter(a => !a.preview_media_uri && a.video_uri && a.index_recorded_timestamp)
        const promises = previewableAnnotations.map(async (a) => {
            const pm = await vampreSquidStore.api.findPreviewMediaByUriAndTimestamp(a.video_uri ?? '', a.index_recorded_timestamp ?? '')
            if (pm && pm.media && pm.media.uri) {
                a.preview_media_uri = pm.media.uri
                a.preview_media_index_seconds = pm.seekTimeSeconds ?? 0
            }
        })
        await Promise.all(promises)
    }
}


</script>

<template>
    <v-container>

        <v-row justify="end">
            <v-col align-self="center">
                <v-checkbox :disabled="!okToIncludePreviewMedia" label="Include preview media" v-model="includePreviewMedia" >
                    <v-tooltip v-if="okToIncludePreviewMedia" activator="parent">Include a preview media url and timestamp in the results. Important for tape and real-time annotations. This will take longer to save.</v-tooltip>
                    <v-tooltip v-else activator="parent">Too many results to include preview media urls. Limit is 1000.</v-tooltip>
                </v-checkbox>
            </v-col>
            <v-col align-self="center">
                <v-btn>
                    Save Results
                    <v-menu location="top" activator="parent">
                        <v-list>
                            <v-list-item>
                                <v-btn @click="saveQueries">
                                    Save Queries
                                    <v-tooltip activator="parent" location="bottom">
                                        Save the query constraints as a JSON file.
                                    </v-tooltip>
                                </v-btn>
                            </v-list-item>
                            <v-list-item>
                                <v-btn @click="saveImages" :hidden="numberOfResults > 500">
                                    Save Images
                                    <v-tooltip activator="parent" location="bottom">
                                        Save the images.
                                    </v-tooltip>
                                </v-btn>
                            </v-list-item>
                            <v-list-item>
                                <v-btn @click="saveRawTab">
                                    Save Raw as TSV
                                    <v-tooltip activator="parent" location="bottom">
                                        Save the raw query results, as would be returned by a SQL query, as a tab-separated-values file
                                    </v-tooltip></v-btn>
                            </v-list-item>
                            <v-list-item>
                                <v-btn @click="saveRawJson">
                                    Save Raw as JSON
                                    <v-tooltip activator="parent" location="bottom">
                                        Save the raw query results, as would be returned by a SQL query, as a JSON
                                    </v-tooltip>
                                </v-btn>
                            </v-list-item>
                            <v-list-item>
                                <v-btn @click="saveTab">
                                    Save as TSV
                                    <v-tooltip activator="parent" location="bottom">
                                        Save the query results as tab separated values. Great for importing into Excel.
                                    </v-tooltip>
                                </v-btn>
                            </v-list-item>
                            <v-list-item>
                                <v-btn @click="saveJson">
                                    Save JSON
                                    <v-tooltip activator="parent" location="bottom">
                                        Save the query results as JSON. Best for importing into other applications or python.
                                    </v-tooltip>
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-btn>
            </v-col>
        </v-row>

        <v-overlay
            :model-value="saveIsRunning"
            color="primary"
            class="justify-center align-center">
            <div class="big-font">Saving ...</div>
            <v-progress-circular
                :size="128"
                :width="12"
                color="blue"
                indeterminate
            ></v-progress-circular>
        </v-overlay>

    </v-container>
</template>

<style scoped>
.big-font {
    font-size: 3.5em;
}
</style>
