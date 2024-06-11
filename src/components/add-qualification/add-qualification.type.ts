interface OptionsType {
  id: string;
  name: string;
  isActive: boolean;
  type_id: number;
  category_id: number;
  code: string;
}

interface QualificationType {
  id: string
  name: string
  qualificationTypeId: number
  qualificationCategoryId: number
  questionText: string
  qualificationQuestionId: string
  selectedRange: {
    min: string
    max: string
  }[]
  answers: {
    id: number
    label: string
  }[]
  selectedAnswers: number[]
  text: string
}

interface AddQualificationComponentProps {
  getQualificationsData: () => Promise<void>;
  qualificationsData: any;
}

export type { OptionsType, QualificationType, AddQualificationComponentProps };
