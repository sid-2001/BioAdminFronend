interface ProjectRequest {
  id: number;
  project_id: number;
  thread_title: string;
  title: string;
  description: string;
  effort: string;
  eta: string;
  cost: number;
  status_id: number;
  priority_id: number;
  user_id: number;
  agent_id: number;
  is_active: boolean;
  created_by: number;
  updated_by: number;
}

export const ProjectRequestStateMapping = {
  1: "OPEN",
  2: "REJECTED",
  3: "APPROVED",
};

export type { ProjectRequest };
