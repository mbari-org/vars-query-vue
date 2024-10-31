<script setup lang="ts">

import { useAnnosaurusStore } from '@/stores/annosaurus'
import { useActivitiesStore, useChiefScientistsStore, useGroupsStore, useObserversStore } from '@/stores/query-params'

const annosaurusStore = useAnnosaurusStore()
const activitiesStore = useActivitiesStore()
const groupsStore = useGroupsStore()
const observersStore = useObserversStore()
const chiefScientistsStore = useChiefScientistsStore()

</script>

<template>
    <div>
        <h2>Additional Constraints</h2>
        <v-container>
            <v-row>
                <v-col cols="10">
                    <v-autocomplete
                        clearable
                        chips
                        label="Activites"
                        v-model=activitiesStore.activities
                        :items=annosaurusStore.activities
                        multiple
                    ></v-autocomplete>
                </v-col>
                <v-col cols="10">
                    <v-autocomplete
                        clearable
                        chips
                        label="Groups"
                        v-model=groupsStore.groups
                        :items=annosaurusStore.groups
                        multiple
                    ></v-autocomplete>
                </v-col>
                <v-col cols="10">
                    <v-autocomplete
                        clearable
                        chips
                        label="Observers"
                        v-model=observersStore.observers
                        :items=annosaurusStore.observers
                        multiple
                    ></v-autocomplete>
                </v-col>
                <v-col cols="10">
                    <v-autocomplete
                        clearable
                        chips
                        label="Chief Scientists"
                        v-model=chiefScientistsStore.chiefScientists
                        :items=annosaurusStore.chiefScientists
                        multiple
                    ></v-autocomplete>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<style scoped>


</style>
