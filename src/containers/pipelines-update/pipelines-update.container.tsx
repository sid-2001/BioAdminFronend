import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { ProjectDataService } from "@/services/project-data.services";
import LoadingSpinner from "@/components/loader";
import PipelinesUpdateComponent from "@/components/pipelines-update";
import { logger } from "@/helpers/logger";


const ProjectPipelinesUpdateContainer = () => {
    const { projectId, surveyId, pipelineId } = useParams();

    const location = useLocation()


    const projectDataService = new ProjectDataService();
    // const listService = new ListService();
    // const [viewMode, setViewMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pipelineData, setPipelineData] = useState<any>([]);

    const [pipelineStatus, setPipelineStatus] = useState<boolean>(location?.state);

    const ChangeStatus = async (status: boolean) => {
        setLoading(true)
        if (projectId && surveyId && pipelineId) {
            try {
                const data = await projectDataService.PipelinesActive(Number(projectId), Number(surveyId), Number(pipelineId), status)
                if (status) {
                    // getAllPipelinesData()
                } else {
                    // setShowDialog(false)
                    // getAllPipelinesData()
                }
                return data
            } catch (error) {
                logger.error(error)
            } finally {
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }

    async function getAllPipelinesById(pipeline_id: number) {
        setLoading(true);

        try {
            const data = await projectDataService.GetAllPipelineById(
                Number(projectId),
                Number(surveyId),
                Number(pipeline_id)
            );
            setPipelineData(data);
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

    async function PutDataTabulation(pipeline_id: number, payload: any) {
        console.log("Posting payload:", payload);
        setLoading(true);
        try {
            const data = await projectDataService.putDatapipelines(
                Number(projectId),
                Number(surveyId),
                Number(pipeline_id),
                payload
            );
            if (data) {
                enqueueSnackbar(
                    <Typography variant="body1">
                        Tabulation Planner Create Successfully.
                    </Typography>,
                    {
                        variant: "success",
                    }
                );
            }
        } catch (error) {
            console.error("Error posting data:", error);
            enqueueSnackbar(
                <Typography variant="body1">
                    Adding tabulation requests failed
                </Typography>,
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
            getAllPipelinesById(Number(pipelineId))
    }, [projectId, surveyId, pipelineId])



    return (
        <>
            {loading ? <LoadingSpinner /> : null}
            <PipelinesUpdateComponent
                // PostDataTabulation={PostDataTabulation}
                PutDataTabulation={PutDataTabulation}
                pipelineData={pipelineData}
                setPipelineData={setPipelineData}
                // setViewMode={setViewMode}

                ChangeStatus={ChangeStatus}
                pipelineStatus={pipelineStatus} setPipelineStatus={setPipelineStatus}
            />


        </>
    );
};

export default ProjectPipelinesUpdateContainer;
