<script setup lang="ts">
import SaveOptions from '@/components/results/SaveOptions.vue'
import FauxAnnotationTable from '@/components/results/FauxAnnotationTable.vue'
import { useQueryResultsStore } from '@/stores/query-results'
import StandardDetails from '@/components/shared/StandardDetails.vue'
import { MAX_NUMBER_OF_ANNOTATIONS } from '@/assets/ts/constants'

const queryResultsStore = useQueryResultsStore()
const allAnnotations = queryResultsStore.annotations

function isNotBigData(): boolean {
    return allAnnotations.length < MAX_NUMBER_OF_ANNOTATIONS
}
</script>


<template>
    <v-container fluid style="width:100%">
        <standard-details summary="About">
            <div>
                If you ended up on this page, you probably have a lot of data to display. To accommodate your glutinous thirst for information, we are disabling a few features so your browser can handle your request. You're welcome!
            </div>
        </standard-details>
        <v-row>
            <v-col>
            <router-link to="results-image-grid-view" class="view-link">View image grid</router-link>
            <span class="divider">|</span>
            <router-link to="results-summary-view" class="view-link">View summary</router-link>
            <span v-if="isNotBigData()" class="divider">|</span>
            <router-link v-if="isNotBigData()" to="results-table-view" class="view-link">View table</router-link>
            </v-col>
        </v-row>
        <v-row>
            <faux-annotation-table :annotations="allAnnotations"></faux-annotation-table>
        </v-row>
        <v-row>
            <save-options></save-options>
        </v-row>
    </v-container>
</template>

<style scoped>
.divider {
    margin: 0 10px;
    vertical-align: top ;
    color: #666;
}

</style>
