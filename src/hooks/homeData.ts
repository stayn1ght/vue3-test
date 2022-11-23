import {reactive} from "vue";
import {getHomeStates} from "/@/api";
import {InfoData} from "/@/api/types";

const infoData: InfoData = reactive({})

const phenotype = reactive({})
export default function useHomeData() {
    const getHomeData = () => {
        getHomeStates().then(res => {
            const { stats, stats_markers, disease2term } = res
            Object.assign(infoData, {
                samples: stats.all_runs_count,
                projects: stats.project_count_with_valid_phenotype_data,
                phenotypes: stats.pheonotype_count,
                taxon: stats_markers.marker_taxa_count,
                species: stats_markers.marker_species_count,
                genera: stats_markers.marker_genus_count,
                curatedProjects: stats_markers.projects,
                comparisons: stats_markers.phenotype_pairs,
            })
            Object.assign(phenotype, disease2term)
        })
    }

    return {
        infoData,
        phenotype,
        getHomeData
    }
}
