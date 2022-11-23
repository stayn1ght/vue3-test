import { post } from '@utils/http/axios'
import {
  Details_of_a_marker_species,
  Marker_stats,
  Phenotypes_associated_with_taxon,
  Res,
  Taxon
} from '@api/species/detail/type'
import { Ref } from 'vue'
import { ReactiveVariable } from 'vue/macros'

enum URL {
  speciesDetail = '/getDetailsOfASpeciesByNcbiTaxonID/'
}

export const getAllSpecies = async (
  ncbi_taxon_id: string,
  taxon: ReactiveVariable<Taxon>,
  markerStats: ReactiveVariable<Marker_stats>,
  phenotypes: Ref<Phenotypes_associated_with_taxon[]>,
  orderedPhenotypes: Ref<Phenotypes_associated_with_taxon[]>,
  phenotypeBarPlotData: Ref<any[]>,
  phenotypeBarPlotLayout: ReactiveVariable<any>,
  plotData: Ref<any[]>,
  plotDataLayout: ReactiveVariable<any>,
  boxPlotData: Ref<any[]>,
  boxPlotLayout: ReactiveVariable<any>,
  species: Ref<Details_of_a_marker_species[]>,
  d3Data: ReactiveVariable<any>,
  callback1: () => void,
  callback2: () => void
) => {
  const res = await post<Res>({ url: URL.speciesDetail, data: { ncbi_taxon_id } })
  Object.assign(taxon, res.taxon)
  Object.assign(markerStats, res.marker_stats)
  phenotypes.value = res.phenotypes_associated_with_taxon.sort((a, b) => b.samples - a.samples)
  markerStats.total_phenotypes = phenotypes.value.length
  markerStats.total_presented_samples = res.phenotypes_associated_with_taxon
    .map((item) => item.samples)
    .reduce((pre, cur) => pre + cur, 0)
  markerStats.total_loaded_samples = res.phenotypes_associated_with_taxon
    .map((item) => item.valid_runs)
    .reduce((pre, cur) => pre + cur, 0)
  callback1()
  orderedPhenotypes.value = res.phenotypes_associated_with_taxon.sort(
    (a, b) => a.pct_samples - b.pct_samples
  )
  phenotypeBarPlotData.value = getPhenotypBarPlotData(orderedPhenotypes.value)
  phenotypeBarPlotLayout.height = 100 + phenotypeBarPlotData.value[0].x.length * 16
  plotData.value = getPlotData(orderedPhenotypes.value, res) as any[]
  plotDataLayout.height = 350 + plotData.value.length * 10
  boxPlotData.value = getBoxPlotData(orderedPhenotypes.value, res) as any[]
  boxPlotLayout.height = 100 + plotData.value.length * 23
  species.value = res.details_of_a_marker_species.sort((a, b) =>
    a.phenotype1 > b.phenotype1 ? 1 : -1
  )
  callback2()
  Object.assign(d3Data.data, getD3Data(res))
}

const getPhenotypBarPlotData = (phenotypes: Phenotypes_associated_with_taxon[]) => {
  const barplot_x = [],
    barplot_y = [],
    barplot_text = []
  for (let pheno_idx = 0; pheno_idx < phenotypes.length; pheno_idx++) {
    const pheno_row = phenotypes[pheno_idx]
    const term = pheno_row.term
    if (pheno_row.valid_runs >= 50) {
      const pct = Math.round((pheno_row.pct_samples + Number.EPSILON) * 10) / 10
      barplot_x.push(pct)
      barplot_y.push(term)
      barplot_text.push(pct + '% (' + pheno_row.samples + '/' + pheno_row.valid_runs + ')')
    }
  }
  const trace = {
    type: 'bar',
    x: barplot_x,
    y: barplot_y,
    text: barplot_text,
    textposition: 'outside',
    cliponaxis: false,
    orientation: 'h',
    marker: {
      width: 0.5,
      color: [] as string[]
    }
  }
  trace.marker.color = trace.y.map((y) => {
    return y === 'Health' ? 'lightgreen' : '#2196f3'
  })
  const res = [trace]

  return res
}

