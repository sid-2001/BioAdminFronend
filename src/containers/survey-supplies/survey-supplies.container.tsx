import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import Tooltip from '@mui/material/Tooltip'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import { visuallyHidden } from '@mui/utils'
import { StyledHeadTableCell, StyledTableCell, CenteredContainer, DetailsBox } from './survey-supplies.style'
import { Button, Collapse, InputAdornment, Stack, TextField } from '@mui/material'
import Input from '@/components/text-field'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { logger } from '@/helpers/logger'
import { ArrowDown, ArrowUp, GreenTick, NewTabViewIcon } from '@/assets/images'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import LoadingSpinner from '@/components/loader'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CustomCardMenu from '@/components/card-menu'
import { useOutletContext } from 'react-router-dom'
import { SurveySuppliersService } from '@/services/survey-supplier.service'
import { SuppliersService } from '@/services/supplier.sevice'
import AddBtn from '@/components/add-btn'
import { theme } from '@/constants/theme'
import { v4 as uuidv4 } from 'uuid'

interface Data {
  id: number
  survey_id: number
  name: string
  supplier_id: number
  supplier_cpi: number
  respondent_honorarium: number
  allocation: number
  supplier_entry_url: string
  starts: number
  remaining: number
  conversion: number
  last_complete: string
  is_active: true
  action?: any
  completes?: number
  supplier_complete_url: string
  supplier_terminate_url: string
  supplier_over_quota_url: string
  supplier_drop_off_url: string
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
  over_quota: number
  terminate: number
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Supplier',
  },
  {
    id: 'allocation',
    numeric: true,
    disablePadding: false,
    label: 'Allocation',
  },
  {
    id: 'supplier_cpi',
    numeric: true,
    disablePadding: false,
    label: 'Cpi',
  },
  {
    id: 'respondent_honorarium',
    numeric: true,
    disablePadding: false,
    label: 'Honorium',
  },
  {
    id: 'starts',
    numeric: true,
    disablePadding: false,
    label: 'Starts',
  },
  {
    id: 'over_quota',
    numeric: true,
    disablePadding: false,
    label: 'Over Quota',
  },
  {
    id: 'terminate',
    numeric: true,
    disablePadding: false,
    label: 'Terminates',
  },
  {
    id: 'completes',
    numeric: true,
    disablePadding: false,
    label: 'Completes',
  },

  {
    id: 'remaining',
    numeric: true,
    disablePadding: false,
    label: 'Remaining',
  },
  {
    id: 'conversion',
    numeric: true,
    disablePadding: false,
    label: 'Conversion',
  },

  {
    id: 'last_complete',
    numeric: true,
    disablePadding: false,
    label: 'Last Complete',
  },
  {
    id: 'action',
    numeric: true,
    disablePadding: false,
    label: 'Action',
  },
]

interface EnhancedTableProps {
  // numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void
  // onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order
  orderBy: string
  rowCount: number
  edit?: boolean
}

// const ingerNum = (e: any) => {
//   const characterCode = e.key
//   if (characterCode === 'Backspace') return

//   const characterNumber = Number(characterCode)
//   if (characterNumber >= 0 && characterNumber <= 9) {
//     return
//   } else {
//     e.preventDefault()
//   }
// }

const ingerNumPercentage = (e: any) => {
  const characterCode = e.key
  if (characterCode === 'Backspace') return

  const characterNumber = characterCode
  if ((characterNumber >= 0 && characterNumber <= 9) || characterNumber == '.') {
    return
  } else {
    e.preventDefault()
  }
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    // onSelectAllClick,
    order,
    orderBy,
    // numSelected,
    // rowCount,
    onRequestSort,
    edit,
  } = props
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => {
          if (headCell?.id == 'action' && !edit) {
            return null
          }
          return (
            <StyledHeadTableCell
              key={headCell.id}
              align={index === 0 ? 'left' : index !== headCells.length - 1 ? 'center' : 'center'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </StyledHeadTableCell>
          )
        })}
      </TableRow>
    </TableHead>
  )
}

