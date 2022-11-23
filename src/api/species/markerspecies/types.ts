export interface Metadata {
  marker_genus_count?: number
  retrieved_species_count?: number
  projects?: number
  marker_taxa_count?: number
  phenotype_pairs?: number
  marker_species_count?: number
}

export interface MarkerSpecies {
  projects: number
  dblinks: string
  taxon_rank_level: string
  ncbi_taxon_id: number
  scientific_name: string
  num_comparisons: number
  phenotype_combinations: number
  children?: any[]
  loading?: boolean
}

export interface Res {
  metadata: Metadata
  marker_species: Array<MarkerSpecies>
}
