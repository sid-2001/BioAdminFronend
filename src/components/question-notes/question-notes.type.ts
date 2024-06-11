import { QuestionBaseTypes } from "../questions-component/single-punch/single-punch-types";

interface QuestionNotesComponentProps {
  questionBase: QuestionBaseTypes | null;
  setQuestionBase: React.Dispatch<
    React.SetStateAction<QuestionBaseTypes | null>
  >;
  isEdit?: boolean;
}

export type { QuestionNotesComponentProps };
