<script setup lang="ts">
import ConceptConstraint from '@/components/query/ConceptConstraint.vue'
import AssociationConstraint from '@/components/query/AssociationConstraint.vue'
import {  resetStores } from '@/stores/query-params'
import DiveConstraint from '@/components/query/DiveConstraint.vue'
import FieldConstraints from '@/components/query/FieldConstraints.vue'
import SpaceConstraint from '@/components/query/SpaceConstraint.vue'
import TimeConstraint from '@/components/query/TimeConstraint.vue'

function reset() {
    resetStores()
}

function runQuery() {
    console.log('runQuery')
}
</script>

<template>
    <div id="queryView">
        <v-toolbar class="fixed-bar">
            <v-container>
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

<!--        <div>-->
<!--            <v-container>-->
<!--                <v-row justify="end">-->
<!--                    <v-col cols="2">-->
<!--                        <v-btn-->
<!--                            append-icon="mdi-close"-->
<!--                            @click="reset"-->
<!--                        >Reset</v-btn>-->
<!--                    </v-col>-->
<!--                    <v-col cols="2">-->
<!--                        <v-btn-->
<!--                            append-icon="mdi-search-web"-->
<!--                            @click="runQuery"-->
<!--                        >Search</v-btn>-->
<!--                    </v-col>-->
<!--                </v-row>-->
<!--            </v-container>-->
<!--        </div>-->
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
</style>
