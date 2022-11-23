import 'reflect-metadata'
// @ts-ignore
import { Type } from 'class-transformer'

export default class Res {
  @Type(() => Species)
  public all_species?: Species[]
  @Type(() => Genus)
  public all_genus?: Genus[]
  @Type(() => Metadata)
  public metadata?: Metadata
}

export class Metadata {
  public loaded_samples?: number
  public all_species_count?: number
  public retrieved_species_count?: number
  public all_genus_count?: number
  public retrieved_genus_count?: number
}

export class Species {
  public ncbi_taxon_id?: number
  public presented_samples?: number
  public nr_phenotypes?: number
  public pct_of_all_samples?: number
  public name?: string
  public dblinks?: string
  public ismarker?: number
  public children?: any[]
  public totalData?: any[]
  public total?: number
  public limit?: number
  public page?: number
  public expand?: boolean
  public loading?: boolean
}

export class Genus {
  public ncbi_taxon_id?: number
  public presented_samples?: number
  public nr_phenotypes?: number
  public pct_of_all_samples?: number
  public name?: string
  public dblinks?: string
  public children?: any[]
  public totalData?: any[]
  public total?: number
  public limit?: number
  public page?: number
  public expand?: boolean
  public loading?: boolean
}
