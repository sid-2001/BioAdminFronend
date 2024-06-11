import { useState } from "react";
import { Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";

import { ProjectThreadService } from "@/services/project-threads.service";
import { ProjectThreadType } from "@/types/project.type";
import { useOutletContext } from "react-router-dom";

function useProjectThread() {
  const threadService = new ProjectThreadService();
  const { selectedSurvey }: any = useOutletContext()

  const [projectThreads, setProjectThreads] = useState<
    Array<ProjectThreadType>
  >([]);

  function setFetchedProjectThreads(threads: Array<ProjectThreadType>) {
    setProjectThreads(threads);
  }

  async function updateAllProjectThreads(projectId: number) {
    try {
      const threads = await threadService.getProjectThreadsById(projectId, Number(selectedSurvey));

      setFetchedProjectThreads(threads);
    } catch (error) {
      enqueueSnackbar(
        <Typography variant="body1">Fetching threads failed</Typography>,
        {
          variant: "error",
        }
      );
    }
  }

  return {
    projectThreads,
    setProjectThreads,
    updateAllProjectThreads,
  };
}

export default useProjectThread;
