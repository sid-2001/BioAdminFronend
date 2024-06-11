import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  AddCustomQualificationComponentProps,
  CustomQual,
} from "./add-custom-qualification.type";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import TextField from "../text-field";
import Select from "@/components/select";
import { useEffect, useState } from "react";
import { MDInput } from "../questions-component/single-punch/single-punch.style";
import { Delete } from "@mui/icons-material";
import { QualificationService } from "@/services/qualification.service";
import { useSnackbar } from "notistack";
import { logger } from "@/helpers/logger";
import LoadingSpinner from "../loader";

const AddCustomQualificationComponent = (
  props: AddCustomQualificationComponentProps
) => {
  let {
    open,
    handleClose,
    getQualificationsData,
    getQualifications,
    setSelectedOptions,
    // CreateQuestionData,
  } = props;
  const [qualification, setQualifications] = useState<CustomQual>({
    name: "",
    type_id: null,
    category_id: 2,
    question: {
      text: "",
      sub_text: "",
      answers: [],
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  let qualificationServices = new QualificationService();
  const { enqueueSnackbar } = useSnackbar();

  const save = async () => {
    setIsLoading(true);
    let payload: any = { ...qualification };
    payload.question.answers = payload?.question?.answers.map(
      (value: any, i: number) => {
        return {
          pre_code: String(i),
          answer_text: value.answer_text,
        };
      }
    );

    try {
      let data: any =
        await qualificationServices.post_custom_qualification(qualification);

      enqueueSnackbar("Qualification saved sucessfully", {
        variant: "success",
      });
      await getQualifications();
      await getQualificationsData();
      setSelectedOptions([String(data?.id)]);
      setQualifications({
        name: "",
        type_id: null,
        category_id: 2,
        question: {
          text: "",
          sub_text: "",
          answers: [],
        },
      });
      setIsLoading(false);
      handleClose();
    } catch (e) {
      logger.log();
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let checkAns = false;
    if (qualification?.question?.answers?.length <= 0) {
      checkAns = true;
    } else {
      checkAns = qualification?.question?.answers.some(
        (value) => value.answer_text === ""
      );
    }

    if (
      qualification?.name === "" ||
      qualification?.question?.text === "" ||
      checkAns
    ) {
      setError(true);
    } else {
      setError(false);
    }
  }, [qualification]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Custom Qualification</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ marginTop: "0.5rem" }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Qualification Name"
                size="small"
                value={qualification?.name}
                onChange={(e) => {
                  let payload: any = { ...qualification };
                  payload.name = e.target.value;
                  setQualifications(payload);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                onChange={(e) => {
                  let payload: any = { ...qualification };
                  payload.type_id = e.target.value;
                  setQualifications(payload);
                }}
                value={
                  qualification?.type_id ? String(qualification?.type_id) : ""
                }
                size="small"
                items={[
                  { value: 1, text: "Single Select" },
                  { value: 2, text: "Multi Select" },
                ]}
                name="Qualification Type"
                label="Qualification Type"
                isRequired={true}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Qualification Question"
                size="small"
                value={qualification?.question?.text}
                onChange={(e) => {
                  let payload: any = { ...qualification };
                  payload.question.text = e.target.value;
                  setQualifications(payload);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: "1rem" }}>
                Qualification Answers
              </Typography>
              <Stack width="100%">
                {qualification?.question?.answers?.map((ans, i) => {
                  return (
                    <FormControlLabel
                      key={i}
                      sx={{
                        "span.MuiTypography-root.MuiTypography-body1.MuiFormControlLabel-label.css-e4pm5p-MuiTypography-root":
                          {
                            width: "100%",
                          },
                      }}
                      control={
                        <Checkbox checked={true} color="primary" size="small" />
                      }
                      label={
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <MDInput
                            sx={{ width: "80%" }}
                            variant="standard"
                            placeholder="Answer Text"
                            value={ans.answer_text}
                            fullWidth
                            autoFocus
                            onChange={(e) => {
                              let payload: any = { ...qualification };
                              payload.question.answers[i].answer_text =
                                e.target.value;
                              setQualifications(payload);
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => {
                              let payload: any = { ...qualification };
                              payload.question.answers.splice(i, 1);
                              setQualifications(payload);
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      }
                    />
                  );
                })}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <MDInput
                variant="standard"
                placeholder="Add Options"
                onFocus={() => {
                  let payload: any = { ...qualification };
                  payload.question.answers.push({
                    pre_code: "",
                    answer_text: "",
                  });
                  setQualifications(payload);
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              setQualifications({
                name: "",
                type_id: null,
                category_id: 2,
                question: {
                  text: "",
                  sub_text: "",
                  answers: [],
                },
              });
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              save();
            }}
            disabled={error || isLoading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddCustomQualificationComponent;
