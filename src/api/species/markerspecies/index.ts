import { post } from '@utils/http/axios'
import { Ref } from 'vue'
import { ReactiveVariable } from 'vue/macros'
import { MarkerSpecies } from '@api/taxon/marker/types'
import { Metadata, Res } from '@api/species/markerspecies/types'

enum URL {
  allMarkerTaxa = '/get_all_marker_taxa/'
}

export const getAllMarkerTaxa = async (
  taxa: Ref<MarkerSpecies[]>,
  metadata: ReactiveVariable<Metadata>,
  callback: () => void
) => {
  const res = await post<Res>({ url: URL.allMarkerTaxa })
  taxa.value = res.marker_species
    .sort((a, b) => b.num_comparisons - a.num_comparisons)
    .map((item) => {
      item.children = []
      item.loading = true
      return item
    })
  Object.assign(metadata, res.metadata)
  callback()
}
