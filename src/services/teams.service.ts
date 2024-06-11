// import api from "@/api/api";
import { PatchObjectType, User } from "@/types/team.type";
import { BaseService } from "./base.service";
import api1 from "./apis/api1";

class TeamsService extends BaseService {
  private user_endpoint: string = "users";
  async get_team_members(): Promise<User[]> {
    try {
      const { data } = await api1.get(`/${this.user_endpoint}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async create_user(object: object): Promise<User[]> {
    try {
      const { data } = await api1.post(`/${this.user_endpoint}`, object);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async update_user(user_id: number, object: object): Promise<User> {
    try {
      const { data } = await api1.put(
        `/${this.user_endpoint}/${user_id}`,
        object
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async activate_deactivate_user(user_id: number, object: PatchObjectType): Promise<any> {
    try {
      const data= await api1.patch(`${this.user_endpoint}/${user_id}`, object);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async get_user_by_id(id: string): Promise<User> {
    try {
      const { data } = await api1.get(`${this.user_endpoint}/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  // async post_team_member(obj: {
  //   first_name: string;
  //   last_name: string;
  //   email: string;
  //   contact_number: string;
  //   designation_id: number;
  //   role: number;
  //   profile_image_url: string;
  // }): Promise<User> {
  //   try {
  //     const { data } = await api.post(`${Team}`, obj);
  //     return data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async put_team_member(
  //   user_id: string,
  //   obj: {
  //     first_name: string;
  //     last_name: string;
  //     profile_image_url: string;
  //   }
  // ): Promise<User> {
  //   try {
  //     const { data } = await api.put(`${GetUsers}/${user_id}`, obj);
  //     return data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async activate_deactivate_team_member(id: string, obj: any): Promise<void> {
  //   try {
  //     const { data } = await api.patch(`${GetUsers}/${id}`, obj);
  //     return data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async get_team_members_projects_by_team_member_id(
  //   team_member_id: string
  // ): Promise<Project[]> {
  //   try {
  //     const { data } = await api.get(
  //       `${Projects}?team_member_id=${team_member_id}`
  //     );
  //     return data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // // roles service
  // async post_role_permission(data: RolePermissionPostData[]): Promise<any> {
  //   try {
  //     const response = await api.post(Permissions, data);
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async get_role_permission(): Promise<RolePermissionPostData[]> {
  //   try {
  //     const response = await api.get(Permissions);
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async put_role_permission(obj: RolePermissionPostData[]): Promise<any> {
  //   try {
  //     const { data } = await api.put(Permissions, obj);
  //     return data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

export { TeamsService };
