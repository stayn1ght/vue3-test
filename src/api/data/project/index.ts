import { post } from '@utils/http/axios'
import {
  Res,
  ResAllsamples,
  ResCurationstats,
  ResCurationstatsbyphenotypecomparison,
  ResProject
} from '@api/data/project/types'
import { ReactiveVariable } from 'vue/macros'
import { Ref } from 'vue'

enum URL {
  projectDetail = '/getProjectDetailsByID/',
  runs = '/getAllRunsByProjectIDAsync/'
}

export const getAllProjects = async (
  ncbi_project_id: string,
  diseaseMap: ReactiveVariable<any>,
  project: ReactiveVariable<ResProject>,
  stats: ReactiveVariable<ResCurationstats>,
  comparisons: Ref<ResCurationstatsbyphenotypecomparison[]>,
  markers: Ref<any[]>,
  d3Data: ReactiveVariable<any>,
  samples: Ref<ResAllsamples[]>,
  callback1: (total: number) => void,
  callback2: () => void,
  callback3: () => void,
  callback4: () => void
) => {
  const res = await post<Res>({ url: URL.projectDetail, data: { ncbi_project_id } })
  Object.assign(diseaseMap, res.disease2term)
  Object.assign(project, res.project)
  project.iscurated = res.iscurated
  project.samplescount = res.samplescount
  if (res.project.samples_per_project && res.project.samples_per_project > 0) {
    if (res.project.failed_runs) {
      project.failed_runs_pct =
        (res.project['failed_runs'] / res.project['samples_per_project']) * 100
    }
    if (res.project.loaded_samples) {
      project.processed_runs_pct =
        (res.project['loaded_samples'] / res.project['samples_per_project']) * 100
    }
    if (res.project.valid_runs) {
      project.valid_runs_pct =
        (res.project['valid_runs'] / res.project['samples_per_project']) * 100
    }
  }
  callback1(res.project.samples_per_project ?? 0)
  Object.assign(stats, res.curationstats)
  res.curationstatsbyphenotypecomparison &&
    (comparisons.value = res.curationstatsbyphenotypecomparison.sort(
      (a, b) => b.markers - a.markers
    ))
  callback2()
  markers.value = res.allmarkers || []
  callback3()
  if (res.curationstats) {
    d3Data.data = getD3Data(res)
    if (res.curationstats.marker_species && res.curationstats.marker_species > 0)
      d3Data.markertype = 'species'
    else if (res.curationstats.marker_genus && res.curationstats.marker_genus > 0)
      d3Data.markertype = 'genus'
  }
  if (res.allsamples) {
    samples.value = res.allsamples.sort((a, b) => b.run_id_cnt - a.run_id_cnt)
    callback4()
  }
}

function getD3Data(data: Res) {
  const d3Data = {}
  if (data.iscurated && data.iscurated > 0 && data.allmarkers) {
    // iterate ...
    for (let i = 0; i < data.allmarkers.length; i++) {
      // @ts-ignore
      const tmpdat = data.allmarkers[i]

      // get phenotype combinations --
      const phenotype_combinations = tmpdat.phenotype1 + '_' + tmpdat.phenotype2
      if (!(phenotype_combinations in d3Data)) {
        // @ts-ignore
        d3Data[phenotype_combinations] = {
          acc1: tmpdat.phenotype1,
          term1: tmpdat.term1,
          acc2: tmpdat.phenotype2,
          term2: tmpdat.term2,
          members: []
        }
      }

      // @ts-ignore
      d3Data[phenotype_combinations].members.push({
        ncbi_taxon_id: tmpdat.ncbi_taxon_id,
        lda: tmpdat.LDA,
        id: tmpdat.scientific_name,
        taxon_rank_level: tmpdat.taxon_rank_level,
        marker_type: 'by_taxon' // Sep 27, 2021; this
      })
    }
  }
  return d3Data
}

export const getRuns = (data: any) => post({ url: URL.runs, data })
