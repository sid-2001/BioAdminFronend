// import { questionAnswers } from "../survey-quota/survey-quota.type";

interface CheckBoxData {
  question_id: string
  heading: string
  answerCode: string
  checkboxes: CheckBox[]
  selectedAns: number[]
}

interface CheckBox {
  id: string
  label: string
}

interface QuotaConditionProps {
  id: number
  quota_id: number
  survey_id: number
  quota_name: string
  sample_size: number
  is_active: boolean
  client_quota_value: number
  client_quota_id: string
  edit: boolean
  quota_conditions: quotaConditions[]
}
interface quotaConditions {
  id: number
  quota_id: number
  survey_id: number
  question_id: number
  answer_details: AnswerDetails[]
  is_active: boolean
  survey_quota_condition_id: number
  question_question_id: number
  question_text: string
  question_sub_text: string
  question_type_id: number
  question_category_id: number
  question_name: string
  question_code: string
  question_answers: any
  selectedAns?: any
}

interface AnswerDetails {
  answer_code: string
  answer_id: number
  answer_text: string
  completed: number
  remaining: number
  sample_size: number
  min?: number
  max?: number
}

export type { CheckBoxData, CheckBox, QuotaConditionProps }
