import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
// import Radio from "@mui/material/Radio";
import { PromptAnsTypes, QuestionAnsTypes } from './grid-multi-select-types'
import Checkbox from '@mui/material/Checkbox'
import { Radio, useMediaQuery } from '@mui/material'
import { ThemeTypes } from '@/types/builder-theme-type'
import { MDInput } from './grid-multi-select.style'
import ShowConceptForAnswers from '@/components/concept-answers-show/concept-answers-show.component'

interface TableProps {
  promptAns: PromptAnsTypes[]
  questionAns: QuestionAnsTypes[]
  questionTheme?: ThemeTypes
}

export default function GridMultiSelectViewTable(props: TableProps) {
  let { promptAns, questionAns, questionTheme } = props
  const matches = useMediaQuery('(max-width:1600px)')
  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 'calc(38vw)', boxSizing: 'border-box' }}
    // sx={{ maxWidth: "2000px", boxSizing: "border-box" }}
    >
      <Table sx={{ maxWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {questionAns?.map((val) => {
              return (
                <TableCell
                  align="center"
                  sx={{ fontSize: matches ? '10px' : '' }}
                  // sx={{ minWidth: "150px", fontSize: matches ? "10px" : "" }}
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
                  {val?.add_other_option ? (
                    <MDInput
                      disabled
                      sx={{ paddingLeft: '10px' }}
                      value="Specify other"
                      variant="standard"
                      placeholder="Specify other"
                      className="opn-ended-input"
                    />
                  ) : (
                    ''
                  )}
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
              </TableCell>
              {questionAns.map((val) => {
                return (
                  <TableCell align="center">
                    {!val.is_exclusive ? (
                      <Checkbox
                        sx={{
                          color: questionTheme?.controls.unselected,
                          '&.Mui-checked': {
                            color: questionTheme?.controls.selected,
                          },
                        }}
                      />
                    ) : (
                      <Radio
                        sx={{
                          color: questionTheme?.controls.unselected,
                          '&.Mui-checked': {
                            color: questionTheme?.controls.selected,
                          },
                        }}
                        size="small"
                      />
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
