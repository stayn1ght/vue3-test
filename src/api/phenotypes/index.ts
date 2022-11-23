import { post } from '@utils/http/axios'
import { Ref } from 'vue'
import { Phenotype } from '@api/phenotypes/types'

enum URL {
  allPhenotypes = '/get_all_phenotypes/'
}

export const getAllPhenotypes = async (
  phenotypes: Ref<Phenotype[] | undefined>,
  callback: () => void
) => {
  const res = await post({ url: URL.allPhenotypes })
  phenotypes.value = res.phenotypes.map((item: Phenotype) => {
    item.all_samples = (item[1] as number).toLocaleString()
    item.processed_runs = (item[2] as number).toLocaleString()
    item.valid_runs = (item[3] as number).toLocaleString()
    item.failed_runs = (item[4] as number).toLocaleString()
    item.nr_species = (item[5] as number).toLocaleString()
    item.nr_genus = (item[6] as number).toLocaleString()
    return item
  })
  phenotypes?.value?.sort((a: Phenotype, b: Phenotype) => {
    // @ts-ignore
    return b[1] - a[1]
  })
  callback()
}
