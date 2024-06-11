// import AddCard from "@/components/add-card";
import Card from "@/components/card";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  IconButton,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import { GridContainerProject } from "@/styles/grid";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import InfoIcon from "@mui/icons-material/Info";
// import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
// import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { ProjectDataService } from "@/services/project-data.services";
import LoadingSpinner from "@/components/loader";
import { QuestionBanner, data_banner_plan_item } from "@/types/project-data.type";
import AddCard from "@/components/add-card";
import DynamicCreateBannerPlanner from "@/components/dynamic-create-banner-planner";
import ViewEditDynamicBannerPlanner from "@/components/view-edit-banner/view-edit-banner.component";
import { StyledMenuItems } from "../tabulation/tabulation.style";
import FileCopyRoundedIcon from '@mui/icons-material/FileCopyRounded';
import { logger } from "@/helpers/logger";
// import { data_banner_plan_item } from "@/components/dynamic-tabulation-rapper/dynamic-tabulation-rapper.type";
// import DummyData from "./new.json"
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

const initialData: data_banner_plan_item = {
  name: '',
  confidence_level: 1,
  ui_payload: [],
  data_payload: [],
};


function BannerPlannerContainer() {
  const service = new ProjectDataService();
  const [requests, setRequests] = useState<data_banner_plan_item[] | []>([]);
  const [loading, setLoading] = useState(false)
  const { projectId, surveyId } = useParams();
  const [viewMode, setViewMode] = useState(false);
  const [tabulationCardData, setTabulationCardData] = useState<data_banner_plan_item>(initialData);
  const [showDialog, setShowDialog] = useState(false);
  const [questionList, setQuestionList] = useState<QuestionBanner[]>([])

  const [downloadEl, setDownloadEl] = useState<null | HTMLElement>(null)
  const [currentObjectId, setCurrentObjectId] = useState<string | null>(null);

  const openDownloadOptions = Boolean(downloadEl)


  const [bannerStatus, setBannerStatus] = useState<boolean>(false);

  const ChangeStatus = async (status: boolean) => {
    setLoading(true)
    if (projectId && surveyId && tabulationCardData?.id) {
      try {
        const data = await service.BannerActive(Number(projectId), Number(surveyId), Number(tabulationCardData?.id), status)
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


  const handleDownloadOptionsClick = (
    event: React.MouseEvent<HTMLButtonElement>, objectUid: string
  ) => {
    event.stopPropagation()
    setDownloadEl(event.currentTarget)
    setCurrentObjectId(objectUid);
  }

  const handleDownloadOptionsClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setDownloadEl(null)
  }

  const handleDetailsOptionsClose = (event: React.MouseEvent<HTMLButtonElement>, objectUid: string) => {
    event.stopPropagation()
    // setDisableState(true)
    // setShowDialog(true)
    getALLBannersById(objectUid, false)
    setDownloadEl(null)
    // navigate(`/projects/${project.project_id}/overview`)
  }


  const handleCloneOptionsClose = (event: React.MouseEvent<HTMLButtonElement>, objectUid: string) => {
    event.stopPropagation();
    setDownloadEl(null);
    // setShowDialog(true)
    // setCloneMode(true);
    getALLBannersById(objectUid, true);
  };


  function openMainDialog() {
    setShowDialog(true);
  }

  // function closeMainDialog() {
  //   setShowDialog(false);
  // }

  async function PostDataBanner(payload: data_banner_plan_item) {
    console.log("Posting payload:", payload);
    setLoading(true)
    if (projectId && surveyId)
      try {
        const data = await service.postBanner(Number(projectId), Number(surveyId), payload);
        if (data) {
          getAllTabulationData()
          enqueueSnackbar(
            <Typography variant="body1">Banner Planner Create Successfully.</Typography>,
            {
              variant: "success",
            }
          );
        }
      } catch (error) {
        console.error("Error posting data:", error);
        enqueueSnackbar(
          <Typography variant="body1">Adding Banner requests failed</Typography>,
          {
            variant: "error",
          }
        );
      } finally {
        setLoading(false)
      }
  }

  async function PutDataBanner(banner_planner_id: string, payload: data_banner_plan_item) {
    console.log("Posting payload:", payload);
    setLoading(true)
    if (projectId && surveyId)
      try {
        const data = await service.putBanner(Number(projectId), Number(surveyId), String(banner_planner_id), payload);
        if (data?.ui_payload?.length > 0) {
          getAllTabulationData()
          enqueueSnackbar(
            <Typography variant="body1">Banner Planner Updated Successfully.</Typography>,
            {
              variant: "success",
            }
          );
        }
      } catch (error) {
        console.error("Error posting data:", error);
        enqueueSnackbar(
          <Typography variant="body1">Adding Banner requests failed</Typography>,
          {
            variant: "error",
          }
        );
      } finally {
        setLoading(false)
      }
  }

  async function getAllTabulationData() {
    setLoading(true)

    try {
      const data = await service.getALLBanners(Number(projectId), Number(surveyId));
      setRequests(data);
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">Fetching requests failed</Typography>,
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false)
    }
  }

  // async function GetProjectBannerALLQuestions() {
  //   setLoading(true)

  //   try {
  //     const data = await service.getProjectBannerALLQuestions(Number(projectId));
  //     if (data?.length > 0) {

  //       const updatedData = data?.map((item, index) => ({
  //         ...item,
  //         question_value: index + 1
  //       }))
  //       // @ts-ignore
  //       setQuestionList(updatedData);
  //     }
  //   } catch (error) {
  //     enqueueSnackbar(
  //       <Typography variant="body1">Fetching questions failed</Typography>,
  //       {
  //         variant: "error",
  //       }
  //     );
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  async function GetProjectBannerALLQuestions() {
    setLoading(true);

    try {
      const data = await service.getProjectBannerQuestions(Number(projectId), Number(surveyId))
      // const data = DummyData
      if (data?.length > 0) {
        const excludedTypes = ['quantity', 'date', 'time', 'opentext', 'opentextlist', 'numericlist'];

        // const filteredData = data.filter(item =>
        //   !excludedTypes.includes(item.question_type_name)
        // );
        // question_variable_type

        const filteredData = data.filter(item =>
          !excludedTypes.includes(item.question_type_name) && item.question_variable_type !== 'HIDDEN'
        );


        const updatedData = filteredData.map((item) => ({
          ...item,
          // question_value: index + 1
          question_value: item.question_variable_id
        }));

        // console.log(filteredData, updatedData, "filteredDatafilteredData")
        setQuestionList(updatedData);
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

  function enqueueErrorSnackbar(message: string) {
    enqueueSnackbar(
      <Typography variant="body1">{message}</Typography>,
      {
        variant: "error",
      }
    );
  }


  async function getALLBannersById(banner_planner_id: string, cloneMode: boolean) {
    // console.log(tabulationCardData, "getdatagetdatagetdatagetdatagetdatagetdatagetdatagetdatagetdatagetdata")

    setLoading(true)
    if (projectId && surveyId && banner_planner_id)
      try {
        const data = await service.getALLBannersById(Number(projectId), Number(surveyId), String(banner_planner_id));
        console.log(data, "dataqwert")

        if (!data) {
          enqueueErrorSnackbar('No tabulation found')
          return
        }
        if (!cloneMode) {
          setTabulationCardData(data);
          setViewMode(true)
        } else {
          setTabulationCardData(data);
          openMainDialog()
        }


      } catch (error) {
        enqueueSnackbar(
          <Typography variant="body1">Fetching requests failed</Typography>,
          {
            variant: "error",
          }
        );
      } finally {
        setLoading(false)
      }
  }

  useEffect(() => {
    if (projectId && surveyId) {
      getAllTabulationData();
    }
  }, [projectId, surveyId]);


  useEffect(() => {
    if (projectId && surveyId) {
      GetProjectBannerALLQuestions()
    }
  }, [projectId, surveyId]);

  useEffect(() => {
    setViewMode(false)
  }, [surveyId])

  // console.log(tabulationCardData, "tabulationCardData", questionList)

  return (
    <>
      {loading ? <LoadingSpinner /> : null}

      <DynamicCreateBannerPlanner
        // @ts-ignore
        questionLists={questionList} showDialog={showDialog} setShowDialog={setShowDialog} PostDataBanner={PostDataBanner} tabulationCardData={tabulationCardData} />

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
                alignItems: "center"
              }}
            >
              <Typography variant="h6" sx={{}}>
                Banner Planner
              </Typography>

            </Box>
            <Box sx={{ padding: "0rem 2rem 0rem 2rem" }}>
              <GridContainerProject style={{ marginBottom: "2rem" }}>
                <Box onClick={() => {
                  // setViewMode(false)
                }
                }>
                  <AddCard
                    handleClick={openMainDialog}
                    height={"170px"}
                    width={"300px"}
                  />
                </Box>
                {requests && requests?.map((request: any, i) => {
                  return (
                    <Card
                      onClick={() => {
                        getALLBannersById(request?.object_uid, false);
                        setBannerStatus(request?.is_active)
                      }}
                      key={`${i}`}
                      disable={!request?.is_active}
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
                            {/* {request.status_id
                              ? mapRequestState(request.status_id)
                              : request?.status_name} */}
                            {/* {request?.status_name} */}
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
                          onClick={(e) => {
                            handleDownloadOptionsClick(e, request.object_uid)
                            setBannerStatus(request?.is_active)
                          }
                          } // Pass the object_uid
                        >
                          <MoreHorizOutlinedIcon sx={{ color: "#9C9C9C" }} />
                        </IconButton>
                      </Box>
                      {
                        openDownloadOptions &&
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
                              onClick={(e: any) =>
                                handleDetailsOptionsClose(
                                  e,
                                  request?.object_uid
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
                        )
                      }
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
                          {request?.name}
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
        ) :
          (
            <>
              <ViewEditDynamicBannerPlanner
                // @ts-ignore
                questionLists={questionList} PutDataBanner={PutDataBanner} Banner_planner_data={tabulationCardData} setView={setViewMode}
                bannerStatus={bannerStatus}
                setBannerStatus={setBannerStatus}
                ChangeStatus={ChangeStatus}
              />
            </>
          )}
      </Box >
    </>
  );
}

export default BannerPlannerContainer;
