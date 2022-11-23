<template>
  <div class="plotly" ref="plotly"></div>
</template>

<script setup>
  import { defineProps, nextTick } from 'vue'
  import Plotly from 'plotly.js/dist/plotly'
  const props = defineProps({
    plotlyData: {
      type: Object
    },
    plotlyLayout: {
      type: Object,
      default: () => {
        return {
          height: 420,
          margin: {
            t: 80,
            l: 80,
            b: 50,
            r: 10
          },
          // title : "Prevalence vs. abundance",
          xaxis: {
            title: 'Prevalence (%)'
          },
          yaxis: {
            title: 'Relative abundance (%)'
          },
          legend: {
            x: 0.5,
            y: 1,
            orientation: 'h'
          }
        }
      }
    },
    plotlyOptions: {
      type: Object,
      default: () => {
        return {
          showlink: true,
          displaylogo: false
        }
      }
    }
  })
  const plotly = ref(null)
  const redraw = () => {
    Plotly.newPlot(plotly.value, props.plotlyData, props.plotlyLayout, props.plotlyOptions)
  }
  watch(
    () => props.plotlyData,
    () => {
      nextTick(() => {
        redraw()
      })
    },
    {
      deep: true
    }
  )
</script>

<style scoped lang="less">
  .plotly {
    width: 100%;
  }
</style>
