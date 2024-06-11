interface SummryReconcileDataComponentProps {
  reconcileModalClose: () => void
  tableData: ReconcileQuotaData[]
  summaryData: any
}

interface ReconcileQuotaData {
  id: number
  run_id: string
  project_id: number
  survey_id: number
  quota_id: number
  reconcile_status_type: string
  sample_size: number
  new_quota_sample_size_diff: string | number
  new_sample_size: string | number
  created_at: string
}

export type { SummryReconcileDataComponentProps, ReconcileQuotaData }
