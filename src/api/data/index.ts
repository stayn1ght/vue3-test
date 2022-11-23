import { Ref } from 'vue'
import ProjectsRes, { Allrunsbyexperimenttype, Project, Stats } from '@api/data/types'
import { ReactiveVariable } from 'vue/macros'
import { post } from '@utils/http/axios'

enum URL {
  projects = '/getAllProjectsWithMetadataAndSomeStatistics/',
  runs = '/getAllRunsAsync/'
}

export const getAllProjectsWithMetadata = async (
  projects: Ref<Project[]>,
  allRuns: Ref<Allrunsbyexperimenttype[]>,
  stats: ReactiveVariable<Stats>,
  diseasesMap: ReactiveVariable<any>,
  callback: () => void
) => {
  const res = await post<ProjectsRes>({ url: URL.projects })
  // @ts-ignore
  projects.value = res.ALLPROJECTS?.sort((a, b) => b.valid_runs - a.valid_runs) as Project[]
  allRuns.value = res.allrunsbyexperimenttype as Allrunsbyexperimenttype[]
  Object.assign(stats, res.stats)
  Object.assign(diseasesMap, res.disease2term)
  callback()
}

export const getRuns = (data: any) => post({ url: URL.runs, data })
