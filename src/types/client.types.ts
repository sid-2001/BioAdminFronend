interface ClientType {
  id: number;
  account_id: number;
  name: string;
  project_counts: number;
  email: string;
  contact: string;
  website_url: string;
  description: string;
  profile_image_url: string;
  is_active: boolean;
  created_by: number;
  updated_by: number;
}

interface ClientPostDataType {
  name?: string
  email?: string
  website_url?: string
  description?: string
  profile_image_url?: string
  contact?: string | number
  sp_system_ids?: number[]
  is_active?: boolean
}

interface ClientPostDataResponseType {
  client: ClientType;
  status: string;
}

export type { ClientType, ClientPostDataType, ClientPostDataResponseType };
