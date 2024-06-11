import { BaseService } from "./base.service"
import api1 from "./apis/api1"

export interface LayoutType {
  id: number
  name: string
  is_default: boolean
}

export interface LayoutInput {
  name: string
  is_default: boolean
}

class LayoutsService extends BaseService {
  endpoint = "layouts"

  async getLayouts(): Promise<Array<LayoutType>> {
    try {
      const { data } = await api1.get(this.endpoint)

      return data
    } catch (error) {
      throw error
    }
  }

  async getLayout(id: string | number): Promise<LayoutType> {
    try {
      const { data } = await api1.get(`${this.endpoint}/${id}`)

      return data
    } catch (error) {
      throw error
    }
  }

  async postLayout(layout: LayoutInput): Promise<any> {
    try {
      const { data } = await api1.post(this.endpoint, layout)

      return { layout: data }
    } catch (error) {
      throw error
    }
  }

  async putLayout(layout: LayoutType): Promise<any> {
    try {
      const { data } = await api1.put(`${this.endpoint}/${layout.id}`, layout)

      return { layout: data }
    } catch (error) {
      throw error
    }
  }
}

export { LayoutsService }
