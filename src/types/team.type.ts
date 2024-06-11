
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
  contact_number: string;
  designation_id?: string;
  role?: string;
  role_id: number | null;
  role_name?: string;
  designation_name?: string;
  user_status_id?: number;
  user_status_name?: string;
}

interface Permission {
  permission_id: number;
  is_active: boolean;
  role_permission_id?: number;
}

interface Role {
  role_id: number;
  permissions: Permission[];
}

interface RolePermissionPostData {
  object_id: number;
  roles: Role[];
}

interface ObjectType {
  id: number;
  name: string;
}

interface RoleType {
  id: number;
  name: string;
}

interface PermissionType {
  id: number;
  name: string;
}

interface PatchObjectType {
  is_active: boolean;
}

export type {
  User,
  Permission,
  Role,
  RolePermissionPostData,
  ObjectType,
  RoleType,
  PermissionType,
  PatchObjectType,
};
