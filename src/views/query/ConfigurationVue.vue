<!--
This page allows a user to set the location of the VARS configuration server.
(aka Raziel)

We have the user set the conigureation server URL to allow this application
to be used with different VARS servers.
-->

<script setup lang="ts">
import { useRazielStore } from '@/stores/raziel'
import { computed, watch } from 'vue'
import router from '@/router'

const razielStore = useRazielStore()

const url = computed(() => razielStore.url)



const save = async () => {
    const urlField = document.getElementById('url-field') as HTMLInputElement
    razielStore.$updateUrl(urlField.value)
    // router.push('/query')
    await checkRaziel()
}

const cancel = () => {
    const urlField = document.getElementById('url-field') as HTMLInputElement
    urlField.value = razielStore.url
    // router.push('/query')
    // checkRaziel()
}

watch(() => razielStore.isLoading, (value) => {
    if (!value) {
        checkRaziel()
    }
})

function checkRaziel() {
    razielStore.api.getEndpoints()
        .then(() => {
            console.log('Configuration is OK')
            router.push('/query')
        })
        .catch((error) => {
            console.error(error)
            router.push('/config')
        })
}
</script>

<template>
    <v-container fluid style="width:100%">
        <v-row>
            <v-spacer></v-spacer>
            <v-col>
                <h1>Configuration</h1>
            </v-col>
            <v-spacer></v-spacer>
        </v-row>
        <v-row>
            <v-col>
                <div>Please enter the URL for your <a href="https://github.com/mbari-org/raziel">VARS configuration server</a>. At MBARI, enter "http://m3.shore.mbari.org/config".</div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-text-field
                    id="url-field"
                    label="URL"
                    :model-value="url"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-spacer></v-spacer>
            <v-col>
                <v-btn variant="text" @click="save">Save</v-btn>
                <v-btn variant="text" @click="cancel">Cancel</v-btn>
            </v-col>
            <v-spacer></v-spacer>
        </v-row>
    </v-container>

</template>

<style scoped></style>
