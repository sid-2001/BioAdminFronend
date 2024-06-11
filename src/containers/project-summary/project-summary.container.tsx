import SummaryCard from '@/components/summary-card'
import { GridContainerProject, GridContainerProjectTable } from './project-summary.style'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, ThemeProvider, Typography } from '@mui/material'

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Button, Tooltip } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import MultipleSelectCheckmarks from '@/components/multiple-select'
import { ProjectDataService } from '@/services/project-data.services'
import { useParams } from 'react-router-dom'
import { logger } from '@/helpers/logger'
import { DataTableType, SummaryCardsType } from '@/types/project-data.type'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import LoadingSpinner from '@/components/loader'
//@ts-ignore
import {
  MaterialReactTable,
  useMaterialReactTable,
  //@ts-ignore
} from 'material-react-table'
import useTableTheme from '@/constants/TableTheme'
import RepartitionIcon from '@mui/icons-material/Repartition'
import SummryReconcileDataComponent from '@/components/summry-reconcile-data'
import Select from '@/components/select'
import { ListService } from '@/services/list.service'
import { ReconcileQuotaData } from '@/components/summry-reconcile-data/summry-reconcile-data.type'
import { enqueueSnackbar } from 'notistack'

// const jsonData = {
//     "project": {
//         "project_id": "p760806307351",
//         "name": "Cybersecurity Branding",
//         "last_sync": "2 Hours ago"
//     },
//     "summary_card": [
//         {
//             "type": "Data Cleaning",
//             "name": "Straight Line Check",
//             "total": 725,
//             "fail": 17,
//             "sync_time": "2 hours ago",
//             "reviewed": 17
//         },
//         {
//             "type": "Data Cleaning",
//             "name": "Speeder Check",
//             "total": 725,
//             "fail": 6,
//             "sync_time": "2 hours ago",
//             "reviewed": 4
//         },
//         {
//             "type": "Data Validation",
//             "name": "Conditions Check",
//             "total": 725,
//             "fail": 100,
//             "sync_time": "2 hours ago",
//             "reviewed": 14
//         },
//         {
//             "type": "Data Validation",
//             "name": "Validations Check",
//             "total": 725,
//             "fail": 28,
//             "sync_time": "2 hours ago",
//             "reviewed": 40
//         }
//     ]
// }

const DummyCheckList = [
  {
    id: 'straight_liner_validation_status',
    name: 'Straight Line Check',
  },
  {
    id: 'speeder_validation_status',
    name: 'Speeder Check',
  },
  {
    id: 'conditions_check_status',
    name: 'Conditions Check',
  },
  {
    id: 'validations_check_status',
    name: 'Validations Check',
  },
  {
    id: 'ip_validation_status',
    name: 'IP Check',
  },
  {
    id: 'open_text_validation_status',
    name: 'Open Text Check',
  },
]

interface CheckListItem {
  value: string
  text: string
}

