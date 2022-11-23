import { post } from '@utils/http/axios'
import {
  assoc_projectsItem,
  associated_genusItem,
  associated_speciesItem,
  metadataItem,
  networkdata_d3_genusItem,
  networkdata_d3_speciesItem,
  phenotype_comparesItem,
  rootType,
  rulesItem,
  statsItem
} from '@api/phenotypes/detail/types'
import { ReactiveVariable } from 'vue/macros'
import { Ref } from 'vue'

enum URL {
  info = '/getAssociatedMicrobiotaDatasetsByPhenotypeMeshID/',
  assRuns = '/getAssociatedRunsByPhenotypeMeshIDLimit/'
}

export const getAllMicrobiotaDatasets = async (
  mesh_id: string,
  metadata: ReactiveVariable<metadataItem>,
  stats: ReactiveVariable<statsItem>,
  comparisons: Ref<phenotype_comparesItem[]>,
  // 配合phenotype/_id.vue中的逻辑修改
  // species: Ref<associated_speciesItem[]>, 
  genus: Ref<associated_genusItem[]>,
  projects: Ref<assoc_projectsItem[]>,
  d3Genus: ReactiveVariable<networkdata_d3_genusItem>,
  // d3Species: ReactiveVariable<networkdata_d3_speciesItem>,
  callback: () => void
) => {
  const res = await post<rootType>({ url: URL.info, data: { mesh_id } })
  res.associated_species.map((item) => {
    // @ts-ignore
    item.pct_of_loaded_samples = (item.samples / res.stats.nr_valid_samples) * 100
    return item
  })
  res.associated_genus.map((item) => {
    // @ts-ignore
    item.pct_of_loaded_samples = (item.samples / res.stats.nr_valid_samples) * 100
    return item
  })
  Object.assign(metadata, res.metadata)
  Object.assign(stats, res.stats)
  // species.value = res.associated_species.sort((a, b) => b.samples - a.samples)
  genus.value = res.associated_genus.sort((a, b) => b.samples - a.samples)
  projects.value = res.assoc_projects.sort((a, b) => b.loaded_samples - a.loaded_samples)
  comparisons.value = res.phenotype_compares.sort((a, b) => b.markers - a.markers)
  Object.assign(d3Species, res.networkdata_d3_species)
  Object.assign(d3Genus, res.networkdata_d3_genus)
  callback()
}

export const getAssRunsById = (mesh_id: string, limit: number, skip: number) =>
  post<rulesItem[]>({ url: URL.assRuns, data: { mesh_id, limit, skip } })
