// import Card from "@/components/card"

// import { useEffect, useState } from "react"
// import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import { Box, Button, FormControlLabel, Grid, IconButton, Menu, MenuItem, Stack, Switch, SwitchProps, Tooltip, Typography } from '@mui/material'
// import { GridContainerProject } from "@/styles/grid"
// import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined"
// import PriorityHighIcon from "@mui/icons-material/PriorityHigh"
// import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled"
// import { ProjectDataService } from "@/services/project-data.services"
// import ArrowBackIcon from "@mui/iconsss-material/ArrowBack"
import LoadingSpinner from '@/components/loader'
// import DataTabulationPage from "@/pages/data-tabulation"
import { JSONData } from '@/types/project-data.type'
import { FillIcon, RefreshIcon } from '@/assets/images'
import { theme } from '@/constants/theme'
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined'
// import { SettingsOutlined } from "@mui/icons-material"
import TabulationListComponent from '@/components/tabulation-list'
import { DetailsBox } from '@/components/tabulation-list/tabulation-list.style'
// import DataTabulationCountTableListContainer from "../../pages/data-tabulation/dataTabulationCountTableListContainer"
// import DataTabulationPercentTableComponent from "../../pages/data-tabulation/dataTabulationPercentTableComponent"
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
// import { useOutletContext } from 'react-router'
// import moment from 'moment';
// import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded';
import DataTabulationCountTablePublsihedContainer from '@/pages/data-tabulation-published/dataTabulationCountTableListPublishedContainer'
import DataTabulationPercentageTablePublishedContainer from '@/pages/data-tabulation-published/dataTabulationPercentTablePublishedComponent'

// import CancelIcon from '@mui/icons-material/Cancel';

// import * as XLSX from 'xlsx';
// import { ProjectService } from '@/services/projects.service'
import { styled } from '@mui/material/styles';
import { ProjectDataService } from '@/services/project-data.services'


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

// const BackGroundColor = (bgId: any) => {
//   if (bgId == 1) {
//     return "#b2bdf38b"
//   } else if (bgId == 2) {
//     return "#F2EAA5"
//   } else if (bgId == 3) {
//     return "#FFD8AA"
//   } else if (bgId == 4) {
//     return "#D9D9D9"
//   } else if (bgId == 5) {
//     return "#7AFCCD"
//   } else if (bgId == 6) {
//     return "#76DDB7"
//   } else if (bgId == 7) {
//     return "#FFE4FF"
//   }
// }

// function mapRequestState(id: number) {
//   if (id === 1) return "OPEN"
//   else if (id === 3) return "APPROVED"
//   else return "REJECTED"
// }

const initialData: JSONData = {
  name: '',
  tables: [],
}
//

