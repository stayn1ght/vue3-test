<template>
  <!-- 
    利用v-model获取组件的width和height
   -->
  <v-chart class="chart" :option="option" />
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { get, post } from '@/utils/http/axios';
import { use, init } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { GraphChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphChart,
]);


const data = reactive([
  {
    fixed: true,
    x: 300,
    y: 300,
    symbolSize: 20,
    id: '-1'
  }
])
const edges = reactive([{target: -1, source: 0}])
const option = computed(() => {
  const obj = {
    series: [{
      type: 'graph',
      layout: 'force',
      animation: false,
      data: data,
      force: {
        // initLayout: 'circular'
        // gravity: 0
        repulsion: 100,
        edgeLength: 5
      },
      edges: edges
    }],
    roam : true,
    legendHoverLink : true,
  }
  return obj
})
setInterval(function () {
  data.push({
    id: data.length + '',
    x: Math.random() * 600,
    y: Math.random() * 600,
    symbolSize: 20,
    fixed: false
  });
  var source = Math.round((data.length - 1) * Math.random());
  var target = Math.round((data.length - 1) * Math.random());
  if (source !== target) {
    edges.push({
      source: source,
      target: target
    });
  }
}, 60000);


</script>
  
<style scoped>
.chart {
/* height: 100vh; */
width: 100vh;
height: 80vh;
}
</style>
