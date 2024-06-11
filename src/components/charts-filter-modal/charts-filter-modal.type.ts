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
    question_id: number | string;
    question_code: string;
    question_label: string;
    question_text: string;
    question_agg_label: string;
    question_type_id: number;
    question_sort_order: number;
    answers: Answer[];
    grouped_question_code?: string[];
    question_variable_code?: string | number;

    // new structure
    question_value: number;
    question_type_name: string;
    question_variable_type: string;
}

export type { Question, Answer }