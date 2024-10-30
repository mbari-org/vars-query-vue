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
    // const videoSequenceName = document.getElementById("videoSequenceNameAutocomplete").getAttribute("value")
    // const cameraPlatform = document.getElementById("cameraPlatformAutocomplete").getAttribute("value")
    if (selectedVideoSequenceName.value) {
        videoSequenceNameStore.add(selectedVideoSequenceName.value)
        selectedVideoSequenceName.value = ""
    }
    if (selectedCameraPlatform.value) {
        cameraPlatformStore.add(selectedCameraPlatform.value)
        selectedCameraPlatform.value = ""
    }
}


// function addVideoSequenceName(event: Event) {
//     const videoSequenceName = document.getElementById("videoSequenceNameAutocomplete").getAttribute("value")
//     if (videoSequenceName) {
//         videoSequenceNameStore.add(videoSequenceName)
//     }
// }
//
// function addCameraPlatform(event: Event) {
//     const cameraPlatform = document.getElementById("cameraPlatformAutocomplete").getAttribute("value")
//     if (cameraPlatform) {
//         cameraPlatformStore.add(cameraPlatform)
//     }
// }

</script>

<template>
    <div>
        <h2>Deployment</h2>
        <v-container>
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
                    <v-btn @click=addItem icon="mdi-plus" size="x-large"></v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-chip-group column>
                    <v-chip
                        v-for="(name, i) in videoSequenceNameStore.videoSequenceNames" :key="name"
                        closable
                        @click:close="videoSequenceNameStore.remove(i)">
                        {{name}}
<!--                        <v-tooltip activator="parent" location="bottom">{{selectedConcept.conceptNames.join(", ")}}</v-tooltip>-->
                    </v-chip>
                        <v-chip
                            v-for="(name, i) in cameraPlatformStore.cameraPlatforms" :key="name"
                            closable
                            @click:close="cameraPlatformStore.remove(i)">
                            {{name}}
                        </v-chip>
                </v-chip-group>
            </v-row>
        </v-container>
    </div>
</template>

<style scoped>

</style>
