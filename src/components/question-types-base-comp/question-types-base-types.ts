import { ThemeTypes } from "@/types/builder-theme-type";
import { FilesTypes } from "../project-media-upload-modal/project-media-upload-modal.type";

interface QuestionTypeBaseCompTypes {
  questionBase: QuestionBaseTypes | null;
  setQuestionBase: React.Dispatch<
    React.SetStateAction<QuestionBaseTypes | null>
  >;
  isEdit?: boolean;
  questionTheme?: ThemeTypes;


  uploadMediaModalSelect: boolean;
  setUploadMediaModalSelect: React.Dispatch<React.SetStateAction<boolean>>;


  selectedFileQuestionTitle: FilesTypes | null;
  setSelectedFileQuestionTitle: React.Dispatch<React.SetStateAction<FilesTypes | null>>;

  loading?: boolean | undefined;

  uploadAnswerIndex?: number | null;
  setUploadAnswerIndex?: React.Dispatch<React.SetStateAction<number | null>>;

  setUploadPromptIndex?: React.Dispatch<React.SetStateAction<number | null>>;
}

interface QuestionBaseTypes {
  question_id: number | null;
  question_category_id: number | null;
  question_category: string;
  question_name: string;
  programming_notes: string;
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

export type { QuestionTypeBaseCompTypes };