function ProjectTabulationPublishedContainer() {
  // const { allRunsByRunId } = useOutletContext<any>()
  // console.log(dataExportConfig, "dataExportConfigdataExportConfig")

  // const location = useLocation()

  // const navigate = useNavigate()
  const { projectId, surveyId, pipelineId, runId } = useParams()

  const service = new ProjectDataService()
  const [outputFiles, setOutputFiles] = useState([])

  const [loading, setLoading] = useState(true)

  // const [_objectId, setObjectId] = useState<String>("")
  const [viewMode, setViewMode] = useState(false)
  const [tabulationCardData, setTabulationCardData] = useState<JSONData>(initialData)
  const [value, setValue] = useState(1)
  const [hide, setHide] = useState(false)
  const [fullViewMode, setFullViewMode] = useState(false)

  const [weightedData, setWeightedData] = useState(false)
  const [useNested, setUseNested] = useState(false)

  const [isWeightedData, setIsWeighted] = useState(false)

  const countListRef = useRef<any>()
  const percentListRef = useRef<any>()
  // const _projectService = new ProjectService()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    // setDownloadFiles([])
  };

  const initiateDownload = (url: string | URL | undefined) => {
    window.open(url, "_blank");
    handleClose();
  };

  // console.log(useNested, "useNesteduseNested")
  // outputfiles123
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);
  // const handleClick = (event: any) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  //   // setDownloadFiles([])
  // };

  // const initiateDownload = (url: string | URL | undefined) => {
  //   // This will open the file in a new tab and start the download
  //   window.open(url, '_blank');

  //   // Close the menu after initiating the download
  //   handleClose();
  // };

  // async function getAllTabulationData() {
  //   setLoading(true)

  //   try {
  //     const data = await service.GetAllTabulation(Number(projectId))
  //     // data.splice(1, 2)
  //     if (data?.length > 1) {
  //       setRequests(data)
  //     } else {
  //       getTabulationDataById(data[0].output_file_url)
  //     }
  //   } catch (error) {
  //     enqueueSnackbar(
  //       <Typography variant='body1'>Fetching requests failed</Typography>,
  //       {
  //         variant: "error",
  //       },
  //     )
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  function refreshData() {
    // let service = new ProjectDataService()
    // service.refreshDataRequest(Number(projectId))
  }

  // async function fetchAndParseXLSX(url) {
  //   try {
  //     const response = await fetch(url);
  //     const data = await response.arrayBuffer();
  //     const workbook = XLSX.read(data, { type: 'buffer' });
  //     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //     const jsonData = XLSX.utils.sheet_to_json(worksheet);
  //     return jsonData;
  //   } catch (error) {
  //     console.error("Error fetching or parsing XLSX:", error);
  //   }
  // }

  // useEffect(() => {
  //   if (requests[0]?.output_file_url) {
  //     const data = fetchAndParseXLSX(requests[0]?.output_file_url)
  //     console.log(data, "datadatadata")
  //   }

  // }, [requests])

  async function getTabulationDataById() {
    setLoading(true)
    try {
      // let data = await service.GetTabulationByProjectId(
      //   Number(projectId),
      //   object_uid,
      // )
      const data1 = await service.GetPublsihedTabulation(Number(projectId), Number(surveyId), Number(pipelineId), Number(runId))
      console.log(data1, "datadatadatadata")
      setOutputFiles(data1)


      let jsonurl = data1[weightedData ? 1 : 0]?.output_path

      if (data1[1]?.output_path) {
        setIsWeighted(true)
      } else {
        setIsWeighted(false)
      }

      const response = await fetch(jsonurl)
      const data = await response?.json()

      if (data?.tables?.length > 0) {
        data?.tables?.forEach((d: any, i: any) => {
          d['index'] = i
        })
        // console.log(data, 'sadx,..,adsdas,.ads/ad')
        // data?.tables[35]?.rows?.forEach((row: any) => {
        //   row?.columns?.forEach((column: any) => {
        //     if (column) {
        //       column.group_name = column?.name
        //       column.name = ''
        //     }
        //   })
        // })
        data?.tables?.forEach((table: any) => {
          table?.rows?.forEach((row: any) => {
            row?.columns?.forEach((column: any) => {
              if (column && column.group_name === '' && column.name !== 'Total') {
                column.group_name = column?.name
                column.name = ''
              }
            })
          })
        })

        setTabulationCardData(data)
        setViewMode(true)
      } else {
        enqueueSnackbar(<Typography variant="body1">No tabulation found</Typography>, {
          variant: 'error',
        })
      }
      setTimeout(() => {
        setLoading(false)
      }, 200)
    } catch (error) {
      enqueueSnackbar(<Typography variant="body1">Fetching requests failed</Typography>, {
        variant: 'error',
      })
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 200)
    }
  }

  // console.log(tabulationCardData, tabulationCardData?.tables?.length, 'tabulationCardDatatabulationCardData', allRunsByRunId)

  useEffect(() => {
    // let tabUrl =
    //   allRunsByRunId?.logs?.filter((item: { job_type_id: number }) => item?.job_type_id == 4)[0] &&
    //   allRunsByRunId?.logs?.filter((item: { job_type_id: number }) => item?.job_type_id == 4)[0]?.output_files &&
    //   allRunsByRunId?.logs?.filter((item: { job_type_id: number }) => item?.job_type_id == 4)[0]?.output_files[0]?.file_path
    // if (tabUrl) {
    getTabulationDataById()
    // } else {
    //   setLoading(false)
    // }
    // getAllTabulationData()
  }, [surveyId, projectId, pipelineId, runId, weightedData])

  const navigateToIndex = (tableId: number) => {
    if (value === 1) {
      countListRef?.current?.scrollToItem(tableId, 'start')
      //navigateTo Count
    } else {
      // navigateTo Percent
      percentListRef?.current?.scrollToItem(tableId, 'start')
    }
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

  console.log(outputFiles, "outputFilesoutputFiles")

  return (
    <FullScreen handle={screen1} onChange={reportChange}>
      <div id={fullViewMode ? 'bodyBackground' : ''}
        style={{
          padding: fullViewMode ? '1rem' : "0rem", background: fullViewMode ? "white" : "none",
        }}>
        {loading ? <LoadingSpinner /> : null}
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
          <Stack direction="row" alignItems="center" spacing={2}>
            {viewMode ? (
              <Box
                sx={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  {/* {requests && requests?.length > 1 &&
                    <IconButton
                      sx={{
                        paddingLeft: "0",
                      }}
                      onClick={() => setViewMode(false)}
                    >
                      <ArrowBackIcon width={16} height={16} />
                    </IconButton>
                  } */}
                  <Typography variant="h3">{tabulationCardData?.name || ''}</Typography>
                </Stack>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setValue(1)
                  }}
                  sx={{
                    borderRadius: '16px !important',
                    color: value === 1 ? 'white' : 'black',
                    background: value === 1 ? 'black' : 'white',
                    '&:hover': {
                      color: value === 1 ? 'white !important' : '',
                      background: value === 1 ? 'black !important' : '',
                    },
                  }}
                >
                  Count
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setValue(2)
                  }}
                  sx={{
                    borderRadius: '16px !important',
                    color: value === 2 ? 'white' : 'black',
                    background: value === 2 ? 'black' : 'white',
                    '&:hover': {
                      color: value === 2 ? 'white !important' : '',
                      background: value === 2 ? 'black !important' : '',
                    },
                  }}
                >
                  Percentage
                </Button>
              </Box>
            ) : (
              <Typography variant="h6">Tabulations</Typography>
            )}
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton size="small" onClick={refreshData}>
                <img src={RefreshIcon} height="18px" />
              </IconButton>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 400,
                  color: theme.palette.grey[600],
                }}
              >
                {/* 2h ago */}
                {/* {moment(dataExportConfig?.published_time).fromNow()} */}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>

            {isWeightedData &&
              <FormControlLabel style={{ margin: "0px", color: '#8E27D7' }}
                control={<IOSSwitch size="small" sx={{ marginLeft: 1, marginRight: 1 }} checked={weightedData} onChange={() => setWeightedData(!weightedData)} />}
                label="Weighted" labelPlacement="start"
              />
            }

            <FormControlLabel style={{ color: '#8E27D7' }}
              control={<IOSSwitch size="small" sx={{ m: 1 }} checked={useNested} onChange={() => {
                setUseNested(!useNested)
              }} />}
              label={useNested ? 'View 2' : 'View 1'} labelPlacement="start"
            />

            <IconButton size="small" onClick={e => handleClick(e)}>
              {/* <img src={FileDownloadIcon} height="23px" /> */}
              <GetAppOutlinedIcon />
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
                {outputFiles?.length > 0 ? (
                  outputFiles?.map((url: any, index: React.Key | null | undefined) => (
                    <MenuItem key={index} onClick={() => initiateDownload((url as any)?.output_path)}>
                      {/* <DownloadForOfflineRoundedIcon style={{ color: "#4CAF50", marginRight: "1rem" }} /> */}
                      {(url as any)?.name.charAt(0).toUpperCase() + (url as any)?.name.slice(1).toLowerCase()}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem onClick={handleClose} style={{ color: "red" }}>
                    No files found
                  </MenuItem>
                )}
              </Menu>
            )}
            {/* <Tooltip title="Data Tabulation Output Download File">
              <IconButton size="small">
                <GetAppOutlinedIcon
                  sx={{ color: theme.palette.grey[500], fontSize: '1.3rem' }}
                  onClick={async () => {
                    setLoading(true)
                    if (projectId && surveyId)
                      try {
                        const response = await _projectService.downloadProjectPipeline(Number(projectId), Number(surveyId), Number(pipelineId), Number(runId))
                        fetch(response.output_file)
                          .then((response) => response.blob())
                          .then((blob) => {
                            const url = window.URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = response.file_name
                            document.body.appendChild(a)
                            a.click()
                            a.remove()
                            setLoading(false)
                          })
                          .catch((error) => {
                            setLoading(false)
                            console.error('Error downloading file:', error)
                          })
                      } catch (e) {
                        console.error(e)
                        setLoading(false)
                      }
                  }}
                />
              </IconButton>
            </Tooltip> */}

            {/* <IconButton size="small">
              <img src={CommentIcon} height="23px" />
            </IconButton> */}
            {/* <IconButton
              size='small'
              sx={{ display: !viewMode ? "none" : "" }}
              // onClick={se}
              onClick={() => {
                service
                  .DownloadTabulationByProjectId(
                    Number(projectId),
                    objectId as string,
                  )

                  .then((data) => {
                    if (data.length > 0) {
                      window.location.href = data
                      enqueueSnackbar(`Download Success`, {
                        variant: "success",
                      })
                    } else {
                      enqueueSnackbar(`No Data Found`, {
                        variant: "error",
                      })
                    }
                  })
                  .catch(() => {
                    enqueueSnackbar(`No Data Found Error Occur `, {
                      variant: "error",
                    })
                  })
              }}
            >
              <img src={FileDownloadIcon} height='23px' />
            </IconButton> */}
            {/* <IconButton size='small' onClick={(e) => handleClick(e)}>
              <img src={FileDownloadIcon} height='23px' />
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
                        onClick={() => initiateDownload((url as any)?.file_url)}
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
            <IconButton size="small">
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
                <Tooltip title="Enter Full Screen" sx={{ justifyContent: 'end' }}>
                  <FullscreenIcon sx={{ color: theme.palette.grey[500], fontSize: '1.3rem' }} />
                </Tooltip>
              ) : (
                <Tooltip title="Exit Full Screen" sx={{ justifyContent: 'end' }}>
                  <img src={FillIcon} height="20px" />
                </Tooltip>
              )}
            </IconButton>
          </Stack>
        </Box>
        {/* {
          dataExportConfig?.id ? */}
        {/* <>
          {!viewMode ? (
            <Box
              sx={{
                height: fullViewMode
                  ? "calc(100vh - 100px)"
                  : "calc(100vh - 275px)",
                background: "white",
                padding: "1rem",
                overflow: "auto",
                borderRadius: "12px",
              }}
            >
            
            </Box>
          ) : ( */}
        {tabulationCardData?.tables?.length > 0 ? (
          <Grid
            container
            spacing={2}
            style={{
              background: fullViewMode ? 'white' : 'none',
              height: fullViewMode ? '100vh' : 'auto',
            }}
          >
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
                <TabulationListComponent
                  JSONData={tabulationCardData}
                  navigateToIndex={navigateToIndex}
                  tabValue={value}
                  fullViewMode={fullViewMode}
                />
              </Box>
            </Grid>
            <Grid item xs={hide ? 11.8 : 10.2}>
              <DetailsBox
                sx={{
                  paddingTop: '1rem',
                  height: fullViewMode ? 'calc(100vh - 100px)' : 'calc(100vh - 312px)',
                  overflow: 'auto',
                }}
              >
                {value === 1 ? (
                  <DataTabulationCountTablePublsihedContainer ref={countListRef} JSONData={tabulationCardData} useNested={useNested} />
                ) : (
                  <DataTabulationPercentageTablePublishedContainer ref={percentListRef} JSONData={tabulationCardData} useNested={useNested} />
                )}
              </DetailsBox>
            </Grid>
          </Grid>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '150px',
            }}
          >
            <Typography variant="h5">{loading ? null : ' No table to show !'}</Typography>
          </Box>
        )}
        {/* )}
        </> */}
        {/* :
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(100vh - 450px)",
              }}
            >
              <Box
                sx={{
                  width: "650px",
                  height: "200px",
                  background: "white",
                  borderRadius: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <CancelIcon style={{ color: "red" }} />
                <Typography sx={{ fontSize: "18px", fontWeight: 400 }}>
                  No data to show
                </Typography>
              </Box>
            </Box>
        } */}
      </div>
    </FullScreen>
  )
}

export default ProjectTabulationPublishedContainer
