import ProjectListContainer from "@/containers/project-list/project-list.container";
import { Outlet, useLocation } from "react-router-dom";

const ProjectsPage = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/projects" ? (
        <ProjectListContainer />
      ) : (
        <Outlet />
      )}
    </>
  );
};
export default ProjectsPage;
