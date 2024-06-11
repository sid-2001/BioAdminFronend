import {
  // CommentIcon, FileDownloadIcon,
  RefreshIcon,
  GreenTick,
} from '@/assets/images'
import { theme } from '@/constants/theme'
// import { SettingsOutlined } from "@mui/icons-material"
import { Box, IconButton, Stack, Typography } from '@mui/material'
// import { useOutletContext } from "react-router"
// import moment from 'moment';
// import { useNavigate, useParams } from "react-router-dom"
// import CancelIcon from '@mui/icons-material/Cancel';

import { useParams } from 'react-router-dom'
// import { ProjectDataService } from "@/services/project-data.services"
// import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded';
// import React from "react"
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import { ProjectDataService } from '@/services/project-data.services'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/loader'

const DataValidationContainer = () => {
  // const navigate = useNavigate()
  const { projectId, surveyId } = useParams()
  // const { dataExportConfig, outputFiles } = useOutletContext<any>()

  // const { projectId } = useParams()
  function refreshData() {
    // let service = new ProjectDataService()
    // service.refreshDataRequest(Number(projectId))
  }

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
  const projectDataService = new ProjectDataService()
  const [dataValidated, setDataValidated] = useState(false)
  const [loading, setLoading] = useState(true)
  const getAllTableDataList = async () => {
    // setLoading(true);
    if (projectId && surveyId)
      try {
        const data = await projectDataService.GetAllTableData(Number(projectId), Number(surveyId))
        if (data && data.response_data.length > 0) setDataValidated(true)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
  }

  useEffect(() => {
    getAllTableDataList()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <Box
        style={{
          width: '100%',
          display: 'flex',
          marginBottom: '1rem',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6">Data Validation</Typography>
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

        <Stack direction="row" alignItems="center" spacing={2}>
          {/* <IconButton size='small'>
            <img src={CommentIcon} />
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
          <IconButton size='small'>
            <SettingsOutlined sx={{ color: theme.palette.grey[500] }} onClick={() => navigate(`/projects/${projectId}/data/config/cleaning`)} />
          </IconButton> */}
        </Stack>
      </Box>
      {/* {
        dataExportConfig?.id ? */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 450px)',
        }}
      >
        {dataValidated ? (
          <Box
            sx={{
              width: '650px',
              height: '200px',
              background: 'white',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <img src={GreenTick} />
            <Typography sx={{ fontSize: '18px', fontWeight: 400 }}>Data has been validated for programming conditions !</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              width: '650px',
              height: '200px',
              background: 'white',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <CancelRoundedIcon sx={{ color: 'red' }} />
            <Typography sx={{ fontSize: '18px', fontWeight: 400 }}>No data to show yet !</Typography>
          </Box>
        )}
      </Box>
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
  )
}

export default DataValidationContainer
