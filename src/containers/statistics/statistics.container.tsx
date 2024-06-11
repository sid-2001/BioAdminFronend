

// @ts-ignore
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
// import { BarChart } from '@mui/x-charts/BarChart';
import React, { useCallback, useEffect, useState } from 'react';
import { Box, IconButton, Menu, Stack, Tooltip, Typography, MenuItem, Button } from '@mui/material';
import { theme } from '@/constants/theme';
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import { FileDownloadIcon, FillIcon, GuageChartIcon, RefreshIcon } from '@/assets/images';
// import { ConfigService } from '@/services/config-cleaning';
import { useSnackbar } from 'notistack';
import { useParams } from "react-router-dom"
import LoadingSpinner from '@/components/loader';
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded';
import { useOutletContext } from "react-router"
// import { SettingsOutlined } from "@mui/icons-material"
// import StatisticsBarChartComponent from '@/components/statistics-bar-chart/statistics-bar-chart.component';
import StatisticsDonutChartComponent from '@/components/statistics-donut-chart/statistics-donut-chart.component';
import MultilineChartIcon from '@mui/icons-material/MultilineChart';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded';
import StatisticsGuageChartComponent from '@/components/statistics-guage-chart';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import moment from 'moment';
import { ProjectDataService } from '@/services/project-data.services';
import StatisticsBarChartComponentNoFilters from '@/components/statistics-bar-chart-no-filters/statistics-bar-chart.component';
// am4core.useTheme(am4themes_animated);
import StackedBarChartRoundedIcon from '@mui/icons-material/StackedBarChartRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import StatisticsStackedColumnChartComponent from '@/components/statistics-stacked-column-chart';
import StatisticsStackedBarChartComponent from '@/components/statistics-stacked-bar-chart';
import StatisticsPieChartsComponent from '@/components/statistics-pie-charts';
// import DummyData from "./stackedData.json"
interface Answer {
  answer_code: string;
  answer_label: string;
  count: number;
};

interface QuestionType {
  question_id: string;
  question_label: string;
  type: string;
  answer: Answer[];
  chart_type: string;
}

type ProjectData = {
  project_id: number;
  questions: QuestionType[];
};