const SummaryContainer = () => {
  const { projectId, surveyId } = useParams()
  // const projectId = 123;
  const projectDataService = new ProjectDataService()
  const listService = new ListService()
  const [summaryCardsData, setSummaryCardsData] = useState<SummaryCardsType[] | null>(null)
  const [tableData, setTableData] = useState<DataTableType | null>(null)
  const [modalTableData, setModalTableData] = useState<DataTableType | null>(null)
  const [checkList, setCheckList] = useState<CheckListItem[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [importErrorModal, setImportErrorModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reconcileModal, setReconcileModal] = useState(false)
  const [rowSelection, setRowSelection] = useState<any>({})
  const [typeSelectModal, setTypeSelectModal] = useState(false)
  const [typeList, setTypeList] = useState<any>([])
  const [selectedReconcileType, setSelectedReconcileType] = useState<any>('')
  const [reconcileTableData, setReconcileTableData] = useState<ReconcileQuotaData[]>([])
  const [summaryData, setSummaryData] = useState<any>(null)
  const EMPTY_SOURCE_MESSAGE = 'Not Data'
  const fileInputRef = useRef<HTMLInputElement>(null)

  // function OpenErrorModal() {
  //   setImportErrorModal(true)
  // }
  function CloseErrorModal() {
    setImportErrorModal(false)
  }

  function openDialog() {
    setShowDialog(true)
  }

  function closeDialog() {
    setShowDialog(false)
  }

  const reconcileModalClose = () => {
    setReconcileModal(false)
  }

  // function handleFileUpload(event: any) {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();

  //   reader.onload = (e) => {
  //     const data = (e as any).target.result;
  //     const workbook = XLSX.read(data, { type: "binary" });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     const parsedData: any = XLSX.utils.sheet_to_json(sheet);
  //     const requiredKeys = [
  //       "respondent_id",
  //       "respondent_status",
  //       "interview_start_timestamp",
  //       "interview_end_timestamp",
  //     ];
  //     // console.log(data, workbook, sheetName, sheet, parsedData, "parsedDataparsedData")
  //     // setModalTableData(parsedData);
  //     // openDialog();
  //     const areAllKeysPresent = requiredKeys.every(key =>
  //       parsedData.some((row: {}) => Object.keys(row).includes(key))
  //     );

  //     if (data || workbook || sheetName || sheet || parsedData || areAllKeysPresent) {
  //       setModalTableData(parsedData);
  //       openDialog();
  //     } else {
  //       setImportErrorModal(true)
  //     }
  //     // };
  //   };

  //   reader.readAsBinaryString(file);
  //   event.target.value = null;
  // }

  function handleFileUpload(event: any) {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = (e as any).target.result
      const workbook = data ? XLSX?.read(data, { type: 'binary' }) : null
      const sheetName = workbook ? workbook?.SheetNames[0] : null
      const sheet = sheetName ? workbook?.Sheets[sheetName] : null
      const parsedData: any = sheet ? XLSX?.utils?.sheet_to_json(sheet) : null

      const requiredKeys = ['respondent_id', 'respondent_status', 'interview_start_timestamp', 'interview_end_timestamp']

      const areAllKeysPresent = parsedData && requiredKeys.every((key) => parsedData.some((row: {}) => Object.keys(row).includes(key)))

      if (workbook && sheetName && sheet && parsedData && areAllKeysPresent) {
        setModalTableData(parsedData)
        openDialog()
      } else {
        setImportErrorModal(true)
      }
    }

    reader.readAsBinaryString(file)
    event.target.value = null
  }

  function triggerFileInput() {
    setShowDialog(false)
    setModalTableData(null)
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  function s2ab(s: string) {
    const buffer = new ArrayBuffer(s.length)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff
    }
    return buffer
  }

  const handleSubmit = async () => {
    setLoading(true)
    const requiredExportKeys = [
      'response_id',
      'respondent_id',
      'conditions_check_status',
      'straight_liner_validation_status',
      'speeder_validation_status',
      'validations_check_status',
      'ip_validation_status',
      'open_text_validation_status',
    ]
    const responseIdMap = (tableData as any)?.reduce((map: { [x: string]: any }, item: { respondent_id: string | number; response_id: any }) => {
      map[item.respondent_id] = item.response_id
      return map
    }, {})

    // Filter modalTableData and include the response_id from responseIdMap
    const filteredData = (modalTableData as any)?.map((item: { [x: string]: any; respondent_id: string | number }) => {
      return (
        requiredExportKeys &&
        requiredExportKeys?.reduce((obj, key) => {
          if (key === 'response_id') {
            // Include response_id from the map
            ;(obj as any)[key] = responseIdMap && responseIdMap[item?.respondent_id]
          } else if (item[key] !== undefined) {
            ;(obj as any)[key] = item[key]
          }
          return obj
        }, {})
      )
    })

    console.log(filteredData, 'filteredData')

    // Convert modalTableData to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(filteredData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

    // Convert workbook to binary
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })

    // Convert binary string to Blob
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })

    // Create a File from Blob
    const file = new File([blob], 'exported_data.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    // Create FormData and append File
    const formData = new FormData()
    formData.append('files', file)
    if (projectId && surveyId)
      try {
        const data = await projectDataService.postProjectTableXlxs(Number(projectId), Number(surveyId), formData, (_progressEvent: any) => {})
        console.log(data)
      } catch (error) {
        logger.error(error)
      } finally {
        closeDialog()
        GetAllDataSummaryList()
        GetAllTableDataList()
        setLoading(false)
      }
  }

  // const columnKeys = Object.keys(resData.response_data[0] || {});

  // const columnKeys = Object?.keys(tableData && tableData?.response_data && tableData?.response_data[0] || {});

  // const columns = columnKeys
  //     .filter(key => !key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').includes('Original' || 'Reason'))
  //     .map(key => ({
  //         id: key,
  //         label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
  //         minWidth: 120,
  //         align: 'left',
  //     }));
  const columnKeys = tableData ? Object.keys((tableData && (tableData as any)[0]) || {}) : []
  const columns = columnKeys
    .map((key) => ({
      id: key,
      label: key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    }))
    // .filter(column => !column.label.includes('Original') && !column.label.includes('Reason') && !column?.label?.includes('Status Timestamp'))
    .filter(
      (column) =>
        column?.label?.includes('Respondent Id') ||
        column?.label?.includes('Respondent Status') ||
        column?.label?.includes('Interview Start Timestamp') ||
        column?.label?.includes('Interview End Timestamp') ||
        column?.label == 'Straight Liner Validation Status' ||
        column?.label == 'Speeder Validation Status' ||
        column?.label == 'Straight Liner Validation Status' ||
        column?.label == 'Conditions Check Status' ||
        column?.label == 'Validations Check Status' ||
        column?.label == 'Ip Validation Status' ||
        column?.label == 'Open Text Validation Status',
    )
    .map((column) => ({
      ...column,
      minWidth: 150,
      align: 'left',
    }))
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(25)

  const handleChangePage = (_event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: { target: { value: string | number } }) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  // modal table
  const modalTableDatacolumnKeys = modalTableData ? Object.keys((modalTableData && (modalTableData as any)[0]) || {}) : []
  const modalTableDatacolumnKeyscolumns = modalTableDatacolumnKeys
    .map((key) => ({
      id: key,
      label: key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    }))
    // .filter(column => !column.label.includes('Original') && !column.label.includes('Reason') && !column?.label?.includes('Status Timestamp'))
    .filter(
      (column) =>
        column?.label?.includes('Respondent Id') ||
        column?.label?.includes('Respondent Status') ||
        column?.label?.includes('Interview Start Timestamp') ||
        column?.label?.includes('Interview End Timestamp') ||
        column?.label == 'Straight Liner Validation Status' ||
        column?.label == 'Speeder Validation Status' ||
        column?.label == 'Straight Liner Validation Status' ||
        column?.label == 'Conditions Check Status' ||
        column?.label == 'Validations Check Status' ||
        column?.label == 'Ip Validation Status' ||
        column?.label == 'Open Text Validation Status',
    )
    .map((column) => ({
      ...column,
      minWidth: 150,
      align: 'left',
    }))
  // const exportToExcel = (data: unknown[], fileName: string) => {

  //     console.log(data, "data123")
  //     const worksheet = XLSX.utils.json_to_sheet(data);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  //     // Buffer
  //     // let buf = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

  //     // Binary string
  //     XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

  //     // Download
  //     XLSX.writeFile(workbook, `${fileName}.xlsx`);
  // };

  const exportToExcel = (data: unknown[], fileName: string) => {
    console.log(data, 'datadata')
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
  }

  const handleExport = () => {
    const validations_check_status = ['validations_check_status', 'validations_check_status_reason']
    const speeder_validation_status = ['speeder_validation_status', 'speeder_validation_status_reason']
    const straight_liner_validation_status = ['straight_liner_validation_status', 'straight_liner_validation_status_reason']
    const conditions_check_status = ['conditions_check_status', 'conditions_check_status_reason']

    const ip_validation_status = ['ip_validation_status', 'ip_validation_status_reason']
    const open_text_validation_status = ['open_text_validation_status', 'open_text_validation_status_reason']

    const requiredKeys = ['respondent_id', 'respondent_status', 'interview_start_timestamp', 'interview_end_timestamp']

    const selectedKeys = selectedIds.flatMap((id) => {
      switch (id) {
        case 'validations_check_status':
          return validations_check_status
        case 'speeder_validation_status':
          return speeder_validation_status
        case 'straight_liner_validation_status':
          return straight_liner_validation_status
        case 'conditions_check_status':
          return conditions_check_status
        case 'ip_validation_status':
          return ip_validation_status
        case 'open_text_validation_status':
          return open_text_validation_status
        default:
          return [id]
      }
    })

    const allKeysToInclude = [...new Set([...requiredKeys, ...selectedKeys])]

    const dataToExport = ((tableData as any) || []).map((row: { [x: string]: any }) => {
      const filteredRow = Object.keys(row)
        .filter((key) => allKeysToInclude.includes(key))
        .reduce<{ [key: string]: any }>((obj, key) => {
          obj[key] = row[key]
          return obj
        }, {})

      return filteredRow
    })

    exportToExcel(dataToExport, 'ExportedData')
  }

  const getTooltipContent = (
    row: {
      [x: string]: any
      response_id?: number
      respondent_id?: number
      respondent_status?: string
      interview_start_timestamp?: number
      interview_end_timestamp?: number
      straight_liner_validation_status?: number
      straight_liner_validation_status_reason?: string | null
      straight_liner_validation_original_status?: number
      speeder_validation_status?: number
      speeder_validation_status_reason?: string | null
      speeder_validation_original_status?: number
      conditions_check_status?: number
      conditions_check_status_reason?: string | null
      conditions_check_original_status?: number
      validations_check_status?: number
      validations_check_status_reason?: string | null
      validations_check_original_status?: number
      straight_liner_validation_status_timestamp?: number
      speeder_validation_status_timestamp?: number
      conditions_check_status_timestamp?: number
      validations_check_status_timestamp?: number
    },
    columnId: string,
  ) => {
    const reasonKey = columnId.replace('_status', '_status_reason')
    return row[reasonKey]
  }

  // const formatTimestamp = (timestamp: string | number | Date) => {
  //     return new Date(timestamp).toLocaleString();
  // };

  // function formatIsoDateTime(isoDateString) {
  //     const date = new Date(isoDateString);

  //     const year = date.getFullYear();
  //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  //     const day = String(date.getDate()).padStart(2, '0');
  //     const hours = String(date.getHours()).padStart(2, '0');
  //     const minutes = String(date.getMinutes()).padStart(2, '0');
  //     const seconds = String(date.getSeconds()).padStart(2, '0');

  //     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  // }

  const handleChange = (selected: any[]) => {
    const selectedIds = selected.map((item) => item.value)
    setSelectedIds(selectedIds)
  }

  const GetAllDataSummaryList = async () => {
    setLoading(true)
    if (projectId && surveyId)
      try {
        const data = await projectDataService.GetAllDataSummaryCards(Number(projectId), Number(surveyId))
        setSummaryCardsData(data)
      } catch (error) {
        logger.error(error)
      } finally {
        setLoading(false)
      }
  }

  const GetAllTableDataList = async () => {
    setLoading(true)
    if (projectId && surveyId)
      try {
        const data = await projectDataService.GetAllTableData(Number(projectId), Number(surveyId))
        setTableData(data?.response_data)
      } catch (error) {
        logger.error(error)
      } finally {
        setLoading(false)
      }
  }

  const tableDataMap = (tableData as any)?.reduce((acc: { [x: string]: any }, item: { respondent_id: string | number }) => {
    acc[item.respondent_id] = item
    return acc
  }, {})

  useEffect(() => {
    if (projectId && surveyId) {
      GetAllDataSummaryList()
      GetAllTableDataList()
    }
  }, [projectId, surveyId])

  useEffect(() => {
    if (DummyCheckList) {
      const serviceNames = DummyCheckList?.map((item) => ({
        value: item.id,
        text: item.name,
      }))
      setCheckList(serviceNames)
      const allIds = serviceNames.map((item) => item.value)
      setSelectedIds(allIds)
    }
  }, [])

  // const myCustomFilterFn = (row: any, id: any, filterValue: any) => {
  //   const lowerCaseFilterValue = filterValue.toLowerCase();
  //   const cellValue = row.getValue(id);
  //   console.log(id, "id")
  //   if (
  //     id === 'straight_liner_validation_status' ||
  //     id === 'speeder_validation_status' ||
  //     id === 'conditions_check_status' ||
  //     id === 'validations_check_status' ||
  //     id === 'ip_validation_status' ||
  //     id === 'open_text_validation_status'
  //   ) {
  //     if (lowerCaseFilterValue === 'fail') {
  //       return cellValue === true;
  //     } else if (lowerCaseFilterValue === 'pass') {
  //       return cellValue === false;
  //     }
  //   }

  //   return String(cellValue).toLowerCase().includes(lowerCaseFilterValue);
  // };

  const tableTheme = useTableTheme()
  const table = useMaterialReactTable({
    columns: columns.map((column) => {
      let header
      switch (column.label) {
        case 'Speeder Validation Status':
          header = 'Speeder Status'
          break
        case 'Straight Liner Validation Status':
          header = 'SL Status'
          break
        case 'Open Text Validation Status':
          header = 'OE Status'
          break
        case 'Ip Validation Status':
          header = 'Ip Status'
          break
        case 'Conditions Check Status':
          header = 'Condition Status'
          break
        case 'Validations Check Status':
          header = 'Validations Status'
          break
        case 'Interview Start Timestamp':
          header = 'Start Time'
          break
        case 'Interview End Timestamp':
          header = 'End Time'
          break
        default:
          header = column.label
          break
      }

      return {
        accessorKey: column.id,
        header: header,
        size: 200,
        filterFn: 'includesStringSensitive',
        filterVariant:
          column.label == 'Straight Liner Validation Status' ||
          column.label == 'Speeder Validation Status' ||
          column.label == 'Conditions Check Status' ||
          column.label == 'Validations Check Status' ||
          column.label == 'Ip Validation Status' ||
          column.label == 'Open Text Validation Status'
            ? 'checkbox'
            : 'text',
        // @ts-ignore
        Cell: ({ cell, renderedCellValue }) => {
          // @ts-ignore
          // let value = cell.row.original[column.id]
          let value = renderedCellValue
          let cellContent

          if (value === undefined || value === null || value === '') {
            cellContent = <span>{EMPTY_SOURCE_MESSAGE}</span>
          } else if (typeof value === 'string' && column.id.includes('timestamp')) {
            const splitValue = value.split('.')
            if (splitValue.length > 0) {
              const datePart = splitValue[0]
              const timePart = datePart.split('T')[1]
              cellContent = datePart.split('T')[0] + ' ' + (timePart ? timePart : '')
            } else {
              cellContent = value
            }
          } else if (
            column.label == 'Straight Liner Validation Status' ||
            column.label == 'Speeder Validation Status' ||
            column.label == 'Conditions Check Status' ||
            column.label == 'Validations Check Status' ||
            column.label == 'Ip Validation Status' ||
            column.label == 'Open Text Validation Status'
          ) {
            const reason = getTooltipContent(cell.row.original, column.id)
            const displayValue = value == true ? 'FAIL' : 'PASS'
            // const displayValue = value == null ? "True" : "False";
            console.log(displayValue, value, 'displayValue')
            cellContent = reason ? (
              // cellContent = reason ? (
              <Tooltip title={reason}>
                <span
                  style={{
                    color: value == false ? 'green' : 'red',
                  }}
                >
                  {displayValue}
                </span>
              </Tooltip>
            ) : (
              <span
                style={{
                  color: value == false ? 'green' : 'red',
                }}
              >
                {' '}
                {displayValue}{' '}
              </span>
            )
          } else {
            cellContent = value
          }

          return cellContent
        },
      }
    }),
    // filterFns: {
    //   myCustomFilterFn: myCustomFilterFn,
    // },
    // globalFilterFn: 'myCustomFilterFn',
    enableRowSelection: true,
    enableColumnPinning: true,
    enableFilterMatchHighlighting: true,
    mrtTheme: () => ({
      matchHighlightColor: '#FFCB7F',
      // draggingBackgroundColor: '#DEF7E0',
      // pinnedRowdraggingBackgroundColor: '#DEF7E0'
    }),
    data: tableData && (tableData as any)?.length > 0 ? tableData && (tableData as any) : [],
    // initialState: { pagination: { pageSize: 25, pageIndex: 0 } },
    muiPaginationProps: {
      rowsPerPageOptions: [25, 50, 100],
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: { sx: { maxHeight: '600px' } },
    enableStickyHeader: true,
    columnFilterDisplayMode: 'popover',
    getRowId: (originalRow) => originalRow.supplier_token,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    initialState: {
      pagination: { pageSize: 25, pageIndex: 0 },
      // columnPinning: { left: ['mrt-row-actions', 'respondent_id'] },
    },
  })

  useEffect(() => {
    console.log(rowSelection, 'rowSelection')
  }, [rowSelection])

  const selectTypeModalClose = () => {
    setTypeSelectModal(false)
    setSelectedReconcileType({})
  }

  const GetQuotaReconcileData = async () => {
    setLoading(true)
    try {
      let data: any = await projectDataService.InitReconcilation(Number(projectId), Number(surveyId))
      setReconcileTableData(
        data.quota_logs.filter((val: any) => {
          delete val.created_at
          delete val.project_id
          delete val.id
          delete val.survey_id
          return val
        }),
      )
      setSummaryData(data.summary)
    } catch (error) {
      logger.error(error)
      enqueueSnackbar(<Typography variant="body1">Somthing went wrong !!.</Typography>, {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const PostSelectedRowReconcile = async () => {
    let obj = {
      type_id: selectedReconcileType,
      ids: Object.keys(rowSelection),
    }
    setLoading(true)
    if (projectId && surveyId)
      try {
        const data = await projectDataService.postSelectedReconcile(Number(projectId), Number(surveyId), obj)
        setReconcileTableData(
          data.quota_logs.filter((val: any) => {
            delete val.created_at
            delete val.project_id
            delete val.id
            delete val.survey_id
            return val
          }),
        )

        setSummaryData(data.summary)
        selectTypeModalClose()
        setReconcileModal(true)
      } catch (error) {
        logger.error(error)
        enqueueSnackbar(`${(error as any)?.error_message?.data?.message}`, {
          variant: 'error',
        })
      } finally {
        setLoading(false)
      }
  }

  const GetReconcileType = async () => {
    try {
      const data = await listService.getReconcileType()
      setTypeList(
        data.data.map((val: any) => {
          return {
            value: val.id,
            text: val.name,
          }
        }),
      )
    } catch (error) {
      logger.error(error)
    }
  }

  useEffect(() => {
    GetReconcileType()
  }, [])

  return (
    <>
      {loading ? <LoadingSpinner /> : null}
      {reconcileModal ? (
        <SummryReconcileDataComponent reconcileModalClose={reconcileModalClose} tableData={reconcileTableData} summaryData={summaryData} />
      ) : null}
      <Dialog open={typeSelectModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          Choose Reconcile Type
          <hr />
        </DialogTitle>
        <DialogContent>
          <Select
            sx={{ marginTop: '0.3rem' }}
            value={selectedReconcileType}
            items={typeList}
            onChange={(e) => {
              setSelectedReconcileType(e.target.value)
            }}
            label="Reconcile Type"
            name="Reconcile Type"
            isRequired={true}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={selectTypeModalClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              PostSelectedRowReconcile()
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        scroll="paper"
        onClose={CloseErrorModal}
        open={importErrorModal}
        // maxWidth="xxl"
        PaperProps={{
          style: {
            width: '30%',
            height: '20%',
            maxWidth: 'none',
          },
        }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
            height: '100%',
          }}
        >
          <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CloseOutlinedIcon onClick={CloseErrorModal} cursor="pointer" />
          </Box>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: 'red',
              paddingBottom: '2rem',
            }}
          >
            Missing required keys in the file
          </Box>
        </Box>
      </Dialog>
      <Dialog
        scroll="paper"
        onClose={closeDialog}
        open={showDialog}
        // maxWidth="xxl"
        PaperProps={{
          style: {
            width: '90%',
            height: '90%',
            maxWidth: 'none',
          },
        }}
      >
        <GridContainerProjectTable style={{ padding: '1rem 2rem 2rem 2rem' }}>
          <Typography variant="h6" style={{ paddingLeft: '1rem' }}>
            Imported Data
          </Typography>
          <Paper sx={{ overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 'calc(69.5vh)' }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {modalTableDatacolumnKeyscolumns.map((column) => {
                      let header

                      switch (column.label) {
                        case 'Speeder Validation Status':
                          header = 'Speeder Status'
                          break
                        case 'Straight Liner Validation Status':
                          header = 'SL Status'
                          break
                        case 'Open Text Validation Status':
                          header = 'OE Status'
                          break
                        case 'Ip Validation Status':
                          header = 'Ip Status'
                          break
                        case 'Interview Start Timestamp':
                          header = 'Start Time'
                          break
                        case 'Interview End Timestamp':
                          header = 'End Time'
                          break
                        default:
                          header = column.label
                          break
                      }

                      return (
                        <TableCell key={column.id} align={'left'} style={{ minWidth: `${column.minWidth}` }}>
                          {column.label.length > 35 ? (
                            <Tooltip title={column.label}>
                              <span>{`${column.label.substring(0, 35)}...`}</span>
                            </Tooltip>
                          ) : (
                            header
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modalTableData && (modalTableData as any)?.length > 0 ? (
                    modalTableData &&
                    (modalTableData as any)
                      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(
                        (row: {
                          [x: string]: any
                          response_id: any
                          respondent_id?: number | undefined
                          respondent_status?: string | undefined
                          interview_start_timestamp?: number | undefined
                          interview_end_timestamp?: number | undefined
                          straight_liner_validation_status?: number | undefined
                          straight_liner_validation_status_reason?: string | null | undefined
                          straight_liner_validation_original_status?: number | undefined
                          speeder_validation_status?: number | undefined
                          speeder_validation_status_reason?: string | null | undefined
                          speeder_validation_original_status?: number | undefined
                          conditions_check_status?: number | undefined
                          conditions_check_status_reason?: string | null | undefined
                          conditions_check_original_status?: number | undefined
                          validations_check_status?: number | undefined
                          validations_check_status_reason?: string | null | undefined
                          validations_check_original_status?: number | undefined
                          straight_liner_validation_status_timestamp?: number | undefined
                          speeder_validation_status_timestamp?: number | undefined
                          conditions_check_status_timestamp?: number | undefined
                          validations_check_status_timestamp?: number | undefined
                        }) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.response_id}>
                              {modalTableDatacolumnKeyscolumns &&
                                modalTableDatacolumnKeyscolumns?.map((column) => {
                                  // @ts-ignore
                                  let value = row[column?.id]
                                  // let originalValue = tableDataMap && tableDataMap[(row as any)?.respondent_id][column?.id]

                                  let originalValue = null

                                  if (tableDataMap && row.respondent_id !== undefined) {
                                    originalValue = tableDataMap[row.respondent_id]?.[column?.id]
                                  }

                                  console.log(originalValue, value, 'originalValue')

                                  let cellContent

                                  if (value === undefined || value === null || value === '') {
                                    cellContent = <span>{EMPTY_SOURCE_MESSAGE}</span>
                                  } else if (column.id.includes('timestamp')) {
                                    cellContent = value?.split('.')[0].split('T')[0] + ' ' + value?.split('.')[0].split('T')[1]
                                    // cellContent = formatIsoDateTime(value);
                                  } else if (
                                    column.label == 'Straight Liner Validation Status' ||
                                    column.label == 'Speeder Validation Status' ||
                                    column.label == 'Conditions Check Status' ||
                                    column.label == 'Validations Check Status' ||
                                    column.label == 'Ip Validation Status' ||
                                    column.label == 'Open Text Validation Status'
                                  ) {
                                    const reason = getTooltipContent(row, column.id)
                                    const displayValue = value == true ? 'FAIL' : 'PASS'
                                    // const displayValue = value == null ? "True" : "False";
                                    console.log(displayValue, value, 'displayValue')
                                    cellContent = reason ? (
                                      <Tooltip title={reason}>
                                        <span
                                          style={{
                                            color: value == false ? 'green' : 'red',
                                          }}
                                        >
                                          {/* <span style={{ color: value == false ? 'green' : 'red' }}> */}
                                          {displayValue}
                                        </span>
                                      </Tooltip>
                                    ) : (
                                      <span
                                        style={{
                                          color: value == false ? 'green' : 'red',
                                        }}
                                      >
                                        {' '}
                                        {displayValue}{' '}
                                      </span>
                                    )
                                  } else {
                                    cellContent = value
                                  }

                                  if (value != null && originalValue != undefined && value !== originalValue) {
                                    cellContent = (
                                      <>
                                        {cellContent}
                                        <span style={{ color: 'blue' }}> !!!</span>{' '}
                                      </>
                                    ) // Change color to indicate modified value
                                  }

                                  return (
                                    <TableCell key={column.id} align={'left'}>
                                      {cellContent}
                                    </TableCell>
                                  )
                                })}
                            </TableRow>
                          )
                        },
                      )
                  ) : (
                    <TableRow>
                      <TableCell>
                        <Typography align="center">No data</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              style={{
                display: (modalTableData as any)?.length > 0 ? 'block' : 'none',
              }}
              rowsPerPageOptions={[25, 50, 100]}
              component="div"
              count={(modalTableData as any)?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '1.5rem 1rem 0rem 1rem',
              gap: '1rem',
            }}
          >
            <Button
              variant="text"
              onClick={() => {
                setShowDialog(false)
                setModalTableData(null)
              }}
            >
              {' '}
              cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              {' '}
              Submit
            </Button>
          </Box>
        </GridContainerProjectTable>
      </Dialog>
      <Box
        sx={{
          flex: '1',
          // overflow: "scroll"
        }}
        style={{
          // background: "white",
          borderRadius: '12px',
          // height: "calc(100vh - 228px)",
        }}
      >
        <Box
          style={{
            width: '100%',
            position: 'sticky',
            top: '0px',
            // background: "white",
            zIndex: 500,
            padding: '1rem 2rem 0rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" position="sticky">
            Summary
          </Typography>
        </Box>
        <Box sx={{ padding: '0rem 1rem 1rem 1rem' }}>
          {(summaryCardsData as any)?.summary_card?.length > 0 ? (
            <GridContainerProject style={{ marginBottom: '1rem', gap: '0rem' }}>
              {// @ts-ignore
              summaryCardsData?.summary_card?.map((item: any, index: React.Key | null | undefined) => <SummaryCard key={index} data={item} />)}
            </GridContainerProject>
          ) : (
            <Box style={{ paddingTop: '1rem', width: '100%', height: '3rem' }}>
              <Typography align="center">No data</Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Box
        style={{
          padding: '1rem 2rem 0.5rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" style={{ paddingLeft: '1rem' }}>
          Review Table
        </Typography>
        <Box style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
          {tableData && (tableData as any)?.length > 0 && (
            <>
              <Button variant="contained" color="primary" onClick={triggerFileInput} style={{ marginTop: '0.6rem' }}>
                Import Reviewed File
                <ExitToAppIcon style={{ marginLeft: '0.5rem' }} />
              </Button>

              <Button variant="contained" color="primary" onClick={handleExport} style={{ marginTop: '0.6rem' }}>
                Export For Review
                <ExitToAppIcon style={{ marginLeft: '0.5rem' }} />
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  // PostReConciles
                  setReconcileTableData([])
                  setSummaryData(null)
                  GetQuotaReconcileData()
                  setReconcileModal(true)
                }}
                style={{ marginTop: '0.6rem' }}
              >
                Reconcile All
                <RepartitionIcon style={{ marginLeft: '0.5rem' }} />
              </Button>
              <Button
                disabled={JSON.stringify(rowSelection) === '{}' ? true : false}
                variant="contained"
                color="primary"
                onClick={() => {
                  // PostReConciles
                  setTypeSelectModal(true)
                }}
                style={{ marginTop: '0.6rem' }}
              >
                Choose Reconcile Type
              </Button>
              <Box style={{ width: 'calc(15vw)' }}>
                <MultipleSelectCheckmarks
                  label="Checks"
                  width="100%"
                  items={checkList}
                  handleChange={handleChange}
                  // @ts-ignore
                  selectedOptions={selectedIds}
                  style={{ marginTop: '10px' }}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
      <GridContainerProjectTable>
        <ThemeProvider theme={tableTheme}>
          <MaterialReactTable table={table} />
        </ThemeProvider>
      </GridContainerProjectTable>
    </>
  )
}

export default SummaryContainer
