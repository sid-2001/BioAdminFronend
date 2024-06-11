// import { Box, Typography, Button, Tooltip } from '@mui/material'
// import { Question } from '@/types/data-insights.type'
// import StatisticsBarChartComponent from './aggregated-bar-chart'
// import { SlideLogo } from '@/assets/images'
// import { useState } from 'react'
// import StatisticsPieChartComponent from './aggregated-pie-chart'
// import MultilineChartIcon from '@mui/icons-material/MultilineChart'
// import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
// import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded'
// import StatisticsGuageChartComponent from './aggregated-gauge.chart'
// import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded'
// // import ChartFilterModal from '@/components/charts-filter-modal/charts-filter-modal.component';
// import { theme } from '@/constants/theme'
// import ReactMarkdown from 'react-markdown'
// import InsightsIcon from '@mui/icons-material/Insights'
// import StackedBarChartRoundedIcon from '@mui/icons-material/StackedBarChartRounded';
// import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
// import StatisticsStackedColumnChartComponent from './statistics-stacked-column-chart.component'
// import StatisticsStackedBarChartComponent from './statistics-stacked-bar-chart.component'

// enum ChartType {
//   Bar,
//   Pie,
//   Gauge,
//   column_stacked,
//   bar_stacked
// }

// const PADDINGY = 25
// // const LOWER_SECTION_HEIGHT = 82 + 108
// // 596

// function Slide({ question, index, height }: { question: Question; index: number; height: number }) {
//   const [chartType, setChartType] = useState(initialChartType())

//   // function initialChartType() {
//   //   if (question.type === 'single') return ChartType.Bar
//   //   else return ChartType.Pie
//   // }

//   function initialChartType() {
//     if (question.type === "single") {
//       return ChartType.Bar
//     } else if (question.type === "multi") {
//       return ChartType.Pie
//     } else if (question.type === "grid") {
//       return ChartType.column_stacked
//     }
//     // else return ChartType.Pie
//   }

//   function mappingHelper(question: Question) {
//     return question
//   }

//   const containsPattern = (item: string) => {
//     const pattern = /^\*\*[^*]+\*\*:$/
//     return pattern.test(item.trim())
//   }

