export interface UserAuth {
  token: string;
  id: number;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface ForgetPasswordProps {
  user_email: string;
}

export interface ResetForgetPassword {
  new_password: string;
  confirm_password: string;
  forget_reset_password_token: string;
}

export interface UserInvite {
  password: string
  // project_id: number
  // created_by: number
  // updated_by: number
  // first_name: string
  // last_name: string
  // contact_number: string
  reset_password_token: string
}