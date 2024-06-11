import { EditProjectProps, IFormProject } from "./create-estimates.type";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import React, {
  useEffect,
  // useEffect,
  useState,
} from "react";
import TextField from "../text-field";
import Select from "@/components/select";
import { ProjectService } from "@/services/projects.service";
import { ProjectThreadService } from "@/services/project-threads.service";
// import { logger } from "@/helpers/logger";
// import {
//   ListService,
//   ProgrammingSoftwareListType,
// } from "@/services/list.service";
import { useSnackbar } from "notistack";
import { useOutletContext, useParams } from "react-router-dom";
import LoadingSpinner from "../loader";
// import { useNavigate } from "react-router";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
// import Client from "@/assets/images/iconamoon_profile-fill.svg";
// import Folder from "@/assets/images/material-symbols-light_folder.svg";
// import Title from "@/assets/images/Vector.svg";
import {
  boxStyle,
  // textFieldStyle
} from "./create-estimates.style";
import { ProjectThreadType } from "@/types/project.type";

const EditEstimate = (props: EditProjectProps) => {
  const { open, handleClose, getProjectRetriveByID, effortId, editData } =
    props;
  const { projectId, surveyId } = useParams();
  const [loading, setLoading] = useState<boolean>(false);

  const projectService = new ProjectService();
  const threadsService = new ProjectThreadService();
  //   const listServices = new ListService();
  const { enqueueSnackbar } = useSnackbar();
  //   const navigate = useNavigate();
  const { selectedSurvey }: any = useOutletContext()


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IFormProject>({
    defaultValues: {
      cost: "",
      description: "",
      title: "",
      effort: null,
      thread_id: null,
    },
  });

  const [threads, setThreads] = useState<Array<ProjectThreadType>>([]);

  useEffect(() => {
    if (projectId && selectedSurvey)
      threadsService
        .getProjectThreadsById(Number(projectId), Number(selectedSurvey))
        .then((data) => setThreads(data));
  }, [projectId, selectedSurvey]);

  const onSubmit: SubmitHandler<IFormProject> = async (data) => {
    setLoading(true);
    const payload = {
      projectId: Number(projectId),
      title: data.title,
      description: data.description,
      cost: Number(data.cost),
      effort: Number(data.effort),
      thread_id: Number(data.thread_id),
    };
    console.log(payload);

    try {
      console.log(getProjectRetriveByID);
      const data = await projectService.put_effort(Number(surveyId), payload, effortId);
      handleClose();
      getProjectRetriveByID();
      resetForm();
      enqueueSnackbar("Estimate Sucessfully Updated", {
        variant: "success",
      });
      console.log(projectId);
      // setIsEdit(false);
      if (data) {
        //   get_project_byid();
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      console.log(projectId);
      enqueueSnackbar("Oops somthing went wrong !!", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  const canSave = !!watch("title") && !!watch("effort") && !!watch("cost");
  const resetForm = () => {
    setValue("effort", null);
    setValue("title", "");
    setValue("cost", "");
    setValue("description", "");
    setValue("thread_id", null);
  };

  const setform = () => {
    setValue("effort", editData?.effort);
    setValue("title", editData?.title);
    setValue("cost", editData?.cost);
    setValue("description", editData?.description);
    setValue("thread_id", editData?.thread_id);
  };

  //   console.log(setform)

  //   useEffect(() => {
  //       setform();
  //   }, [editData]);
  useEffect(() => {
    if (open) {
      resetForm();
      setform();
    }
  }, [open, editData]);
  console.log(editData, "editDataeditData");

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
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
          Update Estimate
        </DialogTitle>
        <IconButton
          onClick={() => {
            resetForm();
            handleClose();
          }}
          sx={{ width: "40px", height: "40px" }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </Box>
      <DialogContent
        sx={{
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            width: "0.5em",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "transparent",
          },
        }}
      >
        <React.Fragment>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} marginTop={"0.10rem"}>
              <Grid item xs={6}>
                <label style={{ marginLeft: "5px" }}>Item*</label>
                <Box sx={boxStyle}>
                  {/* <img src={Folder} alt="" style={{ paddingLeft: "10px" }} /> */}
                  <TextField
                    placeholder="Item"
                    {...register("title", { required: true })}
                    sx={{
                      width: "100%",
                      height: "40px",
                      "& fieldset": { border: "none" },
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: "5px" }}>Cost($/hr)*</label>
                <Box sx={boxStyle}>
                  {/* <img src={Title} alt="" style={{ paddingLeft: "10px" }} /> */}
                  <TextField
                    // type="number"
                    placeholder="Cost"
                    {...register("cost", {
                      required: true,
                      validate: {
                        notNegative: (value) => parseFloat(value) >= 0,
                        // notZero: (value) => parseFloat(value) !== 0,
                      },
                    })}
                    sx={{
                      width: "100%",
                      height: "40px",
                      "& fieldset": { border: "none" },
                    }}
                  />
                </Box>
                {(errors.cost?.type === "notNegative" ||
                  errors.cost?.type === "notZero") && (
                    <Typography sx={{ color: "red", marginTop: "5px" }}>
                      Cost cannot be zero or negative
                    </Typography>
                  )}
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: "5px" }}>Efforts(in hrs.)*</label>
                <Box sx={boxStyle}>
                  <TextField
                    // type="number"
                    placeholder="Efforts"
                    {...register("effort", {
                      required: true,
                      validate: {
                        //@ts-ignore
                        notNegative: (value) => parseFloat(value) >= 0,
                        // notZero: (value) => parseFloat(value) !== 0,
                      },
                    })}
                    sx={{
                      width: "100%",
                      height: "40px",
                      "& fieldset": { border: "none" },
                    }}
                  />
                </Box>
                {(errors.effort?.type === "notNegative" ||
                  errors.effort?.type === "notZero") && (
                    <Typography sx={{ color: "red", marginTop: "5px" }}>
                      Effort cannot be zero or negative
                    </Typography>
                  )}
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: "5px" }}>Threads</label>
                <Select
                  // @ts-ignore
                  value={watch("thread_id")}
                  items={[
                    ...(threads.length === 0
                      ? [{ text: "No threads", value: "", isDisabled: true }]
                      : []),
                    ...threads.map((thread) => ({
                      text: thread.thread_title,
                      value: thread.id?.toString() || "",
                    })),
                  ]}
                  register={register as any}
                  name="thread_id"
                  label=""
                  isRequired={false}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    borderColor: "#9C9C9C",
                    paddingTop: "10px",
                    "@media (max-width: 963px)": {
                      width: "300px",
                    },
                    "@media (max-width: 733px)": {
                      width: "250px",
                    },
                    "@media (max-width: 627px)": {
                      width: "200px",
                    },
                    "@media (max-width: 523px)": {
                      width: "150px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <label style={{ marginLeft: "5px" }}>Description</label>
                <TextField
                  placeholder="Type here"
                  fullWidth
                  multiline={true}
                  rows={5}
                  InputProps={{
                    style: {
                      padding: "10px",
                    },
                  }}
                  {...register("description", { required: false })}
                  sx={{ paddingTop: "10px", paddingBottom: "40px" }}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 7 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                onClick={() => {
                  //   setIsEdit(false);
                  resetForm();
                  handleClose();
                }}
                sx={{ mr: 1 }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!canSave || loading}
              >
                Save
              </Button>
            </Box>
          </form>
        </React.Fragment>
      </DialogContent>
      {loading ? <LoadingSpinner /> : null}
    </Dialog>
  );
};

export default EditEstimate;
