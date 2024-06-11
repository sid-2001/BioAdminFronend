import { User } from "@/types/team.type";

interface CreateUserProps {
  open: boolean;
  handleClose: () => void;
  getUsers: () => Promise<void>;
  users: User[]; 
}

interface IFormUser {
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  role_id: number | null;
}

export type { CreateUserProps, IFormUser };
