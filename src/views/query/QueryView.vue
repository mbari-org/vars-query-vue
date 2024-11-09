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

const selectedColumnsStore = useSelectedColumnsStore()

const enableSearch = computed(() => selectedColumnsStore.selectableColumns.length > 0)

const queryIsRunning = ref(false)
const progress = ref(0)
const rotate = computed(() => progress.value * 3.6)


function reset() {
    resetStores()
}

function runQuery() {
    console.log('runQuery')
    queryIsRunning.value = true
    const annosaurusApi = useAnnosaurusStore().api
    const queryRunner = new QueryRunner(annosaurusApi)
    queryRunner.runQuery((x) => {progress.value = x}).then(() => {
        queryIsRunning.value = false
        progress.value = 0
        router.push({name: 'results-table-view'})
    }).catch((error) => {
        console.error(error)
        progress.value = 0
        queryIsRunning.value = false
    })
}

</script>

<template>
    <div id="queryView">
        <v-toolbar class="fixed-bar">
            <v-container fluid>
                <v-row>
                    <v-col cols="6">
                        <h1>VARS Query</h1>
                    </v-col>
                    <v-col cols="auto">
                        <v-spacer></v-spacer>
                    </v-col>
                    <v-col cols="2">
                        <v-btn
                            size="x-large"
                            append-icon="mdi-close"
                            @click="reset"
                        >Reset<v-tooltip>Reset all constraints</v-tooltip>
                        </v-btn>
                    </v-col>
                    <v-col cols="2">
                        <v-btn
                            size="x-large"
                            append-icon="mdi-search-web"
                            :disabled="!enableSearch"
                            @click="runQuery"
                        >Search</v-btn>
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
        <time-constraint></time-constraint>
        <v-divider></v-divider>
        <field-constraints></field-constraints>
        <v-divider></v-divider>
        <selections></selections>

        <v-overlay
            :model-value="queryIsRunning"
            color="primary"
            class="justify-center align-center">
            <div class="big-font">Searching ...</div>
            <v-progress-circular
                :size="128"
                :width="12"
                color="blue"
                indeterminate
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
