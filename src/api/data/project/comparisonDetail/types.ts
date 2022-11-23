export interface Res {
  metadata: ResMetadata
  iscurated: number
  curationstatsbyphenotypecomparison: ResCurationstatsbyphenotypecomparison[]
  allmarkers: ResAllmarkers[]
  allmarkers_cnt: number
  curationstats: ResCurationstats
  allsamples: ResAllsamples[]
  samplescount: number
}
export interface ResMetadata {
  project_id?: string
  phenotype1?: string
  phenotype1_term?: string
  phenotype2?: string
  phenotype2_term?: string
  iscurated?: number
}
export interface ResCurationstatsbyphenotypecomparison {
  phenotype1: string
  phenotype2: string
  markers: number
  term1: string
  term2: string
  sample_count1: number
  sample_count2: number
}
export interface ResAllmarkers {
  phenotype1: string
  phenotype2: string
  ncbi_taxon_id: number
  taxon_rank_level: string
  LDA: number
  scientific_name: string
  term1: string
  term2: string
  phenotype_comparison: string
}
export interface ResCurationstats {
  phenotype_comparisons?: number
  markers?: number
  marker_species?: number
  marker_genus?: number
  sample_count1?: number
  sample_count2?: number
}
export interface ResAllsamples {
  project_id: string
  sample_uid: string
  phenotype: string
  phenotype_term: string
  run_ids: string
  run_id_cnt: number
}
