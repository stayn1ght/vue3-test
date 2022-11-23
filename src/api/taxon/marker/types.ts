import "reflect-metadata";
// @ts-ignore
import {Type} from "class-transformer";

export default class res {
  @Type(() =>MarkerSpecies)
  public marker_species?: MarkerSpecies[];
  @Type(() =>Metadata)
  public metadata?: Metadata;
}

export class Metadata {
  public marker_species_count?: number;
  public marker_genus_count?: number;
  public marker_taxa_count?: number;
  public retrieved_species_count?: number;
  public projects?: number;
  public phenotype_pairs?: number;
}

export class MarkerSpecies {
  public ncbi_taxon_id?: number;
  public taxon_rank_level?: string;
  public num_comparisons?: number;
  public scientific_name?: string;
  public projects?: number;
  public phenotype_combinations?: number;
  public dblinks?: string;
  public children?: any[];
  public totalData?: any[];
  public page?: number;
  public total?: number;
  public limit?: number;
  public expand?: boolean;
  public loading?: boolean
}
