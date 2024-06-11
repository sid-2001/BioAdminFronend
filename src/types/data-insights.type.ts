// interface Insight {
//   project_id: string
//   project_name: string
//   questions: Question[]
// }

// interface Question {
//   id: number
//   question_id: string
//   question_label: string
//   type: string
//   base_name: string
//   base_value: number
//   answer: Answer[]
//   insights: string[]
// }

// interface Answer {
//   answer_code: string
//   answer_text: string
//   count: number
// }

// export type { Answer, Insight, Question }



interface SurveyData {
  project_id: string;
  survey_id: string;
  questions: Question[];

  project_name?: string;
}

interface Question {
  id: number;
  question_id: string;
  question_label: string;
  type: string;
  base_name: string;
  base_value: number;
  insights: string[];
  banners: Banner[];
  is_demographic_question: boolean;
  chart_type: string;

  legend_position?: string;
  question_title?: string;
  question_title_generated?: string;
  answer?: any[];
  group?: any;

  respondent_name?: string;

  // custom to differentiate
  grouped?: string;
  nps?: number;
  variables?: Variable[]

  keywords?: { name: string; freq: number; }[]
  topics?: { name: string; freq: number; }[]

}

interface Banner {
  banner_name: string;
  chart_type: string;
  insights: string[];
  variables: Variable[];
}

interface Variable {
  variable_name: string;
  answer: Answer[];
  nps?: number;
}

interface Answer {
  answer_label: string;
  count: number;
}

export type { Answer, Question, SurveyData, Banner }

