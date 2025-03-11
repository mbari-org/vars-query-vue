<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRazielStore } from '@/stores/raziel'
import router from '@/router'
import { computedAsync } from '@vueuse/core'

const razielStore = useRazielStore()



razielStore.api.getEndpoints()
    .then(() => {
        // router.push('/query')
    })
    .catch((error) => {
        router.push('/config')
    })

const configIsOk = computedAsync(() => {
    return razielStore.api.getEndpoints()
        .then(() => {
            return true
        })
        .catch((error) => {
            return false
        })
})


</script>

<template>
    <div id="app">
<!--    <v-container fluid style="width:100%" id="app">-->
<!--        <v-row>-->
<!--            <v-col-->
<!--                >-->
                <header>
                    <img
                        alt="MBARI logo"
                        class="logo"
                        src="@/assets/images/logo-mbari-3b.png"
                    />

                    <div class="wrapper">
                        <nav>
                            <RouterLink v-if="configIsOk" to="/query">Query</RouterLink>
                            <RouterLink to="/config">Configuration</RouterLink>
                        </nav>
                    </div>
                </header>
<!--            </v-col>-->
<!--        </v-row>-->

    <v-container fluid style="width:100%">
        <v-row>
            <v-col>
                <RouterView />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-alert
                    v-if="!configIsOk"
                    color="error"
                    icon="$error"
                    text="That is not a valid configuration URL"></v-alert>
            </v-col>
        </v-row>
    </v-container>
    </div>
</template>

<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 16px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 2048px) {
    header {
        display: flex;
        place-items: center;
        /* padding-right: calc(var(--section-gap) / 2);*/
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: nowrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}

#app {
    flex-direction: column;
}
</style>
