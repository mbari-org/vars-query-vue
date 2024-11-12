<script setup lang="ts">
import {useSelectedConceptsStore} from '@/stores/query-params'
import {useOniStore} from '@/stores/oni'
import { ref } from 'vue'


const oniStore = useOniStore()
const selectedConceptsStore = useSelectedConceptsStore()

const extendTo = ref(["", "parent", "children", "siblings", "descendants"])

function addConcept(event: Event) {
    // console.log("addConcept")
    // console.log(event)
    const concept = document?.getElementById("conceptAutocomplete")?.getAttribute("value")
    const extendTo = document?.getElementById("extendToCombobox")?.getAttribute("value") ?? ""
    if (concept) {
        selectedConceptsStore.add(concept, extendTo)
    }
}
</script>

<template>
    <v-container fluid style="width:100%">
        <v-row>
            <v-col cols="6">
                <v-autocomplete  id="conceptAutocomplete" clearable label="Concepts" :items=oniStore.concepts></v-autocomplete>
            </v-col>
            <v-col cols="4">
                <v-combobox  id="extendToCombobox" clearable label="Extend to" :items=extendTo></v-combobox>
            </v-col>
            <v-col cols="2">
                <v-btn @click=addConcept icon="mdi-plus" size="x-large">
                    <v-icon icon="mdi-plus"></v-icon>
                    <v-tooltip activator="parent" location="bottom">Add concepts to search constraints</v-tooltip>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-chip-group column>
                <v-chip
                    v-for="(selectedConcept, i) in selectedConceptsStore.selectedConcepts" :key="selectedConcept.concept"
                    closable
                    @click:close="selectedConceptsStore.remove(i)">
                    {{selectedConcept.concept}}
                    <v-tooltip activator="parent" location="bottom">{{selectedConcept.conceptNames.join(", ")}}</v-tooltip>
                </v-chip>
            </v-chip-group>
        </v-row>
    </v-container>
</template>

<style scoped>

</style>
