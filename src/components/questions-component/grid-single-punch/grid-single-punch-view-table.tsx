import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { PromptAnsTypes, QuestionAnsTypes } from './grid-single-punch-types'
import Radio from '@mui/material/Radio'
import { Stack, useMediaQuery } from '@mui/material'
import { ThemeTypes } from '@/types/builder-theme-type'
import { useState } from 'react'
import { MDInput } from './grid-single-punch.style'
import ShowConceptForAnswers from '@/components/concept-answers-show/concept-answers-show.component'

interface TableProps {
  promptAns: PromptAnsTypes[]
  questionAns: QuestionAnsTypes[]
  questionTheme?: ThemeTypes
}

export default function GridSinglePunchViewTable(props: TableProps) {
  let { promptAns, questionAns, questionTheme } = props
  const matches = useMediaQuery('(max-width:1600px)')
  const [checkedRadios, setCheckedRadios] = useState<String | null>(null)
  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 'calc(38vw)', boxSizing: 'border-box' }}
    // sx={{ maxWidth: "2000px", boxSizing: "border-box" }}
    >
      <Table sx={{ maxWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {questionAns && questionAns.length > 0 ? <TableCell></TableCell> : ''}
            {questionAns &&
              questionAns.length > 0 &&
              questionAns?.map((val) => {
                return (
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: matches ? '10px' : '',
                    }}
                    // sx={{ maxWidth: "150px", fontSize: matches ? "10px" : "" }}
                    className="form-control-answer-label-font"
                  >
                    <span
                      style={{
                        fontFamily: questionTheme?.fontFamily ? questionTheme?.fontFamily : '',
                      }}
                      dangerouslySetInnerHTML={{
                        __html: `${val.question_answer_text}`,
                      }}
                    ></span>
                    {val?.concept ? (
                      // @ts-ignore
                      <ShowConceptForAnswers answer={val} index={null} hide={true} selectedFileQuestionAnswer={null} setQuestionAns={null} questionAns={questionAns} />
                    ) : null}
                  </TableCell>
                )
              })}
          </TableRow>
        </TableHead>
        <TableBody>
          {promptAns &&
            promptAns.length > 0 &&
            promptAns?.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell
                  sx={{
                    fontSize: matches ? '10px' : '',
                  }}
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
                      <ShowConceptForAnswers answer={row} index={null} hide={true} selectedFileQuestionAnswer={null} setQuestionAns={null} questionAns={questionAns} />
                    ) : null}

                    {row.add_other_option ? (
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
                {questionAns &&
                  questionAns.length > 0 &&
                  questionAns.map((_val, ind) => {
                    return (
                      <TableCell align="center">
                        <Radio
                          checked={checkedRadios === String(`${ind}` + `${index}` + 'index')}
                          onChange={() => {
                            setCheckedRadios(String(`${ind}` + `${index}` + 'index'))
                          }}
                          sx={{
                            color: questionTheme?.controls.unselected,
                            '&.Mui-checked': {
                              color: questionTheme?.controls.selected,
                            },
                          }}
                        />
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
