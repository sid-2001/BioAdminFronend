interface AddCustomQualificationComponentProps {
  open: boolean;
  handleClose: any;
  getQualificationsData: any;
  getQualifications: () => Promise<void>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  CreateQuestionData: () => Promise<void>;
}

interface CustomAns {
  label: string;
}

interface CustomQual {
  name: string;
  type_id: number | null;
  category_id: number;
  question: {
    text: string;
    sub_text: string;
    answers:
      | [
          {
            pre_code: string;
            answer_text: string;
          },
        ]
      | [];
  };
}

export type { AddCustomQualificationComponentProps, CustomAns, CustomQual };