//   return (
//     <>
//       <Box
//         sx={{
//           position: 'relative',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         {/* <Box
//           sx={{
//             position: "absolute",
//             top: "calc(100% - 30px)",
//             left: "calc(100% - 130px)",
//             width: "124px",
//             height: "30px",
//           }}
//         >
//           <img src={SlideLogo} />
//         </Box> */}
//         <Box
//           sx={{
//             width: '48%',
//             height: `calc(100vh - ${height + PADDINGY}px)`,
//             // bgcolor: "red",
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'space-between',
//           }}
//         >
//           <Box>
//             <Typography
//               sx={{
//                 fontSize: '19px',
//                 fontWeight: '800',
//                 // lineHeight: "66px",
//               }}
//             >
//               {question?.question_id}
//             </Typography>
//             <Typography
//               sx={{
//                 fontSize: '14px',
//                 fontWeight: '600',
//                 lineHeight: '26px',
//                 // marginBottom: "16px",
//               }}
//             >
//               {question?.question_label?.length > 150 ? (
//                 <Tooltip
//                   PopperProps={{
//                     container: document.querySelector('.fullscreen'),
//                   }}
//                   title={question.question_label.substring(0, 800)}
//                 >
//                   <div>{question.question_label.substring(0, 150) + '...'}</div>
//                 </Tooltip>
//               ) : (
//                 question?.question_label
//               )}
//             </Typography>
//             <Typography
//               sx={{
//                 fontSize: '16px',
//                 fontWeight: '700',
//                 lineHeight: '30px',
//                 letterSpacing: '3px',
//                 marginBottom: '16px',
//                 textTransform: 'uppercase',
//                 color: 'rgba(249, 54, 54, 1)',
//                 // bgcolor: "yellowgreen",
//               }}
//             >
//               Key Insights
//             </Typography>
//           </Box>
//           <Box
//             sx={{
//               paddingBottom: '1rem',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'space-between',
//               // bgcolor: "yellow",
//               flexGrow: '1',
//               overflowY: 'scroll',
//             }}
//           >
//             <ul
//               style={{
//                 paddingLeft: '1.3rem',
//               }}
//             >
//               {question?.insights?.map((insight, i) => (
//                 <li
//                   style={{
//                     fontSize: '12px',
//                     fontWeight: '400',
//                     lineHeight: '26px',
//                     color: 'rgba(82, 82, 91, 1)',
//                     marginBottom: '8px',
//                     listStyleType: 'none !important',
//                     display: 'flex',
//                     gap: '1rem',
//                   }}
//                   key={i}
//                 >
//                   {!containsPattern(insight) && (
//                     // <ListItemIcon>
//                     <InsightsIcon style={{ color: theme.palette.primary.main, marginTop: '0.3rem' }} />
//                     // </ListItemIcon>
//                   )}
//                   <ReactMarkdown>{insight}</ReactMarkdown>
//                 </li>
//               ))}
//             </ul>
//           </Box>
//           <Box
//             sx={{
//               display: 'flex',
//               gap: '8px',
//             }}
//           >
//             {/* <Box>
//               <Typography
//                 sx={{
//                   fontSize: "42px",
//                   fontWeight: "500",
//                   lineHeight: "62px",
//                 }}
//               >
//                 {question.base_value}
//               </Typography>
//               <Typography
//                 sx={{
//                   fontSize: "13px",
//                   fontWeight: "400",
//                   lineHeight: "20px",
//                 }}
//               >
//                 {question.base_name}
//               </Typography>
//             </Box> */}
//           </Box>
//         </Box>
//         <Box
//           sx={{
//             width: '48%',
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: `calc(100vh - ${height + PADDINGY}px)`,
//               maxHeight: '580px',
//             }}
//           >
//             <div
//               key={`item${index}`}
//               className="grid-item"
//               style={{
//                 padding: '1rem 1rem 1.3rem 1rem',
//                 boxShadow: '0px 2px 4px 0px rgba(232, 204, 255, 0.12), 0px 4px 12px 0px rgba(228, 152, 255, 0.25)',
//                 background: 'white',
//                 borderRadius: '1rem',
//                 width: '100%',
//                 height: '100%',
//               }}
//             >
//               <Box
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                 }}
//               >
//                 <Tooltip
//                   key={`item-${index}`}
//                   placement="right"
//                   title={
//                     <Box
//                       style={{
//                         backgroundColor: "#ffffff !important",
//                         width: "100%",
//                       }}
//                     >
//                       <Button style={{ display: question?.type == "grid" ? "none" : "auto", }} onClick={() => setChartType(ChartType.Bar)}>
//                         <BarChartRoundedIcon />
//                       </Button>
//                       <Button style={{ display: question?.type == "grid" ? "none" : "auto", }} onClick={() => setChartType(ChartType.Pie)}>
//                         <PieChartRoundedIcon />
//                       </Button>
//                       <Button style={{ display: question?.type == "grid" ? "none" : "auto", }} onClick={() => setChartType(ChartType.Gauge)}>
//                         <DonutLargeRoundedIcon />
//                       </Button>
//                       <Button style={{ display: question?.type == "grid" ? "auto" : "none", }} onClick={() => setChartType(ChartType.column_stacked)}>
//                         <StackedBarChartRoundedIcon />
//                       </Button>
//                       <Button style={{ display: question?.type == "grid" ? "auto" : "none", }} onClick={() => setChartType(ChartType.bar_stacked)}>
//                         <ViewListRoundedIcon />
//                       </Button>
//                     </Box>
//                   }
//                   PopperProps={{
//                     sx: {
//                       '& .MuiTooltip-tooltip': {
//                         backgroundColor: '#ffffff',
//                         color: theme.palette.primary.main,
//                         // width: 'calc(100vw) !important'
//                         width: '100%',
//                       },
//                     },
//                     container: document.querySelector('.fullscreen'),
//                   }}
//                 >
//                   <MultilineChartIcon style={{ color: '#8A16E5', cursor: 'pointer' }} />
//                 </Tooltip>
//               </Box>
//               {chartType === ChartType.Bar && question ? <StatisticsBarChartComponent questionsWithAnswers={mappingHelper(question)} index={index} /> : null}
//               {chartType === ChartType.Pie && question ? <StatisticsPieChartComponent questionsWithAnswers={mappingHelper(question)} index={index} /> : null}
//               {chartType === ChartType.Gauge && question ? <StatisticsGuageChartComponent questionsWithAnswers={mappingHelper(question)} index={index} /> : null}

