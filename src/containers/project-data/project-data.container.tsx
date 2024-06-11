// import AddCard from "@/components/add-card";
import Card from "@/components/card";
import AddCard from "@/components/add-card";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Button,
  Link,
} from "@mui/material";
import {
  FormControlLabel,
  Grid,
  Divider,
  Tooltip,
  Checkbox,
} from "@mui/material";
import TextField from "@/components/text-field";

import { styled } from "@mui/material/styles";
import { GridContainerProject } from "@/styles/grid";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
// import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
// import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import DynamicForm from "@/components/dynamic-job-form";
import { ProjectDataService } from "@/services/project-data.services";
import PreviewIcon from "@mui/icons-material/Preview";
// import { logger } from "@/helpers/logger";
// import { nanoid } from 'nanoid';
import { logger } from "@/helpers/logger";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { theme } from "@/constants/theme";
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import MultipleSelectCheckmarks from "@/components/multiple-select";
import LoadingSpinner from "@/components/loader";
// import SummaryCard from "@/components/summary-card/summary-card.component";

interface SubSectionEnabledState {
  [key: string]: boolean;
}

interface FormStateType {
  [key: string]: any;
}

// interface FileStateType {
//   [key: string]: File;
// }

// const yourParsedConfig = {
//   "job": {
//     "name": "test-job",
//     "id": "1234",
//     "project_id": "1233",
//     "output_path": "D:\\Output"
//   },
//   "config": [
//     {
//       "type": "DATA_CLEANING",
//       "type_name": "Data Cleaning",
//       "order": 1,
//       "config": [
//         {
//           "type": "DATA_CLEANING_STRAIGHT_LINER",
//           "type_name": "Straight liner check",
//           "order": 1,
//           "enabled": true,
//           "fields": [
//             {
//               "name": "statement_count",
//               "display_name": " Minimum Statement Count",
//               "datatype": "INTEGER",
//               "default_value": 4,
//               "value": 4,
//               "order": 1

