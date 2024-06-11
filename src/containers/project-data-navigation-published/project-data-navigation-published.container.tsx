import {
  // Box, Button,

  Grid,
  Typography,
} from '@mui/material'
import { useLocation, useParams } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { PageWrapper } from '@/styles/page-wrapper'
import {
  AnalysisIcon,
  BackArrow,
  FlowData,
  GraphIcon,
  Insights,
  // SprayIcon,
  TabulationIcon,
} from '@/assets/images'
import { SideBarImagesProps } from '@/components/project-sidebar/project-sidebar.type'
import ProjectSidebarComponent from '@/components/project-sidebar'
import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { ProjectDataService } from '@/services/project-data.services'
// import { ConfigService } from "@/services/config-cleaning"

const ProjectDataNavigationPublishedContainer = () => {
  const location = useLocation()
  // /projects/${projectId}/data/pipelines/${runs?.pipeline_id}/runs/${runs?.id}/published
  let { projectId, surveyId, pipelineId: pipelineid, runId } = useParams()
  let params = useParams()
  console.log(location, 'paramsparamsparams', params, pipelineid, runId)
  // const [data, setData] = useState(null)
  const [sideBarImages, _setSideBarImages] = useState<SideBarImagesProps[]>([
    {
      image: BackArrow,
      navigate: `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineid}/runs`,
      state: `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineid}/runs`,
    },
    // {
    //   image: SprayIcon,
    //   navigate: `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineid}/runs/${runId}/data-cleaning`,
    //   state: `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineid}/runs/${runId}/data-cleaning`,
    // },
    {
      image: FlowData,
      navigate: `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineid}/runs/${runId}/data-validation`,
      state: `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineid}/runs/${runId}/data-validation`,
    },
    {
      image: TabulationIcon,
      navigate: `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineid}/runs/${runId}/data-tabulation`,
      state: `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineid}/runs/${runId}/data-tabulation`,
    },
    {
      image: GraphIcon,
      navigate: `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineid}/runs/${runId}/data-statistics`,
      state: `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineid}/runs/${runId}/data-statistics`,
    },
    {
      image: Insights,
      navigate: `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineid}/runs/${runId}/data-insights`,
      state: `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineid}/runs/${runId}/data-insights`,
    },

    {
      image: AnalysisIcon,
      navigate: `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineid}/runs/${runId}/ota-analysis`,
      state: `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineid}/runs/${runId}/ota-analysis`,
    },
  ])

  const projectDataService = new ProjectDataService()
  const [allRunsByRunId, setAllRunsByRunId] = useState<any>([])

  async function GetpipelineDetails(pipeline_id: number, run_id: string) {
    setLoading(true)

    try {
      const data = await projectDataService.GetRunPipelineDetails(Number(projectId), Number(surveyId), Number(pipeline_id), String(run_id))
      setAllRunsByRunId(data)
    } catch (error) {
      enqueueSnackbar(<Typography variant="body1">Fetching requests failed</Typography>, {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (pipelineid && runId) GetpipelineDetails(Number(pipelineid), String(runId))
  }, [pipelineid, runId])

  const [loading, setLoading] = useState(true)
  // @ts-ignore
  // const [dataToTabulation, setDataToTabulation] = useState<any[]>([])
  // const [pipelineId, setPipelineId] = useState()
  // const [dataExportConfig, setDataExportConfig] = useState([])
  // const [outputFiles, setOutputFiles] = useState([])

  // console.log(outputFiles, "outputFilesoutputFilesoutputFiles")
  // console.log(dataExportConfig.config_payload?.filter((item: { job_type_id: number }) => item?.job_type_id == 5)[0]?.config_payload, ".config_payload?.filter((item: { job_type_id: number }) => item?.job_type_id == 5)[0]?.config_payload")
  // api
  const { enqueueSnackbar } = useSnackbar()
  // let service: { getConfigTabulationBanner: (arg0: string) => any; getConfigTabulationBannerBYpipeline_idbyjob_type_id: (arg0: string, arg1: never, arg2: number) => any; GetAllOutputFiles: (arg0: number) => any }
  // const service = new ConfigService()

  // async function getConfigData() {
  //   setLoading(true)
  //   if (projectId)
  //     try {
  //       const data = await service.getConfigTabulationBanner(projectId)

  //       // console.log(data, "configDataconfigData")
  //       setPipelineId(data[data?.length - 1]?.id);
  //       setDataExportConfig(data[data?.length - 1])
  //       setLoading(false)
  //     } catch (error) {
  //       enqueueSnackbar("Failed in fetching data", {
  //         variant: "error",
  //       })
  //       setLoading(false)
  //     }
  // }

  // async function getConfigDatabypipeline_idByjob_type_id() {
  //   setLoading(true)
  //   if (projectId && pipelineId)
  //     try {
  //       const data = await service.getConfigTabulationBannerBYpipeline_idbyjob_type_id(projectId, pipelineId, 4)

  //       // console.log(data, "configDataconfigData")

  //       setLoading(false)
  //       setDataToTabulation((data as any)?.config_payload)
  //     } catch (error) {
  //       enqueueSnackbar("Failed in fetching data", {
  //         variant: "error",
  //       })
  //       setLoading(false)
  //     }
  // }

  // async function getOutputFiles() {
  //   setLoading(true)
  //   if (projectId)
  //     try {
  //       const data = await service.GetAllOutputFiles(Number(projectId))

  //       // console.log(data, "configDataconfigData")

  //       setLoading(false)
  //       setOutputFiles(data)
  //     } catch (error) {
  //       enqueueSnackbar("Failed in fetching data", {
  //         variant: "error",
  //       })
  //       setLoading(false)
  //     }
  // }

  // useEffect(() => {
  //   if (location?.state) {
  //     setData(location?.state)
  //   }
  // }, [location])

  console.log(allRunsByRunId, 'dadalocation?.statelocation?.statelocation?.state')

  // console.log(data, "dadalocation?.statelocation?.statelocation?.state");

  // useEffect(() => {
  //   getConfigData()
  //   getOutputFiles()
  // }, [])

  // useEffect(() => {
  //   getConfigDatabypipeline_idByjob_type_id()
  // }, [pipelineId])

  return (
    <>
      <PageWrapper
        style={{
          borderRadius: '12px',
          height: 'calc(100vh - 228px)',
        }}
      >
        {/* <Box
          style={{
            width: "100%",
            position: "sticky",
            top: "0px",
            zIndex: 500,
            // padding: "0rem 1rem 0rem 1rem",
            display: "flex",
            alignItems: "center",
            marginBottom: "0.3rem",
            gap: "0.5rem",
          }}
        >
          <Button
            variant={
              !location.pathname.includes("summary") ? "outlined" : "contained"
            }
            sx={{
              background: !location.pathname.includes("summary")
                ? "white"
                : "#160340",
              borderRadius: "5rem !important",
            }}
            onClick={() => navigate("summary")}
            size='small'
          >
            Summary
          </Button>
          <Button
            variant={
              !location.pathname.includes("jobs") ? "outlined" : "contained"
            }
            size='small'
            sx={{
              background: !location.pathname.includes("jobs")
                ? "white"
                : "#160340",
              borderRadius: "5rem !important",
            }}
            onClick={() => navigate("jobs")}
          >
            Jobs
          </Button>
          <Button
            size='small'
            sx={{
              background: !location.pathname.includes("data-tabulation")
                ? "white"
                : "#160340",
              borderRadius: "5rem !important",
            }}
            variant={
              !location.pathname.includes("data-tabulation")
                ? "outlined"
                : "contained"
            }
            onClick={() => navigate("data-tabulation")}
          >
            Data Tabulation
          </Button>
        </Box> */}
        <Grid container spacing={2}>
          <Grid item xs={0.4}>
            <ProjectSidebarComponent sideBarImages={sideBarImages} />
          </Grid>
          <Grid item xs={11.6}>
            <Outlet context={{ loading, allRunsByRunId }} />
          </Grid>
        </Grid>
      </PageWrapper>
    </>
  )
}

export default ProjectDataNavigationPublishedContainer
