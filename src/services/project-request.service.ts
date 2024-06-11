import { ProjectRequest } from "@/types/project-request.type";
import { BaseService } from "./base.service";
import api1 from "./apis/api1";

export interface PostProjectRequestByIdRequestType {
  title: string;
  description: string;
  effort: number;
  files: Array<any>;
  eta: any;
}

export interface PatchProjectRequestByIdRequestType {
  comment: string;
  status_id: number;
}

export interface RequestState {
  id: number;
  name: string;
}

class ProjectRequestService extends BaseService {
  Projects = "projects";
  Threads = "threads";
  Surveys = "surveys";


  async getProjectRequestById(
    projectId: number
  ): Promise<Array<ProjectRequest>> {
    try {
      const { data } = await api1.get(
        `${this.Projects}/${projectId}/project-requests`
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  // new
  async getProjectRetriveById(
    projectId: number,
    surveyId: number,
  ): Promise<Array<any>> {
    try {
      const { data } = await api1.get(
        `${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/efforts`
      );

      return data;
    } catch (error) {
      throw error;
    }
  }


  // new
  // async postProjectRetriveById(
  //   projectId: number,
  //   {
  //     description,
  //     effort,
  //     eta,
  //     cost,
  //     title,
  //   }: any
  // ): Promise<ProjectRequest> {
  //   const formData = new FormData();

  //   // if (Array.isArray(files)) {
  //   //   files?.forEach((value: any) => {
  //   //     formData.append("files", value);
  //   //   });
  //   // }
  //   // formData.append("file", files as unknown as string);
  //   formData.append("description", description);
  //   formData.append("effort", effort as unknown as string);
  //   formData.append("title", title);
  //   // formData.append("status_id", 0 as unknown as string);
  //   // formData.append("priority_id", 0 as unknown as string);
  //   formData.append("cost",cost as unknown as string)
  //   formData.append("eta", eta as unknown as string);

  //   try {
  //     const { data } = await api1.post(
  //       `${this.Projects}/${projectId}/efforts`,
  //       formData
  //     );

  //     return data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async postProjectRequestById(
    projectId: number,
    {
      description,
      effort,
      eta,
      files,
      title,
    }: PostProjectRequestByIdRequestType
  ): Promise<ProjectRequest> {
    const formData = new FormData();

    if (Array.isArray(files)) {
      files?.forEach((value: any) => {
        formData.append("files", value);
      });
    }
    // formData.append("file", files as unknown as string);
    formData.append("description", description);
    formData.append("effort", effort as unknown as string);
    formData.append("title", title);
    formData.append("status_id", 0 as unknown as string);
    formData.append("priority_id", 0 as unknown as string);
    formData.append("eta", eta as unknown as string);

    try {
      const { data } = await api1.post(
        `${this.Projects}/${projectId}/project-requests`,
        formData
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  async patchProjectRequestById(
    projectId: number,
    projectRequestId: number,
    { status_id, comment }: PatchProjectRequestByIdRequestType
  ): Promise<ProjectRequest> {
    console.log(status);

    try {
      const { data } = await api1.patch(
        `${this.Projects}/${projectId}/project-requests/${projectRequestId}`,
        { status_id, comment }
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getProjectRequestStatuses(): Promise<Array<RequestState>> {
    try {
      const { data } = await api1.get(`lists/project-request-status`);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getProjectRequestStates() {
    try {
      const { data } = await api1.get(`lists/request_state_list`);

      return data;
    } catch (error) {
      throw error;
    }
  }
}

export { ProjectRequestService };
