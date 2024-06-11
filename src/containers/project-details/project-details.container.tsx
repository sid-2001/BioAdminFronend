import ProjectDetailsComponent from "@/components/project-details";
import { useEffect } from "react";
import { useOutletContext } from "react-router";

const ProjectDetailsContainer = () => {
  const { project, get_project_byid, loading, getSurveys } = useOutletContext<any>();
  useEffect(() => {
    get_project_byid();
    getSurveys()
  }, []);
  return (
    <>
      <ProjectDetailsComponent
        project={project}
        get_project_byid={get_project_byid}
        isLoading={loading}
      />
    </>
  );
};
export default ProjectDetailsContainer;
