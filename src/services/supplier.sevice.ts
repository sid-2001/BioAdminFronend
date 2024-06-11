import { BaseService } from "./base.service"
import api1 from "./apis/api1"
import { SupplierType } from "@/containers/suppliers-list/suppliers-list"
import { MetricsWithoutAccounts, SuppliersAccounts } from "@/types/survey-builder.type"

export interface SupplierRequestType {
  name: string
  email: string
  website_url: string
  description: string
  profile_image_url: string
}

class SuppliersService extends BaseService {
  endpoint = "suppliers"

  async getSuppliers(): Promise<Array<SupplierType>> {
    try {
      const { data } = await api1.get(this.endpoint)

      return data.suppliers
    } catch (error) {
      throw error
    }
  }

  async postSupplier(supplier: SupplierRequestType): Promise<any> {
    try {
      const { data } = await api1.post(this.endpoint, supplier)

      return { data }
    } catch (error) {
      throw error
    }
  }

  async putSupplier(
    id: string | number,
    supplier: SupplierRequestType,
  ): Promise<any> {
    try {
      const { data } = await api1.put(`${this.endpoint}/${id}`, supplier)

      return { data }
    } catch (error) {
      throw error
    }
  }

  async getSupplier(id: number | string): Promise<SupplierType> {
    try {
      const { data } = await api1.get(`${this.endpoint}/${id}`)

      return data
    } catch (error) {
      throw error
    }
  }

  async getSupplierConfig(id: number | string): Promise<SupplierType> {
    try {
      const { data } = await api1.get(`${this.endpoint}/${id}/config`);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async putSupplierVariable(id: string | number, rowId: number | string, obj: any): Promise<any> {
    try {
      const { data } = await api1.put(`${this.endpoint}/${id}/config/variables/${rowId}`, obj);
      return { data };
    } catch (error) {
      throw error;
    }
  }

  async putSupplierRedirection(id: string | number, rowId: number | string, obj: any): Promise<any> {
    try {
      const { data } = await api1.put(`${this.endpoint}/${id}/config/redirect/${rowId}`, obj);
      return { data };
    } catch (error) {
      throw error;
    }
  }

  async putSupplierS2s(id: string | number, rowId: number | string, obj: any): Promise<any> {
    try {
      const { data } = await api1.put(`${this.endpoint}/${id}/config/s2s/${rowId}`, obj);
      return { data };
    } catch (error) {
      throw error;
    }
  }

  async getSupplierAccounts(id: number | string): Promise<SuppliersAccounts[]> {
    try {
      const { data } = await api1.get(`${this.endpoint}/${id}/accounts`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async PutSupplierAccounts(id: number | string, accounts_ids: number[]): Promise<any> {
    try {
      const data = await api1.put(`${this.endpoint}/${id}/accounts`, { account_ids: accounts_ids });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getSupplierConfigInAccounts(id: number | string): Promise<MetricsWithoutAccounts> {
    try {
      const { data } = await api1.get(`${this.endpoint}/${id}/supply-config`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async putSupplierConfigInAccounts(id: number | string, config_object: any): Promise<any> {
    try {
      const data = await api1.put(`${this.endpoint}/${id}/supply-config`, config_object);
      return data;
    } catch (error) {
      throw error;
    }
  }

}

export { SuppliersService }
