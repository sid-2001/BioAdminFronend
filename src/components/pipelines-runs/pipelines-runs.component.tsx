import { theme } from "@/constants/theme";
import { Box, Button, CircularProgress, FormControlLabel, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
// import AcUnitIcon from '@mui/icons-material/AcUnit';
import { PipelinesChart, PipelinesCleaning, PipelinesExports, PipelinesOthers, PipelinesTabulation, PipelinesValidation, PipelinesInsights, PipelinesOTA, PipelinesPPT, PipelinesDocParser, PipelinesFiltering, PipelinesPreProcessing } from "@/assets/images";
// import RunCircleOutlinedIcon from '@mui/icons-material/RunCircleOutlined';
// import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
// import BlockIcon from '@mui/icons-material/Block';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import FiberNewRoundedIcon from '@mui/icons-material/FiberNewRounded';
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNext';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import RefreshIcon from '@mui/icons-material/Refresh';
import { logger } from "@/helpers/logger";
// import { enqueueSnackbar } from "notistack";
import PublishedWithChangesRoundedIcon from '@mui/icons-material/PublishedWithChangesRounded';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import CancelScheduleSendRoundedIcon from '@mui/icons-material/CancelScheduleSendRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded';
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded';
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';


interface PipelinesRunsComponentProps {
    allRuns: any;
    GetpipelineDetails: (pipeline_id: number, run_id: string) => Promise<void>;
    allRunsByRunId: any;
    pipelineRun: () => Promise<void>;
    Getpipeline: (pipeline_id: number) => Promise<void>;
    PublishPipelineStatus: (pipeline_id: number, run_id: string) => Promise<void>;
    PipelineCancel: (pipeline_id: number, run_id: string) => Promise<void>;
    pipelineName: any;
    // PipelineGetFiles: (ProjecFileType: number) => Promise<void>;
    // downloadFiles: ProjectFiles[];
    // setDownloadFiles: React.Dispatch<React.SetStateAction<ProjectFiles[]>>;

    autoRefresh: boolean;
    setAutoRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}


const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 34,
    height: 18,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#8E27D7',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 14,
        height: 14,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));

