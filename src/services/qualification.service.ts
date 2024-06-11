import { BaseService } from './base.service'
import api1 from './apis/api1'

class QualificationService extends BaseService {
  endpoint = 'qualifications'
  endpoint2 = 'surveys'

  async get_qualifications(searchText: string, survey_id: number): Promise<Array<any>> {
    try {
      const { data } = await api1.get(`${this.endpoint}?search_query=${searchText}&survey_id=${survey_id}`)
      return data
    } catch (error) {
      throw error
    }
  }
  async get_answers(qualification_id: string, category_id: number, survey_id: number): Promise<Array<any>> {
    try {
      const { data } = await api1.get(`${this.endpoint}/${qualification_id}?category_id=${category_id}&survey_id=${survey_id}`)
      return data
    } catch (error) {
      throw error
    }
  }
  async post_qualification(survey_id: string, obj: any): Promise<Array<any>> {
    try {
      const { data } = await api1.post(`surveys/${survey_id}/qualifications`, obj)

      return data
    } catch (error) {
      throw error
    }
  }

  async post_custom_qualification(obj: any): Promise<Array<any>> {
    try {
      const { data } = await api1.post(`/${this.endpoint}`, obj)

      return data
    } catch (error) {
      throw error
    }
  }

  async put_qualification(survey_id: string, survey_qualification_id: string, obj: any): Promise<Array<any>> {
    try {
      const { data } = await api1.put(`surveys/${survey_id}/qualifications/${survey_qualification_id}`, obj)

      return data
    } catch (error) {
      throw error
    }
  }

  async get_qualifications_data(survey_id: string): Promise<Array<any>> {
    try {
      const { data } = await api1.get(`${this.endpoint2}/${survey_id}/qualifications`)

      return data
    } catch (error) {
      throw error
    }
  }

  async active_deactive_qualification(survey_id?: string, qualification_id?: string, obj?: any): Promise<any> {
    try {
      const { data } = await api1.patch(`${this.endpoint2}/${survey_id}/qualifications/${qualification_id}`, obj)
      return data
    } catch (error) {
      throw error
    }
  }
  async sort_qualifications(obj: any, surveyId: number): Promise<any> {
    try {
      const data = await api1.patch(`${this.endpoint2}/${surveyId}/qualifications/order`, obj)

      return data
    } catch (error) {
      throw error
    }
  }
}
export { QualificationService }
