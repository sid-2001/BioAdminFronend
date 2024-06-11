interface ProjectDataType {
  name: string
  type_id: number | null
  project_id: number
  status_id: number | null
  status_reason: string
  start_time: string | null
  end_time: string | null
  object_uid: string
  summary: string
  configuration: {}
  output: {}
}

interface InitialConfigType {
  job: {
    name: string
    id: string
    project_id: string
    output_path: string
  }
  files: Array<{
    key: string
    url: string
    file_type: string
  }>
  config: Array<{
    type: string
    type_name: string
    order: number
    config: Array<{
      type: string
      type_name: string
      order: number
      enabled: boolean
      fields: Array<{
        name: string
        display_name: string
        datatype: string
        value: any
        default_value: any
        order: number
      }>
    }>
  }>
}

// interface SummaryCardsType {
//     project: {
//         project_id: string;
//         name: string;
//         last_sync: string;
//     },
//     summary_card: {
//         type: string;
//         name: string;
//         total: number;
//         fail: number;
//         sync_time: string;
//         reviewed: number;
//     }[]
// }

interface SummaryCardsType {
  project: {
    project_id: string
    name: string
    last_sync: string
  }
  summary_card: {
    type: string
    name: string
    total: number
    fail: number
    sync_time: string
    reviewed: number
  }[]
}

interface DataTableType {
  project: {
    project_id: string
    name: string
    last_sync: string
  }
  response_data: {
    response_id: number
    respondent_id: number
    respondent_status: string
    interview_start_timestamp: number
    interview_end_timestamp: number
    straight_liner_validation_status: number
    straight_liner_validation_status_reason: string | null
    straight_liner_validation_original_status: number
    speeder_validation_status: number
    speeder_validation_status_reason: string | null
    speeder_validation_original_status: number
    conditions_check_status: number
    conditions_check_status_reason: string | null
    conditions_check_original_status: number
    validations_check_status: number
    validations_check_status_reason: string | null
    validations_check_original_status: number
    straight_liner_validation_status_timestamp: number
    speeder_validation_status_timestamp: number
    conditions_check_status_timestamp: number
    validations_check_status_timestamp: number
  }[]
}

interface Table {
  table_name: string
  question_id: string
  question_text: string
  base_name: string
  base_value: number
  analysis_text: string
  notes_text: string
  rows: TableRow[]
}
interface TableRow {
  name: string
  columns: TableColumn[]
}
interface TableColumn {
  name: string
  value: number
  group_name: string
  value_percent: string
  value_subscript: string
  label: string
}
interface JSONData {
  name?: string
  tables: Table[]
}

interface AnalysisData {
  text: string
  is_gibberish: boolean
  gibberish_text: any
  is_profanity: boolean
  profanity_text: any
  sentiment_class: string
  sentiment_score: number
  topics: string[]
  keywords: string[]
}

interface DataRow {
  counts: string
  percentages: string
  question_number: string
  question_text: string
  basic_title: string
  base_value: number
  id: number
}

// Banner
interface data_banner_plan_item {
  name: string
  confidence_level: number
  // payload: Question[];
  // payloadForBackend?: Question[];
  ui_payload: QuestionBanner[]
  data_payload?: QuestionBanner[]
  object_uid?: string
  id?: number
}

// interface question_item {
//     question_id: string  //Q1
//     quetion_lable: string //GENDER
//     question_text: string // What is your gender
//     question_agg_lable: string // Base:All Respondents
//     question_type: string
//     questoion_sort_order: number
//     answers: answer_item[],
// }

// interface answer_item {
//     answer_id: string
//     answer_pre_code: string
//     answer_text: string
//     answer_label: string
//     answer_group_text: string
//     answer_weightage: number
//     answer_sort_order: number
//     banner_id: string

// }

interface project_question {
  questions: project_question_item[]
}

interface project_question_item {
  question_id: string //Q1
  question_text: string // What is your gender
  question_type: string
  answers: project_answer_item[]
}

interface project_answer_item {
  answer_id: string
  answer_pre_code: string
  answer_text: string
}

// new
interface Answer {
  answer_id: string
  answer_pre_code: string
  answer_text: string
  answer_label: string
  answer_group_text: string
  answer_weightage: number
  answer_sort_order: number
  banner_id: number
  is_selected: boolean
  grouping_details: string
}

