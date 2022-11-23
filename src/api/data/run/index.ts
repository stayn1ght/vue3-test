import { post } from '@utils/http/axios'
import { Res, ResPhenotypes, ResRun } from '@api/data/run/types'
import { Ref } from 'vue'
import { ReactiveVariable } from 'vue/macros'

enum URL {
  detail = '/getRunDetailsByRunID/',
  content = '/getRelativeAbundanceByRunID/'
}

export const getRunDetailsByRunId = async (
  run_id: string,
  phenotypes: Ref<ResPhenotypes[]>,
  stats: ReactiveVariable<ResRun>,
  speciesPie: Ref<any[]>,
  speciesBar: Ref<any[]>,
  genusPie: Ref<any[]>,
  genusBar: Ref<any[]>
) => {
  const res = await post<Res>({ url: URL.detail, data: { run_id } })
  phenotypes.value = res.phenotypes
  Object.assign(stats, res.run)
  setPlotData(res, speciesPie, speciesBar, genusPie, genusBar)
}

export const setPlotData = (
  res: any,
  speciesPie: Ref<any[]>,
  speciesBar: Ref<any[]>,
  genusPie: Ref<any[]>,
  genusBar: Ref<any[]>
) => {
  if (res.species) {
    const trace1 = {
      values: [] as number[],
      labels: [] as string[],
      name: 'Species abundance',
      hoverinfo: 'label+value+name',
      hole: 0.4,
      type: 'pie'
    }

    const trace1_bar = {
      x: [] as number[],
      y: [] as string[],
      orientation: 'h',
      type: 'bar'
    }

    for (let i = 0; i < res.species.length; i++) {
      const dat = res.species[i]
      trace1.values.push(dat.relative_abundance)
      trace1.labels.push(dat.scientific_name)

      trace1_bar.x.push(dat.relative_abundance)
      trace1_bar.y.push(dat.scientific_name)
    }
    speciesPie.value = [trace1]
    speciesBar.value = [trace1_bar]
  }
  if (res.genus) {
    const trace1 = {
      values: [] as number[],
      labels: [] as string[],
      name: 'Genus abundance',
      hoverinfo: 'label+value+name',
      hole: 0.4,
      type: 'pie'
    }

    const trace1_bar = {
      x: [] as number[],
      y: [] as string[],
      orientation: 'h',
      type: 'bar'
    }

    for (let i = 0; i < res.genus.length; i++) {
      const dat = res.genus[i]
      trace1.values.push(dat.relative_abundance)
      trace1.labels.push(dat.scientific_name)

      trace1_bar.x.push(dat.relative_abundance)
      trace1_bar.y.push(dat.scientific_name)
    }
    genusPie.value = [trace1]
    genusBar.value = [trace1_bar]
  }
}

export const getRelativeAbundanceByRunID = (data: any) => post({ url: URL.content, data })
