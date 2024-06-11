interface Project {
  project_id?: number
  client_id: number
  market_id: number[]
  client_name?: string
  type_id?: number
  account_id?: number
  thread_counts?: number
  estimates_hrs?: number
  project_name: string
  project_code: string
  status_id: number
  status_name?: string
  start_date?: string
  end_date?: string
  project_description: string
  // opportunity_cost: number;
  bb_live_link: string
  bb_test_link: string
  sp_live_link: string
  sp_test_link: string
  programming_software?: number | null
  schema_url: string
  definition_file_url: string
  data_file_url: string
  xml_schema_url: string
  sp_xml_url: string
  layout_id: number
  is_active?: boolean
  created_by?: number
  updated_by?: number
  createdAt?: string
  updatedAt?: string
  questions_count?: number
}

interface ProjectThreadUserType {
  id: number;
  name: string;
  avatar: string;
}
interface ProjectFiles {
  id: number;
  project_id: number;
  filetype_id: number;
  file_name: string;
  file_url: string;
  is_active: boolean;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
}

interface ProjectThreadThreadMessageType {
  message: string;
  user: ProjectThreadUserType;
  attachments: { file_name: null | string; file_path: string }[];
  created_at: string;
}

interface ProjectThreadType {
  id: number;
  project_id: number;
  questions: Array<ProjectQuestionType>;
  project_name: string;
  thread_type_id: number;
  thread_status_id: number;
  latest_messages: Array<ProjectThreadThreadMessageType>;
  thread_title: string;
  created_at: string;
  is_estimated?: boolean;
  is_attachment?: boolean;
}

interface ProjectQuestionType {
  question_id: number | string;
  question_name: string;
  question_title?: string;
}

enum ThreadStatus {
  OPEN = 1,
  CLOSED = 2,
}
interface ActivityLogs {
  id: number;
  log_name: string;
  description: string;
  object_id: number;
  user_name: string;
  object_type_id: number;
  properties: object;
  is_active: boolean;
  created_by: number;
  created_at: Date;
}

interface ProjectFileType {
  type: string;
  name: string;
  path: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface ProjectTeamMember {
  user_id: number;
  role_id: number;
}

interface ProjectTeamMemberMail {
  email: string;
  role_id: number;
}

interface ProjectTeamMemberResponse {
  id: number;
  role_id: number;
  role_name: string;
  profile_image_url: string;
  user_id: number;
  user_email: string;
  user_status: string;
  user_name: string;
  project_id?: number;
  created_by?: number;
  updated_by?: number;
}

interface ProjectTeamSearchResponse {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  account_id: number;
  profile_image_url: string;
  is_active: string;
  is_new: boolean;
  created_by?: number;
  updated_by?: number;
  contact_number: number;
  role: number;
  role_id: number;
  role_name: string;
  designation_id: number;
  id: number;
}

export type {
  Project,
  ProjectFiles,
  ProjectThreadType,
  ActivityLogs,
  ProjectThreadThreadMessageType,
  ProjectThreadUserType,
  ThreadStatus,
  ProjectFileType,
  ProjectTeamMember,
  ProjectTeamMemberMail,
  ProjectTeamMemberResponse,
  ProjectTeamSearchResponse,
  ProjectQuestionType,
};
