<script setup lang="ts">

import { ref } from 'vue'
import { useVampireSquidStore } from '@/stores/vampire-squid'
import type { VideoSequence } from '@/assets/ts/vampiresquid/VideoSequence'
import DeploymentTimeline from '@/components/deployment/DeploymentTimeline.vue'

const selectedVideoSequenceName = ref("" as string)
const selectedVideoSequence = ref(null as VideoSequence | null)

const vampireSquidStore = useVampireSquidStore()

function selectedVideoSequenceNameChanged(event: Event) {
    if (selectedVideoSequenceName.value) {
        vampireSquidStore.api
            .findVideoSequenceByName(selectedVideoSequenceName.value)
            .then(vs =>  selectedVideoSequence.value = vs)
    }
}


</script>

<template>
    <v-container fluid style="width:100%">
        <v-row>
            <v-col cols="6">
                <v-autocomplete id="videoSequenceNameAutocomplete"
                                clearable
                                label="Deployment"
                                v-model="selectedVideoSequenceName"
                                :items="vampireSquidStore.videoSequenceNames"></v-autocomplete>
            </v-col>
            <v-col cols="4">
                <span></span>
            </v-col>
            <v-col cols="2">
                <v-btn @click=selectedVideoSequenceNameChanged icon="mdi-plus" size="x-large" variant="tonal" color="primary">
                    <v-icon icon="mdi-plus"></v-icon>
                    <v-tooltip activator="parent" location="bottom">Search by deployments </v-tooltip>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <deployment-timeline :videoSequence=selectedVideoSequence></deployment-timeline>
        </v-row>
    </v-container>
</template>

<style scoped></style>
