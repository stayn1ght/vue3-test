<template>
  <div class="taxon-pages">
    <h1>Microbes in human gut</h1>
    <div class="info mt-20px">
      <dl class="mt-10px">
        <dt>
          In all of the
          <span class="text-red-800 font-bold italic">{{
            metadata?.loaded_samples?.toLocaleString()
          }}</span>
          valid * samples/runs in our database, we found:
        </dt>
        <dd>
          in total
          <span class="text-red-800 font-bold italic">{{
            metadata?.all_species_count?.toLocaleString()
          }}</span>
          species, belonging to
          <span class="text-red-800 font-bold italic">{{
            metadata?.all_genus_count?.toLocaleString()
          }}</span>
          genera.</dd
        >
        <dd>
          <dl>
            <dt>
              among which,
              <span class="text-red-800 font-bold italic">{{
                metadata?.retrieved_species_count?.toLocaleString()
              }}</span>
              species, belonging to
              <span class="text-red-800 font-bold italic">{{
                metadata?.retrieved_genus_count?.toLocaleString()
              }}</span>
              genera, found
            </dt>
            <dd>in >=2 samples</dd>
            <dd>with median relative abundances >=0.01%.</dd>
          </dl>
        </dd>
      </dl>
      <my-link
        :show-icon="false"
        is-external
        to="https://gmrepo.humangut.info/Downloads/AllSummaryData/GMREPO_relative_abundance_of_all_species_genus_in_all_phenotypes_summary.tsv.gz"
      >
        The relative abundances of all species/genera (separated by phenotypes) could be downloaded
        at here <el-icon><Download /></el-icon>.
      </my-link>
      <p>See the <span class="font-bold">Statistics</span> section below for more details.</p>
      <p class="my-4"
        >* note: valid runs refer to those passed our QC checks and have species abundance
        information in our database; see
        <my-link
          :show-icon="false"
          is-external
          to="https://evolgeniusteam.github.io/gmrepodocumentation/materialsandmethods/dataprocessingandqc/"
          >Help</my-link
        >
        page for details.</p
      >
    </div>
    <el-tabs v-model="activeName" class="mt-24px">
      <el-tab-pane name="first">
        <template #label>
          <span class="text-xl">
            <el-icon><List /></el-icon>
            Species
          </span>
        </template>
        <species-pane :species="species" />
      </el-tab-pane>
      <el-tab-pane name="second">
        <template #label>
          <span class="text-xl">
            <el-icon><List /></el-icon>
            Genus
          </span>
        </template>
        <genus-pane :genus="genus" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
  import SpeciesPane from './components/SpeciesPane/index.vue'
  import GenusPane from './components/GenusPane/index.vue'
  import { useSaveScrollPosition } from '@/hooks/saveScrollPosition'
  import { Genus, Metadata, Species } from '@api/taxon/types'
  import { getAllGutMicrobes } from '@api/taxon'
  import { Download, List } from '@element-plus/icons-vue'
  const scrollTop = ref(0)
  useSaveScrollPosition(scrollTop)

  const metadata = reactive<Metadata>({})
  const species = ref<Species[]>([])
  const genus = ref<Genus[]>([])
  getAllGutMicrobes(species, genus, metadata)

  const activeName = ref('first')
</script>

<script lang="ts">
  export default {
    name: 'Taxon'
  }
</script>

<style lang="less" scoped>
  .taxon-pages {
    .info {
      background: #f5f5f5;
      padding: 15px;
      margin-bottom: 20px;
      color: #666;
      dl {
        list-style-type: disc;
        dd {
          display: list-item;
          margin-inline-start: 3em;
        }
        dl {
          list-style-type: circle;
        }
      }
    }
  }
</style>
