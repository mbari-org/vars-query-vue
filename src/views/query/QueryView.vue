<!--
This page provides a form for the user to enter constraints for a query.
-->

<script setup lang="ts">
import AssociationConstraint from '@/components/query/AssociationConstraint.vue'
import ConceptConstraint from '@/components/query/ConceptConstraint.vue'
import DiveConstraint from '@/components/query/DiveConstraint.vue'
import FieldConstraints from '@/components/query/FieldConstraints.vue'
import Selections from '@/components/query/Selections.vue'
import SpaceConstraint from '@/components/query/SpaceConstraint.vue'
import router from '@/router'
import { QueryRunner } from '@/assets/ts/annosaurus/QueryRunner'
import { computed, ref } from 'vue'
import { resetStores, useSelectedColumnsStore } from '@/stores/query-params'
import { useAnnosaurusStore } from '@/stores/annosaurus'
import { useQueryResultsStore } from '@/stores/query-results'
import RecordedTimeConstraint from '@/components/query/RecordedTimeConstraint.vue'
import ObservationTimeConstraint from '@/components/query/ObservationTimeConstraint.vue'
import { MAX_NUMBER_OF_ANNOTATIONS } from '@/assets/ts/constants'
import StandardDetails from '@/components/shared/StandardDetails.vue'

const selectedColumnsStore = useSelectedColumnsStore()
const enableSearch = computed(
    () => selectedColumnsStore.selectableColumns.length > 0,
)
const queryIsRunning = ref(false)
const progress = ref(0)


const recordedTimeConstraintRef = ref<InstanceType<typeof RecordedTimeConstraint> | null>(null)
const observationTimeConstraintRef = ref<InstanceType<typeof ObservationTimeConstraint> | null>(null)

const progressBarText = computed(() => {
    if (progress.value === 0) {
        return 'Searching ...'
    } else {
        const v = progress.value.toFixed(0)
        return `Loaded ${v}%`
    }
})

const indeterminate = computed(() => progress.value === 0)

function reset() {
    resetStores()
    recordedTimeConstraintRef.value?.reset()
}

function resetOnlyReturns() {
    selectedColumnsStore.reset()
}

function runQuery() {
    // console.log('runQuery')
    queryIsRunning.value = true
    const annosaurusApi = useAnnosaurusStore().api
    const queryRunner = new QueryRunner(annosaurusApi)
    const queryResultsStore = useQueryResultsStore()
    queryRunner
        .runQuery(
            x => {
                progress.value = x
            },
            () => alert('What are you searching for? Try adding some constraints using the `+` buttons.'),
            () =>
                alert(
                    'Query timed out. Try adding more constraints or reducing the time range.',
                ),
        )
        .then(ok => {
            queryIsRunning.value = false
            progress.value = 0
            if (ok) {
                // Check size of results. If too large, alert user and do not navigate, immmediately
                // download the results.
                // IMPORTANT: this is a hack to prevent the table view from being displayed above 5000 rows
                if (queryResultsStore.annotations.length > MAX_NUMBER_OF_ANNOTATIONS) {
                    alert(
                        'You requested a very large data set. Some data viewing functions will be disabled to prevent browser performance issues. You will be redirected to the large results view where you can download the results.',
                    )
                    router.push({name: 'large-results-view'})

                } else {
                    router.push({ name: 'results-table-view' })
                }
            }
        })
        .catch(error => {
            console.error(error)
            progress.value = 0
            queryIsRunning.value = false
        })
}
</script>

<template>
    <div id="queryView">
        <v-toolbar class="fixed-bar">
            <v-container fluid style="width: 100%">
                <v-row>
                    <v-col cols="6">
                        <h1>
                            VARS Query
                            <v-tooltip activator="parent" location="top"
                                >To run a query, add constraints and then press
                                the search button</v-tooltip
                            >
                        </h1>
                    </v-col>
                    <v-col cols="auto">
                        <v-spacer></v-spacer>
                    </v-col>
                    <v-col cols="2">
                        <v-btn
                            size="x-large"
                            append-icon="mdi-search-web"
                            color="primary"
                            :disabled="!enableSearch"
                            @click="runQuery"
                            >Search<v-tooltip activator="parent" location="top"
                                >Run search</v-tooltip
                            ></v-btn
                        >
                    </v-col>
                    <v-col cols="2" class="d-flex">
                        <v-spacer></v-spacer>
                        <v-btn
                            size="x-large"
                            append-icon="mdi-restore"
                            color="error"
                            @click="reset"
                            >Reset<v-tooltip activator="parent" location="top"
                                >Reset all constraints and returns</v-tooltip
                            >
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-toolbar>

        <standard-details summary="About">
            <div>The VARS Query retrieves annotations from MBARI's Video Annotation and Reference System (VARS). Use the fields below to select the parameters for your search and to select the fields you want returned. After you have set your constraints, click the search button to run your query.
            </div>
        </standard-details>

        <h2>Annotation and Deployment</h2>
        <v-divider> </v-divider>
        <concept-constraint></concept-constraint>
        <association-constraint></association-constraint>
        <dive-constraint></dive-constraint>

        <h2>Location and Time</h2>
        <v-divider> </v-divider>
        <space-constraint></space-constraint>
        <recorded-time-constraint ref="recordedTimeConstraintRef"></recorded-time-constraint>

        <h2>Miscellaneous</h2>
        <v-divider></v-divider>
        <observation-time-constraint ref="observationTimeConstraintRef"></observation-time-constraint>
        <field-constraints></field-constraints>

        <h2>Selections</h2>
        <v-divider></v-divider>
        <v-row align="center">
            <v-col>
                <selections></selections>
            </v-col>
            <v-col cols="2">
                <v-btn
                    size="x-large"
                    icon="mdi-restore"
                    @click="resetOnlyReturns"
                    variant="tonal"
                    color="error"
                    ><v-icon icon="mdi-restore"></v-icon
                    ><v-tooltip activator="parent" location="top"
                        >Reset the selected returns</v-tooltip
                    >
                </v-btn>
            </v-col>
        </v-row>

        <v-overlay
            :model-value="queryIsRunning"
            color="primary"
            class="justify-center align-center"
        >
            <div class="big-font">{{ progressBarText }}</div>
            <v-progress-circular
                :size="128"
                :width="12"
                color="blue"
                :indeterminate="indeterminate"
                :model-value="progress"
            ></v-progress-circular>
        </v-overlay>

    </div>
</template>

<style scoped>
.fixed-bar {
    position: sticky;
    position: -webkit-sticky; /* for Safari */
    top: 6em;
    z-index: 2;
    margin-top: 1em;
}

.big-font {
    font-size: 3.5em;
}

</style>
