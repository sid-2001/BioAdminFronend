import { ProjectThreadType } from "@/types/project.type";

import {
  ThreadChatBody,
  MessageText,
  MessageTime,
  MessageTimeBox,
  MessageAvatar,
  AttachmentMessage,
  IOSSwitch,
} from "./thread-chat-body.style";
import {
  Box,
  FormControlLabel,
  IconButton,
  Switch,
  Typography,
  Badge,
} from "@mui/material";
import { LocalStorageService } from "@/helpers/local-storage-service";
// import moment from "moment"
import { FileDownload2 } from "@/assets/images";
import { Stack } from "@mui/system";
import { QuestionMark, SmallDropdown } from "@/assets/images";
import { useState } from "react";
import ChatPopoverComponent from "./chat-popover.component";

interface ThreadChatBodyComponentPropTypes {
  thread: ProjectThreadType;
  showPadding?: boolean;
  toggleResolve?: any;
  getProjectThread?: (id: number | string) => void;
  updateThreadStatus?: (status: number) => void;
  getAllProjectThreads?: () => void;
}

function getFileNameFromUrl(url: string) {
  if (url && typeof url === "string") {
    const arr = url.split("/");

    return arr[arr.length - 1].toString();
  }
}

export function getDuration(str: string) {
  const diff = Number(new Date()) - Number(new Date(str));
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;
  switch (true) {
    case diff < minute:
      const seconds = Math.round(diff / 1000);
      return `${seconds} ${seconds > 1 ? "seconds" : "second"} ago`;
    case diff < hour:
      return Math.round(diff / minute) + " minutes ago";
    case diff < day:
      return Math.round(diff / hour) + " hours ago";
    case diff < month:
      return Math.round(diff / day) + " days ago";
    case diff < year:
      return Math.round(diff / month) + " months ago";
    case diff > year:
      return Math.round(diff / year) + " years ago";
    default:
      return "";
  }
}

export function getExtension(url: string) {
  const arr = url.split(".");

  return arr[arr.length - 1];
}

export function downloadFile(url: any) {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `FileName.${getExtension(url)}`);
  link.setAttribute("target", "_blank");

  // Append to html link element page
  document.body.appendChild(link);

  // Start download
  link.click();

  // Clean up and remove the link
  link?.parentNode?.removeChild(link);
  console.log(url);
}

