import useTableTheme from '@/constants/TableTheme'
import { Box, Button, Grid, Stack, ThemeProvider, Tooltip, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { ReconcileQuotaData, SummryReconcileDataComponentProps } from './summry-reconcile-data.type'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProjectDataService } from '@/services/project-data.services'
import { enqueueSnackbar } from 'notistack'
import { logger } from '@/helpers/logger'
import LoadingSpinner from '../loader'
import { FileDownload } from '@mui/icons-material'
import { download, generateCsv, mkConfig } from 'export-to-csv'
// import { StyledCard } from '../summary-card/summary-card.style'

const SummryReconcileDataComponent = ({ reconcileModalClose, tableData, summaryData }: SummryReconcileDataComponentProps) => {
  const tableTheme = useTableTheme()
  const [loading, setLoading] = useState(false)

  const { projectId, surveyId } = useParams()
  const projectDataService = new ProjectDataService()

  let columns = [
    {
      accessorKey: 'quota_id',
      header: 'Quota Id',
      size: 50,
    },

    {
      accessorKey: 'quota_name',
      header: 'Quota Name',
      size: 50,
      enableSorting: false,
      headerAlign: 'center',
    },

    {
      accessorKey: 'reconcile_status_type',
      header: 'Reconcile Status Type',
      size: 50,
      headerAlign: 'center',
    },

    {
      accessorKey: 'sample_size',
      header: 'Sample Size',
      size: 50,
      headerAlign: 'center',
    },
    {
      accessorKey: 'new_sample_size',
      header: 'New Sample Size',
      size: 50,
      headerAlign: 'center',
    },
    {
      accessorKey: 'new_quota_sample_size_diff',
      header: 'Sample Size Diff',
      size: 150,
      headerAlign: 'center',
    },
  ]

  const ReconcilationConfirm = async () => {
    setLoading(true)
    try {
      let data: any = await projectDataService.ConfirmReconciles(Number(projectId), Number(surveyId), tableData.length > 0 ? tableData[0].run_id : '')
      enqueueSnackbar(<Typography variant="body1">{data && data?.message ? data?.message : 'Reconcile confirm successfully.'}</Typography>, {
        variant: 'success',
      })
      reconcileModalClose()
    } catch (error) {
      logger.error(error)
      enqueueSnackbar(`${(error as any)?.error_message?.data?.message}`, {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  })

  const handleExportData = () => {
    //@ts-ignore
    let rowsData: any = JSON.parse(
      JSON.stringify(
        tableData.filter((val: any) => {
          delete val.run_id
          return JSON.parse(JSON.stringify(val))
        }),
      ),
    )
    const csv = generateCsv(csvConfig)(rowsData)
    download(csvConfig)(csv)
  }

  const table = useMaterialReactTable({
    columns,
    data: tableData && (tableData as ReconcileQuotaData[])?.length > 0 ? tableData && (tableData as ReconcileQuotaData[]) : [],
    enableColumnPinning: true,
    enableColumnFilterModes: true,
    enableGlobalFilter: true,
    muiPaginationProps: {
      rowsPerPageOptions: [25, 50, 100],
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: { sx: { maxHeight: 'calc(100vh - 300px)' } },
    enableStickyHeader: true,
    initialState: {
      pagination: { pageSize: 25, pageIndex: 0 },
    },
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Tooltip title="Export data">
          <Button startIcon={<FileDownload />} size="small" onClick={handleExportData}>
            CSV Download
          </Button>
        </Tooltip>
      </Box>
    ),
  })

  return (
    <Dialog maxWidth="xl" fullWidth open={true} onClose={reconcileModalClose}>
      {loading ? <LoadingSpinner /> : ''}
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <span> {'Reconciliation  Confirmation'}</span>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button onClick={reconcileModalClose}>Discard</Button>
            <Button variant="contained" onClick={ReconcilationConfirm} disabled={tableData.length === 0}>
              Confirm
            </Button>
          </Stack>
        </Stack>
        <hr style={{ marginTop: '0.5rem' }} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* <StyledCard sx={{ border: '1px solid #f5f5f5', marginTop: '0.4rem' }}> */}
              <Typography sx={{ fontSize: '18px', fontWeight: 700 }} mb={1}>
                Summary
              </Typography>
              <Stack direction="row" spacing={5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ fontWeight: 700 }}>Reconciliation Id :</Typography>
                  <Typography>{summaryData?.run_id ? summaryData?.run_id : 0}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ fontWeight: 700 }}>Total Sample :</Typography>
                  <Typography>{summaryData?.total_sample_size ? summaryData?.total_sample_size : 0}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ fontWeight: 700 }}>Total Reconcile To Complete :</Typography>
                  <Typography>{summaryData?.total_reconcile_to_complete ? summaryData?.total_reconcile_to_complete : 0}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ fontWeight: 700 }}>Total Reconcile To Terminate :</Typography>
                  <Typography>{summaryData?.total_reconcile_to_terminate ? summaryData?.total_reconcile_to_terminate : 0}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ fontWeight: 700 }}>Reconciled Sample Size :</Typography>
                  <Typography>{summaryData?.reconciled_sample_size ? summaryData?.reconciled_sample_size : 0}</Typography>
                </Stack>
              </Stack>
              {/* </StyledCard> */}
            </Grid>
            <Grid item xs={12}>
              <ThemeProvider theme={tableTheme}>
                <MaterialReactTable table={table} />
              </ThemeProvider>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default SummryReconcileDataComponent
