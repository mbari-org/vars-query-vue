<script setup lang="ts">



const props = defineProps<{
    summary: string
}>()

</script>

<template>
    <details>
        <summary>{{ props.summary }}</summary>
        <slot></slot>
    </details>
</template>

<style scoped>
summary::marker {
    color: #29B6F6;
}

/* Light styling for presentation */
details {
    border-block-end: 1px solid #000;
    margin-block: .5rem;
    padding-block: .5rem;
}

summary {
    color: #FFCA28;
    /* Pin the custom marker to the container */
    position: relative;
    /* Register summary as an anchor element */
    anchor-name: --summary;

    &::marker {
        content: "";
    }

    &::before,
    &::after {
        /* Custom marker dimensions */
        content: "";
        border-block-start: 3px solid #FFCA28;
        height: 0;
        width: 1rem;

        /* Positions the lines */
        inset-block-start: 50%;
        inset-inline-end: 0;

        /* Anchor the shape to the summary */
        position: absolute;
        position-anchor: --summary;
        position-area: top end;
    }

    /* Rotate just the ::after line to create a "+"" shape */
    &::after {
        transform: rotate(90deg);
        transform-origin: 50%;
    }
}

/* Rotate the line when open */
details[open] summary::after {
    transform: rotate(0deg);
}
</style>
