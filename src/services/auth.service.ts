import {
  ForgetPasswordProps,
  LoginParams,
  ResetForgetPassword,
  UserAuth,
  UserInvite,
} from "@/types/auth.type";
import { BaseService } from "./base.service";
import api1 from "./apis/api1";

class UserService extends BaseService {
  Login = "login";
  async login(obj: LoginParams): Promise<UserAuth> {
    const { email, password } = obj;
    try {
      const { data } = await api1.post(`/auth/${this.Login}`, {
        email: email,
        password: password,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  ForgetPassword = `/auth/user/forget-password`;
  async forget_password(params: ForgetPasswordProps): Promise<void> {
    try {
      await api1.post(this.ForgetPassword, { email: params.user_email });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  ForgetResetPassword = `/auth/user/reset-forget-password`;
  async forget_password_reset_password(
    obj: ResetForgetPassword
  ): Promise<void> {
    try {
      const data = await api1.patch(this.ForgetResetPassword, obj);
      return data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  UserVerify = `auth/verify`
async user_token_verification(token: string): Promise<any> {
  try {
    const data = await api1.post(`${this.UserVerify}?token=${token}`, {})
    return data
  } catch (error) {
    this.logger.error(error)
    throw error
  }
}

  UserInvite = `/auth/set-password`
  async user_invite(obj: UserInvite): Promise<void> {
    try {
      const data = await api1.post(this.UserInvite, obj)
      return data
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}

export { UserService };
