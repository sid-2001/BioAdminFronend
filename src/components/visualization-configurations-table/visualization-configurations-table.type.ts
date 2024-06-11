interface data_banner_plan_item {
  name: string;
  confidence_level: number;
  // payload: Question[];
  // payloadForBackend?: Question[];
  ui_payload: Question[];
  data_payload?: Question[];
  object_uid: string;
}

interface question_item {
  question_id: string; //Q1
  quetion_lable: string; //GENDER
  question_text: string; // What is your gender
  question_agg_lable: string; // Base:All Respondents
  question_type: string;
  questoion_sort_order: number;
  answers: answer_item[];
}

interface answer_item {
  answer_id: string;
  answer_pre_code: string;
  answer_text: string;
  answer_label: string;
  answer_group_text: string;
  answer_weightage: number;
  answer_sort_order: number;
  banner_id: string;
}

interface project_question {
  questions: project_question_item[];
}

interface project_question_item {
  question_id: string; //Q1
  question_text: string; // What is your gender
  question_type: string;
  answers: project_answer_item[];
}

interface project_answer_item {
  answer_id: string;
  answer_pre_code: string;
  answer_text: string;
}

// new
interface Answer {
  answer_id: string;
  answer_pre_code: string;
  answer_text: string;
  answer_label: string;
  answer_group_text: string;
  answer_weightage: number;
  answer_sort_order: number;
  banner_id: number;
  is_selected: boolean;
  grouping_details: string;
}

interface Question {
  question_variable_code?: string;
  exclude_pre_codes?: number[];
  reverse_scale?: boolean;
  question_id: number | string;
  question_code: string;
  question_label: string;
  question_text: string;
  question_agg_label: string;
  question_type_id: number;
  question_sort_order: number;
  is_grouped?: boolean;
  box_analysis?: string[];
  answers: Answer[];
  question_value: number;
  question_type_name: string;
  question_variable_type: string;
}

interface Data {
  banner_id: string;
  name: string;
  confidence_level: string;
  questions: Question[];
}

interface AnswerFromAPI {
  label: string;
  text: string;
  value: number;
}

interface CrossJoins {
  text: string;
  value: number | string;
}

interface SelectedJoins {
  joinTo: number | string;
  joinFrom: number | string;
}

interface ListsTypes {
  id: number;
  name: string;
  key?: string;
}

interface ConfigAnswerType {
  answer_code: string;
  answer_label: string;
}

interface ConfigQuestionType {
  is_conjoint_question: any;
  is_insights_question: any;
  id: string;
  project_id: string;
  survey_id: string | null;
  question_id: string;
  question_variable_id: string;
  answers: ConfigAnswerType[];
  chart_type_id: string | null;
  chart_type_key: string | null;
  chart_type_name: string | null;
  classification_type_id: number;
  classification_type_key: string;
  classification_type_name: string;
  is_chartable_question: boolean;
  is_quotable_question: boolean;
  level_id: string | null;
  max_value: string | null;
  min_value: string | null;
  node_name: string | null;
  question_label: string;
  question_precode: string;
  question_variable_type: string;
  sort_order: string;
  sp_question_type_id: string;
}

interface UpdateDataType {
  is_chartable_question: boolean;
  is_quotable_question: boolean;
  chart_type_id: string | null;
  question_id: string;
}


export type {
  question_item,
  project_question,
  data_banner_plan_item,
  Data,
  Question,
  Answer,
  AnswerFromAPI,
  CrossJoins,
  SelectedJoins,
  ListsTypes,
  ConfigQuestionType,
  ConfigAnswerType,
  UpdateDataType,
};