interface Question {
  question_id: number | string
  question_code: string
  question_label: string
  question_text: string
  question_agg_label: string
  question_type_id: number
  question_sort_order: number
  answers: Answer[]
  answerstoconfigure?: Answer[]
  exclude_pre_codes?: number[]
  reverse_scale?: boolean
  question_value: number
  question_type_name: string
  question_variable_type: string
}

interface QuestionBanner {
  question_id: number | string
  question_code: string
  question_label: string
  question_text: string
  question_agg_label: string
  question_type_id: number
  question_sort_order: number
  answers: Answer[]
  answerstoconfigure?: Answer[]
  exclude_pre_codes?: number[]
  reverse_scale?: boolean
  question_value: string
  question_type_name: string
  question_variable_type: string
  question_variable_id: string
  export_to_viz?: boolean
}

interface Data {
  banner_id: string
  name: string
  confidence_level: string
  questions: Question[]
}

interface AnswerFromAPI {
  label: string
  text: string
  value: number
  data_payload: Question[]
  confidence_level: string
  object_uid: string
}

interface CrossJoins {
  text: string
  value: number | string
}

interface SelectedJoins {
  joinTo: number | string
  joinFrom: number | string
}

interface ProjectBannerQuestionType {
  answers: []
  question_id: string
  question_text: string
  question_type_id: number
  question_value: number
}

interface QuestionListItem {
  question_id: string
  question_text?: string
  // question_value: number;
  question_value: string
  question_variable_id: string
  question_type_id: number
}

interface data_banner_plan_item_response {
  id: number
  name: string
  confidence_level: number
  // payload: Question[];
  // payloadForBackend?: Question[];
  ui_payload: QuestionBanner[]
  data_payload?: QuestionBanner[]
  object_uid: string
  is_active?: boolean
}

// export type { project_question, data_banner_plan_item, Data, Question, Answer, AnswerFromAPI, CrossJoins, SelectedJoins }

// tabulation

interface postTabulationObject {
  banner_id: number
  name: string
  description: string
  tab_config: Question[]
  banner_config: Question[]
  object_uid: string
  confidence_level: number
}

interface ProjectFiles {
  id: number
  project_id: number
  filetype_id: number
  file_name: string
  file_url: string
  is_active: boolean
  created_by: number
  updated_by: number
  created_at: Date
  updated_at: Date
}

// charts question types
interface ListsTypes {
  id: number
  name: string
}

interface ConfigAnswerType {
  answer_code: string
  answer_label: string
}

interface ConfigQuestionType {
  id: string
  project_id: string
  survey_id: string | null
  question_id: string
  question_variable_id: string
  answers: project_answer_item[]
  chart_type_id: string | null
  chart_type_key: string | null
  chart_type_name: string | null
  classification_type_id: number
  classification_type_key: string
  classification_type_name: string
  is_chartable_question: boolean
  is_quotable_question: boolean
  level_id: string | null
  max_value: string | null
  min_value: string | null
  node_name: string | null
  question_label: string
  question_precode: string
  question_variable_type: string
  sort_order: string
  sp_question_type_id: string
  question_type_id: string | number
  question_text?: string;

  question_type_name?: string;
  node?: any;
  is_tabulation?: boolean;
  is_max_diff?: boolean;
  is_conjoint_question?: boolean;
  is_insights_question?: boolean;
  is_tabulation_question?: boolean;
  question_precode_label?: string;
  question_title?: string;
  

  value?: string;
}

interface PostVisualizationObjectType {
  banner_id: string
  banner_name: string
  visualization_name: string
  tabulation: number
  selectedQuestions: any
  config_payload: any
}

export type {
  ProjectDataType,
  InitialConfigType,
  SummaryCardsType,
  DataTableType,
  Table,
  TableRow,
  TableColumn,
  JSONData,
  DataRow,
  project_question,
  data_banner_plan_item,
  Data,
  Question,
  Answer,
  AnswerFromAPI,
  CrossJoins,
  SelectedJoins,
  ProjectBannerQuestionType,
  QuestionListItem,
  postTabulationObject,
  data_banner_plan_item_response,
  ProjectFiles,
  ListsTypes,
  ConfigAnswerType,
  ConfigQuestionType,
  AnalysisData,
  QuestionBanner,
  PostVisualizationObjectType,
}
