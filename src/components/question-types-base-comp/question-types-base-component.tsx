import { QuestionTypeBaseCompTypes } from './question-types-base-types'
import {
  ErrorBox,
  ItalicText,
  // MDInput,
  // StyledCardQuestionHeadingTitle,
  StyledCardQuestionText,
  StyledContentBox,
  // StyledHeadingBox,
  // StyledLabel,
  // StyledLabelBold,
  // StyledLabelBold,
} from './question-types-base.style'
import { Grid, Stack, Box, Tooltip, ImageListItem, ImageListItemBar, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import '../../index.css'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from "ckeditor5-custom-build";
//@ts-ignore
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { theme } from '@/constants/theme'
// import { StyledQuestionBaseDivider } from "../questions-component/single-punch/single-punch.style";
// import TextField from "../text-field";
import TextFieldNew from '../text-field-new/text-field-new.component'
import RttIcon from '@mui/icons-material/Rtt'
import BurstModeIcon from '@mui/icons-material/BurstMode';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'


interface ShowConceptProps {
  selectedFileQuestionTitle: any;
  questionBase: any;
  setSelectedFileQuestionTitle: any;
  setQuestionBase: any;
  hide?: boolean;
}
function ShowConcept({
  selectedFileQuestionTitle,
  questionBase,
  setSelectedFileQuestionTitle,
  setQuestionBase,
  hide,
}: ShowConceptProps) {
  if (!selectedFileQuestionTitle?.type && !questionBase?.concept?.file_url) {
    return null;
  }

  const file = selectedFileQuestionTitle || questionBase?.concept;

  let fileType;
  if (typeof file?.type === 'string') {
    if (file.type.startsWith('image')) {
      fileType = 1;
    } else if (file.type.startsWith('video')) {
      fileType = 2;
    } else if (file.type.startsWith('audio')) {
      fileType = 3;
    }
  } else if (questionBase?.concept?.type) {
    fileType = questionBase.concept.type;
  }

  const handleDelete = () => {
    if (selectedFileQuestionTitle) {
      setSelectedFileQuestionTitle(null);
    } else if (questionBase?.concept?.file_url) {
      let payload = { ...questionBase };
      payload.concept_id = null;
      payload.concept = null;
      setQuestionBase(payload);
      setSelectedFileQuestionTitle(null);
    }
  };

  console.log(file, fileType, "file_urlfile_urlfile_urlfile_urlfile_urlfile_url");

  return (
    <Grid item xs={12} spacing={0}>
      <ImageListItem style={{}}>
        {fileType === 1 && (
          <img
            src={file.file_url}
            alt={file.file_name}
            loading="lazy"
            style={{ maxHeight: "300px", objectFit: "contain", width: "100%" }}
          />
        )}
        {fileType === 2 && (
          <video
            src={file.file_url}
            controls
            style={{ height: "300px", width: "100%", objectFit: "contain" }}
          />
        )}
        {fileType === 3 && (
          <audio
            src={file.file_url}
            controls
            style={{ width: '100%' }}
          />
        )}

        <ImageListItemBar
          title={file.concept_name}
          position="below"
          actionIcon={
            !hide && (
              <IconButton onClick={handleDelete}>
                <DeleteOutlineIcon fontSize="small" color="error" />
              </IconButton>)
          }
        />

      </ImageListItem>
    </Grid>
  );
}

const QuestionTypeBaseComp: React.FC<QuestionTypeBaseCompTypes> = ({ questionBase, setQuestionBase,
  isEdit, questionTheme, setUploadMediaModalSelect, uploadMediaModalSelect, selectedFileQuestionTitle,
  setSelectedFileQuestionTitle, setUploadAnswerIndex, setUploadPromptIndex }) => {
  const [ckEditorCheck, setCkEditorCheck] = useState(false)
  // const [collapse, setCollapse] = useState(false);
  const [useRichText, setUseRichText] = useState(false)
  const [useRichDesc, setRichDecs] = useState(false)
  const quillRef = React.useRef(null)
  const instructionsRef = React.useRef(null)

  function isHTML(str: string) {
    var a = document.createElement('div')
    a.innerHTML = str

    for (var c = a.childNodes, i = c.length; i--;) {
      if (c[i].nodeType == 1) return true
    }

    return false
  }

  useEffect(() => {
    if (isHTML(String(questionBase?.question_title_formatted))) {
      setUseRichText(true)
    }
    if (isHTML(String(questionBase?.instructions))) {
      setRichDecs(true)
    }
  }, [questionBase])

  // let imageShow = selectedFileQuestionTitle || (questionBase?.concept?.file_url ? questionBase?.concept : null)

  // console.log(selectedFileQuestionTitle, questionBase?.concept, "questionBase?.conceptquestionBase?.concept", imageShow)



  return (
    <StyledContentBox sx={{ padding: isEdit ? '0rem 0.5rem 0rem 0rem' : '0rem 0rem 0rem 0rem' }}>
      {/* <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        display={isEdit ? "flex" : "none"}
        sx={{
          borderBottom: collapse
            ? `2px solid ${theme.palette.primary.dark}`
            : "",
          marginBottom: !collapse ? "1rem" : "",
        }}
      >
        <Typography variant="h6"> Details</Typography>
        <IconButton
          onClick={() => {
            setCollapse(!collapse);
          }}
        >
          <KeyboardArrowDownIcon
            sx={{ transform: collapse ? "rotate(180deg)" : "" }}
          />
        </IconButton>
      </Stack> */}
      {isEdit ? (
        <>
          <Grid
            container
            spacing={2}
          // marginBottom="0.5rem"
          // display={collapse ? "none" : ""}
          >
            {/* <Grid item xs={2}>
              <StyledCardQuestionHeadingTitle>
                <MDInput
                  className="base-comp-question_code-input"
                  placeholder="Code*"
                  size="small"
                  fullWidth
                  value={questionBase?.question_code}
                  onChange={(e) => {
                    let payload: any = { ...questionBase };
                    payload.question_code = e.target.value;
                    setQuestionBase(payload);
                  }}
                />
                {questionBase?.question_code === "" ? (
                  <ErrorBox style={{ marginLeft: "0.5rem" }}>Required</ErrorBox>
                ) : (
                  ""
                )}
              </StyledCardQuestionHeadingTitle>
            </Grid> */}
            {/* <Grid item xs={12}>
              <StyledCardQuestionHeadingTitle>
                <MDInput
                  placeholder="Question Name*"
                  className="base-comp-question_code-input"
                  size="small"
                  fullWidth
                  value={questionBase?.question_name}
                  onChange={(e) => {
                    let payload: any = { ...questionBase };
                    payload.question_name = e.target.value;
                    setQuestionBase(payload);
                  }}
                />
                {questionBase?.question_name === "" ? (
                  <ErrorBox>This Field is required</ErrorBox>
                ) : (
                  ""
                )}
              </StyledCardQuestionHeadingTitle>
            </Grid> */}
          </Grid>

          <Stack
            justifyContent="space-between"
            direction="row"
            // display={collapse ? "none" : ""}
            style={{ marginBottom: '1rem ', marginTop: '1rem' }}
          >
            {/* <StyledLabel
              className="question_type_base_bold_text"
              sx={{ marginBottom: "0.2rem !important", }}
            >
              Question Title
            </StyledLabel> */}
          </Stack>
          <Grid container style={{ marginBottom: useRichText ? '0.5rem' : '0rem' }}>
            {/* {(questionBase?.question_type_id !== 3 && questionBase?.question_type_id !== 5 && questionBase?.question_type_id !== 6) && */}
            <ShowConcept
              selectedFileQuestionTitle={selectedFileQuestionTitle}
              questionBase={questionBase}
              setSelectedFileQuestionTitle={setSelectedFileQuestionTitle}
              setQuestionBase={setQuestionBase}
            />
            {/* } */}
            <Grid item xs={10.8} spacing={0}>
              <StyledCardQuestionText>
                {useRichText ? (
                  <>
                    <CKEditor
                      ref={quillRef}
                      editor={Editor as any}
                      data={questionBase?.question_title_formatted ? questionBase?.question_title_formatted : ''}
                      config={{
                        toolbar: {
                          items: [
                            "undo",
                            "redo",
                            "|",
                            "heading",
                            "|",
                            "bold",
                            "italic",
                            "underline",
                            "fontFamily",
                            "fontColor",
                            "fontSize",
                            "|",
                            "link",
                            "mediaEmbed",
                            "insertTable",
                            "tableToolbar",
                            "|",
                            "bulletedList",
                            "numberedList",
                            "|",
                            // "imageUpload",
                            // "blockQuote", 
                            // "|",
                          ]
                        }
                      }}
                      onReady={(_editor) => {
                        if (!ckEditorCheck) {
                          setCkEditorCheck(true)
                        }
                      }}
                      onChange={(_e, editor: any) => {
                        if (questionBase && editor) {
                          const data = editor?.getData()
                          if (ckEditorCheck) {
                            setQuestionBase({
                              ...questionBase,
                              question_title_formatted: data,
                            })
                          }
                        }
                      }}
                    />
                    {questionBase?.question_title_formatted === '' ? <ErrorBox>This Field is required</ErrorBox> : ''}
                  </>
                ) : (
                  <TextFieldNew
                    multiline
                    rows={1}
                    sx={{
                      textarea: {
                        resize: 'vertical',
                        overflow: 'auto',
                      },
                      marginLeft: '0.1rem',
                    }}
                    value={questionBase?.question_title_formatted ? questionBase?.question_title_formatted : ''}
                    placeholder="Question Title"
                    onChange={(e) => {
                      const data = e.target.value
                      if (questionBase) {
                        setQuestionBase({
                          ...questionBase,
                          question_title_formatted: data,
                        })
                      }
                    }}
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
                  />
                )}
              </StyledCardQuestionText>
            </Grid>

            <Grid item xs={0.5}>
              <Box style={{ marginLeft: '0.5rem' }}>
                <Tooltip title={useRichText ? 'Use Text Box' : ' Use Rich Text'}>
                  <RttIcon
                    width={12}
                    onClick={() => setUseRichText(!useRichText)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: useRichText ? `${theme.palette.primary.main}` : '#ffffff',
                      borderRadius: '4px',
                    }}
                  />
                </Tooltip>
              </Box>
            </Grid>
            {/* {(questionBase?.question_type_id !== 3 && questionBase?.question_type_id !== 5 && questionBase?.question_type_id !== 6) && */}
            <Grid item xs={0.5}>
              <Box style={{ marginLeft: '0.8rem' }}>
                <Tooltip title={'Attach concept'}>
                  <BurstModeIcon 
                    width={12}
                    onClick={() => {
                      if (setUploadAnswerIndex) {
                        setUploadAnswerIndex(null)
                      }
                      if (setUploadPromptIndex) {
                        setUploadPromptIndex(null)
                      }
                      setUploadMediaModalSelect(true)
                    }}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: uploadMediaModalSelect ? `${theme.palette.primary.main}` : '#ffffff',
                      borderRadius: '4px',
                    }}
                  />
                </Tooltip>
              </Box>
            </Grid>
            {/* } */}
          </Grid>
          <Grid container>
            <Grid item xs={11.3} spacing={0}>
              <StyledCardQuestionText>
                {useRichDesc ? (
                  <CKEditor
                    ref={instructionsRef}
                    editor={Editor as any}
                    data={questionBase?.instructions ? questionBase?.instructions : ''}
                    config={{
                      toolbar: {
                        items: [
                          "undo",
                          "redo",
                          "|",
                          "heading",
                          "|",
                          "bold",
                          "italic",
                          "underline",
                          "fontFamily",
                          "fontColor",
                          "fontSize",
                          "|",
                          "link",
                          "mediaEmbed",
                          "insertTable",
                          "tableToolbar",
                          "|",
                          "bulletedList",
                          "numberedList",
                          "|",
                          // "imageUpload",
                          // "blockQuote", 
                          // "|",
                        ]
                      }
                    }}
                    onReady={(_editor) => {
                      if (!ckEditorCheck) {
                        setCkEditorCheck(true)
                      }
                    }}
                    onChange={(_e, editor: any) => {
                      if (questionBase && editor) {
                        const data = editor?.getData()
                        if (ckEditorCheck) {
                          setQuestionBase({
                            ...questionBase,
                            instructions: data,
                          })
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
                        resize: 'vertical',
                        overflow: 'auto',
                      },
                      marginLeft: '0.1rem',
                    }}
                    ref={instructionsRef}
                    placeholder="Description(optional)"
                    // className="base-textarea-instructions"
                    style={{ marginTop: '0rem', width: '100%' }}
                    value={questionBase?.instructions}
                    onChange={(e) => {
                      let payload: any = { ...questionBase }
                      payload.instructions = e.target.value
                      setQuestionBase(payload)
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
                  />
                )}
              </StyledCardQuestionText>
            </Grid>
            <Grid item xs={0.5}>
              <Box style={{ marginLeft: '0.5rem' }}>
                <Tooltip title={useRichText ? 'Use Text Box' : ' Use Rich Text'}>
                  <RttIcon
                    width={12}
                    onClick={() => setRichDecs(!useRichDesc)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: useRichDesc ? `${theme.palette.primary.main}` : '#ffffff',
                      borderRadius: '4px',
                    }}
                  />
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
          {/* <StyledQuestionBaseDivider
            isEdit={isEdit}
            sx={{
              border: `1px solid ${theme.palette.primary.dark}`,
              display: collapse ? "none" : "",
              width: "98%"
            }}
          /> */}
        </>
      ) : (
        <>
          {!isEdit && (selectedFileQuestionTitle || questionBase) &&
            <ShowConcept
              selectedFileQuestionTitle={selectedFileQuestionTitle}
              questionBase={questionBase}
              setSelectedFileQuestionTitle={setSelectedFileQuestionTitle}
              setQuestionBase={setQuestionBase} hide={true}
            />}
          {!isEdit && questionBase?.programming_notes && questionBase?.question_type_id == 6 ? (
            <>
              <StyledCardQuestionText style={{ padding: '0.5rem 0rem 0.5rem 2.25rem' }}>
                <ItalicText
                  className="ql-editor"
                  style={{
                    fontFamily: questionTheme?.fontFamily ? questionTheme?.fontFamily : '',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: questionBase && questionBase?.programming_notes ? questionBase.programming_notes : '',
                  }}
                ></ItalicText>
              </StyledCardQuestionText>
            </>
          ) : null}
          {questionBase?.question_type_id === 16 ? (
            <StyledCardQuestionText
              style={{
                fontWeight: 700,
                //  paddingLeft: "2.25rem"
              }}
            >
              <ItalicText
                className="ql-editor"
                style={{
                  fontFamily: questionTheme?.fontFamily ? questionTheme?.fontFamily : '',
                }}
                dangerouslySetInnerHTML={{
                  __html: questionBase && questionBase?.question_title_formatted ? questionBase.question_title_formatted : '',
                }}
              ></ItalicText>
            </StyledCardQuestionText>
          ) : (
            <>
              <StyledCardQuestionText
                style={{
                  // paddingLeft: "2.25rem",
                  fontSize: '24px',
                  lineHeight: '32px',
                  fontWeight: 400,
                  fontFamily: questionTheme?.fontFamily ? questionTheme?.fontFamily : '',
                  color: questionTheme?.questions?.color ? questionTheme?.questions?.color : '',
                }}
                className="ql-editor"
                dangerouslySetInnerHTML={{
                  __html: questionBase && questionBase?.question_title_formatted ? questionBase?.question_title_formatted : '',
                }}
              ></StyledCardQuestionText>
            </>
          )}

          {questionBase?.instructions && questionBase?.instructions !== '' && (
            <>
              {/* <StyledLabel className="base-question-instruction-label">
                Instructions
              </StyledLabel> */}
              <StyledCardQuestionText
                sx={{
                  paddingTop: '0.5rem',

                  // paddingLeft: "2.25rem" /
                }}
              >
                <i
                  style={{
                    fontFamily: questionTheme?.fontFamily ? questionTheme?.fontFamily : '',
                    // color: questionTheme?.instructions?.color
                    //   ? questionTheme?.instructions?.color
                    //   : "black",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: questionBase && questionBase?.instructions ? questionBase?.instructions : '',
                  }}
                ></i>
              </StyledCardQuestionText>
            </>
          )}
        </>
      )}
    </StyledContentBox>
  )
}

export default QuestionTypeBaseComp
