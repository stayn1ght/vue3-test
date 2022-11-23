export interface HistDataForPhenotype {
    x: number;
    y: number;
    counts: number;
    cumsum: number;
    cumpct: number;
}

export interface HistDataForHealth {
    x: number;
    y: number;
    counts: number;
    cumsum: number;
    cumpct: number;
}

export interface Taxon {
    ncbi_taxon_id: number;
    node_rank: string;
    name: string;
}

export interface Disease {
    disease: string;
    all_samples: number;
    processed_runs: number;
    valid_runs: number;
    failed_runs: number;
    nr_species: number;
    nr_genus: number;
    term: string;
    note: string;
}

export interface Stats {
    ncbi_taxon_id?: number;
    node_rank?: string;
    name?: string;
    disease?: string;
    all_samples?: number;
    processed_runs?: number;
    valid_runs?: number;
    failed_runs?: number;
    nr_species?: number;
    nr_genus?: number;
    term?: string;
    note?: string;
    total_loaded_samples?: number;
    pct_of_loaded_samples?: number;
    densityPlotData?: boolean;
    boxplotGood?: boolean;
}

export interface AbundanceAndMetaData {
    project_id: string;
    run_id: string;
    country: string;
    sex: string;
    host_age?: number;
    BMI?: number;
    relative_abundance: number;
    sample_name: string;
    original_sample_description: string;
}

export interface CoOccurredTaxa {
    disease: string;
    taxon_rank_level: string;
    taxon1: number;
    taxon2: number;
    pvalue_pearson: number;
    coef_pearson: number;
    pvalue_spearman: number;
    coef_spearman: number;
    sample_count_co: number;
    sample_count_taxon1_only: number;
    sample_count_taxon2_only: number;
    sample_count_none: number;
    odds_ratio: number;
    fisher_pvalue: number;
    or_conf1: number;
    or_conf2: number;
    taxon2_sci_name: string;
}

export interface Res {
    hist_data_for_phenotype: HistDataForPhenotype[];
    phenotype_hist_data_obtained: boolean;
    health_phenotype_hist_data_obtained: boolean;
    hist_data_for_health: HistDataForHealth[];
    abundant_data_for_disease: number[];
    abundant_data_for_health: number[];
    taxon: Taxon;
    disease: Disease;
    abundance_and_meta_data: AbundanceAndMetaData[];
    co_occurred_taxa: CoOccurredTaxa[];
    num_co_occurred_taxa: number;
}

