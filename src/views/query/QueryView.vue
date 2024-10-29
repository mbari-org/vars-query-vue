<script setup lang="ts">


import { ref, watch } from 'vue'
import { useOniStore } from '@/stores/oni'

const oniStore = useOniStore()



</script>

<template>
  <div id="queryView">
    <h1>Query View</h1>
    <v-autocomplete clearable label="Concepts" :items=oniStore.concepts></v-autocomplete>
  </div>
</template>

<style scoped>

</style>