const PipelinesRunsComponent: React.FC<PipelinesRunsComponentProps> = ({ allRuns, GetpipelineDetails,
    allRunsByRunId, pipelineRun, Getpipeline, PublishPipelineStatus, PipelineCancel, pipelineName, autoRefresh, setAutoRefresh }) => {
    // console.log(allRunsByRunId, "allRunsByRunIdallRunsByRunId", allRuns, allRuns[0]?.pipeline_id)
    // files dowmn
    const [currentObjectId, setCurrentObjectId] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any, id: number,) => {
        // console.log(fileId, "fileIdfileId")
        setAnchorEl(event.currentTarget);
        // PipelineGetFiles(fileId + 2)
        setCurrentObjectId(id)
    };
    const handleClose = () => {
        setAnchorEl(null);
        // setDownloadFiles([])
    };

    const navigate = useNavigate()
    const { projectId, surveyId } = useParams()
    const [logName, setLogName] = useState<any>()
    const [logData, setLogData] = useState<any>(null);

    const [load, setLoad] = useState(false)

    const scrollableListStyle = {
        maxHeight: 'calc(100vh - 410px)',
        overflowY: 'auto',
        // border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: '0.5rem',
    };

    // const getFileTypeIdsForJob = (jobTypeId: any) => {
    //     switch (jobTypeId) {
    //         case 2: return [4];
    //         case 3: return [5];
    //         case 4: return [6, 7];
    //         case 5: return [8, 9, 10];
    //         default: return [];
    //     }
    // };

    const runIcons = {
        1: PipelinesOthers,
        2: PipelinesCleaning,
        3: PipelinesValidation,
        4: PipelinesTabulation,
        5: PipelinesExports,
        6: PipelinesChart,
        7: PipelinesInsights,
        9: PipelinesOTA,
        10: PipelinesFiltering,
        11: PipelinesDocParser,
        12: PipelinesPPT,
        13: PipelinesPreProcessing,
        default: PipelinesOthers,
    };

    const liststatusicon = {
        1: <FiberNewRoundedIcon style={{ color: "lightgray" }} />,
        2: <QueuePlayNextIcon style={{ color: 'orange' }} />,
        3: <DirectionsRunIcon style={{ color: 'purple' }} />,
        4: <CheckCircleIcon style={{ color: 'green' }} />,
        5: <CancelIcon style={{ color: 'red' }} />,
        6: <DoDisturbIcon style={{ color: 'black' }} />,
        default: <DisabledByDefaultRoundedIcon style={{ color: 'gray' }} />
    };


    function formatDuration(durationMs: number) {
        // Calculate hours, minutes, and seconds
        const hours = Math.floor(durationMs / 3600000); // 3600000 milliseconds in 1 hour
        const remainingMs = durationMs % 3600000;
        const minutes = Math.floor(remainingMs / 60000); // 60000 milliseconds in 1 minute
        const seconds = Math.floor((remainingMs % 60000) / 1000); // 1000 milliseconds in 1 second

        // Create the formatted duration string
        let formattedDuration = '';

        if (hours > 0) {
            formattedDuration += `${hours}hr `;
        }

        if (minutes > 0 || hours > 0) {
            formattedDuration += `${minutes}m `;
        }

        if (seconds > 0 || (minutes === 0 && hours === 0)) {
            formattedDuration += `${seconds}s`;
        }

        return formattedDuration.trim();
    }

    function formatDuration1(durationMs: number) {
        const years = Math.floor(durationMs / (365 * 24 * 60 * 60 * 1000)); // Calculate years
        const remainingMsAfterYears = durationMs % (365 * 24 * 60 * 60 * 1000);
        const days = Math.floor(remainingMsAfterYears / (24 * 60 * 60 * 1000)); // Calculate days
        const remainingMsAfterDays = remainingMsAfterYears % (24 * 60 * 60 * 1000);
        const hours = Math.floor(remainingMsAfterDays / (60 * 60 * 1000)); // Calculate hours
        const remainingMsAfterHours = remainingMsAfterDays % (60 * 60 * 1000);
        const minutes = Math.floor(remainingMsAfterHours / (60 * 1000)); // Calculate minutes
        const seconds = Math.floor((remainingMsAfterHours % 60000) / 1000); // Calculate seconds

        let formattedDuration = '';
        if (years > 0) formattedDuration += `${years}yr `;
        if (days > 0 || years > 0) formattedDuration += `${days}d `;
        if (hours > 0 || days > 0 || years > 0) formattedDuration += `${hours}hr `;
        if (minutes > 0 || hours > 0 || days > 0 || years > 0) formattedDuration += `${minutes}m `;
        if (seconds > 0 || minutes === 0 && hours === 0 && days === 0 && years === 0) formattedDuration += `${seconds}s`;

        return formattedDuration.trim();
    }


    // useEffect(() => {
    //     // @ts-ignore
    //     PipelineGetFiles([4, 5, 6, 7, 8, 9, 10])
    // }, [allRuns])


    const initiateDownload = (url: string | URL | undefined) => {
        // This will open the file in a new tab and start the download
        window.open(url, '_blank');

        // Close the menu after initiating the download
        handleClose();
    };

    const GetpipelineAuto = async (id: number) => {
        if (id) {
            Getpipeline(id)
        }
    }

    useEffect(() => {
        let intervalId: any;
        if (autoRefresh && allRunsByRunId?.pipeline_id && (allRunsByRunId as any)?.pipeline_status_id != 4 && (allRunsByRunId as any)?.pipeline_status_id != 5) {
            intervalId = setInterval(() => {
                setLoad(true);
                GetpipelineAuto(allRunsByRunId?.pipeline_id);
                setTimeout(() => {
                    setLoad(false);
                }, 1000);

            }, 5000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }

        };
    }, [autoRefresh, allRunsByRunId?.pipeline_id]);





    useEffect(() => {
        if (allRuns[0]?.pipeline_id)
            GetpipelineDetails(allRuns[0]?.pipeline_id, allRuns[0]?.id)
    }, [allRuns])
    useEffect(() => {
        if (allRunsByRunId?.logs?.length > 0)
            setLogName(allRunsByRunId?.logs[0])
    }, [allRunsByRunId])

    useEffect(() => {
        const fetchLogData = async () => {
            if (logName?.log_file_url) {
                try {
                    const response = await fetch(logName?.log_file_url);
                    const data = await response.text();
                    setLogData(data);
                } catch (error) {
                    logger.error(error);
                }
            } else {
                setLogData("No logs generated");
            }
        };

        fetchLogData();
    }, [logName]);

    // console.log(allRunsByRunId, allRuns, "allRunsallRuns")

    // console.log(allRunsByRunId?.logs.filter((item) => item?.job_type_id == 4)[0]?.output_files[0]?.file_path, "allRunsByRunIdallRunsByRunId")

    return (
        <>
            {/* <ViewPublsihedData screen={publishedTabs} /> */}
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
                    onClick={() => {
                        navigate(`/projects/${projectId}/survey/${surveyId}/data/pipelines`)
                    }}
                >
                    <ArrowBackIcon width={16} height={16} />
                </IconButton>
                <Typography variant="h3">
                    {pipelineName}
                    {/* {(cardName as any)?.pipeline_name} */}
                </Typography>

            </Box>
            <Box style={{ padding: "0rem 2rem 0rem 2rem" }}>
                <Box style={{ padding: "1rem 0rem 0rem 0rem" }}>
                    {allRuns && allRuns ?
                        <Grid container spacing={2} style={{ height: "calc(100vh - 350px)", gap: "1rem", border: `1px solid ${theme.palette.grey[300]}`, borderRadius: "0.5rem" }}>
                            {allRuns && allRuns &&
                                <Grid item xs={3} style={{ borderRight: `1px solid ${theme.palette.grey[300]}` }}>
                                    <Box style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.palette.grey[300]}`, alignItems: "center" }}>
                                        <Typography variant="h6" sx={{ paddingLeft: "1rem", }}>  Runs    </Typography>
                                        <Button onClick={() => {
                                            pipelineRun()
                                            // setTimeout(() => {
                                            //     Getpipeline(allRuns[0]?.pipeline_id)
                                            // }, 500)
                                        }}>+ Runs</Button>
                                    </Box>
                                    {allRuns?.length > 0 ?
                                        <List sx={{ width: '100%', bgcolor: 'background.paper', ...scrollableListStyle }}>
                                            {allRuns && allRuns?.map((runs: {
                                                pipeline_status_id: number;
                                                is_published: any; id: any; pipeline_id: number; pipeline_run_name: any; status_name: any; start_time: string; end_time: string;
                                            }) => {
                                                // Convert start_time and end_time to Date objects
                                                const startTime = new Date(runs.start_time);
                                                const endTime = new Date(runs.end_time);

                                                // Calculate the duration in milliseconds
                                                // @ts-ignore
                                                const durationMs = endTime - startTime;

                                                // Convert duration to a formatted string (you can customize this format)
                                                const durationString = formatDuration(durationMs);

                                                return (
                                                    <ListItem
                                                        style={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, pointerEvents: runs?.pipeline_status_id == 6 ? "none" : "inherit", opacity: runs?.pipeline_status_id == 6 ? 0.4 : 1 }}
                                                        key={runs?.id}
                                                        onClick={() => GetpipelineDetails(runs?.pipeline_id, runs?.id)}
                                                        // secondaryAction={
                                                        //     <IconButton edge="end" aria-label="comments">
                                                        //         {/* <CommentIcon /> */}
                                                        //     </IconButton>
                                                        // }
                                                        disablePadding
                                                    >
                                                        <ListItemButton role={undefined} dense>
                                                            <ListItemIcon>
                                                                <Tooltip title={(runs as any)?.job_status_name} placement="right">
                                                                    {(liststatusicon as any)[(runs as any).pipeline_status_id]}
                                                                </Tooltip>
                                                                {/* <AcUnitIcon color="primary" /> */}
                                                            </ListItemIcon>
                                                            <div style={{ display: "flex", flex: 1, justifyContent: "space-between" }}>
                                                                <ListItemText id={""} primary={`${runs?.pipeline_run_name}`} style={{ width: "50%" }} />
                                                                <ListItemText id={""} primary={runs.start_time && runs.end_time && (runs as any).pipeline_status_id != 3 ? `${durationString}` : ((runs as any).pipeline_status_id == 3 && (new Date().getTime() - startTime.getTime()) > 0) ? formatDuration1(new Date().getTime() - startTime.getTime()) : '-'} />
                                                                {runs?.is_published ?
                                                                    <>
                                                                        <Tooltip title={"Published"} placement="left"><div> <PublishedWithChangesRoundedIcon style={{ display: runs?.pipeline_status_id == 6 ? "none" : "inherit", color: "green" }} /> </div></Tooltip>
                                                                    </>
                                                                    : <Tooltip title={"Unpublished"} placement="left">
                                                                        <div>
                                                                            <PublishRoundedIcon style={{ display: runs?.pipeline_status_id == 4 ? "inherit" : "none", color: "grey" }} onClick={(event: any) => {
                                                                                event?.stopPropagation()
                                                                                PublishPipelineStatus(runs?.pipeline_id, runs?.id)
                                                                                // setTimeout(() => {
                                                                                Getpipeline(allRuns[0]?.pipeline_id)
                                                                                // }, 500)
                                                                            }} />
                                                                        </div>
                                                                    </Tooltip>}
                                                                {runs && (runs as any)?.pipeline_status_id == 1 &&
                                                                    <CancelScheduleSendRoundedIcon style={{ color: "red", marginLeft: "1rem" }}
                                                                        onClick={(event: any) => {
                                                                            event?.stopPropagation()
                                                                            PipelineCancel(runs?.pipeline_id, runs?.id)
                                                                            setTimeout(() => {
                                                                                Getpipeline(allRuns[0]?.pipeline_id)
                                                                            }, 500)
                                                                        }}
                                                                    />
                                                                }

                                                            </div>
                                                        </ListItemButton>
                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                        :
                                        <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }} >
                                            No runs available
                                        </Box>
                                    }
                                </Grid>
                            }
                            {allRunsByRunId && allRunsByRunId &&
                                <Grid item xs={3} style={{ paddingLeft: "0px", borderRight: `1px solid ${theme.palette.grey[300]}` }}>
                                    <Box style={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, display: "flex", justifyContent: "space-between", padding: "0rem 1rem 0.5rem 1rem" }}>
                                        {/* <Tooltip title={allRunsByRunId?.status_name} placement="right"> */}
                                        <Typography sx={{ paddingLeft: "0rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "1rem" }}><span>{(liststatusicon as any)[(allRunsByRunId as any)?.pipeline_status_id]} </span> {allRunsByRunId?.pipeline_run_name}</Typography>
                                        {/* </Tooltip> */}
                                        {/* <Typography sx={{ paddingLeft: "1rem", fontWeight: "bold" }}> {allRunsByRunId?.status_name}</Typography> */}
                                        <Box style={{ display: "flex", alignItems: "center", }}>
                                            {((allRunsByRunId as any)?.pipeline_status_id == 4 || (allRunsByRunId as any)?.pipeline_status_id == 5) &&
                                                <Tooltip title={"Check data"} placement="top"><div> <ViewInArRoundedIcon onClick={() => navigate(`/projects/${projectId}/survey/${surveyId}/data/pipelines/${allRunsByRunId?.pipeline_id}/runs/${allRunsByRunId?.id}`)}
                                                    style={{ cursor: "pointer", display: allRunsByRunId?.pipeline_status_id == 6 ? "none" : "inherit", color: "green", marginRight: "1rem" }} /> </div></Tooltip>
                                            }
                                            {load && (allRunsByRunId as any)?.pipeline_status_id != 4 && (allRunsByRunId as any)?.pipeline_status_id != 5 && <CircularProgress size='small' style={{ height: "1.5rem", width: "1.5rem", marginRight: "0.5rem" }} />}
                                            {(allRunsByRunId as any)?.pipeline_status_id != 4 && (allRunsByRunId as any)?.pipeline_status_id != 5 &&
                                                <FormControlLabel disabled={allRunsByRunId?.length <= 0} style={{ margin: "0px", color: '#8E27D7', marginLeft: load ? "0px" : "2rem" }}
                                                    control={<IOSSwitch size="small" sx={{ marginLeft: 1 }} checked={autoRefresh} onClick={() => setAutoRefresh(!autoRefresh)} />}
                                                    label="Auto-refresh" labelPlacement="start"

                                                />
                                            }
                                            {(allRunsByRunId as any)?.pipeline_status_id != 4 && (allRunsByRunId as any)?.pipeline_status_id != 5 &&
                                                <Tooltip title={'Refresh'} placement="top">
                                                    <RefreshIcon onClick={() => Getpipeline(allRunsByRunId?.pipeline_id)} style={{ cursor: allRunsByRunId?.length <= 0 ? 'auto' : "pointer", color: allRunsByRunId?.length <= 0 ? 'grey' : '#8E27D7', width: "24px !important", height: "24px", marginLeft: "0.5rem" }} />
                                                </Tooltip>
                                            }
                                        </Box>
                                    </Box>
                                    {/* <Typography variant="h6" sx={{ paddingLeft: "1rem", }}> Logs</Typography> */}
                                    <List sx={{ width: '100%', bgcolor: 'background.paper', ...scrollableListStyle }}>
                                        {allRunsByRunId && allRunsByRunId?.logs && allRunsByRunId?.logs
                                            // .sort((a: { id: number; }, b: { id: number; }) => a.id - b.id)
                                            .map((runs: {
                                                pipeline_run_id: any;
                                                output_files: [];
                                                output_file_url: any;
                                                status_id: number; id: React.Key | null | undefined; job_name: any; status_reason: any;
                                            }) => {
                                                const startTime = new Date((runs as any).start_time);
                                                const endTime = new Date((runs as any).end_time);

                                                // Calculate the duration in milliseconds
                                                // @ts-ignore
                                                const durationMs = endTime - startTime;

                                                // Convert duration to a formatted string (you can customize this format)
                                                const durationString = formatDuration(durationMs);
                                                // console.log(runs, "output_filesoutput_files")

                                                // const filteredFiles = downloadFiles?.filter(file => getFileTypeIdsForJob((runs as any).job_type_id).includes(file.filetype_id)) || [];

                                                // const getFileUrls = (outputFileUrl: string) => {
                                                //     return outputFileUrl.split('|');
                                                // };

                                                // console.log((runs as any)?.status_id == 3 ? (new Date() - new Date(runs.start_time)) : 'no', "(new Date() - new Date(runs.start_time))")
                                                return (
                                                    <ListItem
                                                        style={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, pointerEvents: runs?.status_id == 6 ? "none" : "inherit", opacity: runs?.status_id == 6 ? 0.4 : 1 }}
                                                        key={runs?.id}
                                                        onClick={() => setLogName(runs)}
                                                        // secondaryAction={
                                                        //     <IconButton edge="end" aria-label="comments">
                                                        //         {/* <CommentIcon /> */}
                                                        //     </IconButton>
                                                        // }
                                                        disablePadding
                                                    >
                                                        <ListItemButton role={undefined} dense>
                                                            <ListItemIcon>
                                                                {/* <Tooltip title={runs?.status_reason} placement="right"> */}
                                                                <img src={(runIcons as any)[(runs as any)?.job_type_id]} width="28px !important" height="28px !important" />
                                                                {/* </Tooltip> */}
                                                                {/* <AcUnitIcon color="primary" /> */}
                                                                {/* {runs?.job_type_id} */}
                                                            </ListItemIcon>
                                                            <div style={{ display: "flex", flex: 1, justifyContent: "space-between", gap: "1rem" }}>
                                                                <ListItemText id={""} primary={`${runs?.job_name}`} style={{ width: "40%" }} />
                                                                <ListItemText id={""} primary={(runs as any).start_time && (runs as any).end_time && (runs as any).status_id != 3 ? `${durationString}` : ((runs as any).status_id == 3 && (new Date().getTime() - startTime.getTime()) > 0) ? formatDuration1(new Date().getTime() - startTime.getTime()) : '-'} />

                                                                <Tooltip title={runs?.status_reason} placement="right">
                                                                    {(liststatusicon as any)[(runs as any).pipeline_status_id || (runs as any).status_id]}
                                                                    {/* {(statusicon as any)[(runs as any).status_id]} */}
                                                                </Tooltip>
                                                            </div>

                                                            <div>
                                                                <DownloadForOfflineRoundedIcon style={{ display: ((runs?.status_id == 4 || runs?.status_id == 5) && runs?.output_files?.length > 0) ? "inherit" : "none", marginLeft: "1rem", color: "#4CAF50" }}
                                                                    onClick={(e) => handleClick(e, (runs as any)?.id)}
                                                                />
                                                                {open && currentObjectId == runs?.id && (
                                                                    <Menu
                                                                        id="basic-menu"
                                                                        anchorEl={anchorEl}
                                                                        open={open}
                                                                        onClose={handleClose}
                                                                        MenuListProps={{
                                                                            'aria-labelledby': 'basic-button',
                                                                        }}
                                                                    >
                                                                        {runs?.output_files ?
                                                                            runs?.output_files?.map((url, index) => (
                                                                                <MenuItem key={index} onClick={() => initiateDownload((url as any)?.file_path)}>
                                                                                    {(url as any)?.file_name}
                                                                                </MenuItem>
                                                                            ))
                                                                            :
                                                                            <MenuItem onClick={handleClose} style={{ color: "red" }}>No files found</MenuItem>
                                                                        }

                                                                    </Menu>
                                                                )}
                                                            </div>
                                                        </ListItemButton>
                                                    </ListItem>
                                                )
                                            })}
                                    </List>
                                </Grid>
                            }
                            {logName &&
                                <Grid item xs={5.65} style={{ paddingLeft: "0px", }}>
                                    <Box style={{ display: "flex", alignItems: "center", padding: "0rem 0rem 0.5rem 0rem", borderBottom: `1px solid ${theme.palette.grey[300]}`, }}>
                                        <img src={(runIcons as any)[(logName as any)?.job_type_id]} width="28px" height="28px" />
                                        <Typography sx={{ paddingLeft: "0.5rem", fontWeight: "bold" }}>{logName?.job_name} </Typography>
                                    </Box>
                                    <Box
                                        style={{
                                            padding: "1rem 2rem 2rem 2rem",
                                            maxHeight: "calc(100vh - 405px)",
                                            height: "100%",
                                            overflowY: "auto", backgroundColor: "black", color: "white"
                                        }}
                                    >
                                        <Typography style={{ fontFamily: "monospace", whiteSpace: "pre-wrap", }} >
                                            {logData}

                                        </Typography>
                                    </Box>
                                </Grid>
                            }
                        </Grid>
                        : null
                    }
                </Box>

            </Box >
        </>
    )
}

export default PipelinesRunsComponent;