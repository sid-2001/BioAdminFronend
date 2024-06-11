import { Box, Stack } from '@mui/system'
import { DetailsBox, StyledKeys, StyledValues, StyledValueswithIcons } from '@/components/project-details/project-details.style'
import { Button, Grid, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/loader'
import EditIcon from '@mui/icons-material/Edit'
import { ThemesService, ThemeType, ThemePropertiesTies } from '@/services/themes.service'
import EditTheme from './edit-theme'
import { useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { theme } from '@/constants/theme'
import { Logo } from '@/assets/images'
import { Question } from '@/types/survey-builder.type'
import SinglePunch from '@/components/questions-component/single-punch'
import MultiPunch from '@/components/questions-component/multi-punch'
import OpenEnded from '@/components/questions-component/open-ended'
import Intro from '@/components/questions-component/intro'
import OpenEndedNumeric from '@/components/questions-component/open-ended-numeric'
import TextList from '@/components/questions-component/text-list'
import NumericList from '@/components/questions-component/numeric-list'
import Ranking from '@/components/questions-component/ranking'
import GridSinglePunch from '@/components/questions-component/grid-single-punch'
import GridMultiSelect from '@/components/questions-component/grid-multi-select'
import Notes from '@/components/questions-component/notes'
import StayCurrentPortraitIcon from '@mui/icons-material/StayCurrentPortrait'
import ComputerIcon from '@mui/icons-material/Computer'
import { QuestionListTypes } from '@/components/project-survey-builder/project-survey-builder.type'
import { ListService } from '@/services/list.service'
import { logger } from '@/helpers/logger'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import QuestionTypeIcon from '@/constants/questionTypeIcon'
import '../../global.css'

const QUESTION_TYPE_COMPONENTS = {
  1: SinglePunch,
  2: MultiPunch,
  3: OpenEnded,
  6: Intro,
  5: OpenEndedNumeric,
  7: TextList,
  8: NumericList,
  9: Ranking,
  12: GridSinglePunch,
  13: GridMultiSelect,
  16: Notes,
}

const SelectTypeText = (type: number) => {
  if (type === 1) {
    return 'Single Type'
  } else if (type === 2) {
    return 'Multi Type'
  } else if (type === 3) {
    return 'OpenEnded Type'
  } else if (type === 5) {
    return 'OpenEndedNumeric Type'
  } else if (type === 6) {
    return 'Intro Type'
  } else if (type === 7) {
    return 'TextList Type'
  } else if (type === 8) {
    return 'NumericList Type'
  } else if (type === 9) {
    return 'Ranking Type'
  } else if (type === 12) {
    return 'GridSinglePunch Type'
  } else if (type === 13) {
    return 'GridMultiSelect Type'
  } else if (type === 16) {
    return 'Notes Type'
  }
}

let DummyQuestion: any = {
  question_type_id: 1,
  question_code: 'Q1',
  question_name: SelectTypeText(1),
  question_title_formatted: SelectTypeText(Number(1)),
  question_title: SelectTypeText(Number(1)),
  question_id: 1,
  required_question: true,
  answer_sorting_order: 1,
  answers: [
    {
      question_answer_code: 1,
      question_answer_text: 'One',
      is_active: true,
    },
    {
      question_answer_code: 2,
      question_answer_text: 'Two',
      is_active: true,
    },
  ],
}

function LayoutOverviewContainer() {
  const [loading, setLoading] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState(false)
  const themesService = new ThemesService()
  const { layoutId } = useParams()
  const [, setThemes] = useState<Array<ThemeType>>([])
  const [themeProperties, setThemeProperties] = useState<ThemePropertiesTies | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<ThemeType | null>(null)
  const [mobileView, setMobileView] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(DummyQuestion)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [questionTypeList, setQuestionTypeList] = useState<QuestionListTypes[]>([])
  const { enqueueSnackbar } = useSnackbar()
  let listServices = new ListService()

  async function getThemes() {
    setLoading(true)
    if (layoutId) {
      try {
        const data = await themesService.getThemes(layoutId)

        setThemes(data)
        if (data && data.length) {
          setThemeProperties(data[0].properties)
          setSelectedTheme(data[0])
        }
        setLoading(false)
      } catch (error) {
        enqueueSnackbar('An error occurred. Please try again.', {
          variant: 'error',
        })
        setLoading(false)
      }
    }
  }

  function getAndUpdateTheme() {
    getThemes()
  }

  useEffect(() => {
    getThemes()
    getQuestionTypes()
  }, [])

  const getQuestionTypes = async () => {
    try {
      let data = await listServices.question_type_list()
      let response = data.map((val: any) => {
        return {
          id: val.id,
          name: val.name,
        }
      })
      setQuestionTypeList(response)
    } catch (error) {
      logger.error(error)
    }
  }

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  console.log(themeProperties, 'themeProperties')

  return (
    <DetailsBox sx={{ padding: '2rem', display: 'flex' }}>
      <Grid container spacing={2}>
        {isEdit && selectedTheme ? (
          <Grid item xs={7}>
            <EditTheme setIsEdit={setIsEdit} getAndUpdateTheme={getAndUpdateTheme} theme={selectedTheme} setThemeProperties={setThemeProperties} />
          </Grid>
        ) : themeProperties ? (
          <Grid item xs={7}>
            <Box
              sx={{
                overflow: 'auto',
                height: 'calc(100vh - 280px)',
                position: 'relative',
              }}
            >
              <Typography
                component="h2"
                sx={{
                  marginBottom: '1rem',
                  fontWeight: '700',
                }}
              >
                General Properties
              </Typography>
              <Grid container spacing={2} sx={{ marginBottom: '1.5rem' }}>
                <>
                  <Grid item xs={12} md={6}>
                    <StyledKeys>Background Image</StyledKeys>
                    {themeProperties?.backgroundImage ? (
                      <Box width={50} height={50}>
                        <img
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                          src={themeProperties?.backgroundImage}
                        />
                      </Box>
                    ) : (
                      <StyledValueswithIcons>
                        <StyledValues>{themeProperties?.backgroundImage || '-'}</StyledValues>
                      </StyledValueswithIcons>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6} sx={{ wordBreak: 'break-word' }}>
                    <StyledKeys>Font family</StyledKeys>
                    <StyledValues>{themeProperties?.fontFamily || '-'}</StyledValues>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledKeys>Background Color</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.backgroundColor || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledKeys>Mobile Breakpoint</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.breakpoint || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>
                </>
              </Grid>

              <Typography
                component="h2"
                sx={{
                  marginBottom: '1rem',
                  fontWeight: '700',
                }}
              >
                Header Properties
              </Typography>
              <Grid container spacing={2} sx={{ marginBottom: '1.5rem' }}>
                <>
                  <Grid item xs={12} md={6}>
                    <StyledKeys>Header Logo Url</StyledKeys>
                    {themeProperties?.header?.url ? (
                      <Box width={50} height={50}>
                        <img
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                          src={themeProperties?.header?.url}
                        />
                      </Box>
                    ) : (
                      <StyledValueswithIcons>
                        <StyledValues>{themeProperties?.header?.url || '-'}</StyledValues>
                      </StyledValueswithIcons>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledKeys>Header Text</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.header?.text || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledKeys>Header Background Color</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.header?.backgroundColor || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledKeys>Header Text Color</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.header?.color || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledKeys>Header Text Align</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.header?.textAlign || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>
                </>
              </Grid>

              <Typography
                component="h2"
                sx={{
                  marginBottom: '1rem',
                  fontWeight: '700',
                }}
              >
                Questions Properties
              </Typography>
              <Grid container spacing={2} sx={{ marginBottom: '1.5rem' }}>
                <>
                  <Grid item xs={12} md={6}>
                    <StyledKeys>Questions Text Color</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.questions?.color || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledKeys>Questions Background Color</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.questions?.backgroundColor || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledKeys>Questions Stroke Color</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.questions?.borderColor || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>
                </>
              </Grid>

              <Typography
                component="h2"
                sx={{
                  marginBottom: '1rem',
                  fontWeight: '700',
                }}
              >
                Control Properties
              </Typography>
              <Grid container spacing={2} sx={{ marginBottom: '1.5rem' }}>
                <>
                  <Grid item xs={12} md={6}>
                    <StyledKeys>Control Selected Color</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.controls?.selected?.color || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledKeys>Control Unselected Color</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.controls?.unselected?.color || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>
                </>
              </Grid>

              <Typography
                component="h2"
                sx={{
                  marginBottom: '1rem',
                  fontWeight: '700',
                }}
              >
                Button Properties
              </Typography>
              <Grid container spacing={2} sx={{ marginBottom: '1.5rem' }}>
                <>
                  <Grid item xs={12} md={6}>
                    <StyledKeys>Button Text Color</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.button?.color || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledKeys>Button Background Color</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.button?.backgroundColor || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledKeys>Button Stroke Color</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.button?.borderColor || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>
                </>
              </Grid>

              <Typography
                component="h2"
                sx={{
                  marginBottom: '1rem',
                  fontWeight: '700',
                }}
              >
                SP Layouts
              </Typography>
              <Grid container spacing={2} sx={{ marginBottom: '1.5rem' }}>
                <>
                  <Grid item xs={12} md={6}>
                    <StyledKeys>Sp Layout</StyledKeys>
                    <StyledValueswithIcons>
                      <StyledValues>{themeProperties?.splayoutname || '-'}</StyledValues>
                    </StyledValueswithIcons>
                  </Grid>
                </>
              </Grid>

              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}
              >
                <IconButton
                  aria-controls="menu"
                  aria-haspopup="true"
                  onClick={() => {
                    setIsEdit(true)
                    // handleClose(e)
                  }}
                  size="small"
                  style={{ alignItems: 'start' }}
                >
                  {/* <EditIcon fontSize="medium" style={{ color: "#5D5D5D" }} /> */}
                  <EditIcon fontSize="medium" style={{ color: '#5D5D5D' }} />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        ) : null}
        <Grid item xs={5} display={selectedTheme || themeProperties ? '' : 'none'}>
          <Box
            style={{
              overflow: 'auto',
              height: 'calc(100vh - 290px)',
              position: 'relative',
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="1rem"
              position="sticky"
              sx={{ top: 0, background: 'white', zIndex: 5 }}
            >
              <Typography variant="h6"> Preview</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton
                  onClick={() => {
                    setMobileView(true)
                  }}
                  sx={{
                    background: mobileView ? `${theme.palette.primary[200]}` : '',
                  }}
                >
                  <StayCurrentPortraitIcon sx={{ fontSize: '1rem' }} />
                </IconButton>

                <IconButton
                  sx={{
                    background: !mobileView ? `${theme.palette.primary[200]}` : '',
                  }}
                  size="small"
                  onClick={() => {
                    setMobileView(false)
                  }}
                >
                  <ComputerIcon fontSize="small" sx={{ fontSize: '1.2rem' }} />
                </IconButton>
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ cursor: 'pointer' }}
                    onClick={(e: any) => {
                      e.stopPropagation()
                      handleClick(e)
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem' }}>Select Question</Typography>
                    <KeyboardArrowDownIcon sx={{ fontSize: '1.3rem' }} />
                  </Stack>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    {questionTypeList.map((value: QuestionListTypes, i) => (
                      <MenuItem
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation()
                          let payload: any = {
                            question_type_id: value.id,
                            question_code: 'Q1',
                            question_name: SelectTypeText(Number(value.id)),
                            question_title_formatted: SelectTypeText(Number(value.id)),
                            question_title: SelectTypeText(Number(value.id)),
                            question_id: 1,
                            required_question: true,
                            answer_sorting_order: 1,
                            answers: [
                              {
                                question_answer_code: 1,
                                question_answer_text: 'One',
                                is_active: true,
                              },
                              {
                                question_answer_code: 2,
                                question_answer_text: 'Two',
                                is_active: true,
                              },
                            ],
                            prompt_answer: [
                              {
                                prompt_code: 1,
                                prompt_text: 'One',
                                is_active: true,
                              },
                              {
                                prompt_code: 2,
                                prompt_text: 'Two',
                                is_active: true,
                              },
                            ],
                          }

                          setSelectedQuestion(payload)
                          handleClose()
                        }}
                      >
                        <QuestionTypeIcon typeId={Number(value.id)} />
                        {'  '}&nbsp;
                        <Typography variant="caption">{value.name}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </Stack>
            </Stack>

            <Box
              width="100%"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  background: themeProperties?.backgroundImage
                    ? `url(${themeProperties?.backgroundImage})`
                    : themeProperties?.backgroundColor
                      ? themeProperties?.backgroundColor
                      : '#f5f5f5',
                  border: mobileView ? '3px solid #aaa' : '',
                  borderRadius: '0.8rem',
                  width: mobileView ? '380px' : '90%',
                  height: 'calc(100vh - 350px)',
                  overflow: 'auto',
                }}
              >
                <Stack
                  minHeight="45px"
                  sx={{
                    background: themeProperties?.header?.backgroundColor ? themeProperties?.header?.backgroundColor : theme.palette.primary.main,
                    position: 'sticky',
                    top: 0,
                    width: '100%',
                    zIndex: 4,
                  }}
                  direction="row"
                  alignItems="center"
                  padding="0.5rem"
                  spacing={2}
                >
                  <img src={themeProperties?.header?.url ? themeProperties?.header?.url : Logo} height="40px" />
                  <Typography
                    color={themeProperties?.header?.color ? themeProperties?.header?.color : 'white'}
                    sx={{
                      fontFamily: `${themeProperties && themeProperties?.fontFamily} !important`,
                      fontSize: '1.4rem',
                      textAlign: themeProperties?.header.textAlign ? themeProperties?.header.textAlign : 'left',
                      width: '100%',
                    }}
                  >
                    {themeProperties?.header.text || ''}
                  </Typography>
                </Stack>
                <Box
                  className={mobileView ? 'parent-component' : ''}
                  sx={{
                    marginTop: '1rem',
                    width: '95%',
                    padding: '1rem',
                    backgroundColor: themeProperties?.questions?.backgroundColor ? themeProperties?.questions?.backgroundColor : '#fff',
                    borderColor: themeProperties?.questions.borderColor ? themeProperties?.questions.borderColor : '',
                    border: themeProperties?.questions.borderColor ? `2px solid ${themeProperties?.questions.borderColor}` : '1px solid white',
                  }}
                >
                  {(() => {
                    // @ts-ignore
                    const QuestionComponent =
                      // @ts-ignore
                      QUESTION_TYPE_COMPONENTS[selectedQuestion?.question_type_id ? selectedQuestion?.question_type_id : 1]
                    return QuestionComponent ? (
                      <QuestionComponent question={selectedQuestion} surveyQuestionId={1} questionTheme={themeProperties} />
                    ) : null
                  })()}
                </Box>
                <Stack direction="row" justifyContent="space-between" width="95%" marginTop="1rem" marginBottom="1rem">
                  <Button
                    variant="contained"
                    sx={{
                      background: themeProperties?.button?.backgroundColor,
                      color: themeProperties?.button.color,
                      border: `2px solid ${themeProperties?.button.borderColor}`,
                    }}
                  >
                    prev
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      background: themeProperties?.button?.backgroundColor,
                      color: themeProperties?.button.color,
                      border: `2px solid ${themeProperties?.button.borderColor}`,
                    }}
                  >
                    Next
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {loading ? <LoadingSpinner /> : null}
    </DetailsBox>
  )
}

export default LayoutOverviewContainer
