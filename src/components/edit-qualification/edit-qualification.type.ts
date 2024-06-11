interface OptionsType {
  id: string
  name: string
  isActive: boolean
  type_id: number
}

interface QualificationType {
  id: string
  name: string
  qualificationTypeId: number
  questionText: string
  qualificationQuestionId: string
  qualificationCategoryId: number
  survey_qualification_id: string
  selectedRange: {
    min: string
    max: string
  }[]
  answers: {
    id: number
    label: string
  }[]
  selectedAnswers: number[]
  text: string
}

interface EditQualificationComponentProps {
  getQualificationsData: () => Promise<void>
  row: any
  provided: any
}

export type { OptionsType, QualificationType, EditQualificationComponentProps }
