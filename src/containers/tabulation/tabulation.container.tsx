// import AddCard from "@/components/add-card";
import Card from "@/components/card";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Box, IconButton, Menu, Stack, Tooltip, Typography } from "@mui/material";
import { GridContainerProject } from "@/styles/grid";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import InfoIcon from "@mui/icons-material/Info";
// import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
// import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { ProjectDataService } from "@/services/project-data.services";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LoadingSpinner from "@/components/loader";
import DataTabulationPage from "@/pages/data-tabulation";
import {
  AnswerFromAPI,
  JSONData,
  Question,
  QuestionListItem,
  postTabulationObject,
} from "@/types/project-data.type";
import AddCard from "@/components/add-card";
import DynamicCreateTabulation from "@/components/dynamic-create-tabulation";
import { StyledMenuItems } from "./tabulation.style";
import FileCopyRoundedIcon from '@mui/icons-material/FileCopyRounded';
import { logger } from "@/helpers/logger";

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

// function mapRequestState(id: number) {
//   if (id === 1) return "PENDING";
//   else if (id === 3) return "APPROVED";
//   else return "REJECTED";
// }

const initialData: JSONData = {
  // name: '',
  tables: [],
};

function ProjectTabulationContainer() {
  const service = new ProjectDataService();
  const [requests, setRequests] = useState([]);
  const [bannerList, setBannerList] = useState<AnswerFromAPI[] | []>([]);
  const [loading, setLoading] = useState(false);
  const { projectId, surveyId } = useParams();

  const [objectId, _setObjectId] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [tabulationCardData, setTabulationCardData] =
    useState<any>(initialData);
  const [showDialog, setShowDialog] = useState(false);
  const [questionList, setQuestionList] = useState<QuestionListItem[]>([]);
  const [bannerUid, setBannerUid] = useState("");
  const [bannerPayload, setBannerPayload] = useState<Question[]>([]);
  const [disableState, setDisableState] = useState(false);
  // options on card
  // let navigate = useNavigate()

  const [downloadEl, setDownloadEl] = useState<null | HTMLElement>(null);
  const [currentObjectId, setCurrentObjectId] = useState<string | null>(null);

  const [tabStatus, setTabStatus] = useState<boolean>(false);

  const ChangeStatus = async (status: boolean) => {
    setLoading(true)
    if (projectId && surveyId && tabulationCardData?.id) {
      try {
        const data = await service.TabulationActive(Number(projectId), Number(surveyId), Number(tabulationCardData?.id), status)
        if (status) {
          getAllTabulationData()
        } else {
          setShowDialog(false)
          getAllTabulationData()
        }
        return data
      } catch (error) {
        logger.error(error)
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  const openDownloadOptions = Boolean(downloadEl);

  const handleDownloadOptionsClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    objectUid: string,
    status: boolean,
  ) => {
    event.stopPropagation();
    setDownloadEl(event.currentTarget);
    setCurrentObjectId(objectUid);
    setTabStatus(status)
  };

  const handleDownloadOptionsClose = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setDownloadEl(null);
  };

  const handleDetailsOptionsClose = (
    event: React.MouseEvent<HTMLButtonElement>,
    objectUid: string
  ) => {
    event.stopPropagation();
    setDisableState(true);
    // setShowDialog(true)
    getTabulationDataById(objectUid, true);
    setDownloadEl(null);
    // navigate(`/projects/${project.project_id}/overview`)
  };

  const handleCloneOptionsClose = (
    event: React.MouseEvent<HTMLButtonElement>,
    objectUid: string
  ) => {
    event.stopPropagation();
    setDisableState(false);
    // console.log(event, objectUid, 'object')
    setDownloadEl(null);
    // setShowDialog(true)
    // setCloneMode(true);
    getTabulationDataById(objectUid, true);
  };

  function openDialog() {
    setDisableState(false);
    setShowDialog(true);
    setTabulationCardData(initialData);
  }

  // function closeDialog() {
  //   setShowDialog(false);
  // }

  async function PostDataTabulation(payload: postTabulationObject) {
    // console.log("Posting payload:", payload);
    setLoading(true);
    if (projectId && surveyId)
      try {
        const data = await service.postDataTabulation(Number(projectId), Number(surveyId), payload);
        if (data) {
          getAllTabulationData();
          enqueueSnackbar(
            <Typography variant="body1">
              Tabulation Planner Create Successfully.
            </Typography>,
            {
              variant: "success",
            }
          );
        }
      } catch (error) {
        console.error("Error posting data:", error);
        enqueueSnackbar(
          <Typography variant="body1">
            Adding tabulation requests failed
          </Typography>,
          {
            variant: "error",
          }
        );
      } finally {
        setLoading(false);
      }
  }

  async function PutDataTabulation(object_uid: string, payload: postTabulationObject) {
    setLoading(true);
    if (projectId && surveyId && object_uid)
      try {
        const data = await service.putDataTabulation(Number(projectId), Number(surveyId), payload, object_uid);
        if (data) {
          getAllTabulationData();
          enqueueSnackbar(
            <Typography variant="body1">
              Tabulation Planner Updated Successfully.
            </Typography>,
            {
              variant: "success",
            }
          );
        }
      } catch (error) {
        console.error("Error posting data:", error);
        enqueueSnackbar(
          <Typography variant="body1">
            Updating tabulation requests failed
          </Typography>,
          {
            variant: "error",
          }
        );
      } finally {
        setLoading(false);
      }
  }

  async function getAllTabulationData() {
    setLoading(true);

    try {
      const data = await service.GetAllTabulation(Number(projectId), Number(surveyId));
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

  async function getAllBannersList() {
    setLoading(true);

    try {
      const data = await service.getALLBanners(Number(projectId), Number(surveyId));
      // console.log(data, "datadatadata");
      if (Array.isArray(data) && data.length > 0) {
        const serviceNames = data?.map((item) => ({
          value: item.id,
          text: item.name,
          label: item.name,
          data_payload: item.data_payload,
          confidence_level: item?.confidence_level,
          object_uid: item?.object_uid,
          isDisabled: !item?.is_active
        }));
        // @ts-ignore
        setBannerList(serviceNames);
      }
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">
          Fetching tabulation requests failed
        </Typography>,
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  }

  function enqueueErrorSnackbar(message: string) {
    enqueueSnackbar(<Typography variant="body1">{message}</Typography>, {
      variant: "error",
    });
  }

  async function getTabulationDataById(object_uid: string, cloneMode: boolean) {
    setLoading(true);
    if (projectId && surveyId && object_uid)
      try {
        const data = await service.GetTabulationByProjectId(
          Number(projectId),
          Number(surveyId),
          object_uid
        );

        // console.log(data, "dataqwert");
        if (!data) {
          enqueueErrorSnackbar("No tabulation found");
          return;
        }

        if (!cloneMode) {
          if (data?.data?.tables?.length > 0) {
            setTabulationCardData(data?.data);
            setViewMode(true);
          } else {
            enqueueErrorSnackbar("No tabulation found");
          }
          return;
        }

        if (data?.tab_config) {
          // if (data?.tab_config && data?.tab_config?.length > 0) {
          setShowDialog(true);
          setTabulationCardData(data);
        } else {
          enqueueErrorSnackbar("No configurations found");
        }
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

  async function GetProjectBannerALLQuestions() {
    setLoading(true);

    try {
      const data = await service.getProjectTabulationQuestions(Number(projectId), Number(surveyId))
      if (data?.length > 0) {
        const excludedTypes = [
          "quantity",
          "date",
          "time",
          "opentext",
          "opentextlist",
          "numericlist",
        ];

        const filteredData = data.filter(
          (item) => !excludedTypes.includes(item.question_type_name)
        );
        const updatedData = filteredData.map((item, index) => ({
          ...item,
          question_value: index + 1,
        }));
        // @ts-ignore
        setQuestionList(updatedData);

        // setQuestionList(data);
      }
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">Fetching questions failed</Typography>,
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  }

  async function getALLBannersById(banner_planner_id: string) {
    // console.log(
    //   tabulationCardData,
    //   "getdatagetdatagetdatagetdatagetdatagetdatagetdatagetdatagetdatagetdata"
    // );

    setLoading(true);
    try {
      const data = await service.getALLBannersById(
        Number(projectId), Number(surveyId),
        String(banner_planner_id)
      );
      // console.log(data, "dataqwert");
      if (data) {
        // setTabulationCardData(data);

        // @ts-ignore
        setBannerPayload(data?.data_payload || []);
      } else {
        enqueueSnackbar(
          <Typography variant="body1">No tabulation found</Typography>,
          {
            variant: "error",
          }
        );
      }
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

  useEffect(() => {
    if (projectId && surveyId && bannerUid) {
      getALLBannersById(bannerUid);
    }
  }, [projectId, surveyId, bannerUid]);
  // console.log(bannerUid, "bannerUidbannerUidbannerUid", tabulationCardData);

  useEffect(() => {
    if (projectId && surveyId) {
      getAllTabulationData();
      getAllBannersList();
      GetProjectBannerALLQuestions();
    }
  }, [projectId, surveyId]);

  useEffect(() => {
    setViewMode(false)
  }, [surveyId])

  console.log(requests, "datadata")

  return (
    <>
      {loading ? <LoadingSpinner /> : null}

      {/* <Dialog
        scroll="paper"
        onClose={closeDialog}
        open={showDialog}
        // maxWidth="xxl"
        PaperProps={{
          style: {
            width: '80%',
            height: '80%',
            maxWidth: 'none',
          }
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
            Create New Tabulation
          </DialogTitle>
          <Box style={{ display: "flex" }}>
            <IconButton onClick={closeDialog} sx={{ width: "40px", height: "40px" }}  >
              <CloseOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
        <Box style={{ padding: "0rem 2rem 2rem 2rem" }}> */}
      <DynamicCreateTabulation
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        PostDataTabulation={PostDataTabulation}
        questionLists={questionList}
        bannerList={bannerList}
        bannerUid={bannerUid}
        setBannerUid={setBannerUid}
        bannerPayload={bannerPayload}
        setBannerPayload={setBannerPayload}
        tabulationCardData={tabulationCardData}
        disableState={disableState}
        PutDataTabulation={PutDataTabulation}
        tabStatus={tabStatus}
        setTabStatus={setTabStatus}
        ChangeStatus={ChangeStatus}
      />
      {/* </Box>
      </Dialog> */}

      <Box
        sx={{ flex: "1", overflow: "scroll" }}
        style={{
          background: "white",
          borderRadius: "12px",
          height: "calc(100vh - 273px)",
          width: "100%",
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
                Tabulations
              </Typography>
            </Box>
            <Box sx={{ padding: "0rem 2rem 0rem 2rem" }}>
              <GridContainerProject style={{ marginBottom: "2rem" }}>
                <Box
                  onClick={() => {
                    // setViewMode(false)
                  }}
                >
                  <AddCard
                    handleClick={openDialog}
                    height={"170px"}
                    width={"300px"}
                  />
                </Box>
                {requests.map((request: any, i) => {
                  return (
                    <Card
                      // onClick={(event: any) => {
                      //   // setObjectId(request?.object_uid);
                      //   // getTabulationDataById(request?.object_uid, false);
                      //   handleDetailsOptionsClose(
                      //     event,
                      //     request.object_uid
                      //   )
                      // }}
                      // @ts-ignore
                      onClick={(event: any) => handleDetailsOptionsClose(event, request.object_uid)}
                      disable={!request?.is_active}
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
                            background: BackGroundColor(1),
                            // opacity: 0.8,
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
                            {/* {mapRequestState(request.status_id)} */}
                            {request?.is_active ? 'Active' : 'Inactive'}
                          </Box>
                        </Box>
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
                            boxShadow: "none !important",
                          }}
                          id="download-options"
                          aria-controls={
                            openDownloadOptions ? "download-options" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={
                            openDownloadOptions ? "true" : undefined
                          }
                          onClick={(e) =>
                            handleDownloadOptionsClick(e, request.object_uid, request?.is_active)
                          } // Pass the object_uid
                        // aria-haspopup="true"
                        // aria-expanded={
                        //   openDownloadOptions ? "true" : undefined
                        // }
                        // onClick={(e) =>
                        //   handleDownloadOptionsClick(e, request.object_uid)
                        // } // Pass the object_uid
                        >
                          {/* <MoreHorizIcon width={10} height={10} /> */}
                          <MoreHorizOutlinedIcon sx={{ color: "#9C9C9C" }} />
                        </IconButton>
                      </Box>
                      {/* {openDownloadOptions && downloadEl === request.object_uid && ( // Only open the menu for the correct card */}
                      {openDownloadOptions &&
                        currentObjectId === request.object_uid && (
                          <Menu
                            id="download-menu"
                            anchorEl={downloadEl}
                            open={openDownloadOptions}
                            onClose={handleDownloadOptionsClose}
                            MenuListProps={{
                              "aria-labelledby": "download-button",
                            }}
                          >
                            <StyledMenuItems
                              onClick={(event: any) =>
                                handleDetailsOptionsClose(
                                  event,
                                  request.object_uid
                                )
                              }
                            >
                              <InfoIcon width={20} height={20} />
                              <Typography variant="body2">
                                {" "}
                                Configurations{" "}
                              </Typography>
                            </StyledMenuItems>
                            <StyledMenuItems
                              onClick={(event: any) =>
                                handleCloneOptionsClose(
                                  event,
                                  request.object_uid
                                )
                              }
                            >
                              <FileCopyRoundedIcon width={20} height={20} />
                              <Typography variant="body2"> clone </Typography>
                            </StyledMenuItems>
                          </Menu>
                        )}
                      <Box>
                        <Tooltip title={request?.name?.length > 20 ? request?.name : ''}>
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
                            {request?.name?.length > 20 ? request?.name?.substring(0, 20) + '...' : request?.name}
                          </Typography>
                        </Tooltip>
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
                            {/* {request?.priority_id} */}
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
                            {/* {request?.effort} */}
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
          // <Box
          //   style={{
          //     width: "100%",
          //     position: "sticky",
          //     top: "0px",
          //     background: "white",
          //     zIndex: 500,
          //     padding: "1rem 2rem 0rem 2rem",
          //   }}
          // >
          <>
            <Box
              sx={{
                marginBottom: "0.5rem",
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                padding: "0.5rem 0rem 0rem 1rem",
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
              <Typography variant="h3">
                {tabulationCardData?.name || ""}
              </Typography>
              {/* <Box
                sx={{
                  fontWeight: 400,
                  fontSize: "11px",
                  lineHeight: "140%",
                  textTransform: "capitalize",
                  color: "#9A8C00",
                }}
              >
                {mapRequestState((selectedJobAllData as any)?.status_id)}
              </Box> */}
            </Box>
            <DataTabulationPage
              projectId={projectId ? Number(projectId) : 1}
              objectId={objectId}
              JSONData={tabulationCardData}
            />
            {/* </Box> */}
          </>
        )}
      </Box>
    </>
  );
}

export default ProjectTabulationContainer;