//             },
//             {
//               "name": "option_count",
//               "display_name": " Minimum Options Count",
//               "datatype": "INTEGER",
//               "default_value": 5,
//               "value": 5,
//               "order": 2
//             },
//             {
//               "name": "threashold",
//               "display_name": "Threashold",
//               "datatype": "DECIMAL",
//               "default_value": 0.5,
//               "value": 0.5,
//               "order": 3
//             }
//           ]
//         },
//         {
//           "type": "DATA_CLEANING_SPEEDER",
//           "type_name": "Speeder check",
//           "order": 2,
//           "enabled": true,
//           "fields": [
//             {
//               "name": "loi",
//               "display_name": "LOI %",
//               "datatype": "DECIMAL",
//               "default_value": 0.33,
//               "value": 0.33,
//               "order": 1
//             }
//           ]
//         }
//       ],
//       "file_url": "D:\\Output\\1233\\\\data_cleaning_output.xlsx"
//     },
//     {
//       "type": "DATA_VALIDATION",
//       "type_name": "Data Validation",
//       "order": 2,
//       "config": [
//         {
//           "type": "DATA_VALIDATION_CONDITION_CHECK",
//           "type_name": "Validate programming conditions",
//           "order": 1,
//           "enabled": true,
//           "fields": [
//             {
//               "name": "condition_check",
//               "display_name": "Check programming conditions",
//               "datatype": "BOOLEAN",
//               "default_value": true,
//               "value": true,
//               "order": 1
//             },
//             {
//               "name": "datavalidation_check",
//               "display_name": "Run data validation",
//               "datatype": "BOOLEAN",
//               "default_value": true,
//               "value": true,
//               "order": 200,
//               "file_url": "D:\\Output\\1233\\\\data_validation_output.xlsx"
//             }
//           ]
//         }
//       ],
//       "file_url": "D:\\Output\\1233\\\\data_validation_output.xlsx"
//     },
//     {
//       "type": "DATA_OUTPUT_FILE",
//       "type_name": "Output Files ",
//       "order": 1,
//       "enabled": true,
//       "fields": [
//         {
//           "name": "fixed_width_file_output",
//           "display_name": "Fixedwidth file",
//           "datatype": "BOOLEAN",
//           "default_value": true,
//           "value": true,
//           "order": 1,
//           "file_url": "D:\\Output\\1233\\\\fixed_width_file_output.xlsx"
//         },
//         {
//           "name": "spss_file_output",
//           "display_name": "SPSS file",
//           "datatype": "BOOLEAN",
//           "default_value": true,
//           "value": true,
//           "order": 2,
//           "file_url": "D:\\Output\\1233\\\\spss_data_file.zip"
//         },
//         {
//           "name": "sav_file_output",
//           "display_name": "SAV file",
//           "datatype": "BOOLEAN",
//           "default_value": true,
//           "value": true,
//           "order": 3,
//           "file_url": ""
//         },
//         {
//           "name": "script_file_output",
//           "display_name": "Script files",
//           "datatype": "BOOLEAN",
//           "default_value": true,
//           "value": true,
//           "order": 4,
//           "file_url": ""
//         }
//       ]
//     }
//   ]
// }
const yourParsedConfig = {
  job: {
    name: "test-job",
    id: "1234",
    project_id: "1233",
    output_path: "sdfsdfsdf",
  },
  files: [
    {
      key: "SCHEMA_FILE",
      url: "http:.....",
      file_type: "xlsx",
    },
    {
      key: "RESPONSE_FILE",
      url: "http:.....",
      file_type: "xlsx",
    },
    {
      key: "DEFNITION_FILE",
      url: "http:.....",
      file_type: "xml",
    },
  ],
  config: [ 
    {
      type: "DATA_CLEANING",
      type_name: "Data Cleaning",
      order: 1,
      config: [
        {
          type: "DATA_CLEANING_STRAIGHT_LINER",
          type_name: "Straight liner check",
          order: 1,
          enabled: true,
          fields: [
            {
              name: "statement_count",
              display_name: " Minimum Statement Count",
              datatype: "INTEGER",
              default_value: 4,
              value: 4,
              order: 1,
            },
            {
              name: "option_count",
              display_name: " Minimum Options Count",
              datatype: "INTEGER",
              default_value: 5,
              value: 5,
              order: 2,
            },
            {
              name: "threashold",
              display_name: "Threashold",
              datatype: "DECIMAL",
              default_value: 0.5,
              value: 0.5,
              order: 3,
            },
          ],
        },
        {
          type: "DATA_CLEANING_SPEEDER",
          type_name: "Speeder check",
          order: 2,
          enabled: true,
          fields: [
            {
              name: "loi",
              display_name: "LOI %",
              datatype: "DECIMAL",
              default_value: 0.33,
              value: 0.33,
              order: 1,
            },
          ],
        },
      ],
    },
    {
      type: "DATA_VALIDATION",
      type_name: "Data Validation",
      order: 2,
      config: [
        {
          type: "DATA_VALIDATION_CONDITION_CHECK",
          type_name: "Validate programming conditions",
          order: 1,
          enabled: true,
          fields: [
            {
              name: "condition_check",
              display_name: "Check programming conditions",
              datatype: "BOOLEAN",
              default_value: true,
              value: true,
              order: 1,
            },
            {
              name: "datavalidation_check",
              display_name: "Run data validation",
              datatype: "BOOLEAN",
              default_value: true,
              value: true,
              order: 2,
            },
          ],
        },
      ],
    },
    {
      type: "DATA_PROCESSING_OUTPUTS",
      type_name: "Required outputs",
      order: 3,
      config: [
        {
          type: "DATA_OUTPUT_FILE",
          type_name: "Output Files ",
          order: 1,
          enabled: true,
          fields: [
            {
              name: "fixed_width_file_output",
              display_name: "Fixed width file",
              datatype: "BOOLEAN",
              default_value: true,
              value: true,
              order: 1,
            },
            {
              name: "spss_file_output",
              display_name: "SPSS file",
              datatype: "BOOLEAN",
              default_value: true,
              value: true,
              order: 2,
            },
            {
              name: "sav_file_output",
              display_name: "SAV file",
              datatype: "BOOLEAN",
              default_value: true,
              value: true,
              order: 3,
            },
            {
              name: "script_file_output",
              display_name: "Script files",
              datatype: "BOOLEAN",
              default_value: true,
              value: true,
              order: 4,
            },
          ],
        },
      ],
    },
  ],
};

