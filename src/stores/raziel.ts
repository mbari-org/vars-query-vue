import { defineStore } from 'pinia'
import { computed, type Ref, ref, watch } from 'vue'
import { RazielApi } from '@/assets/ts/raziel/api'
import { computedAsync } from '@vueuse/core'

const KEY = 'vars-query-raziel-url'

export const useRazielStore = defineStore('raziel', () => {
    const initialUrl: string = localStorage.getItem(KEY) || ''
    const url = ref(initialUrl)
    const api = computed(() => new RazielApi(url.value))
    const config = computedAsync(() => api.value.getEndpoints())
    const isLoading = ref(true)

    function $updateUrl(newUrl: string) {
        localStorage.setItem(KEY, newUrl)
        isLoading.value = true
        url.value = newUrl
    }

    watch(config, () => {
        if (config.value) {
            isLoading.value = false
        }
    })

    if (initialUrl) $updateUrl(initialUrl)
    return { url, api, config, isLoading, $updateUrl }
})
