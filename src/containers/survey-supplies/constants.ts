interface Data {
  id: number
  survey_id: number
  supplier_id: number
  supplier_cpi: number
  respondent_honorarium: number
  allocation: number
  supplier_entry_url: string | null
  completed_redirect_url: string | null
  security_redirect_url: string | null
  terminate_redirect_url: string | null
  over_quota_redirect_url: string | null
  s2s_completed_url: string | null
  s2s_security_url: string | null
  s2s_terminate_url: string | null
  s2s_over_quota_url: string | null
  is_it_redirected: boolean
  is_it_s2s: boolean
  is_active: boolean
  created_at: string
  created_by: string | null
  updated_at: string
  updated_by: string | null
}

export const DUMMY_DATA: Array<Data> = [
  {
    id: 1,
    survey_id: 1,
    supplier_id: 1,
    supplier_cpi: 1,
    respondent_honorarium: 1,
    allocation: 1,
    supplier_entry_url: "www.dummy-url.com",
    completed_redirect_url: "www.dummy-url.com",
    security_redirect_url: "www.dummy-url.com",
    terminate_redirect_url: "www.dummy-url.com",
    over_quota_redirect_url: "www.dummy-url.com",
    s2s_completed_url: "www.dummy-url.com",
    s2s_security_url: "www.dummy-url.com",
    s2s_terminate_url: "www.dummy-url.com",
    s2s_over_quota_url: "www.dummy-url.com",
    is_it_redirected: false,
    is_it_s2s: false,
    is_active: false,
    created_at: "",
    created_by: null,
    updated_at: "",
    updated_by: null,
  },
  {
    id: 2,
    survey_id: 1,
    supplier_id: 1,
    supplier_cpi: 1,
    respondent_honorarium: 1,
    allocation: 1,
    supplier_entry_url: "www.dummy-url.com",
    completed_redirect_url: "www.dummy-url.com",
    security_redirect_url: "www.dummy-url.com",
    terminate_redirect_url: "www.dummy-url.com",
    over_quota_redirect_url: "www.dummy-url.com",
    s2s_completed_url: "www.dummy-url.com",
    s2s_security_url: "www.dummy-url.com",
    s2s_terminate_url: "www.dummy-url.com",
    s2s_over_quota_url: "www.dummy-url.com",
    is_it_redirected: false,
    is_it_s2s: false,
    is_active: false,
    created_at: "",
    created_by: null,
    updated_at: "",
    updated_by: null,
  },
  {
    id: 3,
    survey_id: 1,
    supplier_id: 1,
    supplier_cpi: 1,
    respondent_honorarium: 1,
    allocation: 1,
    supplier_entry_url: "www.dummy-url.com",
    completed_redirect_url: "www.dummy-url.com",
    security_redirect_url: "www.dummy-url.com",
    terminate_redirect_url: "www.dummy-url.com",
    over_quota_redirect_url: "www.dummy-url.com",
    s2s_completed_url: "www.dummy-url.com",
    s2s_security_url: "www.dummy-url.com",
    s2s_terminate_url: "www.dummy-url.com",
    s2s_over_quota_url: "www.dummy-url.com",
    is_it_redirected: false,
    is_it_s2s: false,
    is_active: false,
    created_at: "",
    created_by: null,
    updated_at: "",
    updated_by: null,
  },
]

interface HeadCell {
  disablePadding: boolean
  id: string
  label: string
  numeric: boolean
}

export const headCells: readonly HeadCell[] = [
  {
    id: "supplier_name",
    numeric: false,
    disablePadding: true,
    label: "Supplier",
  },
  {
    id: "allocation",
    numeric: true,
    disablePadding: false,
    label: "Allocation",
  },
  {
    id: "supplier_cpi",
    numeric: true,
    disablePadding: false,
    label: "Cpi",
  },
  {
    id: "respondent_honorarium",
    numeric: true,
    disablePadding: false,
    label: "Honorium",
  },
  {
    id: "starts",
    numeric: true,
    disablePadding: false,
    label: "Starts",
  },
  {
    id: "over_quota",
    numeric: true,
    disablePadding: false,
    label: "Over Quota",
  },
  {
    id: "terminate",
    numeric: true,
    disablePadding: false,
    label: "Terminates",
  },
  {
    id: "completes",
    numeric: true,
    disablePadding: false,
    label: "Completes",
  },

  {
    id: "remaining",
    numeric: true,
    disablePadding: false,
    label: "Remaining",
  },
  {
    id: "conversion",
    numeric: true,
    disablePadding: false,
    label: "Conversion",
  },

  {
    id: "last_complete",
    numeric: true,
    disablePadding: false,
    label: "Last Complete",
  },
  {
    id: "action",
    numeric: true,
    disablePadding: false,
    label: "Action",
  },
]

export type { Data, HeadCell }
