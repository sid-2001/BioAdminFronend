import { Box, Button } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { PageWrapper } from "@/styles/page-wrapper";

const ProjectDataNavigationContainer = () => {
  const { project, get_project_byid, loading, selectedSurvey } = useOutletContext<any>();
  const navigate = useNavigate();

  return (
    <>
      <PageWrapper
        style={{
          // background: "white",
          borderRadius: "12px",
          height: "calc(100vh - 228px)",
        }}
      >
        <Box
          style={{
            width: "100%",
            position: "sticky",
            top: "0px",
            // background: "white",
            zIndex: 500,
            padding: "0rem 1rem 0rem 1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button onClick={() => navigate("summary")}>Summary</Button>
          {/* <Button onClick={() => navigate("jobs")}>Jobs</Button> */}
          <Button onClick={() => navigate("data-tabulation")}>
            Data Tabulation
          </Button>
          <Button onClick={() => navigate("banner-planner")}>
            Banner Planner
          </Button>
          <Button onClick={() => navigate("pipelines")}>
            Pipelines
          </Button>
          <Button onClick={() => navigate("schema-manager")}>
            Schema Manager
          </Button>

          <Button onClick={() => navigate("data-visualization")}>
            Data Visualization
          </Button>
        </Box>
        <Outlet context={{ project, get_project_byid, loading, selectedSurvey }} />
      </PageWrapper>
    </>
  );
};

export default ProjectDataNavigationContainer;
