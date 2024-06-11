import TextField from "@/components/text-field";
// import { ProjectRequestStateMapping } from "@/types/project-request.type";
import { StyledLabel } from "./project-request.style";

import { useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import "./style.css";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useForm } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FileIcon } from "react-file-icon";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Folder } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUploadOutlined";

type Inputs = {
  title: string;
  effort: number;
  eta: number;
  attachments: any;
  description: any;
};

interface CreateRequestPropTypes {
  showDialog: any;
  closeDialog: any;
  submitHandler: (
    title: string,
    effort: number,
    eta: number,
    attachments: Array<any>,
    editorData: string
  ) => void;
}

const MAX_COUNT = 10;

// DO NOT REMOVE
// const DatePickerInput = forwardRef(({ value, onClick }, ref) => (
//   <button className='datepickerInput' type='button' onClick={onClick} ref={ref}>
//     {value || "Pick eta"}
//   </button>
// ))

export const StyledDatePicker = styled(DateTimePicker)(() => ({
  "& .MuiInputBase-input": {
    padding: "10.5px 14px !important",
    paddingRight: "0 !important",
  },
}));

export function getExtension(filename: string) {
  let str = "";

  if (filename && typeof filename === "string") {
    let i = filename.length - 1;

    while (i >= 0 && filename[i] !== ".") {
      str += filename[i];
      i--;
    }

    if (filename[i] === ".") return str.split("").reverse().join("");
    return "";
  } else return "";
}

function CreateRequest({
  showDialog,
  closeDialog,
  submitHandler,
}: CreateRequestPropTypes) {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [editorData, setEditorData] = useState("");
  const [attachments, setAttachments] = useState<Array<any>>([]);

  const [eta, setEta] = useState<any>("");

  const handleUploadFiles = (files: any) => {
    const uploaded = [...attachments];
    let limitExceeded = false;

    files.some((file: any) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);

        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) setAttachments(uploaded);
  };

  function attachmentsHandler(e: any) {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  }

  const onSubmit = (data: Inputs) => {
    console.log(data);
    console.log(editorData);
    console.log(attachments);

    submitHandler(data.title, data.effort, eta as any, attachments, editorData);
    reset({
      title: "",
      effort: 0,
    });
    setEta("");
    setAttachments([]);
  };

  return (
    <Dialog
      scroll="paper"
      onClose={closeDialog}
      open={showDialog}
      maxWidth="md"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginRight: "10px",
          marginTop: "10px",
        }}
      >
        <DialogTitle id="alert-dialog-title" color="black">
          Create New Request
        </DialogTitle>
        <IconButton
          onClick={closeDialog}
          sx={{ width: "40px", height: "40px" }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(2,1fr)",
              marginTop: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "1rem",
              }}
            >
              <label style={{ marginLeft: "5px" }}>Title*</label>
              <TextField
                required
                type="text"
                {...register("title")}
                placeholder="Title"
                sx={{
                  width: "333px",
                  height: "40px",
                  borderRadius: "4px",
                  outline: "none",
                  paddingTop: "6px",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "1rem",
              }}
            >
              <label style={{ marginLeft: "5px" }}>Effort in hrs</label>
              <TextField
                // required
                type="number"
                {...register("effort")}
                placeholder="Effort"
                sx={{
                  width: "333px",
                  height: "40px",
                  borderRadius: "4px",
                  outline: "none",
                  paddingTop: "6px",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "1rem",
              }}
            >
              <label style={{ marginLeft: "5px" }}>ETA</label>
              {/* <TextField
                // required
                type="number"
                {...register("eta")}
                placeholder="ETA"
                sx={{
                  width: "333px",
                  height: "40px",
                  borderRadius: "4px",
                  outline: "none",
                  paddingTop: "6px",
                }}
              /> */}
              <DemoContainer components={["DateTimePicker"]}>
                <StyledDatePicker
                  name="eta"
                  onChange={(e: any) => setEta(e.$d)}
                />
              </DemoContainer>
            </Box>
          </Box>

          <Box sx={{ marginTop: "2rem" }}>
            <label style={{ marginLeft: "5px" }}>Description</label>
            <CKEditor
              editor={Editor as any}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
              }}
              onChange={(_, editor: any) => {
                setEditorData(editor.getData());
              }}
              data={editorData}
            />
          </Box>

          <Box>
            <StyledLabel htmlFor="attachments">
              <Folder sx={{ marginRight: "10px" }} />
              Pick File
              <input
                {...register("attachments")}
                style={{ display: "none" }}
                id="attachments"
                type="file"
                multiple
                onChange={attachmentsHandler}
              />
              <CloudUploadIcon sx={{ marginLeft: "550px" }} />
            </StyledLabel>
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(2,1fr)",
            }}
          >
            {attachments.map((value: any, i: number) => {
              // const icon = value.name && value.name.split(".").pop();
              return (
                <Box
                  key={i}
                  sx={{
                    border: "2px solid rgba(223, 227, 232, 1)",
                    marginTop: "10px",
                    borderRadius: "5px",
                    padding: "10px",
                    fontWeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack spacing={2} direction="row" alignItems="center">
                    <div style={{ height: "20px", width: "20px" }}>
                      <FileIcon extension={getExtension(value.name)} />
                    </div>
                    <div>
                      <Typography
                        style={{ fontSize: "12px", wordBreak: "break-all" }}
                      >
                        {value?.name}
                      </Typography>
                      <div
                        style={{
                          color: "rgba(145, 158, 171, 1)",
                          fontSize: "11px",
                        }}
                      ></div>
                    </div>
                  </Stack>
                  <IconButton
                    onClick={() => {
                      const temp = attachments.filter(
                        (attachment) => attachment.name !== value.name
                      );

                      setAttachments(temp);
                    }}
                  >
                    <CancelOutlinedIcon color="inherit" />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        </DialogContent>
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexDirection: "row-reverse",
            margin: "2rem 1.5rem 2rem 0",
          }}
        >
          {/* <Button onClick={closeDialog}>Cancel</Button> */}
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Box>
      </form>
    </Dialog>
  );
}

export default CreateRequest;
