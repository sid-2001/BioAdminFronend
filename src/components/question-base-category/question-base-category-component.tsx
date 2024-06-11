import { QuestionBaseCategoryProps } from "./question-base-category-types";
import { BoxWrapper, StyledLabel } from "./question-base-category.style";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const QuestionBaseCategory: React.FC<QuestionBaseCategoryProps> = ({
  questionBaseCategory,
  setQuestionBaseCategory,
  style,
}) => {
  return (
    <BoxWrapper>
      <FormControlLabel
        sx={{
          marginLeft: style ? "" : "1px",
          // marginBottom: style ? "" : "10px",
          // marginTop: style ? "" : "1rem",
        }}
        control={
          <Switch
            checked={questionBaseCategory?.required_question ? true : false}
            sx={{ marginTop: "5px",  }}
            color="primary"
            size="small"
            onChange={(e) => {
              let payload: any = { ...questionBaseCategory };
              payload.required_question = e.target.checked;
              setQuestionBaseCategory(payload);
            }}
          />
        }
        label={<StyledLabel>Required Question</StyledLabel>}
      />
    </BoxWrapper>
  );
};

export default QuestionBaseCategory;
