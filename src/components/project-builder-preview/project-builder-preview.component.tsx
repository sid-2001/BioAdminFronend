import { Box, Stack, Typography } from '@mui/material'
import { DetailsBox } from '../project-details/project-details.style'
import { ProjectBuilderPreviewComponentProps } from './project-builder-preview.type'
import { useEffect, useState } from 'react'
import {
  // ShareIcon,
  ViewIcon,
} from '@/assets/images'
import Skeleton from '@mui/material/Skeleton'
import { ProjectService } from '@/services/projects.service'
// import { useState } from "react";
// import LoadingSpinner from "../loader";
// import { QuestionnaireService } from "@/services/questionnaire.sevice";
// import { useParams } from "react-router-dom";
// import { enqueueSnackbar } from "notistack";
import { DocumentViewer } from 'react-documents'
import { ProjecFileType } from '@/enums/object.enum'
import { useOutletContext, useParams } from 'react-router-dom'

// import DownloadIcon from "@mui/icons-material/Download";

const ProjectBuilderPreviewComponent = (props: ProjectBuilderPreviewComponentProps) => {
  const {
    fullViewMode,
    html,
    // projectStatusIdChange,
    // get_project_byid,
    // setChangeModal,

    showSkeleton,
    project,
    preview,
    sections,
    originalDoc,
  } = props

  const { surveyId } = useParams()

  const { selectedSurvey }: any = useOutletContext()

  const [link, setLink] = useState('')
  useEffect(() => {
    // This function will run when the component mounts
    let service = new ProjectService()
    if (project?.project_id && surveyId)
      service.get_project_files(project?.project_id, Number(surveyId), [ProjecFileType.DOCS]).then((data) => {
        if (data?.length > 0) {
          if (project) {
            // project.sp_document_url = data[0].file_url;
            setLink(data[0].file_url)
          } else {
            setLink('')
          }
        }
      })
  }, [project, surveyId])

  useEffect(() => {
    setLink('')
  }, [selectedSurvey])
  // console.log(link,selectedSurvey, surveyId, "qwertyusurveyIdsurveyIdsurveyIdsurveyId")

  return (
    <DetailsBox
      style={{
        height: 'unset',
        width: originalDoc ? '100%' : !preview && fullViewMode ? '98%' : '99%',
        marginLeft: '0.4rem',
        boxSizing: 'border-box',
        padding: '0rem 1rem 1rem 1.5rem',
        borderRadius: '1rem !important',
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        paddingTop="1rem"
        paddingBottom="0.2rem"
        // sx={{ position: "sticky", top: "0", background: "white" }}
      >
        <Stack spacing={2} direction="row" alignItems="center">
          <img src={ViewIcon} />
          <Typography variant="h6">Original Survey Document</Typography>
        </Stack>
        <Stack spacing={2} direction="row" alignItems="center">
          {/* <StyledLabel
            style={{
              display:
                project?.status_id === 4 && sections.length <= 0 ? "" : "none",
            }}
            // onClick={async () => {
            //   setLoading(true);
            //   await projectStatusIdChange(2);
            //   await get_project_byid();
            //   setLoading(false);
            // }}
            htmlFor="upload_json"
          >
            <input
              onChange={fileHandler}
              id="upload_json"
              accept=".json"
              style={{ display: "none" }}
              type="file"
            />
            <img src={ShareIcon} />
            <Typography sx={{ fontSize: "0.8rem" }}>
              Upload Survey Questionaire
            </Typography>
          </StyledLabel> */}
          {/* <StackButton
            spacing={1}
            direction="row"
            alignItems="center"
            sx={{ display: project?.status_id === 2 ? "" : "none" }}
            onClick={async () => {
              setLoading(true);
              await projectStatusIdChange(3);
              await get_project_byid();
              setLoading(false);
            }}
          >
            <img src={ShareIcon} />
            <Typography sx={{ fontSize: "0.8rem" }}>
              Send for Estimation Approval
            </Typography>
          </StackButton> */}

          {/* <StackButton
            spacing={1}
            direction="row"
            alignItems="center"
            sx={{
              display:
                project?.status_id === 4 && sections.length > 0 ? "" : "none",
            }}
            onClick={async () => {
              setLoading(true);
              await projectStatusIdChange(5);
              await get_project_byid();
              setLoading(false);
            }}
          >
            <img src={ShareIcon} />
            <Typography sx={{ fontSize: "0.8rem" }}>
              Send for Approval
            </Typography>
          </StackButton> */}

          {/* <StackButton
            spacing={1}
            direction="row"
            alignItems="center"
            sx={{ display: project?.status_id === 6 ? "" : "none" }}
            onClick={async () => {
              setLoading(true);
              await projectStatusIdChange(7);
              await get_project_byid();
              setLoading(false);
            }}
          >
            <img src={ShareIcon} />
            <Typography sx={{ fontSize: "0.8rem" }}>
              Send For Final Approval
            </Typography>
          </StackButton> */}
          {/* <StackButton
            spacing={1}
            direction="row"
            alignItems="center"
            display={sections.length > 0 && !originalDoc ? "none" : ""}
            onClick={async () => {
              let myUrl = project?.sp_document_url
                ? project?.sp_document_url
                : "";
              const link = document.createElement("a");
              link.href = myUrl;
              link.target = "_blank";
              link.setAttribute("download", project?.sp_document_url);
              document.body.appendChild(link);
              link.click();
            }}
          >
            <DownloadIcon color="inherit" />
            <Typography sx={{ fontSize: "0.8rem" }}>Download</Typography>
          </StackButton> */}
        </Stack>
      </Stack>
      <Box
        sx={{
          height: fullViewMode
            ? project?.status_id === 4 && sections.length <= 0
              ? sections.length > 0 && !originalDoc
                ? 'calc(100vh - 200px)'
                : 'calc(100vh - 205px)'
              : sections.length > 0 && !originalDoc
                ? 'calc(100vh - 200px)'
                : 'calc(100vh - 205px)'
            : project?.status_id === 4 && sections.length <= 0
              ? sections.length > 0 && !originalDoc
                ? 'calc(100vh - 352px)'
                : 'calc(100vh - 350px)'
              : sections.length > 0 && !originalDoc
                ? 'calc(100vh - 352px)'
                : 'calc(100vh - 350px)',
          overflow: 'auto',
        }}
      >
        {sections.length > 0 && !originalDoc ? (
          showSkeleton == true ? (
            <>
              {[...Array(20)].map((_, index) => (
                <Skeleton key={index} animation="wave" />
              ))}
            </>
          ) : (
            <>
              {' '}
              <div style={{ padding: '20px', margin: '0px' }} id="docviewer-div" dangerouslySetInnerHTML={{ __html: html }} />
            </>
          )
        ) : (
          <DocumentViewer queryParams="hl=Nl" url={link} viewer="office" overrideLocalhost="https://react-doc-viewer.firebaseapp.com/" />
        )}
      </Box>
    </DetailsBox>
  )
}

export default ProjectBuilderPreviewComponent
