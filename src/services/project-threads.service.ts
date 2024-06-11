import { ProjectThreadType } from "@/types/project.type";
import { BaseService } from "./base.service";
import api1 from "./apis/api1";
import {
  PatchThreadPropType,
  PostThreadType,
} from "@/higher-order-components/project-thread/project-thread.hoc";

class ProjectThreadService extends BaseService {
  Projects = "projects";
  Threads = "threads";
  Surveys = 'surveys'

  async getProjectThreadsById(
    projectId: number, surveyId: number,
  ): Promise<Array<ProjectThreadType>> {
    try {
      const { data } = await api1.get(
        `${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/${this.Threads}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postProjectThreadsById(
    projectId: number,
    surveyId: number,
    thread_title: string
  ): Promise<ProjectThreadType> {
    console.log(thread_title);

    try {
      const { data } = await api1.post(
        `${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/${this.Threads}`,
        { thread_title: thread_title }
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  async postThread(
    projectId: number,
    surveyId: number,
    threadId: number,
    obj: PostThreadType
  ): Promise<ProjectThreadType> {
    console.log(obj);

    const formData = new FormData();

    if (Array.isArray(obj.files)) {
      obj.files?.forEach((value: any) => {
        formData.append("files", value);
      });
    }
    formData.append("message", obj.message);
    // form.append("files", obj.files);

    try {
      const { data } = await api1.post(
        `${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/${this.Threads}/${threadId}`,
        formData
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getProjectThreadById(
    projectId: number,
    surveyId: number,
    threadId: number
  ): Promise<ProjectThreadType> {
    try {
      const { data } = await api1.get(
        `${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/${this.Threads}/${threadId}`
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  async patchThreadStatus(
    projectId: number,
    surveyId: number,
    threadId: number,
    obj: PatchThreadPropType
  ): Promise<ProjectThreadType> {
    try {
      const { data } = await api1.patch(
        `${this.Projects}/${projectId}/${this.Surveys}/${surveyId}/${this.Threads}/${threadId}`,
        obj
      );

      return data;
    } catch (error) {
      throw error;
    }
  }
}

export { ProjectThreadService };
