<template>
  <div class="home-page">
    <h1>
      <logo class="font-bold" />
      : a curated database of human gut metagenomes
    </h1>
    <div class="info">
      <p>
        <logo class="font-bold" />
        is a curated database of consistently annotated human gut metagenomes.
      </p>
      <p>Its main features include:</p>
      <ul>
        <li>extensive manual curation of meta-data of gut samples/runs,</li>
        <li
          >grouping samples/runs according to their associated human phenotypes (i.e. health and
          diseases),</li
        >
        <li>graphical selectors enabling easy and efficient access to all our collected data.</li>
      </ul>
      <p class="mb-4">
        So far <logo /> contains
        <span class="text-red-800 font-bold italic">{{ infoData.samples }}&nbsp;</span>
        <my-link :show-icon="false" to="/data"
          >human gut runs/samples <i class="iconfont icon-right"></i
        ></my-link>
        from <span class="text-red-800 font-bold italic">{{ infoData.projects }}&nbsp;</span>
        <my-link :show-icon="false" to="/data"
          >projects <i class="iconfont icon-right"></i
        ></my-link>
        they are associated with
        <span class="text-red-800 font-bold italic">{{ infoData.phenotypes }}&nbsp;</span>
        <my-link :show-icon="false" to="/phenotypes"
          >human phenotypes <i class="iconfont icon-right"></i
        ></my-link>
      </p>
      <p class="mb-8">
        See the
        <my-link
          :show-icon="false"
          is-external
          to="https://evolgeniusteam.github.io/gmrepodocumentation/"
          >Help</my-link
        >
        page for more details.
      </p>
      <hr />
      <p class="mt-8">
        In
        <logo class="font-bold" />, manually curation was also performed for selected projects to
        identify
        <my-link :show-icon="false" to="/taxon/marker">
          marker taxa
          <i class="iconfont icon-star"></i>
          <i class="iconfont icon-right"></i>
        </my-link>
        for phenotypes of interests, e.g.,
        <my-link :show-icon="false" to="/phenotypes/comparisons/D006262/D015179"
          >Health vs. Colorectal Neoplasms <i class="iconfont icon-right"></i
        ></my-link>
      </p>
      <p class="mb-2">
        So far,
        <logo />
        includes :
      </p>
      <ul>
        <li>
          <span class="text-red-800 font-bold italic">{{ infoData.taxon }}&nbsp;</span>
          <my-link :show-icon="false" to="/taxon/marker">
            marker taxa
            <i class="iconfont icon-star"></i>
            <i class="iconfont icon-right"></i> </my-link
          >, including
          <ul>
            <li class="font-bold">
              <span class="text-red-800 font-bold italic">{{ infoData.species }}&nbsp;</span>
              <span>marker species </span>
              <i class="iconfont icon-star"></i>
              <span class="font-normal"> and</span>
            </li>
            <li class="font-bold">
              <span class="text-red-800 font-bold italic">{{ infoData.genera }}&nbsp;</span>
              <span>marker genera </span>
              <i class="iconfont icon-star"></i>,
            </li>
          </ul>
          identified from
        </li>
        <li>
          <span class="text-red-800 font-bold italic">{{ infoData.curatedProjects }}&nbsp;</span>
          <my-link :show-icon="false" to="/data/curatedProjects">
            curated projects
            <i class="iconfont icon-gou"></i>
            <i class="iconfont icon-right"></i>
          </my-link>
          and
        </li>
        <li>
          <span class="text-red-800 font-bold italic">{{ infoData.comparisons }}&nbsp;</span>
          <my-link :show-icon="false" to="/phenotypes/comparisons">
            phenotype comparisons of interests
            <i class="iconfont icon-gou"></i>
            <i class="iconfont icon-right"></i> </my-link
          >.
        </li>
      </ul>
      <p>Please check the corresponding pages for details.</p>
    </div>
    <div class="search-wrapper">
      <h2 class="title"> Search in <logo class="font-bold" /> for : </h2>
    </div>
    <el-tabs v-model="activeName" class="mt-24px">
      <el-tab-pane name="first">
        <template #label>
          <span class="text-xl">PROJECTS</span>
        </template>
        <projects />
      </el-tab-pane>
      <el-tab-pane name="second">
        <template #label>
          <span class="text-xl">SAMPLES/RUNS</span>
        </template>
        <samples-runs />
      </el-tab-pane>
    </el-tabs>
    <p class="info mt-24px !p-25px">
      <el-icon color="darkgreen"><question-filled /></el-icon>
      Please consult our
      <my-link
        to="https://evolgeniusteam.github.io/gmrepodocumentation/"
        :show-icon="false"
        isExternal
        >Help</my-link
      >
      page for more information on the usage of the data selectors.
    </p>
  </div>
</template>

<script setup lang="ts">
  import { QuestionFilled } from '@element-plus/icons-vue'
  import useHomeData from '../../hooks/homeData'
  import SamplesRuns from './components/SamplesRuns/index.vue'
  import Projects from './components/Projects/index.vue'
  import { useSaveScrollPosition } from '@/hooks/saveScrollPosition'
  const scrollTop = ref(0)
  useSaveScrollPosition(scrollTop)

  const { infoData, getHomeData } = useHomeData()
  getHomeData()
  console.log('info', infoData)
  const activeName = ref('first')
</script>

<script lang="ts">
  export default {
    name: 'Home'
  }
</script>

<style lang="less" scoped>
  .home-page {
    .info {
      background: #f5f5f5;
      padding: 15px;
      margin-bottom: 20px;
      color: #666;
      ul {
        list-style-type: disc;
        padding-inline-start: 40px;
        font-size: 13px;
        margin-block-end: 10px;
        ul {
          list-style-type: circle;
          margin-block-end: 0;
        }
      }
    }
    .search-wrapper {
      font-size: 20px;
    }
  }
</style>