//               {chartType === ChartType.column_stacked && question ? (
//                 <StatisticsStackedColumnChartComponent
//                   questionsWithAnswers={mappingHelper(question)}
//                   index={index}
//                 />
//               ) : null}
//               {chartType === ChartType.bar_stacked && question ? (
//                 <StatisticsStackedBarChartComponent
//                   questionsWithAnswers={mappingHelper(question)}
//                   index={index}
//                 />
//               ) : null}

//             </div>
//           </Box>
//         </Box>
//       </Box>
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           paddingTop: '6px',
//         }}
//         component="footer"
//       >
//         <Box>
//           <Typography
//             sx={{
//               fontSize: '19px',
//               fontWeight: '500',
//             }}
//           >
//             {question.base_value}
//           </Typography>
//           <Typography
//             sx={{
//               fontSize: '12px',
//               fontWeight: '400',
//               lineHeight: '20px',
//             }}
//           >
//             {question.base_name}
//           </Typography>
//         </Box>

//         <Box
//           sx={{
//             width: '124px',
//             height: '30px',
//           }}
//         >
//           <img src={SlideLogo} />
//         </Box>
//       </Box>
//     </>
//   )
// }

// export default Slide



import { Box, Typography, Button, Tooltip, IconButton } from "@mui/material"
import { Banner, Question } from "@/types/data-insights.type"
// import StatisticsBarChartComponent from "@/components/statistics-bar-chart/statistics-bar-chart.component"
import { useState } from "react"
// import StatisticsBarChartComponent from '@/components/statistics-bar-chart/statistics-bar-chart.component';
import MultilineChartIcon from "@mui/icons-material/MultilineChart"
// import StatisticsPieChartComponent from "@/components/statistics-pie-chart/statistics-pie-chart.component"
// import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded"
// import PieChartRoundedIcon from "@mui/icons-material/PieChartRounded"
// import StatisticsGuageChartComponent from "@/components/statistics-guage-chart"
// import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded"
import StackedBarChartRoundedIcon from '@mui/icons-material/StackedBarChartRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
// import ChartFilterModal from '@/components/charts-filter-modal/charts-filter-modal.component';
import { theme } from "@/constants/theme"
import ReactMarkdown from "react-markdown"
import InsightsIcon from "@mui/icons-material/Insights"
import StatisticsStackedColumnChartComponent from "@/components/statistics-stacked-column-chart"
import StatisticsStackedBarChartComponent from "@/components/statistics-stacked-bar-chart"
import InsightsBarChartComponent from "@/components/insights-bar-chart"

import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
import WaterfallChartRoundedIcon from '@mui/icons-material/WaterfallChartRounded';
import InsightsPieChartComponent from "@/components/insights-pie-chart/insights-pie-chart.component"
// import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
// import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';
// import StatisticsBarChartComponentNoFilters from "@/components/statistics-bar-chart-no-filters/statistics-bar-chart.component"
import { Logo } from "@/assets/images";
import StatisticsWordCloud from "@/components/statistics-word-cloud";
import PasswordIcon from '@mui/icons-material/Password';
import TopicIcon from '@mui/icons-material/Topic';

enum ChartType {
  ANY,
  BAR,
  PIE,
  GAUGE,
  DOUGHNUT,


  BAR_STACKED_100,
  COLUMN_STACKED_100,
  COLUMN_CLUSTERED,

  NESTED_DONUT,



  bar_stacked,
  column_stacked
}

