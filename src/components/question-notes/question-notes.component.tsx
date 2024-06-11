import {
  Box,
  // FormControlLabel,
  // IconButton,
  Stack,
  // Switch,
  Typography,
  Grid,
  Tooltip,
} from "@mui/material";
import {
  // MDTextarea,
  StyledCardQuestionText,
  StyledContentBox,
  // StyledLabel,
} from "../question-types-base-comp/question-types-base.style";
import "../../index.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";
//@ts-ignore
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  useEffect,
  // useEffect
  useRef,
  useState,
} from "react";
import { QuestionNotesComponentProps } from "./question-notes.type";
// import { theme } from "@/constants/theme";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TextFieldNew from "../text-field-new/text-field-new.component";
import RttIcon from "@mui/icons-material/Rtt";
import { theme } from "@/constants/theme";

const QuestionNotesComponent = (props: QuestionNotesComponentProps) => {
  let { questionBase, setQuestionBase, isEdit } = props;
  const [editorProgramingNotes, setEditorProgramingNotes] = useState(false);
  const notesRef = useRef(null);
  // const instructionsRef = useRef<HTMLTextAreaElement>(null);
  // const [notesForProgramer, setNotesForProgramer] = useState(false);
  // const [collapse, setCollapse] = useState(false);
  const [useRichNotes, setRichNotes] = useState(false);

  // useEffect(() => {
  //   if (questionBase?.programming_notes) {
  //     setNotesForProgramer(true);
  //   } else {
  //     setNotesForProgramer(false);
  //   }
  // }, [questionBase]);

  function isHTML(str: string) {
    var a = document.createElement("div");
    a.innerHTML = str;

    for (var c = a.childNodes, i = c.length; i--; ) {
      if (c[i].nodeType == 1) return true;
    }

    return false;
  }

  useEffect(() => {
    if (isHTML(String(questionBase?.programming_notes))) {
      setRichNotes(true);
    }
  }, [questionBase]);

  return (
    <StyledContentBox
      sx={{
        padding: "0rem 0rem 0rem 0rem",
        // borderBottom: !collapse
        //   ? `2px solid ${theme.palette.primary.dark}`
        //   : "",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        display={isEdit ? "flex" : "none"}
        // sx={{
        //   borderBottom: collapse
        //     ? `2px solid ${theme.palette.primary.dark}`
        //     : "",
        //     // width: "98%"
        // }}
      >
        <Typography variant="h6" style={{ marginBottom: "0.5rem" }}>
          {" "}
          Notes
        </Typography>
        {/* <IconButton
          onClick={() => {
            setCollapse(!collapse);
          }}
        >
          <KeyboardArrowDownIcon
            sx={{ transform: collapse ? "rotate(180deg)" : "" }}
          />
        </IconButton> */}
      </Stack>
      {/* <StyledLabel
        className="question_type_base_bold_text"
        sx={{ marginBottom: "0.2rem !important" }}
        display={collapse ? "none" : ""}
      >
        Instructions
      </StyledLabel> */}
      {/* <MDTextarea
        sx={{
          display:
            questionBase?.question_type_id === 16 || collapse ? "none" : "",
        }}
        ref={instructionsRef}
        placeholder="Instructions"
        className="base-textarea-instructions"
        style={{ marginTop: "0rem", width: "98.5%" }}
        value={questionBase?.instructions}
        onChange={(e) => {
          let payload: any = { ...questionBase };
          payload.instructions = e.target.value;
          setQuestionBase(payload);
        }}
      /> */}
      {/* <TextFieldNew
        multiline
        rows={1}
        sx={{
          textarea: {
            resize: 'vertical',
            overflow: 'auto',
          },
          marginLeft: "0.1rem"

        }}
        ref={instructionsRef}
        placeholder="Instructions"
        // className="base-textarea-instructions"
        style={{ marginTop: "0rem", width: "98%" }}
        value={questionBase?.instructions}
        onChange={(e) => {
          let payload: any = { ...questionBase };
          payload.instructions = e.target.value;
          setQuestionBase(payload);
        }}
      // value={questionBase?.question_title_formatted
      //   ? questionBase?.question_title_formatted
      //   : ""}
      // placeholder="Question Title"
      // onChange={(e) => {
      //   const data = e.target.value;
      //   if (questionBase) {
      //     setQuestionBase({
      //       ...questionBase,
      //       question_title_formatted: data,
      //     });
      //   }
      // }}
      // onChange={(_e, editor: any) => {
      //   if (questionBase && editor) {
      //     const data = editor?.getData();
      //     if (ckEditorCheck) {
      //       setQuestionBase({
      //         ...questionBase,
      //         question_title_formatted: data,
      //       });
      //     }
      //   }
      // }}
      // {...register("description")}
      /> */}
      {/* <Box
        style={{
          display: collapse ? "none" : "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.5rem",
        }}
      >
        <FormControlLabel
          // className="base-notes-for-pro"
          sx={{
            display: questionBase?.question_type_id === 16 ? "none" : "",
          }}
          control={
            <Switch
              checked={notesForProgramer ? true : false}
              color="primary"
              onChange={(e) => {
                setNotesForProgramer(e.target.checked);
                if (e.target.checked === false) {
                  let payload: any = { ...questionBase };
                  payload.programming_notes = "";
                  setQuestionBase(payload);
                }
              }}
            />
          }
          label={
            <StyledLabel sx={{ paddingTop: "0rem" }}>
              Programing Notes
            </StyledLabel>
          }
        />
      </Box> */}

      {/* {notesForProgramer ? ( */}
      {/* <StyledLabel
        sx={{
          // paddingTop: "0.5rem",
          display:
            questionBase?.question_type_id === 16 || collapse ? "none" : "",
        }}
      >
        Programing Notes
      </StyledLabel> */}
      <Grid container spacing={0}>
        <Grid item xs={11.2}>
          <StyledCardQuestionText
            sx={{
              display: questionBase?.question_type_id === 16 ? "none" : "",
              width: "100%",
            }}
          >
            {useRichNotes ? (
              <CKEditor
                ref={notesRef}
                editor={Editor as any}
                data={
                  questionBase?.programming_notes
                    ? questionBase?.programming_notes
                    : ""
                }
                onReady={(_editor) => {
                  if (!editorProgramingNotes) {
                    setEditorProgramingNotes(true);
                  }
                }}
                onChange={(_e, editor: any) => {
                  if (questionBase && editor) {
                    const data = editor.getData();
                    if (editorProgramingNotes) {
                      setQuestionBase({
                        ...questionBase,
                        programming_notes: data,
                      });
                    }
                  }
                }}
              />
            ) : (
              <TextFieldNew
                multiline
                rows={1}
                sx={{
                  textarea: {
                    resize: "vertical",
                    overflow: "auto",
                  },
                  marginLeft: "0.1rem",
                }}
                ref={notesRef}
                placeholder="Programing Notes"
                // className="base-textarea-instructions"
                style={{ marginTop: "0rem", width: "100%" }}
                value={questionBase?.programming_notes}
                onChange={(e) => {
                  let payload: any = { ...questionBase };
                  payload.programming_notes = e.target.value;
                  setQuestionBase(payload);
                }}
              />
            )}
          </StyledCardQuestionText>
        </Grid>
        <Grid item xs={0.5}>
          <Box style={{ marginLeft: "0.5rem" }}>
            <Tooltip title={useRichNotes ? "Use Text Box" : " Use Rich Text"}>
              <RttIcon
                width={12}
                onClick={() => setRichNotes(!useRichNotes)}
                style={{
                  cursor: "pointer",
                  backgroundColor: useRichNotes
                    ? `${theme.palette.primary.main}`
                    : "#ffffff",
                  borderRadius: "4px",
                }}
              />
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
      {/* ) : (
        ""
      )} */}
    </StyledContentBox>
  );
};

export default QuestionNotesComponent;
