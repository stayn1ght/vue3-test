export interface Res {
  phenotypes_associated_with_taxon: Phenotypes_associated_with_taxon[]
  taxon: Taxon
  density_data_groupped: Density_data_groupped
  boxplot_data_groupped: Boxplot_data_groupped
  ismarker: number
  details_of_a_marker_species: Details_of_a_marker_species[]
  marker_stats: Marker_stats
}
export interface Phenotypes_associated_with_taxon {
  disease: string
  taxon_rank_level: string
  ncbi_taxon_id: number
  samples: number
  abus_mean: number
  abus_median: number
  abus_sd: number
  all_samples: number
  processed_runs: number
  valid_runs: number
  failed_runs: number
  nr_species: number
  nr_genus: number
  term: string
  note: string
  pct_samples: number
}
export interface Taxon {
  ncbi_taxon_id?: number
  node_rank?: string
  name?: string
}
export interface Density_data_grouppedD006262 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD003093 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD015179 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD001714 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD001327 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD008881 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD013959 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD043183 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD003967 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD003920 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD003248 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD003015 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD008171 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD001289 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD002318 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD000067877 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD007410 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD015212 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD009765 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD006973 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD058246 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD003424 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD050177 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD001321 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD065626 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD010300 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD003924 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD013167 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD000236 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD008103 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD001172 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD015497 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD006678 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD035061 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD000086382 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD012595 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD003108 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD007230 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD008545 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD012778 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD003922 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD014607 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD013274 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD019337 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD000855 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD003550 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD014376 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD016640 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD037841 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD054198 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_grouppedD001943 {
  ncbi_taxon_id: number
  0: number
  taxon_rank_level: string
  1: string
  mids: number
  2: number
  counts: number
  3: number
  pct: number
  4: number
  cumsum: number
  5: number
  cumpct: number
  6: number
}
export interface Density_data_groupped {
  D006262: Density_data_grouppedD006262[]
  D003093: Density_data_grouppedD003093[]
  D015179: Density_data_grouppedD015179[]
  D001714: Density_data_grouppedD001714[]
  D001327: Density_data_grouppedD001327[]
  D008881: Density_data_grouppedD008881[]
  D013959: Density_data_grouppedD013959[]
  D043183: Density_data_grouppedD043183[]
  D003967: Density_data_grouppedD003967[]
  D003920: Density_data_grouppedD003920[]
  D003248: Density_data_grouppedD003248[]
  D003015: Density_data_grouppedD003015[]
  D008171: Density_data_grouppedD008171[]
  D001289: Density_data_grouppedD001289[]
  D002318: Density_data_grouppedD002318[]
  D000067877: Density_data_grouppedD000067877[]
  D007410: Density_data_grouppedD007410[]
  D015212: Density_data_grouppedD015212[]
  D009765: Density_data_grouppedD009765[]
  D006973: Density_data_grouppedD006973[]
  D058246: Density_data_grouppedD058246[]
  D003424: Density_data_grouppedD003424[]
  D050177: Density_data_grouppedD050177[]
  D001321: Density_data_grouppedD001321[]
  D065626: Density_data_grouppedD065626[]
  D010300: Density_data_grouppedD010300[]
  D003924: Density_data_grouppedD003924[]
  D013167: Density_data_grouppedD013167[]
  D000236: Density_data_grouppedD000236[]
  D008103: Density_data_grouppedD008103[]
  D001172: Density_data_grouppedD001172[]
  D015497: Density_data_grouppedD015497[]
  D006678: Density_data_grouppedD006678[]
  D035061: Density_data_grouppedD035061[]
  D000086382: Density_data_grouppedD000086382[]
  D012595: Density_data_grouppedD012595[]
  D003108: Density_data_grouppedD003108[]
  D007230: Density_data_grouppedD007230[]
  D008545: Density_data_grouppedD008545[]
  D012778: Density_data_grouppedD012778[]
  D003922: Density_data_grouppedD003922[]
  D014607: Density_data_grouppedD014607[]
  D013274: Density_data_grouppedD013274[]
  D019337: Density_data_grouppedD019337[]
  D000855: Density_data_grouppedD000855[]
  D003550: Density_data_grouppedD003550[]
  D014376: Density_data_grouppedD014376[]
  D016640: Density_data_grouppedD016640[]
  D037841: Density_data_grouppedD037841[]
  D054198: Density_data_grouppedD054198[]
  D001943: Density_data_grouppedD001943[]
}
export interface Boxplot_data_grouppedD000067011 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD000067877 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD000077733 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD000086382 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD000236 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD000544 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD000755 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD000855 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD001172 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD001289 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD001321 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD001327 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD001528 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD001714 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD001943 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD002277 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD002318 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD002446 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD003015 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD003093 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD003108 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD003248 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD003424 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD003550 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD003863 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD003920 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD003922 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD003924 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD003967 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD004485 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD004827 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD005764 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD005891 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD006111 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD006262 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD006678 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD006973 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD007230 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD007234 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD007410 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD007674 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD008103 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD008107 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD008171 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD008545 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD008881 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD009765 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD009767 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD010300 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD010661 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD011014 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD011236 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD011565 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD012559 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD012595 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD012778 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD013167 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD013274 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD013851 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD013959 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD014376 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD014607 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD015179 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD015209 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD015212 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD015497 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD015518 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD016360 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD016640 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD019337 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD020187 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD020345 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD024821 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD025241 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD035061 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD037841 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD043183 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD050031 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD050177 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD050197 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD054198 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD054323 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD055113 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD058246 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_grouppedD065626 {
  run_id: string
  0: string
  relative_abundance: number
  1: number
}
export interface Boxplot_data_groupped {
  D000067011: Boxplot_data_grouppedD000067011[]
  D000067877: Boxplot_data_grouppedD000067877[]
  D000077733: Boxplot_data_grouppedD000077733[]
  D000086382: Boxplot_data_grouppedD000086382[]
  D000236: Boxplot_data_grouppedD000236[]
  D000544: Boxplot_data_grouppedD000544[]
  D000755: Boxplot_data_grouppedD000755[]
  D000855: Boxplot_data_grouppedD000855[]
  D001172: Boxplot_data_grouppedD001172[]
  D001289: Boxplot_data_grouppedD001289[]
  D001321: Boxplot_data_grouppedD001321[]
  D001327: Boxplot_data_grouppedD001327[]
  D001528: Boxplot_data_grouppedD001528[]
  D001714: Boxplot_data_grouppedD001714[]
  D001943: Boxplot_data_grouppedD001943[]
  D002277: Boxplot_data_grouppedD002277[]
  D002318: Boxplot_data_grouppedD002318[]
  D002446: Boxplot_data_grouppedD002446[]
  D003015: Boxplot_data_grouppedD003015[]
  D003093: Boxplot_data_grouppedD003093[]
  D003108: Boxplot_data_grouppedD003108[]
  D003248: Boxplot_data_grouppedD003248[]
  D003424: Boxplot_data_grouppedD003424[]
  D003550: Boxplot_data_grouppedD003550[]
  D003863: Boxplot_data_grouppedD003863[]
  D003920: Boxplot_data_grouppedD003920[]
  D003922: Boxplot_data_grouppedD003922[]
  D003924: Boxplot_data_grouppedD003924[]
  D003967: Boxplot_data_grouppedD003967[]
  D004485: Boxplot_data_grouppedD004485[]
  D004827: Boxplot_data_grouppedD004827[]
  D005764: Boxplot_data_grouppedD005764[]
  D005891: Boxplot_data_grouppedD005891[]
  D006111: Boxplot_data_grouppedD006111[]
  D006262: Boxplot_data_grouppedD006262[]
  D006678: Boxplot_data_grouppedD006678[]
  D006973: Boxplot_data_grouppedD006973[]
  D007230: Boxplot_data_grouppedD007230[]
  D007234: Boxplot_data_grouppedD007234[]
  D007410: Boxplot_data_grouppedD007410[]
  D007674: Boxplot_data_grouppedD007674[]
  D008103: Boxplot_data_grouppedD008103[]
  D008107: Boxplot_data_grouppedD008107[]
  D008171: Boxplot_data_grouppedD008171[]
  D008545: Boxplot_data_grouppedD008545[]
  D008881: Boxplot_data_grouppedD008881[]
  D009765: Boxplot_data_grouppedD009765[]
  D009767: Boxplot_data_grouppedD009767[]
  D010300: Boxplot_data_grouppedD010300[]
  D010661: Boxplot_data_grouppedD010661[]
  D011014: Boxplot_data_grouppedD011014[]
  D011236: Boxplot_data_grouppedD011236[]
  D011565: Boxplot_data_grouppedD011565[]
  D012559: Boxplot_data_grouppedD012559[]
  D012595: Boxplot_data_grouppedD012595[]
  D012778: Boxplot_data_grouppedD012778[]
  D013167: Boxplot_data_grouppedD013167[]
  D013274: Boxplot_data_grouppedD013274[]
  D013851: Boxplot_data_grouppedD013851[]
  D013959: Boxplot_data_grouppedD013959[]
  D014376: Boxplot_data_grouppedD014376[]
  D014607: Boxplot_data_grouppedD014607[]
  D015179: Boxplot_data_grouppedD015179[]
  D015209: Boxplot_data_grouppedD015209[]
  D015212: Boxplot_data_grouppedD015212[]
  D015497: Boxplot_data_grouppedD015497[]
  D015518: Boxplot_data_grouppedD015518[]
  D016360: Boxplot_data_grouppedD016360[]
  D016640: Boxplot_data_grouppedD016640[]
  D019337: Boxplot_data_grouppedD019337[]
  D020187: Boxplot_data_grouppedD020187[]
  D020345: Boxplot_data_grouppedD020345[]
  D024821: Boxplot_data_grouppedD024821[]
  D025241: Boxplot_data_grouppedD025241[]
  D035061: Boxplot_data_grouppedD035061[]
  D037841: Boxplot_data_grouppedD037841[]
  D043183: Boxplot_data_grouppedD043183[]
  D050031: Boxplot_data_grouppedD050031[]
  D050177: Boxplot_data_grouppedD050177[]
  D050197: Boxplot_data_grouppedD050197[]
  D054198: Boxplot_data_grouppedD054198[]
  D054323: Boxplot_data_grouppedD054323[]
  D055113: Boxplot_data_grouppedD055113[]
  D058246: Boxplot_data_grouppedD058246[]
  D065626: Boxplot_data_grouppedD065626[]
}
export interface Details_of_a_marker_species {
  project_id: string
  phenotype1: string
  phenotype2: string
  ncbi_taxon_id: number
  taxon_rank_level: string
  comparison_result: string
  lda: number
  p_value: number
  LDA_new: number
  phenotype1_term: string
  phenotype2_term: string
  LDA: number
  experiment_type: string
}
export interface Marker_stats {
  projects?: number
  phenotypes?: number
  entries?: number
  total_presented_samples?: number
  total_phenotypes?: number
  total_loaded_samples?: number
}
