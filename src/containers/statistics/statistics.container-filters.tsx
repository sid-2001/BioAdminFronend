// @ts-ignore
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
// import { BarChart } from '@mui/x-charts/BarChart';
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  Stack,
  Tooltip,
  Typography,
  MenuItem,
  Button,
  Chip,
} from "@mui/material";
import { theme } from "@/constants/theme";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { FileDownloadIcon, FillIcon, GuageChartIcon } from "@/assets/images";
// import { ConfigService } from '@/services/config-cleaning';
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import LoadingSpinner from "@/components/loader";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import DummyJson from "./dummy.json";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import { useOutletContext } from "react-router";
// import { SettingsOutlined } from "@mui/icons-material"
import StatisticsBarChartComponent from "@/components/statistics-bar-chart/statistics-bar-chart.component";
import StatisticsDonutChartComponent from "@/components/statistics-donut-chart/statistics-donut-chart.component";
import MultilineChartIcon from "@mui/icons-material/MultilineChart";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import PieChartRoundedIcon from "@mui/icons-material/PieChartRounded";
import StatisticsGuageChartComponent from "@/components/statistics-guage-chart";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import ChartFilterModal from "@/components/charts-filter-modal/charts-filter-modal.component";
// am4core.useTheme(am4themes_animated);
import QuestionToProcess from "./questions.json";
import { Question } from "@/components/charts-filter-modal/charts-filter-modal.type";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import StatisticsPieChartsComponent from "@/components/statistics-pie-charts";
interface Answer {
  answer_pre_code: string;
  answer_text: string;
  count: number;
}

interface QuestionType {
  question_id: string;
  question_text: string;
  question_type_name: string;
  answer: Answer[];
}

type ProjectData = {
  project_id: number;
  questions: QuestionType[];
};

