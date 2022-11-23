import { get, post } from '@/utils/http/axios'

enum URL {
  search = '/livesearch/',
  states = '/getDatabaseStatsForIndexController/',
  searchRuns = '/runSelectorLimit/',
  searchRunsSum = '/runSelectorCount/',
  searchProjects = '/projectSelectorLimit/',
  searchProjectsSum = '/projectSelectorCount/',
  selectedRunIDs = '/runSelectorAll/',
  uniqueIDs = '/runSelectorUniqRunID/',
  selectedProjects = '/projectSelectorAll/'
}

export const searchPage = (keywords: string) => get({ url: URL.search + keywords })

export const getHomeStates = () => post({ url: URL.states })

interface SearchParams {
  sql: string
  limit: number
  skip: number
}
export const searchRuns = (data: SearchParams) =>
  post({
    url: URL.searchRuns,
    data
  })

export const searchRunsSum = (sql: string) =>
  post({
    url: URL.searchRunsSum,
    data: { sql }
  })

export const searchProjects = (data: SearchParams) =>
  post({
    url: URL.searchProjects,
    data
  })

export const searchProjectsSum = (sql: string) =>
  post({
    url: URL.searchProjectsSum,
    data: { sql }
  })

export const downloadSelectedRunIDs = (sql: string) =>
  post({
    url: URL.selectedRunIDs,
    data: { sql }
  })

export const downloadUniqueIDs = (sql: string) =>
  post({
    url: URL.uniqueIDs,
    data: { sql }
  })

export const downloadSelectedProjects = (sql: string) =>
  post({
    url: URL.selectedProjects,
    data: { sql }
  })
