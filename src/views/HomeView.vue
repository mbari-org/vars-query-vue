<script setup lang="ts">
import ConfigurationVue from '@/views/query/ConfigurationVue.vue'
import { useRazielStore } from '@/stores/raziel'
import router from '@/router'

// use raziel api to see if we are logged in. If so, redirect to query page
// if not, redirect to configuration page

const razielStore = useRazielStore()
razielStore.api.getEndpoints()
    .then(() => {
        router.push('/query')
    })
    .catch((error) => {
        console.error(error)
        router.push('/configuration')
    })


</script>

<template>
  <main>
<!--    <TheWelcome />-->
      <div>Checking configuration</div>
    <configuration-vue />
  </main>
</template>
