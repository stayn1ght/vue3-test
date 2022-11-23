import "reflect-metadata";
// @ts-ignore
import {Type} from "class-transformer";

export default class ProjectsRes {
  @Type(() =>Project)
  public ALLPROJECTS?: Project[];
  @Type(() =>Stats)
  public stats?: Stats;
  @Type(() =>Disease2term)
  public disease2term?: Disease2term;
  @Type(() =>Allrunsbyexperimenttype)
  public allrunsbyexperimenttype?: Allrunsbyexperimenttype[];
}

export class Stats {
  public total_projects?: number;
  public project_count_with_valid_phenotype_data?: number;
  public project_count_with_invalid_phenotype_data?: number;
  public run_count_without_valid_phenotype_data?: number;
  public sample_count_without_valid_phenotype_data?: number;
  public all_runs_count?: number;
  public loaded_projects_count?: number;
  public loaded_runs_count?: number;
  public processed_project_count?: number;
  public processed_runs_count?: number;
  public failed_project_count?: number;
  public failed_runs_count?: number;
  public pheonotype_count?: number;
  public all_species_count?: number;
  public all_genus_count?: number;
}

export class Disease2term {
  public C537163?: string;
  public D000066891?: string;
  public D000067011?: string;
  public D000067877?: string;
  public D000069279?: string;
  public D000077192?: string;
  public D000077733?: string;
  public D000086382?: string;
  public D000236?: string;
  public D000437?: string;
  public D000544?: string;
  public D000755?: string;
  public D000855?: string;
  public D000856?: string;
  public D001007?: string;
  public D001171?: string;
  public D001172?: string;
  public D001249?: string;
  public D001289?: string;
  public D001321?: string;
  public D001327?: string;
  public D001528?: string;
  public D001714?: string;
  public D001924?: string;
  public D001943?: string;
  public D002277?: string;
  public D002318?: string;
  public D002446?: string;
  public D002763?: string;
  public D002769?: string;
  public D003015?: string;
  public D003093?: string;
  public D003108?: string;
  public D003110?: string;
  public D003111?: string;
  public D003248?: string;
  public D003324?: string;
  public D003424?: string;
  public D003550?: string;
  public D003863?: string;
  public D003876?: string;
  public D003920?: string;
  public D003922?: string;
  public D003924?: string;
  public D003967?: string;
  public D004485?: string;
  public D004827?: string;
  public D005756?: string;
  public D005764?: string;
  public D005891?: string;
  public D006086?: string;
  public D006111?: string;
  public D006130?: string;
  public D006262?: string;
  public D006515?: string;
  public D006519?: string;
  public D006678?: string;
  public D006973?: string;
  public D007230?: string;
  public D007234?: string;
  public D007410?: string;
  public D007674?: string;
  public D007676?: string;
  public D008103?: string;
  public D008104?: string;
  public D008107?: string;
  public D008108?: string;
  public D008171?: string;
  public D008545?: string;
  public D008881?: string;
  public D009103?: string;
  public D009471?: string;
  public D009765?: string;
  public D009767?: string;
  public D010051?: string;
  public D010190?: string;
  public D010300?: string;
  public D010661?: string;
  public D011014?: string;
  public D011236?: string;
  public D011471?: string;
  public D011565?: string;
  public D012004?: string;
  public D012400?: string;
  public D012559?: string;
  public D012595?: string;
  public D012778?: string;
  public D013167?: string;
  public D013274?: string;
  public D013851?: string;
  public D013959?: string;
  public D013964?: string;
  public D014376?: string;
  public D014607?: string;
  public D015179?: string;
  public D015209?: string;
  public D015212?: string;
  public D015464?: string;
  public D015497?: string;
  public D015518?: string;
  public D015658?: string;
  public D015673?: string;
  public D016360?: string;
  public D016480?: string;
  public D016640?: string;
  public D016776?: string;
  public D016918?: string;
  public D018256?: string;
  public D019337?: string;
  public D020187?: string;
  public D020345?: string;
  public D020528?: string;
  public D020529?: string;
  public D024821?: string;
  public D025241?: string;
  public D035061?: string;
  public D037841?: string;
  public D042882?: string;
  public D043183?: string;
  public D044342?: string;
  public D050031?: string;
  public D050177?: string;
  public D050197?: string;
  public D054198?: string;
  public D054323?: string;
  public D055113?: string;
  public D055752?: string;
  public D056865?: string;
  public D058246?: string;
  public D060825?: string;
  public D065290?: string;
  public D065626?: string;
}

export class Project {
  public project_id?: string;
  public Original_Project_description?: string;
  public Related_Publications?: number;
  public Curated_Project_description?: any;
  public has_it_been_collected?: string;
  public Number_of_runs?: number;
  public Number_of_samples?: number;
  public samples_per_project?: number;
  public loaded_samples?: number;
  public diseases?: string;
  public valid_runs?: number;
  public failed_runs?: number;
}

export class Allrunsbyexperimenttype {
  public experiment_type?: string;
  public 0?: string;
  public all_runs_count?: number;
  public 1?: number;
}
