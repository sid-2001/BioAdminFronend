import { PageWrapper } from "@/styles/page-wrapper";
// import { FilterBox } from "../project-list/project-list.container";
import { ListService } from "@/services/list.service";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useRef, useState } from "react";
import GetAppIcon from "@mui/icons-material/GetApp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FolderIcon from "@mui/icons-material/Folder";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { ProjectFileType } from "@/types/project.type";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { downloadFile } from "@/components/thread-chat-body/thread-chat-body.component";
import LoadingSpinner from "@/components/loader";
import { ProjectDataService } from "@/services/project-data.services";
import { logger } from "@/helpers/logger";
import { QuestionNameInput } from "@/constants/cutom-question-name-input";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { FileIcon, defaultStyles } from "react-file-icon";

// const StyledMenu = styled(Menu)(() => ({
//   "& *": {
//     boxShadow: "none !important",
//   },
// }))

const StyledMenuItems = styled(MenuItem)(() => ({
  padding: "8px 16px",
  width: "190px",
  height: "40px",
  display: "flex",
  gap: "8px",
}));

const FileCard = styled(Box)(() => ({
  padding: "12px",
  // width: "291px",
  height: "48px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "12px",
  background: "#EEE",
  WebkitUserSelect: "none",
  userSelect: "none",

  "&.active": {
    background: "#99EDD4",
  },
}));

const StyledPath = styled(Typography)`
  max-width: 900px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 1900px) {
    max-width: 700px;
  }

  @media (max-width: 1368px) {
    max-width: 400px;
  }

  @media (max-width: 768px) {
    max-width: 200px;
  }
`;

const FolderType = "folder";

enum AttachmentObjectStringName {
  Projects = 1,
}

