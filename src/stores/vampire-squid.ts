import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRazielStore } from '@/stores/raziel'
import { extractUrlFromConfig } from '@/assets/ts/raziel/api'
import { VampireSquidApi } from '@/assets/ts/vampiresquid/api'
import { computedAsync } from '@vueuse/core'

export const useVampireSquidStore = defineStore('vampire-squid', () => {

    const razielStore = useRazielStore()
    const url = computed(() => extractUrlFromConfig('vampire-squid', razielStore.config))
    const api = computed(() => new VampireSquidApi(url.value))
    const videoSequenceNames = computedAsync(async () => {
        return api.value.listVideoSequenceNames()
    })

    const cameraPlatforms = computedAsync(async () => {
        return api.value.listCameraPlatforms()
    })

    return {url, api, videoSequenceNames, cameraPlatforms}
})
