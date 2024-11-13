import { defineStore } from 'pinia'
import { computed, type Ref, ref, watch } from 'vue'
import { useRazielStore } from '@/stores/raziel'
import { extractUrlFromConfig } from '@/assets/ts/raziel/api'
import { OniApi } from '@/assets/ts/oni/api'
import { computedAsync } from '@vueuse/core'
import _ from 'lodash'
import type { Descriptor } from '@/assets/ts/oni/Concept'

const ONI_CONCEPTS_KEY = 'oni-concept'

export const useOniStore = defineStore('oni', () => {
    const razielStore = useRazielStore()

    const url = computed(() => extractUrlFromConfig('oni', razielStore.config))
    const api = computed(() => new OniApi(url.value))

    const concepts = computedAsync(() => api.value.listAllConcepts())

    const links = computedAsync( () =>
        api.value
            .listLinks()
            .then((links) => links.filter((link) => !link.linkName.startsWith("dsg-")))
    )

    const linkNames = computed(() => _.uniq(links.value?.map((link) => link.linkName)).sort())


    return { url, api, concepts, links, linkNames }
})