function ProjectFileContainer() {
  const { enqueueSnackbar } = useSnackbar();
  const projectDataServices = new ProjectDataService();
  const [activeCard, setActiveCard] = useState(-1);
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  // const openUploadOptions = Boolean(anchorEl)

  const [isLoading, setIsLoading] = useState(true);

  const [importErrorModal, setImportErrorModal] = useState(false);
  const [fileInputState, setFileInputState] = useState<Array<any>>([]);
  const [uploadPath, setUploadPath] = useState("");

  function CloseErrorModal() {
    setImportErrorModal(false);
  }
  // console.log(activeCard);

  // const handleUploadOptionsClick = (
  //   event: React.MouseEvent<HTMLButtonElement>,
  // ) => {
  //   setAnchorEl(event.currentTarget)
  // }
  // const handleUploadOptionsClose = () => {
  //   setAnchorEl(null)
  //   // setActiveCard(-1)
  // }
  const { projectId, surveyId } = useParams();

  const [downloadEl, setDownloadEl] = useState<null | HTMLElement>(null);
  const openDownloadOptions = Boolean(downloadEl);
  const handleDownloadOptionsClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setDownloadEl(event.currentTarget);
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray: any = Array.from(e.target.files);
      setFileInputState([...fileInputState, ...filesArray]);
      e.target.value = "";
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

  async function uploadFileHandler() {
    // const fileInput = e.target;
    if (fileInputState && fileInputState.length > 0 && projectId) {
      // if (fileInput.files.length > 5) {
      //   setImportErrorModal(true)
      //   return
      // }
      setIsLoading(true);

      const regex = /^p\/p-\d+\//;
      const path =
        pathStack?.length === 0
          ? "/"
          : pathStack[pathStack.length - 1].replace(regex, "");
      console.log(path, "pathpath");
      const formData = new FormData();
      let finalPath = uploadPath ? uploadPath : path;
      if (finalPath !== pathStack[pathStack.length - 1]) {
        finalPath = pathStack[pathStack.length - 1] + finalPath;
      }
      formData.append("upload_path", finalPath);

      for (let i = 0; i < fileInputState.length; i++) {
        formData.append("files", fileInputState[i]);
      }
      if (projectId && surveyId)
        try {
          await projectDataServices.postProjectFiles(
            Number(projectId),
            Number(surveyId),
            formData,
            (_progressEvent: any) => { }
          );
          await getAndSetProjectFiles(pathStack[pathStack.length - 1]);
        } catch (error) {
          logger.error(error);
        } finally {
          setIsLoading(false);
          ResetUploadFiles();
          // fileInput.value = '';
        }
    }
  }

  const ResetUploadFiles = () => {
    setFileInputState([]);
    setImportErrorModal(false);
    setUploadPath("");
  };
  function triggerFileInput() {
    // setShowDialog(false);
    // setModalTableData(null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleDownloadOptionsClose = (optionNo: number) => {
    if (optionNo === 3) openFolder();
    if (optionNo === 1) downloadSelectedFile();
    setDownloadEl(null);
    setActiveCard(-1);
  };

  function downloadSelectedFile() {
    if (selectedFile && selectedFile.url) {
      downloadFile(selectedFile.url);
    }
  }

  function openFolder() {
    if (selectedFile) {
      setPathStack((prev) => [...prev, selectedFile.path]);
      setSelectedFile(null);
    }
  }

  function goBack() {
    if (pathStack.length > 1) {
      pathStack.pop();
      const temp = [...pathStack];
      setPathStack(temp);
    }
  }

  async function getAndSetProjectFiles(path = "") {
    setIsLoading(true);
    try {
      const data = await listService.get_project_files(
        projectId || "",
        AttachmentObjectStringName.Projects,
        path
      );

      setFiles(data);
      setIsLoading(false);
    } catch (error) {
      enqueueSnackbar("Failed to fetch resources", {
        variant: "error",
      });
      setIsLoading(false);
    }
  }

  // async function uploadFileHandler(e: any) {
  //   const fileInput = e.target;
  //   if (fileInput.files && fileInput.files[0]) {
  //     setIsLoading(true)
  //     const file = e.target.files[0];
  //     const path = pathStack[pathStack.length - 1]
  //     const formData = new FormData();
  //     formData.append('upload_path', path);
  //     formData.append('files', file);

  //     try {
  //       await projectDataServices.postProjectFiles(formData, (_progressEvent: any) => { })
  //       await getAndSetProjectFiles(path)
  //     } catch (error) {
  //       logger.error(error)
  //     } finally {
  //       setIsLoading(false)
  //       handleUploadOptionsClose()
  //       fileInput.value = ''
  //     }
  //   }
  // }

  const listService = new ListService();
  const [files, setFiles] = useState<Array<ProjectFileType>>([]);
  const [selectedFile, setSelectedFile] = useState<null | ProjectFileType>(
    null
  );
  const [pathStack, setPathStack] = useState<Array<string>>([]);

  useEffect(() => {
    if (surveyId)
      setPathStack([``, `s/`, `s/s-${surveyId}`])
  }, [surveyId])

  useEffect(() => {
    if (pathStack.length) {
      // console.log(
      //   pathStack[pathStack.length - 1],
      //   "pathStack[pathStack.length - 1]"
      // );
      getAndSetProjectFiles(pathStack[pathStack.length - 1]);
    }
  }, [pathStack]);

  // console.log(selectedFile)

  function cardDBClickHandler(resource: ProjectFileType) {
    if (resource.type === FolderType) {
      console.log("Double clicked");
      setSelectedFile(resource);
      handleDownloadOptionsClose(3);
    }
  }

  // console.log(files, selectedFile, pathStack, "pathStack.pop()", "pathstack");

  return (
    <>
      {isLoading ? <LoadingSpinner /> : null}

      <Dialog
        scroll="paper"
        onClose={CloseErrorModal}
        open={importErrorModal}
        // maxWidth="xxl"
        PaperProps={{
          style: {
            width: "30%",
            // height: "35%",
            maxWidth: "none",
          },
        }}
      >
        {/* <Box style={{ display: "flex", flexDirection: "column", padding: "1rem", height: "100%" }}>
          <Box style={{ display: "flex", justifyContent: "flex-end" }}>
            <CloseOutlinedIcon onClick={CloseErrorModal} cursor="pointer" />
          </Box>
          <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "red", paddingBottom: "2rem" }}>
            Can upload 5 files once
          </Box>
        </Box> */}
        <DialogTitle>Upload Files</DialogTitle>

        <DialogContent>
          <QuestionNameInput
            sx={{
              width: "50% !important",
              marginBottom: "0.5rem",
              "& .MuiInputBase-input": {
                fontWeight: 700,
              },
            }}
            placeholder="Folder Path(optional)"
            className="base-comp-question_code-input"
            size="small"
            fullWidth
            value={uploadPath}
            onChange={(e) => setUploadPath(e.target.value)}
          />
          <Box className="file-upload-box" onClick={triggerFileInput}>
            {/* <input multiple={false} /> */}
            <label
              style={{
                display: "flex",
                gap: "8px",
              }}
              htmlFor="upload-file-for-file-module"
            >
              <input
                style={{ display: "none" }}
                type="file"
                ref={fileInputRef}
                id="upload-file-for-file-module"
                onChange={handleFileInputChange}
                // onChange={uploadFileHandler}
                multiple
              />
            </label>
            <Stack spacing={2} alignItems="center" justifyContent="center">
              <p style={{ fontSize: "14px", fontWeight: 400 }}>
                Drag & drop your files here or{" "}
                <span className="choose-file-text">choose files.</span>
              </p>
            </Stack>
          </Box>
          {fileInputState &&
            fileInputState?.map((value: any, i: number) => {
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
                  {!isLoading && (
                    <IconButton
                      onClick={() => {
                        let payload = [...fileInputState];
                        payload.splice(i, 1);
                        setFileInputState(payload);
                      }}
                    >
                      <CancelOutlinedIcon color="inherit" />
                    </IconButton>
                  )}
                </Box>
              );
            })}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              onClick={() => ResetUploadFiles()}
              sx={{ mr: 1 }}
              disabled={isLoading}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                uploadFileHandler();
              }}
              disabled={isLoading || fileInputState.length === 0}
              variant="contained"
            >
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <PageWrapper
        style={{
          background: "white",
          borderRadius: "12px",
          height: "calc(100vh - 228px)",
        }}
      >
        <Stack
          sx={{ paddingRight: "1rem" }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* <Box
            style={{
              width: "100%",
              position: "sticky",
              top: "0px",
              display: "flex",
              alignItems: "center",
              background: "white",
              zIndex: 500,
              padding: "1rem 2rem 0rem 2rem",
              marginBottom: "1rem",
              gap: "1rem",
            }}
          >
            <IconButton
              sx={{
                borderRadius: "4px",
              }}
              onClick={goBack}
            >
              <ArrowBackIcon width={24} height={24} />
            </IconButton>
            <StyledPath variant="h6">
              {pathStack.length
                ? pathStack[pathStack.length - 1] || "Home"
                : "Home"}
            </StyledPath>
          </Box> */}
          <Box
            style={{
              width: "100%",
              position: "sticky",
              top: "0px",
              display: "flex",
              alignItems: "center",
              background: "white",
              zIndex: 500,
              padding: "1rem 2rem 0rem 2rem",
              marginBottom: "1rem",
              gap: "1rem",
            }}
          >
            {pathStack.length > 1 && (
              <IconButton
                sx={{
                  borderRadius: "4px",
                }}
                onClick={goBack}
              >
                <ArrowBackIcon width={24} height={24} />
              </IconButton>
            )}
            <StyledPath variant="h6">
              {pathStack.length
                ? pathStack[pathStack.length - 1] || "Home"
                : "Home"}
            </StyledPath>
          </Box>

          {/* Menu Dropdown  */}
          <Box>
            <IconButton
              sx={{
                width: "28px",
                height: "28px",
                padding: "0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fbf6fb",
                color: "#8E27D7",
                borderRadius: "0.25rem",
              }}
              id="upload-options"
              // aria-controls={openUploadOptions ? "upload-options" : undefined}
              aria-haspopup="true"
            // aria-expanded={openUploadOptions ? "true" : undefined}
            // onClick={handleUploadOptionsClick}
            >
              <AddIcon
                width={10}
                height={10}
                onClick={() => setImportErrorModal(true)}
              />
            </IconButton>
            {/* <StyledMenu
              id='basic-menu'
              anchorEl={anchorEl}
              open={openUploadOptions}
              onClose={handleUploadOptionsClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <StyledMenuItems>
                <label
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                  htmlFor='upload-file-for-file-module'
                >
                  <input
                    style={{ display: "none" }}
                    type='file'
                    id='upload-file-for-file-module'
                    onChange={uploadFileHandler}
                    multiple
                  />
                  <FileCopyIcon width={20} height={20} />
                  <Typography variant='body2'>Upload File</Typography>
                </label>
              </StyledMenuItems>
            </StyledMenu> */}
          </Box>
        </Stack>

        <Box sx={{ padding: "0rem 2rem 0rem 2rem" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 290px))",
              gap: "24px",
            }}
          >
            {files.map((resource, i) => (
              <FileCard
                sx={{
                  cursor: resource.type === FolderType ? "pointer" : "",
                }}
                onClick={() => setSelectedFile(resource)}
                key={i}
                className={activeCard === i ? "active" : ""}
                onDoubleClick={() => cardDBClickHandler(resource)}
              >
                <Stack
                  direction="row"
                  gap="8px"
                  alignItems="center"
                  sx={{
                    "& > svg": {
                      color:
                        resource.type === FolderType
                          ? "rgba(151, 71, 255, 1)"
                          : "rgba(59, 227, 137, 1)",
                    },
                  }}
                >
                  {resource.type === FolderType ? (
                    <FolderIcon width={24} height={24} />
                  ) : (
                    <FileCopyIcon width={24} height={24} />
                  )}
                  <Tooltip
                    title={resource.name.length > 18 ? resource.name : ""}
                  >
                    <Typography
                      variant="body3"
                      sx={{
                        color: "#323232",
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "normal",
                        width: "80%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {resource.name && resource.name.length > 25
                        ? resource.name.substring(0, 25)
                        : resource.name}
                    </Typography>
                  </Tooltip>
                </Stack>

                <Box>
                  <IconButton
                    sx={{
                      width: "24px",
                      height: "24px",
                      padding: "0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "rgba(156, 156, 156, 1)",
                      borderRadius: "0.25rem",
                    }}
                    id="download-options"
                    aria-controls={
                      openDownloadOptions ? "download-options" : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={openDownloadOptions ? "true" : undefined}
                    onClick={(e) => {
                      handleDownloadOptionsClick(e);
                      setActiveCard(i);
                    }}
                  >
                    <MoreHorizIcon width={10} height={10} />
                  </IconButton>
                </Box>
              </FileCard>
            ))}
            <Menu
              id="download-menu"
              anchorEl={downloadEl}
              open={openDownloadOptions && !!selectedFile}
              onClose={handleDownloadOptionsClose}
              MenuListProps={{
                "aria-labelledby": "download-button",
              }}
            >
              {selectedFile?.type === FolderType ? (
                <StyledMenuItems onClick={() => handleDownloadOptionsClose(3)}>
                  <FolderOpenIcon width={20} height={20} />
                  <Typography variant="body2">Open Folder</Typography>
                </StyledMenuItems>
              ) : (
                <StyledMenuItems onClick={() => handleDownloadOptionsClose(1)}>
                  <GetAppIcon width={20} height={20} />
                  <Typography variant="body2">Download</Typography>
                </StyledMenuItems>
              )}
            </Menu>
          </Box>
          {!isLoading && !files.length ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.3rem",
                }}
              >
                No files yet
              </Typography>
              <Button
                variant="contained"
                onClick={() => setImportErrorModal(true)}
              >
                Add File
              </Button>
            </Box>
          ) : null}
        </Box>
      </PageWrapper>
    </>
  );
}

export default ProjectFileContainer;
