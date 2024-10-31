
import { defineStore } from 'pinia'
import { computedAsync } from '@vueuse/core'
import { listRegions } from '@/assets/ts/fathomnet/api'

export const useFathomnetStore = defineStore('fathomnet', () => {
    const regions = computedAsync(() => listRegions())

    return { regions }
})
