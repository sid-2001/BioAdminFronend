// import { QuestionBaseCategoryTypes } from "../question-type-components/single-punch/single-punch-types";/
import { QuestionBaseCategoryTypes } from "@/types/survey-builder.type";

interface QuestionBaseCategoryProps {
  questionBaseCategory: QuestionBaseCategoryTypes | null;
  setQuestionBaseCategory: React.Dispatch<
    React.SetStateAction<QuestionBaseCategoryTypes | null>
  >;
  style?: boolean;
}

export type { QuestionBaseCategoryProps };
