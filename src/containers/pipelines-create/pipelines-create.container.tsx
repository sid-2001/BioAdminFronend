import { Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PipelinesCreateUpdate from "@/components/pipelines-create-update";
import { enqueueSnackbar } from "notistack";
import { ProjectDataService } from "@/services/project-data.services";
import LoadingSpinner from "@/components/loader";


const ProjectPipelinesCreateContainer = () => {
    const { projectId, surveyId } = useParams();
    const navigate = useNavigate()

    const projectDataService = new ProjectDataService();
    // const listService = new ListService();
    // const [viewMode, setViewMode] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [pipelineData, setPipelineData] = useState<any>([]);


    async function PostDataTabulation(payload: any) {
        console.log("Posting payload:", payload);
        setLoading(true);
        if (projectId && surveyId)
            try {
                const data = await projectDataService.postDatapipelines(
                    Number(projectId),
                    Number(surveyId),
                    payload
                );
                if (data) {
                    navigate(`/projects/${projectId}/survey/${surveyId}/data/pipelines`)
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

    return (
        <>
            {loading ? <LoadingSpinner /> : null}
            <PipelinesCreateUpdate
                PostDataTabulation={PostDataTabulation}
            // PutDataTabulation={PutDataTabulation}
            // pipelineData={pipelineData}
            // setPipelineData={setPipelineData}
            // setViewMode={setViewMode}
            />


        </>
    );
};

export default ProjectPipelinesCreateContainer;
