import { defineStore } from 'pinia'
import { computed, type Ref, ref, watch } from 'vue'
import { RazielApi } from '@/assets/ts/raziel/api'
import type { ServerConfig } from '@/assets/ts/raziel/ConfigParser'


const KEY = "vars-query-raziel-url"

export const useRazielStore = defineStore('raziel', () => {
  const initialUrl: string = localStorage.getItem(KEY) || ""
  const url = ref(initialUrl)
  const api = ref(new RazielApi(initialUrl))
  const config = ref([] as Array<ServerConfig>)

  function $updateUrl(newUrl: string) {
    localStorage.setItem(KEY, newUrl)
    url.value = newUrl
    api.value = new RazielApi(newUrl)
    api.value.getEndpoints().then((endpoints) => {
      config.value = endpoints
    })
  }

  if (initialUrl) $updateUrl(initialUrl)
    return { url, api, config, $updateUrl}
})



