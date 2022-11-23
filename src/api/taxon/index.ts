import Res, { Genus, Metadata, Species } from '@api/taxon/types'
import { Ref } from 'vue'
import { post } from '@utils/http/axios'
import { ReactiveVariable } from 'vue/macros'

enum URL {
  allGutMicrobes = '/get_all_gut_microbes/',
  associatedTaxon = '/getPhenotypesAndAbundanceSummaryOfAAssociatedTaxon/'
}

export const getAllGutMicrobes = async (
  species: Ref<Species[] | undefined>,
  genus: Ref<Genus[] | undefined>,
  metadata: ReactiveVariable<Metadata>
) => {
  const res = await post<Res>({ url: URL.allGutMicrobes })
  species.value = res.all_species
    ?.sort((a, b) => {
      // @ts-ignore
      return b.presented_samples - a.presented_samples
    })
    .map((item) => {
      item.children = []
      item.loading = true
      return item
    })
  genus.value = res.all_genus
    ?.sort((a, b) => {
      // @ts-ignore
      return b.presented_samples - a.presented_samples
    })
    .map((item) => {
      item.children = []
      item.loading = true
      return item
    })
  Object.assign(metadata, res.metadata)
}

export const getAssociatedTaxon = (ncbi_taxon_id: number) =>
  post({ url: URL.associatedTaxon, data: { ncbi_taxon_id } })
