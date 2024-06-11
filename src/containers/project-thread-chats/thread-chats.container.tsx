import {
  Box,
  IconButton,
  Stack,
  Typography,
  Tooltip,
  TextField,
} from "@mui/material";
// import SendIcon from "@mui/icons-material/Send"

import ProjectThreadHOC from "@/higher-order-components/project-thread";
import { ProjectThreadsContainerPropTypes } from "@/higher-order-components/project-thread/project-thread.hoc";
import ProjectThreadsList from "@/components/project-threads-list";
import ThreadChatHeader from "@/components/thread-chat-header";
import ThreadChatBodyComponent from "@/components/thread-chat-body";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
// import AddIcon from "@mui/icons-material/Add"
import AddBtn from "@/components/add-btn";
import LoadingSpinner from "@/components/loader";
import { Search2 } from "@/assets/images";
// import AddBtn from "@/components/add-btn"
import AddIcon from "@mui/icons-material/Add";
import { Send } from "@/assets/images";
import { AttachmentMessage } from "@/components/thread-chat-body/thread-chat-body.style";
import {
  ResolvedBtn,
  UnResolvedBtn,
  StyledContainer,
} from "./project-thread-chats.style";
import { ProjectThreadType } from "@/types/project.type";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import RttIcon from "@mui/icons-material/Rtt";
import { theme } from "@/constants/theme";