const PADDINGY = 0
// const LOWER_SECTION_HEIGHT = 82 + 108
// 596

function Slide({
  question,
  index,
  height,
}: {
  question: Question
  index: number
  height: number
}) {
  const [chartType, setChartType] = useState(initialChartType())

  const [wordCloud, setWordCloud] = useState(false)

  const [chartIndex, _setChartIndex] = useState(0)

  const [fullViewChart, setFullViewChart] = useState(false)

  function initialChartType() {
    if (question?.type == 'numeric' || ((question.chart_type === "COLUMN_STACKED_100" || question.chart_type === "COLUMN_CLUSTERED") && (question?.is_demographic_question || false) == true)) {
      return ChartType.COLUMN_STACKED_100
    } else if (question.chart_type === "DOUGHNUT" && (question?.is_demographic_question || false) == true) {
      return ChartType.DOUGHNUT
    }
    else if ((question?.is_demographic_question || false) == true) {
      return ChartType.COLUMN_STACKED_100
    }
    // else if (question.type === "grid") {
    //   return ChartType.column_stacked
    // }
    // if (question.type) {
    //   return ChartType[question?.banners[0]?.chart_type]
    // }

    // else if (question.type && (question?.is_demographic_question || false) == false) {
    //   let chartTypeKey = question?.banners[0]?.chart_type as keyof typeof ChartType;
    //   return ChartType[chartTypeKey]
    // }

    else if ((question?.is_demographic_question || false) == false) {
      // let chartTypeKey = question?.banners[0]?.chart_type as keyof typeof ChartType;
      return ChartType.COLUMN_STACKED_100
    }
    // else return ChartType.Pie
  }

  // console.log(initialChartType(), "initialChartTypeinitialChartType")

  function mappingHelper(question: Question | Banner) {
    return question
  }

  const containsPattern = (item: string) => {
    const pattern = /^\*\*[^*]+\*\*:$/
    return pattern.test(item.trim())
  }

  console.log(question, "chartIndexchartIndexchartIndexchartIndex", chartIndex, chartType)

  return (
    <>
      <Box sx={{ paddingTop: "0.5rem" }}>
        <Typography
          sx={{
            fontSize: "19px",
            fontWeight: "800",
            // lineHeight: "66px",
          }}
        >
          {question?.question_title_generated || question?.question_id}
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "600",
            lineHeight: "26px",
            marginBottom: "0px",
          }}
        >
          {question?.question_label?.length > 150 ? (
            <Tooltip
              PopperProps={{
                container: document.querySelector(".fullscreen"),
              }}
              title={question.question_label.substring(0, 800)}
            >
              <div>{(question?.question_id ? `${question.question_id}.` : '') + question.question_label.substring(0, 150) + "..."}</div>
            </Tooltip>
          ) : (
            (question?.question_id ? `${question.question_id}.` : '') + question?.question_label
          )}
        </Typography>
      </Box>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* <Box
          sx={{
            position: "absolute",
            top: "calc(100% - 30px)",
            left: "calc(100% - 130px)",
            width: "124px",
            height: "30px",
          }}
        >
          <img src={SlideLogo} />
        </Box> */}
        <Box
          sx={{
            // width: '100%',
            width: (!question.banners || question?.banners?.length <= 0) && ((question as any)?.keywords?.length <= 0 && (question as any)?.topics?.length <= 0) || question?.question_id == 'Executive Summary' ? '100%' : "38%",
            height: `calc(100vh - ${height + PADDINGY + 32}px)`,
            // bgcolor: "red",
            display: fullViewChart || (question?.is_demographic_question || false) == true || question?.insights?.length <= 0 ? "none" : "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "700",
                lineHeight: "30px",
                letterSpacing: "1px",
                marginBottom: "8px",
                // textTransform: "uppercase",
                color: "#7030B5",
                // bgcolor: "yellowgreen",
              }}
            >
              Key Insights
            </Typography>
          </Box>
          <Box
            sx={{
              paddingBottom: "1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              // bgcolor: "yellow",
              flexGrow: "1",
              overflowY: "scroll",
            }}
          >
            <ul
              style={{
                // paddingLeft: "1.3rem",
              }}
            >
              {question?.insights?.map((insight, i) => (
                <li
                  style={{
                    fontSize: "12px",
                    fontWeight: ((question.banners && question?.banners?.length > 0) && i == 0) ? '700' : "400",
                    lineHeight: "26px",
                    color: "rgba(82, 82, 91, 1)",
                    marginBottom: "8px",
                    listStyleType: "none !important",
                    display: "flex",
                    gap: "1rem",
                  }}
                  key={i}
                >
                  {/* {!containsPattern(insight) && (i != 0) && ( */}
                  {!containsPattern(insight) && ((question.banners && question?.banners?.length > 0) ? i != 0 : true) && (
                    // <ListItemIcon>
                    <InsightsIcon
                      style={{
                        color: theme.palette.primary.main,
                        marginTop: "0.3rem",
                      }}
                    />
                    // </ListItemIcon>
                  )}
                  <ReactMarkdown >{insight}</ReactMarkdown>
                </li>
              ))}
            </ul>
          </Box>

        </Box>
        <Box
          sx={{
            display: ((!question.banners || question?.banners?.length <= 0)) && ((question as any)?.keywords?.length <= 0 && (question as any)?.topics?.length <= 0) || question?.question_id == 'Executive Summary' ? 'none' : "auto",
            width: fullViewChart || (question?.is_demographic_question || false) == true || question?.insights?.length <= 0 ? "100%" : "58%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: fullViewChart || (question?.is_demographic_question || false) == true || question?.insights?.length <= 0 ? "100vh" : `calc(100vh - ${height + PADDINGY + 32}px)`,
              maxHeight: fullViewChart || (question?.is_demographic_question || false) == true || question?.insights?.length <= 0 ? `calc(100vh - ${height + PADDINGY + 24}px)` : "auto",
            }}
          >
            <div
              key={`item${index}`}
              className='grid-item'
              style={{
                padding: (question?.is_demographic_question || false) == true ? "0rem 1rem 2rem 1rem" : "1rem 1rem 1.3rem 1rem",
                boxShadow: '0px 8px 16px rgba(232, 204, 255, 0.37)',
                // "0px 2px 4px 0px rgba(232, 204, 255, 0.12), 0px 4px 12px 0px rgba(228, 152, 255, 0.25)",
                background: "white",
                borderRadius: "1rem",
                width: "100%",
                height: "100%",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  style={{
                    display: "flex",

                    gap: "2rem",
                    alignItems: "center",
                  }}
                >


                  <Typography
                    sx={{
                      fontSize: "19px",
                      fontWeight: "800",
                      // lineHeight: "66px",
                    }}
                  >
                    {
                      question?.type == 'opentext' ?
                        wordCloud ? "Keywords" : "Topics"
                        :
                        question?.banners && question?.banners[chartIndex] && question?.banners[chartIndex]?.banner_name ? question?.banners && question?.banners[chartIndex] && question?.banners[chartIndex]?.banner_name : ''}                    {/* question?.question_label?.length > (fullViewChart || (question?.is_demographic_question || false) == true || question?.insights?.length <= 0 ? 100 : 35) ? (
                        <Tooltip
                          PopperProps={{
                            container: document.querySelector(".fullscreen"),
                          }}
                          title={question.question_label.substring(0, 800)}
                        >
                          <div>
                            {((question?.is_demographic_question || false) === true ? `${question?.question_id} : ` : '') + question.question_label.substring(0, (fullViewChart || (question?.is_demographic_question || false) === true ? 100 : 35)) + "..."}
                          </div>
                        </Tooltip>
                      ) : (
                        (question?.is_demographic_question || false) == true ? `${question?.question_id} : ${question?.question_label}` : question?.question_label
                      )} */}

                  </Typography>

                </Box>


                <Box style={{ display: "flex", gap: "1rem", alignItems: "center" }}>

                  <Tooltip
                    key={`item-${index}`}
                    placement='left'
                    title={
                      <Box
                        style={{
                          backgroundColor: "#ffffff !important",
                          width: "100%",
                        }}
                      >
                        {/* <Button style={{ display: (question?.is_demographic_question || false) == false ? "none" : "auto", }} onClick={() => setChartType(ChartType.BAR)}>
                          <BarChartRoundedIcon />
                        </Button>
                        <Button style={{ display: (question?.is_demographic_question || false) == false ? "none" : "auto", }} onClick={() => setChartType(ChartType.PIE)}>
                          <PieChartRoundedIcon />
                        </Button>
                        <Button style={{ display: (question?.is_demographic_question || false) == false ? "none" : "auto", }} onClick={() => setChartType(ChartType.DOUGHNUT)}>
                          <DonutLargeRoundedIcon />
                        </Button> */}

                        <Button
                          style={{ display: question?.type == 'opentext' ? "auto" : "none", }}
                          onClick={() => setWordCloud(false)}>
                          <TopicIcon />
                        </Button>

                        <Button
                          style={{ display: question?.type == 'opentext' ? "auto" : "none", }}
                          onClick={() => setWordCloud(true)}>
                          <PasswordIcon />
                        </Button>


                        <Button
                          style={{ display: (question?.is_demographic_question || false) == false && question?.type !== 'opentext' ? "auto" : "none", }}
                          onClick={() => setChartType(ChartType.COLUMN_STACKED_100)}>
                          <StackedBarChartRoundedIcon />
                        </Button>
                        <Button
                          style={{ display: (question?.is_demographic_question || false) == false && question?.type !== 'opentext' ? "auto" : "none", }}
                          onClick={() => setChartType(ChartType.BAR_STACKED_100)}>
                          <ViewListRoundedIcon />
                        </Button>

                        <Button
                          style={{ display: (question?.is_demographic_question || false) == false && question?.type !== 'opentext' ? "auto" : "none", }}
                          onClick={() => setChartType(ChartType.COLUMN_CLUSTERED)}>
                          <WaterfallChartRoundedIcon />
                        </Button>

                        <Button
                          style={{ display: (question?.is_demographic_question || false) == false && question?.type !== 'opentext' ? "auto" : "none", }}
                          onClick={() => setChartType(ChartType.NESTED_DONUT)}>
                          <DataSaverOffIcon />
                        </Button>
                      </Box>
                    }
                    PopperProps={{
                      sx: {
                        "& .MuiTooltip-tooltip": {
                          backgroundColor: "#ffffff",
                          color: theme.palette.primary.main,
                          // width: 'calc(100vw) !important'
                          width: "100%",
                        },
                      },
                      container: document.querySelector(".fullscreen"),
                    }}
                  >
                    <MultilineChartIcon
                      style={{ color: "#8A16E5", cursor: "pointer" }}
                    />
                  </Tooltip>
                  {/* {(question?.is_demographic_question || false) == false &&
                    <IconButton style={{ margin: "0px", padding: "0px", color: "#8A16E5", }} onClick={() => {
                      const newIndex = chartIndex === 0 ? question?.banners.length - 1 : chartIndex - 1;
                      setChartIndex(newIndex);
                      setChartType(ChartType[question?.banners[newIndex]?.chart_type as keyof typeof ChartType])
                    }}>
                      <KeyboardArrowLeftRoundedIcon />
                    </IconButton>
                  }
                  {(question?.is_demographic_question || false) == false &&
                    <IconButton style={{ margin: "0px !important", padding: "0px", color: "#8A16E5", }} onClick={() => {
                      const newIndex = chartIndex === (question?.banners?.length - 1) ? 0 : chartIndex + 1;
                      setChartIndex(newIndex);
                      setChartType(ChartType[question?.banners[newIndex]?.chart_type as keyof typeof ChartType])
                    }}>
                      <KeyboardArrowRightRoundedIcon />
                    </IconButton>
                  } */}
                  {(question?.is_demographic_question || false) == false &&
                    <IconButton style={{ margin: "0px !important", padding: "0px", color: "#8A16E5", }} onClick={() => setFullViewChart(!fullViewChart)}>
                      {fullViewChart ? <FullscreenExitRoundedIcon /> : <FullscreenRoundedIcon />}
                    </IconButton>
                  }

                </Box>
              </Box>
              {(question?.is_demographic_question || false) == true &&
                <Box style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: "800",
                    }}
                  >
                    Demographics
                  </Typography>
                </Box>}
              {/* {chartType === ChartType.BAR ? (
                <StatisticsBarChartComponentNoFilters
                  questionsWithAnswers={mappingHelper((question?.is_demographic_question || false) == true ? question : question?.banners[chartIndex])}
                  index={index}
                />
              ) : null}
              {chartType === ChartType.PIE ? (
                <StatisticsPieChartComponent
                  questionsWithAnswers={mappingHelper((question?.is_demographic_question || false) == true ? question : question?.banners[chartIndex])}
                  index={index}
                />
              ) : null}
              {chartType === ChartType.DOUGHNUT ? (
                <StatisticsGuageChartComponent
                  questionsWithAnswers={mappingHelper((question?.is_demographic_question || false) == true ? question : question?.banners[chartIndex])}
                  index={index}
                />
              ) : null} */}
              {(chartType === ChartType.COLUMN_STACKED_100 || chartType === ChartType.column_stacked) ? (
                <StatisticsStackedColumnChartComponent hideNum={false}
                  questionsWithAnswers={mappingHelper((question?.is_demographic_question || false) == true ? question : question?.banners && (question?.banners[chartIndex]))}
                  index={index} question_id={question?.question_id}
                />
              ) : null}
              {(chartType === ChartType.BAR_STACKED_100 || chartType === ChartType.bar_stacked) ? (
                <StatisticsStackedBarChartComponent hideNum={false}
                  questionsWithAnswers={mappingHelper((question?.is_demographic_question || false) == true ? question : question?.banners && (question?.banners[chartIndex]))}
                  index={index} question_id={question?.question_id}
                />
              ) : null}

              {chartType === ChartType.COLUMN_CLUSTERED ? (
                <InsightsBarChartComponent
                  questionsWithAnswers={mappingHelper((question?.is_demographic_question || false) == true ? question : question?.banners && (question?.banners[chartIndex]))}
                  index={index} question_id={question?.question_id}
                />
              ) : null}

              {chartType === ChartType.NESTED_DONUT ? (
                <InsightsPieChartComponent
                  questionsWithAnswers={mappingHelper((question?.is_demographic_question || false) == true ? question : question?.banners && (question?.banners[chartIndex]))}
                  index={index} question_id={question?.question_id}
                />
              ) : null}

              {question?.type == 'opentext' ?
                <StatisticsWordCloud index={index} questionsWithAnswers={wordCloud ? question?.keywords : question?.topics} /> : null
              }
            </div>
          </Box>
        </Box>
      </Box >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          // paddingTop: "6px",
          gap: "2rem"
        }}
        component='footer'
      >
        <Box sx={{
          display: (!question.base_value || !question.base_name) ? 'none' : "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "0px",
          gap: "1rem",
        }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "700",
              lineHeight: "30px",
              letterSpacing: "1px",
              color: "#7030B5",
            }}
          >
            {/* {question?.nps >= 0 ? `nps = ${question?.nps}` : ''} */}
            {(typeof question?.nps === 'number' || typeof question?.nps === 'string') && question?.nps != -999 ? `NPS = ${question?.nps}` : ''}

          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "700",
              lineHeight: "30px",
              letterSpacing: "1px",
              color: "#7030B5",
            }}
          >
            {question.base_name}
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "700",
              lineHeight: "30px",
              letterSpacing: "1px",
              color: "#7030B5",
            }}
          >
            n = {question.base_value}
          </Typography>
        </Box>

        <Box
          sx={{
            // width: "124px",
            // height: "30px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <img src={Logo} style={{
            transform: "rotate(24.47deg)",
          }}
            width="48px" />
        </Box>
      </Box>
    </>
  )
}

export default Slide
