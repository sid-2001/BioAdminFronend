import { ProjectThreadService } from "@/services/project-threads.service";
import { ProjectThreadType } from "@/types/project.type";

import { useOutletContext, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

export interface ProjectThreadsContainerPropTypes {
  projectThreads: Array<ProjectThreadType>;
  selectedThread: ProjectThreadType | null;
  setSelectedThread: React.Dispatch<
    React.SetStateAction<ProjectThreadType | null>
  >;
  postProjectThread: (message: string, setNewThread?: boolean) => void;
  postThread: (id: number, obj: PostThreadType) => void;
  patchThread: (threadId: number, obj: PatchThreadPropType) => void;
  threadCardClickHandler: (id: number) => void;
  getAllProjectThreads(): Promise<void>;
  getProjectThread: (id: number | string) => void;
  isThreadsLoading: boolean;
}

export interface PostThreadType {
  message: string;
  files: any;
}

export interface PatchThreadPropType {
  thread_status_id?: number;
  thread_title?: string;
}

function ProjectThreadHOC<T>(WrappedComponent: React.ComponentType<T>) {
  const NewComponent = (props: T) => {
    const threadService = new ProjectThreadService();
    const { projectId,surveyId } = useParams();
    const { selectedSurvey }: any = useOutletContext()


    const [projectThreads, setProjectThreads] = useState<
      Array<ProjectThreadType>
    >([]);
    const [selectedThread, setSelectedThread] =
      useState<ProjectThreadType | null>(null);


    async function getAllProjectThreads(setNewThread = false) {
      setThreadsLoading(true);
      try {
        const threads = await threadService.getProjectThreadsById(
          Number(projectId), Number(surveyId)
        );
        setProjectThreads(threads);
        setThreadsLoading(false);
        if (setNewThread) setSelectedThread(threads[0]);
      } catch (error) {
        enqueueSnackbar(
          <Typography variant="body1">Fetching threads failed</Typography>,
          {
            variant: "error",
          }
        );
        setThreadsLoading(false);
      }
    }

    const [isThreadsLoading, setThreadsLoading] = useState(false);

    async function getProjectThread(threadId: number) {
      try {
        const thread = await threadService.getProjectThreadById(
          Number(projectId), Number(surveyId),
          threadId
        );


        setSelectedThread(thread);
      } catch (error) {
        enqueueSnackbar(
          <Typography variant="body1">Fetching threads failed</Typography>,
          {
            variant: "error",
          }
        );
      }
    }

    async function postProjectThread(message: string, setNewThread = false) {

      // if (projectId && selectedSurvey)
        try {
          await threadService.postProjectThreadsById(Number(projectId), Number(surveyId), message);

          getAllProjectThreads(setNewThread);
          // enqueueSnackbar(
          //   <Typography variant="body1">Thread Created</Typography>,
          //   {
          //     variant: "success",
          //   }
          // );
        } catch (error) {
          enqueueSnackbar(
            <Typography variant="body1">Creating thread failed</Typography>,
            {
              variant: "error",
            }
          );
        }
    }

    async function postThread(id: number, obj: PostThreadType) {
      // if (projectId && selectedSurvey)
        try {
          console.log(Number(projectId), id, obj);

          await threadService.postThread(Number(projectId), Number(surveyId), id, obj);

          getProjectThread(id);
          // getAllProjectThreads();
          // enqueueSnackbar(
          //   <Typography variant="body1">Thread Created</Typography>,
          //   {
          //     variant: "success",
          //   }
          // );
        } catch (error) {
          enqueueSnackbar(
            <Typography variant="body1">Creating thread failed</Typography>,
            {
              variant: "error",
            }
          );
        }
    }

    async function patchThread(threadId: number, obj: PatchThreadPropType) {
      if (selectedThread) {
        try {
          await threadService.patchThreadStatus(
            Number(projectId), Number(surveyId),
            threadId,
            obj
          );

          getProjectThread(threadId);
          // getAllProjectThreads();
          enqueueSnackbar(
            <Typography variant="body1">Thread Updated</Typography>,
            {
              variant: "success",
            }
          );
        } catch (error) {
          enqueueSnackbar(
            <Typography variant="body1">Updating thread failed</Typography>,
            {
              variant: "error",
            }
          );
        }
      }
    }

    function threadCardClickHandler(id: number) {
      getProjectThread(id);
    }

    useEffect(() => {
      // if (projectId && selectedSurvey) {
      // }
      getAllProjectThreads();
    }, [selectedSurvey, surveyId]);


    return (
      <WrappedComponent
        {...props}
        projectThreads={projectThreads}
        setProjectThreads={setProjectThreads}
        selectedThread={selectedThread}
        setSelectedThread={setSelectedThread}
        postProjectThread={postProjectThread}
        postThread={postThread}
        patchThread={patchThread}
        threadCardClickHandler={threadCardClickHandler}
        getAllProjectThreads={getAllProjectThreads}
        isThreadsLoading={isThreadsLoading}
        getProjectThread={getProjectThread}
      />
    );
  };

  return NewComponent;
}

export default ProjectThreadHOC;
