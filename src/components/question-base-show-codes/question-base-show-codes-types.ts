import { QuestionBaseCategoryTypes } from "../questions-component/single-punch/single-punch-types";

interface QuestionBaseCategoryProps {
  questionBaseCategory: QuestionBaseCategoryTypes | null;
  setQuestionBaseCategory: React.Dispatch<
    React.SetStateAction<QuestionBaseCategoryTypes | null>
  >;
}

export type { QuestionBaseCategoryProps };
