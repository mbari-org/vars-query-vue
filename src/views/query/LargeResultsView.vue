<script setup lang="ts">
import SaveOptions from '@/components/results/SaveOptions.vue'
import FauxAnnotationTable from '@/components/results/FauxAnnotationTable.vue'
import { useQueryResultsStore } from '@/stores/query-results'

const queryResultsStore = useQueryResultsStore()
const allAnnotations = queryResultsStore.annotations
</script>


<template>
    <v-container fluid style="width:100%">
        <v-row>
            <!--<v-col>-->
<!--            <router-link to="results-image-grid-view" class="view-link">View image grid</router-link>-->
            <!--</v-col>-->
<!--            |-->
            <!--<v-col>-->
            <router-link to="results-summary-view" class="view-link">View summary</router-link>
            <!--</v-col>-->
        </v-row>
        <v-row>

        </v-row>
        <v-row>
            <faux-annotation-table :annotations="allAnnotations"></faux-annotation-table>
        </v-row>
        <v-row>
            <save-options></save-options>
        </v-row>
    </v-container>
</template>

<style scoped></style>
