import { defineStore } from 'pinia'
import { computed, type Ref, ref, watch } from 'vue'
import { useRazielStore } from '@/stores/raziel'
import { extractUrlFromConfig } from '@/assets/ts/raziel/api'
import { OniApi } from '@/assets/ts/oni/api'

const ONI_CONCEPTS_KEY = 'oni-concept'

export const useOniStore = defineStore('oni', () => {
  const razielStore = useRazielStore()

  const concepts: Ref<Array<string>> = ref([] as Array<string>)
  const url = computed(() => extractUrlFromConfig('oni', razielStore.config))
  const api = computed(() => {
    const oniApi = new OniApi(url.value)
    oniApi.listAllConcepts().then(conceptNames => {
      concepts.value = conceptNames
      sessionStorage.setItem(ONI_CONCEPTS_KEY, JSON.stringify(conceptNames))
    })
    return oniApi
  })


  return { url, api, concepts }
})
