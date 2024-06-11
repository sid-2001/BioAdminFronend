import { BaseService } from './base.service'
import api1 from './apis/api1'

class QuotaService extends BaseService {
  endpoint = 'projects'
  endpoint2 = 'surveys'

  async survey_qualification_search(project_id: string, surveyId: number): Promise<any> {
    try {
      const data = await api1.get(
        // `${this.endpoint}/${project_id}/qualification/conditions?search=${search}`,
        `${this.endpoint}/${project_id}/surveys/${surveyId}/questions`,
      )
      return data
    } catch (error) {
      throw error
    }
  }

  async get_qualification_details(project_id: string, question_id: string): Promise<any> {
    try {
      const data = await api1.get(`${this.endpoint}/${project_id}/questions/${question_id}`)
      return data
    } catch (error) {
      throw error
    }
  }

  async post_survey_quota(survey_id: string, obj: any): Promise<any> {
    try {
      const data = await api1.post(`${this.endpoint2}/${survey_id}/quotas`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_quota_list(survey_id: string): Promise<any> {
    try {
      const data = await api1.get(`${this.endpoint2}/${survey_id}/quotas`)
      return data
    } catch (error) {
      throw error
    }
  }

  async put_quota(survey_id: string, quota_id: string, obj: any): Promise<any> {
    try {
      const data = await api1.put(`${this.endpoint2}/${survey_id}/quotas/${quota_id}`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async active_deactive_quota_by_quota_id(survey_id?: string, quota_id?: string, obj?: any): Promise<any> {
    try {
      const { data } = await api1.patch(`${this.endpoint2}/${survey_id}/quotas/${quota_id}`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async post_survey_nested_quotas(survey_id: string, obj: any): Promise<any> {
    try {
      const data = await api1.post(`${this.endpoint2}/${survey_id}/nested-quotas`, obj)
      return data
    } catch (error) {
      throw error
    }
  }
  async put_survey_nested_quotas(survey_id: string, obj: any): Promise<any> {
    try {
      const data = await api1.put(`${this.endpoint2}/${survey_id}/nested-quotas`, obj)
      return data
    } catch (error) {
      throw error
    }
  }
  async nested_quota_fill_target(survey_id?: string, obj?: any): Promise<any> {
    try {
      const { data } = await api1.patch(`${this.endpoint2}/${survey_id}/fill-target`, obj)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_nested_quota(survey_id: string): Promise<any> {
    try {
      const data = await api1.get(`${this.endpoint2}/${survey_id}/nested-quotas`)
      return data
    } catch (error) {
      throw error
    }
  }

  async active_deactive_nested_quota(survey_id?: string, quota_id?: string, obj?: any): Promise<any> {
    try {
      const { data } = await api1.patch(`${this.endpoint2}/${survey_id}/quotas/${quota_id}`, obj)
      return data
    } catch (error) {
      throw error
    }
  }
}

export { QuotaService }
