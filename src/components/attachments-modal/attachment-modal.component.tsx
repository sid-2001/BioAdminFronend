import Dialog from "@mui/material/Dialog";
import { StyledCard } from "./attachment-modal.style";
import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { theme } from "@/constants/theme";
import "../../global.css";
import { Stack } from "@mui/system";
// import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router";
import { ProjectService } from "@/services/projects.service";
import { useSnackbar } from "notistack";
import { logger } from "@/helpers/logger";
import LoadingSpinner from "../loader";
import { FileIcon, defaultStyles } from "react-file-icon";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AttachmentModalComponentProps } from "./attachment-modal.type";
import { DetailsBox } from "../project-details/project-details.style";
// import { DetailsBox } from "../project-details/project-details.style";
import { useOutletContext } from "react-router-dom"

const AttachmentModalComponent = (props: AttachmentModalComponentProps) => {
  let {
    handleClose,
    // get_project_byid,
    // project,
    open,
    changeModal,
    setChangeModal,
  } = props;
  const [importFile, setImportFile] = useState(false);
  const [scratch, setScratch] = useState(false);
  const [exsisting, setExsisting] = useState(false);
  const [error, setError] = useState("");
  const [addFiles, setAddFiles] = useState<any>(null);
  const [surveyMaterialFiles, setSurveyMaterialFiles] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  let { projectId, surveyId } = useParams();
  let projectServices = new ProjectService();
  let { enqueueSnackbar } = useSnackbar();

  const { surveys, selectedSurvey, getSurveys }: any = useOutletContext()

  const surveyType = surveys?.find((item: { id: any }) => item?.id == selectedSurvey)?.type_id


  useEffect(() => {
    if (changeModal === 2) {
      setImportFile(true);
    } else if (changeModal === 1) {
      setScratch(true);
    }
  }, [changeModal]);

  const onDrop = (acceptedFiles: any) => {
    setError("");
    // const isValidFileType = acceptedFiles.every((file: { type: string }) =>
    //   ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)
    // );

    // if (!isValidFileType) {
    //   setError("Invalid file type. Only .doc and .docx files are accepted.");
    //   return;
    // }
    if (scratch || exsisting) {
      setSurveyMaterialFiles([...surveyMaterialFiles, ...acceptedFiles]);
    } else {
      if (acceptedFiles.length > 1) {
        setError("You can attached 1 file only");
      } else {
        setAddFiles(acceptedFiles[0]);
      }
    }
  };

  const handleFileDrop = (acceptedFiles: any) => {
    setError("");
    const isValidFileType = acceptedFiles.every((file: { name: string }) =>
      /\.(doc|docx)$/i.test(file.name)
    );

    if (!isValidFileType) {
      setError("Invalid file type. Only .doc and .docx files are accepted.");
      return;
    }

    if (scratch || exsisting) {
      setSurveyMaterialFiles([...surveyMaterialFiles, ...acceptedFiles]);
    } else {
      if (acceptedFiles.length > 1) {
        setError("You can attach 1 file only");
      } else {
        setAddFiles(acceptedFiles[0]);
      }
    }
  };

  const {
    getRootProps: getRootPropsRestricted,
    getInputProps: getInputPropsRestricted,
  } = useDropzone({ onDrop: handleFileDrop });

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const fileUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("files", addFiles);
    formData.append("project_id", String(projectId));
    formData.append("survey_id", String(surveyId));
    if (projectId && surveyId)
      try {
        await projectServices.postProjectAttachments(
          formData,
          (_progressEvent: any) => { }
        );
        enqueueSnackbar("File Uploaded successfully!", { variant: "success" });
        if (changeModal === null) {
          await projectTypeIdChange(2);
        }
        getSurveys();
        setLoading(false);
        setImportFile(false);
        setScratch(true);
        setAddFiles(null);
      } catch (e) {
        logger.error(e);
        if ((e as any)?.response?.status === 403) {
          enqueueSnackbar("Access denied: Insufficient permissions.", {
            variant: "error",
          });
        } else {
          enqueueSnackbar("An error occurred. Please try again.", {
            variant: "error",
          });
        }
        setLoading(false);
      }
  };

  const fileUploadScratch = async () => {
    setLoading(true);
    const formData = new FormData();
    surveyMaterialFiles.map((value: any) => formData.append("files", value));
    formData.append("object_id", "1");
    formData.append("identification_id", String(projectId));
    if (projectId && surveyId)
      try {
        await projectServices.postSurveyMaterialAttachments(
          Number(projectId),
          Number(surveyId),
          formData,
          (_progressEvent: any) => { }
        );
        enqueueSnackbar("File Uploaded successfully!", { variant: "success" });
        if (surveyType !== 2) {
          await projectTypeIdChange(scratch ? 1 : 3);
        }
        getSurveys();
        setLoading(false);
        setSurveyMaterialFiles([]);
        handleClose();
      } catch (e) {
        logger.error(e);
        if ((e as any)?.response?.status === 403) {
          enqueueSnackbar("Access denied: Insufficient permissions.", {
            variant: "error",
          });
        } else {
          enqueueSnackbar("An error occurred. Please try again.", {
            variant: "error",
          });
        }
        setLoading(false);
      }
  };

  const formatFileSize = (bytes: any, decimalPoint: any) => {
    if (bytes == 0) return "0 Bytes";
    var k = 1000,
      dm = decimalPoint || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const projectTypeIdChange = async (type: number) => {
    if (!loading) setLoading(true);
    let payload = {
      type_id: type,
      survey_id: Number(surveyId),
    };
    if (projectId)
      try {
        await projectServices.project_type_change(String(projectId), payload);
        setLoading(false);
      } catch (e) {
        logger.error(e);
        if ((e as any)?.response?.status === 403) {
          enqueueSnackbar("Access denied: Insufficient permissions.", {
            variant: "error",
          });
        } else {
          enqueueSnackbar("An error occurred. Please try again.", {
            variant: "error",
          });
        }
        setLoading(false);
      }
  };

  return changeModal || importFile || scratch || exsisting ? (
    <Dialog
      open={open}
      maxWidth={!importFile && !scratch && !exsisting ? "lg" : "sm"}
      fullWidth
    >
      {loading && <LoadingSpinner />}
      <Stack
        justifyContent="center"
        alignItems="center"
        position="relative"
        spacing={3}
        sx={{
          minHeight: "70vh",
          display: importFile || scratch || exsisting ? "none" : "",
        }}
      >
        {/* <IconButton
          sx={{ position: "absolute", top: "20px", right: "20px" }}
          onClick={() => {
            handleClose();
          }}
        >
          <CloseOutlinedIcon />
        </IconButton> */}
        <Typography variant="h2" fontWeight="600">
          Let's get you started !
        </Typography>
        <div className="attachment-dialoge-content">
          <StyledCard
            onClick={() => {
              setScratch(true);
            }}
          >
            <Typography variant="h6" color={theme.palette.text.primary}>
              Start from scratch
            </Typography>
            <Typography variant="body4" color={theme.palette.grey[500]}>
              Jump right in and build somthing new
            </Typography>
          </StyledCard>
          <StyledCard
            onClick={() => {
              setImportFile(true);
            }}
          >
            <Typography variant="h6" color={theme.palette.text.primary}>
              Import Questions
            </Typography>
            <Typography variant="body4" color={theme.palette.grey[500]}>
              Upload a file
            </Typography>
          </StyledCard>
          <StyledCard
            onClick={() => {
              setExsisting(true);
            }}
            sx={{ display: "none" }}
          >
            <Typography variant="h6" color={theme.palette.text.primary}>
              Choose Template
            </Typography>
            <Typography variant="body4" color={theme.palette.grey[500]}>
              Choose exsisting template
            </Typography>
          </StyledCard>
        </div>
      </Stack>
      <Box sx={{ display: !importFile || scratch || exsisting ? "none" : "" }}>
        <DialogTitle>Upload Questionnaire</DialogTitle>
        <DialogContent>
          <p className="error-text">{error}</p>
          <Box {...getRootPropsRestricted()} className="file-upload-box">
            <input
              {...getInputPropsRestricted({ accept: ".doc,.docx" })}
              multiple={false}
              type="file"
            />

            <Stack spacing={2} alignItems="center" justifyContent="center">
              <p style={{ fontSize: "14px", fontWeight: 400 }}>
                Drag & drop your files here or{" "}
                <span className="choose-file-text">choose files.</span>
              </p>
              {addFiles?.name}
            </Stack>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              onClick={() => {
                if (changeModal) {
                  setChangeModal(null);
                  handleClose();
                  setAddFiles(null);
                  setError("");
                  setTimeout(() => {
                    setImportFile(false);
                    setScratch(false);
                  }, 1000);
                } else {
                  if (importFile) {
                    setImportFile(false);
                    setAddFiles(null);
                  } else {
                    handleClose();
                    setAddFiles(null);
                    setError("");
                    setTimeout(() => {
                      setImportFile(false);
                      setScratch(false);
                    }, 1000);
                  }
                }
              }}
              sx={{ mr: 1 }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                fileUpload();
              }}
              variant="contained"
              disabled={addFiles === null}
            >
              Save
            </Button>
          </Box>
        </DialogContent>
      </Box>
      <Box
        sx={{ display: importFile || (!scratch && !exsisting) ? "none" : "" }}
      >
        <DialogTitle>Upload additional survey material</DialogTitle>
        <DialogContent>
          <p className="error-text">{error}</p>
          <Box {...getRootProps()} className="file-upload-box">
            <input {...getInputProps()} multiple={false} />
            <Stack spacing={2} alignItems="center" justifyContent="center">
              <p style={{ fontSize: "14px", fontWeight: 400 }}>
                Drag & drop your files here or{" "}
                <span className="choose-file-text">choose files.</span>
              </p>
              {addFiles?.name}
            </Stack>
          </Box>
          <Box
            sx={{
              "&::-webkit-scrollbar": { display: "none" },
              overflow: "auto",
              height: surveyMaterialFiles.length > 2 ? "200px" : "",
            }}
          >
            {surveyMaterialFiles.map((value: any, i: number) => {
              let icon = value.name && value.name.split(".").pop();
              return (
                <Box
                  key={i}
                  sx={{
                    border: "2px solid rgba(223, 227, 232, 1)",
                    marginTop: "10px",
                    borderRadius: "5px",
                    padding: "10px",
                    fontWeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack spacing={2} direction="row">
                    <div style={{ height: "28px", width: "28px" }}>
                      {/* @ts-ignore */}
                      <FileIcon extension={icon} {...defaultStyles[icon]} />
                    </div>
                    <div>
                      <Typography
                        style={{ fontSize: "12px", wordBreak: "break-all" }}
                      >
                        {value?.name}
                      </Typography>
                      <div
                        style={{
                          color: "rgba(145, 158, 171, 1)",
                          fontSize: "11px",
                          marginTop: "5px",
                        }}
                      >
                        {formatFileSize(value.size, 2)}
                      </div>
                    </div>
                  </Stack>
                  <IconButton
                    onClick={() => {
                      let payload = [...surveyMaterialFiles];
                      payload.splice(i, 1);
                      setSurveyMaterialFiles(payload);
                    }}
                  >
                    <CancelOutlinedIcon color="inherit" />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              onClick={async () => {
                if (changeModal) {
                  setChangeModal(null);
                  handleClose();
                  setAddFiles(null);
                  setError("");
                  setTimeout(() => {
                    setImportFile(false);
                    setScratch(false);
                  }, 1000);
                } else {
                  if ((scratch || exsisting) && surveyType === null) {
                    await projectTypeIdChange(scratch ? 1 : 3);
                    await getSurveys();
                    handleClose();
                    setAddFiles(null);
                    setSurveyMaterialFiles([]);
                    setError("");
                    setTimeout(() => {
                      setImportFile(false);
                      setScratch(false);
                      setExsisting(false);
                    }, 500);
                  } else {
                    handleClose();
                    setAddFiles(null);
                    setSurveyMaterialFiles([]);
                    setError("");
                    setTimeout(() => {
                      setImportFile(false);
                      setScratch(false);
                      setExsisting(false);
                    }, 500);
                  }
                }
              }}
              sx={{ mr: 1 }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                fileUploadScratch();
              }}
              variant="contained"
              disabled={surveyMaterialFiles.length <= 0}
            >
              Save
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  ) : (
    <DetailsBox>
      {loading && <LoadingSpinner />}
      <Stack
        justifyContent="center"
        alignItems="center"
        position="relative"
        spacing={3}
        sx={{
          minHeight: "70vh",
          display: importFile || scratch || exsisting ? "none" : "",
        }}
      >
        {/* <IconButton
          sx={{ position: "absolute", top: "20px", right: "20px" }}
          onClick={() => {
            handleClose();
          }}
        >
          <CloseOutlinedIcon />
        </IconButton> */}
        <Typography variant="h2" fontWeight="600">
          Let's get you started !
        </Typography>
        <div className="attachment-dialoge-content">
          <StyledCard
            onClick={() => {
              setScratch(true);
            }}
          >
            <Typography variant="h6" color={theme.palette.text.primary}>
              Start from scratch
            </Typography>
            <Typography variant="body4" color={theme.palette.grey[500]}>
              Jump right in and build somthing new
            </Typography>
          </StyledCard>
          <StyledCard
            onClick={() => {
              setImportFile(true);
            }}
          >
            <Typography variant="h6" color={theme.palette.text.primary}>
              Import Questions
            </Typography>
            <Typography variant="body4" color={theme.palette.grey[500]}>
              Upload a file
            </Typography>
          </StyledCard>
          <StyledCard
            onClick={() => {
              setExsisting(true);
            }}
            sx={{ display: "none" }}
          >
            <Typography variant="h6" color={theme.palette.text.primary}>
              Choose Template
            </Typography>
            <Typography variant="body4" color={theme.palette.grey[500]}>
              Choose exsisting template
            </Typography>
          </StyledCard>
        </div>
      </Stack>
      <Box sx={{ display: !importFile || scratch || exsisting ? "none" : "" }}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <p className="error-text">{error}</p>
          <Box {...getRootProps()} className="file-upload-box">
            <input {...getInputProps()} multiple={false} />
            <Stack spacing={2} alignItems="center" justifyContent="center">
              <p style={{ fontSize: "14px", fontWeight: 400 }}>
                Drag & drop your files here or{" "}
                <span className="choose-file-text">choose files.</span>
              </p>
              {addFiles?.name}
            </Stack>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              onClick={() => {
                if (changeModal) {
                  setChangeModal(null);
                  handleClose();
                  setAddFiles(null);
                  setError("");
                  setTimeout(() => {
                    setImportFile(false);
                    setScratch(false);
                  }, 1000);
                } else {
                  if (importFile) {
                    setImportFile(false);
                    setAddFiles(null);
                  } else {
                    handleClose();
                    setAddFiles(null);
                    setError("");
                    setTimeout(() => {
                      setImportFile(false);
                      setScratch(false);
                    }, 1000);
                  }
                }
              }}
              sx={{ mr: 1 }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                fileUpload();
              }}
              variant="contained"
              disabled={addFiles === null}
            >
              Save
            </Button>
          </Box>
        </DialogContent>
      </Box>
      <Box
        sx={{ display: importFile || (!scratch && !exsisting) ? "none" : "" }}
      >
        <DialogTitle>Upload additional survey material</DialogTitle>
        <DialogContent>
          <p className="error-text">{error}</p>
          <Box {...getRootProps()} className="file-upload-box">
            <input {...getInputProps()} multiple={false} />
            <Stack spacing={2} alignItems="center" justifyContent="center">
              <p style={{ fontSize: "14px", fontWeight: 400 }}>
                Drag & drop your files here or{" "}
                <span className="choose-file-text">choose files.</span>
              </p>
              {addFiles?.name}
            </Stack>
          </Box>
          <Box
            sx={{
              "&::-webkit-scrollbar": { display: "none" },
              overflow: "auto",
              height: surveyMaterialFiles.length > 2 ? "200px" : "",
            }}
          >
            {surveyMaterialFiles.map((value: any, i: number) => {
              let icon = value.name && value.name.split(".").pop();
              return (
                <Box
                  key={i}
                  sx={{
                    border: "2px solid rgba(223, 227, 232, 1)",
                    marginTop: "10px",
                    borderRadius: "5px",
                    padding: "10px",
                    fontWeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack spacing={2} direction="row">
                    <div style={{ height: "28px", width: "28px" }}>
                      {/* @ts-ignore */}
                      <FileIcon extension={icon} {...defaultStyles[icon]} />
                    </div>
                    <div>
                      <Typography
                        style={{ fontSize: "12px", wordBreak: "break-all" }}
                      >
                        {value?.name}
                      </Typography>
                      <div
                        style={{
                          color: "rgba(145, 158, 171, 1)",
                          fontSize: "11px",
                          marginTop: "5px",
                        }}
                      >
                        {formatFileSize(value.size, 2)}
                      </div>
                    </div>
                  </Stack>
                  <IconButton
                    onClick={() => {
                      let payload = [...surveyMaterialFiles];
                      payload.splice(i, 1);
                      setSurveyMaterialFiles(payload);
                    }}
                  >
                    <CancelOutlinedIcon color="inherit" />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              onClick={async () => {
                if (changeModal) {
                  setChangeModal(null);
                  handleClose();
                  setAddFiles(null);
                  setError("");
                  setTimeout(() => {
                    setImportFile(false);
                    setScratch(false);
                  }, 1000);
                } else {
                  if ((scratch || exsisting) && surveyType === null) {
                    await projectTypeIdChange(scratch ? 1 : 3);
                    await getSurveys();
                    handleClose();
                    setAddFiles(null);
                    setSurveyMaterialFiles([]);
                    setError("");
                    setTimeout(() => {
                      setImportFile(false);
                      setScratch(false);
                      setExsisting(false);
                    }, 500);
                  } else {
                    handleClose();
                    setAddFiles(null);
                    setSurveyMaterialFiles([]);
                    setError("");
                    setTimeout(() => {
                      setImportFile(false);
                      setScratch(false);
                      setExsisting(false);
                    }, 500);
                  }
                }
              }}
              sx={{ mr: 1 }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                fileUploadScratch();
              }}
              variant="contained"
              disabled={surveyMaterialFiles.length <= 0}
            >
              Save
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </DetailsBox>
  );
};

export default AttachmentModalComponent;
