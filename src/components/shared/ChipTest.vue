<template>
    <v-autocomplete
        v-model="selected"
        :items="['Alice','Bob','Carol']"
        multiple
        chips
        clearable
        :chip-props="{ color: 'secondary' }"
        label="Observers"
    />
</template>

<script setup>
import { ref } from 'vue'
const selected = ref([])
</script>

<style scoped>
.v-autocomplete .v-chip {
    background-color: green !important;
    color: red !important;
}
</style>
