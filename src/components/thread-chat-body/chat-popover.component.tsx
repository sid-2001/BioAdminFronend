import { IconButton, Typography, LinearProgress, TextField } from '@mui/material'
import Popover from '@mui/material/Popover'
import { Box, Stack } from '@mui/system'
import AddBtn from '@/components/add-btn'
import { Delete2 } from '@/assets/images'
import { ProjectQuestionType } from '@/types/project.type'
import { useEffect, useState } from 'react'
import { BoldButton } from './thread-chat-body.style'
import { ProjectService } from '@/services/projects.service'
import { useParams } from 'react-router-dom'
import Checkbox from '@mui/material/Checkbox'
import { useSnackbar } from 'notistack'

interface ChatPopoverComponentPropTypes {
  id?: any
  open: boolean
  anchorEl: HTMLButtonElement | null
  handleClose: () => void
  questions: Array<ProjectQuestionType>
  getProjectThread: (id: string | null) => void | null
  threadId: number | string
  getAllProjectThreads?: () => void
}

function ChatPopoverComponent({
  anchorEl,
  handleClose,
  open,
  id,
  questions,
  threadId,
  getProjectThread,
  getAllProjectThreads,
}: ChatPopoverComponentPropTypes) {
  const [editMode, setEditMode] = useState(false)
  const projectService = new ProjectService()
  const { projectId, surveyId } = useParams()
  const [selectedQuestions, setSelectedQuestions] = useState<any>(initialiseSelectedQuestions())
  const [allQuestions, setAllQuestions] = useState<Array<ProjectQuestionType>>([])
  const [searchedTerm, setSearchedTerm] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  function stripHtmlTags(textWithHtml: any) {
    return textWithHtml.replace(/<[^>]*>?/gm, '');
  }

  function initialiseSelectedQuestions() {
    const temp: any = {}

    questions.forEach((question) => {
      temp[question.question_id] = question
    })

    return temp
  }

  const getProjectTemplate = async () => {
    if (projectId && surveyId)
      try {
        const data = await projectService.get_project_template(String(projectId), Number(surveyId))

        const temp: ProjectQuestionType[] = []
        data.forEach((obj) => {
          obj.questions.forEach((question) => {
            temp.push({
              question_id: question?.question_id || '',
              question_title: question.question_title || '',
              question_name: question.question_name || '',
            })
          })
        })

        setAllQuestions(temp as any)
      } catch (error) {
        console.log(error)
      }
  }

  async function saveQuestions() {
    if (projectId && surveyId)
      try {
        const temp = []

        for (const value of Object.values(selectedQuestions)) {
          temp.push(value)
        }

        await projectService.updateProjectThreadsQuestions(projectId || '', Number(surveyId), threadId || '', temp)

        if (getProjectThread && typeof getProjectThread === 'function') {
          getProjectThread(threadId || ('' as any))
        }

        if (getAllProjectThreads && typeof getAllProjectThreads === 'function') {
          // getAllProjectThreads()
        }

        setEditMode(false)
      } catch (error) {
        enqueueSnackbar('Error occured while saving', {
          variant: 'error',
        })
      }
  }

  async function deleteQuestion(id: number | string) {
    if (projectId && surveyId)
      try {
        const temp = questions.filter((obj) => obj.question_id !== id)

        await projectService.updateProjectThreadsQuestions(projectId || '', Number(surveyId), threadId || '', temp)
        setEditMode(false)

        if (getProjectThread && typeof getProjectThread === 'function') {
          await getProjectThread(threadId || ('' as any))
          setSelectedQuestions(initialiseSelectedQuestions())
        }

        if (getAllProjectThreads && typeof getAllProjectThreads === 'function') {
          // getAllProjectThreads()
        }
      } catch (error) {
        enqueueSnackbar('Error occured while removing', {
          variant: 'error',
        })
      }
  }

  useEffect(() => {
    getProjectTemplate()
  }, [])

  function toggleChoice(sObj: ProjectQuestionType) {
    const temp = { ...selectedQuestions }

    if (temp[sObj.question_id]) {
      delete temp[sObj.question_id]

      setSelectedQuestions(temp)
    } else {
      temp[sObj.question_id] = sObj

      setSelectedQuestions(temp)
    }
  }

  function searchBasedFilter(arr: ProjectQuestionType[]) {
    if (!searchedTerm) return arr

    return arr.filter((obj) => obj.question_name.toLowerCase().indexOf(searchedTerm.toLowerCase()) >= 0)
  }

  function onClose() {
    setSelectedQuestions(initialiseSelectedQuestions())
    setEditMode(false)
    handleClose()
  }

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      sx={{
        maxHeight: '711px',
        overflowY: 'scroll',
      }}
      container={document.querySelector('.fullscreen')}
    >
      <Box
        sx={{
          padding: '24px',
          width: '480px',
        }}
      >
        <Stack
          sx={{
            marginBottom: '12px',
            height: '37px',
          }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" gap="12px" alignItems="center">
            <Typography
              sx={{
                color: '#212121',
                fontSize: '18px',
                fontWeight: '700',
                lineHeight: 'normal',
              }}
            >
              Associated Questions
            </Typography>
            {!editMode ? <AddBtn onClick={() => setEditMode(true)} /> : null}
          </Stack>

          {editMode ? (
            <Stack direction="row" gap="12px" alignItems="center">
              <BoldButton
                onClick={() => {
                  setSelectedQuestions(initialiseSelectedQuestions())
                  setEditMode(false)
                }}
              >
                Cancel
              </BoldButton>
              <BoldButton
                sx={{
                  backgroundColor: '#FDB447',
                }}
                onClick={saveQuestions}
              >
                Save
              </BoldButton>
            </Stack>
          ) : null}
        </Stack>
        <Stack
          sx={{
            marginBottom: '12px',
          }}
          direction="row"
          alignItems="center"
          width="100%"
        >
          <LinearProgress
            variant="determinate"
            value={100}
            sx={{
              width: '10%',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#FDB447',
              },
            }}
          />
          <LinearProgress variant="determinate" value={100} sx={{ width: '15%' }} />
          <LinearProgress variant="determinate" value={0} sx={{ width: '75%' }} />
        </Stack>
        {editMode ? (
          <Box
            sx={{
              marginBottom: '24px',
            }}
          >
            <TextField
              sx={{
                width: '100%',
                '& .MuiInput-underline:before': {
                  // Removes the default bottom border
                  borderBottom: 'none',
                },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                  // Removes the hover effect on the bottom border
                  borderBottom: 'none',
                },
                '& .MuiInput-underline:after': {
                  // Removes the bottom border on focus (when the input is active)
                  borderBottom: 'none',
                },
                background: '#F3F3F3',
                padding: '4px 8px',
                borderRadius: '16px',
              }}
              placeholder="search here"
              variant="standard"
              value={searchedTerm}
              onChange={(e) => setSearchedTerm(e.target.value)}
            />
          </Box>
        ) : null}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {editMode
            ? searchBasedFilter(allQuestions).map((obj, i) => (
              <Stack gap="8px" key={i} direction="row" alignItems="flex-start">
                <Checkbox
                  sx={{
                    padding: '0',
                  }}
                  onChange={() => toggleChoice(obj)}
                  checked={selectedQuestions[obj.question_id] ? true : false}
                />
                <Typography
                  sx={{
                    color: '#212121',
                    fontSize: '12px',
                    fontWeight: '700',
                    marginTop: '2px',
                  }}
                >
                  {obj.question_name}
                </Typography>
                <Typography
                  sx={{
                    color: '#212121',
                    fontSize: '12px',
                    fontWeight: '400',
                    flex: '1',
                    marginTop: '2px',
                  }}
                >
                  {stripHtmlTags(obj.question_title)}
                  {/* {obj.question_title} */}
                </Typography>
              </Stack>
            ))
            : questions.map((obj, i) => (
              <Stack gap="8px" key={i} direction="row" alignItems="flex-start">
                <Typography
                  sx={{
                    color: '#212121',
                    fontSize: '12px',
                    fontWeight: '700',
                    marginTop: '2px',
                  }}
                >
                  {obj.question_name}
                </Typography>
                <Typography
                  sx={{
                    color: '#212121',
                    fontSize: '12px',
                    fontWeight: '400',
                    flex: '1',
                    marginTop: '2px',
                  }}
                >
                  {stripHtmlTags(obj.question_title)}
                  {/* {obj.question_title} */}
                </Typography>
                <IconButton
                  sx={{
                    padding: '4px',
                    borderRadius: '4px',
                  }}
                  onClick={() => deleteQuestion(obj.question_id)}
                >
                  <img src={Delete2} />
                </IconButton>
              </Stack>
            ))}
          {!questions || !Array.isArray(questions) || questions.length <= 0 ? (
            <Typography
              sx={{
                alignSelf: 'center',
              }}
            >
              No associated questions
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Popover>
  )
}

export default ChatPopoverComponent
