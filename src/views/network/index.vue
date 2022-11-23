<template>
    <div>
        <v-chart class="chart" :option="option" />
    </div>
</template>

<script setup name='network'>
// const { proxy } = getCurrentInstance()
// const router = useRouter()
// const route = useRoute()
/* import {getBooks} from '../../api/api.ts'
const books = getBooks()
console.log(books) */
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";

// 按需引入组件
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, defineComponent } from "vue";
// 引入数据
import  network  from "./data";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);


const option = ref({
    title: {
        text: "Traffic Sources",
        left: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: ["Direct", "Email", "Ad Networks", "Video Ads", "Search Engines"]
      },
      series: [
        {
          name: "Traffic Sources",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: [
            { value: 335, name: "Direct" },
            { value: 310, name: "Email" },
            { value: 234, name: "Ad Networks" },
            { value: 135, name: "Video Ads" },
            { value: 1548, name: "Search Engines" }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]

});

</script>

<style lang='less' scoped>
.chart {
  height: 400px;
}
</style>