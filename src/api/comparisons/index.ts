import { post } from '@utils/http/axios'
import { Ref } from 'vue'
import { Comparison } from '@api/comparisons/types'
import { ReactiveVariable } from 'vue/macros'

enum URL {
  comparisons = '/get_all_phenotype_comparisons/'
}

export const getAllPhenotypeComparisons = async (
  comparisons: Ref<Comparison[]>,
  stats: ReactiveVariable<any>,
  callback: () => void
) => {
  const res = await post({ url: URL.comparisons })
  // @ts-ignore
  comparisons.value = res.data
  stats.markers = res.stats.markers
  stats.phenotypeCombinations = res.stats.phenotype_combinations
  stats.projects = res.stats.projects
  comparisons?.value?.sort((a, b) => {
    // @ts-ignore
    return b.markers - a.markers
  })
  callback()
}
