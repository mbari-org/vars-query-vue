<script setup lang="ts">
import { useSelectedColumnsStore } from '@/stores/query-params'
import {useAnnosaurusStore} from '@/stores/annosaurus'

const annosaurusStore = useAnnosaurusStore()
const selectableColumnsStore = useSelectedColumnsStore()
</script>

<template>
    <v-container fluid style="width:100%">
        <v-row>
            <v-col cols="12">
                <v-autocomplete
                    clearable
                    closable-chips
                    chips
                    label="Return the following data"
                    v-model=selectableColumnsStore.selectableColumns
                    :items=annosaurusStore.selectableColumns
                    multiple>
                </v-autocomplete>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>

</style>
