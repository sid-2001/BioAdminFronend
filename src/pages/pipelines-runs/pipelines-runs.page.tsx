import ProjectPipelinesRunsContainer from "@/containers/pipelines-runs";
import { useLocation, useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";
function PipelinesRunsPage() {
  // projects/109/data/pipelines/63/runs
  const location = useLocation();
  const { projectId, surveyId, pipelineId } = useParams()
  return (
    <>
      {location.pathname === `/projects/${projectId}/survey/${surveyId}/data/pipelines/${pipelineId}/runs` ? (
        <ProjectPipelinesRunsContainer />
      ) : (
        <Outlet />
      )}
    </>
  )

}

export default PipelinesRunsPage;
