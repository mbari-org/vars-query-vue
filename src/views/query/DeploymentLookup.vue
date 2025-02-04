<!--
 query a dive directly
 /deployment/:videoSequenceName?url=:razielConfigUrl

 http://localhost:5173/query/deployment/Doc%20Ricketts%201234?url=http%3A%2F%2Fm3.shore.mbari.org%2Fconfig
-->


<script setup lang="ts">

import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { resetStores, useVideoSequenceNameStore, useDecoratorsStore} from '@/stores/query-params'
import { useAnnosaurusStore } from '@/stores/annosaurus'
import { QueryRunner } from '@/assets/ts/annosaurus/QueryRunner'
import router from '@/router'
import { useRazielStore } from '@/stores/raziel'

const videoSequenceNameStore = useVideoSequenceNameStore()

const route = useRoute()
const razielStore = useRazielStore()
const doQuery = ref(false)
const progress = ref(0)

const showImageGrid = route.query.images === 'true'


watch(() => razielStore.isLoading, (loading) => {
    // console.log('Raziel is loading', loading)
    if (!loading) {
        doQuery.value = true
    }
}, { immediate: true })

watch(() => route.params.name, (name) => {
    // console.log('Route name', name)
    if(!razielStore.isLoading) {
        doQuery.value = true
    }
}, { immediate: true })

watch(() => route.query.url, (url) => {
    // console.log('Route query url', url)
    if (url) {
        razielStore.url = url as string
    }
}, { immediate: true })

watch(() => doQuery.value, (doQuery) => {
    // console.log('doQuery', doQuery)
    if (doQuery) {
        runQueryWithName(route.params.name)
    }
}, { immediate: true })


function runQueryWithName(name: string | string[], redirect: boolean = true) {
    if (!name) {
        return
    }
    // console.log('Raziel URL', razielStore.url)
    // console.log('Raziel Config', razielStore.config)
    resetStores()
    if (Array.isArray(name)) {
        name = name[0]
    }
    if (showImageGrid) {
        useDecoratorsStore().imagesOnly = true
    }
    videoSequenceNameStore.add(name)
    runQuery(redirect)
}

function runQuery(redirect: boolean = true) {
    // console.log('runQuery')
    const annosaurusApi = useAnnosaurusStore().api
    console.log('annosaurusApi', annosaurusApi)
    const queryRunner = new QueryRunner(annosaurusApi)
    queryRunner.runQuery((p) => {progress.value = p}).then(() => {
        // console.log('Query complete')
        if (redirect) {
            if (showImageGrid) {
                router.push({ name: 'results-image-grid-view' })
            } else {
                router.push({ name: 'results-table-view' })
            }
        }
    }).catch((error) => {
        console.error(error)
        router.push({name: 'query-view'})
    })
}


</script>

<template>
    <h1>Loading annotations for {{route.params.name}} </h1>
    <div><v-progress-circular indeterminate></v-progress-circular></div>
</template>

<style>

</style>