function ProjectThreadChatsContainer({
  postProjectThread,
  postThread,
  projectThreads,
  selectedThread,
  setSelectedThread,
  patchThread,
  threadCardClickHandler,
  isThreadsLoading,
  getAllProjectThreads,
  getProjectThread,
}: ProjectThreadsContainerPropTypes) {
  // const { register, handleSubmit, reset } = useForm<Input>()
  const [attachment, setAttachment] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [useRichText, setUseRichText] = useState(false);

  function attachmentsHandler(e: any) {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    setAttachment(chosenFiles);
  }

  const onSubmit = () => {
    if (selectedThread && message) {
      postThread(selectedThread.id, {
        message: message,
        files: attachment || "",
      });
      setAttachment(null);
      setMessage("");
    }
  };

  function updateThreadStatus(status: number) {
    if (selectedThread) {
      patchThread(selectedThread.id, { thread_status_id: status });
    }
  }

  function updateThreadTitle(title: string) {
    if (selectedThread) {
      patchThread(selectedThread.id, { thread_title: title });
    }
  }

  function postNewThread() {
    postProjectThread("New Thread", true);
  }

  const [showResolvedOnly, setShowResolvedOnly] = useState(false);
  const [showUnresolvedOnly, setShowUnresolvedOnly] = useState(false);

  function showSearchedThreads(arr: ProjectThreadType[]) {
    if (!searchedTitle) return arr;

    return arr.filter(
      (obj) =>
        obj.thread_title.toLowerCase().indexOf(searchedTitle.toLowerCase()) >= 0
    );
  }

  function filterThreads(arr: ProjectThreadType[]) {
    if (
      (showResolvedOnly && showUnresolvedOnly) ||
      (!showResolvedOnly && !showUnresolvedOnly)
    )
      return showSearchedThreads(arr);

    if (showResolvedOnly) {
      return showSearchedThreads(
        arr.filter((obj) => obj.thread_status_id === 2)
      );
    }

    return showSearchedThreads(arr.filter((obj) => obj.thread_status_id === 1));
  }

  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchedTitle, setSearchedTitle] = useState("");

  useEffect(() => {
    if (projectThreads) {
      setSelectedThread(projectThreads[0])
    }
  }, [projectThreads])


  return (
    <>
      {isThreadsLoading && <LoadingSpinner />}
      <Stack
        component="section"
        sx={{
          width: "100%",
          height: "calc(100vh - 235px)",
          marginBottom: "1rem",
        }}
        direction="row"
        justifyContent="space-between"
        gap="0px"
      >
        <Box
          sx={{
            display: "flex",
            flex: "1",
            maxWidth: "331px",
            padding: "0px",
            flexDirection: "column",
            alignItems: "flex-start",
            borderRadius: "1rem 0 0 1rem",
            backgroundColor: "#fff",
            boxShadow:
              "0rem 0rem 0.125rem rgba(145, 158, 171, 0.15), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.2)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: "1rem",
              borderBottom: "1px solid rgba(58, 53, 65, 0.12)",
              padding: "0.78125rem 1.25rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "#323232",
                fontSize: "18px",
                fontWeight: "700",
                lineHeight: "normal",
              }}
            >
              Threads
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <IconButton
                sx={{
                  padding: "0",
                  borderRadius: 0,
                }}
                onClick={() =>
                  setShowSearchBar((prev) => {
                    if (prev) setSearchedTitle("");

                    return !prev;
                  })
                }
              >
                <img src={Search2} />
              </IconButton>
              <AddBtn onClick={postNewThread} />
              {/* <IconButton
                sx={{
                  padding: "0",
                  borderRadius: 0,
                }}
              >
                <img src={ChevronRight} />
              </IconButton> */}
            </Box>
          </Box>
          <Box
            sx={{
              flex: "1",
              width: "100%",
              overflowY: "scroll",
              overflowX: "hidden",
              padding: "0rem 0.75rem 0.75rem",
            }}
          >
            {projectThreads?.length ? (
              <Box>
                <Box
                  sx={{
                    backgroundColor: "white",
                    paddingTop: "0.75rem",
                    paddingBottom: "0.25rem",
                    position: "sticky",
                    top: "0",
                    zIndex: "3",
                  }}
                >
                  <Box
                    sx={{
                      marginBottom: "0.5rem",
                    }}
                  >
                    {showSearchBar ? (
                      <TextField
                        sx={{
                          width: "100%",
                          "& .MuiInput-underline:before": {
                            // Removes the default bottom border
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before":
                          {
                            // Removes the hover effect on the bottom border
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:after": {
                            // Removes the bottom border on focus (when the input is active)
                            borderBottom: "none",
                          },
                          background: "#F3F3F3",
                          padding: "4px 8px",
                          borderRadius: "16px",
                        }}
                        placeholder="search here"
                        variant="standard"
                        onChange={(e) => setSearchedTitle(e.target.value)}
                      />
                    ) : null}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "flex-end",
                      marginBottom: "1rem",
                    }}
                  >
                    <ResolvedBtn
                      onClick={() => setShowResolvedOnly((prev) => !prev)}
                      variant="contained"
                      sx={{
                        borderRadius: "3rem",
                      }}
                      className={showResolvedOnly ? "active" : ""}
                    >
                      Resolved
                    </ResolvedBtn>
                    <UnResolvedBtn
                      onClick={() => setShowUnresolvedOnly((prev) => !prev)}
                      variant="contained"
                      className={showUnresolvedOnly ? "active" : ""}
                    >
                      Unresolved
                    </UnResolvedBtn>
                  </Box>
                </Box>

                <ProjectThreadsList
                  projectThreads={filterThreads(projectThreads)}
                  threadCardClickHandler={threadCardClickHandler}
                  selectedThread={selectedThread}
                />
              </Box>
            ) : (
              <Box>
                <Typography
                  sx={{
                    color: "#616161",
                    fontSize: "14px",
                    fontWeight: "400",
                    textAlign: "center",
                  }}
                >
                  There are no threads yet !
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        {selectedThread ? (
          <Stack
            direction="column"
            sx={{
              flex: "1",
              borderRadius: "0 8px 8px 0",
              padding: "0px",
              backgroundColor: "#fff",
              boxShadow:
                "0rem 0rem 0.125rem rgba(145, 158, 171, 0.15), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.2)",
            }}
          >
            <ThreadChatHeader
              status={selectedThread.thread_status_id}
              title={selectedThread.thread_title}
              fullView={true}
              updateThreadStatus={updateThreadStatus}
              updateThreadTitle={updateThreadTitle}
            />
            <ThreadChatBodyComponent
              getProjectThread={getProjectThread}
              thread={selectedThread}
              updateThreadStatus={updateThreadStatus}
              getAllProjectThreads={getAllProjectThreads}
            />
            <Box>
              <>
                <Box
                  sx={{
                    display: "flex",
                    padding: "0rem 0.8rem 0.8rem",
                  }}
                >
                  <StyledContainer
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    className="test"
                    sx={{
                      borderTop: "1px solid  #E4E4E4",
                      paddingTop: "12px",
                    }}
                  >
                    {useRichText ? (
                      <CKEditor
                        editor={Editor as any}
                        onReady={(editor) => {
                          // You can store the "editor" and use when it is needed.
                          console.log("Editor is ready to use!", editor);
                        }}
                        onChange={(_e, editor: any) => {
                          const data = editor.getData();

                          if (data) {
                            setMessage(data);
                          }

                          return data;
                        }}
                        data={message}
                        config={{
                          placeholder: "Type your message here",
                          toolbar: {
                            items: [
                              "undo",
                              "redo",
                              "|",
                              "heading",
                              "|",
                              "bold",
                              "italic",
                              "underline",
                              "fontFamily",
                              "fontColor",
                              "fontSize",
                              "|",
                              "link",
                              "insertTable",
                              "tableToolbar",
                              // "mediaEmbed",
                              "|",
                              "bulletedList",
                              "numberedList",
                              "|",
                              // "imageUpload",
                              // "blockQuote", 
                              // "|",
                            ]
                          }
                        }}
                      />
                    ) : (
                      <input
                        style={{
                          flex: "0.98",
                          border: "none",
                          outline: "none",
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            onSubmit();
                          }
                        }}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here"
                      />
                    )}

                    <Stack direction="row" alignItems="center" gap="12px">
                      <Tooltip
                        title={useRichText ? "Use Text Box" : " Use Rich Text"}
                      >
                        <RttIcon
                          width={12}
                          onClick={() => {
                            setUseRichText(!useRichText);
                            setMessage("");
                          }}
                          style={{
                            cursor: "pointer",
                            backgroundColor: useRichText
                              ? `${theme.palette.primary.main}`
                              : "#ffffff",
                            borderRadius: "4px",
                          }}
                        />
                      </Tooltip>
                      <IconButton
                        component="label"
                        sx={{
                          borderRadius: "0.5rem",
                          backgroundColor: "#FDB447",
                          color: "#212121",
                          padding: "4px",

                          "&:hover": {
                            backgroundColor: "#FDB447",
                          },
                        }}
                        aria-label="send"
                      >
                        <input
                          onChange={attachmentsHandler}
                          hidden
                          type="file"
                        />
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        disabled={!message}
                        sx={{
                          borderRadius: "0.5rem",
                          padding: "4px",
                          opacity: message ? 1 : 0.5,
                        }}
                        type="submit"
                        onClick={onSubmit}
                      >
                        <img src={Send} />
                      </IconButton>
                    </Stack>
                  </StyledContainer>
                </Box>
              </>
              {attachment?.length && (
                <Box
                  sx={{
                    display: "flex",
                    marginLeft: "16px",
                    paddingBottom: "4px",
                  }}
                >
                  <AttachmentMessage>{attachment[0].name}</AttachmentMessage>
                  <IconButton onClick={() => setAttachment(null)}>
                    <CloseIcon width={10} height={10} />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Stack>
        ) : (
          <Stack
            sx={{
              flex: "1",
              borderRadius: "0px 8px 8px 0",
              padding: "24px",
              backgroundColor: "#fff",
              boxShadow:
                "0rem 0rem 0.125rem rgba(145, 158, 171, 0.15), 0rem 0.5rem 1.5rem -0.25rem rgba(199, 203, 206, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              gap="1.5rem"
            >
              <Typography
                sx={{
                  color: "#616161",
                  fontSize: "14px",
                  fontWeight: "400",
                  textAlign: "center",
                }}
              >
                No thread selected
              </Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
    </>
  );
}

export default ProjectThreadHOC(ProjectThreadChatsContainer);
