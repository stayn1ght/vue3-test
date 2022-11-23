export type QueryResult = ResultItem[];
export interface ResultItem {
	formatted_string: string;
	0: string;
	url: string;
	1: string;
}

export interface InfoData {
	samples?: number
	projects?: number
	phenotypes?: number
	taxon?: number
	species?: number
	genera?: number
	curatedProjects?: number
	comparisons?: number
}