const StatisticsContainer = () => {
  // const chartRefs = useRef({});
  let { projectId, surveyId, pipelineId, runId } = useParams()
  // const navigate = useNavigate()

  const [loading, setLoading] = useState(true)

  const [chartsData, setChartsData] = useState<ProjectData>()
  // const chartsService = new ConfigService()
  const { enqueueSnackbar } = useSnackbar()
  const projectDataServices = new ProjectDataService()

  const { dataExportConfig, outputFiles } = useOutletContext<any>()

  // outputfiles123
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    // setDownloadFiles([])
  };

  const initiateDownload = (url: string | URL | undefined) => {
    // This will open the file in a new tab and start the download
    window.open(url, '_blank');

    // Close the menu after initiating the download
    handleClose();
  };

  function refreshData() {
    let service = new ProjectDataService()
    service.refreshDataRequest(Number(projectId))
  }


  async function getConfigData() {
    // setChartsData(DummyData)
    setLoading(true)
    if (projectId && surveyId && pipelineId && runId) {
      try {
        // const jobLogs = allRunsByRunId?.logs?.filter((item: { job_type_id: number }) => item?.job_type_id == 6)
        // const filePath = jobLogs?.[0]?.output_files?.[0]?.file_path;
        // console.log(filePath, allRunsByRunId?.logs.filter((item) => item?.job_type_id == 6)[0]?.output_files[0]?.file_path, "allRunsByRunIdallRunsByRunId")
        // = await chartsService.getConfigChartsByprojectId(projectId)
        // const file = `https://bbqastorage.blob.core.windows.net/account-1/p/p-109/dp/319/dch-319/dch-319-output.json`

        const datafile = await projectDataServices.GetOutPutFileByJobId(Number(projectId), Number(surveyId), Number(pipelineId), Number(runId), 6)

        // console.log(datafile?.output_path, "datadata")

        if (datafile?.output_path) {
          const response = await fetch(datafile?.output_path);
          const jsonData = await response.json()
          // console.log(response, "response", jsonData)
          setChartsData(jsonData)
        } else {
          enqueueSnackbar("No data found", {
            variant: "error",
          })
        }

      } catch (error) {
        enqueueSnackbar("Failed in fetching data", {
          variant: "error",
        })
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  // fullscreen
  const [fullViewMode, setFullViewMode] = useState(false)
  const [chartTypes, setChartTypes] = useState({});

  const screen1 = useFullScreenHandle()
  // const screen2 = useFullScreenHandle();

  const reportChange = useCallback(
    (state: any, handle: any) => {
      if (handle === screen1) {
        setFullViewMode(state)
      }
    },
    [screen1],
  )
  const [width, setWidth] = useState(fullViewMode ? window.innerWidth : window.innerWidth - 200);

  // const questionsWithAnswers = chartsData && chartsData?.questions?.filter((question: any) => (question?.answer && question?.answer.length > 0 || question?.answers && question?.answers.length > 0 || question?.variables && question?.variables.length > 0));
  const questionsWithAnswers = chartsData && chartsData?.questions?.filter((question: any) => ((question?.answer && question?.answer.length > 0 && (question.type == 'single' || question.type == 'multi')) || (question?.answers && question?.answers.length > 0 && (question.type == 'single' || question.type == 'multi')) || (question?.variables && question?.variables.length > 0 && question.type == 'grid')));

  // const layout = questionsWithAnswers?.map((_questions, index) => ({
  //   i: `item${index}`,
  //   // @ts-ignore
  //   x: index % 2,
  //   // @ts-ignore
  //   y: Math.floor(index / 2) * 2,
  //   w: 1,
  //   h: 3,
  // }));

  const layout = questionsWithAnswers?.map((_question, index) => {
    const isFullWidthChart = (chartTypes as any)[index] === 'stacked-column' || (chartTypes as any)[index] === 'stacked-bar';
    return {
      i: `item${index}`,
      x: isFullWidthChart ? 0 : index % 2,
      y: Math.floor(index / 2) * 2,
      w: isFullWidthChart ? 2 : 1,
      h: isFullWidthChart ? 4 : 3,
      minW: isFullWidthChart ? 2 : 1,
    };
  });

  // console.log(4 % 3, "MathMath")
  // console.log(Math.floor(4 / 3) * 2, "MathMath")

  const onLayoutChange = (newLayout: any) => {
    console.log(newLayout, "newLayoutnewLayout");
  };

  const changeChartType = (index: number, chartType: string) => {
    setChartTypes((prev) => ({ ...prev, [index]: chartType }));
  };
  // Initialize chart types
  useEffect(() => {
    if (questionsWithAnswers) {
      const initialChartTypes = questionsWithAnswers && questionsWithAnswers?.reduce((acc, question, index) => {
        if (question.chart_type == 'bar') {
          (acc as any)[index] = 'bar'
        } else if (question.chart_type == 'pie') {
          (acc as any)[index] = 'pie'
        } else if (question.chart_type == 'donut') {
          (acc as any)[index] = 'donut'
        } else if (question.chart_type == 'stacked-column') {
          (acc as any)[index] = 'stacked-column'
        } else if (question.chart_type == 'stacked-bar') {
          (acc as any)[index] = 'stacked-bar'
        }

        else if (question.type == 'single') {
          (acc as any)[index] = 'bar'
        } else if (question.type == 'multi') {
          (acc as any)[index] = 'pie'
        } else if (question.type == 'grid') {
          (acc as any)[index] = 'stacked-column'
        }
        // else {
        //     (acc as any)[index] = 'bar'
        // }
        return acc;
      }, {});
      setChartTypes(initialChartTypes);
    }
  }, [chartsData]);


  useEffect(() => {
    const handleResize = () => {
      setWidth(fullViewMode ? window.innerWidth : window.innerWidth - 200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {

    // let tabUrl =
    //   allRunsByRunId?.logs?.filter((item: { job_type_id: number }) => item?.job_type_id == 6)[0] &&
    //   allRunsByRunId?.logs?.filter((item: { job_type_id: number }) => item?.job_type_id == 6)[0]?.output_files &&
    //   allRunsByRunId?.logs?.filter((item: { job_type_id: number }) => item?.job_type_id == 6)[0]?.output_files[0]?.file_path
    // if (tabUrl) {
    //   getConfigData(tabUrl)
    // } else {
    //   setLoading(false)
    // }

    getConfigData()
  }, [projectId, surveyId, pipelineId, runId])

  // console.log(chartTypes, "chartsDatachartsDatachartsDatachartsDatachartsData", questionsWithAnswers, chartsData)

  return (
    <>
      {loading ? <LoadingSpinner /> : null}
      <FullScreen handle={screen1} onChange={reportChange}>
        <div id={fullViewMode ? "bodyBackground" : "bodyBackground"}
          style={{
            padding: fullViewMode ? '1rem' : "0rem", background: fullViewMode ? "white" : "none",
          }}
        // style={{ height: fullViewMode ? '100vh' : 'calc(100vh - 243px)', width: fullViewMode ? "100vw" : 'calc(100vw - 120px)', overflowY: 'scroll' }}
        >
          <Box
            style={{
              width: "100%",
              display: "flex",
              // marginBottom: "1rem",
              justifyContent: "space-between",
              alignItems: "flex-start",
              background: fullViewMode ? "white" : "none",

            }}
          >
            <Stack direction='row' alignItems='center' spacing={2}>
              <Typography variant='h6'>Data Charts</Typography>
              <Stack direction='row' alignItems='center' spacing={1} style={{ display: "none" }} >
                <IconButton size='small' onClick={refreshData}  >
                  <img src={RefreshIcon} height='18px' />
                </IconButton>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: theme.palette.grey[600],
                  }}
                >
                  {/* 2h ago */}
                  {moment(dataExportConfig?.published_time).fromNow()}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction='row' alignItems='center' spacing={2}>
              <IconButton size='small' onClick={(e) => handleClick(e)}>
                <img src={FileDownloadIcon} height='23px' />
              </IconButton>
              {open && (
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {outputFiles ?
                    outputFiles?.map((url: any, index: React.Key | null | undefined) => (
                      <MenuItem key={index} onClick={() => initiateDownload((url as any)?.file_url)}>
                        <DownloadForOfflineRoundedIcon style={{ color: "#4CAF50", marginRight: "1rem" }} />
                        {(url as any)?.filetype_name}
                      </MenuItem>
                    ))
                    :
                    <MenuItem onClick={handleClose} style={{ color: "red" }}>No files found</MenuItem>
                  }

                </Menu>
              )}
              {/* <IconButton size='small'>
                <SettingsOutlined
                  sx={{ color: theme.palette.grey[500] }}
                  onClick={() =>
                    navigate(`/projects/${projectId}/data/config/cleaning`)
                  }
                />
               
              </IconButton> */}
              <IconButton
                onClick={() => {
                  if (!fullViewMode) {
                    screen1.enter()
                  } else {
                    screen1.exit()
                  }
                }}
              >
                {!fullViewMode ? (
                  <FullscreenIcon
                    sx={{ color: theme.palette.grey[500], fontSize: "1.3rem" }}
                  />
                ) : (
                  <img src={FillIcon} height='20px' />
                )}
              </IconButton>
            </Stack>
          </Box>
          <Box
            sx={{
              // paddingTop: "1rem",
              height: fullViewMode
                ? "calc(100vh - 1px)"
                : "calc(100vh - 270px)",
              overflow: "auto",
              background: fullViewMode ? "white" : "none"
            }}
          >
            {questionsWithAnswers && questionsWithAnswers?.length > 0 ?
              <GridLayout
                // key={ }
                className="layout"
                layout={layout}
                cols={2}
                // rowHeight={300}
                width={width}
                onLayoutChange={onLayoutChange}
              >
                {questionsWithAnswers && questionsWithAnswers?.map((question, index) => (

                  <div key={`item${index}`} className="grid-item"
                    style={{
                      padding: "1rem 1rem 1.3rem 1rem",
                      boxShadow: "0px 2px 4px 0px rgba(232, 204, 255, 0.12), 0px 4px 12px 0px rgba(228, 152, 255, 0.25)",
                      background: "white", borderRadius: "1rem",
                    }}>
                    <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Tooltip title={question?.question_label?.length > 60 ? question?.question_label : ""}>
                        <p style={{ fontWeight: "bold", }}>{question?.question_label?.length > 60 ? question?.question_label?.substring(0, 60) + '...' : question?.question_label}</p>
                      </Tooltip>
                      <Tooltip key={`item-${index}`} placement="left" title={
                        <Box style={{ backgroundColor: "#ffffff !important", width: "100%" }}>
                          <Button style={{ display: question?.type == "grid" ? "none" : "auto", }} onClick={() => changeChartType(index, 'bar')}><BarChartRoundedIcon /></Button>
                          <Button style={{ display: question?.type == "grid" ? "none" : "auto", }} onClick={() => changeChartType(index, 'pie')}><PieChartRoundedIcon /></Button>
                          <Button style={{ display: question?.type == "grid" ? "none" : "auto", }} onClick={() => changeChartType(index, 'donut')}><DonutLargeRoundedIcon /></Button>
                          <Button style={{ display: question?.type == "grid" ? "none" : "auto", }} onClick={() => changeChartType(index, 'guage')}> <img src={GuageChartIcon} style={{ height: "28px" }} /></Button>
                          <Button style={{ display: question?.type == "grid" ? "auto" : "none", }} onClick={() => changeChartType(index, 'stacked-column')}><StackedBarChartRoundedIcon /></Button>
                          <Button style={{ display: question?.type == "grid" ? "auto" : "none", }} onClick={() => changeChartType(index, 'stacked-bar')}><ViewListRoundedIcon /></Button>
                        </Box>
                      }
                        PopperProps={{
                          sx: {
                            '& .MuiTooltip-tooltip': {
                              backgroundColor: "#ffffff",
                              color: theme.palette.primary.main,
                              // width: 'calc(100vw) !important'
                              width: '100%'
                            }
                          },
                          container: document.querySelector(".fullscreen"),
                        }}
                      >
                        <MultilineChartIcon style={{ color: "#8A16E5", cursor: 'pointer' }} />
                      </Tooltip>
                    </Box>
                    {/* <div id={`chartdiv-${index}`} style={{ width: "100%", height: "100%" }}></div> */}
                    {
                      (chartTypes as any)[index] === 'bar' ?
                        <StatisticsBarChartComponentNoFilters questionsWithAnswers={question} index={index} fullViewMode={fullViewMode} />
                        : (chartTypes as any)[index] === 'pie' ?
                          <StatisticsPieChartsComponent questionsWithAnswers={question} index={index} fullViewMode={fullViewMode} />
                          :
                          (chartTypes as any)[index] === 'donut' ?
                            <StatisticsDonutChartComponent questionsWithAnswers={question} index={index} fullViewMode={fullViewMode} />
                            :
                            (chartTypes as any)[index] === 'guage' ?
                              <StatisticsGuageChartComponent questionsWithAnswers={question} index={index} fullViewMode={fullViewMode} />
                              :
                              (chartTypes as any)[index] === 'stacked-column' ?
                                <StatisticsStackedColumnChartComponent questionsWithAnswers={question} index={index} hideNum={false} />
                                :
                                (chartTypes as any)[index] === 'stacked-bar' ?
                                  <StatisticsStackedBarChartComponent questionsWithAnswers={question} index={index} hideNum={false} />
                                  : null
                      // <StatisticsLineChartComponent questionsWithAnswers={question} index={index} />
                    }
                  </div>
                ))}
              </GridLayout>
              :
              !loading ?
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "2rem",
                  }}
                >
                  <Typography variant='h5'>
                    {!loading ? "No data to show !" : null}
                  </Typography>
                </Box>
                : null
            }
          </Box>
        </div>
      </FullScreen>
    </>
  );
};

export default StatisticsContainer;

