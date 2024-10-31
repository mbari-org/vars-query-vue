<script setup lang="ts">
import ConceptConstraint from '@/components/query/ConceptConstraint.vue'
import AssociationConstraint from '@/components/query/AssociationConstraint.vue'
import {
    useAssociationsStore,
    useCameraPlatformStore,
    useSelectedConceptsStore, useVideoSequenceNameStore
} from '@/stores/query-params'
import DiveConstraint from '@/components/query/DiveConstraint.vue'
import FieldConstraints from '@/components/query/FieldConstraints.vue'
import SpaceConstraint from '@/components/query/SpaceConstraint.vue'

const associationsStore = useAssociationsStore()
const selectedConceptsStore = useSelectedConceptsStore()
const videoSequenceNameStore = useVideoSequenceNameStore()
const cameraPlatformStore = useCameraPlatformStore()

function reset() {
    associationsStore.reset()
    selectedConceptsStore.reset()
    videoSequenceNameStore.reset()
    cameraPlatformStore.reset()
}

function runQuery() {
    console.log('runQuery')
}
</script>

<template>
    <div id="queryView">
        <h1>Query</h1>
        <v-btn @click="reset">Reset</v-btn>
        <concept-constraint></concept-constraint>
        <association-constraint></association-constraint>
        <dive-constraint></dive-constraint>
        <field-constraints></field-constraints>
        <space-constraint></space-constraint>
        <div>
            <v-container>
                <v-row justify="end">
                    <v-col cols="2">
                        <v-btn
                            icon="mdi-search-web"
                            size="x-large"
                            @click="runQuery"
                        ></v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </div>
</template>

<style scoped></style>
