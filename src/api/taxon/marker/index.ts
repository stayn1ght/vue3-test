import { Ref } from 'vue'
import res, { MarkerSpecies, Metadata } from '@api/taxon/marker/types'
import { ReactiveVariable } from 'vue/macros'
import { post } from '@utils/http/axios'

enum URL {
  default = '/get_all_marker_taxa/',
  markerSpeciesDetail = '/getDetailsOfAMarkerSpecies/'
}

export const getAllMarkerTaxa = async (
  species: Ref<MarkerSpecies[]>,
  metaData: ReactiveVariable<Metadata>,
  ranks: Ref<any[]>,
  callback: () => void
) => {
  const res = await post<res>({ url: URL.default })
  const rankSet = new Set<string>()
  species.value = res.marker_species
    ?.sort((a, b) => {
      // @ts-ignore
      return b.num_comparisons > a.num_comparisons ? 1 : -1
    })
    .map((item) => {
      item.children = []
      item.loading = true
      rankSet.add(item.taxon_rank_level as string)
      return item
    }) as MarkerSpecies[]
  Object.assign(metaData, res.metadata)
  ranks.value.push({ label: 'All', value: '' })
  Array.from(rankSet).forEach((v: string) => {
    const label = v[0].toUpperCase() + v.slice(1)
    ranks.value.push({ label, value: v })
  })
  callback()
}

export const getDetailsOfAMarkerSpecies = (ncbi_taxon_id: number) =>
  post({ url: URL.markerSpeciesDetail, data: { ncbi_taxon_id } })
