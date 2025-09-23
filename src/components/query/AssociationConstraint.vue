<script setup lang="ts">

import {useAssociationsStore} from '@/stores/query-params'
import { useOniStore } from '@/stores/oni'
import { computed } from 'vue'
import { computedAsync } from '@vueuse/core'

const associationsStore = useAssociationsStore()
const oniStore = useOniStore()


function addAssociation(event: Event) {
    const association = document?.getElementById("associationTextField")?.getAttribute("value")
    if (association) {
        associationsStore.add(association)
    }
}

</script>

<template>
    <div>
<!--        <h2>Association</h2>-->
        <v-container fluid style="width:100%">
            <v-row>
                <v-col cols="6">
                    <v-text-field v-if="!associationsStore.exactMatch" id="associationTextField" clearable label="Details/Associations"></v-text-field>
                    <v-autocomplete v-else id="associationTextField" clearable label="Link name" :items="oniStore.linkNames"></v-autocomplete>
                </v-col>
                <v-col>
                    <v-checkbox label="Exact Match" v-model="associationsStore.exactMatch">
                        <v-tooltip activator="parent">true=find link name that matches. false=find association that contains. </v-tooltip>
                    </v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox label="And" v-model="associationsStore.useAnd">
                        <v-tooltip activator="parent">Each query result must contain all associations</v-tooltip>
                    </v-checkbox>
                </v-col>
                <v-col>
                    <v-btn @click=addAssociation icon="mdi-plus" size="x-large" variant="tonal" color="primary">
                        <v-icon icon="mdi-plus"></v-icon>
                        <v-tooltip v-if="associationsStore.exactMatch" activator="parent" location="bottom">Constrain by details/associations that match this link name</v-tooltip>
                        <v-tooltip v-else activator="parent" location="bottom">Constrain by details/associations that include this term</v-tooltip>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-chip
                    v-for="(selectedAssociation, i) in associationsStore.associations" :key="selectedAssociation"
                    closable
                    @click:close="associationsStore.remove(i)"
                    color="secondary"
                    variant="tonal"
                >
                    {{selectedAssociation}}
                </v-chip>
            </v-row>
        </v-container>

    </div>
</template>

<style scoped>

</style>
