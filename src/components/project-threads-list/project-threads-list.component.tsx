import { ProjectThreadType } from "@/types/project.type";
import {
  ThreadCard,
  MessageText,
  MessageTitle,
  MessageTime,
} from "./project-threads-list.style";

import { Box, IconButton, Stack, Typography, Menu } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { getDuration } from "../thread-chat-body/thread-chat-body.component";
// import LoadingSpinner from "@/components/loader"
import { Question } from "@/types/survey-builder.type";
import { useEffect, useState } from "react";
import { isAttachmentIcon, isEstimateIcon } from "@/assets/images";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { StyledMenuItems } from "@/components/project-card-new/project-card-new.style";
import InfoIcon from "@mui/icons-material/Info";

interface ProjectThreadsListPropTypes {
  projectThreads: Array<ProjectThreadType>;
  threadCardClickHandler: (id: number) => void;
  selectedThread: ProjectThreadType | null;
  selectedQuestion?: Question | null;
  threadsAll?: boolean;
}

interface ProjectThreadPropTypes {
  thread: ProjectThreadType;
  threadCardClickHandler: (id: number) => void;
  isActive: boolean;
}

function ProjectThread({
  thread,
  threadCardClickHandler,
  isActive,
}: ProjectThreadPropTypes) {
  const [currentObjectId, setCurrentObjectId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openOptions = Boolean(anchorEl);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    objectUid: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentObjectId(objectUid);
  };

  const handleMenuClose = (event: any) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <ThreadCard
      className={isActive ? "active" : ""}
      onClick={() => threadCardClickHandler(thread.id)}
    >
      <Stack direction="row">
        <Box sx={{ marginRight: "0.5rem" }}>
          <CheckCircleIcon
            width={24}
            height={24}
            sx={{
              color:
                thread.thread_status_id === 1
                  ? "rgba(156, 156, 156, 1)"
                  : "rgba(11, 185, 122, 1)",
            }}
          />
        </Box>
        <Box sx={{ flexGrow: "1", maxWidth: "calc(100% - 40px)" }}>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              marginBottom: "0.25rem",
              height: "18px",
              justifyContent: "space-between",
              padding: "0",
              flexGrow: "1",
            }}
          >
            <MessageTitle
              sx={{ display: "flex" }}
              dangerouslySetInnerHTML={{
                __html: (thread as any)?.thread_title || "Thread Title",
              }}
            ></MessageTitle>
            {thread.created_at && (
              <Stack
                sx={{ height: "24px" }}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              ></Stack>
            )}

            <Stack direction="row" spacing={2} alignItems="center">
              {thread?.is_attachment && (
                <img
                  src={isAttachmentIcon}
                  height="20px"
                  style={{ marginTop: "0.2rem" }}
                />
              )}
              {thread?.is_estimated && (
                <img src={isEstimateIcon} height="15px" />
              )}
            </Stack>

            <Box>
              {openOptions && currentObjectId === String(thread.id) && (
                <Menu
                  id={`menu-${thread.id}`}
                  anchorEl={anchorEl}
                  open={openOptions}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    "aria-labelledby": `button`,
                  }}
                >
                  <StyledMenuItems>
                    <InfoIcon width={20} height={20} />
                    <Typography variant="body2">Show Details</Typography>
                  </StyledMenuItems>
                </Menu>
              )}
              <IconButton
                sx={{
                  width: "24px",
                  height: "24px",
                  padding: "0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "rgba(156, 156, 156, 1)",
                  borderRadius: "0.25rem",
                }}
                id={`options`}
                aria-controls={`options`}
                aria-haspopup="true"
                aria-expanded={"true"}
                onClick={(e) => {
                  handleMenuOpen(e, String(thread.id));
                }}
                // onClick={() => updateClient(client.is_active)}
              >
                <MoreHorizOutlinedIcon sx={{ color: "#9C9C9C" }} />
              </IconButton>
            </Box>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              marginBottom: "0.25rem",
              height: "18px",
              justifyContent: "space-between",
              padding: "0",
              flexGrow: "1",
            }}
          >
            <MessageText
              sx={{
                width: "90%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              dangerouslySetInnerHTML={{
                __html: `${
                  thread.latest_messages.length
                    ? thread.latest_messages[thread.latest_messages.length - 1]
                        .message
                    : "No Messages"
                }`,
              }}
            ></MessageText>
            <MessageTime sx={{}}>
              {getDuration(
                thread.latest_messages.length > 0
                  ? thread.latest_messages[thread.latest_messages.length - 1]
                      .created_at
                  : ""
              )}
            </MessageTime>
          </Stack>
        </Box>
      </Stack>
    </ThreadCard>
  );
}

function ProjectThreadsList({
  projectThreads,
  threadCardClickHandler,
  selectedThread,
  selectedQuestion,
  threadsAll,
}: ProjectThreadsListPropTypes) {
  const [threadList, setThreadList] = useState<any>([]);
  useEffect(() => {
    if (selectedQuestion && !threadsAll) {
      console.log(selectedQuestion, "sdasdaasdsadsadsda");
      console.log(projectThreads, "sdasdaasdsadsadsda");

      const temp: any[] = [];
      projectThreads.forEach((projectThread) => {
        // const index = projectThread.questions.findIndex(
        //   (question) => question.question_id === selectedQuestion?.question_id,
        // )

        // if (index >= 0) temp.push(projectThread)
        if (projectThread.questions && Array.isArray(projectThread.questions)) {
          const index = projectThread.questions.findIndex(
            (question) => question.question_id === selectedQuestion?.question_id
          );

          if (index >= 0) temp.push(projectThread);
        }
      });
      setTimeout(() => {
        setThreadList(temp);
      }, 200);
    } else {
      setTimeout(() => {
        setThreadList(projectThreads);
      }, 200);
    }
  }, [selectedQuestion, projectThreads, threadsAll]);
  return (
    <>
      {threadList.length ? (
        <>
          {threadList.map((thread: any) => (
            <ProjectThread
              key={thread.id}
              thread={thread}
              threadCardClickHandler={threadCardClickHandler}
              isActive={!!selectedThread && selectedThread.id === thread.id}
            />
          ))}
        </>
      ) : (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          marginTop="2rem"
        >
          <Typography fontWeight="500">No Threads</Typography>
        </Stack>
      )}
    </>
  );
}

export default ProjectThreadsList;
