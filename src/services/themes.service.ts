import { BaseService } from './base.service'
import api1 from './apis/api1'

export interface BaseTextProperties {
  text: string
  color: string
  borderColor: string
  backgroundColor: string
  textAlign: string
}

export interface HeaderProperties extends BaseTextProperties {
  url: string
}

export interface ThemePropertiesTies {
  fontFamily: string
  backgroundColor: string
  backgroundImage: string
  breakpoint: number
  splayoutid: number
  splayoutname: string
  backgroundRepeat: boolean
  header: HeaderProperties
  controls: {
    selected: {
      color: string
    }
    unselected: {
      color: string
    }
  }
  button: BaseTextProperties
  questions: BaseTextProperties
  instructions: BaseTextProperties
}

export interface ThemeType {
  name: string
  is_default: boolean
  id: number
  layout_id: number
  properties: ThemePropertiesTies
}

class ThemesService extends BaseService {
  endpoint = 'theme'
  prefix = 'layouts'

  async getThemes(layoutId: string | number): Promise<Array<ThemeType>> {
    try {
      const { data } = await api1.get(`${this.prefix}/${layoutId}/${this.endpoint}`)

      const filteredData = data.map((obj: any) => {
        return {
          ...obj,
          ...obj.properties,
        }
      })

      return filteredData
    } catch (error) {
      throw error
    }
  }

  async getTheme(layoutId: string | number, id: string | number): Promise<ThemeType> {
    try {
      const { data } = await api1.get(`${this.prefix}/${layoutId}/${this.endpoint}/${id}`)

      return data
    } catch (error) {
      throw error
    }
  }

  async postTheme(theme: ThemeType): Promise<any> {
    try {
      const { data } = await api1.post(`${this.prefix}/${this.endpoint}`, theme)

      return { theme: data }
    } catch (error) {
      throw error
    }
  }

  async putTheme(mainData: ThemeType, theme: ThemePropertiesTies): Promise<any> {
    try {
      console.log(mainData)

      const { data } = await api1.put(`${this.prefix}/${mainData.layout_id}/${this.endpoint}/${mainData.id}`, {
        properties: theme,
        name: mainData.name,
        layout_id: mainData.layout_id,
        is_default: mainData.is_default,
      })

      return { theme: data }
    } catch (error) {
      throw error
    }
  }
}

export { ThemesService }
