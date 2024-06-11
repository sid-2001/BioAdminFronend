import { BaseService } from './base.service'
import api1 from './apis/api1'

class QuestionnaireService extends BaseService {
  Projects = 'projects'
  Surveys = 'surveys'

  async uploadQuestionnaire(projectId: number, surveyId: number, obj: any): Promise<any> {
    console.log(obj)
    const formData = new FormData()
    formData.append('files', obj.files)
    formData.append('type', obj.type_id)
    try {
      const { data } = await api1.post(`/${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/questionnaire`, formData)
      return data
    } catch (error) {
      throw error
    }
  }
}

export { QuestionnaireService }
