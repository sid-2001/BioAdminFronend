import { Box, IconButton, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm } from "react-hook-form";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import { Edit2 } from "@/assets/images";

// import { ResolveBtn } from "@/styles/thread-resolve-btn"
import { StyledTitle } from "./thread-chat-style";
import Textfield from "@/components/text-field";
import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";

interface ThreadChatHeaderPropTypes {
  status: number;
  title: string;
  resolveHandler?: () => void;
  fullView?: boolean;
  updateThreadStatus: (status: number) => void;
  updateThreadTitle: (message: string) => void;
}

type Inputs = {
  thread_title: string;
};

function ThreadChatHeader({
  status,
  title,
  fullView,
  updateThreadStatus,
  updateThreadTitle,
}: ThreadChatHeaderPropTypes) {
  const { register, handleSubmit, reset, setValue} = useForm<Inputs>();
  const [showInput, setShowInput] = useState(false);

  const onSubmit = (data: Inputs) => {
    console.log(data);

    updateThreadTitle(data.thread_title);

    reset({
      thread_title: "",
    });
    setShowInput(false);
  };

  function toggleResolve() {
    if (status === 1) updateThreadStatus(2);
    else updateThreadStatus(1);
  }

  return (
    <Stack
      sx={{
        // borderBottom: "2px solid #8E27D7",
        paddingBottom: "0.5rem",
        marginBottom: "1rem",
        padding: "0.45rem 1.25rem",
        borderBottom: "1px solid rgba(58, 53, 65, 0.12)",
      }}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction="row" alignItems="center">
        {!fullView && (
          <IconButton>
            <ArrowBackIcon width={24} height={24} />
          </IconButton>
        )}

        <Box>
          <Tooltip title={status === 1 ? "Mark Resolve" : "Mark Unresolve"}>
            <IconButton
              onClick={toggleResolve}
              sx={{
                borderRadius: "4px",
                padding: "6px 8px",
              }}
            >
              <CheckCircleIcon
                width={24}
                height={24}
                sx={{
                  color:
                    status === 1
                      ? "rgba(156, 156, 156, 1)"
                      : "rgba(11, 185, 122, 1)",
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        {showInput ? (
          <form
            style={{ display: "flex", gap: "0.5rem" }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Textfield
              required
              {...register("thread_title")}
              label="Title"
              sx={{ maxHeight: "42px" }}
              variant="standard"
            />
            <Stack direction="row" gap="0.25rem">
              <IconButton onClick={() => {setShowInput(false); setValue("thread_title", "")}}>
                <CancelIcon width={24} height={24} />
              </IconButton>
              <IconButton type="submit">
                <DoneIcon width={24} height={24} />
              </IconButton>
            </Stack>
          </form>
        ) : (
          <Tooltip title={title || "Thread Title"}>
            <StyledTitle sx={{ maxWidth: "20rem" }} variant="h2">
              {title || "Thread Title"}
            </StyledTitle>
          </Tooltip>
        )}
      </Stack>
      <Box>
        {fullView && !showInput ? (
          <IconButton
            sx={{
              borderRadius: "4px",
              padding: "4px",
            }}
            onClick={() => setShowInput((prev) => !prev)}
          >
            <img src={Edit2} />
          </IconButton>
        ) : (
          ""
        )}
      </Box>
    </Stack>
  );
}

export default ThreadChatHeader;
