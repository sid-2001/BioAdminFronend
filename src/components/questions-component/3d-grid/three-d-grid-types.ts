import { FilesTypes } from '@/components/project-media-upload-modal/project-media-upload-modal.type'
import { SortingListTypes } from '@/components/project-survey-builder/project-survey-builder.type'
import { ThemeTypes } from '@/types/builder-theme-type'
import { Question, QuestionBaseCategoryTypes } from '@/types/survey-builder.type'

interface ThreeDGridProps {
  question?: QuestionTypes
  surveyQuestionId?: number
  SaveQuestion: (data: any) => void
  add?: boolean
  editFalse?: boolean
  setEditFalse?: React.Dispatch<React.SetStateAction<boolean>>
  loading?: boolean
  setQuestionPreview?: React.Dispatch<any>
  questionPreview?: any
  sortingList?: SortingListTypes[]
  questionTheme?: ThemeTypes
  setQuestionCompare?: any
  projectTypeId?: number


  uploadMediaModalSelect: boolean;
  setUploadMediaModalSelect: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFileQuestionTitle: FilesTypes | null;
  setSelectedFileQuestionTitle: React.Dispatch<React.SetStateAction<FilesTypes | null>>;
}

interface QuestionTypes {
  question_data_code: string

  question_id: number | null
  question_category_id: number | string
  question_category: string
  question_name: string
  question_code: string
  question_title: string
  question_time?: number
  programming_notes?: string
  question_type_id: number | string
  question_title_formatted: string
  description: string
  instructions: string
  can_have_quota: boolean
  prompt_sorting_order?: number | string
  prompt_group_sorting_order?: number | string
  answer_sorting_order?: number | string
  sorting_order?: number
  required_question?: boolean
  rows?: number
  columns?: number
  show_codes?: boolean
  prompt_show_code?: boolean
  answers: QuestionAnsTypes[]
  prompt_answer?: PromptAnsTypes[]

  question_parts?: PromptAnsTypes[]
  sub_questions?: Question[]

  concept: FilesTypes | null;

}

interface QuestionAnsTypes {
  question_answer_id: number | string
  question_answer_code: string
  question_answer_text: string
  keep_answer_position?: boolean
  sort_order?: number
  is_terminate?: boolean
  is_active?: boolean
  add_other_option?: boolean
  is_exclusive?: boolean

  analysis_group?: string | null
  sub_class?: string | null
  class?: string | null
}

interface PromptAnsTypes {
  prompt_id: number | null
  prompt_code: string
  prompt_text: string
  add_other_option: boolean
  keep_answer_position: boolean
  sort_order?: number
  is_active: boolean
  is_exclusive?: boolean
  question_text?: string;

  concept?: FilesTypes | null;
}

interface QuestionBaseTypes {
  question_id: number | null
  question_category_id: number | null
  question_category: string
  programming_notes: string
  question_name: string
  question_code: string
  question_title: string
  question_type_id: number | null
  question_title_formatted: string
  description?: string
  instructions?: string
  question_time?: number

  question_data_code: string

  concept: FilesTypes | null;

}

export type { ThreeDGridProps, QuestionBaseTypes, QuestionAnsTypes, QuestionBaseCategoryTypes, PromptAnsTypes }
