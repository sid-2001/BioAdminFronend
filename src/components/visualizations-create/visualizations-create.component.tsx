import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  TextField,
  Theme,
  Tooltip,
  Typography,

} from "@mui/material";
import { useEffect, useState } from "react";
import { QuestionNameInput } from "@/constants/cutom-question-name-input";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectDataService } from "@/services/project-data.services";
import { theme } from "@/constants/theme";
import { enqueueSnackbar } from "notistack";
import Select from "@/components/select";
import LoadingSpinner from "../loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { logger } from "@/helpers/logger";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import QuestionTypeIcon from "@/constants/questionTypeIcon";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Select as MultiSelect } from "@mui/material"
import VisualizationConfigurationsTable from "../visualization-configurations-table";



interface PipelinesCreateUpdateProps {
  PostDataVisualizations: (payload: any) => Promise<void>;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const VisualizationsCreateComponent: React.FC<PipelinesCreateUpdateProps> = ({
  PostDataVisualizations,
}) => {
  const { projectId, surveyId } = useParams();
  const navigate = useNavigate();

  const projectDataService = new ProjectDataService();
  const [loading, setLoading] = useState(false);

  const [openQuesModal, setOpenQuesModal] = useState(false);
  const [editConfig, setEditConfig] = useState(true)


  function CloseQuesModal() {
    setOpenQuesModal(false)
  }

  function OpenQuesModal() {
    setOpenQuesModal(true)
  }

  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  // const [open, setOpen] = useState(false);
  // function CustomPaper({ children, setOpen, }: { children?: React.ReactNode, setOpen: (open: boolean) => void, }) {
  //   return (
  //     <Paper >
  //       {children}
  //       <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "1rem", p: 1 }}>
  //         <Button variant="outlined" onClick={() => setOpen(false)} onMouseDown={(event) => {
  //           // Prevent input blur which triggers closing the Popper
  //           event.preventDefault();
  //         }}>Cancel</Button>
  //         <Button variant="contained" onClick={() => {
  //           // openDialog()
  //           setOpen(false)
  //         }} onMouseDown={(event) => {
  //           // Prevent input blur which triggers closing the Popper
  //           event.preventDefault();
  //         }}>Done</Button>
  //       </Box>
  //     </Paper>
  //   );
  // }



  const handleChange = (_event: any, newValue: any[]) => {
    // newValue contains the selected items
    const selectedIds = newValue.map((item: any) => item?.value)
    // console.log("selectedIdsselectedIdsselectedIds", newValue)
    setSelectedQuestions(selectedIds);

    //     return prevData.filter((question: any) => {
    //         if (typeof question.question_value === 'string' && question.question_value.startsWith('new-')) {
    //             const parts = question?.question_value?.split('-').slice(1); // "new-5-6-0" -> ["5", "6", "0"]
    //             // Check if any part matches, not every part
    //             return parts.some((part: any) => selectedIds.includes(Number(part)));
    //         }
    //         // Direct match for numbers
    //         return selectedIds.includes(question.question_value);
    //     });
    // });



    // setDataToEditForBackend(prevData => {
    //     return prevData.filter((question: any) => {
    //         if (typeof question.question_value === 'string' && question.question_value.startsWith('new-')) {
    //             const parts = question?.question_value?.split('-').slice(1); // "new-5-6-0" -> ["5", "6", "0"]
    //             // Check if any part matches, not every part
    //             return parts.some((part: any) => selectedIds.includes(Number(part)));
    //         }
    //         // Direct match for numbers
    //         return selectedIds.includes(question.question_value);
    //     });
    // });
  };

  const [selectBanners, setSelectBanners] = useState<string[]>([]);


  const handleMultiSelectChange = (event: any) => {
    const {
      target: { value },
    } = event;

    // console.log(value, "valuevalue")
    // setSelectBanners(value);
    setSelectBanners(typeof value === 'string' ? value.split(',') : value);
  };

  const [jobName, setJobName] = useState("");

  const [allTabulations, setAllTabulations] = useState<Array<any>>([]);
  const [tabulation, setTabulation] = useState<number>();

  const [tabulationData, setTabulationData] = useState<any>();

  const [bannerPointsList, setBannerpointsList] = useState<any>([])

  const [selectQuestionList, setSelectQuestionList] = useState<any>([]);

  const [questionList, setQuestionList] = useState<any>([]);
  const [dataToEdit, setDataToEdit] = useState<any[] | []>([])

  const service = new ProjectDataService();

  const handleRiskInputChange = async (event: { target: { value: any } }) => {
    setLoading(true)
    const selectedValue = event.target.value;

    setTabulation(selectedValue);
    const selectedOption = allTabulations.find(
      (option) => option.value == selectedValue
    );

    if (projectId && surveyId && selectedOption) {
      try {
        const data = await projectDataService.GetTabulationByProjectId(
          Number(projectId),
          Number(surveyId),
          selectedOption.object_uid
        );



        console.log(data, "dataqwert");
        if (!data) {
          enqueueErrorSnackbar("No tabulation found");
          return;
        }
        setTabulationData(data);
        const processBannerList = data && data?.banner_config?.length > 0 && data?.banner_config?.map((item: { question_value: any; question_text: any; question_code: any; question_label: any; grouped_question_code: any; }) => ({
          question_value: item?.question_value,
          question_text: item?.question_text,
          question_code: item?.question_code,
          question_label: item?.question_label,
          grouped_question_code: item?.grouped_question_code,
        }))
        if (processBannerList) {
          setBannerpointsList(processBannerList)
        }
        // empty states
        setDataToEdit([])
        setSelectBanners([])
        setSelectedQuestions([])
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
    } else {
      setLoading(false)
    }
  };

  // console.log(tabulationData, "tabulationData", bannerPointsList, tabulation)


  // console.log(selectQuestionList, "questionListquestionList", selectedQuestions);

  async function GetProjectBannerALLQuestions() {
    setLoading(true);

    try {
      const data = await service.getProjectBannerALLQuestions(
        Number(projectId),
        Number(surveyId)
      );

      if (data?.length > 0) {
        const excludedTypes = [
          "quantity",
          "date",
          "time",
          "numericlist",
        ];

        // const filteredData = data.filter(
        //   (item) =>
        //     !excludedTypes.includes(item.question_type_name) &&
        //     item.question_variable_type !== "HIDDEN" && (!item?.is_open_end_question || (item?.question_type_name == 'opentext' || item?.question_type_name == 'opentextlist'))
        // );

        const filteredData = data.filter(
          (item: any) =>
            (!excludedTypes.includes(item.question_type_name) &&
              item.question_variable_type !== "HIDDEN") &&
            !(item.question_type_name === 'opentext' || item.question_type_name === 'opentextlist') || (item.is_open_end_question && item.is_open_end_question != null && (item.question_type_name === 'opentext' || item.question_type_name === 'opentextlist'))
        );

        const questionsMap = new Map();
        filteredData.forEach(item => {
          if (item.question_type_name === "grid" && !questionsMap.has(item.question_id)) {
            questionsMap.set(item.question_id, item);
          } else if (item.question_type_name !== "grid") {
            questionsMap.set(item.question_id, item);
          }
        });

        const uniqueQuestions = Array.from(questionsMap.values());
        const updatedData = uniqueQuestions.map((item, index) => ({
          ...item,
          question_value: item.question_id,
          question_sort_order: index + 1
        }));
        setQuestionList(updatedData);

        // console.log(filteredData, "filteredDatafilteredData")

        // const updatedData = filteredData.map((item) => ({
        //   ...item,
        //   question_value: item.question_variable_id,
        // }));

        // setQuestionList(updatedData);

        if (Array.isArray(updatedData) && updatedData.length) {
          // console.log(updatedData, "questionListquestionListquestionListgffg")
          const serviceNames = updatedData.map((item) => ({
            // value: index + 1,
            value: item?.question_value,
            // value: item.question_value,
            text: item.question_id,
            label: item.question_value,
            question_text: item?.question_text,
            question_type_id: item?.question_type_id,
          }));
          setSelectQuestionList(serviceNames);
        }

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

  async function getAllTabulationData() {
    setLoading(true);

    try {
      const data = await projectDataService.GetAllTabulation(Number(projectId), Number(surveyId));

      if (data) {
        if (Array.isArray(data) && data.length > 0) {
          const serviceNames = data?.map((item) => ({
            value: item.id,
            text: item.name,
            label: item.name,
            object_uid: item?.object_uid,
            isDisabled: !item?.is_active
          }));

          setAllTabulations(serviceNames);
        }
      }
    } catch (error) {
      logger.error(error)
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

  function enqueueErrorSnackbar(message: string) {
    enqueueSnackbar(<Typography variant="body1">{message}</Typography>, {
      variant: "error",
    });
  }


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // const finalPayload = {
    //   visualization_name: jobName,
    //   tabulation: tabulation,
    //   banner_id: tabulationData?.banner_id,
    //   banner_name: tabulationData?.banner_name,
    //   selectedQuestions: selectedQuestions,
    //   config_payload: dataToEdit,
    // };

    const question_config = dataToEdit?.map((item) => ({
      question_id: item.question_id,
      question_code: item.question_code,
      question_type: item.question_type_name,
      chart_type: item.chart_type,
      is_demographic_question: item.is_demographic_question,
      box_analysis_type: item?.box_analysis_type,
      include_total: item?.include_total,
      run_nps: item?.run_nps,
      // box_analysis_type: false, need to add
      banner_points: item.banner_points,
      slide_type: item.slide_type,
      reverse_axis: item.reverse_axis,
      legend_position: item.legend_position
    }))

    const finalPayload = {
      name: jobName,
      version: '0.1-beta',
      tabulation_id: tabulation,
      question_config: question_config
    };
    console.log(finalPayload, "finalPayloadfinalPayload")
    PostDataVisualizations(finalPayload);
  };

  const AddQuestionToEdit = () => {
    const matchedQuestions = (questionList as any).filter((question: { question_value: string; }) =>
      selectedQuestions.includes(question.question_value)
    );

    console.log(selectQuestionList, questionList, selectedQuestions, matchedQuestions, "matchedQuestionsmatchedQuestionsmatchedQuestions")
    if (matchedQuestions) {
      const transformedData = (matchedQuestions as any).map((question: { question_value: any; question_id: any; question_text: any; question_type_id: any; answers: any[]; question_variable_id: string; question_type_name: string; }, index: number) => ({
        ...question,
        question_code: question?.question_id,
        question_label: question?.question_id,
        is_demographic_question: false,
        box_analysis_type: [],
        banner_points: selectBanners?.length > 0 ? selectBanners : [],
        slide_type: 'single',
        chart_type: 'Bar',
        reverse_axis: true,
        legend_position: 'top',

        run_nps: (question?.question_type_id == 1 || question?.question_type_id == 12 || question?.question_type_id == 13) && (question?.answers?.length == 4 || question?.answers?.length == 5 || question?.answers?.length == 7 || question?.answers?.length == 10) ? true : false,

        include_total: false,
        question_sort_order: index + 1,
        answers: question.answers.map((answer, index) => ({
          ...answer,
          answer_label: answer?.answer_text,
          answer_sort_order: index + 1,
          is_selected: true,
        })),
      }));

      setDataToEdit(prevData => {
        const updatedData = prevData
          .filter(question => transformedData.some((tq: { question_value: any; }) => tq.question_value === question.question_value)) // Keep only those that still exist in transformedData
        // .map(question => ({ // Ensure to update the details of kept questions if needed
        //   ...question,
        //   ...transformedData.find((tq: { question_value: any; }) => tq.question_value === question.question_value)
        // }));

        // Add new questions from transformedData not present in prevData
        transformedData.forEach((question: { question_value: any; }) => {
          if (!prevData.some(pd => pd.question_value === question.question_value)) {
            updatedData.push(question);
          }
        });

        return updatedData;
      });
    }
  }

  useEffect(() => {
    if (projectId && surveyId) {
      getAllTabulationData();
      GetProjectBannerALLQuestions();
    }
  }, [projectId, surveyId]);

  function truncateText(text: string, length: number) {
    if (text?.length <= length) {
      return text
    }
    return `${text.substr(0, length)}...`
  }

  console.log(selectedQuestions, "selectedQuestionsselectedQuestions", selectBanners, dataToEdit, selectQuestionList)

  return (
    <>
      {loading ? <LoadingSpinner /> : ""}

      <Dialog
        scroll="paper"
        onClose={CloseQuesModal}
        open={openQuesModal}
        // maxWidth="xxl"
        PaperProps={{
          style: {
            width: '40%',
            minHeight: '60%',
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
            Configure Visualization
          </DialogTitle>
          <Box style={{ display: "flex" }}>
            <IconButton onClick={CloseQuesModal} sx={{ width: "40px", height: "40px" }}  >
              <CloseOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
        <Box style={{ padding: "1rem 2rem 2rem 2rem", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "calc(100vh - 400px)" }}>

          <Grid container spacing={2}>
            <Grid item xs={12} style={{ padding: "0rem 0rem 2rem 1.5rem" }}>
              <Autocomplete
                multiple
                id="size-small-standard-multi"
                size="small"
                options={selectQuestionList}
                getOptionLabel={(option) => option.text}
                value={selectQuestionList.filter((question: { value: string; }) => selectedQuestions.includes(question.value))}
                onChange={handleChange}
                // open={open}
                // onOpen={() => setOpen(true)}
                disableCloseOnSelect
                // noOptionsText={'No options'}
                // onClose={() => setOpen(false)}
                // openOnFocus
                // selectOnFocus
                filterOptions={(options, { inputValue }) => {
                  return options?.filter(option =>
                    option?.text?.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option?.question_text?.toLowerCase().includes(inputValue.toLowerCase())
                  );
                }}
                renderOption={(props, option,) => (
                  <>
                    <li {...props} style={{ padding: "0rem 1rem", minHeight: "0px " }}>
                      <ListItemIcon  >
                        {option?.question_type_id == 4 ?
                          <VisibilityOffIcon style={{ color: "#5f5f5f" }} />
                          :
                          <QuestionTypeIcon typeId={Number(option?.question_type_id)} />
                        }                                            </ListItemIcon>
                      <div  >
                        <ListItemText primary={option.text} style={{ padding: "0rem", minHeight: "0px", margin: "0.1rem" }} />
                        <ListItemText primary={option.question_text} style={{ padding: "0rem", minHeight: "0px", margin: "0.1rem" }} />
                      </div>
                    </li>
                    {/* <Paper style={{ display: selectQuestionList[selectQuestionList?.length - 1]?.value == option?.value ? 'auto' : "none", }} >
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "1rem", p: 1 }}>
                        <Button variant="outlined" onClick={() => setOpen(false)} onMouseDown={(event) => {
                          // Prevent input blur which triggers closing the Popper
                          event.preventDefault();
                        }}>Cancel</Button>
                        <Button variant="contained" onClick={() => {
                          // openDialog()
                          setOpen(false)
                        }} onMouseDown={(event) => {
                          // Prevent input blur which triggers closing the Popper
                          event.preventDefault();
                        }}>Done</Button>
                      </Box>
                    </Paper> */}
                  </>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Questions"
                    placeholder="Search Questions"
                  />
                )}


                sx={{
                  '& .MuiAutocomplete-inputRoot': {
                    flexWrap: 'nowrap !important',
                    overflowX: 'auto',
                  },
                  '& .MuiAutocomplete-tag': {
                    margin: '2px',
                    flexShrink: 0,
                  },
                  '& .MuiAutocomplete-tagList': {
                    display: 'flex',
                    flexDirection: 'row',
                    overflowX: 'auto',
                    flexWrap: 'nowrap',
                  },
                  '& .MuiAutocomplete-paper': {
                    overflow: 'visible',
                  },
                  '& .MuiAutocomplete-endAdornment': {
                    position: 'relative',
                    right: 0,
                    display: 'none',
                  },
                  '.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot': {
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :nth-last-child(-n+2)': {
                      flexBasis: '100%',
                      width: '100%',
                    },
                  },
                }}
              />

            </Grid>
            <Grid item xs={12} style={{ padding: "0rem 0rem 1rem 1.5rem" }}>
              {/* <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel id="demo-multiple-checkbox-label">Select Banners</InputLabel> */}
              <Box
                style={{
                  width: "100%",
                  padding: "0rem 0.5rem 0.5rem 0rem",
                }}
              >
                <label style={{ marginLeft: "5px", fontSize: '12px', color: theme.palette.grey[500] }}>Banners</label>

                <MultiSelect
                  style={{ width: "100%" }}
                  size="small"
                  multiple
                  value={selectBanners}
                  onChange={(e) => handleMultiSelectChange(e)}
                  input={<OutlinedInput />}
                  renderValue={(selected) => selected.join(', ')}

                  // renderValue={(selected) => {
                  //   return selected.map(value => {
                  //     const selectedOption = crossJoin1.find(option => option.value == value)
                  //     return selectedOption ? selectedOption?.text : value
                  //   }).join(', ')
                  // }}

                  MenuProps={MenuProps}
                // inputProps={{ 'aria-label': 'Without label' }}
                >
                  {bannerPointsList && bannerPointsList?.map((option: any) => (
                    <MenuItem
                      key={option?.question_value}
                      value={option?.question_label}
                      style={getStyles(option?.question_code, [String(option.question_text)], theme)}
                      sx={{ padding: "0rem 1rem", minHeight: "0px " }}
                    >
                      <ListItemIcon>
                        {option?.question_type_id == 4 ?
                          <VisibilityOffIcon style={{ color: "#5f5f5f" }} />
                          :
                          <QuestionTypeIcon typeId={Number(option?.question_type_id)} />
                        }                                                </ListItemIcon>
                      <div  >
                        <ListItemText primary={option.question_label} style={{ padding: "0rem", minHeight: "0px", margin: "0.1rem" }} />
                        <ListItemText primary={option.question_text} style={{ padding: "0rem", minHeight: "0px", margin: "0.1rem" }} />
                      </div>
                    </MenuItem>
                  ))}
                </MultiSelect>
              </Box>
              {/* </FormControl> */}
            </Grid>
          </Grid>

          <Box style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1rem", marginTop: "auto", }}>
            <Button variant="outlined" onClick={() => {
              // setSelectPairs([{ joinIds: [] }])
              CloseQuesModal()
            }}>Cancel</Button>
            <Button variant="contained" onClick={() => {
              AddQuestionToEdit()
              CloseQuesModal()
            }}>Done</Button>
          </Box>
        </Box>

      </Dialog>
      <form onSubmit={handleSubmit}>
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
            sx={{
              marginBottom: "0.5rem",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 2rem 0rem 1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <IconButton
                sx={{
                  paddingLeft: "0",
                }}
                onClick={() => {
                  navigate(`/projects/${projectId}/survey/${surveyId}/data/data-visualization`);
                }}
              >
                <ArrowBackIcon width={16} height={16} />
              </IconButton>
              <Typography variant="h3">
                Create New Visualization
              </Typography>
            </Box>

            <Box
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <Button
                onClick={() => {
                  navigate(`/projects/${projectId}/survey/${surveyId}/data/data-visualization`);
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  jobName &&
                    tabulationData
                    ? false
                    : true
                }
              >
                Submit
              </Button>
            </Box>
          </Box>

          <Box style={{ padding: "0rem 2rem 2rem 2rem" }}>
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={3.5}>
                <QuestionNameInput
                  placeholder="Visualization Name*"
                  className="base-comp-question_code-input"
                  size="small"
                  fullWidth
                  sx={{ "& .MuiInputBase-input": { fontWeight: 700 } }}
                  value={jobName}
                  onChange={(e) => setJobName(e?.target.value)}
                />
              </Grid>

              <Grid item xs={3.5}>

                <Select
                  className="configuration-box-select"
                  value={tabulation}
                  items={allTabulations}
                  onChange={handleRiskInputChange}
                  label="Tabulations*"
                  name="answer_sorting_order"
                  isRequired={true}
                  size="small"
                />
              </Grid>

              <Grid item xs={3.5}>
                <Box
                  style={{
                    width: "100%",
                    padding: "0rem 0.5rem 0.5rem 0rem",
                  }}
                >
                  <label style={{ marginLeft: "5px", fontSize: tabulationData?.banner_name ? "10px" : '16px', color: theme.palette.grey[500] }}>Banner</label>
                  <Tooltip title={tabulationData?.banner_name?.length > 50 ? tabulationData?.banner_name : null} >
                    <Typography style={{ fontSize: "16px" }}>
                      {tabulationData?.banner_name ? tabulationData && truncateText(tabulationData?.banner_name, 50) : ''}
                    </Typography>
                  </Tooltip>

                </Box>
              </Grid>
            </Grid>
            <Box style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end", }}>
              <Button onClick={() => OpenQuesModal()} disabled={!tabulation}>
                + Questions
              </Button>
            </Box>
            <VisualizationConfigurationsTable
              dataToEdit={dataToEdit}
              setDataToEdit={setDataToEdit}
              // questionTypesList={questionTypes}
              editConfig={editConfig} setEditConfig={setEditConfig}
              bannerPointsList={bannerPointsList}
              setLoading={setLoading}
            />
          </Box>
        </Box>
      </form >
    </>
  );
};

export default VisualizationsCreateComponent;
