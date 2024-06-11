import {
  PostProjectRequestByIdRequestType,
  ProjectRequestService,
  RequestState,
} from "@/services/project-request.service";
import { ProjectRequest } from "@/types/project-request.type";
// import AddCard from "@/components/add-card"
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { GridContainerProject } from "@/styles/grid";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
// import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
// import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CreateRequest from "./createRequest";
import TextField from "@/components/text-field";
import AddBtn from "@/components/add-btn";

const BackGroundColor = (bgId: any) => {
  console.log(bgId);

  if (bgId == 1) {
    return "#FF5712";
  } else if (bgId == 2) {
    return "green";
  } else if (bgId == 3) {
    return "red";
  } else {
    return "#FF5712";
  }
};

function mapRequestState(id: number) {
  if (id === 3) return "REJECTED";
  else if (id === 2) return "APPROVED";
  else return "OPEN";
}

const StyledKeys = styled(Typography)(() => ({
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "15px",
  letterSpacing: "0.02em",
  color: "#637381",
  marginBottom: "0.3rem !important",
}));

const StyledValues = styled(Typography)(() => ({
  fontWeight: "500 !important",
  fontSize: "16px  !important",
  lineHeight: "140%",
  color: "#323232",
}));

function ProjectRequestContainer() {
  const [requests, setRequests] = useState<Array<ProjectRequest>>([]);
  const service = new ProjectRequestService();
  const { projectId } = useParams();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const [_statusList, setStatusList] = useState<Array<RequestState>>([]);

  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(
    null
  );
  const [comments, setComments] = useState("");

  function changeStatus(status: 2 | 3) {
    if (selectedRequest) {
      service
        .patchProjectRequestById(Number(projectId), selectedRequest?.id, {
          comment: comments,
          status_id: status,
        })
        .then(() => {
          getProjectRequests();
          setSelectedRequest(null);
        })
        .catch(() => {
          enqueueSnackbar(
            <Typography variant="body1">Editing failed</Typography>,
            {
              variant: "error",
            }
          );
        });
    }
  }

  async function getProjectRequests() {
    try {
      const data = await service.getProjectRequestById(Number(projectId));

      setRequests(data);
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">Fetching requests failed</Typography>,
        {
          variant: "error",
        }
      );
    }
  }

  async function postProjectRequests(
    reqObj: PostProjectRequestByIdRequestType
  ) {
    try {
      await service.postProjectRequestById(Number(projectId), reqObj);

      enqueueSnackbar(
        <Typography variant="body1">Edited requests.</Typography>,
        {
          variant: "success",
        }
      );
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">Posting requests failed</Typography>,
        {
          variant: "error",
        }
      );
    }
  }

  function openCreateDialog() {
    setShowCreateDialog(true);
  }

  function closeCreateDialog() {
    setShowCreateDialog(false);
  }

  function submitHandler(
    title: string,
    effort: number,
    eta: number,
    attachments: Array<any>,
    editorData: string
  ) {
    postProjectRequests({
      title: title,
      description: editorData,
      effort: effort,
      eta: eta,
      files: attachments,
    }).then(() => {
      getProjectRequests();
      closeCreateDialog();
    });
  }

  useEffect(() => {
    getProjectRequests();
  }, []);

  useEffect(() => {
    service.getProjectRequestStates().then((data) => console.log(data));
    service.getProjectRequestStatuses().then((data) => setStatusList(data));
  }, []);

  return (
    <>
      <CreateRequest
        submitHandler={submitHandler}
        closeDialog={closeCreateDialog}
        showDialog={showCreateDialog}
      />

      <Box
        sx={{ flex: "1", overflow: "scroll" }}
        style={{
          background: "white",
          borderRadius: "12px",
          height: "calc(100vh - 228px)",
        }}
      >
        {!selectedRequest ? (
          <Box>
            <Box
              style={{
                width: "100%",
                position: "sticky",
                top: "0px",
                background: "white",
                zIndex: 500,
                padding: "1rem 2rem 0rem 2rem",
              }}
            >
              <Stack direction="row" gap="1rem">
                <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
                  Requests
                </Typography>
                <AddBtn onClick={openCreateDialog} />
              </Stack>
            </Box>
            <Box sx={{ padding: "0rem 2rem 0rem 2rem" }}>
              <GridContainerProject style={{ marginBottom: "2rem" }}>
                {/* <AddCard
                  handleClick={openCreateDialog}
                  height={"170px"}
                  width={"300px"}
                /> */}
                {requests.map((request, i) => {
                  return (
                    <Card
                      onClick={() => setSelectedRequest(request)}
                      sx={{
                        padding: "15px 20px",
                        borderRadius: "16px",
                        width: "300px",
                        height: "170px",
                        cursor: "pointer",
                        backgroundColor: "#fdf6ff",
                        boxShadow:
                          "0px 2px 4px 0px rgba(169, 169, 169, 0.25), 0px 4px 12px 0px rgba(222, 222, 222, 0.25)",
                        "&:hover": {
                          backgroundColor: "#f4ddff",
                          boxShadow:
                            "0px 2px 4px 0px rgba(232, 204, 255, 0.12),0px 4px 12px 0px rgba(228, 152, 255, 0.25)",
                          cursor: "pointer",
                        },
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
                              color: "#fff",
                            }}
                          >
                            {mapRequestState(request.status_id)}
                          </Box>
                        </Box>
                        <Box>
                          <MoreHorizOutlinedIcon sx={{ color: "black" }} />
                        </Box>
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
                          {request.title}
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
                            maxHeight: "15px",
                          }}
                          variant="body1"
                          dangerouslySetInnerHTML={{
                            __html: request.description,
                          }}
                        ></Typography>
                      </Box>
                      <Stack
                        sx={{ marginTop: "auto", gap: "1rem" }}
                        direction="row-reverse"
                      >
                        <Stack
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "32px !important",
                            color: "darkgray",
                            fontSize: "1rem",
                            flexDirection: "row",
                            gap: "2rem",
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
                            {/* {request.effort} */}
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "32px !important",
                            color: "darkgray",
                            fontSize: "1rem",
                            flexDirection: "row",
                            gap: "2rem",
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
                            {/* {statusList.find(
                              (item) => item.id == request.status_id
                            )?.name || request.priority_id} */}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Card>
                  );
                })}
              </GridContainerProject>
            </Box>
          </Box>
        ) : (
          <Box
            style={{
              width: "100%",
              position: "sticky",
              top: "0px",
              background: "white",
              zIndex: 500,
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
                onClick={() => setSelectedRequest(null)}
              >
                <ArrowBackIcon width={16} height={16} />
              </IconButton>
              <Typography variant="h3">{selectedRequest.title}</Typography>
              <Box
                sx={{
                  fontWeight: 400,
                  fontSize: "11px",
                  lineHeight: "140%",
                  textTransform: "capitalize",
                  padding: "0.25rem",
                  borderRadius: "4px",
                  backgroundColor: BackGroundColor(selectedRequest.status_id),
                  color: "#fff",
                }}
              >
                {mapRequestState(selectedRequest.status_id)}
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <Box>
                <StyledKeys style={{ marginBottom: "0.5rem" }}>
                  Title
                </StyledKeys>
                <StyledValues>{selectedRequest.title}</StyledValues>
              </Box>
              <Box>
                <StyledKeys style={{ marginBottom: "0.5rem" }}>
                  Effort in hrs
                </StyledKeys>
                <StyledValues>{selectedRequest.effort}</StyledValues>
              </Box>
              <Box>
                <StyledKeys style={{ marginBottom: "0.5rem" }}>ETA</StyledKeys>
                <StyledValues>{selectedRequest.eta}</StyledValues>
              </Box>
              <Box>
                <StyledKeys style={{ marginBottom: "0.5rem" }}>Cost</StyledKeys>
                <StyledValues>{selectedRequest.eta}</StyledValues>
              </Box>
            </Box>

            <Box>
              <StyledKeys style={{ marginBottom: "0.5rem" }}>
                Description
              </StyledKeys>
              <StyledValues
                dangerouslySetInnerHTML={{
                  __html: selectedRequest.description,
                }}
              ></StyledValues>
            </Box>
            {mapRequestState(selectedRequest.status_id) === "OPEN" && (
              <Box
                sx={{
                  marginBottom: "1rem",
                }}
              >
                <TextField
                  placeholder="Add Comments"
                  fullWidth
                  multiline={true}
                  rows={3}
                  style={{}}
                  InputProps={{
                    style: {
                      padding: "10px",
                    },
                  }}
                  sx={{ paddingTop: "5px" }}
                  onChange={(e) => setComments(e.target.value)}
                />
              </Box>
            )}

            {mapRequestState(selectedRequest.status_id) === "OPEN" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row-reverse",
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    gap: "1rem",
                  }}
                >
                  <Button
                    sx={{
                      marginBottom: "1rem",
                    }}
                    variant="outlined"
                    onClick={() => changeStatus(3)}
                  >
                    Reject
                  </Button>
                  <Button
                    sx={{
                      marginBottom: "1rem",
                    }}
                    variant="contained"
                    onClick={() => changeStatus(2)}
                  >
                    Approve
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </>
  );
}

export default ProjectRequestContainer;
