import { BaseService } from "./base.service";
import api1 from "./apis/api1";
import { Inputs as SurveyType } from "@/containers/surveys-list/surveys-list.container";

class SurveysService extends BaseService {
  endpoint = "surveys";

  async getsurveys(): Promise<Array<SurveyType>> {
    try {
      const { data } = await api1.get(this.endpoint);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getsurveysByProjectId(
    pId: string | number
  ): Promise<Array<SurveyType>> {
    try {
      const { data } = await api1.post(`surveys/list`, {
        project_id: pId,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getSurvey(id: string | number): Promise<SurveyType> {
    try {
      const { data } = await api1.get(`${this.endpoint}/${id}`);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async postsurvey(survey: SurveyType): Promise<any> {
    try {
      const { data } = await api1.post(this.endpoint, {
        ...survey,
        status_id: 1,
      });

      return { survey: data };
    } catch (error) {
      throw error;
    }
  }

  async putsurvey(survey: SurveyType): Promise<any> {
    try {
      const { data } = await api1.put(`${this.endpoint}/${survey.id}`, survey);

      return { survey: data };
    } catch (error) {
      throw error;
    }
  }
}

export { SurveysService };
