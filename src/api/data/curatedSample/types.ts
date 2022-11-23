export interface Res {
  sample_info: ResSample_info
  associated_run_ids: ResAssociated_run_ids[]
  run_id_cnt: number
  species: ResSpecies[]
  genus: ResGenus[]
}
export interface ResSample_info {
  phenotype?: string
  project_id?: string
  Original_Project_description?: string
  term?: string
  Curated_Project_description?: any
}
export interface ResAssociated_run_ids {
  run_id: string
}
export interface ResSpecies {
  ncbi_taxon_id: number
  taxon_rank_level: string
  relative_abundance: number
  scientific_name: string
}
export interface ResGenus {
  ncbi_taxon_id: number
  taxon_rank_level: string
  relative_abundance: number
  scientific_name: string
}
