import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { ProjectDataService } from "@/services/project-data.services";
import LoadingSpinner from "@/components/loader";
import VisualizationsUpdateComponent from "@/components/visualizations-update";


const ProjectVisualizationsUpdateContainer = () => {
    const { projectId, surveyId, visualizationId } = useParams();
    const navigate = useNavigate()

    const projectDataService = new ProjectDataService();
    const [loading, setLoading] = useState(false);

    const [visualizationData, setVisualizationData] = useState<any>([]);


    async function PutDataVisualizations(visualization_id: number, payload: any) {
        console.log("Posting payload:", payload);
        setLoading(true);
        if (projectId && surveyId)
            try {
                await projectDataService.PutDataVisualization(
                    Number(projectId),
                    Number(surveyId),
                    Number(visualization_id),
                    payload
                );
                // if (data) {
                navigate(`/projects/${projectId}/survey/${surveyId}/data/data-visualization`)
                enqueueSnackbar(
                    <Typography variant="body1">
                        Visualization Updated Successfully.
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
                        Update requests failed
                    </Typography>,
                    {
                        variant: "error",
                    }
                );
            } finally {
                setLoading(false);
            }
    }




    async function PostQuestion(payload: any) {
        console.log("updating payload:", payload);
        setLoading(true);
        if (projectId && surveyId)
            try {
                await projectDataService.PostDataVisualizationQuestion(
                    Number(projectId),
                    Number(surveyId),
                    Number(visualizationId),
                    payload
                );
                enqueueSnackbar(
                    <Typography variant="body1">
                        Visualization question added.
                    </Typography>,
                    {
                        variant: "success",
                    }
                );
            } catch (error) {
                console.error("Error posting data:", error);
                enqueueSnackbar(
                    <Typography variant="body1">
                        Question adding failed
                    </Typography>,
                    {
                        variant: "error",
                    }
                );
            } finally {
                setLoading(false);
            }
    }



    async function DeleteQuestion(payload: any) {
        console.log("delete payload:", payload);
        setLoading(true);
        if (projectId && surveyId)
            try {
                await projectDataService.DeleteDataVisualizationQuestionIds(
                    Number(projectId),
                    Number(surveyId),
                    Number(visualizationId),
                    payload
                );
                enqueueSnackbar(
                    <Typography variant="body1">
                        Visualization question deleted.
                    </Typography>,
                    {
                        variant: "success",
                    }
                );
            } catch (error) {
                console.error("Error posting data:", error);
                enqueueSnackbar(
                    <Typography variant="body1">
                        Question deleting failed
                    </Typography>,
                    {
                        variant: "error",
                    }
                );
            } finally {
                setLoading(false);
            }
    }



    async function getVisualizationsById() {
        setLoading(true);

        try {
            const data = await projectDataService.GetVisualizationById(
                Number(projectId),
                Number(surveyId),
                Number(visualizationId)
            );
            setVisualizationData(data);
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

    useEffect(() => {
        getVisualizationsById()
    }, [])

    return (
        <>
            {loading ? <LoadingSpinner /> : null}
            <VisualizationsUpdateComponent
                PutDataVisualizations={PutDataVisualizations}
                visualizationData={visualizationData}
                PostQuestion={PostQuestion}
                DeleteQuestion={DeleteQuestion}
            />


        </>
    );
};

export default ProjectVisualizationsUpdateContainer;
