import { useEffect, useMemo, useState } from 'react'
import useTableTheme from '@/constants/TableTheme'
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_Row,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ShowHideColumnsButton,
} from 'material-react-table'
import {
  Tooltip,
  Box,
  IconButton,
  ThemeProvider,
  //   Button,
} from '@mui/material'
import { FileDownload } from '@mui/icons-material'
import { mkConfig, generateCsv, download } from 'export-to-csv'
import {
  // useNavigate,
  useParams,
} from 'react-router-dom'
import LoadingSpinner from '@/components/loader'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ReportsService } from '@/services/reports.service'
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";

type SurveyReports = {
  survey_id: number
  supplier_name: string
  supplier_token: string
  respondent_token: string
  respond_start_date: string
  respond_end_date: string
  status_name: string
  sub_status_name: string
  supplier_user_id: number
  respond_type_name: string
  is_test: boolean
}

const SurveyReportsTable = () => {
  //data and fetching state
  //   const navigate = useNavigate();
  //   const { showMessage } = useSnackbar();
  const [data, setData] = useState<SurveyReports[]>([])
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)
  const reportsService = new ReportsService()
  const { surveyId } = useParams()
  const [rowCount, setRowCount] = useState(0)
  const tableTheme = useTableTheme()

  //table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  })

  // const truncateText = (text: string | null, maxLength: number): string => {
  //   if (text === null) {
  //     return '' // Return an empty string if text is null
  //   }
  //   return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
  // }

  // function formatDate(isoDate: any) {
  //   const date = new Date(isoDate);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // }

  //   function stripHtmlTags(htmlString: any) {
  //     return htmlString.replace(/<[^>]*>?/gm, "");
  //   }

  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true)
      } else {
        setIsRefetching(true)
      }

      try {
        // const reportData = await reportsService.surveysReport(surveyId, 1, 10000000, "", [], []);
        const reportData = await reportsService.surveysReport(
          surveyId,
          pagination.pageIndex + 1,
          pagination.pageSize,
          globalFilter,
          sorting,
          columnFilters,
        )
        setData(reportData.surveys)
        setRowCount(reportData.total_length)
        setIsError(false)
      } catch (error) {
        // if ((error as any)?.response?.status === 403) {
        //   showMessage('Access denied: Insufficient permissions.', 'error');
        //   navigate('/forbidden', { state: { message: `Report` } });
        // } else {
        //   showMessage('An error occurred. Please try again.', 'error');
        //   navigate('/not-found', { state: { message: `Report` } });
        // }
        setIsError(true)
        console.error(error)
      } finally {
        setIsLoading(false)
        setIsRefetching(false)
      }
    }
    fetchData()
  }, [columnFilters, globalFilter, pagination.pageIndex, pagination.pageSize, sorting, surveyId])

  const columns = useMemo<MRT_ColumnDef<SurveyReports>[]>(
    () => [
      //   {
      //     accessorKey: "survey_id",
      //     header: "Survey Id",
      //     // filterVariant: 'multi-select',
      //     columnFilterModeOptions: ["fuzzy", "contains", "startsWith", "endsWith", "equals", "notEquals", "between", "betweenInclusive", "greaterThan", "greaterThanOrEqualTo", "lessThan", "lessThanOrEqualTo", "empty", "notEmpty"],
      //     size: 250,
      //     Cell: ({ row, renderedCellValue }: { row: MRT_Row<SurveyReports>; renderedCellValue: React.ReactNode }) => (
      //       <Tooltip
      //         placement="left"
      //         title={row.original.survey_id ? row.original.survey_id : null}
      //         PopperProps={{
      //           sx: {
      //             "& .MuiTooltip-tooltip": {
      //               backgroundColor: "#ffffff",
      //               color: "black",
      //               width: "100%",
      //               fontSize: "1rem",
      //               padding: "1rem",
      //               lineHeight: "1.5rem",
      //               boxShadow: "0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)",
      //               borderRadius: "1rem",
      //             },
      //           },
      //         }}
      //       >
      //         <Box style={{ display: "flex" }}>
      //           <Box
      //             sx={{
      //               display: "flex",
      //               alignItems: "center",
      //               maxWidth: "150px",
      //               overflow: "hidden",
      //             }}
      //           >
      //             {/* <StyledLink to={`/clients/${row?.original.client_id}/survey-details`} sx={{ whiteSpace: 'pre-wrap' }}>
      //               {renderedCellValue !== null ? renderedCellValue : ''}
      //             </StyledLink> */}
      //           </Box>
      //           <Box>{row.original.survey_id}</Box>
      //         </Box>
      //         {/* <Box sx={{ whiteSpace: 'pre-wrap' }}>{renderedCellValue !== null ? truncateText(renderedCellValue, 20) : ''}</Box> */}
      //         {/* <Box sx={{ whiteSpace: 'pre-wrap' }}>{row.original.clinent_name !== null ? truncateText(row.original.clinent_name, 20) : ''}</Box> */}
      //       </Tooltip>
      //     ),
      //   },
      //   {
      //     // accessorKey: 'client_is_active',
      //     // header: 'Client Active',
      //     // Cell: ({ row, renderedCellValue }: { row: MRT_Row<User>, renderedCellValue: React.ReactNode }) => (
      //     //   <Tooltip
      //     //     placement="left"
      //     //     title={row.original.client_is_active.toString()[0].toUpperCase() + row.original.client_is_active.toString().slice(1)}
      //     //     PopperProps={{
      //     //       sx: {
      //     //         '& .MuiTooltip-tooltip': {
      //     //           backgroundColor: '#ffffff',
      //     //           color: 'black',
      //     //           width: '100%',
      //     //           fontSize: '1rem',
      //     //           padding: '1rem',
      //     //           lineHeight: '1.5rem',
      //     //           boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
      //     //           borderRadius: '1rem',
      //     //         },
      //     //       },
      //     //     }}
      //     //   >
      //     //     <Box sx={{ whiteSpace: 'pre-wrap' }}>{row.original.client_is_active !== null ? row.original.client_is_active.toString()[0].toUpperCase() + row.original.client_is_active.toString().slice(1) : ''}</Box>
      //     //   </Tooltip>
      //     // ),
      //     header: 'Client Active',
      //     accessorFn: (originalRow) => (originalRow.supplier_name ? 'true' : 'false'), //must be strings
      //     id: 'supplier_name',
      //     filterVariant: 'checkbox',
      //     Cell: ({ cell }) =>
      //       cell.getValue() === 'true' ? 'Active' : 'Inactive',
      //     size: 170,
      //   },
      {
        accessorKey: 'respondent_token',
        header: 'Respondent Token',
        size: 250,
        Cell: ({ row, renderedCellValue }: { row: MRT_Row<SurveyReports>; renderedCellValue: React.ReactNode }) => (
          <Tooltip
            placement="left"
            title={row.original.respondent_token.length > 20 ? row.original.respondent_token : null}
            PopperProps={{
              sx: {
                '& .MuiTooltip-tooltip': {
                  backgroundColor: '#ffffff',
                  color: 'black',
                  width: '100%',
                  fontSize: '1rem',
                  padding: '1rem',
                  lineHeight: '1.5rem',
                  boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
                  borderRadius: '1rem',
                },
              },
            }}
          >
            <Box style={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: '150px',
                  overflow: 'hidden',
                }}
              >
                {renderedCellValue !== null ? renderedCellValue : ''}
              </Box>
              <Box>{row.original.respondent_token.length > 20 && row.original.respondent_token !== null ? '...' : null}</Box>
            </Box>
            {/* <Box sx={{ whiteSpace: 'pre-wrap' }}>{renderedCellValue !== null ? truncateText(renderedCellValue, 20) : ''}</Box> */}
          </Tooltip>
        ),
      },
      {
        accessorKey: 'supplier_name',
        header: 'Supplier Name',
        size: 250,
        Cell: ({ row, renderedCellValue }: { row: MRT_Row<SurveyReports>; renderedCellValue: React.ReactNode }) => (
          <Tooltip
            placement="left"
            title={row.original.supplier_name.length > 20 ? row.original.supplier_name : null}
            PopperProps={{
              sx: {
                '& .MuiTooltip-tooltip': {
                  backgroundColor: '#ffffff',
                  color: 'black',
                  width: '100%',
                  fontSize: '1rem',
                  padding: '1rem',
                  lineHeight: '1.5rem',
                  boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
                  borderRadius: '1rem',
                },
              },
            }}
          >
            <Box style={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: '150px',
                  overflow: 'hidden',
                }}
              >
                {renderedCellValue !== null ? renderedCellValue : ''}
              </Box>
              <Box>{row.original.supplier_name.length > 20 && row.original.supplier_name !== null ? '...' : null}</Box>
            </Box>
            {/* <Box sx={{ whiteSpace: 'pre-wrap' }}>{renderedCellValue !== null ? truncateText(renderedCellValue, 20) : ''}</Box> */}
          </Tooltip>
        ),
      },
      {
        accessorKey: 'supplier_token',
        header: 'Supplier Token',
        size: 250,
        Cell: ({ row, renderedCellValue }: { row: MRT_Row<SurveyReports>; renderedCellValue: React.ReactNode }) => (
          <Tooltip
            placement="left"
            title={row.original.supplier_token.length > 20 ? row.original.supplier_token : null}
            PopperProps={{
              sx: {
                '& .MuiTooltip-tooltip': {
                  backgroundColor: '#ffffff',
                  color: 'black',
                  width: '100%',
                  fontSize: '1rem',
                  padding: '1rem',
                  lineHeight: '1.5rem',
                  boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
                  borderRadius: '1rem',
                },
              },
            }}
          >
            <Box style={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: '150px',
                  overflow: 'hidden',
                }}
              >
                {renderedCellValue !== null ? renderedCellValue : ''}
              </Box>
              <Box>{row.original.supplier_token.length > 20 && row.original.supplier_token !== null ? '...' : null}</Box>
            </Box>
            {/* <Box sx={{ whiteSpace: 'pre-wrap' }}>{renderedCellValue !== null ? truncateText(renderedCellValue, 20) : ''}</Box> */}
          </Tooltip>
        ),
      },
      {
        header: 'Start Date',
        id: 'respond_start_date',
        filterVariant: 'date-range',
        enableColumnFilter: false,
        accessorFn: (row) => new Date(row.respond_start_date),
        Cell: ({ cell, row }) => (row.original.respond_start_date !== null ? cell.getValue<Date>().toLocaleDateString() : ''),
        size: 175,
        // accessorKey: 'client_notes_created_at',
        // header: 'Client Notes Created At',
        // size: 275,
        // Cell: ({ row, renderedCellValue }: { row: MRT_Row<User>, renderedCellValue: React.ReactNode }) => (
        //   <Tooltip
        //     placement="left"
        //     title={formatDate(row.original.client_notes_created_at)}
        //     PopperProps={{
        //       sx: {
        //         '& .MuiTooltip-tooltip': {
        //           backgroundColor: '#ffffff',
        //           color: 'black',
        //           width: '100%',
        //           fontSize: '1rem',
        //           padding: '1rem',
        //           lineHeight: '1.5rem',
        //           boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
        //           borderRadius: '1rem',
        //         },
        //       },
        //     }}
        //   >
        //     <Box sx={{ whiteSpace: 'pre-wrap' }}>{row.original.client_notes_created_at !== null ? formatDate(row.original.client_notes_created_at) : ''}</Box>
        //   </Tooltip>
        // ),
      },
      //   {
      //     // accessorKey: 'is_client_followup',
      //     // header: 'Client Followup',
      //     // size: 250,
      //     // Cell: ({ row, renderedCellValue }: { row: MRT_Row<User>, renderedCellValue: React.ReactNode }) => (
      //     //   <Tooltip
      //     //     placement="left"
      //     //     title={row.original.is_client_followup.toString()[0].toUpperCase() + row.original.is_client_followup.toString().slice(1)}
      //     //     PopperProps={{
      //     //       sx: {
      //     //         '& .MuiTooltip-tooltip': {
      //     //           backgroundColor: '#ffffff',
      //     //           color: 'black',
      //     //           width: '100%',
      //     //           fontSize: '1rem',
      //     //           padding: '1rem',
      //     //           lineHeight: '1.5rem',
      //     //           boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
      //     //           borderRadius: '1rem',
      //     //         },
      //     //       },
      //     //     }}
      //     //   >
      //     //     <Box sx={{ whiteSpace: 'pre-wrap' }}>{row.original.is_client_followup !== null ? row.original.is_client_followup.toString()[0].toUpperCase() + row.original.is_client_followup.toString().slice(1) : ''}</Box>
      //     //   </Tooltip>
      //     // ),

      //     header: 'Client Followup',
      //     accessorFn: (originalRow) => (originalRow.is_client_followup ? 'true' : 'false'), //must be strings
      //     id: 'is_client_followup',
      //     filterVariant: 'checkbox',
      //     Cell: ({ cell }) =>
      //       cell.getValue() === 'true' ? 'Active' : 'Inactive',
      //     size: 170,
      //   },
      {
        // accessorKey: 'client_followup_at',
        // header: 'Client Followup At',
        // Cell: ({ row, renderedCellValue }: { row: MRT_Row<User>, renderedCellValue: React.ReactNode }) => (
        //   <Tooltip
        //     placement="left"
        //     title={formatDate(row.original.client_followup_at)}
        //     PopperProps={{
        //       sx: {
        //         '& .MuiTooltip-tooltip': {
        //           backgroundColor: '#ffffff',
        //           color: 'black',
        //           width: '100%',
        //           fontSize: '1rem',
        //           padding: '1rem',
        //           lineHeight: '1.5rem',
        //           boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
        //           borderRadius: '1rem',
        //         },
        //       },
        //     }}
        //   >
        //     <Box sx={{ whiteSpace: 'pre-wrap' }}>{row.original.client_followup_at !== null ? formatDate(row.original.client_followup_at) : ''}</Box>
        //   </Tooltip>
        // ),
        header: 'End Date',
        id: 'respond_end_date',
        filterVariant: 'date-range',
        enableColumnFilter: false,
        accessorFn: (row) => new Date(row.respond_end_date),
        Cell: ({ cell, row }) => (row.original.respond_end_date !== null ? cell.getValue<Date>().toLocaleDateString() : ''),
        size: 175,
      },
      {
        accessorKey: 'status_name',
        header: 'Status Name',
        size: 200,
        Cell: ({ row, renderedCellValue }: { row: MRT_Row<SurveyReports>; renderedCellValue: React.ReactNode }) => (
          <Tooltip
            placement="left"
            title={row.original.status_name.length > 20 ? row.original.status_name : null}
            PopperProps={{
              sx: {
                '& .MuiTooltip-tooltip': {
                  backgroundColor: '#ffffff',
                  color: 'black',
                  width: '100%',
                  fontSize: '1rem',
                  padding: '1rem',
                  lineHeight: '1.5rem',
                  boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
                  borderRadius: '1rem',
                },
              },
            }}
          >
            <Box style={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: '150px',
                  overflow: 'hidden',
                }}
              >
                {renderedCellValue !== null ? renderedCellValue : ''}
              </Box>
              <Box>{row.original.status_name.length > 20 && row.original.status_name !== null ? '...' : null}</Box>
            </Box>
            {/* <Box sx={{ whiteSpace: 'pre-wrap' }}>{renderedCellValue !== null ? truncateText(renderedCellValue, 20) : ''}</Box> */}
          </Tooltip>
        ),
      },
      {
        accessorKey: 'sub_status_name',
        header: 'Sub Status Name',
        size: 250,
        Cell: ({ row, renderedCellValue }: { row: MRT_Row<SurveyReports>; renderedCellValue: React.ReactNode }) => (
          <Tooltip
            placement="left"
            title={row.original.sub_status_name.length > 20 ? row.original.sub_status_name : null}
            PopperProps={{
              sx: {
                '& .MuiTooltip-tooltip': {
                  backgroundColor: '#ffffff',
                  color: 'black',
                  width: '100%',
                  fontSize: '1rem',
                  padding: '1rem',
                  lineHeight: '1.5rem',
                  boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
                  borderRadius: '1rem',
                },
              },
            }}
          >
            <Box style={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: '150px',
                  overflow: 'hidden',
                }}
              >
                {renderedCellValue !== null ? renderedCellValue : ''}
              </Box>
              <Box>{row.original.sub_status_name.length > 20 && row.original.sub_status_name !== null ? '...' : null}</Box>
            </Box>
            {/* <Box sx={{ whiteSpace: 'pre-wrap' }}>{renderedCellValue !== null ? truncateText(renderedCellValue, 20) : ''}</Box> */}
          </Tooltip>
        ),
      },
      {
        accessorKey: 'respond_type_name',
        header: 'Type Name',
        size: 175,
        Cell: ({ row, renderedCellValue }: { row: MRT_Row<SurveyReports>; renderedCellValue: React.ReactNode }) => (
          <Tooltip
            placement="left"
            title={row.original.respond_type_name.length > 20 ? row.original.respond_type_name : null}
            PopperProps={{
              sx: {
                '& .MuiTooltip-tooltip': {
                  backgroundColor: '#ffffff',
                  color: 'black',
                  width: '100%',
                  fontSize: '1rem',
                  padding: '1rem',
                  lineHeight: '1.5rem',
                  boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
                  borderRadius: '1rem',
                },
              },
            }}
          >
            <Box style={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: '150px',
                  overflow: 'hidden',
                }}
              >
                {renderedCellValue !== null ? renderedCellValue : ''}
              </Box>
              <Box>{row.original.respond_type_name.length > 20 && row.original.respond_type_name !== null ? '...' : null}</Box>
            </Box>
            {/* <Box sx={{ whiteSpace: 'pre-wrap' }}>{renderedCellValue !== null ? truncateText(renderedCellValue, 20) : ''}</Box> */}
          </Tooltip>
        ),
      },
      //   {
      //     accessorKey: 'client_note_user_first_name',
      //     header: 'Client Note User',
      //     size: 250,
      //     Cell: ({ row, }: { row: MRT_Row<SurveyReports>, renderedCellValue: React.ReactNode }) => (
      //       <Tooltip
      //         placement="left"
      //         title={`${row.original.client_note_user_first_name} ${row.original.client_note_user_last_name}`}
      //         PopperProps={{
      //           sx: {
      //             '& .MuiTooltip-tooltip': {
      //               backgroundColor: '#ffffff',
      //               color: 'black',
      //               width: '100%',
      //               fontSize: '1rem',
      //               padding: '1rem',
      //               lineHeight: '1.5rem',
      //               boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
      //               borderRadius: '1rem',
      //             },
      //           },
      //         }}
      //       >
      //         <Box style={{ display: "flex", }}>
      //           <Box sx={{
      //             display: 'flex',
      //             alignItems: 'center',
      //             maxWidth: "150px",
      //             overflow: "hidden"
      //           }}>
      //             {`${row.original.client_note_user_first_name} ${row.original.client_note_user_last_name}` !== null ? `${row.original.client_note_user_first_name} ${row.original.client_note_user_last_name}` : ''}
      //           </Box>
      //           <Box>
      //             {(`${row.original.client_note_user_first_name} ${row.original.client_note_user_last_name}`?.length > 20 && `${row.original.client_note_user_first_name} ${row.original.client_note_user_last_name}` !== null) ? '...' : null}
      //           </Box>
      //         </Box>
      //         {/* <Box sx={{ whiteSpace: 'pre-wrap' }}>{`${row.original.client_note_user_first_name} ${row.original.client_note_user_last_name}` !== null ? truncateText(`${row.original.client_note_user_first_name} ${row.original.client_note_user_last_name}`, 20) : ''}</Box> */}
      //       </Tooltip>
      //     ),
      //   },
      // {
      //   accessorKey: "client_note_user_last_name",
      //   header: "Client Note User Last",
      //   Cell: ({ row, renderedCellValue }: { row: MRT_Row<User>, renderedCellValue: React.ReactNode }) => (
      //     <Tooltip
      //       placement="left"
      //       title={row.original.client_note_user_last_name}
      //       PopperProps={{
      //         sx: {
      //           "& .MuiTooltip-tooltip": {
      //             backgroundColor: "#ffffff",
      //             color: "black",
      //             width: "100%",
      //             fontSize: "1rem",
      //             padding: "1rem",
      //             lineHeight: "1.5rem",
      //             boxShadow: "0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)",
      //             borderRadius: "1rem",
      //           },
      //         },
      //       }}
      //     >
      //       <Box sx={{ whiteSpace: "pre-wrap" }}>{truncateText(row.original.client_note_user_last_name, 20)}</Box>
      //     </Tooltip>
      //   ),
      // },
      //   {
      //     accessorKey: 'client_note_user_email',
      //     header: 'Client Note Email',
      //     // filterVariant: 'multi-select',
      //     size: 250,
      //     Cell: ({ row, renderedCellValue }: { row: MRT_Row<SurveyReports>, renderedCellValue: React.ReactNode }) => (
      //       <Tooltip
      //         placement="left"
      //         title={row.original.client_note_user_email.length > 20 ? row.original.client_note_user_email : null}
      //         PopperProps={{
      //           sx: {
      //             '& .MuiTooltip-tooltip': {
      //               backgroundColor: '#ffffff',
      //               color: 'black',
      //               width: '100%',
      //               fontSize: '1rem',
      //               padding: '1rem',
      //               lineHeight: '1.5rem',
      //               boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
      //               borderRadius: '1rem',
      //             },
      //           },
      //         }}
      //       >
      //         <Box style={{ display: "flex", }}>
      //           <Box sx={{
      //             display: 'flex',
      //             alignItems: 'center',
      //             maxWidth: "150px",
      //             overflow: "hidden"
      //           }}>
      //             {renderedCellValue !== null ? renderedCellValue : ''}
      //           </Box>
      //           <Box>
      //             {(row.original.client_note_user_email?.length > 20 && row.original.client_note_user_email !== null) ? '...' : null}
      //           </Box>
      //         </Box>
      //         {/* <Box sx={{ whiteSpace: 'pre-wrap' }}>{row.original.client_note_user_email !== null ? truncateText(row.original.client_note_user_email, 20) : ''}</Box> */}
      //       </Tooltip>
      //     ),
      //   },
      //   {
      //     accessorKey: 'client_contact_first_name',
      //     header: 'Client Contact',
      //     size: 250,
      //     Cell: ({ row, }: { row: MRT_Row<SurveyReports>, renderedCellValue: React.ReactNode }) => (
      //       <Tooltip
      //         placement="left"
      //         title={`${row.original.client_contact_first_name} ${row.original.client_contact_last_name}`}
      //         PopperProps={{
      //           sx: {
      //             '& .MuiTooltip-tooltip': {
      //               backgroundColor: '#ffffff',
      //               color: 'black',
      //               width: '100%',
      //               fontSize: '1rem',
      //               padding: '1rem',
      //               lineHeight: '1.5rem',
      //               boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
      //               borderRadius: '1rem',
      //             },
      //           },
      //         }}
      //       >
      //         <Box style={{ display: "flex", }}>
      //           <Box sx={{
      //             display: 'flex',
      //             alignItems: 'center',
      //             maxWidth: "150px",
      //             overflow: "hidden"
      //           }}>
      //             {`${row.original.client_contact_first_name} ${row.original.client_contact_last_name}` !== null ? `${row.original.client_contact_first_name} ${row.original.client_contact_last_name}` : ''}
      //           </Box>
      //           <Box>
      //             {(`${row.original.client_contact_first_name} ${row.original.client_contact_last_name}`?.length > 20 && `${row.original.client_contact_first_name} ${row.original.client_contact_last_name}` !== null) ? '...' : null}
      //           </Box>
      //         </Box>
      //         {/* <Box sx={{ whiteSpace: 'pre-wrap' }}>{`${row.original.client_contact_first_name} ${row.original.client_contact_last_name}` !== null ? truncateText(`${row.original.client_contact_first_name} ${row.original.client_contact_last_name}`, 20) : ''}</Box> */}
      //       </Tooltip>
      //     ),
      //   },
      // {
      //   accessorKey: "client_contact_last_name",
      //   header: "Client e",
      //   Cell: ({ row, renderedCellValue }: { row: MRT_Row<User>, renderedCellValue: React.ReactNode }) => (
      //     <Tooltip
      //       placement="left"
      //       title={row.original.client_contact_last_name}
      //       PopperProps={{
      //         sx: {
      //           "& .MuiTooltip-tooltip": {
      //             backgroundColor: "#ffffff",
      //             color: "black",
      //             width: "100%",
      //             fontSize: "1rem",
      //             padding: "1rem",
      //             lineHeight: "1.5rem",
      //             boxShadow: "0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)",
      //             borderRadius: "1rem",
      //           },
      //         },
      //       }}
      //     >
      //       <Box sx={{ whiteSpace: "pre-wrap" }}>{truncateText(row.original.client_contact_last_name, 20)}</Box>
      //     </Tooltip>
      //   ),
      // },
      //   {
      //     accessorKey: 'client_contact_email',
      //     header: 'Client Contact Email',
      //     // filterVariant: 'multi-select',
      //     size: 250,
      //     Cell: ({ row, renderedCellValue }: { row: MRT_Row<SurveyReports>, renderedCellValue: React.ReactNode }) => (
      //       <Tooltip
      //         placement="left"
      //         title={row.original.client_contact_email.length > 20 ? row.original.client_contact_email : null}
      //         PopperProps={{
      //           sx: {
      //             '& .MuiTooltip-tooltip': {
      //               backgroundColor: '#ffffff',
      //               color: 'black',
      //               width: '100%',
      //               fontSize: '1rem',
      //               padding: '1rem',
      //               lineHeight: '1.5rem',
      //               boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
      //               borderRadius: '1rem',
      //             },
      //           },
      //         }}
      //       >
      //         <Box style={{ display: "flex", }}>
      //           <Box sx={{
      //             display: 'flex',
      //             alignItems: 'center',
      //             maxWidth: "150px",
      //             overflow: "hidden"
      //           }}>
      //             {renderedCellValue !== null ? renderedCellValue : ''}
      //           </Box>
      //           <Box>
      //             {(row.original.client_contact_email?.length > 20 && row.original.client_contact_email !== null) ? '...' : null}
      //           </Box>
      //         </Box>
      //         {/* <Box sx={{ whiteSpace: 'pre-wrap' }}>{row.original.client_contact_email !== null ? truncateText(row.original.client_contact_email, 20) : ''}</Box> */}
      //       </Tooltip>
      //     ),
      //   },
      //   {
      //     accessorKey: 'interaction_type',
      //     header: 'Interaction',
      //     filterVariant: 'multi-select',
      //     columnFilterModeOptions: [],
      //     size: 250,
      //     Cell: ({ row, renderedCellValue }: { row: MRT_Row<SurveyReports>, renderedCellValue: React.ReactNode }) => (
      //       <Tooltip
      //         placement="left"
      //         title={row.original.interaction_type.length > 20 ? row.original.interaction_type : null}
      //         PopperProps={{
      //           sx: {
      //             '& .MuiTooltip-tooltip': {
      //               backgroundColor: '#ffffff',
      //               color: 'black',
      //               width: '100%',
      //               fontSize: '1rem',
      //               padding: '1rem',
      //               lineHeight: '1.5rem',
      //               boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.15), 0px 8px 24px -4px rgba(199, 203, 206, 0.2)',
      //               borderRadius: '1rem',
      //             },
      //           },
      //         }}
      //       >
      //         <Box style={{ display: "flex", }}>
      //           <Box sx={{
      //             display: 'flex',
      //             alignItems: 'center',
      //             maxWidth: "150px",
      //             overflow: "hidden"
      //           }}>
      //             {renderedCellValue !== null ? renderedCellValue : ''}
      //           </Box>
      //           <Box>
      //             {(row.original.interaction_type?.length > 20 && row.original.interaction_type !== null) ? '...' : null}
      //           </Box>
      //         </Box>
      //         {/* <Box sx={{ whiteSpace: 'pre-wrap' }}>{row.original.interaction_type !== null ? truncateText(row.original.interaction_type, 20) : ''}</Box> */}
      //       </Tooltip>
      //     ),
      //   },
    ],
    [],
  )

  const csvConfig = mkConfig({
    filename: 'survey-report',
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  })

  const formatKey = (key: string) => {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const handleExportData = async () => {
    setLoading(true)
    console.log('Hello')
    try {
      //   const reportData = await homeService.clientReport(1, rowCount, '', [], []);
      const reportData = table.getFilteredRowModel().rows.map((row) => row.original)

      if (reportData) {
        const visibleColumns = table.getState().columnVisibility

        const alwaysExcludeKeys = new Set(['survey_id', 'is_test', 'supplier_user_id'])

        //   const filteredClients = reportData.clients.map((survey: SurveyReports) => {
        //     const { account_id, account_name, account_is_active, client_id, client_notes_id, ...filteredClient } = survey;
        //     return filteredClient;
        //   });

        const filteredSurveys = reportData?.map((survey: { [x: string]: any }) => {
          const filteredProject: any = {}
          Object.keys(survey).forEach((key) => {
            if (!alwaysExcludeKeys.has(key) && visibleColumns[key] !== false) {
              filteredProject[formatKey(key)] = survey[key] == null || survey[key] === undefined ? '' : survey[key]
            }
          })

          // if (visibleColumns['client_note_user_first_name'] !== false && 'client_note_user_first_name' in survey && 'client_note_user_last_name' in survey) {
          //   filteredProject['Client Note User Name'] = `${survey.client_note_user_first_name || ''} ${survey.client_note_user_last_name || ''}`.trim();
          // }

          // if (visibleColumns['client_contact_first_name'] !== false && 'client_contact_first_name' in survey && 'client_contact_last_name' in survey) {
          //   filteredProject['Client Contact User Name'] = `${survey.client_contact_first_name || ''} ${survey.client_contact_last_name || ''}`.trim();
          // }

          return filteredProject
        })

        const csv = generateCsv(csvConfig)(filteredSurveys)
        download(csvConfig)(csv)
      }
      setLoading(false)
      setIsError(false)
    } catch (error) {
      setIsError(true)
      setLoading(false)
      console.error(error)
    }
  }

  const table = useMaterialReactTable({
    columns,
    data,
    // enableRowSelection: true,
    isMultiSortEvent: () => true,
    enableColumnFilterModes: true,
    muiTableHeadCellProps: { sx: { fontWeight: 'bold' } },
    muiTableContainerProps: { sx: { minHeight: '600px', maxHeight: 'calc(100vh - 260px)', width: '100%', borderRadius: '1rem' } },
    enableStickyHeader: true,
    enableStickyFooter: true,

    enableFilterMatchHighlighting: true,
    columnFilterDisplayMode: 'popover',
    mrtTheme: () => ({
      matchHighlightColor: '#FFCB7F',
      // draggingBackgroundColor: '#DEF7E0',
      // pinnedRowdraggingBackgroundColor: '#DEF7E0'
    }),
    enableColumnPinning: true,

    getRowId: (row) => row.supplier_name,
    initialState: {
      pagination: { pageSize: 100, pageIndex: 0 },
      showColumnFilters: false,
      columnVisibility: {},
      density: 'compact',
      showGlobalFilter: true,
    },
    muiPaginationProps: {
      rowsPerPageOptions: [100, 200, 1000],
    },
    // renderTopToolbarCustomActions: () => (
    // ),

    renderToolbarInternalActions: ({ table }) => (
      <Box>
        <Tooltip title="Export data">
          <IconButton sx={{ height: '42px' }} onClick={handleExportData}>
            <FileDownload />
          </IconButton>
        </Tooltip>
        {/* <MRT_GlobalFilterTextField table={table} /> */}
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
      </Box>
    ),

    enableFacetedValues: true,

    enableColumnResizing: true,
    defaultDisplayColumn: { enableResizing: true },

    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        style={{
          width: '100%',
          padding: '0rem 1.5rem',
          display: 'grid',
          //   borderRadius: "1rem",
          //   border: `1px solid white`,
          //   boxShadow: "0rem 0rem 0.125rem rgba(145, 158, 171, 0.25), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.25)",
          marginBottom: '2rem',
        }}
      >
        {/* <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button variant="contained" color="primary" style={{ marginTop: "0.6rem", marginBottom: "1rem" }}>
            Export Data
            <ExitToAppIcon style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Box> */}
        {loading ? (
          //   <CenteredContainer>
          <LoadingSpinner />
        ) : //   </CenteredContainer>
        null}
        <ThemeProvider theme={tableTheme}>
          <MaterialReactTable table={table} />
        </ThemeProvider>
      </Box>
    </LocalizationProvider>
  )
}

export default SurveyReportsTable