function ThreadChatBodyComponent({
  thread,
  showPadding = true,
  toggleResolve,
  getProjectThread,
  updateThreadStatus,
  getAllProjectThreads,
}: ThreadChatBodyComponentPropTypes) {
  const localStorageSerive = new LocalStorageService();
  const user = JSON.parse(localStorageSerive.get("user") || "");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget);

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "show associated questions" : undefined;

  function toggleThreadStatus(truth: boolean) {
    if (updateThreadStatus) {
      if (truth) updateThreadStatus(2);
      else updateThreadStatus(1);
    }
  }

  let isThreadActive = thread.thread_status_id === 2;


  return (
    <ThreadChatBody
      sx={{ padding: showPadding ? "0 1.25rem" : "0rem", marginTop: "0.2rem" }}
    >
      <Stack
        sx={{
          position: "sticky",
          top: "0",
          zIndex: "2",
          padding: "0.7rem",
          backgroundColor: "white",
        }}
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          sx={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          {thread.thread_status_id &&
            <IOSSwitch onChange={(e) => toggleThreadStatus(e.target.checked)} checked={isThreadActive} />
          }
          <Typography
            sx={{
              color: "#212121",
              fontSize: "14px",
              fontWeight: "400",
            }}
          >
            Resolved
          </Typography>
        </Box>
        <Badge
          color="primary"
          badgeContent={
            Array.isArray(thread.questions) ? thread.questions.length : 0
          }
        >
          <button
            style={{
              display: "flex",
              height: "18px",
              padding: "0px 8px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              maxWidth: "36px",
              borderRadius: "12px",
              background: "#CCC",
              outline: "none",
              border: "none",
              cursor: "pointer",
            }}
            aria-describedby={id}
            onClick={handleClick}
          >
            <img src={QuestionMark} />
            <img src={SmallDropdown} />
          </button>
        </Badge>
        <ChatPopoverComponent
          anchorEl={anchorEl}
          handleClose={handleClose}
          open={open}
          id={id}
          questions={Array.isArray(thread.questions) ? thread.questions : []}
          getProjectThread={getProjectThread as any}
          threadId={thread.id}
          getAllProjectThreads={getAllProjectThreads}
        />
      </Stack>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          background: "white",
          zIndex: 1,
          padding: "5px 10px 0px 10px",
          display:
            !toggleResolve || thread.latest_messages.length <= 0 ? "none" : "",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              size="small"
              onChange={toggleResolve}
              checked={thread.thread_status_id === 1 ? false : true}
            />
          }
          label="Resolved"
        />
      </Box>
      {thread.latest_messages.length
        ? thread.latest_messages.map((message, i) => (
          <Box key={i}>
            {message.message && message.user.id === user.id ? (
              <>
                <Box
                  sx={{
                    textAlign: "right",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <Box
                    sx={{
                      margin: "12px 0",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: "0.25rem",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        {message.created_at && (
                          <MessageTimeBox
                            sx={{
                              justifyContent:
                                message.user.id !== user.id
                                  ? "flex-start"
                                  : "flex-end",
                            }}
                          >
                            <MessageTime>
                              {getDuration(message.created_at)}
                            </MessageTime>
                          </MessageTimeBox>
                        )}
                      </Box>
                      <MessageAvatar>
                        {message.user.name
                          ? message.user.name[0].toUpperCase()
                          : "U"}
                      </MessageAvatar>
                    </Box>
                    <Box>
                      <MessageText
                        variant="body1"
                        dangerouslySetInnerHTML={{
                          __html: `${message.message || ""}`,
                        }}
                      ></MessageText>
                    </Box>
                  </Box>
                  {message.attachments.length ? (
                    <AttachmentMessage>
                      {getFileNameFromUrl(
                        message.attachments[0].file_path || ""
                      ) || "File"}
                      <IconButton
                        sx={{
                          padding: "0",
                          borderRadius: "4px",
                        }}
                        onClick={() =>
                          downloadFile(message.attachments[0].file_path)
                        }
                      >
                        <img src={FileDownload2} />
                      </IconButton>
                    </AttachmentMessage>
                  ) : null}
                </Box>
              </>
            ) : message.message ? (
              <Box
                sx={{
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    margin: "12px 0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: "0.25rem",
                      alignItems: "center",
                    }}
                  >
                    <MessageAvatar
                      sx={{
                        backgroundColor: "#EACEFF",
                        color: "#8A16E5",
                      }}
                    >
                      {message.user.name[0].trim()
                        ? message.user.name[0].trim().toUpperCase()
                        : "U"}
                    </MessageAvatar>
                    <Box>
                      {message.created_at && (
                        <MessageTimeBox
                          sx={{
                            justifyContent:
                              message.user.id !== user.id
                                ? "flex-start"
                                : "flex-end",
                          }}
                        >
                          <MessageTime>
                            {getDuration(message.created_at)}
                          </MessageTime>
                        </MessageTimeBox>
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <MessageText
                      dangerouslySetInnerHTML={{
                        __html: `${message.message || ""}`,
                      }}
                      variant="body1"
                    ></MessageText>
                  </Box>
                </Box>

                {message.attachments.length ? (
                  <AttachmentMessage>
                    {getFileNameFromUrl(
                      message.attachments[0].file_path || ""
                    ) || "File"}
                    <IconButton
                      sx={{
                        padding: "0",
                        borderRadius: "4px",
                      }}
                      onClick={() =>
                        downloadFile(message.attachments[0].file_path)
                      }
                    >
                      <img src={FileDownload2} />
                    </IconButton>
                  </AttachmentMessage>
                ) : null}
              </Box>
            ) : null}
          </Box>
        ))
        : null}
      {!thread.latest_messages.length && (
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            marginTop: "3rem",
          }}
        >
          No messages
        </Typography>
      )}
    </ThreadChatBody>
  );
}

export default ThreadChatBodyComponent;