const getPlotData = (phenotypes: Phenotypes_associated_with_taxon[], res: Res) => {
  const ret = []
  for (let pheno_idx = 0; pheno_idx < phenotypes.length; pheno_idx++) {
    const pheno_row = phenotypes[pheno_idx]
    const disease = pheno_row.disease
    const term = pheno_row.term
    if ('density_data_groupped' in res && disease in res.density_data_groupped) {
      const plotdata1 = {
        x: [] as number[],
        y: [] as number[],
        text: [] as string[],
        mode: 'lines+markers'
      }

      // @ts-ignore
      const densitydata = res.density_data_groupped[disease]
      for (let i = 0; i < densitydata.length; i++) {
        const row = densitydata[i]
        plotdata1.x.push(row.mids)
        plotdata1.y.push(row.pct)
        plotdata1.text.push(
          term +
            '; samples: ' +
            row.counts +
            '; cumsum samples: ' +
            row.cumsum +
            '; cumsum pct: ' +
            row.cumpct +
            '%'
        )
      }

      // add name and other attributes ...
      for (
        let idx_phenotypes = 0;
        idx_phenotypes < res.phenotypes_associated_with_taxon.length;
        idx_phenotypes++
      ) {
        const row = res.phenotypes_associated_with_taxon[idx_phenotypes]
        if (row.disease === disease) {
          // @ts-ignore
          plotdata1.name = row.term
          // @ts-ignore
          plotdata1.line = {
            shape: 'spline'
          }
          if (disease === 'D006262') {
            // @ts-ignore
            plotdata1.line.color = 'darkgreen'
          }
        }
      }

      // at the end, add data ...
      ret.push(plotdata1)
    }
  }
  return ret
}

const getBoxPlotData = (phenotypes: Phenotypes_associated_with_taxon[], res: Res) => {
  const ret = []
  for (let pheno_idx = 0; pheno_idx < phenotypes.length; pheno_idx++) {
    const pheno_row = phenotypes[pheno_idx]
    const disease = pheno_row.disease
    if (disease in res.boxplot_data_groupped) {
      const reformatted_abundance_data = []
      // @ts-ignore
      const abundance_data = res.boxplot_data_groupped[disease]
      for (let i = 0; i < abundance_data.length; i++) {
        reformatted_abundance_data.push(abundance_data[i].relative_abundance)
      }

      // a minimal length of data is required ...
      if (reformatted_abundance_data.length >= 20) {
        // assemble boxplot data
        const boxplotdata1 = {
          x: reformatted_abundance_data,
          type: 'box',
          orientation: 'h',
          boxpoints: true
        }

        // add name and other attributes ...
        for (let i = 0; i < res.phenotypes_associated_with_taxon.length; i++) {
          const current_row = res.phenotypes_associated_with_taxon[i]
          if (current_row.disease === disease) {
            // @ts-ignore
            boxplotdata1.name = current_row.term
            if (disease === 'D006262') {
              // @ts-ignore
              boxplotdata1.marker = {
                color: 'darkgreen'
              }
            }
          }
        }
        ret.push(boxplotdata1)
        // at the end, add data ...
      } // <<<< end of IF LENGTH >= 20 ..
    } // if disease in BOXPLOT --
  }
  return ret
}

const getD3Data = (res: Res) => {
  const d3data = {}
  for (let idx_marker = 0; idx_marker < res.details_of_a_marker_species.length; idx_marker++) {
    const tmpdat = res.details_of_a_marker_species[idx_marker]

    // get phenotype combinations --
    const phenotype_combinations = tmpdat.phenotype1 + '_' + tmpdat.phenotype2
    if (!(phenotype_combinations in d3data)) {
      // @ts-ignore
      d3data[phenotype_combinations] = {
        acc1: tmpdat.phenotype1,
        term1: tmpdat.phenotype1_term,
        acc2: tmpdat.phenotype2,
        term2: tmpdat.phenotype2_term,
        members: []
      }
    }

    // @ts-ignore
    d3data[phenotype_combinations].members.push({
      id: tmpdat.project_id,
      lda: tmpdat.LDA,
      marker_type: 'by_project',
      datatype: tmpdat.experiment_type // added on Sep 27, 2021 ...
    })
  }
  return d3data
}
