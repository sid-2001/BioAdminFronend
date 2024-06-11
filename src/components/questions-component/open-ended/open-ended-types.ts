import { FilesTypes } from "@/components/project-media-upload-modal/project-media-upload-modal.type";
import { QuestionListTypes } from "@/components/project-survey-builder/project-survey-builder.type";
import { ThemeTypes } from "@/types/builder-theme-type";
import { QuestionBaseCategoryTypes } from "@/types/survey-builder.type";

interface OpenEndedProps {
  question?: QuestionTypes;
  surveyQuestionId?: number;
  SaveQuestion: (data: any) => void;
  add?: boolean;
  editFalse?: boolean;
  setEditFalse?: React.Dispatch<React.SetStateAction<boolean>>;
  loading?: boolean;
  setQuestionPreview?: React.Dispatch<any>;
  questionPreview?: any;
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
  question_id: number | null;
  question_category_id: number | string;
  question_category: string;
  question_name: string;
  question_time?: number;
  question_code: string;
  question_title: string;
  programming_notes?: string;
  question_type_id: number | string;
  question_title_formatted: string;
  description?: string;
  instructions?: string;
  can_have_quota: boolean;
  sorting_order?: number | string;
  no_of_columns?: string | number;
  no_of_rows?: string | number;
  answers?: QuestionAnsTypes[];
  no_of_answers?: number | string;
  input_suffix?: string;
  input_prefix?: string;
  required_question?: boolean;

  question_data_code: string;

  concept: FilesTypes | null;


}

interface QuestionAnsTypes {
  question_answer_id: number | string;
  question_answer_code: string;
  question_answer_text: string;
  add_other_field: boolean;
  lock_position: boolean;
  answer_sort_order?: number;
}

interface QuestionBaseTypes {
  question_id: number | null;
  question_category_id: number | null;
  question_category: string;
  programming_notes: string;
  question_name: string;
  question_code: string;
  instructions?: string;
  question_title: string;
  question_type_id: number | null;
  question_title_formatted: string;
  description?: string;
  question_time?: number;

  question_data_code: string;

  concept: FilesTypes | null;


}

export type {
  OpenEndedProps,
  QuestionBaseTypes,
  QuestionAnsTypes,
  QuestionBaseCategoryTypes,
};
