import {
  ConfigQuestionType,
  PostVisualizationObjectType,
  ProjectDataType,
  ProjectFiles,
  // Question,
  QuestionBanner,
  data_banner_plan_item_response,
  postTabulationObject,
} from '@/types/project-data.type'
import { BaseService } from './base.service'
import api1 from './apis/api1'
import { data_banner_plan_item } from '@/components/dynamic-create-banner-planner/dynamic-create-banner-planner.type'

class ProjectDataService extends BaseService {
  Projects = 'projects'
  Surveys = 'surveys'
  jobs = 'jobs'
  dataBanner = 'data/banner-planner'

  async postDataJob(projectId: number, obj: ProjectDataType): Promise<ProjectDataType> {
    try {
      const { data } = await api1.post(`${this.Projects}/${projectId}/${this.jobs}`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async refreshDataRequest(projectId: number): Promise<ProjectDataType> {
    try {
      const { data } = await api1.patch(`${this.Projects}/${projectId}/data/refresh`, {})
      return data
    } catch (error) {
      throw error
    }
  }

  async GetAllDataJob(projectId: number): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.jobs}`)
      return data
    } catch (error) {
      throw error
    }
  }

  async GetDataJobByProjectId(projectId: number, job_id: number): Promise<ProjectDataType> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.jobs}/${job_id}`)
      return data
    } catch (error) {
      throw error
    }
  }

  async postProjectAttachments(formData: any, onUploadProgress: any): Promise<any> {
    try {
      const data = await api1.upload(`attachments`, formData, onUploadProgress)
      return data
    } catch (error) {
      throw error
    }
  }

  async GetAllDataJobQuestions(projectId: number): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/list/questions`)
      return data
    } catch (error) {
      throw error
    }
  }

  async GetAllDataSummaryCards(projectId: number, surveyId: number): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/jobs/summary-card`)
      return data
    } catch (error) {
      throw error
    }
  }

  async GetAllTableData(projectId: number, surveyId: number): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/jobs/data`)
      return data
    } catch (error) {
      throw error
    }
  }

  async postProjectTableXlxs(projectId: number, surveyId: number, formData: any, onUploadProgress: any): Promise<any> {
    try {
      const data = await api1.upload(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-validation/update`, formData, onUploadProgress)
      return data
    } catch (error) {
      throw error
    }
  }

  async PostReconciles(
    projectId: number,
    surveyId: number,
    // obj: any,
  ): Promise<ProjectDataType> {
    try {
      const { data } = await api1.post(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-validation/reconciles`, {})
      return data
    } catch (error) {
      throw error
    }
  }

  async ConfirmReconciles(projectId: number, surveyId: number, runId: string): Promise<ProjectDataType> {
    try {
      const data = await api1.post(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/reconciliation/${runId}/confirm`, {})
      return data
    } catch (error) {
      throw error
    }
  }

  async InitReconcilation(
    projectId: number,
    surveyId: number,
    // obj: any,
  ): Promise<ProjectDataType> {
    try {
      const { data } = await api1.post(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/reconciliation`, {})
      return data
    } catch (error) {
      throw error
    }
  }

  async postProjectFiles(project_id: number, surveyId: number, formData: any, onUploadProgress: any): Promise<any> {
    try {
      const data = await api1.upload(`${this.Projects}/${project_id}/${this.Surveys}/${surveyId}/f-uploader`, formData, onUploadProgress)
      return data
    } catch (error) {
      throw error
    }
  }

  // tabulation

  // new get published tabulation api
  async GetPublsihedTabulation(projectId: number, surveyId: number, pipelineId: number, runId: number): Promise<any> {
    try {
      const { data } = await api1.get(
        `${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/pipelines/${pipelineId}/runs/${runId}/tabulation-file-outputs`,
      )
      return data
    } catch (error) {
      throw error
    }
  }

  async GetAllTabulation(projectId: number, surveyId: number): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-tabulation`)
      return data
    } catch (error) {
      throw error
    }
  }

  async GetTabulationByProjectId(projectId: number, surveyId: number, object_uid: string): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-tabulation/${object_uid}`)
      return data
    } catch (error) {
      throw error
    }
  }
  async DownloadTabulationByProjectId(projectId: number, surveyId: number, object_uid: string): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-tabulation/${object_uid}/download`)
      return data
    } catch (error) {
      throw error
    }
  }

  async postDataTabulation(projectId: number, surveyId: number, object: postTabulationObject): Promise<any> {
    try {
      const { data } = await api1.post(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-tabulation`, object)
      return data
    } catch (error) {
      throw error
    }
  }

  async putDataTabulation(projectId: number, surveyId: number, object: postTabulationObject, object_uid: string): Promise<any> {
    try {
      const { data } = await api1.put(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-tabulation/${object_uid}`, object)
      return data
    } catch (error) {
      throw error
    }
  }

  async TabulationActive(projectId: number, surveyId: number, tabulation_id: number, is_active: boolean): Promise<any> {
    try {
      const { data } = await api1.patch(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/tabulation/${tabulation_id}`, {
        is_active: is_active,
      })
      return data
    } catch (error) {
      throw error
    }
  }

  // Banner
  async postBanner(projectId: number, surveyId: number, obj: data_banner_plan_item): Promise<data_banner_plan_item> {
    try {
      const { data } = await api1.post(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/${this.dataBanner}`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async getALLBanners(projectId: number, surveyId: number): Promise<data_banner_plan_item_response[]> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/${this.dataBanner}`)
      return data
    } catch (error) {
      throw error
    }
  }

  async getALLBannersById(projectId: number, surveyId: number, banner_planner_id: string): Promise<data_banner_plan_item> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/${this.dataBanner}/${banner_planner_id}`)
      return data
    } catch (error) {
      throw error
    }
  }

  async putBanner(projectId: number, surveyId: number, banner_planner_id: string, obj: data_banner_plan_item): Promise<data_banner_plan_item> {
    try {
      const { data } = await api1.put(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/${this.dataBanner}/${banner_planner_id}`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async BannerActive(projectId: number, surveyId: number, tabulation_id: number, is_active: boolean): Promise<any> {
    try {
      const { data } = await api1.patch(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/banner/${tabulation_id}`, { is_active: is_active })
      return data
    } catch (error) {
      throw error
    }
  }

  // async getProjectBannerALLQuestions(projectId: number): Promise<Question[]> {
  //     try {
  //         const { data } = await api1.get(`${this.Projects}/${projectId}/${this.dataBanner}/questions`);
  //         return data;
  //     } catch (error) {
  //         throw error;
  //     }
  // }

  async getProjectBannerALLQuestions(projectId: number, surveyId: number): Promise<QuestionBanner[]> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data/project-questions`)
      return data
    } catch (error) {
      throw error
    }
  }
  // Pipelines

  async postDatapipelines(projectId: number, surveyId: number, object: postTabulationObject): Promise<any> {
    try {
      const { data } = await api1.post(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-pipelines`, object)
      return data
    } catch (error) {
      throw error
    }
  }

  async GetAllPipelines(projectId: number, surveyId: number): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-pipelines`)
      return data
    } catch (error) {
      throw error
    }
  }

  async putDatapipelines(projectId: number, surveyId: number, pipeline_id: number, object: postTabulationObject): Promise<any> {
    try {
      const { data } = await api1.put(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-pipelines/${pipeline_id}`, object)
      return data
    } catch (error) {
      throw error
    }
  }

  async GetAllPipelineById(projectId: number, surveyId: number, pipeline_id: number): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-pipelines/${pipeline_id}`)
      return data
    } catch (error) {
      throw error
    }
  }

  async RunPipeline(projectId: number, surveyId: number, pipelineId: number): Promise<any> {
    try {
      const { data } = await api1.post(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-pipelines/${pipelineId}/runs`, {})
      return data
    } catch (error) {
      throw error
    }
  }

  async GetRunPipeline(projectId: number, surveyId: number, pipelineId: number): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-pipelines/${pipelineId}/runs`)
      return data
    } catch (error) {
      throw error
    }
  }

  async GetRunPipelineDetails(projectId: number, surveyId: number, pipelineId: number, run_id: string): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-pipelines/${pipelineId}/runs/${run_id}`)
      return data
    } catch (error) {
      throw error
    }
  }

  async PublishPipelineDetails(projectId: number, surveyId: number, pipelineId: number, run_id: string): Promise<any> {
    try {
      const { data } = await api1.post(
        `${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-pipelines/${pipelineId}/runs/${run_id}/publish`,
        {
          is_published: true,
        },
      )
      return data
    } catch (error) {
      throw error
    }
  }

  async PipelineCancel(projectId: number, surveyId: number, pipelineId: number, run_id: string): Promise<any> {
    try {
      const { data } = await api1.patch(
        `${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-pipelines/${pipelineId}/runs/${run_id}/cancel`,
        {},
      )
      return data
    } catch (error) {
      throw error
    }
  }

  async PipelinesActive(projectId: number, surveyId: number, pipelineId: number, is_active: boolean): Promise<any> {
    try {
      const { data } = await api1.patch(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-pipelines/${pipelineId}`, {
        is_active: is_active,
      })
      return data
    } catch (error) {
      throw error
    }
  }

  // async get_project_files(
  //     projectId: string | undefined,
  //     file_types: Array<number>
  // ): Promise<ProjectFiles[]> {
  //     try {
  //         let query = "?";
  //         for (let [index, type] of file_types.entries()) {
  //             query = query + `id${index}=${type}`;
  //         }
  //         console.log(query, "queryquery");
  //         const { data } = await api1.get(
  //             `${this.Projects}/${projectId}/files/${query}`
  //         );
  //         return data;
  //     } catch (error) {
  //         throw error;
  //     }
  // }

  async get_project_files(projectId: string | undefined, surveyId: number, file_types: Array<number>): Promise<ProjectFiles[]> {
    try {
      let query = ''
      if (file_types.length > 0) {
        query = '?file_type_ids=' + file_types.join(',')
      }
      console.log(query)
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/files${query}`)
      return data
    } catch (error) {
      throw error
    }
  }

  async getChartsQuestionsById(projectId: number, surveyId: number): Promise<ConfigQuestionType[]> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/schema-data`)
      return data
    } catch (error) {
      throw error
    }
  }

  async UpdateChartsQuestionsById(projectId: number, surveyId: number, payload: any): Promise<ConfigQuestionType[]> {
    try {
      const { data } = await api1.put(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/schema-data`, payload)
      return data
    } catch (error) {
      throw error
    }
  }

  async GetOutPutFileByJobId(projectId: number, surveyId: number, pipelineId: number, runId: number, job_id: number): Promise<any> {
    try {
      const { data } = await api1.get(
        `${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/pipelines/${pipelineId}/runs/${runId}/file-output?jt=${job_id}`,
      )
      return data
    } catch (error) {
      throw error
    }
  }

  async PostDataCustomQualification(projectId: number, surveyId: number, object: ConfigQuestionType[]): Promise<any> {
    try {
      const { data } = await api1.post(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/schema-data/custom-questions`, object)
      return data
    } catch (error) {
      throw error
    }
  }

  // projects/12/surveys/45/data-visualizations
  async PostDataVisualization(projectId: number, surveyId: number, object: PostVisualizationObjectType): Promise<any> {
    try {
      const { data } = await api1.post(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-visualizations`, object)
      return data
    } catch (error) {
      throw error
    }
  }

  async GetAllVisualizations(projectId: number, surveyId: number): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-visualizations`)
      return data
    } catch (error) {
      throw error
    }
  }

  async GetVisualizationById(projectId: number, surveyId: number, visualization_id: number): Promise<any> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-visualizations/${visualization_id}`)
      return data
    } catch (error) {
      throw error
    }
  }

  async PutDataVisualization(projectId: number, surveyId: number, visualization_id: number, object: PostVisualizationObjectType): Promise<any> {
    try {
      const { data } = await api1.put(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-visualizations/${visualization_id}`, object)
      return data
    } catch (error) {
      throw error
    }
  }

  async PostDataVisualizationQuestion(
    projectId: number,
    surveyId: number,
    visualization_id: number,
    object: PostVisualizationObjectType,
  ): Promise<any> {
    try {
      const { data } = await api1.post(
        `${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-visualizations/${visualization_id}/questions`,
        object,
      )
      return data
    } catch (error) {
      throw error
    }
  }

  async DeleteDataVisualizationQuestionIds(projectId: number, surveyId: number, visualization_id: number, object: string[]): Promise<any> {
    try {
      const { data } = await api1.patch(
        `${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/data-visualizations/${visualization_id}/questions`,
        {
          question_ids: object,
        },
      )
      return data
    } catch (error) {
      throw error
    }
  }

  public async getProjectTabulationQuestions(projectId: number, surveyId: number): Promise<QuestionBanner[]> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/tabulation/project-questions`)
      return data
    } catch (error) {
      throw error
    }
  }

  public async getProjectBannerQuestions(projectId: number, surveyId: number): Promise<QuestionBanner[]> {
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/banner/project-questions`)
      return data
    } catch (error) {
      throw error
    }
  }

  async postSelectedReconcile(projectId: number, surveyId: number, obj: any): Promise<any> {
    try {
      const { data } = await api1.post(`${this.Projects}/${projectId}/surveys/${surveyId}/tokens/reconciliation`, obj)
      return data
    } catch (error) {
      throw error
    }
  }
}

export { ProjectDataService }
