interface CreateProjectProps {
  open: boolean;
  handleClose: () => void;
  getProjects: () => Promise<void>;
}

interface IFormProject {
  client_id: number | null
  project_name: string
  project_code: string
  market_id: number[]
  status_id: number | null
  start_date: string
  end_date: string
  project_description: string
  // opportunity_cost: number;
  bb_live_link: string
  bb_test_link: string
  sp_live_link: string
  sp_test_link: string
  programming_software: number | null
  sp_document_url: string
  schema_url?: string
  sp_xml_url?: string
  data_file_url?: string
  definition_file_url?: string
  xml_schema_url?: string
  theme?: string
}

export type { CreateProjectProps, IFormProject };
