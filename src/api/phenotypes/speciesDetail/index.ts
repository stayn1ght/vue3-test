import { post } from '@utils/http/axios'
import {
  AbundanceAndMetaData,
  CoOccurredTaxa,
  Res,
  Stats
} from '@api/phenotypes/speciesDetail/types'
import { Ref } from 'vue'
import { ReactiveVariable } from 'vue/macros'

enum URL {
  info = '/getMicrobeAbundancesByPhenotypeMeshIDAndNCBITaxonID/',
  getAbundances = '/getAbundancesOfMicrobesByPhenotypeMeshIDAndNCBITaxonIDs/',
  getAssociatedUniqueRunID = '/getdownloadAssociatedUniqueRunIDsByPhenotypeMeshIDAndNCBITaxonIDs/',
  getAbundancesOfMicrobes = '/getAbundancesOfCooccurringMicrobesByPhenotypeMeshIDAndNCBITaxonIDs/'
}

export const getAllMicrobeAbundances = async (
  mesh_id: string,
  ncbi_taxon_id: string,
  stats: ReactiveVariable<Stats>,
  abundances: Ref<AbundanceAndMetaData[]>,
  taxa: Ref<CoOccurredTaxa[]>,
  plotData: Ref<any[]>,
  boxplotData: Ref<any[]>,
  callback1: () => void,
  callback2: () => void
) => {
  const data = await post<Res>({ url: URL.info, data: { mesh_id, ncbi_taxon_id } })
  const total_loaded_samples = data.abundant_data_for_disease?.length || 0
  Object.assign(stats, data.disease, data.taxon, {
    total_loaded_samples,
    pct_of_loaded_samples: (total_loaded_samples / data.disease.valid_runs) * 100,
    densityPlotData: true,
    boxplotGood: true
  })
  abundances.value = data.abundance_and_meta_data.sort(
    (a, b) => b.relative_abundance - a.relative_abundance
  )
  taxa.value = data.co_occurred_taxa.sort((a, b) => b.odds_ratio - a.odds_ratio)
  if (data.phenotype_hist_data_obtained) {
    const plotdata = []
    const plotData1 = {
      x: [] as number[],
      y: [] as number[],
      text: [] as string[],
      mode: 'lines+markers'
    } as any
    for (let i = 0; i < data.hist_data_for_phenotype.length; i++) {
      const row = data.hist_data_for_phenotype[i]
      plotData1.x.push(row.x)
      plotData1.y.push(row.y)
      plotData1.text.push(
        'samples: ' +
          row.counts +
          '; cumsum samples: ' +
          row.cumsum +
          '; cumsum pct: ' +
          row.cumpct +
          '%'
      )
    }

    if (mesh_id === 'D006262') {
      plotData1.name = 'Health'
      plotData1.line = {
        color: 'darkgreen',
        shape: 'spline'
      }
    } else {
      plotData1.name = 'Disease'
      plotData1.line = {
        color: 'darkred',
        shape: 'spline'
      }
    }
    plotdata.push(plotData1)

    if (data.health_phenotype_hist_data_obtained) {
      const plotData2 = {
        x: [] as number[],
        y: [] as number[],
        text: [] as string[],
        name: 'Health',
        line: {
          color: 'darkgreen',
          shape: 'spline'
        },
        mode: 'lines+markers'
      }
      for (let i = 0; i < data.hist_data_for_health.length; i++) {
        const row = data.hist_data_for_health[i] as any
        plotData2.x.push(row.x)
        plotData2.y.push(row.y)
        plotData2.text.push(
          'samples: ' +
            row.counts +
            '; cumsum samples: ' +
            row.cumsum +
            '; cumsum pct: ' +
            row.cumpct +
            '%'
        )
      }

      plotdata.push(plotData2)
    }

    plotData.value = plotdata
  } else {
    // if not there ...
    stats.densityPlotData = false
  }
  if (data.abundant_data_for_disease && data.abundant_data_for_disease.length >= 20) {
    const boxplotdata = []
    const boxplotData1 = {
      x: data.abundant_data_for_disease,
      type: 'box',
      orientation: 'h',
      boxpoints: true
    } as any
    if (mesh_id === 'D006262') {
      boxplotData1.name = 'Health'
      boxplotData1.marker = {
        color: 'darkgreen'
      }
    } else {
      boxplotData1.name = 'Disease'
      boxplotData1.marker = {
        color: 'darkred'
      }
    }
    boxplotdata.push(boxplotData1)

    if (data.abundant_data_for_health) {
      const boxplotData2 = {
        x: data.abundant_data_for_health,
        type: 'box',
        name: 'Health',
        marker: {
          color: 'darkgreen'
        },
        orientation: 'h',
        boxpoints: true
      }
      boxplotdata.push(boxplotData2)
    }

    boxplotData.value = boxplotdata
  } else {
    stats.boxplotGood = false
  }
  callback1()
  callback2()
}

export const downloadAbundanceByMeshIDAndTaxonID = (mesh_id: string, ncbi_taxon_id: string) =>
  post({ url: URL.getAbundances, data: { mesh_id, ncbi_taxon_id } })

export const downloadAssociatedUniqueRunID = (mesh_id: string, ncbi_taxon_id: string) =>
  post({ url: URL.getAssociatedUniqueRunID, data: { mesh_id, ncbi_taxon_id } })

export const downloadAbundancesByTaxaAndDiseaseId = (
  mesh_id: string,
  taxon1: number,
  taxon2: number
) => post({ url: URL.getAbundancesOfMicrobes, data: { mesh_id, taxon1, taxon2 } })
