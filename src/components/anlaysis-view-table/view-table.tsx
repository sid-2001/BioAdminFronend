import React, { useEffect, useState } from 'react'
import './viewTable.css'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import { Box, IconButton, Menu, MenuItem, Stack, Tooltip, useMediaQuery } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import CustomDividerComponent from '../custom-divider'
import LoadingSpinner from '../loader'

const ViewTable = ({ analyseListView, selectedTopic, questionName, fullViewMode }: any) => {
  const [data, setData] = useState([])
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [tableFilter, setTableFilter] = useState('')
  const [selectedMenuItem, setSelectedMenuItem] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [filterList, setFilterList] = useState([])
  const matches = useMediaQuery('(max-width:1800px)')
  const open = Boolean(anchorEl)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleMenuItemClick = (filterValue: any) => {
    setSelectedMenuItem(filterValue)
  }
  const colorOpacity = (sentiment_score: any, sentiment_classFilter: any) => {
    if (sentiment_classFilter === 'positive' || sentiment_classFilter === 'neutral') {
      if (sentiment_score > 100 || sentiment_score > 90) {
        return 1
      } else if (sentiment_score > 80) {
        return 0.9
      } else if (sentiment_score > 70) {
        return 0.8
      } else if (sentiment_score > 60) {
        return 0.7
      } else if (sentiment_score > 50) {
        return 0.6
      } else if (sentiment_score > 40) {
        return 0.5
      } else if (sentiment_score > 10) {
        return 0.4
      }
    } else {
      let score = sentiment_score - 100
      if (score > 80) {
        return 0.4
      } else if (score > 50) {
        return 0.5
      } else if (score > 40) {
        return 0.6
      } else if (score > 30) {
        return 0.7
      } else if (score > 20) {
        return 0.8
      } else if (score > 10) {
        return 0.9
      } else if (score < 10) {
        return 1
      }
    }
  }

  useEffect(() => {
    // setPage(1);
    setLoading(true)
    if (selectedTopic) {
      let result = analyseListView
        .filter((value: any) => {
          if (value.topics.includes(selectedTopic.topics)) {
            if (tableFilter === '') {
              return true
            } else if (tableFilter === value.sentiment_class) {
              return true
            }
          } else {
            return false
          }
        })
        .map((val: any) => val)
      setData(result)
      setLoading(false)
    } else {
      let result = analyseListView
        .filter((value: any) => {
          if (tableFilter === '') {
            return true
          } else if (tableFilter === value.sentiment_class) {
            return true
          } else {
            return false
          }
        })
        .map((val: any) => val)
      setData(result)
      setLoading(false)
    }
  }, [selectedTopic, analyseListView, tableFilter])

  function truncateText(text: string, length: number) {
    if (text?.length <= length) {
      return text
    }
    return `${text.substr(0, length)}...`
  }

  useEffect(() => {
    let sentimentClassesArray: any = []
    analyseListView.map((val: any) => {
      if (!sentimentClassesArray.includes(val.sentiment_class)) {
        sentimentClassesArray.push(val.sentiment_class)
      }
    })
    setFilterList(sentimentClassesArray)
  }, [analyseListView])

  return (
    <Box className="view-table-main-div">
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack mb={1} spacing={0.5}>
          <div className="table-heading">Sentiment Analysis</div>
          <Tooltip title={matches ? (questionName.length > 60 ? questionName : '') : questionName.length > 90 ? questionName : ''}>
            <div className="table-heading"> ({questionName ? truncateText(questionName, matches ? 60 : 90) : ''})</div>
          </Tooltip>
        </Stack>
        <div style={{ position: 'relative' }}>
          <Chip label={selectedMenuItem} />
          <IconButton onClick={handleClick}>
            <FilterListIcon />
          </IconButton>

          {/* {anchorEl && (
            // <Box
            //   sx={{
            //     position: 'absolute',
            //     right: '0px',
            //     top: '50',
            //     backgroundColor: 'white',
            //     color: theme.palette.primary.main,
            //     padding: '1rem',
            //     zIndex: 3,
            //     boxShadow: '0px 2px 4px 0px rgba(232, 204, 255, 0.12), 0px 4px 12px 0px rgba(228, 152, 255, 0.25)',
            //   }}
            // > */}
          <Menu
            autoFocus={true}
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem
              onClick={() => {
                setTableFilter('')
                handleMenuItemClick('ALL')
                handleClose()
              }}
            >
              All
            </MenuItem>
            {filterList.map((val: any) => {
              return (
                <MenuItem
                  onClick={() => {
                    setTableFilter(val)
                    handleMenuItemClick(val.charAt(0).toUpperCase() + val.slice(1))
                    handleClose()
                  }}
                >
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </MenuItem>
              )
            })}
          </Menu>
          {/* </Box> */}
          {/* )} */}
        </div>
      </Stack>

      <CustomDividerComponent />
      <TableContainer
        component={Paper}
        sx={{
          '&::-webkit-scrollbar': {
            width: 6,
          },
          overflow: 'auto',
          height: fullViewMode ? 'calc(100vh - 220px)' : 'calc(100vh - 395px)',
          marginTop: '20px',
          boxShadow: '0px 2px 8px rgba(149, 159, 163, 0.15), 2px 4px 12px 6px rgba(132, 145, 150, 0.2)',
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow
              sx={{
                borderBottom: '1px solid #B6C3CA',
                '& th': {
                  fontSize: '14px',
                  color: '#434346',
                  fontWeight: 500,
                  borderBottom: '1px solid #94A8B1',
                },
              }}
            >
              <TableCell>Text</TableCell>
              <TableCell align="left">Sentiment Score</TableCell>
              <TableCell align="left">Sentiment Class</TableCell>
              <TableCell align="left">Topics</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <LoadingSpinner />
            ) : !loading && data && data?.length > 0 ? (
              data?.map((row: any, i) => {
                const text = row?.text || ''
                const truncateText = text.length > 50 ? text.substring(0, 50) + '...' : text
                return (
                  <TableRow key={i}>
                    <TableCell scope="row">
                      <Tooltip title={text} arrow placement="bottom-start">
                        <div
                          className="name-text"
                          style={{
                            color:
                              row.sentiment_class === 'neutral' ? 'grey' : row.sentiment_class !== 'negative' ? 'rgba(45, 108, 14, 1)' : '#d32f2f',
                            borderColor:
                              row.sentiment_class === 'neutral' ? 'grey' : row.sentiment_class !== 'negative' ? 'rgba(45, 108, 14, 1)' : '#d32f2f',
                            opacity: colorOpacity(row.sentiment_score * 100, row.sentiment_class),
                          }}
                        >
                          {truncateText}
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left" width="15%">
                      <Stack direction="row">
                        <div
                          style={{
                            color:
                              row.sentiment_class === 'neutral' ? 'grey' : row.sentiment_class !== 'negative' ? 'rgba(45, 108, 14, 1)' : '#d32f2f',
                            borderColor:
                              row.sentiment_class === 'neutral' ? 'grey' : row.sentiment_class !== 'negative' ? 'rgba(45, 108, 14, 1)' : '#d32f2f',
                            opacity: colorOpacity(row.sentiment_score * 100, row.sentiment_class),
                          }}
                          className="sentiment-score"
                        >
                          {(row.sentiment_score * 100).toFixed()} %
                        </div>
                      </Stack>
                    </TableCell>
                    <TableCell align="left" width="15%">
                      <Stack direction="row">
                        <div
                          style={{
                            color:
                              row.sentiment_class === 'neutral' ? 'grey' : row.sentiment_class !== 'negative' ? 'rgba(45, 108, 14, 1)' : '#d32f2f',
                            borderColor:
                              row.sentiment_class === 'neutral' ? 'grey' : row.sentiment_class !== 'negative' ? 'rgba(45, 108, 14, 1)' : '#d32f2f',
                            opacity: colorOpacity(row.sentiment_score * 100, row.sentiment_class),
                          }}
                          className="sentiment-score"
                        >
                          {row.sentiment_class}
                        </div>
                      </Stack>
                    </TableCell>

                    <TableCell align="left" width="30%">
                      <Stack direction="row" flexWrap="wrap" gap="10px">
                        {row?.topics?.length > 0 &&
                          row?.topics?.map((value: any, index: number) => {
                            const topics = value || ''
                            const truncateTopics = topics.length > 10 ? topics.substring(0, 10) + '...' : topics
                            return (
                              <Tooltip title={value} arrow key={index}>
                                <div className="topics">{truncateTopics}</div>
                              </Tooltip>
                            )
                          })}
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell sx={{ borderBottom: '1px solid white' }}></TableCell>
                <TableCell sx={{ borderBottom: '1px solid white' }}></TableCell>
                <TableCell sx={{ borderBottom: '1px solid white' }} align="left">
                  {loading || data?.length ? null : 'No content to show !'}
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid white' }}></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ViewTable
