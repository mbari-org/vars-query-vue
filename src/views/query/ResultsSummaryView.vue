<script setup lang="ts">
import { useQueryResultsStore } from '@/stores/query-results'
import { computed } from 'vue'
import { depthHistogram } from '@/assets/ts/util'

const queryResultsStore = useQueryResultsStore()
const allAnnotations = queryResultsStore.annotations

const depths = computed(() => allAnnotations.map(a => a.depth_meters ?? NaN).filter(d => !isNaN(d)))

const depthChart = computed(() => {
    const data = depthHistogram(depths.value)
    return {
        series: [
            {
                name: 'Depth',
                data: data.map(d => d.count),
            },
        ],
        options: {
            dataLabels: {
                enabled: true
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                },
            },
            xaxis: {
                categories: data.map(d => `${d.min.toFixed(0)}-${d.max.toFixed(0)}m`),
                lines: {
                    show: true
                },
                title: {
                    text: "Count"
                }
            },
            yaxis: {
                lines: {
                    show: true
                },
                title: {
                    text: "Depth (m)"
                }
            },
            tooltip: {
                enabled: false,
            }
        },
    }
})

const temperatureSalinityChart = computed(() => {
    const data = allAnnotations.filter(a => a.temperature_celsius && a.salinity)
        .map(a => [a.salinity, a.temperature_celsius])
    // console.log(data)
    return {
        series: [
            {
                name: 'T-S',
                data: data,
            },
        ],
        options: {
            grid: {
                xaxis: {
                    lines: {
                        show: true
                    },
                    type: 'numeric'
                },
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            },
            xaxis: {
                // categories: data.map(d => `${d.min.toFixed(0)}-${d.max.toFixed(0)}m`),
                lines: {
                    show: true
                },
                max: 35.5,
                min: 32.5,
                labels: {
                    formatter: (value: number) => value.toFixed(1)
                },
                tickAmount: 10,
                title: {
                    text: "Salinity (psu)"
                }
            },
            yaxis: {
                min: 0,
                max: 24,
                labels: {
                    formatter: (value: number) => value.toFixed(1)
                },
                lines: {
                    show: true
                },
                tickAmount: 10,
                title: {
                    text: "Temperature (C)"
                }
            },
            tooltip: {
                enabled: false,
                x: {
                    formatter: (value: number) => value.toFixed(1)
                },
                y: {
                    formatter: (value: number) => value.toFixed(1)
                }
            }
        },
    }
})

</script>

<template>
    <v-row>
        <v-col>
            <router-link to="/results-table-view"
            >Back to results table</router-link
            >
        </v-col>
    </v-row>

     <div>
         <!-- https://apexcharts.com/javascript-chart-demos/bar-charts/basic/ -->
         <h2>Depth Histogram</h2>
         <apexchart :series="depthChart.series" :options="depthChart.options" type="bar" height="700"></apexchart>
     </div>
    <div>
        <!-- https://apexcharts.com/javascript-chart-demos/bar-charts/basic/ -->
        <h2>T-S Diagram</h2>
        <apexchart v-if="temperatureSalinityChart.series[0].data.length > 0" :series="temperatureSalinityChart.series" :options="temperatureSalinityChart.options" type="scatter" height="700"></apexchart>
        <div v-else>No data. To view this plot, return temperature and salinity data in your query</div>
    </div>
</template>

<style scoped>

</style>
