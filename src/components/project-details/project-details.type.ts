import { Project } from "@/types/project.type";

interface ProjectDetailsProps {
  project: Project;

  // project_files:ProjectFiles
  get_project_byid: any;
  isLoading: boolean;
}

export type { ProjectDetailsProps };
