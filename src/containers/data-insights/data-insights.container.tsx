// import { useParams, useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState } from 'react'
// import { useParams } from "react-router-dom"
import { useSnackbar } from 'notistack'
import { Box, IconButton, Menu, MenuItem, Stack, Typography, Grid } from '@mui/material'
import LoadingSpinner from '@/components/loader'
// import DataTabulationPage from "@/pages/data-tabulation"

import { CommentIcon, FileDownloadIcon, FillIcon } from '@/assets/images'
import { theme } from '@/constants/theme'
// import { SettingsOutlined } from "@mui/icons-material";
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { useOutletContext, useParams } from 'react-router'
import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { DetailsBox } from '@/components/tabulation-list/tabulation-list.style'
import LeftList from './leftList'
// import DUMMY_DATA from "./demographic.json";
import Slide from './slide'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// import { InsightsService } from "@/services/data-insights";
import { Question, SurveyData } from '@/types/data-insights.type'
import SwiperCore from 'swiper'

import { Pagination, Keyboard } from 'swiper/modules'
import axios from 'axios'
import { ProjectDataService } from '@/services/project-data.services'
import SlideDemo from './slide-demo'

SwiperCore.use([Pagination, Keyboard])

function ProjectTabulationInsightsContainer() {
  const { outputFiles } = useOutletContext<any>()
  //   const insightsService = new InsightsService();
  const projectDataServices = new ProjectDataService()
  const { enqueueSnackbar } = useSnackbar()

  const { projectId, surveyId, pipelineId, runId } = useParams()

  // console.log(allRunsByRunId, "sdvsfdoadspsidj");

  const [loading, setLoading] = useState(false)
  const [fullViewMode, setFullViewMode] = useState(false)
  const [hide, setHide] = useState(false)
  const [insight, setInsight] = useState<null | SurveyData>(null)
  const [activeIndex, setActiveIndex] = useState(0)


  function chunkArrayIntoObjects(array: string | any[], chunkSize: number) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      chunks.push({ group: chunk });
    }
    return chunks;
  }

  // function mergeBannersInQuestions(questions: Question[]) {
  //   return questions.map(question => {
  //     if (!question.banners || question.banners.length === 0) {
  //       return question;
  //     }

  //     const firstBanner = question.banners[0];
  //     let combinedBannerNames = firstBanner?.banner_name;

  //     question?.banners?.slice(1).forEach((banner, index, array) => {
  //       combinedBannerNames += ` ${((array?.length - 1) == index) ? 'And' : ', '} ${banner?.banner_name}`
  //       banner.variables.forEach((variable) => {
  //         const matchingVariable = firstBanner?.variables?.find((v: { variable_name: string }) => v?.variable_name === variable?.variable_name);
  //         if (matchingVariable) {
  //           matchingVariable.answer = [
  //             ...matchingVariable?.answer,
  //             ...variable?.answer
  //           ];
  //         } else {
  //           firstBanner?.variables?.push(variable);
  //         }
  //       });
  //     });
  //     firstBanner.banner_name = question?.type == 'grid' && question?.is_demographic_question == false ? '' : `${question?.question_id} By ${combinedBannerNames}`;

  //     question.banners = [firstBanner];
  //     return question;
  //   });
  // }

  // console.log(!'hello_NPS'.endsWith('_NPS'), "processedQuestionsprocessedQuestions")

  function mergeBannersInQuestions(questions: Question[]) {
    return questions.map(question => {

      // if (question?.type == 'opentext') {

      // }
      // Handle NPS questions specifically
      if (question.question_id.endsWith('_NPS') && question?.variables) {
        question && question?.variables?.forEach(variable => {
          variable.answer = variable.answer || [];
          if (variable.nps !== undefined) {
            variable.answer.push({ answer_label: variable?.variable_name, count: variable.nps });
            delete variable.nps;
          }
        });
        // @ts-ignore
        question.banners = [{ variables: question.variables }];
        question.question_title = question.question_id;
        // question.question_id = question.question_id.replace('_NPS', '');
      }
      // console.log(question, "12345")

      if (!question.banners || question.banners.length === 0) {
        return question;
      }


      const firstBanner = question.banners[0];
      let combinedBannerNames = firstBanner.banner_name || "";

      question.banners.slice(1).forEach((banner, index, array) => {
        combinedBannerNames += ` ${index === array.length - 1 ? 'And' : ', '} ${banner.banner_name}`;

        banner.variables.forEach(variable => {
          const matchingVariable = firstBanner.variables.find(v => v.variable_name === variable.variable_name);
          if (matchingVariable) {
            matchingVariable.answer = [...matchingVariable.answer, ...variable.answer];
          } else {
            firstBanner.variables.push(variable);
          }
        });
      });

      firstBanner.banner_name = question.type === 'grid' && !question.is_demographic_question
        ? ''
        : `${question.question_id} By ${combinedBannerNames}`;

      question.banners = [firstBanner];

      // console.log(question, "questionquestionquestionsdfghjk")

      // Handle questions ending with NPS
      // if (question.question_id.endsWith('NPS')) {
      //   alert('fghjk')
      //   question.variables.forEach(variable => {
      //     variable.answer = variable.answer || [];
      //     variable.answer.push({ answer_label: "NPS", count: variable.nps });
      //     delete variable.nps;
      //   });
      //   question.question_id = question.question_id.replace('_NPS', '');
      // }

      return question;
    });
  }






  async function getInsights1() {
    setLoading(true)
    if (projectId && surveyId && pipelineId && runId) {
      try {
        // const jobLogs = allRunsByRunId?.logs?.filter((item: { job_type_id: number }) => item?.job_type_id == 9)
        // const filePath = jobLogs?.[0]?.output_files?.[0]?.file_path

        // const datafile = await projectDataServices.GetOutPutFileByJobId(Number(projectId), Number(surveyId), Number(pipelineId), Number(runId), 9)

        // console.log(datafile?.output_path, "datadata")

        // const url = `https://bbprodstorageeus.blob.core.windows.net/account-7/p/p-79/s/s-55/dp/491/dch-491/dch-ins2-491-output.json`

        // const { data } = await axios.get(url)
        // const data = DUMMY_DATA

        const datafile = await projectDataServices.GetOutPutFileByJobId(Number(projectId), Number(surveyId), Number(pipelineId), Number(runId), 9)

        // console.log(datafile?.output_path, "datadata")

        const { data } = await axios.get(datafile?.output_path)


        // console.log(data, "datadata")

        // const data = DUMMY_DATA

        // const questionsWithAnswers =
        //   data &&
        //   data?.questions?.filter(
        //     (question: any) => (question?.answer && question?.answer.length > 0 && (question.type == "single" || question.type == "multi")) || (question?.answers && question?.answers.length > 0 && (question.type == "single" || question.type == "multi")) || (question?.variables && question?.variables.length > 0 && question.type == "grid"),
        //   );



        if (data && data?.questions?.length > 0) {

          const demographicQuestions = data.questions.filter((question: { is_demographic_question: boolean }) => question.is_demographic_question);

          const nonDemographicQuestions = data.questions.filter((question: { is_demographic_question: boolean; banners: any; insights: any; question_id: string; type: string; }) => !question.is_demographic_question && (question?.banners && question?.banners?.length > 0 || question?.insights && question?.insights?.length > 0 || question.question_id?.endsWith('_NPS') || question?.type == 'opentext'));
          // const nonDemographicQuestions = data.questions.filter((question: { is_demographic_question: boolean; banners: any }) => !question.is_demographic_question);

          // Example usage: Log to console or set to state
          // console.log(demographicQuestions, "Demographic Questions");
          // console.log(nonDemographicQuestions, "Non-Demographic Questions");

          const processedQuestions = mergeBannersInQuestions(nonDemographicQuestions);
          // console.log(processedQuestions, "processedQuestionsprocessedQuestions");


          // const mergedQuestions = mergeBannersInQuestions(nonDemographicQuestions);
          // console.log(mergedQuestions, "mergedQuestionsmergedQuestions", nonDemographicQuestions);


          const chunkedDemographicQuestions = chunkArrayIntoObjects(demographicQuestions, 4);

          // Example usage: Log to console or set to state
          // console.log(chunkedDemographicQuestions, "Chunked Demographic Questions");


          // const questionsWithAnswers = data && data.questions?.filter((question: any) => {
          //   const isDemographic = question.is_demographic_question || false;

          //   if (isDemographic) {
          //     return question?.answer && question?.answer?.length > 0
          //   } else {
          //     return question?.banners && question?.banners?.length > 0;
          //   }
          // }).sort((a: any, b: any) => {
          //   return (b.is_demographic_question || false) - (a.is_demographic_question || false);
          // });

          // console.log(data, "datadatadata", questionsWithAnswers)
          const updatedData = {
            ...data,
            questions: [...chunkedDemographicQuestions, ...processedQuestions]
          };

          setInsight(updatedData)
        }

        setLoading(false)
      } catch (error) {
        enqueueSnackbar('An error occurred. Please try again.', {
          variant: 'error',
        })
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    // getInsights()
    getInsights1()
  }, [projectId, surveyId, pipelineId, runId])

  // outputfiles123
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
    // setDownloadFiles([])
  }

  const initiateDownload = (url: string | URL | undefined) => {
    // This will open the file in a new tab and start the download
    window.open(url, '_blank')

    // Close the menu after initiating the download
    handleClose()
  }

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

  const swiperRef = useRef<any>(null)

  function swipeTo(index: number) {
    setActiveIndex(index)
    if (swiperRef && swiperRef.current && swiperRef.current.swiper) {
      swiperRef?.current?.swiper.slideTo(index)
    }
  }

  // console.log(loading, "sadzxsdesdc", insight);

  return (
    <FullScreen handle={screen1} onChange={reportChange}>
      <div id={fullViewMode ? 'bodyBackground' : ''}
        style={{
          padding: fullViewMode ? '1rem' : "0rem", background: fullViewMode ? "white" : "none",
        }}>
        <Box
          style={{
            width: '100%',
            zIndex: 500,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            background: fullViewMode ? 'white' : 'none',
          }}
        >
          <Typography variant="h6">Insights</Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton size="small">
              <img src={CommentIcon} height="23px" />
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
                  'aria-labelledby': 'basic-button',
                }}
              >
                {outputFiles ? (
                  outputFiles?.map((url: any, index: React.Key | null | undefined) => (
                    <MenuItem key={index} onClick={() => initiateDownload((url as any)?.file_url)}>
                      <DownloadForOfflineRoundedIcon style={{ color: '#4CAF50', marginRight: '1rem' }} />
                      {(url as any)?.filetype_name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem onClick={handleClose} style={{ color: 'red' }}>
                    No files found
                  </MenuItem>
                )}
              </Menu>
            )}
            {/* <IconButton size="small">
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
              {!fullViewMode ? <FullscreenIcon sx={{ color: theme.palette.grey[500], fontSize: '1.3rem' }} /> : <img src={FillIcon} height="20px" />}
            </IconButton>
          </Stack>
        </Box>
        {loading ? (
          <LoadingSpinner />
        ) : insight?.questions ? (
          <Box style={{ background: fullViewMode ? 'white' : 'none', height: fullViewMode ? '100vh' : 'auto' }}>
            <Grid container spacing={2}>
              <Grid item xs={hide ? 0.2 : 1.8} sx={{ position: 'relative' }}>
                <IconButton
                  onClick={() => {
                    setHide(!hide)
                  }}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: hide ? '22px' : '40px',
                    zIndex: 5,
                    right: '-10px',
                    background: '#E4E4E4',
                    padding: '1px',
                  }}
                >
                  {!hide ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
                </IconButton>
                <Box sx={{ display: hide ? 'none' : '' }}>
                  <LeftList slideTo={swipeTo} data={insight} fullViewMode={fullViewMode} activeIndex={activeIndex} />
                </Box>
              </Grid>
              <Grid item xs={hide ? 11.8 : 10.2}>
                <DetailsBox
                  sx={{
                    paddingTop: '1rem',
                    height: fullViewMode ? 'calc(100vh - 100px)' : 'calc(100vh - 292px)',
                    overflow: 'auto',
                    padding: '4px 24px',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: '700',
                      lineHeight: '30px',
                      letterSpacing: '3px',
                      textTransform: 'uppercase',
                      // marginBottom: '1rem',
                    }}
                  >
                    {insight?.project_name}
                  </Typography>
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    // onSlideChange={(obj) => {
                    //   if (obj && obj.activeIndex >= 0) {
                    //     setActiveIndex(obj.activeIndex)
                    //   }
                    // }}
                    onSwiper={(swiper) => console.log(swiper)}
                    ref={swiperRef}
                    // navigation
                    pagination={{ clickable: true, dynamicBullets: true, dynamicMainBullets: 4 }}
                    keyboard={true}
                  >
                    {insight && insight?.questions?.map((question, i) => (
                      <SwiperSlide key={i}>
                        {
                          question?.group ?
                            <SlideDemo height={fullViewMode ? 182 : 376} question={question?.group} index={i} fullViewMode={fullViewMode} />
                            :
                            <Slide height={fullViewMode ? 182 : 376} question={question} index={i * Math?.random()} />
                        }
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </DetailsBox>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '2rem',
            }}
          >
            <Typography variant="h5">No data to show !</Typography>
          </Box>
        )}
      </div>
    </FullScreen>
  )
}

export default ProjectTabulationInsightsContainer
