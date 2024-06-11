import { Box, Typography, Button, Tooltip } from "@mui/material"
import { Question } from "@/types/data-insights.type"
// import StatisticsBarChartComponent from "@/components/statistics-bar-chart/statistics-bar-chart.component"
import { useState } from "react"
// import StatisticsBarChartComponent from '@/components/statistics-bar-chart/statistics-bar-chart.component';
import StatisticsDonutChartComponent from "@/components/statistics-donut-chart/statistics-donut-chart.component"
import MultilineChartIcon from "@mui/icons-material/MultilineChart"
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded"
import PieChartRoundedIcon from "@mui/icons-material/PieChartRounded"
import StatisticsGuageChartComponent from "@/components/statistics-guage-chart"
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded"
// import StackedBarChartRoundedIcon from '@mui/icons-material/StackedBarChartRounded';
// import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
// import ChartFilterModal from '@/components/charts-filter-modal/charts-filter-modal.component';
import { theme } from "@/constants/theme"
// import ReactMarkdown from "react-markdown"
// import InsightsIcon from "@mui/icons-material/Insights"
// import StatisticsStackedColumnChartComponent from "@/components/statistics-stacked-column-chart"
// import StatisticsStackedBarChartComponent from "@/components/statistics-stacked-bar-chart"
// import InsightsBarChartComponent from "@/components/insights-bar-chart"

// import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
// import WaterfallChartRoundedIcon from '@mui/icons-material/WaterfallChartRounded';
// import InsightsPieChartComponent from "@/components/insights-pie-chart/insights-pie-chart.component"
// import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
// import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
// import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
// import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';
import StatisticsBarChartComponentNoFilters from "@/components/statistics-bar-chart-no-filters/statistics-bar-chart.component"
import { GuageChartIcon, Logo } from "@/assets/images";
import StatisticsPieChartsComponent from "@/components/statistics-pie-charts"

