import { Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { ProjectDataService } from "@/services/project-data.services";
import LoadingSpinner from "@/components/loader";
import VisualizationsCreateComponent from "@/components/visualizations-create";


const ProjectVisualizationsCreateContainer = () => {
    const { projectId, surveyId } = useParams();
    const navigate = useNavigate()

    const projectDataService = new ProjectDataService();
    // const listService = new ListService();
    // const [viewMode, setViewMode] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [pipelineData, setPipelineData] = useState<any>([]);


    async function PostDataVisualizations(payload: any) {
        console.log("Posting payload:", payload);
        setLoading(true);
        if (projectId && surveyId)
            try {
                await projectDataService.PostDataVisualization(
                    Number(projectId),
                    Number(surveyId),
                    payload
                );
                // if (data) {
                navigate(`/projects/${projectId}/survey/${surveyId}/data/data-visualization`)
                enqueueSnackbar(
                    <Typography variant="body1">
                        Visualization Create Successfully.
                    </Typography>,
                    {
                        variant: "success",
                    }
                );
                // }
            } catch (error) {
                console.error("Error posting data:", error);
                enqueueSnackbar(
                    <Typography variant="body1">
                        Adding visualization requests failed
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
            <VisualizationsCreateComponent
                PostDataVisualizations={PostDataVisualizations}
            />


        </>
    );
};

export default ProjectVisualizationsCreateContainer;
