import React, { useEffect, useState } from 'react'
import { MultiPreviewerComponentProps } from './multi-previewer.type'
import { Question, Section } from '@/types/survey-builder.type'
import { MDInput } from '../question-types-base-comp/question-types-base.style'
import { StyledCardAnswerText } from '../question-base-category/question-base-category.style'
import { theme } from '@/constants/theme'
import { Box, Button, Stack, Typography } from '@mui/material'
import { asBlob } from 'html-docx-js-typescript'
import { saveAs } from 'file-saver'

const MultiPreviewerComponent = (props: MultiPreviewerComponentProps) => {
  let { sections, project, exportBbProjectDoc, setExportBbProjectDoc } = props
  const [exportTrue, setExportTrue] = React.useState(false)
  const [sectionData, setSectionData] = useState<any>([])

  useEffect(() => {
    setSectionData(sections)
  }, [sections])

  const ExoprtDoc = (element: any) => {
    // var header =
    //   "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    //   "xmlns:w='urn:schemas-microsoft-com:office:word' " +
    //   "xmlns='http://www.w3.org/TR/REC-html40'>" +
    //   "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
    // var footer = "</body></html>";
    // var sourceHTML: any =
    //   header + (document as any).getElementById(element).innerHTML + footer;
    // // var source =
    // //   "data:application/vnd.ms-word;charset=utf-8," +
    // //   encodeURIComponent(sourceHTML)
    // // var fileDownload = document.createElement("a")
    // // document.body.appendChild(fileDownload)
    // // fileDownload.href = source
    // // fileDownload.download = `${project?.project_name}_${project?.project_id}_v${0}.docx`
    // // fileDownload.click()
    // // document.body.removeChild(fileDownload)

    // asBlob(sourceHTML).then((data: any) => {
    //   saveAs(
    //     data,
    //     `${project?.project_name}_${project?.project_id}_v${0}.docx`
    //   ); // save as docx file
    // });
    // setExportTrue(false);
    var header = '<!DOCTYPE html>' + "<html lang='en'>" + "<head><meta charset='UTF-8'><title>Document</title></head><body>"
    var footer = '</body></html>'
    var sourceHTML: any = header + (document as any).getElementById(element).innerHTML + footer
    // var source =
    //   "data:application/vnd.ms-word;charset=utf-8," +
    //   encodeURIComponent(sourceHTML)
    // var fileDownload = document.createElement("a")
    // document.body.appendChild(fileDownload)
    // fileDownload.href = source
    // fileDownload.download = `${project?.project_name}_${project?.project_id}_v${0}.docx`
    // fileDownload.click()
    // document.body.removeChild(fileDownload)

    asBlob(sourceHTML).then((data: any) => {
      saveAs(data, `${project?.project_name}_${project?.project_id}_v${0}.docx`) // save as docx file
    })
    setExportTrue(false)
    setExportBbProjectDoc(false)
  }

  useEffect(() => {
    if (exportBbProjectDoc) {
      setExportTrue(true)
      ExoprtDoc('exportContent')
    }
  }, [exportBbProjectDoc])

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          position: 'sticky',
          top: '0',
          background: 'white',
          paddingTop: '1rem',
        }}
      >
        <Box>
          <Typography variant="h6">Multi Preview</Typography>
        </Box>
        <Stack direction="row" alignItems="center" gap="10px">
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setExportTrue(true)
              setTimeout(() => {
                ExoprtDoc('exportContent')
              }, 2000)
            }}
          >
            Export Docx
          </Button>
        </Stack>
      </Stack>

      <div id="exportContent">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '1rem',
            // paddingTop: "500px",
          }}
        >
          {/* <div style={{ fontSize: "23px", fontFamily: "Arial" }}>
          {surveyData?.template_name}
        </div>
        <br />
        <div style={{ color: "red", fontSize: "23px", fontFamily: "Arial" }}>
          CONFIDENTIAL
        </div> */}
        </div>
        {/* <br style={{ pageBreakBefore: "always", clear: "both" }} /> */}
        {sectionData?.map((sectionPreviewData: Section, ind: number) => {
          return (
            <div key={ind}>
              <h2
                className="color-section"
                style={{
                  fontSize: '21px',
                  fontFamily: 'Arial',
                  color: '#508cc2',
                  marginBottom: '25px',
                }}
              >
                {sectionPreviewData.section_code}. {sectionPreviewData.section_name}
              </h2>
              {/* <br /> */}
              {sectionPreviewData?.questions?.map((question: Question, i) => {
                return (
                  <div key={i}>
                    <h3
                      style={{
                        marginLeft: '0rem',
                        marginTop: question.answers.length <= 0 ? '1rem' : '',
                        color: question.question_type_id === 16 ? '#508cc2' : '',
                        fontSize: question.question_type_id === 16 ? '21px' : '14.5px',
                        fontWeight: 'bold',
                        fontFamily: 'Arial',
                      }}
                    >
                      <span
                        style={{
                          display: question.question_type_id === 16 ? 'none' : '',
                        }}
                      >
                        {question.question_code}.{' '}
                      </span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: question && question?.question_name ? question.question_name : '',
                        }}
                      ></span>
                    </h3>
                    <div
                      style={{
                        color: '#508cc2',
                        marginTop: '1rem',
                        display: !question?.programming_notes ? 'none' : '',
                        fontSize: '14.5px',
                        fontFamily: 'Arial',
                      }}
                    >
                      <i
                        className="ql-editor"
                        style={{ padding: '0px' }}
                        dangerouslySetInnerHTML={{
                          __html: question && question?.programming_notes ? question.programming_notes : '',
                        }}
                      ></i>
                    </div>

                    <div
                      style={{
                        marginTop: question?.programming_notes ? '1rem' : '1rem',
                      }}
                    >
                      <div
                        className="ql-editor"
                        style={{
                          padding: '0px',
                          color: question.question_type_id === 16 ? '#508cc2' : '',
                          fontSize: '14.5px',
                          fontFamily: 'Arial',
                        }}
                        dangerouslySetInnerHTML={{
                          __html: question && question?.question_title_formatted ? question?.question_title_formatted : '',
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        marginTop: '1rem',
                        fontSize: '14.5px',
                        fontFamily: 'Arial',
                        display: question?.instructions ? '' : 'none',
                      }}
                    >
                      <i>{question?.instructions}</i>
                    </div>

                    <div
                      style={{
                        display: question.answers.length <= 0 ? 'none' : '',
                      }}
                    >
                      {question.question_type_id === 7 || question.question_type_id === 8 ? (
                        question.answers?.map((answer: any, ansI) => {
                          return (
                            <div
                              style={{
                                marginLeft: '2rem',
                                display: 'flex',
                                alignItems: 'flex-end',
                                fontSize: '14.5px',
                                fontFamily: 'Arial',
                              }}
                              key={ansI}
                            >
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: answer && answer?.question_answer_text ? answer.question_answer_text : '',
                                }}
                              ></span>
                              {!exportTrue ? (
                                <MDInput disabled variant="standard" size="small" sx={{ width: '100px' }} type="number" />
                              ) : (
                                '................'
                              )}
                            </div>
                          )
                        })
                      ) : question.question_type_id === 13 ? (
                        <div
                          style={{
                            paddingTop: '1rem',
                          }}
                        >
                          <table border={1} style={{ borderCollapse: 'collapse' }}>
                            <tr>
                              <th></th>
                              {question?.answers?.map((ans, ansIndex) => (
                                <th
                                  style={{
                                    fontSize: '13.5px',
                                    fontWeight: 500,
                                    fontFamily: 'Arial',
                                  }}
                                  key={ansIndex}
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: ans && ans?.question_answer_text ? ans.question_answer_text : '',
                                    }}
                                  ></div>
                                </th>
                              ))}
                            </tr>

                            {question?.prompt_answer?.map((row: any, rowIndex: number) => (
                              <tr>
                                <td
                                  style={{
                                    fontSize: '13.5px',
                                    fontFamily: 'Arial',
                                  }}
                                  key={rowIndex}
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: row && row?.prompt_text ? row.prompt_text : '',
                                    }}
                                  ></div>
                                </td>
                                {question?.answers?.map((_val, rowIndex) => {
                                  return (
                                    <td
                                      style={{
                                        textAlign: 'center',
                                      }}
                                      key={rowIndex}
                                    >
                                      <input type="checkbox" />
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </table>
                        </div>
                      ) : question.question_type_id === 9 && !exportTrue ? (
                        question?.answers?.map((answer: any, ansI) => {
                          return (
                            <div
                              style={{
                                paddingTop: '1rem',
                              }}
                              key={ansI}
                            >
                              <StyledCardAnswerText
                                style={{
                                  gap: '5px',
                                  marginTop: '0rem !important',
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: ' black !important',
                                  width: '50%',
                                  backgroundColor: '#dfe3e8',
                                  borderRadius: '5px',
                                }}
                              >
                                {!exportTrue ? (
                                  <MDInput
                                    sx={{
                                      width: '10% !important',
                                      backgroundColor: theme.palette.grey[100],
                                    }}
                                  />
                                ) : (
                                  '............'
                                )}
                                <span>
                                  <span
                                    style={{
                                      marginLeft: '1rem',
                                      color: 'black',
                                    }}
                                    dangerouslySetInnerHTML={{
                                      __html: answer && answer?.question_answer_text ? answer.question_answer_text : '',
                                    }}
                                  ></span>
                                  &nbsp;&nbsp;
                                  {answer.is_terminate ? (
                                    <span
                                      style={{
                                        color: 'red',
                                        fontSize: '14.5px',
                                        fontFamily: 'Arial',
                                      }}
                                    >
                                      [Terminate]
                                    </span>
                                  ) : (
                                    ''
                                  )}
                                </span>
                              </StyledCardAnswerText>
                            </div>
                          )
                        })
                      ) : question.question_type_id === 12 ? (
                        <div
                          style={{
                            paddingTop: '1rem',
                          }}
                        >
                          <table border={1} style={{ borderCollapse: 'collapse' }}>
                            <tr>
                              <th></th>
                              {question?.answers?.map((ans, ansI) => (
                                <th
                                  style={{
                                    fontSize: '13.5px',
                                    fontWeight: 500,
                                    fontFamily: 'Arial',
                                  }}
                                  key={ansI}
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: ans && ans?.question_answer_text ? ans.question_answer_text : '',
                                    }}
                                  ></div>
                                </th>
                              ))}
                            </tr>

                            {question?.prompt_answer?.map((row: any, rowIndex: number) => (
                              <tr>
                                <td
                                  style={{
                                    fontSize: '13.5px',
                                    fontFamily: 'Arial',
                                  }}
                                  key={rowIndex}
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: row && row?.prompt_text ? row.prompt_text : '',
                                    }}
                                  ></div>
                                </td>
                                {question?.answers?.map((_val, rowIndex) => {
                                  return (
                                    <td
                                      style={{
                                        textAlign: 'center',
                                      }}
                                      key={rowIndex}
                                    >
                                      <input type="radio" />
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </table>
                        </div>
                      ) : (
                        question?.answers?.map((answer: any, ansI) => {
                          return (
                            <div
                              style={{
                                marginLeft: '2rem',
                                marginTop: '0.5rem',
                                fontSize: '14.5px',
                                fontFamily: 'Arial',
                              }}
                              key={ansI}
                            >
                              <span>{ansI + 1}. </span>
                              <span>
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: answer && answer?.question_answer_text ? answer.question_answer_text : '',
                                  }}
                                ></span>
                                &nbsp;&nbsp;
                                {answer?.is_terminate ? (
                                  <span
                                    style={{
                                      color: 'red',
                                      fontSize: '14.5px',
                                      fontFamily: 'Arial',
                                    }}
                                  >
                                    [Terminate]
                                  </span>
                                ) : (
                                  ''
                                )}
                              </span>
                            </div>
                          )
                        })
                      )}
                      <br />
                    </div>

                    {question.question_type_id === 5 || question.question_type_id === 3 ? (
                      <div
                        style={{
                          marginTop: '1rem',
                          marginBottom: '1rem',
                          fontSize: '14.5px',
                          fontFamily: 'Arial',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <span> {question.input_prefix}</span>
                        {!exportTrue ? (
                          <MDInput disabled variant="standard" size="small" sx={{ width: '100px' }} type="number" placeholder="number" />
                        ) : (
                          '..............'
                        )}
                        {question.input_suffix}
                      </div>
                    ) : question.question_type_id === 17 ? (
                      <table border={1} style={{ borderCollapse: 'collapse' }}>
                        <tr>
                          <th></th>
                          {question?.sub_questions?.map((subQues, subQuesIndex) => (
                            <th
                              style={{
                                fontSize: '13.5px',
                                fontWeight: 500,
                                fontFamily: 'Arial',
                              }}
                              key={subQuesIndex}
                            >
                              <Box
                                sx={{
                                  borderBottom: subQues.question_type_id === 12 ? '1px solid gray' : '',
                                  paddingBottom: '0.5rem',
                                }}
                              >
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: `${subQues.question_title}`,
                                  }}
                                ></span>
                              </Box>
                              {subQues.question_type_id === 12
                                ? subQues?.prompt_answer &&
                                  subQues?.prompt_answer?.length > 0 &&
                                  subQues.prompt_answer.map((promp: any, prompIndex: number) => {
                                    return (
                                      <td
                                        style={{
                                          borderBottom: 'none',
                                          borderLeft: 'none',
                                          borderTop: 'none',
                                          paddingInline: '1rem',
                                          borderRight: prompIndex + 1 === subQues?.prompt_answer.length ? 'none' : '',
                                        }}
                                      >
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: `${promp.prompt_text}`,
                                          }}
                                        ></span>
                                      </td>
                                    )
                                  })
                                : ''}
                            </th>
                          ))}
                        </tr>

                        {question?.prompt_answer?.map((row: any, rowIndex: number) => (
                          <tr>
                            <td
                              style={{
                                fontSize: '13.5px',
                                fontFamily: 'Arial',
                              }}
                              key={rowIndex}
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: row && row?.prompt_text ? row.prompt_text : '',
                                }}
                              ></div>
                            </td>
                            {question?.sub_questions?.map((val, rowIndex) => {
                              return (
                                <td
                                  style={{
                                    textAlign: 'center',
                                  }}
                                  key={rowIndex}
                                >
                                  {val.question_type_id === 1 ? (
                                    <input type="radio" />
                                  ) : val.question_type_id === 2 ? (
                                    <input type="checkbox" />
                                  ) : val.question_type_id === 12 ? (
                                    val?.prompt_answer &&
                                    val?.prompt_answer?.length > 0 &&
                                    val.prompt_answer.map((_promp: any, prompIndex: number) => {
                                      return (
                                        <td
                                          align="left"
                                          style={{
                                            borderBottom: 'none',
                                            borderLeft: 'none',
                                            borderTop: 'none',
                                            paddingInline: '1.4rem',
                                            borderRight: prompIndex + 1 === val.prompt_answer?.length ? 'none' : '',
                                          }}
                                        >
                                          <input type="radio" />
                                        </td>
                                      )
                                    })
                                  ) : !exportTrue ? (
                                    <MDInput
                                      disabled
                                      variant="standard"
                                      size="small"
                                      sx={{
                                        width: '100px',
                                        padding: '0.5rem',
                                      }}
                                      type="number"
                                    />
                                  ) : (
                                    '..............'
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </table>
                    ) : (
                      ''
                    )}
                    <br />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default MultiPreviewerComponent
