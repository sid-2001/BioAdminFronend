import ProjectPipelinesContainer from "@/containers/pipelines";
import { useLocation, useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";

function PipelinesPage() {
  const location = useLocation();
  const { projectId, surveyId } = useParams()
  // const { selectedSurvey }: any = useOutletContext()

  return (
    <>
      {location.pathname == `/projects/${projectId}/survey/${surveyId}/data/pipelines` ? (
        <ProjectPipelinesContainer />
      ) : (
        <Outlet />
      )}
    </>
  )

}

export default PipelinesPage;
