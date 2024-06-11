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

export interface ThemeTypes {
  fontFamily: string
  backgroundColor: string
  backgroundImage: string
  breakpoint: number
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
