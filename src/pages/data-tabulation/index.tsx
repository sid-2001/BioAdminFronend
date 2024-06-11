import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// import Tooltip from "@mui/material/Tooltip";
import {
  // Button,
  // Button,
  // Button,
  // Checkbox,
  // FormControlLabel,

  IconButton,
  Tooltip,
  CircularProgress,

  // Tooltip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
// import { ProjectService } from "@/services/projects.service";
import DataTabulationPercentTableComponent from "./dataTabulationPercentTableComponent";
import DataTabulationCountTableListContainer from "./dataTabulationCountTableListContainer";
import TablesListContainer from "./tablesListContainer";
import { JSONData } from "@/types/project-data.type";
import { theme } from "@/constants/theme";
import { ProjectDataService } from "@/services/project-data.services";
import { useParams } from "react-router-dom";
// import LoadingSpinner from "../../components/loader/loader.component";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, overflow: "auto", width: "calc(100vw - 120px)" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function DataTabulationPage({
  JSONData,
  projectId,
  objectId,
}: {
  JSONData: JSONData;
  projectId: number;
  objectId: string;
}) {
  const service = new ProjectDataService();

  const [loading, setLoading] = React.useState(false);

  const { surveyId } = useParams()

  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function scrollToTable(tableId: string) {
    const element = document.getElementById(tableId);
    // const element = document.getElementById(`poc-table-${tableId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const navigateToIndex = (tableId: string) => {
    setValue(0);
    scrollToTable(tableId);
  };

  const navigateToPercentage = (tableId: string) => {
    setValue(2);
    scrollToTable(tableId);
  };

  const navigateToCount = (tableId: string) => {
    setValue(1);
    scrollToTable(tableId);
  };

  const downladFile = (
    base64: string,
    project_id: number,
    object_id: string
  ) => {
    if (base64.length > 0) {
      const binaryData = atob(base64);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Tabulation_${project_id}_${object_id}.xlsx`; // Set the desired file name and extension
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Revoke the object URL to free up resources
      URL.revokeObjectURL(url);
    }
    setLoading(false);
  };

  // function changeTab(_rowId: number, colId: number) {
  //   if (colId === 0) {
  //     setValue(1)
  //   }
  // }

  function changeTab(_rowId: number, colId: number) {
    switch (colId) {
      case 0:
        setValue(1);
        break;
      case 1:
        setValue(2);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <Box
        sx={{
          background: "white",
          borderRadius: "12px",

          height: "calc(100vh - 345px)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Index" {...a11yProps(0)} />
            <Tab label="Counts" {...a11yProps(1)} />
            <Tab label="Percentage" {...a11yProps(2)} />
            <Tooltip
              title="Download Tabulation Data"
              sx={{ justifyContent: "end" }}
            >
              <IconButton
                onClick={() => {
                  setLoading(true);
                  service
                    .DownloadTabulationByProjectId(projectId, Number(surveyId), objectId)

                    .then((data) => {
                      if (data) {
                        downladFile(data, projectId, objectId);
                      } else {
                        setLoading(false);
                      }
                    })
                    .catch((err) => {
                      setLoading(false);

                      console.log(err);
                    });
                }}
                size="small"
                sx={{
                  borderRadius: "4px !important",
                }}
                disabled={loading}
              >
                <DownloadIcon sx={{ color: theme.palette.grey[500] }} />

                {loading && (
                  <CircularProgress
                    size={20}
                    sx={{
                      position: "absolute",
                      top: "30%",
                      left: "100%",
                      transform: "translate(-50%, -50%)",
                      marginLeft: 1,
                    }}
                  />
                )}
                <Typography variant="caption">
                  {" "}
                  &nbsp; Download Tabulation Data
                </Typography>
              </IconButton>
            </Tooltip>
          </Tabs>
        </Box>
        <Box sx={{ flex: "1", overflow: "auto" }}>
          <CustomTabPanel value={value} index={0}>
            <TablesListContainer
              linkClickHandler={changeTab}
              JSONData={JSONData}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <DataTabulationCountTableListContainer
              navigateToIndex={navigateToIndex}
              navigateToPercentage={navigateToPercentage}
              JSONData={JSONData}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <DataTabulationPercentTableComponent
              navigateToIndex={navigateToIndex}
              navigateToCount={navigateToCount}
              JSONData={JSONData}
            />
          </CustomTabPanel>
        </Box>
      </Box>
      
    </>
  );
}

export default DataTabulationPage;
