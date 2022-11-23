import { post } from '@utils/http/axios'
import { Ref } from 'vue'
import { ReactiveVariable } from 'vue/macros'
import { Res, ResAlldata, ResStats } from '@api/comparisons/detail/types'

enum URL {
  detail = '/getPhenotypeComparisonsDetails/'
}

export const getAllComparisonDetails = async (
  data: any,
  stats: ReactiveVariable<ResStats>,
  allData: Ref<ResAlldata[]>,
  d3Data: ReactiveVariable<any>,
  callback: () => void
) => {
  const res = await post<Res>({ url: URL.detail, data })
  Object.assign(stats, res.stats)
  allData.value = res.alldata
  // @ts-ignore
  d3Data.markertype = stats.marker_species > 0 ? 'species' : stats.marker_genus > 0 ? 'genus' : ''
  if (res.projects.length > 1) d3Data.plotoptions.nrproj = 2
  d3Data.data = res.alldata
  callback()
}
