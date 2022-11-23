import { post } from '@utils/http/axios'
import { Ref } from 'vue'
import { ReactiveVariable } from 'vue/macros'
import { Res, ResAssociated_run_ids, ResSample_info } from '@api/data/curatedSample/types'
import { setPlotData } from '@api/data/run'

enum URL {
  detail = '/get_details_by_curated_sample_uid/',
  content = '/getRelativeAbundanceByCuratedSampleUID/'
}

export const getCuratedSampleDetailsBySampleId = async (
  sample_uid: string,
  runIds: Ref<ResAssociated_run_ids[]>,
  stats: ReactiveVariable<ResSample_info>,
  speciesPie: Ref<any[]>,
  speciesBar: Ref<any[]>,
  genusPie: Ref<any[]>,
  genusBar: Ref<any[]>
) => {
  const res = await post<Res>({ url: URL.detail, data: { sample_uid } })
  runIds.value = res.associated_run_ids
  Object.assign(stats, res.sample_info)
  setPlotData(res, speciesPie, speciesBar, genusPie, genusBar)
}

export const getRelativeAbundanceByCuratedSampleUID = (data: any) =>
  post({ url: URL.content, data })
