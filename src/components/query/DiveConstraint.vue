<script setup lang="ts">
import { useVampireSquidStore } from '@/stores/vampire-squid'
import { useCameraPlatformStore, useVideoSequenceNameStore } from '@/stores/query-params'
import { computed, ref } from 'vue'

const vampireSquidStore = useVampireSquidStore()
const videoSequenceNameStore = useVideoSequenceNameStore()
const cameraPlatformStore = useCameraPlatformStore()

const selectedVideoSequenceName = ref("" as string)
const selectedCameraPlatform = ref("" as string)

function addItem(event: Event) {

    if (selectedVideoSequenceName.value) {
        videoSequenceNameStore.add(selectedVideoSequenceName.value)
        selectedVideoSequenceName.value = ""
    }
    if (selectedCameraPlatform.value) {
        cameraPlatformStore.add(selectedCameraPlatform.value)
        selectedCameraPlatform.value = ""
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
                <v-autocomplete id="cameraPlatformAutocomplete"
                                clearable
                                label="Camera Platform"
                                v-model="selectedCameraPlatform"
                                :items="vampireSquidStore.cameraPlatforms"
                        ></v-autocomplete>
            </v-col>
            <v-col cols="2">
                <v-btn @click=addItem icon="mdi-plus" size="x-large" variant="tonal" color="primary">
                    <v-icon icon="mdi-plus"></v-icon>
                    <v-tooltip activator="parent" location="bottom">Search by deployments OR camera platforms</v-tooltip>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-chip
                v-for="(name, i) in videoSequenceNameStore.videoSequenceNames" :key="name"
                closable
                @click:close="videoSequenceNameStore.remove(i)"
                color="secondary"
                variant="tonal"
            >
                {{name}}
<!--                        <v-tooltip activator="parent" location="bottom">{{selectedConcept.conceptNames.join(", ")}}</v-tooltip>-->
            </v-chip>
            <v-chip
                v-for="(name, i) in cameraPlatformStore.cameraPlatforms" :key="name"
                closable
                @click:close="cameraPlatformStore.remove(i)"
                color="secondary"
                variant="tonal"
            >
                {{name}}
            </v-chip>
        </v-row>
    </v-container>
</template>

<style scoped>

</style>