function Row(props: {
  row: any
  edit: boolean
  setRows: any
  rows: any
  index: number
  GetSuppliersBySurveyId: any
  // editedIndex: number | null;
  // setEditedIndex: React.Dispatch<React.SetStateAction<number | null>>
  editedIndexes: number[]
  setEditedIndexes: React.Dispatch<React.SetStateAction<number[]>>
  isLoading: boolean
}) {
  const { row, edit, setRows, rows, index, GetSuppliersBySurveyId, editedIndexes, setEditedIndexes, isLoading } = props
  const [open, setOpen] = React.useState(false)
  const surveyService = new SurveySuppliersService()
  const { surveyId } = useParams()

  // console.log(row,"rowrow")

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    setShowCopied(true)
  }

  React.useEffect(() => {
    if (edit) {
      setOpen(false)
    }
  }, [edit])

  const urlValidation: RegExp =
    // /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    /^(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g

  interface iFormInput {
    completed_redirect_url: string
    security_redirect_url: string
    terminate_redirect_url: string
    over_quota_redirect_url: string
    s2s_completed_url: string
    s2s_security_url: string
    s2s_terminate_url: string
    s2s_over_quota_url: string
    is_it_redirected: boolean
    is_it_s2s: boolean
  }

  const {
    watch,
    setValue,
    handleSubmit,
    register,
    // reset,
    formState: { errors },
  } = useForm<iFormInput>({
    defaultValues: {
      completed_redirect_url: '',
      security_redirect_url: '',
      terminate_redirect_url: '',
      over_quota_redirect_url: '',
      s2s_completed_url: '',
      s2s_security_url: '',
      s2s_terminate_url: '',
      s2s_over_quota_url: '',
      is_it_redirected: false,
      is_it_s2s: false,
    },
  })

  const { enqueueSnackbar } = useSnackbar()
  // const [editedIndex, setEditedIndex] = React.useState<number | null>(null);
  const { surveyData }: { surveyData: any } = useOutletContext()

  const isRedirected = watch('is_it_redirected')
  const isS2S = watch('is_it_s2s')

  const Submit = async (data: any) => {
    const payload = {
      completed_redirect_url: data.is_it_redirected ? (data.completed_redirect_url ? data.completed_redirect_url : '') : '',
      security_redirect_url: data.is_it_redirected ? (data.security_redirect_url ? data.security_redirect_url : '') : '',
      terminate_redirect_url: data.is_it_redirected ? (data.terminate_redirect_url ? data.terminate_redirect_url : '') : '',
      over_quota_redirect_url: data.is_it_redirected ? (data.over_quota_redirect_url ? data.over_quota_redirect_url : '') : '',
      s2s_completed_url: data.is_it_s2s ? (data.s2s_completed_url ? data.s2s_completed_url : '') : '',
      s2s_security_url: data.is_it_s2s ? (data.s2s_security_url ? data.s2s_security_url : '') : '',
      s2s_terminate_url: data.is_it_s2s ? (data.s2s_terminate_url ? data.s2s_terminate_url : '') : '',
      s2s_over_quota_url: data.is_it_s2s ? (data.s2s_over_quota_url ? data.s2s_over_quota_url : '') : '',
      is_it_redirected: data.is_it_redirected,
      is_it_s2s: data.is_it_s2s || false,
    }
    console.log(row)
    try {
      await surveyService.putSurveysSupplierRow(surveyId || '', payload, row.id)
      // console.log(res);
      enqueueSnackbar('Successfully saved changes!', {
        variant: 'success',
      })
      setOpen(false)
      GetSuppliersBySurveyId()
    } catch (e) {
      logger.error(e)
      if ((e as any)?.response?.status === 403) {
        enqueueSnackbar('Access denied: Insufficient permissions.', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar('An error occurred. Please try again.', {
          variant: 'error',
        })
      }
    }
  }

  React.useEffect(() => {
    setValue('is_it_redirected', row.is_it_redirected)
    setValue('is_it_s2s', row.is_it_s2s)
    setValue('completed_redirect_url', row.completed_redirect_url)
    setValue('security_redirect_url', row.security_redirect_url)
    setValue('terminate_redirect_url', row.terminate_redirect_url)
    setValue('over_quota_redirect_url', row.over_quota_redirect_url)
    setValue('s2s_completed_url', row.s2s_completed_url)
    setValue('s2s_security_url', row.s2s_security_url)
    setValue('s2s_terminate_url', row.s2s_terminate_url)
    setValue('s2s_over_quota_url', row.s2s_over_quota_url)
  }, [open])

  const [allocationSum, setAllocationSum] = React.useState(0)
  const [showCopied, setShowCopied] = React.useState<boolean>(false)

  React.useEffect(() => {
    const sum = rows.reduce((acc: number, row: { allocation: string }) => acc + parseInt(row.allocation, 10), 0)
    setAllocationSum(sum)
  }, [rows])

  React.useEffect(() => {
    if (showCopied) {
      const timer = setTimeout(() => {
        setShowCopied(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [showCopied])

  let newTabLink = row.supplier_entry_url.replaceAll('[#ltid#]', uuidv4()).replaceAll('[#ltuid#]', uuidv4())
  let testLink = `${row.supplier_entry_url.replaceAll("[#ltid#]", uuidv4()).replaceAll("[#ltuid#]", uuidv4())}&is_test=true`;

  return (
    <React.Fragment>
      <TableRow
        hover
        onClick={() => {
          if (!edit && !open) {
            setOpen(true)
          } else {
            setOpen(false)
          }
        }}
        sx={{
          cursor: 'pointer',
          background: open ? 'rgba(244, 246, 248, 1)' : '',
        }}
      >
        <StyledTableCell align="left">{row.name}</StyledTableCell>
        <StyledTableCell align="center">
          {edit ? (
            <div>
              <TextField
                onFocus={(e) => (e.target.value == '0' ? e.target.select() : null)}
                value={row.allocation}
                onChange={(e) => {
                  const enteredValue = Number(e.target.value)
                  if (enteredValue < 0 || enteredValue > 100) {
                    return
                  }
                  const payload = [...rows]
                  payload[index].allocation = Number(e.target.value)
                  setRows(payload)
                  const newIndexes = [...editedIndexes]
                  if (!newIndexes.includes(index)) {
                    newIndexes.push(index)
                  }
                  setEditedIndexes(newIndexes)
                }}
                type="number"
                onKeyPress={(e: any) => {
                  ingerNumPercentage(e)
                }}
                InputProps={{ inputProps: { min: 0 }, endAdornment: '%' }}
                autoFocus
                placeholder="Allocation"
                size="small"
                sx={{
                  border: 'none',
                  '& fieldset': { border: 'none' },
                }}
              />
              {/* {rows?.reduce((sum: any, item: { allocation: any }) => Number(sum) + Number(item.allocation), 0) > 100 && (
                <p style={{ color: 'red', fontSize: '12px', width: '100px' }}>Total allocation should not be greater than 100%</p>
              )} */}
              {allocationSum > parseInt(surveyData?.sample_size, 10) && editedIndexes && editedIndexes.includes(index) && (
                <p style={{ color: 'red', fontSize: '12px' }}>
                  Allocation should not be greater than{' '}
                  {Math.max(0, -(allocationSum - parseInt(row.allocation, 10) - parseInt(surveyData?.sample_size, 10)))}
                </p>
              )}
            </div>
          ) : (
            `${row.allocation.toFixed(2)}%`
          )}
        </StyledTableCell>
        <StyledTableCell align="center">
          {edit ? (
            <TextField
              onFocus={(e) => (e.target.value == '0' ? e.target.select() : null)}
              value={row.supplier_cpi}
              onChange={(e) => {
                const enteredValue = Number(e.target.value)
                if (enteredValue < 0) {
                  return
                }
                const payload = [...rows]
                payload[index].supplier_cpi = e.target.value
                setRows(payload)
                const newIndexes = [...editedIndexes]
                if (!newIndexes.includes(index)) {
                  newIndexes.push(index)
                }
                setEditedIndexes(newIndexes)
              }}
              onKeyPress={(e: any) => {
                ingerNumPercentage(e)
              }}
              type="number"
              placeholder="Supplier Cpi"
              size="small"
              sx={{
                border: 'none',
                width: '100px',
                '& fieldset': { border: 'none' },
              }}
              InputProps={{
                startAdornment: '$',
                inputProps: { min: 0 },
              }}
            />
          ) : (
            `$${new Intl.NumberFormat().format(Number(parseFloat(row?.supplier_cpi).toFixed(2) || '0.00'))}`
          )}
        </StyledTableCell>
        <StyledTableCell align="center">
          {edit ? (
            <TextField
              onFocus={(e) => (e.target.value == '0' ? e.target.select() : null)}
              value={row.respondent_honorarium}
              onChange={(e) => {
                const payload = [...rows]
                payload[index].respondent_honorarium = e.target.value
                setRows(payload)
                // setEditedIndex(index);
                const newIndexes = [...editedIndexes]
                if (!newIndexes.includes(index)) {
                  newIndexes.push(index)
                }
                setEditedIndexes(newIndexes)
              }}
              type="number"
              onKeyPress={(e: any) => {
                ingerNumPercentage(e)
              }}
              placeholder="Honorarium"
              size="small"
              sx={{
                border: 'none',
                '& fieldset': { border: 'none' },
              }}
              InputProps={{
                startAdornment: '$',
                inputProps: { min: 0 },
              }}
            />
          ) : (
            `$${new Intl.NumberFormat().format(Number(parseFloat(row?.respondent_honorarium).toFixed(2)))}`
          )}
        </StyledTableCell>
        <StyledTableCell align="center">{row?.starts}</StyledTableCell>
        <StyledTableCell align="center">{row?.over_quota}</StyledTableCell>
        <StyledTableCell align="center">{row?.terminate}</StyledTableCell>
        <StyledTableCell align="center">{row?.completes}</StyledTableCell>
        <StyledTableCell align="center">{row?.remaining}</StyledTableCell>
        <StyledTableCell align="center">{row?.conversion}</StyledTableCell>
        <StyledTableCell align="center">{row?.last_complete ? moment(row.last_complete).fromNow() : 'NA'}</StyledTableCell>
        {edit && editedIndexes.includes(index) ? (
          <StyledTableCell
            align="center"
            style={{
              color: 'red',
              fontSize: '24px',
              // filter:
              //   rows?.reduce((sum: any, item: { allocation: any }) => Number(sum) + Number(item.allocation), 0) > 100
              //     ? 'invert(81%) sepia(0%) saturate(0%) hue-rotate(174deg) brightness(84%) contrast(91%)'
              //     : '',
              // pointerEvents: rows?.reduce((sum: any, item: { allocation: any }) => Number(sum) + Number(item.allocation), 0) > 100 ? 'none' : 'auto',
            }}
          >
            <img
              src={GreenTick}
              onClick={() => {
                setEditedIndexes((prev) => prev.filter((i) => i !== index))
              }}
            />
          </StyledTableCell>
        ) : edit ? (
          <StyledTableCell align="center"></StyledTableCell>
        ) : null}
      </TableRow>
      {open && (
        <TableRow sx={{ background: 'rgba(244, 246, 248, 1)' }}>
          <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="subtitle1" gutterBottom component="div" sx={{ color: 'rgba(0, 184, 217, 1)' }}>
                  Entry Link
                </Typography>
                <Typography component="div" sx={{ marginTop: '1rem', fontWeight: 'bold' }}>
                  Survey Link
                </Typography>
                <Input
                  // label="Survey Link"
                  variant="standard"
                  fullWidth
                  value={row.supplier_entry_url}
                  sx={{
                    marginTop: '0.5rem',
                    // "& .MuiFormLabel-root": {
                    //   fontSize: "18px",
                    //   lineHeight: "0.7375rem",
                    // },
                  }}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title={showCopied ? `Copied!  ${row.supplier_entry_url}` : ''}>
                        <InputAdornment position="end">
                          <Stack direction="row">
                            <IconButton
                              onClick={() => {
                                copy(row.supplier_entry_url)
                              }}
                            >
                              <ContentCopyIcon fontSize="small" sx={{ color: theme.palette.grey[500] }} />
                            </IconButton>
                            <IconButton href={newTabLink} target="_blank">
                              <img src={NewTabViewIcon} height="20px" />
                            </IconButton>
                          </Stack>
                        </InputAdornment>
                      </Tooltip>
                    ),
                  }}
                />
                <Typography component="div" sx={{ marginTop: '1rem', fontWeight: 'bold' }}>
                  Survey Test Link
                </Typography>
                <Input
                  // label="Survey Test Link"
                  variant="standard"
                  fullWidth
                  value={`${row.supplier_entry_url}&is_test=true`}
                  sx={{
                    marginTop: '0.5rem',
                    // "& .MuiFormLabel-root": {
                    //   fontSize: "18px",
                    //   lineHeight: "0.7375rem",
                    // },
                  }}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title={showCopied ? `Copied!  ${`${row.supplier_entry_url}&is_test=true`}` : ''}>
                        <InputAdornment position="end">
                          <Stack direction="row">
                            <IconButton
                              onClick={() => {
                                copy(`${row.supplier_entry_url}&is_test=true`)
                              }}
                            >
                              <ContentCopyIcon fontSize="small" sx={{ color: theme.palette.grey[500] }} />
                            </IconButton>
                            <IconButton href={testLink} target="_blank">
                              <img src={NewTabViewIcon} height="20px" />
                            </IconButton>
                          </Stack>
                        </InputAdornment>
                      </Tooltip>
                    ),
                  }}
                />
                {/* {Number(row.allocation) === 0 && (
                  <p style={{ color: "red", fontSize: "14px" }}>
                    Please change the allocation before using this URL
                  </p>
                )} */}
              </Box>
              <form onSubmit={handleSubmit(Submit)} noValidate>
                <Stack
                  sx={{
                    margin: 1,
                    padding: '12px 24px 12px 24px',
                    marginTop: '30px',
                    border: '1px solid #aaa',
                    borderRadius: '16px',
                  }}
                  spacing={2}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <FormControlLabel
                      onChange={(e: any) => {
                        setValue('is_it_redirected', e.target.checked)
                      }}
                      control={<Checkbox color="secondary" checked={isRedirected || false} />}
                      label={<span style={{ fontSize: '16px', fontWeight: 400 }}>Redirects</span>}
                    />
                    <IconButton
                      onClick={() => {
                        if (isRedirected) {
                          setValue('is_it_redirected', false)
                        } else {
                          setValue('is_it_redirected', true)
                        }
                      }}
                    >
                      <img src={isRedirected ? ArrowDown : ArrowUp} height="10px" />
                    </IconButton>
                  </Stack>
                  {isRedirected && (
                    <>
                      <Input
                        label="Complete*"
                        {...register('completed_redirect_url', {
                          required: 'Redirect Complete url is required',
                          pattern: {
                            value: urlValidation,
                            message: 'Invalid Url',
                          },
                        })}
                        InputProps={{
                          endAdornment: (
                            <Tooltip title={showCopied ? `Copied!  ${row.completed_redirect_url}` : ''}>
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    copy(row.completed_redirect_url)
                                  }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </Tooltip>
                          ),
                        }}
                      />
                      {errors?.completed_redirect_url && (
                        <p style={{ color: 'red', padding: 0, margin: 5 }}>{errors?.completed_redirect_url?.message}</p>
                      )}
                      <Input
                        label="Terminate*"
                        {...register('terminate_redirect_url', {
                          required: 'Redirect Terminate url is required',
                          pattern: {
                            value: urlValidation,
                            message: 'Invalid Url',
                          },
                        })}
                        InputProps={{
                          endAdornment: (
                            <Tooltip title={showCopied ? `Copied!  ${row.terminate_redirect_url}` : ''}>
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    copy(row.terminate_redirect_url)
                                  }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </Tooltip>
                          ),
                        }}
                      />
                      {errors?.terminate_redirect_url && (
                        <p style={{ color: 'red', padding: 0, margin: 5 }}>{errors?.terminate_redirect_url?.message}</p>
                      )}
                      <Input
                        label="Over-Quota*"
                        {...register('over_quota_redirect_url', {
                          required: 'Redirect Over Quota url is required',
                          pattern: {
                            value: urlValidation,
                            message: 'Invalid Url',
                          },
                        })}
                        InputProps={{
                          endAdornment: (
                            <Tooltip title={showCopied ? `Copied!  ${row.over_quota_redirect_url}` : ''}>
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    copy(row.over_quota_redirect_url)
                                  }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </Tooltip>
                          ),
                        }}
                      />
                      {errors?.over_quota_redirect_url && (
                        <p style={{ color: 'red', padding: 0, margin: 5 }}>{errors?.over_quota_redirect_url?.message}</p>
                      )}
                      <Input
                        label="Security*"
                        {...register('security_redirect_url', {
                          required: 'Redirect Security url is required',
                          pattern: {
                            value: urlValidation,
                            message: 'Invalid Url',
                          },
                        })}
                        InputProps={{
                          endAdornment: (
                            <Tooltip title={showCopied ? `Copied!  ${row.security_redirect_url}` : ''}>
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    copy(row.security_redirect_url)
                                  }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </Tooltip>
                          ),
                        }}
                      />
                      {errors?.security_redirect_url && (
                        <p style={{ color: 'red', padding: 0, margin: 5 }}>{errors?.security_redirect_url?.message}</p>
                      )}
                    </>
                  )}
                </Stack>
                <Stack
                  sx={{
                    margin: 1,
                    padding: '12px 24px 12px 24px',
                    marginTop: '20px',
                    marginBottom: '20px',
                    border: '1px solid #aaa',
                    borderRadius: '16px',
                  }}
                  spacing={2}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <FormControlLabel
                      onChange={(e: any) => {
                        setValue('is_it_s2s', e.target.checked)
                      }}
                      control={<Checkbox color="secondary" checked={isS2S || false} />}
                      label={<span style={{ fontSize: '16px', fontWeight: 400 }}>Server to Server</span>}
                    />
                    <IconButton
                      onClick={() => {
                        if (isS2S) {
                          setValue('is_it_s2s', false)
                        } else {
                          setValue('is_it_s2s', true)
                        }
                      }}
                    >
                      <img src={isS2S ? ArrowDown : ArrowUp} height="10px" />
                    </IconButton>
                  </Stack>
                  {isS2S && (
                    <>
                      <Input
                        label="Complete*"
                        {...register('s2s_completed_url', {
                          required: 's2s Complete url is required',
                          pattern: {
                            value: urlValidation,
                            message: 'Invalid Url',
                          },
                        })}
                        InputProps={{
                          endAdornment: (
                            <Tooltip title={showCopied ? `Copied!  ${row.s2s_completed_url}` : ''}>
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    copy(row.s2s_completed_url)
                                  }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </Tooltip>
                          ),
                        }}
                      />
                      {errors?.s2s_completed_url && <p style={{ color: 'red', padding: 0, margin: 5 }}>{errors?.s2s_completed_url?.message}</p>}
                      <Input
                        label="Terminate*"
                        {...register('s2s_terminate_url', {
                          required: 's2s Terminate url is required',
                          pattern: {
                            value: urlValidation,
                            message: 'Invalid Url',
                          },
                        })}
                        InputProps={{
                          endAdornment: (
                            <Tooltip title={showCopied ? `Copied!  ${row.s2s_terminate_url}` : ''}>
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    copy(row.s2s_terminate_url)
                                  }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </Tooltip>
                          ),
                        }}
                      />
                      {errors?.s2s_terminate_url && <p style={{ color: 'red', padding: 0, margin: 5 }}>{errors?.s2s_terminate_url?.message}</p>}
                      <Input
                        label="Over-Quota*"
                        {...register('s2s_over_quota_url', {
                          required: 's2s OverQuota url is required',
                          pattern: {
                            value: urlValidation,
                            message: 'Invalid Url',
                          },
                        })}
                        InputProps={{
                          endAdornment: (
                            <Tooltip title={showCopied ? `Copied!  ${row.s2s_over_quota_url}` : ''}>
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    copy(row.s2s_over_quota_url)
                                  }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </Tooltip>
                          ),
                        }}
                      />
                      {errors?.s2s_over_quota_url && <p style={{ color: 'red', padding: 0, margin: 5 }}>{errors?.s2s_over_quota_url?.message}</p>}
                      <Input
                        label="Security*"
                        {...register('s2s_security_url', {
                          required: 's2s Security url is required',
                          pattern: {
                            value: urlValidation,
                            message: 'Invalid Url',
                          },
                        })}
                        onChange={() => {}}
                        InputProps={{
                          endAdornment: (
                            <Tooltip title={showCopied ? `Copied!  ${row.s2s_security_url}` : ''}>
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    copy(row.s2s_security_url)
                                  }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </Tooltip>
                          ),
                        }}
                      />
                      {errors?.s2s_security_url && <p style={{ color: 'red', padding: 0, margin: 5 }}>{errors?.s2s_security_url?.message}</p>}
                    </>
                  )}
                </Stack>
                <Box display="flex" gap={2} margin={1} alignItems="center" flexDirection="row" justifyContent="flex-end" marginBottom="20px">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setOpen(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isLoading || (!isRedirected && !isS2S && allocationSum > parseInt(surveyData?.sample_size, 10))}
                  >
                    Save
                  </Button>
                </Box>
              </form>
            </Collapse>
          </StyledTableCell>
        </TableRow>
      )}
    </React.Fragment>
  )
}

