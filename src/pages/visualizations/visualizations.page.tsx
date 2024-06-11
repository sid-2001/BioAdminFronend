import ProjectVisualizationsContainer from "@/containers/visualizations";
import { useLocation, useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";

function VisualizationsPage() {
  const location = useLocation();
  const { projectId, surveyId } = useParams()
  // const { selectedSurvey }: any = useOutletContext()

  return (
    <>
      {location.pathname == `/projects/${projectId}/survey/${surveyId}/data/data-visualization` ? (
        <ProjectVisualizationsContainer />
      ) : (
        <Outlet />
      )}
    </>
  )

}

export default VisualizationsPage;
