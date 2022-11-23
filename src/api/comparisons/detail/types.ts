export interface Res {
  stats: ResStats
  projects: ResProjects[]
  alldata: ResAlldata[]
}
export interface ResStats {
  projects?: number
  markers?: number
  marker_species?: number
  marker_genus?: number
  phenotype1_term?: string
  phenotype2_term?: string
  mesh_id1?: string
  mesh_id2?: string
}
export interface ResProjects {
  project_id: string
  markers: number
}
export interface ResAlldata {
  project_id: string
  ncbi_taxon_id: number
  taxon_rank_level: string
  LDA: number
  scientific_name: string
  nrproj: number
  conflict: number
  experiment_type: string
}
