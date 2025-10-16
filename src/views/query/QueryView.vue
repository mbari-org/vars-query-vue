<!--
This page provides a form for the user to enter constraints for a query.
-->

<script setup lang="ts">
import ConceptConstraint from '@/components/query/ConceptConstraint.vue'
import AssociationConstraint from '@/components/query/AssociationConstraint.vue'
import { resetStores, useSelectedColumnsStore } from '@/stores/query-params'
import DiveConstraint from '@/components/query/DiveConstraint.vue'
import FieldConstraints from '@/components/query/FieldConstraints.vue'
import SpaceConstraint from '@/components/query/SpaceConstraint.vue'
import TimeConstraint from '@/components/query/TimeConstraint.vue'
import { useAnnosaurusStore } from '@/stores/annosaurus'
import { QueryRunner } from '@/assets/ts/annosaurus/QueryRunner'
import Selections from '@/components/query/Selections.vue'
import { computed, ref } from 'vue'
import router from '@/router'
import { useQueryResultsStore } from '@/stores/query-results'

const selectedColumnsStore = useSelectedColumnsStore()
const enableSearch = computed(
    () => selectedColumnsStore.selectableColumns.length > 0,
)
const queryIsRunning = ref(false)
const progress = ref(0)

// watch(progress, (value) => {
//     console.log('Progress', value)
// })

const timeConstraintRef = ref<InstanceType<typeof TimeConstraint> | null>(null)

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
    timeConstraintRef.value?.reset()
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
            () => alert('No query constraints were added'),
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
                if (queryResultsStore.queryResults.length > 5000) {
                    alert(
                        'Too many results to display. Downloading the results instead.'
                    )
                    const data = queryResultsStore.queryResults
                    const json = JSON.stringify(data, null, 2)
                    const blob = new Blob([json], {
                        type: 'application/json',
                    })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'vars-results.json'
                    document.body.appendChild(a)
                    a.click()
                    setTimeout(function() {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 0);
                    queryResultsStore.reset()

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

        <concept-constraint></concept-constraint>
        <v-divider></v-divider>
        <association-constraint></association-constraint>
        <v-divider></v-divider>
        <dive-constraint></dive-constraint>
        <v-divider></v-divider>
        <space-constraint></space-constraint>
        <time-constraint ref="timeConstraintRef"></time-constraint>
        <v-divider></v-divider>
        <field-constraints></field-constraints>
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

        <!--        <chip-test></chip-test>-->
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
