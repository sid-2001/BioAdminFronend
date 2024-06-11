import { FilesTypes } from "@/components/project-media-upload-modal/project-media-upload-modal.type"

interface SurveyResponse {
  status: string
  data: Array<TemplateDetails>
}

interface TemplateDetails {
  template_id: number
  template_name: string
  template_code: string
  description: string
  number_of_questions: number
  sections?: Array<Section>
  is_active?: boolean
}

interface Section {
  is_recommended: boolean
  section_id: number
  survey_question_id?: number
  is_active?: boolean
  is_required?: boolean
  is_optional?: boolean
  number_of_questions: number
  section_code?: string
  survey_version: number
  section_name: string
  section_sort_order: number
  programming_notes: string
  is_template_section: boolean
  is_template_question?: boolean
  questions: Array<Question>
  description?: string
  section_time?: number

  concept_id: number;
}

interface Question {

  question_data_code: string;
  question_name: string
  question_title: string
  question_title_formatted: string
  question_description?: string
  programming_notes: string
  can_have_quota: boolean

  // instructions: number;
  field_width: string
  default_value: string
  image_width: number
  image_height: number
  auto_check_other: boolean
  default_answer_pre_code: string
  open_text_coding_field: string
  refused_answer_pre_code: string
  input_prefix: string
  input_suffix: string
  equals_representation: string
  answer_required_type: string
  ordered: boolean
  rank_by_click: boolean
  open_text: boolean
  is_numeric: boolean
  lower_limit_type: string
  upper_limit_type: string
  no_of_rows: number
  carousel: boolean
  question_sort_order: number
  precision_value: number
  lower_limit: number
  upper_limit: number
  auto_sum: boolean
  transpose: boolean
  max_diff: boolean
  answer_text_position: string
  is_active: boolean
  question_type_id: number
  question_code: string
  question_category_id: number
  question_category: string
  question_id: number
  columns: number
  rows: number
  sorting_order: number
  instructions: string
  answers: Array<Answer>
  prompt_answer: any
  survey_question_id?: number
  question_time: number
  sub_questions?: Question[]
  parent_id?: number | null
  child_sort_order?: number | string;


  concept: FilesTypes;
}

interface Answer {
  survey_question_answer_id: number
  question_id: number
  answer_id: number | string
  question_answer_id: number | string
  question_answer_code: string
  question_answer_data_code: string
  question_answer_text: string
  term_condition: boolean
  language_id: number
  style_name: string
  is_terminate: boolean
  answer_punch_type: string
  style_background_color: string
  add_other_option?: boolean
  keep_answer_position?: boolean
  sort_order?: number
  answer_sort_order?: number
  is_active: boolean
  add_other_field: boolean
  lock_position: boolean
}

//
interface SinglePunchTypes extends Question {
  answers: Answer[]
}

interface MultiPunchTypes extends Question {
  answers: Answer[]
}

// question-base-category
interface QuestionBaseCategoryTypes {
  sorting_order?: number | string
  no_of_rows?: number | string
  no_of_columns?: number | string

  // columns?: number;
  columns?: number | string
  width?: number
  required_question?: boolean
  use_images?: boolean
  required_type?: number | string
  show_codes?: boolean
  capture_order?: boolean
  can_have_quota?: boolean
  no_of_answers?: number | string
  no_of_answers_min?: number | string
  no_of_answers_max?: number | string
  no_of_answers_count?: number | string
  input_box_width?: number | string
  answer_sort_order?: number | string
  prompt_group_sorting_order?: number | string
  prompt_sorting_order?: number | string
  answer_sorting_order?: number | string
  prompt_show_code?: boolean
  // dummy for multiselect
  // precision_value?: number | string;
  lower_limit?: number | string
  upper_limit?: number | string
  auto_sum?: boolean
  multi_sum_equal?: number | string
  lower_limit_type?: number | string
  upper_limit_type?: number | string

  // open-ended
  input_box_rows?: number | string
  input_suffix?: string
  input_prefix?: string
  precision_value?: number | string
  // question_time: number;
}

interface SuppliersAccounts {
  account_id: number;
  account_name: string;
}

interface IFormMetrics {
  account_ids: number[];
  min_vcpi: number;
  max_vcpi: number;
  min_loi: number;
  max_loi: number;
  min_ir: number;
  max_ir: number;
  min_conversion: number;
  min_epc: number;
  min_sample_required: number;
  min_cpi: number;
  max_cpi: number;
}

type MetricsWithoutAccounts = Omit<IFormMetrics, 'account_ids'>;


export type { SurveyResponse, SinglePunchTypes, MultiPunchTypes, TemplateDetails, Section, Question, Answer, QuestionBaseCategoryTypes, SuppliersAccounts, IFormMetrics, MetricsWithoutAccounts }
