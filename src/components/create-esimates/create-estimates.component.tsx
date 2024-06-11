import { CreateProjectProps, IFormProject } from "./create-estimates.type";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import TextField from "../text-field";
import Select from "@/components/select";
import { ProjectService } from "@/services/projects.service";
import { ProjectThreadService } from "@/services/project-threads.service";
// import { logger } from "@/helpers/logger";

import { useSnackbar } from "notistack";
import LoadingSpinner from "../loader";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useOutletContext, useParams } from "react-router-dom";
import {
  boxStyle,
  // textFieldStyle
} from "./create-estimates.style";
import { ProjectThreadType } from "@/types/project.type";

const CreateEstimate = (props: CreateProjectProps) => {
  const { open, handleClose, getProjectRetriveByID } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const { projectId, surveyId } = useParams();
  const projectService = new ProjectService();
  const threadsService = new ProjectThreadService();
  const { enqueueSnackbar } = useSnackbar();

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
      title: "",
      description: "",
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

  //   const getAndSetClients = async () => {
  //     try {
  //       const data: any = await projectService.get_clients();
  //       setClients(data?.clients);
  //     } catch (error) {
  //       logger.error(error);
  //     }
  //   };

  //   const getMarketList = async () => {
  //     try {
  //       const data = await listServices.get_market_list();
  //       if (data && data) {
  //         const serviceNames = data.map((item: { id: any; name: any }) => ({
  //           value: item.id,
  //           text: item.name,
  //         }));
  //         setMarketList(serviceNames);
  //       }
  //     } catch (error) {
  //       logger.error(error);
  //     }
  //   };

  //   React.useEffect(() => {
  //     getAndSetClients();
  //     getMarketList();
  //   }, []);

  const onSubmit: SubmitHandler<IFormProject> = async (data) => {
    setLoading(true);
    const payload = {
      //   client_id: Number(data.client_id),
      //   project_name: data.project_name,
      //   project_code: data.project_code,
      //   status_id: 1,
      //   project_description: data.project_description,
      //   market_id: data.market_id,
      //   programming_software: data.programming_software,
      title: data.title,
      description: data.description,
      cost: data.cost,
      effort: data.effort,
      project_id: projectId,
      thread_id: data.thread_id ? data.thread_id : null,
    };
    console.log(payload);

    try {
      const data = await projectService.post_effort(Number(surveyId), payload);
      handleClose();
      getProjectRetriveByID();
      resetForm();
      console.log(data);
      enqueueSnackbar("Estimate Sucessfully Created", {
        variant: "success",
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      enqueueSnackbar("Oops somthing went wrong !!", {
        variant: "error",
      });
    }
  };

  const canSave = !!watch("title") && !!watch("effort") && !!watch("cost");

  //   const newprojectName = watch("project_name");
  //   const newClientName = watch("client_id");
  //   const data = clients.find(
  //     (item) => item?.client_id && item.client_id == String(newClientName)
  //   )?.client_name;

  React.useEffect(() => {
    // let projectCode = "";
    // if (data) {
    //   projectCode = data?.slice(0, 2).toUpperCase();
    // }
    // if (newprojectName && projectCode) {
    //   projectCode += "/";
    // }
    // projectCode += newprojectName?.slice(0, 2).toUpperCase();
    // setValue("project_code", projectCode);
  }, [setValue]);

  const resetForm = () => {
    setValue("title", "");
    setValue("description", "");
    setValue("cost", "");
    setValue("thread_id", null);
    setValue("effort", null);
  };

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
          Create New Estimate
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
                    placeholder="Cost"
                    // type="number"
                    {...register("cost", {
                      required: true,
                      validate: {
                        notNegative: (value) => parseFloat(value) >= 0,
                        // notZero: (value) => parseFloat(value) !== 0,
                      },
                    })}
                    // InputLabelProps={{
                    //   shrink:
                    //     data || (newprojectName && data) || newprojectName
                    //       ? true
                    //       : false,
                    // }}
                    sx={{
                      width: "100%",
                      height: "40px",
                      "& fieldset": { border: "none" },
                    }}
                    inputProps={{ step: "0.01" }}
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
                    placeholder="Efforts"
                    // type="number"
                    {...register("effort", {
                      required: true,
                      validate: {
                        // @ts-ignore
                        notNegative: (value) => parseFloat(value) >= 0,
                        // notZero: (value) => parseFloat(value) !== 0,
                      },
                    })}
                    // InputLabelProps={{
                    //   shrink:
                    //     data || (newprojectName && data) || newprojectName
                    //       ? true
                    //       : false,
                    // }}
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
                  value={watch("thread_id")?.toString() || ""}
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
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              {/* <Button
                onClick={() => {
                  resetForm();
                  handleClose();
                }}
                sx={{ mr: 1 }}
                variant="outlined"
              >
                Cancel
              </Button> */}
              <Button
                type="submit"
                variant="contained"
                disabled={!canSave || loading}
              >
                Create
              </Button>
            </Box>
          </form>
        </React.Fragment>
      </DialogContent>
      {loading ? <LoadingSpinner /> : null}
    </Dialog>
  );
};

export default CreateEstimate;
