import { Box, IconButton, Menu, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GridContainerProject } from "@/styles/grid";
import AddCard from "@/components/add-card";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { StyledMenuItems } from "../tabulation/tabulation.style";
import InfoIcon from "@mui/icons-material/Info";
import { enqueueSnackbar } from "notistack";
import { ProjectDataService } from "@/services/project-data.services";
import Card from "@/components/card";
// import RunCircleRoundedIcon from '@mui/icons-material/RunCircleRounded';
import LoadingSpinner from "@/components/loader";

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

const ProjectVisualizationsContainer = () => {
    const { projectId, surveyId } = useParams();
    const projectDataService = new ProjectDataService();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [downloadEl, setDownloadEl] = useState<null | HTMLElement>(null);
    const [currentObjectId, setCurrentObjectId] = useState<string | null>(null);


    const openDownloadOptions = Boolean(downloadEl);
    const handleDownloadOptionsClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        objectUid: string
    ) => {
        event.stopPropagation();
        setDownloadEl(event.currentTarget);
        setCurrentObjectId(objectUid);
    };

    const handleDownloadOptionsClose = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation();
        setDownloadEl(null);
    };


    const handleDetailsOptionsClose = (
        event: React.MouseEvent<HTMLButtonElement>,
        request: any,
    ) => {
        event.stopPropagation();
        navigate(`/projects/${projectId}/survey/${surveyId}/data/data-visualization/${request?.id}/update`, { state: request?.is_active })
        setDownloadEl(null);
    };

    // const handleRunPipelines = (
    //     event: React.MouseEvent<HTMLButtonElement>,
    //     id: string
    // ) => {
    //     event.stopPropagation();
    //     pipelineRun(Number(id));
    //     setDownloadEl(null);
    // };


    const handleGetPipelinesDetails = (
        request: any
    ) => {
        // event.stopPropagation();
        // navigate(`/projects/${projectId}/survey/${surveyId}/data/pipelines/${request?.id}/runs`,
        //     {
        //         state: {
        //             id: request?.id,
        //             name: request?.pipeline_name,
        //         },
        //     }
        // )
        navigate(`/projects/${projectId}/survey/${surveyId}/data/data-visualization/${request?.id}/update`, { state: request?.is_active })
        setDownloadEl(null);
    };


    async function getAllPipelinesData() {
        setLoading(true);

        try {
            const data = await projectDataService.GetAllVisualizations(Number(projectId), Number(surveyId));
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

    useEffect(() => {
        if (projectId && surveyId) {
            setTimeout(() => {
                getAllPipelinesData();
            }, 100)
        }
    }, [projectId, surveyId]);

    return (
        <>
            {loading ? <LoadingSpinner /> : null}
            <Box
                sx={{ flex: "1", overflow: "scroll" }}
                style={{
                    background: "white",
                    borderRadius: "12px",
                    height: "calc(100vh - 273px)",
                    width: "100%",
                }}
            >
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
                        Visualizations
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
                                handleClick={() => navigate(`/projects/${projectId}/survey/${surveyId}/data/data-visualization/new`)}
                                height={"170px"}
                                width={"300px"}
                            />
                        </Box>
                        {requests?.map((request: any, i) => {
                            return (
                                <Card
                                    onClick={() => {
                                        // navigate(`/projects/${projectId}/data/pipelines/${request?.id}/update`, {
                                        //     state: {
                                        //         id: request?.id,
                                        //         supplierName: request?.name,
                                        //     },
                                        // })
                                        handleGetPipelinesDetails(request)
                                        // setCardName(request)
                                        //   getTabulationDataById(request?.object_uid, false)
                                    }}
                                    key={`${i}`}
                                    // style={{ cursor: "pointer" }}
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
                                            // padding: "1rem"
                                            // padding: "16px 16px 8px 16px",
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
                                                {request?.is_active ? 'Active' : 'Inactive'}
                                                {/* {mapRequestState(request.status_id)} */}
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
                                                handleDownloadOptionsClick(e, request.id)

                                            }
                                            } // Pass the object_uid
                                        >
                                            {/* <MoreHorizIcon width={10} height={10} /> */}
                                            <MoreHorizOutlinedIcon sx={{ color: "#9C9C9C" }} />
                                        </IconButton>
                                    </Box>
                                    {/* {openDownloadOptions && downloadEl === request.object_uid && ( // Only open the menu for the correct card */}
                                    {openDownloadOptions &&
                                        currentObjectId === request?.id && (
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
                                                    onClick={(event: any) => {
                                                        // setPipelineStatus(request?.is_active)
                                                        handleDetailsOptionsClose(event, request)
                                                    }
                                                    }
                                                >
                                                    <InfoIcon width={20} height={20} />
                                                    <Typography variant="body2">
                                                        {" "}
                                                        Configurations{" "}
                                                    </Typography>
                                                </StyledMenuItems>

                                                {/* <StyledMenuItems
                                                    onClick={(event: any) => handleRunPipelines(event, request.id)}
                                                >
                                                    <RunCircleRoundedIcon width={20} height={20} />
                                                    <Typography variant="body2">
                                                        {" "}
                                                        Run Pipeline
                                                    </Typography>
                                                </StyledMenuItems> */}
                                            </Menu>
                                        )}
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
                                                // paddingLeft: "1rem",
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
                                                // paddingLeft: "1rem",
                                            }}
                                            variant="body1"
                                            dangerouslySetInnerHTML={{
                                                __html: request?.description,
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
            </Box>
        </>
    );
};

export default ProjectVisualizationsContainer;
