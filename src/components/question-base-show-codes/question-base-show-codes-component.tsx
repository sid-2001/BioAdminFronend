import { QuestionBaseCategoryProps } from "./question-base-show-codes-types";
import { BoxWrapper } from "./question-base-show-codes.style";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import "../../global.css";
import { useEffect } from "react";
import { Tooltip } from "@mui/material";

const QuestionBaseShowCodes: React.FC<QuestionBaseCategoryProps> = ({
  questionBaseCategory,
  setQuestionBaseCategory,
}) => {
  useEffect(() => {
    let payload: any = { ...questionBaseCategory };
    if (questionBaseCategory?.show_codes) payload.show_codes = false;
    setQuestionBaseCategory(payload);
  }, []);

  return (
    <BoxWrapper>
      <Tooltip title="Show Details">
        <FormControlLabel
          className="configuration-box-sub-cont-switch-show_codes"
          control={
            <Switch
              size="small"
              className="configuration-box-sub-cont-switch-show_codes-sub"
              checked={questionBaseCategory?.show_codes ? true : false}
              color="primary"
              onChange={(e) => {
                let payload: any = { ...questionBaseCategory };
                payload.show_codes = e.target.checked;
                setQuestionBaseCategory(payload);
              }}
            />
          }
          label={""}
        />
      </Tooltip>
    </BoxWrapper>
  );
};

export default QuestionBaseShowCodes;
