import { BaseService } from "./base.service"
import api1 from "./apis/api1"
import {
  ClientPostDataResponseType,
  ClientPostDataType,
  ClientType,
} from "@/types/client.types"
import { ProgrammingSoftwareListType } from "./list.service"

class ClientsService extends BaseService {
  endpoint = "clients"

  async getClients(): Promise<Array<ClientType>> {
    try {
      const { data } = await api1.get(this.endpoint)

      return data.clients
    } catch (error) {
      throw error
    }
  }

  async getClientSP(id: number | null): Promise<Array<ProgrammingSoftwareListType>> {
    try {
      const { data } = await api1.get(`${this.endpoint}/${id}/sp-list`)
      return data
    } catch (error) {
      throw error
    }
  }

  async getClient(id: number | string): Promise<ClientType> {
    try {
      const { data } = await api1.get(`${this.endpoint}/${id}`)

      return data
    } catch (error) {
      throw error
    }
  }

  async postClient(
    client: ClientPostDataType,
  ): Promise<ClientPostDataResponseType> {
    try {
      const { data, status } = await api1.post(this.endpoint, client)

      return { client: data, status }
    } catch (error) {
      throw error
    }
  }

  async putClient(
    clientId: number | string,
    client: ClientPostDataType,
  ): Promise<ClientPostDataResponseType> {
    try {
      const { data, status } = await api1.put(
        `${this.endpoint}/${clientId}`,
        client,
      )

      return { client: data, status }
    } catch (error) {
      throw error
    }
  }
}

export { ClientsService }
