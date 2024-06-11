import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { PromptAnsTypes } from './three-d-grid-types'
import Checkbox from '@mui/material/Checkbox'
import { Box, Radio, Stack, Typography, useMediaQuery } from '@mui/material'
import { ThemeTypes } from '@/types/builder-theme-type'
import { Question } from '@/types/survey-builder.type'
import { MDInput } from '../numeric-list/numeric-list.style'
import ShowConceptForAnswers from '@/components/concept-answers-show/concept-answers-show.component'

interface TableProps {
  promptAns: PromptAnsTypes[]
  subQuestionData: Question[]
  questionTheme?: ThemeTypes
}

export default function ThreeDGridViewTable(props: TableProps) {
  let { promptAns, questionTheme, subQuestionData } = props
  const matches = useMediaQuery('(max-width:1600px)')
  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 'calc(38vw)', boxSizing: 'border-box', overflow: 'auto' }}
    // sx={{ maxWidth: "2000px", boxSizing: "border-box" }}
    >
      <Table sx={{ maxWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {subQuestionData?.map((val) => {
              return (
                <TableCell
                  align="center"
                  sx={{ fontSize: matches ? '10px' : '' }}
                  // sx={{ minWidth: "150px", fontSize: matches ? "10px" : "" }}
                  className="form-control-answer-label-font"
                >
                  <Box
                    sx={{
                      borderBottom: val.question_type_id === 12 ? '1px solid rgba(224, 224, 224, 1)' : '',
                      paddingBottom: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: questionTheme?.fontFamily ? questionTheme?.fontFamily : '',
                      }}
                      dangerouslySetInnerHTML={{
                        __html: `${val.question_title}`,
                      }}
                    ></span>
                  </Box>
                  {val.question_type_id === 12
                    ? val?.answers &&
                    val?.answers?.length > 0 &&
                    val.answers.map((ans: any) => {
                      return (
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: matches ? '10px' : '',
                            borderBottom: 'none',
                            paddingTop: '0.2rem',
                          }}
                          className="form-control-answer-label-font"
                        >
                          <span
                            style={{
                              fontFamily: questionTheme?.fontFamily ? questionTheme?.fontFamily : '',
                            }}
                            dangerouslySetInnerHTML={{
                              __html: `${ans.question_answer_text}`,
                            }}
                          ></span>
                        </TableCell>
                      )
                    })
                    : ''}
                </TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {promptAns?.map((row, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell
                sx={{ fontSize: matches ? '10px' : '' }}
                // sx={{ minWidth: "150px", fontSize: matches ? "10px" : "" }}
                className="form-control-answer-label-font"
              >
                <Stack direction="row" alignItems="flex-end">
                  <span
                    style={{
                      fontFamily: questionTheme?.fontFamily ? questionTheme?.fontFamily : '',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: `${row.prompt_text
                        ? row.prompt_text
                        : // row.prompt_code
                        ''
                        }`,
                    }}
                  ></span>
                  {row?.concept ? (
                    // @ts-ignore
                    <ShowConceptForAnswers answer={row} index={null} hide={true} selectedFileQuestionAnswer={null} setQuestionAns={null} questionAns={promptAns} />
                  ) : null}
                  {row?.add_other_option ? (
                    <MDInput
                      disabled
                      sx={{ paddingLeft: '10px' }}
                      variant="standard"
                      value="Specify other"
                      placeholder="Specify other"
                      className="opn-ended-input"
                    />
                  ) : (
                    ''
                  )}
                </Stack>
              </TableCell>
              {subQuestionData.map((val) => {
                return (
                  <TableCell align="center">
                    {val.question_type_id === 1 ? (
                      <Radio
                        size="small"
                        sx={{
                          color: questionTheme?.controls.unselected,
                          '&.Mui-checked': {
                            color: questionTheme?.controls.selected,
                          },
                        }}
                      />
                    ) : val.question_type_id === 2 ? (
                      !row.is_exclusive ? (
                        <Checkbox
                          size="small"
                          sx={{
                            color: questionTheme?.controls.unselected,
                            '&.Mui-checked': {
                              color: questionTheme?.controls.selected,
                            },
                          }}
                        />
                      ) : (
                        <Radio
                          size="small"
                          sx={{
                            color: questionTheme?.controls.unselected,
                            '&.Mui-checked': {
                              color: questionTheme?.controls.selected,
                            },
                          }}
                        />
                      )
                    ) : val.question_type_id === 12 ? (
                      val?.answers &&
                      val?.answers?.length > 0 &&
                      val.answers.map(() => {
                        return (
                          <TableCell align="left" sx={{ borderBottom: 'none' }}>
                            <Radio
                              size="small"
                              sx={{
                                color: questionTheme?.controls.unselected,
                                '&.Mui-checked': {
                                  color: questionTheme?.controls.selected,
                                },
                              }}
                            />
                          </TableCell>
                        )
                      })
                    ) : (
                      <Stack spacing={2}>
                        <MDInput disabled variant="standard" size="small" type="number" className="opn-ended-input" />
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            marginTop: '1rem',
                            width: '100px',
                            display: index + 1 === promptAns.length && val.question_type_id === 8 && val.auto_sum ? '' : 'none',
                          }}
                        >
                          <Typography fontSize="14px"> Total</Typography>
                          <Typography fontSize="14px"> 0.00</Typography>
                        </Stack>
                      </Stack>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
