import { PatchObjectType } from "@/types/team.type";

interface TeamManagementCardProps {
  user?: User;
  UpdateActivity: (userIdPut: number, data: any) => Promise<void>;
  ActivateDeactivateUser: (user_id: number, object: PatchObjectType) => Promise<void>
}

interface User {
  is_active?: boolean;
  // user?: any;
  id: number;
  user_id?: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  account_id?: number;
  created_by?: number;
  updated_by?: number;
  contact_number?: string;
  designation_id?: string;
  role?: string;
  role_name?: string;
  designation_name?: string;
  user_status_id?: number;
  user_status_name?: string;
}

export type { TeamManagementCardProps };
