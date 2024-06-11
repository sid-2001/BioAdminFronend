import { BaseService } from "./base.service";
import api1 from "./apis/api1";
import { SecurityType } from "@/containers/survey-security/survey-security.container";

// const DUMMY = {
//   unique_ip: true,
//   unique_user: false,
//   country_mismatch: true,
//   research_defender: false,
//   research_defenderScore: 0,
//   min_loi: 23,
//   max_loi: 2334,
//   survey_id: 0,
//   acceptMinLoi: true,
//   acceptMaxLoi: false,
// };

class SurveySecurityService extends BaseService {
  endpoint = "security";

  async getSurveySecurity(id: number | string): Promise<SecurityType> {
    try {
      const { data } = await api1.get(`/surveys/${id}/${this.endpoint}`);
      console.log(data);
      return data;
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      // return DUMMY;
    } catch (error) {
      throw error;
    }
  }

  async putSurveySecurity(
    securityId: number | string,
    security: SecurityType
  ): Promise<any> {
    try {
      const { status } = await api1.put(
        `/surveys/${securityId}/${this.endpoint}`,
        security
      );

      return { status };
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      // return DUMMY;
    } catch (error) {
      throw error;
    }
  }
}

export { SurveySecurityService };
