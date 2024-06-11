import { QuestionBanner } from "@/types/project-data.type";

interface data_banner_plan_item {
    id?: string;
    name: string
    confidence_level: number
    // payload: Question[];
    // payloadForBackend?: Question[];
    ui_payload: QuestionBanner[];
    data_payload?: QuestionBanner[];
    object_uid?: string;
}

interface question_item {
    question_id: string  //Q1
    quetion_lable: string //GENDER
    question_text: string // What is your gender
    question_agg_lable: string // Base:All Respondents
    question_type: string
    questoion_sort_order: number
    answers: answer_item[],
}

interface answer_item {
    answer_id: string
    answer_pre_code: string
    answer_text: string
    answer_label: string
    answer_group_text: string
    answer_weightage: number
    answer_sort_order: number
    banner_id: string

}

interface project_question {
    questions: project_question_item[]
}

interface project_question_item {
    question_id: string  //Q1
    question_text: string // What is your gender
    question_type: string
    answers: project_answer_item[],
}

interface project_answer_item {
    answer_id: string
    answer_pre_code: string
    answer_text: string
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
    grouped_question_code?: string[];
    question_id: number | string;
    question_code: string;
    question_label: string;
    question_text: string;
    question_agg_label: string;
    question_type_id: number;
    question_sort_order: number;
    answers: Answer[];
    question_variable_code?: string | number;

    // new structure
    question_value: number;
}

interface Data {
    banner_id: string;
    name: string;
    confidence_level: string;
    questions: Question[];
}

interface AnswerFromAPI {
    // label: number;
    label: string;
    text: string;
    // value: number;
    value: string;
    question_type_id?: number;
    question_text?: string;
}

interface CrossJoins {
    text: string;
    value: number | string;
    question_type_id?: number;
    question_text?: string;

}

interface SelectedJoins {
    // joinTo: number | string;
    // joinFrom: number | string;
    joinIds: string[] | number[]
}

export type { question_item, project_question, data_banner_plan_item, Data, Question, Answer, AnswerFromAPI, CrossJoins, SelectedJoins }