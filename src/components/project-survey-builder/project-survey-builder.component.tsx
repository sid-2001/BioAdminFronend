import {
  Badge,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  // Button,
  // Button,
  // Button,
  // Checkbox,
  // FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  useMediaQuery,
  // Tooltip,
} from '@mui/material'
import '../../global.css'
import { useEffect, useState } from 'react'
// import SampleJson from "../../constants/smaple.json";
import { Question, Section } from '@/types/survey-builder.type'
import { DetailsBox } from '../project-details/project-details.style'
import SinglePunch from '../questions-component/single-punch'
import MultiPunch from '../questions-component/multi-punch'
import OpenEnded from '../questions-component/open-ended'
import OpenEndedNumeric from '../questions-component/open-ended-numeric'
import Intro from '../questions-component/intro'
import TextList from '../questions-component/text-list'
import NumericList from '../questions-component/numeric-list'
import Ranking from '../questions-component/ranking'
import GridSinglePunch from '../questions-component/grid-single-punch'
import GridMultiSelect from '../questions-component/grid-multi-select'
import Notes from '../questions-component/notes'
import Typography from '@mui/material/Typography'
import { theme } from '@/constants/theme'
import {
  // CollapseDrawerIcon,
  CommentIcon,
  CompareFill,
  // ExpandIcon,
  ExportIcon,
  FillIcon,
  // Logo,
  ShareIcon,
  // MessageIcon,
  // NavigationArrow,
  // NavigationOpenIcon,
  SwapIcon,
  ViewIcon,
  // TicketIcon,
  // ViewIcon,
} from '@/assets/images'
import { backIcon } from '@/assets/images'
import { ProjectSurveyBuilderComponentProps, QuestionListTypes, SortingListTypes } from './project-survey-builder.type'
// import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

import ProjectThreadHOC from '@/higher-order-components/project-thread'
import ProjectThreadsList from '@/components/project-threads-list'
import ProjectThreadChatComponent from '@/components/project-thread-chat'
import { BuilderIconBox, BuilderIconWrapper } from './project-survey-builder.style'
import { ProjectService } from '@/services/projects.service'
import { useOutletContext, useParams } from 'react-router-dom'
import { logger } from '@/helpers/logger'
import QuestionTypeIcon from '@/constants/questionTypeIcon'
import { useSnackbar } from 'notistack'
import LoadingSpinner from '../loader'
import { ListService } from '@/services/list.service'
import ProjectBuilderSectionComponent from '../project-builder-section'
// import parse from "html-react-parser";
import AddIcon from '@mui/icons-material/Add'

import ProjectBuilderPreviewComponent from '../project-builder-preview'
import ConfirmDeleteModalComponent from '../confirm-delete-modal'

import SectionsQuestionsListComponent from '../sections-questions-list'
import ExportXmlComponent from '../export-xml'
import MultiPreviewerComponent from '../multi-previewer'
import AddBtn from '@/components/add-btn'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import TextField from '../text-field'

import EditIcon from '@mui/icons-material/Edit'
import CancelIcon from '@mui/icons-material/Cancel'
import DoneIcon from '@mui/icons-material/Done'
import { StyledTitle } from '../thread-chat-header/thread-chat-style'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { ProjectRequest } from '@/types/project-request.type'
import { ProjectRequestService } from '@/services/project-request.service'
import DownloadIcon from '@mui/icons-material/Download'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import StayCurrentPortraitIcon from '@mui/icons-material/StayCurrentPortrait'
import ComputerIcon from '@mui/icons-material/Computer'
import { ThemeTypes } from '@/types/builder-theme-type'

import { ProjecFileType } from '@/enums'
import ThreeDGrid from '../questions-component/3d-grid'
import SubQuestionAddModalComponent from '../sub-question-add-modal'
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions'
import ExportJSONComponent from '../upload-json'
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadModal from '../project-media-upload-modal/project-media-upload-modal.component'
// import UploadModalSelect from '../project-media-upload-modal-select/project-media-upload-modal-select.component'
// import { FilesTypes } from '../project-media-upload-modal/project-media-upload-modal.type'
import MovieIcon from '@mui/icons-material/Movie';

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
  17: ThreeDGrid,
}

const DUMMYTHEMEJSON: ThemeTypes = {
  fontFamily: 'Times New Roman',
  backgroundColor: '#f5f5f5',
  backgroundImage: ``,
  backgroundRepeat: false,
  breakpoint: 700,
  button: {
    backgroundColor: `${theme.palette.primary.main}`,
    borderColor: '#fff',
    color: '#fff',
    text: 'Text',
    textAlign: 'left',
  },
  controls: {
    selected: {
      color: 'blue',
    },
    unselected: {
      color: '#000',
    },
  },
  header: {
    url: '',
    backgroundColor: `${theme.palette.primary.main}`,
    borderColor: '#000',
    color: `#ffff`,
    text: 'Text',
    textAlign: 'left',
  },
  instructions: {
    backgroundColor: '#fff',
    borderColor: '#000',
    color: 'black',
    text: 'Text',
    textAlign: 'left',
  },
  questions: {
    backgroundColor: '#fff',
    borderColor: '#ffff',
    color: 'black',
    text: 'Text',
    textAlign: 'left',
  },
}

