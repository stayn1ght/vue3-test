export interface metadataItem {
  mappingTo?: string
  uid?: string
  note?: string
  term?: string
}

export interface phenotype_comparesItem {
  phenotype1: string
  phenotype2: string
  projects: number
  phenotype2_term: string
  markers: number
  phenotype1_term: string
}

export interface associated_speciesItem {
  abus_mean: number
  disease: string
  dblinks: string
  taxon_rank_level: string
  ncbi_taxon_id: number
  scientific_name: string
  abus_median: number
  abus_sd: number
  samples: number
  pct_of_loaded_samples: number
}

export interface nodesItem {
  nodeserial: number
  size: number
  name: string
  id: number
  name2: string
  type: string
  url: string
}

export interface assoc_projectsItem {
  samples_per_project: number
  disease: string
  Original_Project_description: string
  iscurated: number
  project_id: string
  Related_Publications: number
  hasmarker: number
  loaded_samples: number
  Curated_Project_description: any
}

export interface statsItem {
  nr_species?: number
  nr_total_samples?: number
  num_cooccuring_pairs_species?: number
  nr_valid_samples?: number
  nr_loaded_samples?: number
  num_cooccuring_pairs_to_get?: number
  num_cooccuring_pairs_genus?: number
  nr_genus?: number
}

export interface linksItem {
  coef_pearson: number
  target_name: string
  source: number
  m_rank: string
  source_name: string
  target: number
}

export interface networkdata_d3_genusItem {
  nodes?: Array<nodesItem>
  disease?: string
  level?: string
  links?: Array<linksItem>
  max_n?: number
}

export interface associated_genusItem {
  abus_mean: number
  disease: string
  dblinks: string
  taxon_rank_level: string
  ncbi_taxon_id: number
  scientific_name: string
  abus_median: number
  abus_sd: number
  pct_of_loaded_samples: number
  samples: number
}

export interface networkdata_d3_speciesItem {
  nodes?: Array<nodesItem>
  disease?: string
  level?: string
  links?: Array<linksItem>
  max_n?: number
}

export interface rootType {
  metadata: metadataItem
  associated_species: Array<associated_speciesItem>
  assoc_projects: Array<assoc_projectsItem>
  associated_species_loaded: boolean
  associated_genus: Array<associated_genusItem>
  assoc_projects_obtained: boolean
  phenotype_compares: Array<phenotype_comparesItem>
  phenotype_compares_obtained: boolean
  stats: statsItem
  associated_genus_loaded: boolean
  metadata_obtained: boolean
  networkdata_d3_genus: Array<networkdata_d3_genusItem>
  networkdata_d3_species: Array<networkdata_d3_speciesItem>
}

export interface rulesItem {
  checking: number
  country: string
  collection_date: any
  sample_id: any
  latitude: any
  more_info: any
  experiment_type: string
  our_project_id: any
  original_sample_description: string
  project_id: string
  curated_sample_description: string
  QCStatus: any
  diet: any
  sample_name: string
  longitude: any
  BMI: number
  phenotype: string
  'Antibiotics.Dose': any
  accession_id: any
  run_id: string
  disease: string
  more: string
  sex: string
  disease_stage: any
  second_sample_id: string
  is_disease_stage_available: string
  host_age: number
  'Days.Without.Antibiotics.Use': any
  'Recent.Antibiotics.Use': any
  antibiotics_used: any
  nr_reads_sequenced: number
  instrument_model: string
}
