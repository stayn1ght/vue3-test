export interface CuratedProject {
	phenotype: string;
	samples_cnt: number;
	project_id: string;
	term: string;
}

export interface StatsMarkers {
	marker_genus_count: number;
	retrieved_species_count: number;
	projects: number;
	marker_taxa_count: number;
	phenotype_pairs: number;
	marker_species_count: number;
}

export interface StatsProjects {
	samples_cnt?: number;
	projects_cnt?: number;
	phenotypes_cnt?: number;
}

export interface ResType {
	allcuratedprojects: Array<CuratedProject>;
	stats_markers: StatsMarkers;
	stats_projects: StatsProjects;
}

