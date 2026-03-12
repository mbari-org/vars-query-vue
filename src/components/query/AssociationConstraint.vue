<script setup lang="ts">
import { useAssociationsStore } from '@/stores/query-params'
import { useOniStore } from '@/stores/oni'
import { ref } from 'vue'

const associationsStore = useAssociationsStore()
const oniStore = useOniStore()
const selectedLinkNameInAutocomplete = ref('')

function addAssociation(event: Event) {
    // const association = document
    //     ?.getElementById('associationTextField')
    //     ?.getAttribute('value')
    const association = selectedLinkNameInAutocomplete.value
    if (association) {
        associationsStore.add(association)
        selectedLinkNameInAutocomplete.value = ''
    }
}
</script>

<template>
    <div>
        <!--        <h2>Association</h2>-->
        <v-container fluid style="width: 100%">
            <v-row>
                <v-col cols="6">
                    <v-text-field
                        v-if="!associationsStore.exactMatch"
                        id="associationTextField"
                        v-model="selectedLinkNameInAutocomplete"
                        clearable
                        label="Details/Associations"
                        :hint="selectedLinkNameInAutocomplete ? 'Click + to add this as a constraint' : ''"
                        persistent-hint
                    ></v-text-field>
                    <v-autocomplete
                        v-else
                        id="associationTextField"
                        v-model="selectedLinkNameInAutocomplete"
                        clearable
                        label="Link name"
                        :items="oniStore.linkNames"
                        :hint="selectedLinkNameInAutocomplete ? 'Click + to add this as a constraint' : ''"
                        persistent-hint
                    ></v-autocomplete>
                </v-col>
                <v-col>
                    <v-checkbox
                        label="Exact Match"
                        v-model="associationsStore.exactMatch"
                    >
                        <v-tooltip activator="parent"
                            >Exact matches search by the exact link name in an annotation detail. The default is to search for text in the details/associations.</v-tooltip>
                    </v-checkbox>
                </v-col>
                <v-col>
                    <v-spacer></v-spacer>
                    <!--                    <v-checkbox label="And" v-model="associationsStore.useAnd">-->
                    <!--                        <v-tooltip activator="parent">Each query result must contain all associations</v-tooltip>-->
                    <!--                    </v-checkbox>-->
                </v-col>
                <v-col>
                    <v-btn
                        @click="addAssociation"
                        icon="mdi-plus"
                        size="x-large"
                        variant="tonal"
                        :color="selectedLinkNameInAutocomplete ? 'warning' : 'primary'"
                        :class="{ 'btn-pulse': selectedLinkNameInAutocomplete }"
                    >
                        <v-icon icon="mdi-plus"></v-icon>
                        <v-tooltip
                            v-if="associationsStore.exactMatch"
                            activator="parent"
                            location="bottom"
                            >Search details/associations that match this link name (e.g. eating, comment, bounding box, surface-color, etc.)</v-tooltip
                        >
                        <v-tooltip v-else activator="parent" location="bottom"
                            >Search for details/associations that contain this text</v-tooltip
                        >
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-chip
                    v-for="(
                        selectedAssociation, i
                    ) in associationsStore.associations"
                    :key="selectedAssociation"
                    closable
                    @click:close="associationsStore.remove(i)"
                    color="secondary"
                    variant="tonal"
                >
                    {{ selectedAssociation }}
                </v-chip>
            </v-row>
        </v-container>
    </div>
</template>

<style scoped>
@keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-warning), 0.5); }
    50% { box-shadow: 0 0 0 8px rgba(var(--v-theme-warning), 0); }
}

.btn-pulse {
    animation: pulse 1.5s ease-in-out infinite;
}
</style>