const BackGroundColor = (bgId: any) => {
  if (bgId == 1) {
    return "#b2bdf38b";
  } else if (bgId == 2) {
    return "#F2EAA5";
  } else if (bgId == 3) {
    return "#FFD8AA";
  } else if (bgId == 4) {
    return "#D9D9D9";
  } else if (bgId == 5) {
    return "#7AFCCD";
  } else if (bgId == 6) {
    return "#76DDB7";
  } else if (bgId == 7) {
    return "#FFE4FF";
  }
};

function mapRequestState(id: number) {
  if (id === 1) return "OPEN";
  else if (id === 3) return "APPROVED";
  else return "REJECTED";
}

// const MAX_COUNT = 10;

function ProjectDataContainer() {
  const [requests, setRequests] = useState([]);
  const service = new ProjectDataService();
  const [loading, setLoading] = useState(false);

  const { projectId } = useParams();
  const [showDialog, setShowDialog] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  // const [attachments, setAttachments] = useState<Array<any>>([]);
  const [configData, setConfigData] = useState(yourParsedConfig);
  const [desc, setDesc] = useState("");
  const [nanoId, _setNanoId] = useState("");
  const [selectedJobAllData, setSelectedJobAllData] = useState(null);

  // show logs
  const [showLogs, setShowLogs] = useState(false);

  const [logFileUrl, setLogFileUrl] = useState<any>(null);

  function openlogs() {
    setShowLogs(true);
  }

  function closelogs() {
    setShowLogs(false);
  }

  const [logData, setLogData] = useState<any>(null);

  // on local
  const [subSectionEnabled, setSubSectionEnabled] =
    useState<SubSectionEnabledState>({});
  const [formState, setFormState] = useState<FormStateType>({});
  // const [fileState, setFileState] = useState<FileStateType>({});
  // console.log(logData, "logDatalogDatalogData")

  useEffect(() => {
    const initialState: FormStateType = {};
    const initialSubSectionEnabled: SubSectionEnabledState = {};
    configData?.config?.forEach((section: any) => {
      section?.config?.forEach((subSection: any) => {
        initialSubSectionEnabled[`${section.type}_${subSection.type}`] =
          subSection.enabled;
        subSection?.fields?.forEach(
          (field: { name: any; value: any; default_value: any }) => {
            initialState[`${section.type}_${subSection.type}_${field.name}`] =
              field.value || field.default_value;
          }
        );
      });
    });
    setFormState(initialState);
    setSubSectionEnabled(initialSubSectionEnabled);
    console.log("Initial subSectionEnabled:", initialSubSectionEnabled);
  }, [configData]);

  // const handleUploadFiles = (files: any) => {
  //   const uploaded = [...attachments];
  //   let limitExceeded = false;

  //   files.some((file: any) => {
  //     if (uploaded.findIndex((f) => f.name === file.name) === -1) {
  //       uploaded.push(file);

  //       if (uploaded.length > MAX_COUNT) {
  //         alert(`You can only add a maximum of ${MAX_COUNT} files`);
  //         limitExceeded = true;
  //         return true;
  //       }
  //     }
  //   });
  //   if (!limitExceeded) setAttachments(uploaded);
  // };

  async function getProjectData() {
    setLoading(true);

    try {
      const data = await service.GetAllDataJob(Number(projectId));
      setRequests(data);
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

  // async function postProjectRequests(
  //   reqObj: PostProjectRequestByIdRequestType
  // ) {
  //   try {
  //     await service.postProjectRequestById(Number(projectId), reqObj);

  //     enqueueSnackbar(
  //       <Typography variant="body1">Posted requests.</Typography>,
  //       {
  //         variant: "success",
  //       }
  //     );
  //   } catch (error) {
  //     enqueueSnackbar(
  //       <Typography variant="body1">Posting requests failed</Typography>,
  //       {
  //         variant: "error",
  //       }
  //     );
  //   }
  // }

  // function openDialog() {
  //   setShowDialog(true);
  // }

  function closeDialog() {
    setShowDialog(false);
  }

  // View on local

  const CustomFormControlLabel = styled(FormControlLabel)({
    "& .MuiFormControlLabel-label": {
      fontSize: "1rem",
      fontWeight: "bold",
    },
  });

  const handleSubSectionEnabledChange = (
    sectionType: any,
    subSectionType: any,
    enabled: boolean
  ) => {
    setSubSectionEnabled((prevState) => {
      const updatedState = {
        ...prevState,
        [`${sectionType}_${subSectionType}`]: enabled,
      };
      console.log("Updated subSectionEnabled:", updatedState);
      return updatedState;
    });
  };

  const renderField = (
    sectionType: string,
    subSectionType: string,
    field: { name: string; datatype: string; display_name: any }
  ) => {
    const fieldKey = `${sectionType}_${subSectionType}_${field.name}`;
    console.log(sectionType, subSectionType, "sectionTypesectionType", field);

    switch (field.datatype) {
      case "INTEGER":
      case "DECIMAL":
        return (
          <Grid
            item
            xs={3}
            style={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: "1.5rem ",
            }}
          >
            {viewMode ? (
              <>
                <label style={{ marginLeft: "5px" }}>
                  {field.display_name}
                </label>
                <h4 style={{ padding: "0.5rem" }}>{formState[fieldKey]} </h4>
              </>
            ) : (
              <>
                <label style={{ marginLeft: "5px" }}>
                  {field.display_name}
                </label>
                <TextField
                  // label={field.display_name}
                  value={formState[fieldKey]}
                  // onChange={e => handleInputChange(sectionType, subSectionType, field.name, e.target.value)}
                  style={{ paddingTop: "6px", maxWidth: "100%" }}
                  type="number"
                />
              </>
            )}
          </Grid>
        );
      case "BOOLEAN":
        return (
          <Grid item xs={3.5} style={{ paddingLeft: "1.5rem " }}>
            <Box style={{ display: "flex" }}>
              <FormControlLabel
                style={{ pointerEvents: viewMode ? "none" : "auto" }}
                control={
                  <Checkbox
                    sx={{ opacity: viewMode ? 0.5 : 1 }}
                    checked={formState[fieldKey] ? true : false}
                    // onChange={e => handleInputChange(sectionType, subSectionType, field.name, e.target.checked)}
                  />
                }
                label={field.display_name}
              />
              {(field as any) && sectionType == "DATA_PROCESSING_OUTPUTS" && (
                <Tooltip title={(field as any)?.status_reason} arrow>
                  <IconButton
                    color={
                      (field as any)?.status == "Successful"
                        ? "success"
                        : "error"
                    }
                  >
                    <ErrorOutlineIcon />
                  </IconButton>
                </Tooltip>
              )}
              {(field as any)?.file_url &&
              sectionType == "DATA_PROCESSING_OUTPUTS" ? (
                <Link
                  href={`${(field as any)?.file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton color="primary">
                    <DownloadForOfflineIcon />
                  </IconButton>
                </Link>
              ) : null}
            </Box>
          </Grid>
        );
      default:
        return null;
    }
  };

  const renderFileInput = (fileInput: {
    key: React.Key | null | undefined;
  }) => {
    console.log(fileInput, "fileInputfileInputfileInputfileInput");
    let fileName: any = fileInput?.key?.toString();
    // let fileName: any = fileState[fileInput.key]?.name || fileInput?.key?.toString();

    return (
      <Box key={fileInput.key} style={{ padding: "0.5rem" }}>
        <Typography variant="body1" component="span">
          <h4>{fileName}</h4>
        </Typography>
        <Box style={{ display: "flex", alignItems: "center" }}>
          <IconButton color={(fileInput as any)?.url ? "success" : "error"}>
            <ErrorOutlineIcon />
          </IconButton>
          {(fileInput as any)?.url && (
            <Link
              href={`${(fileInput as any)?.url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton color={(fileInput as any)?.url ? "primary" : "error"}>
                <CloudDownloadIcon />
              </IconButton>
            </Link>
          )}
        </Box>
      </Box>
    );
  };

  // const handleFileChange = async (fileKey: React.Key | null | undefined, file: string | Blob) => {
  //   const objectTypeId = 2
  //   const objectId = projectId || ''
  //   const formData = new FormData();
  //   formData.append('files', file);

  //   formData.append('object_type_id', objectTypeId.toString());
  //   formData.append('object_id', objectId.toString());
  //   formData.append('object_nanoid', nanoId?.toString())

  //   console.log(formData, "formData", file);

  //   try {
  //     const response = await service.postProjectAttachments(
  //       formData,
  //       (_progressEvent: any) => { }
  //     );
  //     console.log("File upload response:", response);
  //     const logFilePath = response?.description?.log_file_path;

  //     setFileState(prevState => ({
  //       ...prevState,
  //       // @ts-ignore
  //       [fileKey]: logFilePath
  //     }));

  //     console.log(logFilePath, "logFilePathlogFilePath")
  //     setFormState(prevState => ({
  //       ...prevState,
  //       [`${fileKey}_path`]: logFilePath
  //     }));
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // };

  useEffect(() => {
    getProjectData();
  }, []);

  useEffect(() => {
    // Function to fetch log data
    const fetchLogData = async () => {
      if (logFileUrl) {
        try {
          const response = await fetch(logFileUrl);
          console.log(response, "responseresponse");
          const data = await response.text();
          setLogData(data);
        } catch (error) {
          logger.error(error);
        }
      } else {
        setLogData("No logs generated");
      }
    };

    if (showLogs) {
      fetchLogData();
    }
  }, [showLogs, logFileUrl]);

  console.log(requests, "requestsrequests123456789", configData, logFileUrl);

  return (
    <>
      {loading ? <LoadingSpinner /> : null}

      <Dialog
        scroll="paper"
        onClose={closeDialog}
        open={showDialog}
        // maxWidth="xxl"
        PaperProps={{
          style: {
            width: "80%",
            height: "80%",
            maxWidth: "none",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginRight: "10px",
            marginTop: "10px",
          }}
        >
          <DialogTitle id="alert-dialog-title" color="black">
            {viewMode ? configData?.job?.name : "Create New Job"}
          </DialogTitle>
          <Box style={{ display: "flex" }}>
            <Button
              variant="text"
              style={{ display: viewMode ? "flex" : "none", gap: "0.5rem" }}
              onClick={openlogs}
            >
              Show Logs
              <PreviewIcon color={logFileUrl ? "primary" : "error"} />
            </Button>
            <IconButton
              onClick={closeDialog}
              sx={{ width: "40px", height: "40px" }}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
        <Box style={{ padding: "1rem 2rem 2rem 2rem" }}>
          <DynamicForm
            closeDialog={closeDialog}
            getProjectData={getProjectData}
            summary={desc}
            viewMode={viewMode}
            initialConfig={configData}
            nanoId={nanoId}
          />
        </Box>
      </Dialog>

      {/* logs dialog */}
      <Dialog
        scroll="paper"
        onClose={closelogs}
        open={showLogs}
        // maxWidth="xxl"
        PaperProps={{
          style: {
            width: "70%",
            height: "70%",
            maxWidth: "none",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginRight: "10px",
            marginTop: "10px",
          }}
        >
          <DialogTitle id="alert-dialog-title" color="black"> 
            {configData?.job?.name ? configData?.job?.name : "Logs"}
          </DialogTitle>
          <Box style={{ display: "flex" }}>
            {(configData as any)?.job?.log_url && (
              <Link
                href={`${(configData as any)?.job?.log_url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton color="primary">
                  <DownloadForOfflineIcon />
                </IconButton>
              </Link>
            )}
            <IconButton
              onClick={closelogs}
              sx={{ width: "40px", height: "40px" }}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
        <Box
          style={{
            padding: "1rem 2rem 2rem 2rem",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <Typography
            style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
          >
            {logData}
          </Typography>
        </Box>
      </Dialog>

      <Box
        sx={{ flex: "1", overflow: "scroll" }}
        style={{
          background: "white",
          borderRadius: "12px",
          height: "calc(100vh - 273px)",
        }}
      >
        {!viewMode ? (
          <>
            <Box
              style={{
                width: "100%",
                position: "sticky",
                top: "0px",
                background: "white",
                // zIndex: 500,
                padding: "1rem 2rem 0rem 2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{}}>
                Jobs
              </Typography>
              {/* <Button onClick={openDialog} variant="contained">
            New Job
          </Button> */}
            </Box>
            <Box sx={{ padding: "0rem 2rem 0rem 2rem" }}>
              <GridContainerProject style={{ marginBottom: "2rem" }}>
                <AddCard
                  handleClick={() => setShowDialog(true)}
                  height={"170px"}
                  width={"300px"}
                />
                {requests.map((request: any, i) => {
                  // console.log(request, "requestrequest")
                  return (
                    <Card
                      onClick={() => {
                        setConfigData(
                          request?.output?.job
                            ? request?.output
                            : request?.configuration
                        );
                        setViewMode(true);
                        setDesc(request?.summary);
                        setSelectedJobAllData(request);
                        // openDialog()
                        setLogFileUrl(
                          request?.output?.job?.log_url
                            ? request?.output?.job?.log_url
                            : null
                        );
                      }}
                      key={`${i}`}
                    >
                      <Box
                        sx={{
                          height: "24px",
                          marginBottom: "12px",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            padding: "4px 16px",
                            borderRadius: "4px",
                            background: BackGroundColor(request.status_id),
                            opacity: 0.8,
                          }}
                        >
                          <Box
                            sx={{
                              fontWeight: 400,
                              fontSize: "11px",
                              lineHeight: "140%",
                              textTransform: "capitalize",
                              color: "#9A8C00",
                            }}
                          >
                            {mapRequestState(request.status_id)}
                          </Box>
                        </Box>

                        <MoreHorizOutlinedIcon sx={{ color: "black" }} />
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            color: "#0D062D",
                            fontSize: "16px",
                            fontWeight: "700",
                            lineHeight: "normal",
                            width: "208px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginBottom: "9px",
                          }}
                          variant="h1"
                        >
                          {request?.configuration?.job?.name}
                        </Typography>
                        <Typography
                          sx={{
                            width: "210px",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            color: "#787486",
                            fontSize: "12px",
                            fontWeight: "400",
                            lineHeight: "normal",
                            marginBottom: "12px",
                          }}
                          variant="body1"
                          dangerouslySetInnerHTML={{
                            __html: request.summary,
                          }}
                        ></Typography>
                      </Box>

                      <Stack sx={{ marginTop: "auto" }} direction="row-reverse">
                        <Stack
                          direction="row"
                          gap="2px"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "32px !important",
                            color: "darkgray",
                            fontSize: "1rem",
                          }}
                        >
                          {/* <PriorityHighIcon /> */}
                          <Typography
                            component="span"
                            sx={{
                              color: "#787486",
                              fontSize: "12px",
                              fontWeight: "500",
                              paddingLeft: "5px",
                            }}
                          >
                            {request.priority_id}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          gap="2px"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "32px !important",
                            color: "darkgray",
                            fontSize: "1rem",
                          }}
                        >
                          {/* <AccessTimeFilledIcon /> */}
                          <Typography
                            component="span"
                            sx={{
                              color: "#787486",
                              fontSize: "12px",
                              fontWeight: "500",
                              paddingLeft: "5px",
                            }}
                          >
                            {request.effort}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Card>
                  );
                })}
              </GridContainerProject>
            </Box>
          </>
        ) : (
          <Box
            style={{
              width: "100%",
              position: "sticky",
              top: "0px",
              background: "white",
              // zIndex: 500,
              padding: "1rem 2rem 0rem 2rem",
            }}
          >
            <Box
              sx={{
                marginBottom: "0.5rem",
                display: "flex",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <IconButton
                sx={{
                  paddingLeft: "0",
                }}
                onClick={() => setViewMode(false)}
              >
                <ArrowBackIcon width={16} height={16} />
              </IconButton>
              <Typography variant="h3">{configData?.job?.name}</Typography>
              <Box
                sx={{
                  fontWeight: 400,
                  fontSize: "11px",
                  lineHeight: "140%",
                  textTransform: "capitalize",
                  color: "#9A8C00",
                }}
              >
                {mapRequestState((selectedJobAllData as any)?.status_id)}
              </Box>
              <Box style={{ display: "flex" }}>
                <Button
                  variant="text"
                  style={{ display: viewMode ? "flex" : "none", gap: "0.5rem" }}
                  onClick={openlogs}
                >
                  Show Logs
                  <PreviewIcon />
                </Button>
              </Box>
            </Box>
            <Grid
              container
              spacing={2}
              style={{ padding: "1rem 1rem 1rem 2rem" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={5.5}>
                  <label style={{ marginLeft: "5px" }}>Job Title*</label>
                  <h3 style={{ padding: "0.5rem" }}>{configData?.job?.name}</h3>
                </Grid>
                <Grid item xs={12} style={{}}>
                  <label style={{ marginLeft: "5px" }}>Description</label>
                  <h4 style={{ padding: "0.5rem" }}>{desc}</h4>
                </Grid>
              </Grid>
              <h2 style={{ marginTop: "1rem" }}>Configurations</h2>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={9}
                  style={{
                    marginTop: "1rem",
                    paddingRight: "1rem",
                    borderRight: `1px solid ${theme.palette.grey[300]}`,
                  }}
                >
                  {configData?.config?.map(
                    (section: {
                      type: React.Key | null | undefined;
                      type_name:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined;
                      config: any[];
                    }) => (
                      <Grid item xs={12} key={section.type}>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <h3>{section?.type_name}</h3>
                          <Box>
                            {(section as any)?.type !==
                              "DATA_PROCESSING_OUTPUTS" && (
                              <Tooltip
                                title={(section as any)?.status_reason}
                                arrow
                              >
                                <IconButton
                                  color={
                                    (section as any)?.status == "Successful"
                                      ? "success"
                                      : "error"
                                  }
                                >
                                  <ErrorOutlineIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {(section as any)?.file_url && (
                              <Link
                                href={`${(section as any)?.file_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <IconButton color="primary">
                                  <DownloadForOfflineIcon />
                                </IconButton>
                              </Link>
                            )}
                          </Box>
                        </Box>
                        {section?.config?.map((subSection) => (
                          <Box key={subSection.type} sx={{}}>
                            <Box
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "0.5rem",
                              }}
                            >
                              <CustomFormControlLabel
                                style={{ pointerEvents: "none" }}
                                control={
                                  <Checkbox
                                    sx={{ opacity: 0.5 }}
                                    checked={
                                      subSectionEnabled[
                                        `${section.type}_${subSection.type}`
                                      ]
                                        ? true
                                        : false
                                    }
                                    onChange={(e) =>
                                      handleSubSectionEnabledChange(
                                        section.type,
                                        subSection.type,
                                        e.target.checked
                                      )
                                    }
                                  />
                                }
                                label={subSection?.type_name}
                              />
                            </Box>
                            {subSection?.type ==
                              "DATA_CLEANING_STRAIGHT_LINER" && (
                              <Grid
                                container
                                spacing={0}
                                style={{ maxWidth: "calc(50vw)" }}
                              >
                                <Grid
                                  item
                                  xs={6}
                                  style={{ padding: "0rem 0rem 1rem 1.5rem" }}
                                >
                                  <label style={{ marginLeft: "5px" }}>
                                    Questions
                                  </label>
                                  <MultipleSelectCheckmarks
                                    label=""
                                    width="100%"
                                    disabled
                                    items={subSection?.questions.map(
                                      (question: any) => ({
                                        value: question.id,
                                        text: question.label,
                                      })
                                    )}
                                    // handleChange={handleChange}
                                    selectedOptions={subSection?.questions.map(
                                      (question: any) => question.id
                                    )}
                                    style={{ marginTop: "8px" }}
                                  />
                                </Grid>
                              </Grid>
                            )}
                            <Grid container spacing={0}>
                              {subSection?.fields?.map(
                                (field: {
                                  name: string;
                                  datatype: string;
                                  display_name: any;
                                }) =>
                                  renderField(
                                    (section as any)?.type,
                                    subSection?.type,
                                    field
                                  )
                              )}
                            </Grid>
                          </Box>
                        ))}
                        <Divider style={{ margin: "1rem 0rem 1rem 0rem" }} />
                      </Grid>
                    )
                  )}
                </Grid>

                <Grid item xs={3}>
                  {configData?.files && (
                    <Box>
                      <h3>Files</h3>
                      {configData?.files?.map((fileInput: any) =>
                        renderFileInput(fileInput)
                      )}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </>
  );
}

export default ProjectDataContainer;