let html_404_data = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Data Not Available</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center; /* Center align the content */
        }

        .content {
            margin: auto; /* Center the content horizontally */
        }

        h1 {
            font-size: 6em;
            color: #333;
            margin: 0;
        }

        p {
            font-size: 1.5em;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="content">
        <h1>404</h1>
        <p><strong>Data Not Available</strong></p>
    </div>
</body>
</html>

`

const ProjectSurveyBuilderComponent = (props: ProjectSurveyBuilderComponentProps) => {
  let { setFullViewMode, fullViewMode, project, projectStatusIdChange, get_project_byid, setChangeModal, getProjectThread } = props
  const [sections, setSections] = useState<Section[]>([])
  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
  const [hideSection, setHideSection] = useState(false)
  const [hideConf, setHideConf] = useState(false)
  const [questionEdit, setQuestionEdit] = useState(false)
  const [questionPreview, setQuestionPreview] = useState<any>(null)
  const [questionTypeList, setQuestionTypeList] = useState<QuestionListTypes[]>([])
  const [sortingList, setSortingList] = useState<SortingListTypes[]>([])
  const [loading, setLoading] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [createQuestionId, setCreateQuestionId] = useState<number | null>(null)
  const [sectionAdd, setSectionAdd] = useState(false)
  const [preview, setPreview] = useState(false)
  const [previewFull, setPreviewFull] = useState(false)
  const [sectionDelete, setSectionDelete] = useState(false)
  const [questionDelete, setQuestionDelete] = useState(false)
  const [questionSoftDelete, setQuestionSoftDelete] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)
  const [exportXml, setExportXml] = useState(false)
  const [exportJson, setExportJson] = useState(false)
  const [multiPreviewer, _setMultiPreviewer] = useState(false)
  const [swap, setSwap] = useState(false)
  const [html, setHtml] = useState('')

  const [threadsCount, setThreadsCount] = useState<number>(0)
  const [threadsAll, setThreadsAll] = useState(false)
  const matches = useMediaQuery('(max-width:1600px)')
  const [first, setFirst] = useState(true)
  // const [surveyFirst, setSurveyFirst] = useState(false)
  const [_retriveData, setRetriveData] = useState<Array<ProjectRequest>>([])
  const [exportBbProjectDoc, setExportBbProjectDoc] = useState(false)
  const [projectThread, setProjectThread] = useState(false)
  const [originalDoc, setOriginalDoc] = useState(false)
  const [createSectionId, setCreateSectionId] = useState<number | null>(null)
  const [threadOpen, setThreadOpen] = useState(false)
  const [sectionSoftDelete, setSectionSoftDelete] = useState(false)
  const [mobileView, setMobileView] = useState(false)
  const [questionTheme, setQuestionTheme] = useState<ThemeTypes | null>(DUMMYTHEMEJSON)
  const service = new ProjectRequestService()
  //
  const [questionCompare, setQuestionCompare] = useState(false)
  const [subQuestion, setSubQuestion] = useState<any>(null)
  const [subOpen, setSubOpen] = useState<number | null>(null)
  const [questionSubDelete, setQuestionSubDelete] = useState(false)
  const [createSubQuestionId, setCreateSubQuestionId] = useState<number | null>(null)
  const [subAdd, setSubAdd] = useState(false)
  const [sectionCompare, setSectionCompare] = useState(false)

  const [showInput, setShowInput] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [showSkeleton, setshowSkeleton] = useState(false)
  const [questionError, setquestionError] = useState(false)

  const [allSwapData, setAllSwapData] = useState({})
  const [swapList, setSwapList] = useState<any[]>([])
  const [dummySection, setDummySection] = useState<any>(null)
  const [dummySelectedQuestion, setDummySelectedQuestion] = useState<any>(null)
  const [discardPopup, setDiscardPopup] = useState(false)


  // // upload media
  const [uploadMediaModal, setUploadMediaModal] = useState(false)
  // const [uploadMediaModalSelect, setUploadMediaModalSelect] = useState(false)
  // const [selectedFileQuestionTitle, setSelectedFileQuestionTitle] = useState<FilesTypes | null>(null);

  // const [selectedFileQuestionAnswer, setSelectedFileQuestionAnswer] = useState<FilesTypes | null>(null);
  // const [uploadAnswerIndex, setUploadAnswerIndex] = useState<number | null>(null)



  const changeTitleSubmitHandler = () => {
    updateThreadTitle(newTitle)
    setNewTitle('')
    setShowInput(false)
  }

  function toggleResolve() {
    if ((selectedThread as any).thread_status_id === 1) updateThreadStatus(2)
    else updateThreadStatus(1)
  }

  const open = Boolean(anchorEl)

  let projectService = new ProjectService()
  let listServices = new ListService()
  let { projectId, surveyId } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  // let navigate = useNavigate()

  const {
    postProjectThread,
    postThread,
    projectThreads,
    selectedThread,
    setSelectedThread,
    threadCardClickHandler,
    patchThread,
    getAllProjectThreads,
  } = props

  const [showThreads, setShowThreads] = useState(false)
  const { surveys, selectedSurvey, surveyFirst, setSurveyFirst, getSurveys }: any = useOutletContext()

  const [changesQuestionId, setChangedQuestionId] = useState<number | null>(null)

  const surveyStatus = surveys?.find((item: { id: any }) => item?.id == selectedSurvey)?.status_id
  const surveyType = surveys?.find((item: { id: any }) => item?.id == selectedSurvey)?.type_id
  function postNewThread() {
    let threadName = surveys?.find((item: { id: any }) => item?.id == selectedSurvey)?.survey_name
    if (threadName) {
      postProjectThread(threadName)
    }
  }

  function fetchHtmlData() {
    setHtml('<div></div>')
    projectService.get_project_files(projectId, Number(surveyId), [19]).then((data) => {
      if (data.length > 0) {
        let this_file = data[0]
        console.log(this_file)
        let file_url = this_file?.file_url
        setshowSkeleton(false)
        fetch(file_url)
          .then((response) => {
            response.text().then((html_string) => {
              setHtml(html_string)
              setshowSkeleton(false) //set skeleton false
            })
          })
          .catch((err) => {
            console.error(err)
          })
      } else {
        setshowSkeleton(false)
        setHtml(html_404_data)
      }
    })
  }

  // useEffect(() => {
  //   fetchHtmlData()
  // }, [fetchHtml]) //call it first time and when document changes

  // Only run this effect once after initial render

  useEffect(() => {
    if (project) {
      // convertToHtml()
      if (
        (surveyType === 2 && surveyStatus === 1) ||
        (surveyStatus === 2 && surveyType === 2)
        // (surveyStatus === 3 && surveyType === 2)
        // surveyStatus === 4
      ) {
        if (surveyStatus === 2 && surveyType === 2 && sections.length > 0) {
          setPreviewFull(false)
        } else if (surveyType === 2) {
          setPreviewFull(true)
        } else {
          setPreviewFull(false)
        }
      } else {
        setPreviewFull(false)
      }
    }
  }, [project, sections])

  function cleanText(text: string): string {
    // Remove HTML tags
    // let cleanedText = text.replace(/<[^>]*>|&nbsp;/g, '')
    let cleanedText = text.replace(/<[^>]*>|&nbsp;|\[.*?\]/g, '')
    cleanedText = cleanedText.replace(/\[.*?\]/g, '') //remove [ ]
    cleanedText = cleanedText.replace(/(\[[^\]]*\]|\([^)]*\))/g, '') //remove()
    // Remove extra spaces
    cleanedText = cleanedText.replace(/\s+/g, '') //remove whitespace
    return cleanedText
  }
  const scrollToElement = (text: string) => {
    console.log(text)

    const container = document.getElementById('docviewer-div') //get the particular element
    const traverseDOM = (element: HTMLElement) => {
      if (
        element.children.length <= 2 &&
        element.textContent &&
        cleanText(element.textContent.toLowerCase()).includes(cleanText(text.toLowerCase()))
      ) {
        //as there can be multiple children with in the tage

        if (element) {
          element.style.backgroundColor = 'yellow'
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setTimeout(() => {
            element.style.backgroundColor = 'white' // Reset background color after a certain time
          }, 5000)
        }
        return 0 //return 0 to break at first instace
      } else {
        for (let i = 0; i < element.children.length; i++) {
          if (traverseDOM(element.children[i] as HTMLElement) == 0) {
            break
          }
        }
      }
    }
    if (container) {
      traverseDOM(container)
    }
  }

  useEffect(() => {
    console.log(selectedSection?.questions?.length, 'selectedSectionselectedSectionselectedSection')
    if (selectedSection?.questions?.length > 0) {
      if ((first || surveyFirst) && selectedSection?.questions?.length > 0) {
        setSelectedQuestion(selectedSection.questions[0])
        setFirst(false)
        setSurveyFirst(false)
      } else {
        if (deleteMode && selectedSection) {
          if (selectedSection?.questions?.length > 0) {
            if (subOpen && subQuestion) {
              setQuestionPreview(null)
              if (selectedQuestion.sub_questions.length > 0) {
                let checkQuestion = selectedSection?.questions.find((question: Question) => question.question_id === selectedQuestion?.question_id)
                if (checkQuestion) {
                  setTimeout(() => {
                    setSelectedQuestion(checkQuestion)
                    setSubQuestion(checkQuestion.sub_questions[0])
                  }, 100)
                }
                setQuestionPreview(null)
                setSubQuestion(null)
              }
              setDeleteMode(false)
            } else {
              setQuestionPreview(null)
              setTimeout(() => {
                setSelectedQuestion(selectedSection.questions[0])
              }, 100)
              setDeleteMode(false)
            }
          } else {
            setQuestionPreview(null)
            setSelectedQuestion(null)
            setDeleteMode(false)
          }
        } else {
          if (selectedSection && !createQuestionId && !createSubQuestionId) {
            if (selectedSection?.questions?.length > 0) {
              if (subQuestion) {
                let checkQuestion = selectedSection?.questions.find((question: Question) => question.question_id === selectedQuestion?.question_id)
                if (checkQuestion) {
                  let checkSubQuestion = checkQuestion?.sub_questions.find((question: Question) => question.question_id === subQuestion?.question_id)
                  setSelectedQuestion(checkQuestion)
                  if (checkQuestion) {
                    setSubQuestion(checkSubQuestion)
                  }
                }
              } else {
                let checkQuestion = selectedSection?.questions.find((question: Question) => question.question_id === selectedQuestion?.question_id)
                if (checkQuestion) {
                  setSelectedQuestion(checkQuestion)
                }
              }
            }
          } else {
            if (createSubQuestionId) {
              let checkQuestion = selectedSection?.questions.find((question: Question) => question.question_id === selectedQuestion?.question_id)
              if (checkQuestion) {
                let checkSubQuestion = checkQuestion?.sub_questions.find((question: Question) => question.question_id === createSubQuestionId)
                setSelectedQuestion(checkQuestion)
                if (checkSubQuestion) {
                  setSubQuestion(checkSubQuestion)
                  setCreateSubQuestionId(null)
                }
              }
            } else {
              let checkQuestion = selectedSection?.questions.find((question: Question) => question.question_id === createQuestionId)
              if (checkQuestion) {
                setSelectedQuestion(checkQuestion)
                setCreateQuestionId(null)
              }
            }
          }
        }
      }
    }
    // else if (selectedSection?.questions?.length == 0 || selectedSection?.questions?.length == undefined) {
    //   setSelectedQuestion(null)
    // }
  }, [selectedSection, createQuestionId])

  useEffect(() => {
    if (sections.length > 0) {
      let checkSection = sections.find((section) => section.section_id === selectedSection?.section_id)
      if (checkSection && !createSectionId) {
        setSelectedSection(checkSection)
      } else if (createSectionId) {
        let checkSection = sections.find((section) => section.section_id === createSectionId)
        setSelectedSection(checkSection)
        setCreateSectionId(null)
      } else if (deleteMode) {
        setSelectedSection(sections[0])
        setDeleteMode(false)
      } else if (first) {
        setSelectedSection(sections[0])
        if (sections[0]?.questions?.length <= 0) {
          setFirst(false)
        }
      } else {
        setSelectedSection(sections[0])
      }
    }
    // console.log(sections, "localDatalocalDataundefined")
    // if (sections[0]?.questions?.length == 0 || sections[0]?.questions?.length == undefined) {
    //   // console.log(sections, "localDatalocalDataundefined")
    //   setSelectedQuestion(null)
    //   setSelectedSection(null)
    // }
  }, [sections, createSectionId])

  useEffect(() => {
    // if (!sections[0]?.questions) {
    setSelectedQuestion(null)
    setSelectedSection(null)
    // }
  }, [selectedSurvey])

  useEffect(() => {
    if (selectedQuestion) {
      setQuestionEdit(true)
    }
  }, [selectedQuestion])

  useEffect(() => {
    getProjectTemplate()
    getQuestionTypes()
    getSotingOrderList()
    getQuestionTheme()
  }, [projectId, surveyId, project])

  const getProjectTemplate = async () => {
    setLoading(true)
    if (projectId && surveyId)
      try {
        let data = await projectService.get_project_template(String(projectId), Number(surveyId))
        console.log(data, "datadata")
        let localData = data.map((valSec) => {
          let localQuestion = valSec.questions
            .filter((ques) => ques.parent_id === null)
            .map((ques) => {
              if (ques.question_type_id === 17) {
                let myObject: any = {}
                valSec.questions
                  .filter((val) => ques.question_id === val.parent_id)
                  .map((val) => {
                    myObject[Number(val.child_sort_order)] = val
                  })
                let myArray2 = Object.keys(myObject).map((id) => myObject[id])
                ques.sub_questions = myArray2
              }
              return ques
            })
          valSec.questions = localQuestion
          return valSec
        })
        // console.log(localData, "localDatalocalData", localData[0]?.questions?.length)
        // if (data && localData && (localData[0]?.questions?.length == 0 || localData[0]?.questions?.length == undefined)) {
        //   console.log(localData[0], "localDatalocalDataundefined")
        //   setSelectedQuestion(null)
        //   setSelectedSection(null)
        // }
        setSections(localData)
        setLoading(false)
      } catch (error) {
        logger.error(error)
        setLoading(false)
      }
  }

  // useEffect(() => {
  //   if (sections && sections?.length > 0 && (sections[0]?.questions?.length == 0 || sections[0]?.questions?.length == undefined)) {
  //     console.log(sections, "localDatalocalDataundefined")
  //     setSelectedQuestion(null)
  //     setSelectedSection(null)
  //   }
  // }, [sections])

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

  const getSotingOrderList = async () => {
    try {
      let data = await listServices.question_answer_sorting()
      let response = data.map((val: any) => {
        return {
          value: val.id,
          text: val.name,
        }
      })
      setSortingList(response)
    } catch (error) {
      logger.error(error)
    }
  }

  const SaveSubQuestion = async (obj: any) => {
    let greaterNumber =
      selectedQuestion?.sub_questions.length > 0
        ? Math.max(...selectedQuestion?.sub_questions.map((subQues: Question) => Number(subQues.child_sort_order)))
        : 0
    setLoading(true)
    if (projectId && surveyId)
      try {
        let data: any = await projectService.add_project_builder_question(
          String(projectId),
          Number(surveyId),
          String(selectedSection.section_id),
          obj,
          String(selectedQuestion.question_id),
          Number(greaterNumber + 1),
        )
        await getProjectTemplate()
        setCreateSubQuestionId(Number(data?.id))
        SubHandleClose()
        enqueueSnackbar('Question Sucessfully Created', {
          variant: 'success',
        })
        setLoading(false)
      } catch (error) {
        setLoading(false)
        logger.error(error)
        if ((error as any)?.error_message?.data) {
          enqueueSnackbar(`${(error as any)?.error_message?.data?.message}`, {
            variant: 'error',
          })
        } else {
          enqueueSnackbar(`Oops somthing went wrong !!`, {
            variant: 'error',
          })
        }
      }
  }

  const QuestionSortOrder = async (questionData: any[]) => {
    setLoading(true)

    try {
      await projectService.sort_project_builder_question(questionData, String(projectId), Number(surveyId), String(selectedSection.section_id))
      // enqueueSnackbar("Questions sort successfully", {
      //   variant: "success",
      // });
    } catch (e) {
      console.log(e)
      enqueueSnackbar('Oops somthing went wrong !!', {
        variant: 'error',
      })
      setLoading(false)
    }
  }
  const SaveQuestion = async (obj: any) => {
    console.log(obj, "objobjobj")
    setLoading(true)
    if (obj.question_id === -1 && projectId && surveyId) {
      let sort_order = selectedSection.questions.find((val: any) => val.question_id === -1)?.question_sort_order
      let idCheck = false
      let array: any = []
      selectedSection.questions.map((val: any) => {
        if (val.question_id == -1) {
          idCheck = true
        }
        if (idCheck) {
          array.push(val)
        }
      })
      let questionData = array
        .filter((val: any) => val.question_id !== -1)
        .map((val: any) => {
          return {
            question_id: val.question_id,
            sort_order: val.sorting_order + 1,
          }
        })
      try {
        if (questionData.length > 0) {
          await QuestionSortOrder(questionData)
        }
        let data: any = await projectService.add_project_builder_question(
          String(projectId),
          Number(surveyId),
          String(selectedSection.section_id),
          obj,
          '',
          null,
          sort_order ? Number(sort_order + 1) : Number(selectedSection?.questions.length + 1),
        )
        await getProjectTemplate()
        setCreateQuestionId(Number(data?.id))
        setLoading(false)
        // setSelectedFileQuestionTitle(null)
        enqueueSnackbar('Question Sucessfully Created', {
          variant: 'success',
        })
      } catch (error) {
        setLoading(false)
        logger.error(error)
        if ((error as any)?.error_message?.data) {
          enqueueSnackbar(`${(error as any)?.error_message?.data?.message}`, {
            variant: 'error',
          })
        } else {
          enqueueSnackbar(`Oops somthing went wrong !!`, {
            variant: 'error',
          })
        }
      }
    } else {
      if (projectId && surveyId)
        try {
          await projectService.update_project_builder_question(
            String(projectId),
            Number(surveyId),
            String(obj.question_id),
            String(subQuestion ? selectedQuestion?.question_id : ''),
            String(selectedSection.section_id),
            Number(subQuestion?.child_sort_order),
            obj,
            Number(selectedQuestion?.sorting_order),
          )
          getProjectTemplate()
          setLoading(false)
          // setSelectedFileQuestionTitle(null)
          enqueueSnackbar('Question Sucessfully Saved', {
            variant: 'success',
          })
        } catch (error) {
          setLoading(false)
          logger.error(error)
          if ((error as any)?.error_message?.data) {
            enqueueSnackbar(`${(error as any)?.error_message?.data?.message}`, {
              variant: 'error',
            })
          } else {
            enqueueSnackbar(`Oops somthing went wrong !!`, {
              variant: 'error',
            })
          }
        }
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  function updateThreadStatus(status: number) {
    if (selectedThread) {
      patchThread(selectedThread.id, { thread_status_id: status })
    }
  }

  function updateThreadTitle(title: string) {
    if (selectedThread) {
      patchThread(selectedThread.id, { thread_title: title })
    }
  }

  const handleDeleteClose = () => {
    setSectionDelete(false)
    setQuestionDelete(false)
    setQuestionSoftDelete(false)
    setSectionSoftDelete(false)
    setQuestionSubDelete(false)
  }

  const SectionDelete = async () => {
    setLoading(true)
    if (projectId && surveyId && selectedSection?.section_id)
      try {
        await projectService.del_project_builder_section(String(projectId), Number(surveyId), String(selectedSection?.section_id))
        handleDeleteClose()
        setDeleteMode(true)
        await getProjectTemplate()
        setLoading(false)
        enqueueSnackbar('Node deleted successfully', {
          variant: 'success',
        })
      } catch (e) {
        console.log(e)
        enqueueSnackbar('Oops somthing went wrong !!', {
          variant: 'error',
        })
        setLoading(false)
      }
  }

  const QuestionDelete = async () => {
    setLoading(true)
    if (projectId && surveyId)
      try {
        await projectService.del_project_builder_question(
          String(projectId),
          Number(surveyId),
          String(selectedSection?.section_id),
          String(questionSubDelete ? subQuestion?.question_id : selectedQuestion?.question_id),
        )
        handleDeleteClose()
        setDeleteMode(true)
        if (!questionSubDelete) {
          const updatedAnswers = selectedSection?.questions
            .filter((question: any) => question.question_id !== selectedQuestion?.question_id)
            .map((question: any, index: number) => {
              return {
                question_id: question.question_id,
                sort_order: index + 1,
              }
            })
          if (updatedAnswers.length > 0) {
            await QuestionSortOrder(updatedAnswers)
          }
        }
        await getProjectTemplate()
        setLoading(false)
        enqueueSnackbar('Question deleted successfully', {
          variant: 'success',
        })
      } catch (e) {
        console.log(e)
        console.log(questionError)
        enqueueSnackbar('Oops somthing went wrong !!', {
          variant: 'error',
        })
        setLoading(false)
      }
  }

  const QuestionSoftDelete = () => {
    let sectionPayload = [...sections]
    sectionPayload.map((val) => {
      if (selectedSection?.section_id === val.section_id) {
        val.questions = val.questions.filter((ques) => ques.question_id !== -1).map((ques) => ques)
      }
      return val
    })
    setSections(sectionPayload)
    setQuestionPreview(null)
    setSelectedQuestion(null)
    if (selectedSection?.questions?.length > 0) {
      let questionSelect: any = selectedSection?.questions[0]
      setTimeout(() => {
        setSelectedQuestion(questionSelect)
      }, 100)
    } else {
      setSelectedQuestion(null)
    }
    handleDeleteClose()
    enqueueSnackbar('Question deleted successfully', {
      variant: 'success',
    })
  }

  const SectionSoftDelete = () => {
    let sectionPayload = [...sections]
    sectionPayload = sectionPayload
      .filter((val) => val?.section_id !== -1)
      .map((val) => {
        return val
      })
    setSections(sectionPayload)
    setQuestionPreview(null)
    setSelectedQuestion(null)
    if (sections.length > 0) {
      setSelectedSection(sections[0])
    } else {
      setSelectedSection(null)
    }
    handleDeleteClose()
    enqueueSnackbar('Section deleted successfully', {
      variant: 'success',
    })
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
    } else if (type === 17) {
      return '3D Grid Type'
    }
  }

  // relase
  const handleExportXmlClose = () => {
    setExportXml(false)
  }
  const handleExportJsonClose = () => {
    setLoading(true)
    setExportJson(false)
    get_project_byid()
    getSurveys()
    setTimeout(() => {
      setFirst(true)
      setLoading(false)
    }, 100)
  }

  const CreateThread = async () => {
    setLoading(true)
    // surveys, selectedSurvey

    if (projectId && surveyId)
      try {
        let data = await projectService.createProjectThreadsById(
          Number(projectId),
          Number(surveyId),
          String(`${selectedQuestion?.question_name}_${selectedQuestion?.question_id}_thread`),
          Number(selectedQuestion?.question_id),
          String(selectedQuestion?.question_name),
          String(selectedQuestion?.question_title),
        )
        setLoading(false)
        await getAllProjectThreads()
        if (swap === false) {
          setSwap(true)
        }
        setTimeout(() => {
          setHideConf(false)
        }, 200)
        if (data && data.id) {
          threadCardClickHandler(data.id)
        }
        enqueueSnackbar('Thread create successfully', {
          variant: 'success',
        })
      } catch (e) {
        console.log(e)
        enqueueSnackbar('Oops somthing went wrong !!', {
          variant: 'error',
        })
        setLoading(false)
      }
  }

  useEffect(() => {
    let count = 0
    if (selectedQuestion) {
      projectThreads.filter((val: any) => {
        if (val?.questions && val.questions.question_id === selectedQuestion?.question_id) {
          count = count + 1
        }
      })
      if (count === 1 && selectedQuestion?.question_id !== -1 && !projectThread) {
        threadCardClickHandler(
          Number(projectThreads.find((val: any) => val?.questions && val.questions.question_id === selectedQuestion?.question_id)?.id),
        )
      } else if (!swap) {
        setSwap(false)
        setSelectedThread(null)
      } else if (!projectThread) {
        setSwap(false)
        setSelectedThread(null)
      }
    }
    setProjectThread(false)
  }, [selectedQuestion])

  useEffect(() => {
    let count = 0
    projectThreads.forEach((projectThread) => {
      if (projectThread.questions && Array.isArray(projectThread.questions)) {
        const index = projectThread.questions.findIndex((question) => question.question_id === selectedQuestion?.question_id)

        if (index >= 0) count++
      }
    })

    setThreadsCount(count)
  }, [projectThreads, selectedQuestion])

  async function getProjectRetriveByID() {
    if (projectId && surveyId)
      try {
        const data = await service.getProjectRetriveById(Number(projectId), Number(surveyId))
        setRetriveData(data)
      } catch (error) {
        enqueueSnackbar(<Typography variant="body1">Fetching requests failed</Typography>, {
          variant: 'error',
        })
      }
  }

  useEffect(() => {
    if (projectId && surveyId) {
      getProjectRetriveByID()
    }
  }, [projectId, surveyId])

  const getQuestionTheme = async () => {
    if (projectId)
      try {
        let data: any = await projectService.get_question_theme(Number(projectId))
        if (data?.properties) {
          setQuestionTheme(data?.properties)
        }
      } catch (error) {
        logger.error(error)
      }
  }

  const SubHandleClose = () => {
    setSubAdd(false)
  }

  // seEffect(() => {
  //   // if (sections[0]?.questions && surveyFirst) {
  //   //   // console.log(sections, "localDatalocalDataundefined")
  //   //   setSelectedQuestion(sections[0]?.questions[0])
  //   //   setSelectedSection(sections[0])
  //   //   setSurveyFirst(false)
  //   // } else if (!sections[0]?.questions?.length && surveyFirst) {
  //   setSelectedQuestion(null)
  //   // setSelectedSection(null)
  //   // setSurveyFirst(false)
  //   // }
  // }, [selectedSurvey])

  // useEffect(() => {
  //   setSurveyFirst(surveyFirst - 1)
  //   if(surveyFirst !== 1 && sections?.length){
  //     setSurveyFirst(1)
  //   }
  // }, [selectedSurvey])

  // console.log(surveyFirst, selectedQuestion, selectedSection, sections, "sectionssectionssectionssections")

  const isPrevDisabled = () => {
    const currentIndex = selectedSection.questions.findIndex((question: any) => question.question_id === selectedQuestion.question_id)
    const currentSectionIndex = sections.findIndex((section) => section.section_id === selectedSection.section_id)

    // Disable if it's the first question of the first section
    return currentIndex === 0 && currentSectionIndex === 0
  }

  const isNextDisabled = () => {
    const currentIndex = selectedSection.questions.findIndex((question: any) => question.question_id === selectedQuestion.question_id)
    const currentSectionIndex = sections.findIndex((section) => section.section_id === selectedSection.section_id)

    // Disable if it's the last question of the last section
    return currentIndex === selectedSection.questions.length - 1 && currentSectionIndex === sections.length - 1
  }

  const handlePrevClick = () => {
    if (questionCompare) {
      const currentIndex = selectedSection.questions.findIndex((question: any) => question.question_id === selectedQuestion.question_id)

      let newSelectedQuestion = null
      setDiscardPopup(true)
      if (currentIndex > 0) {
        // Move to the previous question within the same section
        newSelectedQuestion = selectedSection.questions[currentIndex - 1]
        setDummySelectedQuestion(newSelectedQuestion)
        setDummySection('')
      } else {
        // Move to the previous section if available
        const currentSectionIndex = sections.findIndex((section) => section.section_id === selectedSection.section_id)

        if (currentSectionIndex > 0) {
          const prevSection = sections[currentSectionIndex - 1]
          setDummySection(prevSection)

          if (prevSection.questions.length > 0) {
            newSelectedQuestion = prevSection.questions[prevSection.questions.length - 1]
            setDummySelectedQuestion(newSelectedQuestion)
          } else {
            setDummySelectedQuestion(null)
          }
        }
      }
    } else {
      const currentIndex = selectedSection.questions.findIndex((question: any) => question.question_id === selectedQuestion.question_id)

      let newSelectedQuestion = null

      if (currentIndex > 0) {
        // Move to the previous question within the same section
        newSelectedQuestion = selectedSection.questions[currentIndex - 1]
        setSelectedQuestion(newSelectedQuestion)
      } else {
        // Move to the previous section if available
        const currentSectionIndex = sections.findIndex((section) => section.section_id === selectedSection.section_id)

        if (currentSectionIndex > 0) {
          const prevSection = sections[currentSectionIndex - 1]
          setSelectedSection(prevSection)

          if (prevSection.questions.length > 0) {
            newSelectedQuestion = prevSection.questions[prevSection.questions.length - 1]
            setSelectedQuestion(newSelectedQuestion)
          } else {
            setSelectedQuestion(null)
          }
        }
      }
    }

    // If there is a new selected question, trigger the click event on its associated DOM element
    // if (newSelectedQuestion) {
    //   triggerClickOnQuestion(newSelectedQuestion.question_id);
    // }
  }

  // function triggerClickOnQuestion(questionId) {
  //   const questionSelector = `#question${questionId}`;
  //   const questionElement = document.querySelector(questionSelector);

  //   if (questionElement) {
  //     const clickEvent = new MouseEvent("click", {
  //       view: window,
  //       bubbles: true,
  //       cancelable: true,
  //     });

  //     // Dispatch the click event on the element
  //     questionElement.dispatchEvent(clickEvent);
  //   } else {
  //     console.error("Question element not found for ID:", questionId);
  //   }
  // }

  const handleNextClick = () => {
    if (questionCompare) {
      const currentIndex = selectedSection.questions.findIndex((question: any) => question.question_id === selectedQuestion.question_id)
      let newSelectedQuestion = null
      setDiscardPopup(true)

      if (currentIndex >= 0 && currentIndex < selectedSection.questions.length - 1) {
        // Move to the next question within the same section
        newSelectedQuestion = selectedSection.questions[currentIndex + 1]
        // setSelectedQuestion(newSelectedQuestion);
        setDummySelectedQuestion(newSelectedQuestion)
        setDummySection('')
      } else {
        // Move to the next section if available
        const currentSectionIndex = sections.findIndex((section) => section.section_id === selectedSection.section_id)

        if (currentSectionIndex >= 0 && currentSectionIndex < sections.length - 1) {
          const nextSection = sections[currentSectionIndex + 1]
          setDummySection(nextSection)

          if (nextSection.questions.length > 0) {
            newSelectedQuestion = nextSection.questions[0]
            setDummySelectedQuestion(newSelectedQuestion)
            // setSelectedQuestion(newSelectedQuestion);
          } else {
            setDummySelectedQuestion(null)
          }
        }
      }
    } else {
      const currentIndex = selectedSection.questions.findIndex((question: any) => question.question_id === selectedQuestion.question_id)

      let newSelectedQuestion = null

      if (currentIndex >= 0 && currentIndex < selectedSection.questions.length - 1) {
        // Move to the next question within the same section
        newSelectedQuestion = selectedSection.questions[currentIndex + 1]
        setSelectedQuestion(newSelectedQuestion)
      } else {
        // Move to the next section if available
        const currentSectionIndex = sections.findIndex((section) => section.section_id === selectedSection.section_id)

        if (currentSectionIndex >= 0 && currentSectionIndex < sections.length - 1) {
          const nextSection = sections[currentSectionIndex + 1]
          setSelectedSection(nextSection) // Assuming setSelectedSection sets the current section

          if (nextSection.questions.length > 0) {
            newSelectedQuestion = nextSection.questions[0]
            setSelectedQuestion(newSelectedQuestion)
          } else {
            setSelectedQuestion(null)
          }
        }
      }
    }

    // If there is a new selected question, trigger the click event on its associated DOM element
    // if (newSelectedQuestion) {
    //   triggerClickOnQuestion(newSelectedQuestion.question_id);
    // }
  }

  const getSwapTypes = async () => {

    let newlistdata = {
      "1": [
        2, 12
      ],
      "2": [
        1
      ],
      "3": [
        5, 7
      ],
      "5": [
        3, 8
      ],
      "7": [
        3, 8
      ],
      "8": [
        5, 7
      ],
      "12": [1]
    }
    try {
      // let data = await listServices.question_swap_list()
      setAllSwapData(newlistdata)
      updateSwapList(newlistdata, selectedQuestion?.question_type_id)
    } catch (error) {
      logger.error(error)
    }
  }

  const updateSwapList = (data: any, questionTypeId: string | number) => {
    const response = data[questionTypeId] || []
    setSwapList(response)
  }

  useEffect(() => {
    getSwapTypes()
  }, [])

  useEffect(() => {
    updateSwapList(allSwapData, selectedQuestion?.question_type_id)
  }, [selectedQuestion, allSwapData])

  console.log(questionTypeList, allSwapData, "selectedQuestionselectedQuestionselectedQuestion", selectedQuestion)

  // console.log(subQuestion, selectedQuestion, subQuestion?.question_type_id, selectedQuestion?.question_type_id, changesQuestionId, "subQuestion?.question_type_id : selectedQuestion?.question_type_id")
  return (
    <Grid container spacing={showThreads ? 1 : preview ? 1 : 0.5}>
      <UploadModal open={uploadMediaModal} onClose={() => setUploadMediaModal(false)} />
      {/* <UploadModalSelect open={uploadMediaModalSelect} onClose={() => setUploadMediaModalSelect(false)}
        selectedFileQuestionTitle={selectedFileQuestionTitle} setSelectedFileQuestionTitle={setSelectedFileQuestionTitle}
        selectedFileQuestionAnswer={selectedFileQuestionAnswer} setSelectedFileQuestionAnswer={setSelectedFileQuestionAnswer}
        uploadAnswerIndex={uploadAnswerIndex} setUploadAnswerIndex={setUploadAnswerIndex} /> */}
      <Dialog open={discardPopup} maxWidth="sm" fullWidth>
        <DialogTitle id="alert-dialog-title">
          <Typography variant="h6">Confirm</Typography>
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography fontSize="15px" fontWeight="400">
              You have unsaved changes?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDiscardPopup(false)
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (dummySection) setSelectedSection(dummySection)

              setQuestionPreview(null)
              setSelectedQuestion(null)
              setSectionAdd(false)
              setTimeout(() => {
                setSelectedQuestion(dummySelectedQuestion)
                if (preview) {
                  scrollToElement(String(dummySelectedQuestion?.question_name))
                }
              }, 100)
              setThreadOpen(false)
              setDiscardPopup(false)
              setDummySelectedQuestion(null)
              setQuestionCompare(false)
              setDummySection(null)
            }}
            variant="contained"
          >
            Discard
          </Button>
        </DialogActions>
      </Dialog>
      <SubQuestionAddModalComponent
        open={subAdd}
        handleClose={SubHandleClose}
        sortingList={sortingList}
        SaveSubQuestion={SaveSubQuestion}
        selectedQuestion={selectedQuestion}
        loading={loading}
      />
      {loading && <LoadingSpinner />}
      <ConfirmDeleteModalComponent
        open={sectionDelete || questionDelete || questionSoftDelete || sectionSoftDelete || questionSubDelete}
        handleClose={handleDeleteClose}
        DeleteFunc={questionSoftDelete ? QuestionSoftDelete : sectionSoftDelete ? SectionSoftDelete : sectionDelete ? SectionDelete : QuestionDelete}
        title={'Are you sure?'}
        subTitle={questionDelete || questionSoftDelete ? 'Do you want to delete this question?' : 'Do you want to delete this section?'}
      />
      <ExportXmlComponent open={exportXml} handleClose={handleExportXmlClose} clientId={project?.client_id} />
      <Grid item xs={12}>
        <BuilderIconWrapper fullViewMode={fullViewMode}>
          <BuilderIconBox fullViewMode={fullViewMode}>
            <Tooltip title="Send for Testing">
              <IconButton
                size="small"
                onClick={async () => {
                  setLoading(true)
                  await projectStatusIdChange(5)
                  await getSurveys()
                  setLoading(false)
                }}
                sx={{
                  borderRadius: '4px !important',
                  display: surveyStatus === 4 ? '' : 'none',
                }}
              >
                <img src={ShareIcon} height="20px" /> &nbsp;
                <Typography variant="caption">Send For Testing</Typography>
              </IconButton>
            </Tooltip>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                display: surveyStatus === 4 ? '' : 'none',
              }}
            />
            <Tooltip title="Send for Review">
              <IconButton
                size="small"
                onClick={async () => {
                  // debugger

                  if (projectId && surveyId) {
                    let data = await projectService.get_project_files(projectId, Number(surveyId), [19])

                    if (data.length > 0 && questionError == false) {
                      setLoading(true)
                      await projectStatusIdChange(3)
                      await getSurveys()
                      setLoading(false)
                    } //no file exists

                    if (questionError == true) {
                      enqueueSnackbar('Errors In Questions', { variant: 'error' })
                    }
                    if (data.length == 0) {
                      enqueueSnackbar('Please Generate Html Document', { variant: 'error' })
                    }
                  }
                }}
                sx={{
                  borderRadius: '4px !important',
                  display: surveyStatus === 2 && sections.length > 0 ? '' : 'none',
                }}
              >
                <img src={ShareIcon} height="20px" /> &nbsp;
                <Typography variant="caption">Send For Review</Typography>
              </IconButton>
            </Tooltip>

            {/* <Tooltip title="Send for Approval">
              <IconButton
                size="small"
                onClick={async () => {
                  setLoading(true)
                  await projectStatusIdChange(5)
                  await getSurveys()
                  setLoading(false)
                }}
                sx={{
                  borderRadius: '4px !important',
                  display: surveyStatus === 4 && sections.length > 0 ? '' : 'none',
                }}
              >
                <img src={ShareIcon} height="20px" /> &nbsp;
                <Typography variant="caption">Send For Approval</Typography>
              </IconButton>
            </Tooltip> */}
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                display: surveyStatus === 2 && sections.length > 0 ? '' : 'none',
              }}
            />
            {/* 
            {retriveData.length > 0 ? (
              <>
                <Tooltip title="Send for Estimation Approval">
                  <IconButton
                    size="small"
                    onClick={async () => {
                      setLoading(true)
                      await projectStatusIdChange(3)
                      await getSurveys()
                      setLoading(false)
                    }}
                    sx={{
                      borderRadius: '4px !important',
                      display: surveyStatus === 2 ? '' : 'none',
                    }}
                  >
                    <img src={ShareIcon} height="20px" /> &nbsp;
                    <Typography variant="caption">Send For Estimation Approval</Typography>
                  </IconButton>
                </Tooltip>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{
                    display: surveyStatus === 2 ? '' : 'none',
                  }}
                />
              </>
            ) : (
              <>
                <Tooltip title="Create Estimation">
                  <IconButton
                    size="small"
                    onClick={async () => {
                      navigate(`/projects/${projectId}/survey/${selectedSurvey}/estimates`)
                    }}
                    sx={{
                      borderRadius: '4px !important',
                      display: surveyStatus === 2 ? '' : 'none',
                    }}
                  >
                    <img src={ShareIcon} height="20px" /> &nbsp;
                    <Typography variant="caption">Create Estimation</Typography>
                  </IconButton>
                </Tooltip>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{
                    display: surveyStatus === 2 ? '' : 'none',
                  }}
                />
              </>
              
            )} */}

            <Tooltip title="Upload JSON">
              <label htmlFor="upload_json">
                <IconButton
                  size="small"
                  component="span"
                  onClick={() => {
                    setExportJson(true)
                  }}
                  sx={{
                    borderRadius: '4px !important',
                    display: surveyType === 2 && surveyStatus === 2 ? '' : 'none',
                  }}
                >
                  {' '}
                  <img src={ShareIcon} height="20px" /> &nbsp;
                  <Typography variant="caption">Upload JSON</Typography>
                </IconButton>
              </label>
            </Tooltip>

            <ExportJSONComponent open={exportJson} handleClose={handleExportJsonClose} clientId={project?.client_id} />

            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                display: surveyType === 2 && surveyStatus === 2 ? '' : 'none',
              }}
            />

            <Tooltip title="Show Threads">
              <IconButton
                size="small"
                sx={{
                  borderRadius: '4px !important',
                  background: showThreads ? `${theme.palette.primary[200]}` : '',
                  display: originalDoc || !previewFull || surveyType !== 2 ? 'none' : '',
                }}
                onClick={() => {
                  if (previewFull) {
                    setShowThreads(!showThreads)
                  }
                }}
              >
                <img src={CommentIcon} height="20px" /> &nbsp;
                <Typography variant="caption">Show Threads</Typography>
              </IconButton>
            </Tooltip>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                display: originalDoc || !previewFull || surveyType !== 2 ? 'none' : '',
              }}
            />

            <Tooltip title={!preview ? 'Compare Mode' : 'Switch to preview'}>
              <IconButton
                size="small"
                sx={{
                  borderRadius: '4px !important',
                  background: preview ? `${theme.palette.primary[200]}` : '',
                  display: originalDoc ? 'none' : previewFull ? 'none' : surveyType !== 2 ? 'none' : '',
                }}
                onClick={() => {
                  if (surveyType === 2) {
                    setPreview(!preview)
                    fetchHtmlData()
                    setTimeout(() => {
                      scrollToElement(selectedQuestion?.question_title)
                    }, 100)
                    if (!preview) {
                      setThreadOpen(false)
                    }
                  }
                }}
              >
                {!preview ? <img src={CompareFill} height="20px" /> : <ArrowBackIcon fontSize="small" />}
                &nbsp;
                <Typography variant="caption">{!preview ? 'Compare Mode' : 'Switch to preview'}</Typography>
              </IconButton>
            </Tooltip>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                display: originalDoc ? 'none' : previewFull ? 'none' : surveyType !== 2 ? 'none' : '',
              }}
            />

            <Tooltip title="Original Document Download">
              <IconButton
                onClick={async () => {
                  if (surveyId)
                    projectService.get_project_files(projectId, Number(surveyId), [ProjecFileType.DOCS]).then((data) => {
                      if (data?.length > 0) {
                        let myUrl = data[0].file_url

                        const link = document.createElement('a')
                        link.href = myUrl
                        link.target = '_blank'
                        link.setAttribute('download', project?.sp_document_url)
                        document.body.appendChild(link)
                        link.click()
                      } else {
                        enqueueSnackbar('No Data Foud', { variant: 'error' })
                      }
                    })
                }}
                size="small"
                sx={{
                  borderRadius: '4px !important',
                  display: surveyType !== 2 ? 'none' : '',
                }}
              >
                <DownloadIcon sx={{ color: theme.palette.grey[500] }} />
                <Typography variant="caption">&nbsp; Original Document Download</Typography>
              </IconButton>
            </Tooltip>

            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                display: surveyType !== 2 ? 'none' : '',
              }}
            />
            <Tooltip title="Upload Media">
              <IconButton
                onClick={() => {
                  // setMultiPreviewer(!multiPreviewer);
                  setUploadMediaModal(true)
                }}
                size="small"
                sx={{
                  borderRadius: '4px !important',
                  background: multiPreviewer ? `${theme.palette.primary[200]}` : '',
                  display: previewFull ? 'none' : '',
                }}
              >
                <MovieIcon sx={{ color: theme.palette.grey[500] }} />
                <Typography variant="caption"> &nbsp; Upload Media</Typography>
              </IconButton>
            </Tooltip>

            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                display: surveyType !== 2 ? 'none' : '',
              }}
            />
            <Tooltip title="Download Project Document">
              <IconButton
                onClick={() => {
                  // setMultiPreviewer(!multiPreviewer);
                  setExportBbProjectDoc(true)
                }}
                size="small"
                sx={{
                  borderRadius: '4px !important',
                  background: multiPreviewer ? `${theme.palette.primary[200]}` : '',
                  display: previewFull ? 'none' : '',
                }}
              >
                <DownloadIcon sx={{ color: theme.palette.grey[500] }} />
                <Typography variant="caption"> &nbsp; Download Project Document</Typography>
              </IconButton>
            </Tooltip>

            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                display: previewFull ? 'none' : '',
              }}
            />
            <Tooltip title="Refresh Project HTML">
              <IconButton
                onClick={async () => {
                  setshowSkeleton(true)
                  projectService
                    .get_project_questionnaire_html(project.project_id, Number(surveyId))
                    .then((file_url) => {
                      console.log(file_url)
                      fetchHtmlData()
                    })
                    .catch((error) => {
                      setshowSkeleton(false)
                      enqueueSnackbar('Error In Generating Html Document', { variant: 'error' })
                      console.log(error)
                    })

                  // setExportBbProjectDoc(true)
                }}
                size="small"
                sx={{
                  borderRadius: '4px !important',
                  background: multiPreviewer ? `${theme.palette.primary[200]}` : '',
                  display: previewFull ? 'none' : '',
                }}
              >
                <IntegrationInstructionsIcon sx={{ color: theme.palette.grey[500] }} />
                <Typography variant="caption"> &nbsp;Refresh HTML</Typography>
                {showSkeleton && <CircularProgress size={24} color="inherit" style={{ marginLeft: '10px' }} />}
              </IconButton>
            </Tooltip>

            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                display: previewFull ? 'none' : '',
              }}
            />

            <Tooltip title={swap ? 'Question' : 'Thread'}>
              <IconButton
                size="small"
                sx={{
                  borderRadius: '4px !important',
                  display: originalDoc || preview || previewFull ? 'none' : '',
                  background: swap ? `${theme.palette.primary[200]}` : '',
                }}
                onClick={() => {
                  // if (sectionAdd) {
                  //   setSectionAdd(false);
                  //   setQuestionEdit(false);
                  // } else if (selectedSection) {
                  //   // setSelectedQuestion(null);
                  //   // setSelectedSection(null);
                  //   setQuestionEdit(false);
                  // }
                  setSwap(!swap)
                }}
              >
                <img src={SwapIcon} height="20px" /> &nbsp;
                <Typography variant="caption" width={'50px'}>
                  {swap ? 'Question' : 'Thread'}
                </Typography>
              </IconButton>
            </Tooltip>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                display: originalDoc || preview || previewFull ? 'none' : '',
              }}
            />
            <Tooltip title="Export Xml">
              <IconButton
                size="small"
                onClick={() => {
                  setExportXml(true)
                }}
                sx={{
                  borderRadius: '4px !important',
                  display: sections.length <= 0 ? 'none' : '',
                }}
              >
                <img src={ExportIcon} height="20px" /> &nbsp;
                <Typography variant="caption">Export Xml</Typography>
              </IconButton>
            </Tooltip>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                display: sections.length <= 0 ? 'none' : '',
              }}
            />

            <Tooltip title={!originalDoc ? 'Original Document' : 'Switch Builder'}>
              <IconButton
                onClick={() => {
                  setOriginalDoc(!originalDoc)
                }}
                size="small"
                sx={{
                  borderRadius: '4px !important',
                  background: originalDoc ? `${theme.palette.primary[200]}` : '',
                  display: sections.length <= 0 || surveyType !== 2 ? 'none' : '',
                }}
              >
                {!originalDoc ? <img src={ViewIcon} height="20px" /> : <ArrowBackIcon fontSize="small" />}
                &nbsp;
                <Typography variant="caption">{!originalDoc ? 'Original Document' : 'Switch Builder'}</Typography>
              </IconButton>
            </Tooltip>

            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                display: sections.length <= 0 || surveyType !== 2 ? 'none' : '',
              }}
            />
            <Tooltip title={'Refresh'}>
              <IconButton
                size="small"
                sx={{
                  borderRadius: '4px !important',
                  // background: fullViewMode ? `${theme.palette.primary[200]}` : '',
                }}
                onClick={() => {
                  setLoading(true)
                  getSurveys()
                  get_project_byid()
                  getAllProjectThreads()
                  setTimeout(() => {
                    setLoading(false)
                  }, 500)
                }}
              >
                <RefreshIcon style={{ color: '#8D8D8D' }} />
                &nbsp;
                <Typography variant="caption">{'Refresh'}</Typography>
              </IconButton>
            </Tooltip>

            <Divider
              orientation="vertical"
              variant="middle"
              flexItem

            />
            <Tooltip title={fullViewMode ? 'Full view exit' : 'Full view'}>
              <IconButton
                size="small"
                sx={{
                  borderRadius: '4px !important',
                  background: fullViewMode ? `${theme.palette.primary[200]}` : '',
                }}
                onClick={() => {
                  setFullViewMode(!fullViewMode)
                }}
              >
                {!fullViewMode ? <FullscreenIcon fontSize="small" /> : <img src={FillIcon} height="20px" />}
                &nbsp;
                <Typography variant="caption">{fullViewMode ? 'Full view exit' : 'Full view'}</Typography>
              </IconButton>
            </Tooltip>
          </BuilderIconBox>
        </BuilderIconWrapper>
      </Grid>

      {originalDoc ? (
        <Grid item xs={12} sx={{ display: !originalDoc ? 'none' : '', overflow: 'hidden' }}>
          <ProjectBuilderPreviewComponent
            html={html}
            showSkeleton={showSkeleton}
            setshowSkeleton={setshowSkeleton}
            fullViewMode={fullViewMode}
            projectStatusIdChange={projectStatusIdChange}
            get_project_byid={getSurveys}
            setChangeModal={setChangeModal}
            project={project}
            preview={preview}
            sections={sections}
            originalDoc={originalDoc}
          />
        </Grid>
      ) : (
        ''
      )}

      <Grid
        item
        xs={hideSection && preview ? 0.35 : previewFull ? 0 : hideSection ? 0.25 : !fullViewMode ? 2.2 : 2.5}
        style={{
          transition: 'all 0.1s ease-out',
          display: originalDoc || previewFull ? 'none' : '',
        }}
      >
        <DetailsBox
          sx={{
            padding: hideSection ? '0rem' : '1rem',
            background: hideSection ? 'none !important' : '',
            boxShadow: hideSection ? 'none !important' : '',
            height: hideSection ? 'auto !important' : 'auto !important',
            borderRadius: hideSection ? '0rem !important' : '',
            width: fullViewMode ? (hideSection ? '95% !important' : preview ? '98% !important' : '98% !important') : '100%',
            marginLeft: fullViewMode ? '8px' : '0%',
            position: 'relative',
            overflowX: 'hidden',
          }}
        >
          <Stack
            direction={!hideSection ? 'row' : 'column-reverse'}
            justifyContent="space-between"
            alignItems={'center'}
            sx={{
              marginBottom: '0.5rem',
            }}
          >
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => {
                  setHideSection(!hideSection)
                }}
                sx={{
                  borderRadius: '5px',
                  background: hideSection ? `${theme.palette.primary.light} !important` : '',
                }}
              >
                <img
                  src={backIcon}
                  height={matches ? 10 : 15}
                  alt="navidation-burger"
                  style={{
                    transform: hideSection ? 'rotate(180deg)' : '',
                    filter: hideSection ? 'invert(100%) sepia(0%) saturate(135%) hue-rotate(332deg) brightness(419%) contrast(228%)' : '',
                  }}
                />
              </IconButton>
              <Typography variant="h6" className="sb-section-name" sx={{ display: hideSection ? 'none' : '' }}>
                Questions
              </Typography>
              <Tooltip
                placement="right"
                title={
                  sections.find((val) => val?.questions.find((value) => value?.question_id === -1))
                    ? 'Please Save Exisiting Question'
                    : sections.find((val) => val.section_id === -1)
                      ? 'Please Save Exisiting Section'
                      : ''
                }
              >
                <Box
                  sx={{
                    display: hideSection ? 'none' : '',
                  }}
                >
                  <AddBtn
                    disabled={
                      sections.find((val) => val?.questions.find((value) => value?.question_id === -1)) ||
                        sections.find((val) => val.section_id === -1)
                        ? true
                        : false
                    }
                    // @ts-ignore
                    onClick={(e: any) => {
                      e.stopPropagation()
                      handleClick(e)
                    }}
                  />

                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setSectionAdd(true)
                        setQuestionEdit(false)
                        setSwap(false)
                        setHideConf(false)
                        setSelectedQuestion(null)
                        setSelectedThread(null)
                        let payload: any = {
                          section_id: -1,
                          section_code: '',
                          description: '',
                          section_name: `Default Node`,
                          questions: [],
                        }
                        let sectionPayload = [...sections]
                        sectionPayload.push(payload)
                        setSections(sectionPayload)
                        setTimeout(() => {
                          setSelectedSection(payload)
                        }, 200)
                        handleClose()
                      }}
                    >
                      <AddIcon />
                      <Typography variant="caption">Add Node</Typography>
                    </MenuItem>
                    {questionTypeList?.map((value: QuestionListTypes, i) => (
                      <MenuItem
                        key={i}
                        sx={{
                          display:
                            selectedSection === null
                              ? 'none'
                              : '' || selectedSection?.questions.find((val: any) => val?.question_id === -1)
                                ? 'none'
                                : '',
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          let payload: any = {
                            question_type_id: value.id,
                            question_code: 'Q1',
                            question_name: '',
                            question_data_code: `${selectedSection?.section_code}${selectedSection?.questions.length + 1}`,
                            question_title_formatted: SelectTypeText(Number(value.id)),
                            question_title: SelectTypeText(Number(value.id)),
                            question_id: -1,
                            required_question: true,
                            answer_sorting_order: 1,
                            answers: [
                              {
                                question_answer_code: 1,
                                question_answer_text: '',
                                is_active: true,
                              },
                              {
                                question_answer_code: 2,
                                question_answer_text: '',
                                is_active: true,
                              },
                            ],
                            prompt_answer: [],
                          }

                          let sectionPayload = [...sections]
                          if (selectedQuestion) {
                            let questionIndex = selectedSection?.questions.findIndex((val: any) => val.question_id === selectedQuestion.question_id)
                            payload.question_sort_order = questionIndex + 1
                            sectionPayload.map((val: any) => {
                              if (selectedSection.section_id === val.section_id) {
                                val.questions.splice(questionIndex + 1, 0, payload)
                              }
                              return val
                            })
                          } else {
                            sectionPayload.map((val) => {
                              if (selectedSection.section_id === val.section_id) {
                                val.questions.push(payload)
                              }
                              return val
                            })
                          }
                          let questionSelect: any = sectionPayload
                            .find((val) => selectedSection.section_id === val.section_id)
                            ?.questions.find((value) => value.question_id === -1)
                          setQuestionPreview(null)
                          setSelectedQuestion(null)
                          setSubOpen(null)
                          setSubQuestion(null)

                          setTimeout(() => {
                            setSections(sectionPayload)
                            setSectionAdd(false)
                            setQuestionEdit(true)
                            setSelectedQuestion(questionSelect)
                            handleClose()
                          }, 100)
                        }}
                      >
                        <QuestionTypeIcon typeId={Number(value.id)} />
                        {'  '}&nbsp;
                        <Typography variant="caption">{value.name}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </Tooltip>
            </Stack>
          </Stack>

          <Box
            sx={{
              display: hideSection ? 'none' : '',
              overflow: 'auto',
              height: fullViewMode ? 'calc(100vh - 197px)' : 'calc(100vh - 350px)',
            }}
          >
            <SectionsQuestionsListComponent
              setquestionError={setquestionError}
              sections={sections}
              selectedQuestion={selectedQuestion}
              selectedSection={selectedSection}
              setSectionAdd={setSectionAdd}
              setSections={setSections}
              setSelectedQuestion={setSelectedQuestion}
              setQuestionEdit={setQuestionEdit}
              setSelectedSection={setSelectedSection}
              setSectionDelete={setSectionDelete}
              setQuestionPreview={setQuestionPreview}
              preview={preview}
              scrollToElement={scrollToElement}
              setQuestionSoftDelete={setQuestionSoftDelete}
              setQuestionDelete={setQuestionDelete}
              getProjectTemplate={getProjectTemplate}
              setThreadOpen={setThreadOpen}
              setSectionSoftDelete={setSectionSoftDelete}
              questionCompare={questionCompare}
              setQuestionCompare={setQuestionCompare}
              setSubQuestion={setSubQuestion}
              subQuestion={subQuestion}
              setSubOpen={setSubOpen}
              subOpen={subOpen}
              setQuestionSubDelete={setQuestionSubDelete}
              setSubAdd={setSubAdd}
              subAdd={subAdd}
              sectionCompare={sectionCompare}
              setSectionCompare={setSectionCompare}
              // setSelectedFileQuestionTitle={setSelectedFileQuestionTitle}
            />
          </Box>
        </DetailsBox>
      </Grid>
      <Grid
        item
        xs={
          previewFull && !fullViewMode
            ? showThreads
              ? hideConf
                ? 11.75
                : 8
              : 12
            : previewFull && fullViewMode
              ? showThreads
                ? hideConf
                  ? 11.7
                  : 8.2
                : 12
              : hideSection
                ? fullViewMode
                  ? 5
                  : 5.25
                : fullViewMode
                  ? 5.1
                  : 5.25
        }
        sx={{
          display: originalDoc ? 'none' : previewFull && fullViewMode ? 'flex' : previewFull && !fullViewMode ? '' : !preview ? 'none' : '',
          alignItems: 'center',
          justifyContent: 'center',
          overflowX: 'hidden',
        }}
      >
        <ProjectBuilderPreviewComponent
          html={html}
          showSkeleton={showSkeleton}
          setshowSkeleton={setshowSkeleton}
          fullViewMode={fullViewMode}
          projectStatusIdChange={projectStatusIdChange}
          get_project_byid={getSurveys}
          setChangeModal={setChangeModal}
          project={project}
          preview={preview}
          sections={sections}
        />
      </Grid>
      <Grid
        item
        sx={{ display: originalDoc || previewFull ? 'none' : '' }}
        xs={
          hideSection && hideConf
            ? !fullViewMode
              ? preview
                ? 6.4
                : 11.5
              : preview
                ? 6.6
                : 11.5
            : hideSection && !hideConf
              ? !fullViewMode
                ? preview
                  ? 6.4
                  : 7
                : preview
                  ? 6.6
                  : 7.2
              : !hideSection && hideConf
                ? !fullViewMode
                  ? preview
                    ? 4.5
                    : 9.55
                  : fullViewMode
                    ? preview
                      ? 4.4
                      : 9.25
                    : 4.6
                : fullViewMode
                  ? preview
                    ? 4.4
                    : 5.5
                  : preview
                    ? 4.55
                    : 5.5
        }
      >
        <div className="sb-question-box">
          <Box
            sx={{
              display: 'none',
              borderRadius: '1rem !important',
              width: '98% !important',
              height: fullViewMode ? 'calc(100vh - 125px)' : 'calc(100vh - 280px)',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '0rem 1rem 1rem 1rem',
              background: 'white',
              boxShadow: '0rem 0rem 0.125rem rgba(145, 158, 171, 0.15), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.2)',
            }}
          >
            <MultiPreviewerComponent
              sections={sections}
              project={project}
              exportBbProjectDoc={exportBbProjectDoc}
              setExportBbProjectDoc={setExportBbProjectDoc}
            />
          </Box>
          {selectedThread && threadOpen && preview ? (
            <DetailsBox
              sx={{
                borderRadius: '1rem !important',
                width: '98% !important',
                height: hideConf ? 'auto !important' : 'auto !important',
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '1rem 1rem 1rem 1rem',
              }}
            >
              <Box>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Stack direction="row" alignItems="center">
                    <IconButton
                      onClick={() => {
                        setSelectedThread(null)
                        setThreadOpen(false)
                      }}
                    >
                      <ArrowBackIcon width={24} height={24} />
                    </IconButton>

                    {showInput ? (
                      <Box style={{ display: 'flex', gap: '0.5rem' }}>
                        <TextField
                          label="Title"
                          sx={{ maxHeight: '42px' }}
                          variant="standard"
                          onChange={(e) => setNewTitle(e.target.value)}
                          value={newTitle}
                        />
                        <Stack direction="row" gap="0.25rem">
                          <IconButton onClick={() => setShowInput(false)}>
                            <CancelIcon width={24} height={24} />
                          </IconButton>
                          <IconButton onClick={changeTitleSubmitHandler}>
                            <DoneIcon width={24} height={24} />
                          </IconButton>
                        </Stack>
                      </Box>
                    ) : (
                      <Tooltip title={(selectedThread as any)?.thread_title || 'Thread List'}>
                        <StyledTitle variant="h2">{(selectedThread as any)?.thread_title || 'Thread List'}</StyledTitle>
                      </Tooltip>
                    )}
                  </Stack>
                  {!showInput && selectedThread && <EditIcon onClick={() => setShowInput((prev) => !prev)} width={24} height={24} />}

                  <Box sx={{ marginRight: '0.5rem' }}>
                    <IconButton onClick={toggleResolve}>
                      <CheckCircleIcon
                        width={24}
                        height={24}
                        sx={{
                          display: !selectedThread ? 'none' : '',
                          color: (selectedThread as any)?.thread_status_id === 1 ? 'rgba(156, 156, 156, 1)' : 'rgba(11, 185, 122, 1)',
                        }}
                      />
                    </IconButton>
                  </Box>
                </Stack>
              </Box>
              <Box
                sx={{
                  overflow: 'auto',
                  height: fullViewMode ? 'calc(100vh - 193px)' : 'calc(100vh - 345px)',
                  position: 'relative',
                }}
              >
                <ProjectThreadChatComponent
                  thread={selectedThread}
                  setSelectedThread={setSelectedThread}
                  postThread={postThread}
                  updateThreadStatus={updateThreadStatus}
                  updateThreadTitle={updateThreadTitle}
                  getProjectThread={getProjectThread}
                  getAllProjectThreads={getAllProjectThreads}
                />
              </Box>
            </DetailsBox>
          ) : selectedQuestion ? (
            <Box
              sx={{
                borderRadius: '1rem !important',
                width: '98% !important',
                height: fullViewMode ? 'calc(100vh - 125px)' : 'calc(100vh - 280px)',
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '0rem 1rem 1rem 1rem',
                background: mobileView ? '#f8f8f8' : '#fff',
                boxShadow: '0rem 0rem 0.125rem rgba(145, 158, 171, 0.15), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.2)',
              }}
            >
              <Box
                sx={{
                  position: 'sticky',
                  top: 0,
                  paddingTop: '1rem',
                  backgroundColor: 'white',
                  zIndex: 5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  background: mobileView ? '#f8f8f8' : '',
                }}
              >
                <Typography variant="h6">Question Preview</Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
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
                  <Badge badgeContent={threadsCount} color="primary" sx={{ marginRight: '1rem' }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (!threadsCount) {
                          CreateThread()
                        } else if (!swap) {
                          setSwap(true)
                        } else {
                          threadCardClickHandler(
                            Number(
                              projectThreads.find((val: any) => val?.questions && val.questions.question_id === selectedQuestion?.question_id)?.id,
                            ),
                          )
                        }
                        if (preview) {
                          setThreadOpen(true)
                        }
                      }}
                    >
                      <img src={CommentIcon} height="20px" />
                    </IconButton>
                  </Badge>
                </Stack>
              </Box>
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
                    background: questionTheme?.backgroundImage
                      ? `url(${questionTheme?.backgroundImage})`
                      : questionTheme?.backgroundColor
                        ? questionTheme?.backgroundColor
                        : '#f5f5f5',
                    border: mobileView ? '3px solid #aaa' : '',
                    borderRadius: '0.8rem',
                    width: mobileView ? '320px' : '90%',
                    // height: questionTheme?.breakpoint
                    //   ? `${questionTheme?.breakpoint}px`
                    //   : "580px",
                    height: fullViewMode ? 'calc(100vh - 280px)' : 'calc(100vh - 380px)',
                    overflow: 'auto',
                  }}
                >
                  <Stack
                    minHeight="45px"
                    sx={{
                      background: questionTheme?.header?.backgroundColor ? questionTheme?.header?.backgroundColor : theme.palette.primary.main,
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
                    <img src={questionTheme?.header?.url ? questionTheme?.header?.url : ''} height="40px" />
                    <Typography
                      color={questionTheme?.header?.color ? questionTheme?.header?.color : 'white'}
                      sx={{
                        fontFamily: `${questionTheme && questionTheme?.fontFamily} !important`,
                        fontSize: '1.4rem',
                        textAlign: questionTheme?.header?.textAlign ? questionTheme?.header?.textAlign : 'left',
                        width: '100%',
                      }}
                    >
                      {questionTheme?.header?.text}
                    </Typography>
                  </Stack>
                  <Box
                    className={mobileView ? 'parent-component' : ''}
                    sx={{
                      background: '#fff !important',
                      marginTop: '1rem',

                      width: '95%',
                      padding: '1rem',
                      backgroundColor: questionTheme?.backgroundColor ? questionTheme?.backgroundColor : '#fff',
                      border: questionTheme?.questions?.borderColor ? `2px solid ${questionTheme?.questions?.borderColor}` : '1px solid white',
                    }}
                  >
                    {(() => {
                      // @ts-ignore
                      const QuestionComponent =
                        // @ts-ignore
                        QUESTION_TYPE_COMPONENTS[subQuestion ? subQuestion?.question_type_id : selectedQuestion?.question_type_id]
                      return QuestionComponent ? (
                        <QuestionComponent
                          question={subQuestion ? subQuestion : selectedQuestion}
                          SaveQuestion={SaveQuestion}
                          surveyQuestionId={subQuestion ? null : 1}
                          questionPreview={questionPreview}
                          questionTheme={questionTheme}
                        />
                      ) : null
                    })()}
                  </Box>
                  <Stack
                    direction="row"
                    justifyContent={mobileView ? 'space-between' : 'flex-end'}
                    gap={'10px'}
                    width="95%"
                    marginTop="auto"
                    paddingTop="1rem"
                    paddingBottom={mobileView ? '1rem' : '0rem'}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        background: questionTheme?.button?.backgroundColor,
                        color: questionTheme?.button.color,
                        border: `2px solid ${isPrevDisabled() ? theme.palette.grey[200] : questionTheme?.button.borderColor}`,
                        height: '36.5px',
                      }}
                      disabled={isPrevDisabled()}
                      onClick={handlePrevClick}
                    >
                      prev
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        background: questionTheme?.button?.backgroundColor,
                        color: questionTheme?.button.color,
                        border: `2px solid ${isNextDisabled() ? theme.palette.grey[200] : questionTheme?.button.borderColor}`,
                        height: '36.5px',
                      }}
                      disabled={isNextDisabled()}
                      onClick={handleNextClick}
                    >
                      Next
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Box>
          ) : (
            <DetailsBox
              style={{
                height: fullViewMode ? 'calc(100vh - 125px)' : 'calc(100vh - 278px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '700',
                width: '98%',
                color: '#454F5B',
                textAlign: 'center',
              }}
              sx={{ borderRadius: '1rem !important' }}
            >
              <div>
                Please select a node to view its
                <br /> question here
              </div>
            </DetailsBox>
          )}
        </div>
      </Grid>

      <Grid
        sx={{
          display: originalDoc ? 'none' : showThreads ? '' : previewFull || preview ? 'none' : '',
        }}
        item
        xs={
          showThreads
            ? hideConf
              ? 0.25
              : !fullViewMode
                ? 4
                : 3.75
            : hideConf
              ? 0.25
              : hideSection
                ? !fullViewMode
                  ? 4.75
                  : 4.5
                : !fullViewMode
                  ? 4.3
                  : 3.95
        }
        style={{
          transition: 'all 0.1s ease-out',
          position: 'relative',
        }}
      >
        <DetailsBox
          sx={{
            background: hideConf ? 'none !important' : '',
            boxShadow: hideConf ? 'none' : '',
            width: fullViewMode ? '100%' : '100%',
            borderRadius: !hideConf ? '1rem' : '0rem',
            height: hideConf ? 'auto !important' : 'auto !important',
            boxSizing: 'border-box',
            padding: !hideConf ? '1rem' : '0rem',
            overflowX: 'hidden',
            border: showThreads || swap || selectedThread ? '2px solid rgba(185, 36, 255, 0.18)' : 'none !important',
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Stack width="70%" spacing={2} direction="row">
              <IconButton
                onClick={() => {
                  setHideConf(!hideConf)
                }}
                sx={{
                  borderRadius: '5px',
                  background: hideConf ? `${theme.palette.primary.light} !important` : '',
                  position: hideConf ? 'absolute' : '',
                  right: fullViewMode ? 0.5 : 0,
                }}
              >
                <img
                  src={backIcon}
                  height={matches ? 10 : 15}
                  alt="navidation-burger"
                  style={{
                    transform: hideConf ? '' : 'rotate(180deg)',
                    filter: hideConf ? 'invert(100%) sepia(0%) saturate(135%) hue-rotate(332deg) brightness(419%) contrast(228%)' : '',
                  }}
                />
              </IconButton>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ display: hideConf ? 'none' : '' }}>
                {showThreads || (swap && selectedThread) ? (
                  // <Stack
                  //   sx={{
                  //     borderBottom: "2px solid #fff",
                  //     paddingBottom: "0.5rem",
                  //     marginBottom: "1rem",
                  //   }}
                  //   direction="row"
                  //   alignItems="center"
                  //   justifyContent="space-between"
                  // >
                  <>
                    <Stack direction="row" alignItems="center">
                      <IconButton onClick={() => { setSelectedThread(null); getAllProjectThreads(); }}>
                        <ArrowBackIcon width={24} height={24} />
                      </IconButton>

                      {showInput ? (
                        <Box style={{ display: 'flex', gap: '0.5rem' }}>
                          <TextField
                            label="Title"
                            sx={{ maxHeight: '42px' }}
                            variant="standard"
                            onChange={(e) => setNewTitle(e.target.value)}
                            value={newTitle}
                          />
                          <Stack direction="row" gap="0.25rem">
                            <IconButton onClick={() => setShowInput(false)}>
                              <CancelIcon width={24} height={24} />
                            </IconButton>
                            <IconButton onClick={changeTitleSubmitHandler}>
                              <DoneIcon width={24} height={24} />
                            </IconButton>
                          </Stack>
                        </Box>
                      ) : (
                        <Tooltip title={(selectedThread as any)?.thread_title || 'Thread List'}>
                          <StyledTitle variant="h2">{(selectedThread as any)?.thread_title || 'Thread List'}</StyledTitle>
                        </Tooltip>
                      )}
                    </Stack>
                    {!showInput && selectedThread && <EditIcon onClick={() => setShowInput((prev) => !prev)} width={24} height={24} />}

                    <Box sx={{ marginRight: '0.5rem' }}>
                      <IconButton onClick={toggleResolve}>
                        <CheckCircleIcon
                          width={24}
                          height={24}
                          sx={{
                            display: !selectedThread ? 'none' : '',
                            color: (selectedThread as any)?.thread_status_id === 1 ? 'rgba(156, 156, 156, 1)' : 'rgba(11, 185, 122, 1)',
                          }}
                        />
                      </IconButton>
                    </Box>
                  </>
                ) : (
                  <Typography
                    variant="h6"
                    className="sb-section-name"
                    sx={{
                      writingMode: hideConf ? 'vertical-rl' : '',
                      display: hideConf ? 'none' : '',
                    }}
                  >
                    {showThreads || swap
                      ? !selectedThread
                        ? 'Threads List'
                        : selectedThread?.thread_title
                      : // : "Thread"
                      questionEdit
                        ? selectedQuestion?.question_id !== -1
                          ? 'Question Configuration'
                          : 'Question Configuration'
                        : sectionAdd
                          ? 'Node Configuration'
                          : selectedSection
                            ? 'Node Configuration'
                            : 'Configuration'}
                  </Typography>
                )}
                {(showThreads || swap) && !selectedThread ? (
                  <AddBtn
                    onClick={() => {
                      setThreadsAll(true)
                      setProjectThread(true)
                      postNewThread()
                    }}
                  />
                ) : (
                  // <IconButton
                  //   size="small"
                  //   onClick={() => {
                  //     postNewThread();
                  //   }}
                  // >
                  //   <AddIcon fontSize="small" />
                  // </IconButton>
                  ''
                )}
              </Stack>
            </Stack>
            {(showThreads || swap) && !selectedThread ? (
              <FormControlLabel
                sx={{ display: hideConf ? 'none' : '' }}
                control={
                  <Checkbox
                    checked={threadsAll}
                    size="small"
                    onChange={() => {
                      setThreadsAll(!threadsAll)
                    }}
                  />
                }
                label={
                  <Typography variant="caption" color="primary">
                    All Threads
                  </Typography>
                }
              />
            ) : (
              ''
            )}
          </Stack>

          <Box
            sx={{
              display: hideConf ? 'none' : '',
              overflow: 'auto',
              height: fullViewMode ? (swap ? 'calc(100vh - 198px)' : 'calc(100vh - 190px)') : swap ? 'calc(100vh - 350px)' : 'calc(100vh - 345px)',
              position: 'relative',
            }}
          >
            {swap || showThreads ? (
              selectedThread === null ? (
                <Box>
                  <ProjectThreadsList
                    projectThreads={projectThreads}
                    threadCardClickHandler={threadCardClickHandler}
                    selectedThread={null}
                    selectedQuestion={selectedQuestion}
                    threadsAll={threadsAll}
                  />
                </Box>
              ) : (
                <ProjectThreadChatComponent
                  thread={selectedThread}
                  setSelectedThread={setSelectedThread}
                  postThread={postThread}
                  updateThreadStatus={updateThreadStatus}
                  updateThreadTitle={updateThreadTitle}
                  getProjectThread={getProjectThread}
                  getAllProjectThreads={getAllProjectThreads}
                />
              )
            ) : sectionAdd || (!questionEdit && selectedSection) ? (
              <ProjectBuilderSectionComponent
                section={selectedSection}
                add={sectionAdd}
                getSection={getProjectTemplate}
                setAdd={setSectionAdd}
                setCreateSectionId={setCreateSectionId}
                sections={sections}
                setSectionCompare={setSectionCompare}
              />
            ) : (
              <>
                {(() => {
                  // @ts-ignore
                  const QuestionComponent =
                    // @ts-ignore
                    QUESTION_TYPE_COMPONENTS[subQuestion ? subQuestion?.question_type_id : selectedQuestion?.question_type_id]
                  return QuestionComponent ? (
                    <QuestionComponent
                      question={subQuestion ? subQuestion : selectedQuestion}
                      SaveQuestion={SaveQuestion}
                      surveyQuestionId={subQuestion ? null : 1}
                      editFalse={questionEdit}
                      setEditFalse={setQuestionEdit}
                      setQuestionPreview={setQuestionPreview}
                      sortingList={sortingList}
                      setQuestionCompare={setQuestionCompare}
                      changesQuestionId={changesQuestionId}
                      setChangedQuestionId={setChangedQuestionId}
                      setSelectedQuestion={setSelectedQuestion}
                      questionTypeList={questionTypeList}
                      swapList={swapList}
                    // uploadMediaModalSelect={uploadMediaModalSelect}
                    // setUploadMediaModalSelect={setUploadMediaModalSelect}
                    // selectedFileQuestionTitle={selectedFileQuestionTitle}
                    // setSelectedFileQuestionTitle={setSelectedFileQuestionTitle}
                    // loading={loading}
                    // uploadAnswerIndex={uploadAnswerIndex} setUploadAnswerIndex={setUploadAnswerIndex}

                    // selectedFileQuestionAnswer={selectedFileQuestionAnswer}
                    // setSelectedFileQuestionAnswer={setSelectedFileQuestionAnswer}
                    />
                  ) : null
                })()}
              </>
            )}
          </Box>
        </DetailsBox>
      </Grid>
    </Grid>
  )
}

export default ProjectThreadHOC(ProjectSurveyBuilderComponent)