const StatisticsContainerFilters = () => {
  // const chartRefs = useRef({});
  const { projectId } = useParams();
  // const navigate = useNavigate()

  const [loading, setLoading] = useState(true);
  // chart filters
  const [openPreTab, setPreTab] = useState<boolean>(false);

  function openMainDialog() {
    setPreTab(true);
  }
  const [chartsData, setChartsData] = useState<ProjectData>();
  const [questionsWithAnswers, setQuestionWithAnswers] = useState([]);
  const [questionToProcess, setQUestionToProgress] = useState([]);
  let chartsService: { getConfigChartsByprojectId: (arg0: string) => any };
  // const chartsService = new ConfigService()
  const { enqueueSnackbar } = useSnackbar();
  const [dataToEdit, setDataToEdit] = useState<Question[] | []>([]);

  const { outputFiles } = useOutletContext<any>();

  // outputfiles123
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    ``;
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    // setDownloadFiles([])
  };

  const initiateDownload = (url: string | URL | undefined) => {
    // This will open the file in a new tab and start the download
    window.open(url, "_blank");

    // Close the menu after initiating the download
    handleClose();
  };

  async function getConfigData() {
    setLoading(true);
    if (projectId)
      try {
        const data = await chartsService.getConfigChartsByprojectId(projectId);
        if (data) {
          const response = await fetch(data);
          const jsonData = await response.json();
          setChartsData(jsonData);
        } else {
          enqueueSnackbar("No data found", {
            variant: "error",
          });
          // @ts-ignore
          setChartsData(DummyJson);
        }
      } catch {
        // enqueueSnackbar("Failed in fetching data", {
        //     variant: "error",
        // })
      } finally {
        setLoading(false);
      }
  }

  // fullscreen
  const [fullViewMode, setFullViewMode] = useState(false);
  const [chartTypes, setChartTypes] = useState({});

  const screen1 = useFullScreenHandle();
  // const screen2 = useFullScreenHandle();

  const reportChange = useCallback(
    (state: any, handle: any) => {
      if (handle === screen1) {
        setFullViewMode(state);
      }
    },
    [screen1]
  );
  const [width, setWidth] = useState(
    fullViewMode ? window.innerWidth : window.innerWidth - 200
  );

  // useEffect(() => {
  //     const questionsWithA = chartsData && chartsData?.questions?.filter((question) => question?.answers && question?.answers.length > 0);

  //     // Check if questionLists is an array and has items
  //     if (Array.isArray(questionsWithA) && questionsWithA.length) {
  //         const excludedTypes = ['quantity', 'date', 'time', 'opentext', 'opentextlist', 'numericlist'];

  //         const filteredData = questionsWithA.filter(item =>
  //             !excludedTypes.includes(item.question_type_name) && item.question_variable_type !== 'HIDDEN'
  //         );

  //         const updatedData = filteredData.map((item, index) => ({
  //             ...item,
  //             question_value: index + 1
  //         }));
  //         // setQuestionWithAnswers(updatedData)
  //     }
  // }, [chartsData]);

  // const questionsWithAnswers = chartsData && chartsData?.questions?.filter((question) => question?.answers && question?.answers.length > 0);

  const layout = questionsWithAnswers?.map((_questions, index) => ({
    i: `item${index}`,
    // @ts-ignore
    x: index % 3,
    // @ts-ignore
    y: Math.floor(index / 3) * 2,
    w: 1,
    h: 2,
  }));

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
      const initialChartTypes =
        questionsWithAnswers &&
        questionsWithAnswers.reduce((acc, question: any, index) => {
          if (question.question_type_name == "single") {
            (acc as any)[index] = "bar";
          } else if (question.question_type_name == "grid") {
            (acc as any)[index] = "pie";
          } else {
            (acc as any)[index] = "bar";
          }
          return acc;
        }, {});
      setChartTypes(initialChartTypes);
    }
  }, [questionsWithAnswers, chartsData]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(fullViewMode ? window.innerWidth : window.innerWidth - 200);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getConfigData();
  }, []);

  function sortQuestions(dataToEdit: any, questionsToProcess: any[]) {
    // Create a mapping from question_id to its order in questionsToProcess
    const orderMap: any = {};
    questionsToProcess.forEach((process, index) => {
      process.questions.forEach(
        (question: { question_id: string | number }) => {
          orderMap[question.question_id] = index;
        }
      );
    });

    // Sort dataToEdit based on the orderMap
    const sortedDataToEdit = [...dataToEdit].sort((a, b) => {
      return (orderMap[a.question_id] || 0) - (orderMap[b.question_id] || 0);
    });

    return sortedDataToEdit;
  }

  useEffect(() => {
    const groupQuestionsById = (data: any[]) => {
      // Flatten the array of questions from all respondents
      const allQuestions = data?.flatMap((item) => item.questions);

      // Group questions by question_id
      const grouped = allQuestions?.reduce((acc, question) => {
        const { question_id, answer_code, question_label } = question;

        // Initialize the group array if it doesn't exist
        if (!acc[question_id]) {
          acc[question_id] = [];
        }

        // Push the current question to the group
        acc[question_id].push({
          // answer_code,
          question_label,
          question_id,
          answer_code: [answer_code],
        });

        return acc;
      }, {});

      return grouped;
    };

    // const processDatanew = (rawData) => {
    //     // Object to hold the processed data
    //     const processedData = [];

    //     // Iterate over each question in rawData
    //     Object.entries(rawData).forEach(([questionId, entries]) => {
    //         const answerCounts = {}; // Holds the counts of each answer_code

    //         // Count occurrences of each answer_code
    //         entries.forEach(entry => {
    //             entry.answer_code.forEach(code => {
    //                 if (!answerCounts[code]) {
    //                     answerCounts[code] = { count: 1, answer_label: code ? `Label for ${code}` : "No answer" };
    //                 } else {
    //                     answerCounts[code].count++;
    //                 }
    //             });
    //         });

    //         // Transform answerCounts into the desired array structure
    //         const answers = Object.keys(answerCounts).map(code => ({
    //             answer_code: code,
    //             answer_text: answerCounts[code].answer_label,
    //             count: answerCounts[code].count,
    //         }));

    //         // Add the processed question to the processedData array
    //         processedData.push({
    //             question_id: questionId,
    //             question_text: entries[0].question_label,
    //             question_type_name: "single", // Assuming 'type' is always 'single' for this example
    //             answers: answers,
    //         });
    //     });

    //     return processedData;
    // };

    const processDatanew = (rawData: any, dummyjson: any) => {
      // Create a lookup object for Dummyjson question texts by question_id
      const dummyQuestionLookup = dummyjson.reduce(
        (
          acc: { [x: string]: any },
          question: { question_id: string | number }
        ) => {
          acc[question.question_id] = question;
          return acc;
        },
        {}
      );

      // Object to hold the processed data
      const processedData: any = [];

      const filteredRawData = Object.keys(rawData)
        .filter((questionId) => dummyQuestionLookup.hasOwnProperty(questionId))
        .reduce((obj: any, key) => {
          obj[key] = rawData[key];
          return obj;
        }, {});

      console.log(
        rawData,
        dummyjson,
        dummyQuestionLookup,
        filteredRawData,
        "dummyQuestionLookupdummyQuestionLookup"
      );

      // Iterate over each question in rawData
      Object.entries(filteredRawData).forEach(([questionId, entries]) => {
        const answerCounts: any = {}; // Holds the counts of each answer_code

        // Count occurrences of each answer_code
        (entries as any).forEach((entry: any) => {
          entry.answer_code.forEach((code: string | number) => {
            if (!answerCounts[code]) {
              const matchingAnswer = dummyQuestionLookup[
                questionId
              ]?.answers.find(
                (a: { answer_pre_code: string | number }) =>
                  a.answer_pre_code == code
              );
              answerCounts[code] = {
                count: 1,
                answer_label: matchingAnswer
                  ? matchingAnswer.answer_text
                  : `Label for ${code}`,
              };
              console.log(
                dummyQuestionLookup,
                matchingAnswer,
                answerCounts[code],
                code,
                "answerCounts[code]answerCounts[code]"
              );
            } else {
              answerCounts[code].count++;
            }
          });
        });

        // Transform answerCounts into the desired array structure
        const answers = Object.keys(answerCounts).map((code) => ({
          answer_code: code,
          answer_text: answerCounts[code].answer_label,
          count: answerCounts[code].count,
        }));

        // Optionally, add any additional answers from Dummyjson not present in filteredRawData
        dummyQuestionLookup[questionId]?.answers.forEach(
          (answer: { answer_pre_code: string; answer_text: any }) => {
            if (!answerCounts[answer.answer_pre_code]) {
              answers.push({
                answer_code: answer.answer_pre_code,
                answer_text: answer.answer_text,
                count: 0, // Assuming these additional answers have not been selected
              });
            }
          }
        );

        // Add the processed question to the processedData array
        processedData.push({
          question_id: questionId,
          question_text: (entries as any)[0].question_label, // Assuming question_label is consistent across entries
          question_type_name: "single", // Assuming 'type' is always 'single' for this example
          answers,
        });
      });

      return processedData;
    };

    if (questionToProcess) {
      const data = processDatanew(
        groupQuestionsById(questionToProcess),
        dataToEdit
      );
      console.log(
        "groupedQuestionsgroupedQuestionsgroupedQuestions",
        data,
        groupQuestionsById(questionToProcess),
        QuestionToProcess
      );
      setQuestionWithAnswers(data);
      // if (data) {
      //     setTimeout(() => {
      //         const groupedQuestions = processData(data);
      //     }, 1000)
      // }
    }
  }, [questionToProcess]);

  useEffect(() => {
    function removeAllQuestionsForNonSelectedAnswers(
      questionToProcess: any[],
      dataToEdit: any[]
    ) {
      // Create a mapping from question_id to a Set of unselected answer_pre_codes
      const unselectedAnswersMap = dataToEdit.reduce((acc, question) => {
        const unselectedAnswers = question.answers
          .filter((answer: { is_selected: any }) => !answer.is_selected)
          .map((answer: { answer_pre_code: any }) => answer.answer_pre_code);
        acc[question.question_id] = new Set(unselectedAnswers);
        return acc;
      }, {});

      // Filter out users' responses if any of their answers match an unselected answer
      const filteredQuestionToProcess = questionToProcess.filter(
        (userResponse) => {
          return !userResponse.questions.some((question: any) => {
            const unselectedAnswers =
              unselectedAnswersMap[question.question_id];
            // Check if the user's answer is unselected
            return (
              unselectedAnswers && unselectedAnswers.has(question.answer_code)
            );
          });
        }
      );

      // For users retained, we keep their responses unchanged. Others are removed entirely.
      return filteredQuestionToProcess;
    }

    // Use the updated function with your data
    const updatedQuestionToProcess = removeAllQuestionsForNonSelectedAnswers(
      QuestionToProcess,
      dataToEdit
    );
    // @ts-ignore
    setQUestionToProgress(updatedQuestionToProcess);

    // Log or return the updated QuestionToProcess
    console.log(
      updatedQuestionToProcess,
      "updatedQuestionToProcessupdatedQuestionToProcess"
    );
  }, [dataToEdit]);

  useEffect(() => {
    // Check if questionLists is an array and has items
    if (Array.isArray(DummyJson?.questions) && DummyJson?.questions.length) {
      const excludedTypes = [
        "quantity",
        "date",
        "time",
        "opentext",
        "opentextlist",
        "numericlist",
      ];

      const filteredData = DummyJson?.questions.filter(
        (item) =>
          !excludedTypes.includes(item.question_type_name) &&
          item.question_variable_type !== "HIDDEN"
      );

      const updatedData = filteredData.map((item, index) => ({
        ...item,
        question_value: index + 1,
      }));

      const filterQuestions = (
        updatedData: any[],
        questionsToProcess: { questions: any[] }[]
      ) => {
        const questionsToKeep = new Set(
          questionsToProcess[0].questions.map((q) => q.question_id)
        );
        return updatedData.filter((question) =>
          questionsToKeep.has(question.question_id)
        );
      };

      const filteredDummyJsonQuestions = filterQuestions(
        updatedData,
        QuestionToProcess
      );

      if (filteredDummyJsonQuestions) {
        const transformedData = (filteredDummyJsonQuestions as any).map(
          (
            question: {
              question_value: any;
              question_id: any;
              question_text: any;
              question_type_id: any;
              answers: any[];
              question_variable_id: string;
              question_type_name: string;
            },
            index: number
          ) => ({
            question_value: question.question_value,
            question_id: question.question_id,
            // question_code: question.question_id,
            // question_label: question.question_id,
            question_code: question?.question_variable_id,
            question_label: question?.question_variable_id,
            question_type_name: question?.question_type_name,
            question_text: question.question_text,
            // adding new
            // question_variable_code: question?.question_variable_id,
            // question_variable_code: question?.question_variable_code,
            // question_agg_label: "Base:All Respondents",
            question_type_id: question.question_type_id,
            grouped_question_code: [],
            question_sort_order: index + 1,
            answers: question.answers.map((answer, index) => ({
              answer_id: answer.answer_id,
              answer_pre_code: answer.answer_pre_code,
              answer_text: answer.answer_text,
              answer_label: answer?.answer_text,
              answer_group_text: "",
              answer_weightage: 0,
              answer_sort_order: index + 1,
              is_selected: true,
              grouping_details: "",
            })),
          })
        );

        if (transformedData) {
          const sortedData = sortQuestions(transformedData, QuestionToProcess);
          setDataToEdit(sortedData);
          // setDataToEdit(prevData => [...prevData, ...transformedData]);
        }
      }
      // setAllQues(updatedData)
    }
  }, [DummyJson]);

  const toggleSelectedState = (
    questionId: string | number,
    answerPreCode: string
  ) => {
    setLoading(true);
    setDataToEdit((currentData) =>
      currentData.map((question) =>
        question.question_id === questionId
          ? {
            ...question,
            answers: question.answers.map((answer) =>
              answer.answer_pre_code === answerPreCode
                ? { ...answer, is_selected: !answer.is_selected }
                : answer
            ),
          }
          : question
      )
    );
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  console.log(
    chartTypes,
    "chartTypeschartTypes",
    DummyJson,
    questionsWithAnswers,
    chartsData,
    dataToEdit,
    questionToProcess
  );

  return (
    <>
      <ChartFilterModal
        questionLists={DummyJson}
        dataToEdit={dataToEdit}
        setDataToEdit={setDataToEdit}
        openPreTab={openPreTab}
        setPreTab={setPreTab}
        questionsWithAnswers={questionsWithAnswers}
        setQuestionWithAnswers={setQuestionWithAnswers}
      />
      {loading ? <LoadingSpinner /> : null}
      <FullScreen handle={screen1} onChange={reportChange}>
        <div
          id={fullViewMode ? "bodyBackground" : ""}
          style={{
            height: fullViewMode ? "100vh" : "calc(100vh - 243px)",
            width: fullViewMode ? "100vw" : "calc(100vw - 200px)",
            overflowY: "scroll",
          }}
        >
          <Box
            style={{
              width: "100%",
              display: "flex",
              marginBottom: "1rem",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6">Data Charts</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton size="small" onClick={() => openMainDialog()}>
                <TuneRoundedIcon />
              </IconButton>
              <IconButton size="small" onClick={(e) => handleClick(e)}>
                <img src={FileDownloadIcon} height="23px" />
              </IconButton>
              {open && (
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  {outputFiles ? (
                    outputFiles?.map(
                      (url: any, index: React.Key | null | undefined) => (
                        <MenuItem
                          key={index}
                          onClick={() =>
                            initiateDownload((url as any)?.file_url)
                          }
                        >
                          <DownloadForOfflineRoundedIcon
                            style={{ color: "#4CAF50", marginRight: "1rem" }}
                          />
                          {(url as any)?.filetype_name}
                        </MenuItem>
                      )
                    )
                  ) : (
                    <MenuItem onClick={handleClose} style={{ color: "red" }}>
                      No files found
                    </MenuItem>
                  )}
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
                    screen1.enter();
                  } else {
                    screen1.exit();
                  }
                }}
              >
                {!fullViewMode ? (
                  <FullscreenIcon
                    sx={{ color: theme.palette.grey[500], fontSize: "1.3rem" }}
                  />
                ) : (
                  <img src={FillIcon} height="20px" />
                )}
              </IconButton>
            </Stack>
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            style={{ width: "60vw", overflow: "auto" }}
          >
            {dataToEdit &&
              dataToEdit.map((question) =>
                question.answers.map((ans) => {
                  if (ans.is_selected === false) {
                    return (
                      <Tooltip title={question?.question_text}>
                        <span>
                          {" "}
                          <Chip
                            key={ans.answer_pre_code}
                            label={
                              <span>
                                <span style={{ fontWeight: "bold" }}>
                                  {question?.question_id}
                                </span>
                                {`: ${ans.answer_text}`}
                              </span>
                            }
                            variant="outlined"
                            onDelete={() =>
                              toggleSelectedState(
                                question.question_id,
                                ans.answer_pre_code
                              )
                            }
                          />
                        </span>
                      </Tooltip>
                    );
                  } else {
                    return null;
                  }
                })
              )}
          </Stack>
          {questionsWithAnswers && questionsWithAnswers?.length > 0 ? (
            <GridLayout
              // key={ }
              className="layout"
              layout={layout}
              cols={3}
              // rowHeight={300}
              width={width}
              onLayoutChange={onLayoutChange}
            >
              {questionsWithAnswers &&
                questionsWithAnswers?.map((question: any, index) => (
                  <div
                    key={`item${index}`}
                    className="grid-item"
                    style={{
                      padding: "1rem 1rem 1.3rem 1rem",
                      boxShadow:
                        "0px 2px 4px 0px rgba(232, 204, 255, 0.12), 0px 4px 12px 0px rgba(228, 152, 255, 0.25)",
                      background: "white",
                      borderRadius: "1rem",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Tooltip
                        title={
                          question?.question_text?.length > 60
                            ? question?.question_text
                            : ""
                        }
                      >
                        <p style={{ fontWeight: "bold" }}>
                          {question?.question_text?.length > 60
                            ? question?.question_text?.substring(0, 60) + "..."
                            : question?.question_text}
                        </p>
                      </Tooltip>
                      <Tooltip
                        key={`item-${index}`}
                        placement="right"
                        title={
                          <Box
                            style={{
                              backgroundColor: "#ffffff !important",
                              width: "100%",
                            }}
                          >
                            <Button
                              onClick={() => changeChartType(index, "bar")}
                            >
                              <BarChartRoundedIcon />
                            </Button>
                            <Button
                              onClick={() => changeChartType(index, "pie")}
                            >
                              <PieChartRoundedIcon />
                            </Button>

                            <Button
                              onClick={() => changeChartType(index, "donut")}
                            >
                              <DonutLargeRoundedIcon />
                            </Button>
                            <Button
                              onClick={() => changeChartType(index, "guage")}
                            >
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
                        }}
                      >
                        <MultilineChartIcon
                          style={{ color: "#8A16E5", cursor: "pointer" }}
                        />
                      </Tooltip>
                    </Box>
                    {/* <div id={`chartdiv-${index}`} style={{ width: "100%", height: "100%" }}></div> */}
                    {
                      (chartTypes as any)[index] === "bar" ? (
                        <StatisticsBarChartComponent
                          questionsWithAnswers={question}
                          index={index}
                          dataToEdit={dataToEdit}
                          setDataToEdit={setDataToEdit}
                        />
                      ) : (chartTypes as any)[index] === "pie" ? (
                        <StatisticsPieChartsComponent
                          questionsWithAnswers={question}
                          index={index} fullViewMode={fullViewMode} />
                      ) : (chartTypes as any)[index] === "donut" ? (
                        <StatisticsDonutChartComponent
                          questionsWithAnswers={question}
                          index={index} fullViewMode={fullViewMode} />
                      ) : (chartTypes as any)[index] === "guage" ? (
                        <StatisticsGuageChartComponent
                          questionsWithAnswers={question}
                          index={index} fullViewMode={fullViewMode}
                        />
                      ) : null
                      // <StatisticsLineChartComponent questionsWithAnswers={question} index={index} />
                    }
                  </div>
                ))}
            </GridLayout>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "2rem",
              }}
            >
              <Typography variant="h5">
                {!loading ? "No data to show" : null}
              </Typography>
            </Box>
          )}
        </div>
      </FullScreen>
    </>
  );
};

export default StatisticsContainerFilters;
