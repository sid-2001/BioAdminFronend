import AttachmentModalComponent from '@/components/attachments-modal/attachment-modal.component'
// import { DetailsBox } from "@/components/project-details/project-details.style";
import ProjectSurveyBuilderComponent from '@/components/project-survey-builder/project-survey-builder.component'
// import { ProjectThreadType } from "@/types/project.type";
import {
  Box,

  // Button
} from '@mui/material'
import {
  //  SetStateAction,

  useEffect,
  useState,
} from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import '../../App.css'
import { ProjectService } from '@/services/projects.service'
import { logger } from '@/helpers/logger'
import { useSnackbar } from 'notistack'
import LoadingSpinner from '@/components/loader'

const SurveyBuilderContainer = () => {
  const {
    project,
    get_project_byid,

    getSurveys,
    surveys,
    selectedSurvey,
  } = useOutletContext<any>()
  const [modaOpen, setModalOpen] = useState(false)
  const [fullViewMode, setFullViewMode] = useState(false)
  const [changeModal, setChangeModal] = useState<number | null>(null)

  const [surveyType, setSurveyType] = useState<null | number | string>('')

  let projectServices = new ProjectService()
  let { surveyId } = useParams()
  let { enqueueSnackbar } = useSnackbar()
  //

  const handleClose = () => {
    setModalOpen(false)
    setChangeModal(null)
  }

  useEffect(() => {
    let surveyType = surveys?.find((item: { id: any }) => item?.id == selectedSurvey)?.type_id
    if (surveyType) {
      setSurveyType(surveyType)
    } else {
      setSurveyType(null)
    }
  }, [surveys, selectedSurvey])

  useEffect(() => {
    if (surveyType === null || changeModal !== null) {
      setModalOpen(true)
    }
  }, [project, changeModal, surveyType])

  const projectStatusIdChange = async (status: number) => {
    let payload = {
      status_id: status,
    }
    if (surveyId)
      try {
        await projectServices.project_status_change(Number(surveyId), payload)
        enqueueSnackbar(' Submit for processing...', {
          variant: 'success',
        })
        // get_project_byid();
        getSurveys()
      } catch (e) {
        logger.error(e)
        if ((e as any)?.response?.status === 403) {
          enqueueSnackbar('Access denied: Insufficient permissions.', {
            variant: 'error',
          })
        } else {
          enqueueSnackbar('An error occurred. Please try again.', {
            variant: 'error',
          })
        }
      }
  }

  console.log(surveyType, 'surveyType')

  return (
    <>
      {surveyType === '' ? (
        <LoadingSpinner />
      ) : (
        <Box
          className={fullViewMode ? 'bodyBackground' : ''}
          sx={{
            height: fullViewMode ? '100vh' : 'auto',
            width: fullViewMode ? '100vw' : 'auto',
            position: fullViewMode ? 'fixed' : '',
            top: 0,
            lef: 0,
            right: 0,
            // overflow: "auto",
            // display: surveyType === null ? "none" : "",
            zIndex: fullViewMode ? 200 : '',
            padding: fullViewMode ? '2rem 0rem' : '',
          }}
        >
          {modaOpen && surveyType === null && (
            <AttachmentModalComponent
              open={modaOpen}
              handleClose={handleClose}
              get_project_byid={get_project_byid}
              project={project}
              changeModal={changeModal}
              setChangeModal={setChangeModal}
            />
          )}
          {surveyType !== null ? (
            // changeModal === null && modaOpen ? (
            //   ""
            // ) :
            //@ts-ignore
            <ProjectSurveyBuilderComponent
              setFullViewMode={setFullViewMode}
              fullViewMode={fullViewMode}
              project={project}
              projectStatusIdChange={projectStatusIdChange}
              get_project_byid={get_project_byid}
              setChangeModal={setChangeModal}
            />
          ) : (
            ''
          )}
          {/* {project?.status_id === 1 && surveyType === 2 ? (
   <DetailsBox
     style={{
       height: "calc(100vh - 245px)",
       display: "flex",
       alignItems: "center",
       justifyContent: "center",
       fontSize: "15px",
       fontWeight: "700",
       color: "#454F5B",
       textAlign: "center",
     }}
     sx={{ borderRadius: "2rem !important" }}
   >
     <div>
       You have uploaded the questionaire
       <br />{" "}
       <Button
         variant="outlined"
         color="primary"
         sx={{ marginTop: "1rem" }}
         onClick={() => {
           projectStatusIdChange(2);
         }}
       >
         Submit for processing...
       </Button>
     </div>
   </DetailsBox>
 ) : project?.status_id === 2 && surveyType === 2 ? (
   <DetailsBox
     style={{
       height: "calc(100vh - 245px)",
       display: "flex",
       alignItems: "center",
       justifyContent: "center",
       fontSize: "15px",
       fontWeight: "700",
       color: "#454F5B",
       textAlign: "center",
     }}
     sx={{ borderRadius: "2rem !important" }}
   >
     <div>Your document is under process.</div>
   </DetailsBox>
 ) : (
   ""
 )} */}
        </Box>
      )}
    </>
  )
}
export default SurveyBuilderContainer