enum ChartType {
  ANY,
  BAR,
  PIE,
  GAUGE,
  DOUGHNUT,
  GUAGE,

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

function SlideDemo({
  question,
  index,
  height,
  fullViewMode,
}: {
  question: Question[]
  index: number
  height: number
  fullViewMode: boolean
}) {
  // console.log(question, "questionquestiondemo")

  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "0.5rem"
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: `calc(100vh - ${height + PADDINGY - 8}px)`,
            // bgcolor: "red",
            // display:  question?.insights?.length <= 0 ? "none" : "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            // backgroundColor: "red"
          }}
        >
          <Box>

            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: "500",
                lineHeight: "30px",
                // letterSpacing: "3px",
                marginBottom: "8px",
                // textTransform: "uppercase",
                // color: "rgba(249, 54, 54, 1)",
                color: "black"
                // bgcolor: "yellowgreen",
              }}
            >
              Respondent Profile {index + 1}
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
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: fullViewMode ? 'repeat(2, 1fr)' : `repeat(auto-fill, minmax(${window.innerWidth > 1900 ? '320px' : window.innerWidth < 1200 ? '160px' : window.innerWidth < 1400 ? '190px' : window.innerWidth < 1500 ? '210px' : window.innerWidth < 1600 ? '220px' : window.innerWidth < 1650 ? '230px' : window.innerWidth < 1700 ? '250px' : window.innerWidth < 1750 ? '260px' : window.innerWidth < 1800 ? '280px' : '320px'}, 1fr))`,
                gap: '1rem',
                paddingBottom: '1rem',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: 1,
                overflowY: 'scroll',
                width: "100%",
                height: `calc(100vh - ${height + PADDINGY }px)`,
                maxHeight: `calc(100vh - ${height + PADDINGY}px)`,
              }}
            >
              {question && question?.map((item: { is_demographic_question: any; chart_type: string, type: string; }, questionIndex: any) => {
                // console.log(item, "itemitem")

                function initialChartType(chart_type: string, type: string) {
                  console.log(type, "typetype")
                  // console.log(chart_type, "chart_typechart_type")
                  if (type == 'numeric' || chart_type === "COLUMN_STACKED_100" || chart_type === "COLUMN_CLUSTERED") {
                    return ChartType.BAR
                  } else if (chart_type === "DOUGHNUT" && (item?.is_demographic_question || false) == true) {
                    return ChartType.DOUGHNUT
                  } else if (chart_type === "PIE" && (item?.is_demographic_question || false) == true) {
                    return ChartType.PIE
                  }
                  else if ((item?.is_demographic_question || false) == true) {
                    return ChartType.BAR
                  }

                  else if ((item?.is_demographic_question || false) == false) {
                    // let chartTypeKey = item?.banners[0]?.chart_type as keyof typeof ChartType;
                    return ChartType.COLUMN_STACKED_100
                  }
                  // else return ChartType.Pie
                }

                const [chartType, setChartType] = useState<ChartType | null>(null)

                // function mappingHelper(item: Question | Banner) {
                //   return item
                // }

                return (
                  <Box style={{ backgroundColor: "white" }}>
                    <div
                      key={`item${questionIndex}`}
                      className='grid-item'
                      style={{
                        padding: "0rem 1rem 1rem 1rem",
                        // boxShadow:
                        //   "0px 2px 4px 0px rgba(232, 204, 255, 0.12), 0px 4px 12px 0px rgba(228, 152, 255, 0.25)",
                        boxShadow: "0px 8px 16px rgba(232, 204, 255, 0.37)",
                        background: "white",
                        borderRadius: "1rem",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Box style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                          <Tooltip
                            key={`item-${questionIndex}`}
                            placement='left'
                            title={
                              <Box
                                style={{
                                  backgroundColor: "#ffffff !important",
                                  width: "100%",
                                }}
                              >
                                <Button onClick={() => setChartType(ChartType.BAR)}>
                                  <BarChartRoundedIcon />
                                </Button>
                                <Button onClick={() => setChartType(ChartType.PIE)}>
                                  <PieChartRoundedIcon />
                                </Button>
                                <Button onClick={() => setChartType(ChartType.DOUGHNUT)}>
                                  <DonutLargeRoundedIcon />
                                </Button>
                                <Button onClick={() => setChartType(ChartType.GUAGE)}>
                                  <img src={GuageChartIcon} style={{ height: "28px" }} />
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
                        </Box>
                      </Box>
                      {(chartType || initialChartType(item?.chart_type, item?.type)) === ChartType.BAR ? (
                        <StatisticsBarChartComponentNoFilters
                          questionsWithAnswers={item}
                          index={questionIndex}
                          fullViewMode={fullViewMode}
                        />
                      ) : null}
                      {(chartType || initialChartType(item?.chart_type, item?.type)) === ChartType.PIE ? (
                        <StatisticsPieChartsComponent
                          questionsWithAnswers={item}
                          index={questionIndex}
                          fullViewMode={fullViewMode}
                        />
                      ) : null}
                      {(chartType || initialChartType(item?.chart_type, item?.type)) === ChartType.DOUGHNUT ? (
                        <StatisticsDonutChartComponent
                          questionsWithAnswers={item}
                          index={questionIndex}
                          fullViewMode={fullViewMode}
                        />
                      ) : null}
                      {(chartType || initialChartType(item?.chart_type, item?.type)) === ChartType.GUAGE ? (
                        <StatisticsGuageChartComponent
                          questionsWithAnswers={item}
                          index={questionIndex}
                          fullViewMode={fullViewMode}
                        />
                      ) : null}

                    </div>
                  </Box>
                )
              })}
            </Box>

          </Box>

        </Box>

      </Box >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingTop: "20px",
        }}
        component='footer'
      >
        {/* <Box>
          <Typography
            sx={{
              fontSize: "19px",
              fontWeight: "500",
            }}
          >
            {question[0]?.base_value}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "20px",
            }}
          >
            {question[0]?.base_name}
          </Typography>
        </Box> */}

        <Box
          sx={{
            // width: "124px",
            height: "30px",
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

export default SlideDemo
