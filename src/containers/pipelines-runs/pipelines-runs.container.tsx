import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { ProjectDataService } from "@/services/project-data.services";
import PipelinesRunsComponent from "@/components/pipelines-runs";
import LoadingSpinner from "@/components/loader";
import { useLocation } from "react-router-dom";


const ProjectPipelinesRunsContainer = () => {
    const location = useLocation();
    const { projectId, surveyId, pipelineId } = useParams();
    const projectDataService = new ProjectDataService();
    const [loading, setLoading] = useState(false);

    const [allRuns, setAllRuns] = useState<any>([])
    const [allRunsByRunId, setAllRunsByRunId] = useState<any>([])
    const pipelineName = location.state?.name;

    const [autoRefresh, setAutoRefresh] = useState(false)



    async function pipelineRun() {
        setLoading(true);
        if (projectId && surveyId && pipelineId)
            try {
                await projectDataService.RunPipeline(
                    Number(projectId),
                    Number(surveyId),
                    Number(pipelineId)
                );
                Getpipeline(Number(pipelineId))
            } catch (error) {
                enqueueSnackbar(
                    <Typography variant="body1">Fetching requests failed</Typography>,
                    {
                        variant: "error",
                    }
                );
            } finally {
                setLoading(false);
            }
    }


    async function Getpipeline(pipeline_id: number) {
        if (!autoRefresh) {
            setLoading(true);
        }
        if (projectId && surveyId && pipeline_id) {


            try {
                const data = await projectDataService.GetRunPipeline(
                    Number(projectId),
                    Number(surveyId),
                    Number(pipeline_id)
                );
                if (data?.length > 0) {
                    setAllRuns(data)
                }
                // else {
                //     pipelineRun(Number(pipelineId))
                //     // enqueueSnackbar(<Typography variant="body1">No runs available</Typography>, {
                //     //     variant: "error",
                //     // });
                // }
            } catch (error) {
                enqueueSnackbar(
                    <Typography variant="body1">Fetching requests failed</Typography>,
                    {
                        variant: "error",
                    }
                );
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }


    async function GetpipelineDetails(pipeline_id: number, run_id: string) {
        if (!autoRefresh) {
            setLoading(true);
        } if (projectId && surveyId && pipeline_id && run_id)
            try {
                const data = await projectDataService.GetRunPipelineDetails(
                    Number(projectId),
                    Number(surveyId),
                    Number(pipeline_id),
                    String(run_id)
                );
                setAllRunsByRunId(data)
                // enqueueSnackbar(<Typography variant="body1"> Pipeline details fetched successfully</Typography>, {
                //     variant: "success",
                // });
                // console.log(data, "run_idrun_idrun_id")
                //   setRequests(data);
            } catch (error) {
                enqueueSnackbar(
                    <Typography variant="body1">Fetching requests failed</Typography>,
                    {
                        variant: "error",
                    }
                );
            } finally {
                setLoading(false);
            }
    }

    async function PublishPipelineStatus(pipeline_id: number, run_id: string) {
        setLoading(true);
        if (projectId && surveyId && pipeline_id && run_id)
            try {
                const data = await projectDataService.PublishPipelineDetails(
                    Number(projectId),
                    Number(surveyId),
                    Number(pipeline_id),
                    String(run_id)
                );
                // setAllRunsByRunId(data)
                if (data) {
                    enqueueSnackbar(<Typography variant="body1"> Pipeline published successfully</Typography>, {
                        variant: "success",
                    });
                }
            } catch (error) {
                enqueueSnackbar(
                    <Typography variant="body1">Pipeline published failed</Typography>,
                    {
                        variant: "error",
                    }
                );
            } finally {
                setLoading(false);
            }
    }


    async function PipelineCancel(pipeline_id: number, run_id: string) {
        setLoading(true);
        if (projectId && surveyId && pipeline_id && run_id)
            try {
                const data = await projectDataService.PipelineCancel(
                    Number(projectId),
                    Number(surveyId),
                    Number(pipeline_id),
                    String(run_id)
                );
                // setAllRunsByRunId(data)
                if (data) {
                    enqueueSnackbar(<Typography variant="body1"> Pipeline cancel successfully</Typography>, {
                        variant: "success",
                    });
                }
            } catch (error) {
                enqueueSnackbar(
                    <Typography variant="body1">Pipeline cancel failed</Typography>,
                    {
                        variant: "error",
                    }
                );
            } finally {
                setLoading(false);
            }
    }

    useEffect(() => {
        if (projectId && surveyId && pipelineId)
            Getpipeline(Number(pipelineId))
    }, [projectId, surveyId, pipelineId])

    return (
        <>
            {loading ? <LoadingSpinner /> : null}

            <Box
                sx={{ flex: "1", overflow: "scroll" }}
                style={{
                    background: "white",
                    borderRadius: "12px",
                    height: "calc(100vh - 273px)",
                    width: "100%",
                }}
            >

                <PipelinesRunsComponent allRuns={allRuns}
                    GetpipelineDetails={GetpipelineDetails} allRunsByRunId={allRunsByRunId}
                    pipelineRun={pipelineRun} Getpipeline={Getpipeline}
                    PublishPipelineStatus={PublishPipelineStatus}
                    PipelineCancel={PipelineCancel}
                    pipelineName={pipelineName}
                    autoRefresh={autoRefresh} setAutoRefresh={setAutoRefresh}
                />
            </Box>
        </>
    );
};

export default ProjectPipelinesRunsContainer;
