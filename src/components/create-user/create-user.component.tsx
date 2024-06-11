import { CreateUserProps, IFormUser } from "./create-user.type";
import Dialog from "@mui/material/Dialog";
import { Typography } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Button, Grid, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import TextField from "../text-field";
import Select from "@/components/select";
import { logger } from "@/helpers/logger";
import { ListService } from "@/services/list.service";
import { useSnackbar } from "notistack";
import LoadingSpinner from "../loader";
import { useNavigate } from "react-router";
import { TeamsService } from "@/services/teams.service";
import { textFieldStyle } from "./create-user.style";

const CreateUser = (props: CreateUserProps) => {
  const { open, handleClose, getUsers, users } = props;
  const [roles, setRoles] = React.useState<any[]>([]);
  const [existingEmails, setExistingEmails] = useState<string[]>([]);
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const userService = new TeamsService();
  const listServices = new ListService();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm<IFormUser>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      contact_number: "",
      role_id: null,
    },
  });

  const getUserRoleList = async () => {
    try {
      const data: any = await listServices.user_role_list();
      setRoles(data);
    } catch (error) {
      logger.error(error);
    }
  };

  const onSubmit: SubmitHandler<IFormUser> = async (data) => {
    setLoading(true);
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      contact_number: data.contact_number,
      role_id: data.role_id,
    };
    try {
      const data = await userService.create_user(payload);
      handleClose();
      console.log(data);
      getUsers();
      resetForm();
      navigate(`/users`);
      enqueueSnackbar("User Successfully Created", {
        variant: "success",
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      enqueueSnackbar("Oops something went wrong !!", {
        variant: "error",
      });
    }
  };

  const canSave =
    !!watch("first_name") && !!watch("last_name") && !!watch("email");

  const resetForm = () => {
    setValue("first_name", "");
    setValue("last_name", "");
    setValue("email", "");
    setValue("contact_number", "");
    setValue("role_id", null);
    setEmailExists(false);
    clearErrors();
  };

  const isEmailExists = (email: string) => {
    return existingEmails.includes(email);
  };

  useEffect(() => {
    const emails = users.map((user) => user.email); // Assuming users is the array of existing users
    setExistingEmails(emails);
  }, [users]);

  useEffect(() => {
    getUserRoleList();
  }, []);
  return (
    <Dialog
      open={open}
      PaperProps={{ style: { maxHeight: "580px", maxWidth: "760px" } }}
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
          Create New User
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
          marginTop: "-10px",
        }}
      >
        <React.Fragment>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} marginTop={"0.10rem"}>
              <Grid item xs={6}>
                <label style={{ marginLeft: "5px" }}>First Name*</label>
                <TextField
                  placeholder="First name"
                  {...register("first_name", { required: true })}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginLeft: "5px" }}>Last Name*</label>
                <TextField
                  placeholder="Last name"
                  {...register("last_name", { required: true })}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  paddingTop: "10px",
                }}
              >
                <label style={{ marginLeft: "5px" }}>Email*</label>
                <TextField
                  placeholder="Email"
                  {...register("email", {
                    required: true,
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  sx={textFieldStyle}
                  onChange={(e) => {
                    const email = e.target.value;
                    const emailExists = isEmailExists(email);
                    setEmailExists(emailExists);
                  }}
                />
                {errors.email && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ marginTop: "10px" }}
                  >
                    {errors.email.message}
                  </Typography>
                )}
                {emailExists && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ marginTop: "10px" }}
                  >
                    This email already exists
                  </Typography>
                )}
              </Grid>

              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  paddingTop: "10px",
                }}
              >
                <label style={{ marginLeft: "5px" }}>Contact*</label>
                <TextField
                  placeholder="Contact"
                  {...register("contact_number", { required: true })}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <label style={{ marginLeft: "5px" }}>Role*</label>
                <Select
                  value={watch("role_id")?.toString() || ""}
                  items={roles.map((role) => ({
                    text: role.name,
                    value: role?.id?.toString() || "",
                  }))}
                  // label="Role*"
                  name="role_id"
                  label=""
                  register={register as any}
                  isRequired={true}
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
            </Grid>
            <Box
              sx={{ display: "flex", flexDirection: "row", paddingTop: "40px" }}
            >
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

export default CreateUser;
