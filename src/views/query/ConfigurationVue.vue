<script setup lang="ts">
import { useRazielStore } from '@/stores/raziel'
import { computed, onMounted } from 'vue'
import router from '@/router'

const razielStore = useRazielStore()

const url = computed(() => razielStore.url)

const save = () => {
    const urlField = document.getElementById('url-field') as HTMLInputElement
    razielStore.$updateUrl(urlField.value)
    router.push('/query')
}

const cancel = () => {
    const urlField = document.getElementById('url-field') as HTMLInputElement
    urlField.value = razielStore.url
    router.push('/query')
}


</script>

<template>
    <div id="configurationView">
        <h1>Configuration</h1>
        <v-text-field
            id="url-field"
            label="URL"
            :model-value="url"
        ></v-text-field>
        <v-btn variant="text" @click="save">Save</v-btn>
        <v-btn variant="text" @click="cancel">Cancel</v-btn>
    </div>
</template>

<style scoped></style>
