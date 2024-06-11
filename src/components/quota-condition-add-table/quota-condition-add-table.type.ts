import { CheckBoxData } from "../add-survey-quota/survey-quota.type"

interface TableProps {
  data: any
  setCheckboxes: React.Dispatch<React.SetStateAction<CheckBoxData[]>>
  checkboxes: CheckBoxData[]
  groupIndex: number
}

export type { TableProps }