function AddTableRow(props: {
  setAddRow: React.Dispatch<React.SetStateAction<boolean>>
  rows: any
  GetSuppliersBySurveyId: any
  isLoading: boolean
}) {
  const { setAddRow, rows, GetSuppliersBySurveyId } = props
  interface AddRowInput {
    supplier_id: string | number
    respondent_honorarium: number
    allocation: number
    supplier_cpi: number
  }
  const supplierService = new SurveySuppliersService()
  // const surveyService = new SurveysService()
  const simpleSupplierService = new SuppliersService()

  const [supplier, setSupplier] = React.useState<any>([])
  const [postData, setPostData] = React.useState<AddRowInput>({
    supplier_id: '',
    respondent_honorarium: 0,
    allocation: 0,
    supplier_cpi: 0,
  })

  const { surveyId } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const { surveyData }: { surveyData: any } = useOutletContext()

  const getSupplierList = async () => {
    try {
      const data = await simpleSupplierService.getSuppliers()

      const ids = rows?.map((el: any) => {
        return el.supplier_id
      })
      const supplierList = data.filter((el: any) => !ids.includes(el.supplier_id)).map((val: any) => val)
      console.log(supplierList)
      setSupplier(supplierList)
    } catch (e) {
      logger.error(e)
    }
  }

  React.useEffect(() => {
    getSupplierList()
  }, [])

  const onSubmit = async () => {
    try {
      let newPostData = {
        ...postData,
        supplier_cpi: Number(postData?.supplier_cpi),
        respondent_honorarium: Number(postData?.respondent_honorarium)
      }
      await supplierService.postSurveysSupplier(surveyId || '', newPostData)

      enqueueSnackbar('Successfully created!', {
        variant: 'success',
      })
      GetSuppliersBySurveyId()
      setAddRow(false)
    } catch (e) {
      logger.error(e)
      if ((e as any)?.response?.status === 403) {
        enqueueSnackbar('Access denied: Insufficient permissions.', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar('An error occurred. Please try again.', {
          variant: 'error',
        })
      }
    }
  }

  const activeSuppliers = supplier.filter((supplier: { is_active: any }) => supplier.is_active)

  const unusedSuppliers = activeSuppliers.filter((supplier: any) => {
    return rows.findIndex((row: any) => row.name === supplier.name) < 0
  })
  // console.log(unusedSuppliers)

  // console.log(supplier,"suppliersupplier")

  // console.log(activeSuppliers);
  // hello

  const [allocationSum, setAllocationSum] = React.useState(0)
  // const allocationCompare =
  //   Number(postData?.allocation) + allocationSum >
  //   Number(surveyData?.sample_size)
  // const isAllocationValid =
  //   postData?.allocation >= 0 && postData?.allocation.toString() !== ""
  // const isSupplierCpiValid =
  //   postData?.supplier_cpi >= 0 && postData?.supplier_cpi.toString() !== ""
  // const isHonorariumValid =
  //   postData?.respondent_honorarium >= 0 &&
  //   postData?.respondent_honorarium.toString() !== ""
  // const isSupplierIdValid = postData.supplier_id !== ""
  // const areAllValid =
  //   isAllocationValid &&
  //   isSupplierCpiValid &&
  //   isHonorariumValid &&
  //   isSupplierIdValid

  React.useEffect(() => {
    const sum = rows.reduce((acc: number, row: { allocation: string }) => acc + parseInt(row.allocation, 10), 0)
    setAllocationSum(sum)
  }, [rows])

  return (
    <TableRow
      sx={{
        cursor: 'pointer',
      }}
    >
      <StyledTableCell align="left">
        <FormControl>
          <Select
            sx={{
              width: '160px',
              // "& .MuiInputBase-input": {
              //   padding: "8px 0px !important",
              // },
              '& fieldset': { border: 'none' },
            }}
            value={postData?.supplier_id.toString() || ''}
            onChange={(e: any) => {
              const payload: AddRowInput = { ...postData }
              payload.supplier_id = Number(e.target.value)
              setPostData(payload)
            }}
            label=""
            name="supplier_id"
            size="small"
            MenuProps={{
              PaperProps: { sx: { maxHeight: 250, width: `calc(15vw)` } },
            }}
          >
            {unusedSuppliers?.map((val: any) => {
              return <MenuItem value={val.id}>{val.name}</MenuItem>
            })}
          </Select>
        </FormControl>
      </StyledTableCell>

      <StyledTableCell align="center">
        <TextField
          onFocus={(e) => (e?.target?.value == '0' ? e?.target?.select() : null)}
          type="number"
          value={postData?.allocation}
          name="allocation"
          onKeyPress={(e: any) => {
            ingerNumPercentage(e)
          }}
          placeholder="Allocation"
          onChange={(e: any) => {
            const enteredValue = Number(e.target.value)
            if (enteredValue < 0 || enteredValue > 100) {
              return
            }
            const payload: AddRowInput = { ...postData }
            payload.allocation = Number(e.target.value)
            setPostData(payload)
          }}
          InputProps={{
            // inputProps: { min: 0 },
            endAdornment: `%`,
          }}
          sx={{
            width: '100px',
            border: 'none',
            '& fieldset': { border: 'none' },
            '& .MuiInputBase-input': {
              padding: '8px 0px',
            },
          }}
        />
        {/* {rows?.reduce((sum: any, item: { allocation: any }) => sum + item.allocation, 0) + Number(postData?.allocation) > 100 && (
          <p style={{ color: 'red', fontSize: '12px', width: '100px' }}>Total allocation should not be greater than 100%</p>
        )} */}
        {Number(postData?.allocation) + allocationSum > parseInt(surveyData?.sample_size, 10) && (
          <p style={{ color: 'red', fontSize: '12px', width: '100px' }}>
            Allocation should not be greater than {-(allocationSum - parseInt(surveyData?.sample_size, 10))}
          </p>
        )}
      </StyledTableCell>
      <StyledTableCell align="center">
        <TextField
          onFocus={(e) => (e?.target?.value == '0' ? e?.target?.select() : null)}
          type="number"
          onKeyPress={(e: any) => {
            ingerNumPercentage(e)
          }}
          value={postData?.supplier_cpi}
          onChange={(e: any) => {
            const payload: AddRowInput = { ...postData }
            payload.supplier_cpi = e.target.value
            setPostData(payload)
          }}
          InputProps={{
            inputProps: { min: 0 }, startAdornment: '$'
          }}
          name="supplier_cpi"
          placeholder="Supplier Cpi"
          sx={{
            width: '100px',
            border: 'none',
            '& fieldset': { border: 'none' },
            '& .MuiInputBase-input': {
              padding: '8px 0px',
            },
          }}
        />
      </StyledTableCell>
      <StyledTableCell align="center">
        <TextField
          onFocus={(e) => (e?.target?.value == '0' ? e?.target?.select() : null)}
          type="number"
          onKeyPress={(e: any) => {
            ingerNumPercentage(e)
          }}
          placeholder="Honorarium"
          value={postData?.respondent_honorarium}
          onChange={(e: any) => {
            const payload: AddRowInput = { ...postData }
            payload.respondent_honorarium = e.target.value
            setPostData(payload)
          }}
          InputProps={{
            inputProps: { min: 0 }, startAdornment: '$'
          }}
          sx={{
            width: '100px',
            border: 'none',
            '& fieldset': { border: 'none' },
            '& .MuiInputBase-input': {
              padding: '8px 0px',
            },
          }}
        />
      </StyledTableCell>
      <StyledTableCell align="center">0</StyledTableCell>
      <StyledTableCell align="center">0</StyledTableCell>
      <StyledTableCell align="center">0</StyledTableCell>
      <StyledTableCell align="center">0</StyledTableCell>
      <StyledTableCell align="center">0</StyledTableCell>
      <StyledTableCell align="center">0</StyledTableCell>
      <StyledTableCell
        align="center"
        sx={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AddBtn
          disabled={
            // rows?.reduce((sum: any, item: { allocation: any }) => sum + item.allocation, 0) + Number(postData?.allocation) > 100 ||
            !postData?.supplier_id
          }
          onClick={() => {
            onSubmit()
          }}
        />
        <IconButton
          color="error"
          onClick={() => {
            setAddRow(false)
          }}
          sx={{
            width: 'fit-content',
          }}
        >
          <DeleteTwoToneIcon fontSize="small" />
        </IconButton>
      </StyledTableCell>
    </TableRow>
  )
}

// const dummy = [
//   {
//     id: 0,
//     survey_id: 0,
//     supplier_id: 0,
//     supplier_cpi: 0,
//     respondent_honorarium: 0,
//     allocation: 0,
//     supplier_entry_url: "string",
//     starts: 0,
//     remaining: 0,
//     conversion: 0,
//     last_complete: "string",
//     is_active: true,
//     over_quota: 0,
//     completed_redirect_url: "string",
//     security_redirect_url: "string",
//     terminate_redirect_url: "string",
//     over_quota_redirect_url: "string",
//     s2s_completed_url: "string",
//     s2s_security_url: "string",
//     s2s_terminate_url: "string",
//     s2s_over_quota_url: "string",
//     created_by: 0,
//     updated_by: 0,
//     created_at: "string",
//     updated_at: "string",
//   },
// ]

export default function SurveySupplyComponent() {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('supplier_id')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(25)
  const [edit, setEdit] = React.useState(false)
  const [rows, setRows] = React.useState([])
  const { surveyId } = useParams()
  const surveySuppliersService = new SurveySuppliersService()
  const [total, setTotal] = React.useState<any>({})
  const [addRow, setAddRow] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState(false)
  console.log(total)
  const { enqueueSnackbar } = useSnackbar()

  const GetSuppliersBySurveyId = async () => {
    setIsLoading(true)
    try {
      const data = await surveySuppliersService.getSuppliers(surveyId || '')
      setRows(data as any)
      // console.log(data);

      setIsLoading(false)
    } catch (error) {
      logger.error(error)
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    GetSuppliersBySurveyId()
  }, [])

  React.useEffect(() => {
    if (orderBy !== 'conversion') {
      setOrderBy('conversion')
    }
  }, [edit, addRow])

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 25))
    setPage(0)
  }

  const visibleRows = React.useMemo(
    () => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows],
  )

  // const [editedIndex, setEditedIndex] = React.useState<number | null>(null);
  const [editedIndexes, setEditedIndexes] = React.useState<number[]>([])

  const Submit = async () => {
    setIsLoading(true)
    const payload = [...rows]
    let newPayload = payload.map((value: Data) => {
      return {
        ...value,
        id: value.id,
        respondent_honorarium: Number(value.respondent_honorarium),
        allocation: value.allocation,
        supplier_cpi: Number(value.supplier_cpi),
      };
    });
    try {
      await surveySuppliersService.putSurveysSupplier(surveyId || '', newPayload)
      GetSuppliersBySurveyId()
      setEdit(false)
      enqueueSnackbar('Successfully saved changes!', {
        variant: 'success',
      })
    } catch (error) {
      logger.error(error)
      if ((error as any)?.response?.status === 403) {
        enqueueSnackbar('Access denied: Insufficient permissions.', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar('An error occurred. Please try again.', {
          variant: 'error',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (!edit) {
      const payload: any = {
        allocation: 0,
        cpi: 0,
        honorarium: 0,
        starts: 0,
        over_quota: 0,
        completes: 0,
        terminate: 0,
        remaining: 0,
        conversion: 0,
      }
      rows.map((value: any) => {
        payload.allocation = payload.allocation + value.allocation
        payload.cpi = payload.cpi + value.supplier_cpi
        payload.honorarium = payload.honorarium + value.respondent_honorarium
        payload.starts = payload.starts + value.starts
        payload.over_quota = payload.over_quota + value.over_quota
        payload.terminate = payload.terminate + value.terminate
        payload.completes = payload.completes + value.completes
        payload.remaining = payload.remaining + value.remaining
        payload.conversion = payload.conversion + value.conversion
      })
      setTotal(payload)
    }
  }, [rows])

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const EditOpen = Boolean(anchorEl)

  return (
    <DetailsBox marginBottom="50px" sx={{ minWidth: '100%', height: 'calc(100vh - 270px)' }}>
      {isLoading ? (
        <CenteredContainer>
          <LoadingSpinner />
        </CenteredContainer>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Paper
            sx={{
              width: '100%',
              boxSizing: 'border-box',
              mb: 2,
              boxShadow: 'none',
            }}
          >
            <Box display={'flex'} alignItems="flex-end" justifyContent="flex-end">
              {visibleRows.length > 0 && !addRow && !edit ? (
                <IconButton aria-controls="menu" aria-haspopup="true" onClick={handleClick} size="small" style={{ alignItems: 'start' }}>
                  <MoreVertIcon fontSize="medium" style={{ color: '#C4CDD5' }} />
                </IconButton>
              ) : (
                ''
              )}
              <CustomCardMenu
                surveySupply={true}
                anchorEl={anchorEl}
                open={EditOpen}
                setAnchorEl={setAnchorEl}
                onClose={handleClose}
                tableEdit={true}
                onEdit={() => {
                  setEdit(true)
                  setAnchorEl(null)
                }}
                onDeactivate={() => { }}
              />
            </Box>
            <TableContainer>
              <Table sx={{ minWidth: 750 }}>
                <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={rows.length} edit={edit} />
                <TableBody>
                  {rows.length > 0 ? <></> : ''}
                  {visibleRows.map((row, index) => {
                    return (
                      <Row
                        key={index}
                        index={index}
                        row={row}
                        edit={edit}
                        setRows={setRows}
                        rows={rows}
                        GetSuppliersBySurveyId={GetSuppliersBySurveyId}
                        editedIndexes={editedIndexes}
                        setEditedIndexes={setEditedIndexes}
                        isLoading={isLoading}
                      />
                    )
                  })}
                  {addRow === false && rows.length <= 0 && (
                    <TableRow
                      style={{
                        height: 53,
                      }}
                    >
                      <StyledTableCell colSpan={12}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                          No Records
                        </Box>
                      </StyledTableCell>
                    </TableRow>
                  )}
                  {addRow && <AddTableRow setAddRow={setAddRow} rows={rows} GetSuppliersBySurveyId={GetSuppliersBySurveyId} isLoading={isLoading} />}
                </TableBody>
              </Table>
              <Button
                type="submit"
                disabled={addRow || edit || isLoading}
                color="secondary"
                variant="text"
                sx={{ marginTop: '10px' }}
                onClick={() => {
                  setAddRow(true)
                }}
              >
                +Add Supplier
              </Button>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[25, 50, 75, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              style={{ display: visibleRows?.length >= 24 ? 'block' : 'none' }}
            />
          </Paper>
          <Box display="flex" gap={2} alignItems="center" flexDirection="row" justifyContent="flex-end">
            {edit ? (
              <>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEdit(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    Submit()
                  }}
                  disabled={editedIndexes?.length !== 0 || isLoading ? true : false}
                >
                  Save
                </Button>
              </>
            ) : (
              ''
            )}
          </Box>
        </Box>
      )}
    </DetailsBox>
  )
}
