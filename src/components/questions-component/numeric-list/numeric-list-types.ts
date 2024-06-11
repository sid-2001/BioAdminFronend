import { FilesTypes } from "@/components/project-media-upload-modal/project-media-upload-modal.type";
import { QuestionListTypes, SortingListTypes } from "@/components/project-survey-builder/project-survey-builder.type";
import { ThemeTypes } from "@/types/builder-theme-type";
import { QuestionBaseCategoryTypes } from "@/types/survey-builder.type";

interface SinglePunchProps {
  question?: QuestionTypes;
  surveyQuestionId?: number;
  SaveQuestion: (data: any) => void;
  add?: boolean;
  editFalse?: boolean;
  setEditFalse?: React.Dispatch<React.SetStateAction<boolean>>;
  loading?: boolean;
  setQuestionPreview?: React.Dispatch<any>;
  questionPreview?: any;
  editHide?: boolean;
  sortingList?: SortingListTypes[];
  questionTheme?: ThemeTypes;
  setQuestionCompare?: any;

  setSelectedQuestion?: React.Dispatch<any>;
  questionTypeList: QuestionListTypes[];
  swapList: any[];


  uploadMediaModalSelect: boolean;
  setUploadMediaModalSelect: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFileQuestionTitle: FilesTypes | null;
  setSelectedFileQuestionTitle: React.Dispatch<React.SetStateAction<FilesTypes | null>>;
}

interface QuestionTypes {

  question_data_code: string;
  question_id: number | null;
  question_category_id: number | string;
  question_category: string;
  question_name: string;
  question_code: string;
  question_title: string;
  question_time?: number;
  programming_notes?: string;
  question_type_id: number | string;
  question_title_formatted: string;
  description?: string;
  instructions?: string;
  can_have_quota: boolean;
  sorting_order?: number;
  answer_sorting_order?: number | string;
  // no_of_rows?: number;
  // no_of_columns?: number;
  answers: QuestionAnsTypes[];
  required_question?: boolean;
  show_codes?: boolean;

  no_of_answers?: number | string;
  no_of_answers_min?: number | string;
  no_of_answers_max?: number | string;
  no_of_answers_count?: number | string;
  capture_order?: boolean;

  // open-ended
  no_of_rows?: number | string;
  no_of_columns?: number | string;
  precision_value?: number | string;
  lower_limit?: number | string;
  upper_limit?: number | string;
  auto_sum?: boolean;
  multi_sum_equal?: number | string;
  lower_limit_type?: number | string;
  upper_limit_type?: number | string;

  concept: FilesTypes | null;

}

interface QuestionAnsTypes {
  question_answer_id: number | string;
  answer_id: number | string;
  question_answer_code: string;
  question_answer_text: string;
  add_other_option?: boolean;
  keep_answer_position?: boolean;
  sort_order?: number;
  is_terminate?: boolean;
  is_active?: boolean;

  analysis_group?: string | null;
  sub_class?: string | null;
  class?: string | null;

  concept?: FilesTypes | null;
}

interface QuestionBaseTypes {
  question_id: number | null;
  question_category_id: number | null;
  question_category: string;
  programming_notes: string;
  question_name: string;
  question_code: string;
  question_title: string;
  question_type_id: number | null;
  question_title_formatted: string;
  description?: string;
  instructions?: string;
  question_time?: number;

  question_data_code: string;
  concept: FilesTypes | null;

}

export type {
  SinglePunchProps,
  QuestionBaseTypes,
  QuestionAnsTypes,
  QuestionBaseCategoryTypes,
};
