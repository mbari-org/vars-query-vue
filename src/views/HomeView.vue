<!--
This is the home view. It is the first view that is shown when the user
navigates to the application. It checks to see if a valid configuration
is present and redirects appropriately.
-->

<script setup lang="ts">
import ConfigurationVue from '@/views/query/ConfigurationVue.vue'
import { useRazielStore } from '@/stores/raziel'
import router from '@/router'

// Use the raziel api to see if we are logged in.
// OK = redirect to query page
// NOT OK = redirect to configuration page

const razielStore = useRazielStore()
razielStore.api.getEndpoints()
    .then(() => {
        router.push('/query')
    })
    .catch((error) => {
        // console.error(error)
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
