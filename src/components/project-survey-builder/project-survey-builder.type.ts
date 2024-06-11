import { ProjectThreadsContainerPropTypes } from "@/higher-order-components/project-thread/project-thread.hoc";

interface ProjectSurveyBuilderComponentProps
  extends ProjectThreadsContainerPropTypes {
  setFullViewMode: React.Dispatch<React.SetStateAction<boolean>>;
  fullViewMode: boolean;
  project: any;
  projectStatusIdChange: (status: number) => Promise<void>;
  get_project_byid: any;
  setChangeModal: React.Dispatch<React.SetStateAction<number | null>>;
}

interface QuestionListTypes {
  id: number;
  name: string;
}

interface SortingListTypes {
  value: number;
  text: string;
}

export type {
  ProjectSurveyBuilderComponentProps,
  QuestionListTypes,
  SortingListTypes,
};
