import { BaseService } from "./base.service"
import api1 from "./apis/api1"
import { Data } from "@/containers/survey-supplies/constants"

class SurveySuppliersService extends BaseService {
  endpoint = "surveys"
  suffix = "suppliers"

  async getSuppliers(surveyId: string): Promise<Array<Data>> {
    try {
      const { data } = await api1.get(
        `${this.endpoint}/${surveyId}/${this.suffix}`,
      )

      return data
    } catch (error) {
      throw error
    }
  }

  async postSurveysSupplier(surveyId: string, data: any) {
    try {
      await api1.post(`${this.endpoint}/${surveyId}/${this.suffix}`, data)
    } catch (error) {
      return error
    }
  }

  async putSurveysSupplier(surveyId: string, data: any) {
    try {
      await api1.put(`${this.endpoint}/${surveyId}/${this.suffix}`, data)
    } catch (error) {
      return error
    }
  }

  async putSurveysSupplierRow(surveyId: string, data: any, id: string) {
    try {
      await api1.put(`${this.endpoint}/${surveyId}/${this.suffix}/${id}`, data)
    } catch (error) {
      return error
    }
  }
}

export { SurveySuppliersService }
