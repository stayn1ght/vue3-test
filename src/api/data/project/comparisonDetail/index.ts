import { post } from '@utils/http/axios'
import { Ref } from 'vue'
import { ReactiveVariable } from 'vue/macros'
import {
  Res,
  ResAllmarkers,
  ResAllsamples,
  ResCurationstats,
  ResMetadata
} from '@api/data/project/comparisonDetail/types'

enum URL {
  detail = '/getCuratedProjectDetailsOnPhenotypeComparison/'
}

export const getProjectDetailOnComparison = async (
  data: any,
  stats: ReactiveVariable<ResCurationstats>,
  metadata: ReactiveVariable<ResMetadata>,
  markers: Ref<ResAllmarkers[]>,
  d3Data: ReactiveVariable<any>,
  samples: Ref<ResAllsamples[]>,
  callback1: () => void,
  callback2: () => void
) => {
  const res = await post<Res>({ url: URL.detail, data })
  Object.assign(stats, res.curationstats)
  Object.assign(metadata, res.metadata)
  metadata.iscurated = res.iscurated
  stats.sample_count1 = res.curationstatsbyphenotypecomparison[0].sample_count1
  stats.sample_count2 = res.curationstatsbyphenotypecomparison[0].sample_count2
  markers.value = res.allmarkers.sort((a, b) => b.LDA - a.LDA)

  if (res.curationstats && res.iscurated && res.iscurated > 0) {
    const d3data = {}
    for (let i = 0; i < res.allmarkers.length; i++) {
      const tmpdat = res.allmarkers[i]

      // get phenotype combinations --
      const phenotype_combinations = tmpdat.phenotype1 + '_' + tmpdat.phenotype2
      if (!(phenotype_combinations in d3data)) {
        // @ts-ignore
        d3data[phenotype_combinations] = {
          acc1: tmpdat.phenotype1,
          term1: tmpdat.term1,
          acc2: tmpdat.phenotype2,
          term2: tmpdat.term2,
          members: []
        }
      }

      // @ts-ignore
      d3data[phenotype_combinations].members.push({
        ncbi_taxon_id: tmpdat.ncbi_taxon_id,
        lda: tmpdat.LDA,
        id: tmpdat.scientific_name,
        taxon_rank_level: tmpdat.taxon_rank_level
      })
    }
    d3Data.data = d3data
    d3Data.markertype =
      res.curationstats!.marker_species && res.curationstats.marker_species > 0
        ? 'species'
        : res.curationstats!.marker_genus && res.curationstats.marker_genus > 0
        ? 'genus'
        : ''
  }

  samples.value = res.allsamples.sort((a, b) => b.run_id_cnt - a.run_id_cnt)
  callback1()
  callback2()
}
