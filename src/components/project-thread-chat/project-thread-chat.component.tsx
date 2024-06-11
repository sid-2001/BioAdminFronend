import { ProjectThreadType } from "@/types/project.type";
import { StyledStack, StyledContainer } from "./project-thread-chat.style";
import ThreadChatBodyComponent from "@/components/thread-chat-body";

import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import { PostThreadType } from "@/higher-order-components/project-thread/project-thread.hoc";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { Send } from "@/assets/images";
import { AttachmentMessage } from "@/components/thread-chat-body/thread-chat-body.style";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import RttIcon from "@mui/icons-material/Rtt";
import { theme } from "@/constants/theme";

interface ProjectThreadChatComponentPropTypes {
  thread: ProjectThreadType;
  setSelectedThread: React.Dispatch<
    React.SetStateAction<ProjectThreadType | null>
  >;
  postThread: (id: number, obj: PostThreadType) => void;
  updateThreadStatus: any;
  updateThreadTitle: any;
  toggleResolve?: any;
  getProjectThread?: (id: number | string) => void;
  getAllProjectThreads?: () => void;
}

function ProjectThreadChatComponent({
  thread,
  postThread,
  toggleResolve,
  // setSelectedThread,
  updateThreadStatus,
  // updateThreadTitle,
  getProjectThread,
  getAllProjectThreads,
}: ProjectThreadChatComponentPropTypes) {
  const [attachment, setAttachment] = useState<any>(null);
  // const [showInput, setShowInput] = useState(false)
  // const [newTitle, setNewTitle] = useState("")

  function attachmentsHandler(e: any) {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    setAttachment(chosenFiles);
  }

  const onSubmit = () => {
    if (thread && message) {
      postThread(thread.id, {
        message: message,
        files: attachment || "",
      });
      setAttachment(null);
      setMessage("");
    }
  };

  const [useRichText, setUseRichText] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <StyledStack sx={{ margin: "0rem", padding: "0" }}>
      <ThreadChatBodyComponent
        thread={thread}
        showPadding={false}
        toggleResolve={toggleResolve}
        getProjectThread={getProjectThread}
        updateThreadStatus={updateThreadStatus}
        getAllProjectThreads={getAllProjectThreads}
      />
      <Box>
        <>
          <Box
            sx={{
              display: "flex",
              // padding: "0rem 1.25rem 1.25rem", // Just testing
              padding: "0",
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
                        "mediaEmbed",
                        "|",
                        "bulletedList",
                        "numberedList",
                        "|",
                        // "imageUpload",
                        // "blockQuote", 
                        // "|",
                      ],

                      shouldNotGroupWhenFull: false,
                    },
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

              <Stack direction="row" alignItems="center" gap="4px">
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
                  <input onChange={attachmentsHandler} hidden type="file" />
                  <AddIcon />
                </IconButton>
                <IconButton
                  disabled={!message}
                  sx={{
                    borderRadius: "0.5rem",
                    padding: "4px",
                    opacity: message ? 1 : 0.5
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
            }}
          >
            <AttachmentMessage>{attachment[0].name}</AttachmentMessage>
            <IconButton onClick={() => setAttachment(null)}>
              <CloseIcon width={10} height={10} />
            </IconButton>
          </Box>
        )}
      </Box>
    </StyledStack>
  );
}

export default ProjectThreadChatComponent;
