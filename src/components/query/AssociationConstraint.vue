<script setup lang="ts">

import {useAssociationsStore} from '@/stores/query-params'

const associationsStore = useAssociationsStore()


function addAssociation(event: Event) {
    console.log("addAssociation")
    console.log(event)
    const association = document.getElementById("associationTextField").getAttribute("value")
    if (association) {
        associationsStore.add(association)
    }
}

</script>

<template>
    <div>
        <h2>Association</h2>
        <v-container>
            <v-row>
                <v-col cols="6">
                    <v-text-field id="associationTextField" clearable label="Association"></v-text-field>
                </v-col>
                <v-col>
                    <v-checkbox label="Exact Match" v-model="associationsStore.exactMatch"></v-checkbox>
                </v-col>
                <v-col>
<!--                    <v-radio-group>-->
<!--                        <v-radio label="Or" value="false" v-model="associationsStore.useAnd" ></v-radio>-->
<!--                        <v-radio label="And" value="true" v-model="associationsStore.useAnd"></v-radio>-->
<!--                    </v-radio-group>-->
                    <v-checkbox label="And" v-model="associationsStore.useAnd"></v-checkbox>
                </v-col>
                <v-col>
                    <v-btn @click=addAssociation icon="mdi-plus" size="x-large"></v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-chip-group column>
                    <v-chip
                        v-for="(selectedAssociation, i) in associationsStore.associations" :key="selectedAssociation"
                        closable
                        @click:close="associationsStore.remove(i)">
                        {{selectedAssociation}}
                    </v-chip>
                </v-chip-group>
            </v-row>
        </v-container>

    </div>
</template>

<style scoped>

</style>
