import { BaseService } from "./base.service";
import api1 from "./apis/api1";

export interface TenantRequestType {
  name: string
  email: string
  website_url: string
  description?: string
  image: string
}

class TenantService extends BaseService {
  async get_tenant_list(): Promise<any> {
    try {
      const { data } = await api1.get(`/tenant`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async get_tenant(id: number|string): Promise<any> {
    try {
      const { data } = await api1.get(`/tenant/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postTenant(tenant: TenantRequestType): Promise<any> {
    try {
      const { data } = await api1.post(`/tenant`, tenant)

      return { data }
    } catch (error) {
      throw error
    }
  }

  async putTenant(
    id: string | number,
    tenant: TenantRequestType,
  ): Promise<any> {
    try {
      const { data } = await api1.put(`/tenant/${id}`, tenant)

      return { data }
    } catch (error) {
      throw error
    }
  }

  async switch_tenant(accountId: number): Promise<any> {
    try {
      const { data } = await api1.post(`/tenant/switch`, {
        account_id: accountId,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export { TenantService };
