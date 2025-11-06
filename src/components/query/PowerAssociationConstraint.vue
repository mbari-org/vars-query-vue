<script setup lang="ts">
import { useOniStore } from '@/stores/oni'
import { computed, ref } from 'vue'

const searchQuery = ref('')
const linkName = ref('')
const toConcept = ref('')
const linkValue = ref('')
const oniStore = useOniStore()

const allLinks = computed(() =>
    oniStore.links?.map(link => `${link.linkName} ${link.toConcept} ${link.linkValue}`)
)
</script>

<template>
    <v-container fluid style="width: 100%">
        <v-row>
            <v-col>
                <!-- Search bar -->
                <v-text-field v-model="searchQuery"></v-text-field>
            </v-col>
            <v-col>
                <!-- add button -->
                <v-btn></v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-autocomplete
                > </v-autocomplete>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <!-- link name / details -->
                <v-autocomplete
                    id="linkNameAutocomplete"
                    v-model="linkName"
                    clearable
                    label="Link name"
                    :items="oniStore.linkNames"
                ></v-autocomplete>
            </v-col>
            <v-col>
                <!-- toconcept -->
                <v-autocomplete
                    id="toConceptAutocomplete"
                    v-model="toConcept"
                    clearable
                    label="Link name"
                    :items="oniStore.concepts"
                ></v-autocomplete>
            </v-col>
            <v-col>
                <!-- link value -->
                <v-text-field
                    id="linkValueTextField"
                    v-model="linkValue"
                    label="Link value"
                >
                </v-text-field>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped></style>
