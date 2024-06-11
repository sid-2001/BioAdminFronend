import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useForm } from "react-hook-form";

import Select from "@/components/select";
import TextField from "@mui/material/TextField";
import {
  PatchProjectRequestByIdRequestType,
  RequestState,
} from "@/services/project-request.service";
import { ProjectRequest } from "@/types/project-request.type";
import { useEffect, useState } from "react";

type Inputs = {
  status: number;
  title: string;
};

interface EditRequestPropTypes {
  showDialog: any;
  closeDialog: any;
  editHandler: (reqObj: PatchProjectRequestByIdRequestType) => void;
  selectedRequestForEdit: ProjectRequest;
  statusList: Array<RequestState>;
}

function EditRequest({
  showDialog,
  closeDialog,
  editHandler,
  selectedRequestForEdit,
  statusList,
}: // selectedRequestForEdit,
// changeHandler,
EditRequestPropTypes) {
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    editHandler({ status_id: selectInput, comment: data.title });
  };

  const [textInput, setTextInput] = useState(
    selectedRequestForEdit.title || ""
  );
  const [selectInput, setSelectInput] = useState(
    selectedRequestForEdit.status_id || 1
  );

  useEffect(() => {
    setTextInput(selectedRequestForEdit.title);
    setSelectInput(selectedRequestForEdit.status_id);
  }, [selectedRequestForEdit]);

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
          Edit Request
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
              <label style={{ marginLeft: "5px" }}>Status*</label>
              <Select
                items={statusList.map((status) => ({
                  text: status.name,
                  value: status?.id?.toString() || "",
                }))}
                {...register("status")}
                isRequired={true}
                value={selectInput}
                onChange={(e) => setSelectInput(Number(e.target.value))}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "1rem",
              }}
            >
              <label style={{ marginLeft: "5px" }}>Title</label>
              <TextField
                type="text"
                {...register("title")}
                placeholder="Title"
                sx={{
                  width: "333px",
                  height: "40px",
                  borderRadius: "4px",
                  outline: "none",
                }}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            </Box>
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
            Edit
          </Button>
        </Box>
      </form>
    </Dialog>
  );
}

export default EditRequest;
