import {CuratedProject, ResType, StatsProjects} from "@api/data/curatedProjects/types";
import {Ref} from "vue";
import {ReactiveVariable} from "vue/macros";
import {post} from "@utils/http/axios";

enum URL {
    default='/get_all_curated_projects/'
}

export const getAllCuratedProjects = async (stats: ReactiveVariable<StatsProjects>, curatedProjects: Ref<CuratedProject[]>, callback: () => void) => {
    const res = await post<ResType>({ url: URL.default })
    Object.assign(stats, res.stats_projects)
    curatedProjects.value = res.allcuratedprojects
    callback()
}
