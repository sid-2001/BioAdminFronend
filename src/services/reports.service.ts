import { BaseService } from "./base.service";
import api1 from "./apis/api1";

class ReportsService extends BaseService {
  endpoint = "report";
  endpoint2 = "surveys";

  async surveysReport(surveyId: any, start: any, size: any, globalFilter: any, sorting: any, columnFilters: any) {
    try {
      const url = new URL(`${api1.baseUrl}/surveys/${surveyId}/report`);
      url.searchParams.set('start', `${start}`);
      url.searchParams.set('size', `${size}`);
      url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      url.searchParams.set('globalFilter', globalFilter ?? '');
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []));
      const { data } = await api1.get(`${url}`);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
export { ReportsService };
