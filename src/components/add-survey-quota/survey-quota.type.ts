interface QuotaAddProps {
  setNewQuota: React.Dispatch<React.SetStateAction<boolean>>
  options: Options[]
  searchText: string
  setSearchText: React.Dispatch<React.SetStateAction<string>>
  getSurveyQuotas: () => Promise<void>
}

interface Options {
  id: string
  question_name: string
  question_code: string
  question_title_formatted: string
  question_type_id: number
  answers: OptionsAns[]
  qualification_category_id: number
}

interface OptionsAns {
  id: number
  answer_id: number
  answer_text: string
  pre_code: string
}

interface CheckBoxData {
  qualification_id: number
  qualification_type_id: number
  heading: string
  checkboxes: CheckBox[]
  selectedAns: string[]
  question_data_code: number
}

interface CheckBox {
  option_id: string
  option: string
  quota: number
  complete: number
  remaining: number
}

export type { Options, OptionsAns, CheckBoxData, QuotaAddProps }
