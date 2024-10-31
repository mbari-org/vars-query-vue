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

    function $updateUrl(newUrl: string) {
        localStorage.setItem(KEY, newUrl)
        url.value = newUrl
    }

    if (initialUrl) $updateUrl(initialUrl)
    return { url, api, config, $updateUrl }
})
