import { BaseService } from './base.service'
import api1 from './apis/api1'
import { ProjectFileType } from '@/types/project.type'

export interface StatusListType {
  id: number
  name: string
}

export interface ProgrammingSoftwareListType extends StatusListType {}

export interface ClientListType {
  id: number
  key: string
  name: string
}

export interface SearchDataType {
  path: string
  title: string
  resourceType: string
}

class ListService extends BaseService {
  List = '/lists'
  async get_project_status(): Promise<StatusListType[]> {
    try {
      const { data } = await api1.get(`${this.List}/status_list`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_survey_status(): Promise<StatusListType[]> {
    try {
      const { data } = await api1.get(`${this.List}/survey_status_list`)
      return data
    } catch (error) {
      throw error
    }
  }

  // async get_survey_status(): Promise<StatusListType[]> {
  //   try {
  //     const { data } = await api1.get(`${this.List}/survey-status`)
  //     return data
  //   } catch (error) {
  //     throw error
  //   }
  // }

  Attachments = 'attachments'
  async get_project_files(projectId: string | number, projectTypeId: number, path = '/'): Promise<ProjectFileType[]> {
    try {
      const { data } = await api1.get(`${this.Attachments}/folder-structure?object_id=${projectId}&object_type_id=${projectTypeId}&path=${path}`)
      return data
    } catch (error) {
      throw error
    }
  }
  // http://localhost:9001/api/v1/attachments/folder-structure?object_id=252&object_type_id=1&path=%2F

  async get_client_list(): Promise<ClientListType[]> {
    try {
      const { data } = await api1.get(`${this.List}/client-list`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_survey_type_list(): Promise<any[]> {
    try {
      const { data } = await api1.get(`${this.List}/survey-type-list`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_software_list(): Promise<ProgrammingSoftwareListType[]> {
    try {
      const { data } = await api1.get(`${this.List}/software-programming-list`)

      return data
    } catch (error) {
      throw error
    }
  }

  async get_industry_list(): Promise<any[]> {
    try {
      const { data } = await api1.get(`${this.List}/survey-industry-list`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_programming_software_list(): Promise<ProgrammingSoftwareListType[]> {
    try {
      const { data } = await api1.get(`${this.List}/sp-client-list`)

      return data
    } catch (error) {
      throw error
    }
  }

  async get_market_list(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/market_list`)
      return data
    } catch (error) {
      throw error
    }
  }

  async user_role_list(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/user_role_list`)
      return data
    } catch (error) {
      throw error
    }
  }

  async role_list(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/roles`)
      return data
    } catch (error) {
      throw error
    }
  }

  async question_type_list(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/question-type`)
      return data
    } catch (error) {
      throw error
    }
  }

  async question_swap_list(): Promise<any> {
    try {
      const data = await api1.get(`${this.List}/swap-quesiton`)
      return data
    } catch (error) {
      throw error
    }
  }

  async question_answer_sorting(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/answer-sorting`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_permission_type_list(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/permission-type`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_object_type_list(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/object-type`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_roles(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/user_role_list`)
      return data
    } catch (error) {
      throw error
    }
  }

  sleep(duration: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, duration)
    })
  }

  SearchEndpoint = 'globals'
  async get_search_list(query: string): Promise<Array<SearchDataType>> {
    console.log(`API CALL MADE WITH QUERY ${query}`)

    try {
      const { data } = await api1.get(`${this.SearchEndpoint}?search=${query}`)

      const filteredData = await data.items.map((resource: any) => {
        const basePath = resource.resourceType[0].toLowerCase() + resource.resourceType.substring(1) + 's'
        return {
          path: `${basePath}/${resource.resourceId}`,
          title: resource.resourceName,
          resourceType: resource.resourceType,
        }
      })

      return filteredData
    } catch (error) {
      throw error
    }
  }

  async get_theme_list(): Promise<any> {
    try {
      const { data } = await api1.get(`/layouts`)
      return data
    } catch (error) {
      throw error
    }
  }
  async get_sp_layout_list(): Promise<Array<{ id: number; sp_id: number; name: string }>> {
    try {
      const { data } = await api1.get(`${this.List}/sp-layout`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_pipelines_status(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/pipeline-run-status`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_charts_types(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/chart-type-list`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_charts_questions_types(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/question-classification-type-list`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_survey_calc_types(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/survey-calc-type`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_survey_slide_types(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/slide-types`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_survey_legend_positions(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/legend-positions`)
      return data
    } catch (error) {
      throw error
    }
  }

  async get_accounts_list(): Promise<any> {
    try {
      const { data } = await api1.get(`${this.List}/accounts`)
      return data
    } catch (error) {
      throw error
    }
  }

  public async getReconcileType(): Promise<any> {
    try {
      const { response } = await api1.get(`${this.List}/reconciliation-type`)
      return response
    } catch (error) {
      throw error
    }
  }
}

export { ListService }
