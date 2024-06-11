import { QuestionBaseCategoryProps } from "./question-base-capture-order-types";
import { BoxWrapper, StyledLabel } from "./question-base-capture-order.style";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const QuestionBaseCaptureOrder: React.FC<QuestionBaseCategoryProps> = ({
  questionBaseCategory,
  setQuestionBaseCategory,
}) => {
  return (
    <BoxWrapper>
      <FormControlLabel
        // className="configuration-box-sub-cont-form-control"
        control={
          <Switch
            size="small"
            checked={questionBaseCategory?.capture_order ? true : false}
            className="configuration-box-sub-cont-switch"
            color="primary"
            onChange={(e) => {
              let payload: any = { ...questionBaseCategory };
              payload.capture_order = e.target.checked;
              setQuestionBaseCategory(payload);
            }}
          />
        }
        label={<StyledLabel style={{ marginLeft: "-0.5rem" }}>Capture order</StyledLabel>}
      />
    </BoxWrapper>
  );
};

export default QuestionBaseCaptureOrder;
