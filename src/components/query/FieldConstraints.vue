<script setup lang="ts">

import { useAnnosaurusStore } from '@/stores/annosaurus'
import {
    useActivitiesStore,
    useChiefScientistsStore,
    useDecoratorsStore,
    useGroupsStore,
    useObserversStore
} from '@/stores/query-params'

const annosaurusStore = useAnnosaurusStore()
const activitiesStore = useActivitiesStore()
const groupsStore = useGroupsStore()
const observersStore = useObserversStore()
const chiefScientistsStore = useChiefScientistsStore()
const decoratorsStore = useDecoratorsStore()

</script>

<template>

    <v-container fluid style="width:100%">
        <v-row>
            <v-col cols="6">
                <v-autocomplete
                    clearable
                    chips
                    label="Activites"
                    v-model=activitiesStore.activities
                    :items=annosaurusStore.activities
                    :chip-props="{ color: 'secondary', variant: 'tonal' }"
                    multiple
                ></v-autocomplete>
            </v-col>
            <v-col cols="6">
                <v-autocomplete
                    clearable
                    chips
                    label="Groups"
                    v-model=groupsStore.groups
                    :items=annosaurusStore.groups
                    :chip-props="{ color: 'secondary', variant: 'tonal', background: 'secondary'}"
                    multiple
                ></v-autocomplete>
            </v-col>
            <v-col cols="6">
                <v-autocomplete
                    clearable
                    chips
                    label="Observers"
                    v-model=observersStore.observers
                    :items=annosaurusStore.observers
                    :chip-props="{ color: 'secondary', variant: 'tonal' }"
                    multiple
                ></v-autocomplete>
            </v-col>
            <v-col cols="6">
                <v-autocomplete
                    clearable
                    chips
                    label="Chief Scientists"
                    v-model=chiefScientistsStore.chiefScientists
                    :items=annosaurusStore.chiefScientists
                    :chip-props="{ color: 'secondary', variant: 'tonal' }"
                    multiple
                ></v-autocomplete>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-checkbox label="Images only" v-model="decoratorsStore.imagesOnly"><v-tooltip activator="parent" location="bottom">Only return annotations with a frame-grab</v-tooltip></v-checkbox>
            </v-col>
            <v-col>
                <v-checkbox label="Concurrent annotations" v-model="decoratorsStore.concurrentObservations">
                    <v-tooltip activator="parent" location="bottom">Annotations on the same video frame as the ones returned by the search</v-tooltip>
                </v-checkbox>
            </v-col>
            <v-col>
                <v-checkbox label="Related associations" v-model="decoratorsStore.relatedAssociations"><v-tooltip activator="parent" location="bottom">All associations on the annotations returned in the search</v-tooltip></v-checkbox>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>


</style>
