<script setup lang="ts">


import { reactive, ref } from 'vue'
import { useOniStore } from '@/stores/oni'
import { accumulateNamesFromTaxaNodes } from '@/assets/ts/oni/ConceptTree'
import { accumulateNamesFromConcepts, ConceptExt } from '@/assets/ts/oni/Concept'

interface SelectedConcept {
  concept: string
  extendTo: string
  conceptNames: Array<string>
}

const data = reactive({
  selectedConcepts: [] as Array<SelectedConcept>,
  selectedAssociations: [] as Array<string>
})

const oniStore = useOniStore()

function reset() {
  data.selectedConcepts = []
  data.selectedAssociations = []
}

function addConcept(event: Event) {
  console.log("addConcept")
  console.log(event)
  const concept = document.getElementById("conceptAutocomplete").getAttribute("value")
  const extendTo = document.getElementById("extendToCombobox").getAttribute("value")
  const oniApi = oniStore.api
  let selectedConcept = {
    concept: concept,
    extendTo: extendTo,
    conceptNames: []
  }
  switch (extendTo) {
    case "parent":
      oniApi.findParentByConceptName(concept).then((parent) => {
        const ext = new ConceptExt(parent)
        selectedConcept.conceptNames = ext.names()
      })
      break
    case "children":
      oniApi.listChildren(concept).then((children) => {
        selectedConcept.conceptNames = accumulateNamesFromConcepts(children)
      })
      break
    case "siblings":
      oniApi.findSiblings(concept).then((siblings) => {
        selectedConcept.conceptNames = accumulateNamesFromConcepts(siblings)
      })
      break
    case "descendants":
      oniApi.listDescendants(concept).then((descendants) => {
        selectedConcept.conceptNames = accumulateNamesFromTaxaNodes(descendants)
      })
      break
    default:
      oniApi.findByConceptName(concept).then((concept) => {
        const ext = new ConceptExt(concept)
        selectedConcept.conceptNames = ext.names()
      })
  }
  data.selectedConcepts.push(selectedConcept)

}

function addAssociation(event: Event) {
  console.log("addAssociation")
  console.log(event)
  const association = document.getElementById("associationTextField").getAttribute("value")
  data.selectedAssociations.push(association)
}

const extendTo = ref(["", "parent", "children", "siblings", "descendants"])

</script>

<template>
  <div id="queryView">
    <h1>Query</h1>
    <v-btn @click=reset>Reset</v-btn>
    <div>
      <h2>Concept</h2>
      <v-autocomplete id="conceptAutocomplete" clearable label="Concepts" :items=oniStore.concepts></v-autocomplete>
      <v-combobox id="extendToCombobox" clearable label="extendTo" :items=extendTo></v-combobox>
      <v-btn @click=addConcept>Add</v-btn>
    </div>
    <div>
      <h2>Association</h2>
      <v-text-field id="associationTextField" clearable label="Association"></v-text-field>
      <v-btn @click=addAssociation>Add</v-btn>
    </div>
  </div>
</template>

<style scoped>

</style>
