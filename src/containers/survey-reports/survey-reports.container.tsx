import { DetailsBox } from "@/components/project-details/project-details.style";
// import * as React from "react";
// import { useNavigate, useOutletContext, useParams } from "react-router-dom";
// import { QualificationService } from "@/services/qualification.service";
// import { logger } from "@/helpers/logger";
// import { useSnackbar } from "notistack";
import { 
    // Box,
    Divider,
    // Button,
     Stack, Typography } from "@mui/material";
// import CustomDividerComponent from "@/components/custom-divider";
// import SurveyStatuListComponent from "@/components/survey-status-list";
// import { KeyboardArrowLeft } from "@mui/icons-material";
// import LoadingSpinner from "@/components/loader";
import SurveyReportsTable from "./survey-reports-table.container";

function SurveyReportsContainer() {
  // const { surveyId } = useParams();
  // const qualificationServices = new QualificationService();
  // const { enqueueSnackbar } = useSnackbar();
//   const navigate = useNavigate();
//   const { projectId } = useParams();
//   const { survey } = useOutletContext<any>();
  // import ExitToApp from "@mui/icons-material/ExitToApp";
  // const [loading, setLoading] = React.useState(false);

  return (
    <>
      {/* {loading ? <LoadingSpinner /> : ""} */}

      <DetailsBox
        padding="0rem 0rem"
        sx={{
          height: "calc(100vh - 275px) !important",
          overflowY: "auto", // Enable vertical scrollbar when content overflows
          scrollbarWidth: "none", // Hide scrollbar in Firefox
          msOverflowStyle: "none", // Hide scrollbar in IE and Edge
        }}
      >
        <Stack
          sx={{
            paddingTop: "1rem",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            background: "white",
            marginBottom: "1rem",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          }}
          spacing={1}
        >
          <Stack direction="row" alignItems="center" gap="1rem">
            <Typography variant="h6">Survey Reports</Typography>
          </Stack>
          <Divider />
          {/* <CustomDividerComponent /> */}
        </Stack>
        <SurveyReportsTable />
      </DetailsBox>
    </>
  );
}

export default SurveyReportsContainer;

