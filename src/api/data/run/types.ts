export interface Res {
  run: ResRun
  phenotypes: ResPhenotypes[]
  phenotypes_exist: boolean
  species?: ResSpecies[]
  genus?: ResGenus[]
}
export interface ResRun {
  project_id?: string
  original_sample_description?: string
  run_id?: string
  experiment_type?: string
  instrument_model?: string
  nr_reads_sequenced?: number
  host_age?: number
  sex?: string
  BMI?: number
  country?: string
  longitude?: any
  latitude?: any
  loaded_uid?: any
  QCStatus?: any
  QCMessage?: any
  Original_Project_description?: string
}
export interface ResPhenotypes {
  disease: string
  term: string
}

export interface ResSpecies {
  ncbi_taxon_id: number
  taxon_rank_level: string
  relative_abundance: number
  scientific_name: string
}

export interface ResGenus {
  loaded_uid: number
  ncbi_taxon_id: number
  taxon_rank_level: string
  relative_abundance: number
  scientific_name: string
}
