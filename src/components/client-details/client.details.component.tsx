// import { TeamsService } from "@/services/teams.service";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { IFormUser } from "../create-user/create-user.type";
// import { useForm, SubmitHandler } from "react-hook-form";
// import {
//   CardMenu,
//   CardSubMenu,
//   DetailsBox,
//   StyledKeys,
//   StyledValues,
//   FlexRowBox,
//   ContactType,
//   PrimaryBox,
// } from "./user.details.style";
// import Tabs from "@/components/tabs";
// import { Box, Button, Grid, IconButton } from "@mui/material";
// import { enqueueSnackbar } from "notistack";
// import TextField from "../text-field";
// import { User } from "@/types/team.type";
// import LoadingSpinner from "../loader";
// import { useParams } from "react-router-dom";
// // import MoreVertIcon from "@mui/icons-material/MoreVert";
// import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
// import EditIcon from "@mui/icons-material/Edit";
// import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
// import { logger } from "@/helpers/logger";
// import { ListService } from "@/services/list.service";
// import SelectComponent from "../select";
// import Divider from "@mui/material/Divider";

// const ClientDetailsComponent = () => {
//   let navigate = useNavigate();
//   const BackGroundColor = (bgId: any) => {
//     if (bgId == 1) {
//       return "#FFD8AA";
//     } else if (bgId == 2) {
//       return "#7AFCCD";
//     } else if (bgId == 3) {
//       return "#D9D9D9";
//     }
//   };
//   const userService = new TeamsService();
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [user, setUser] = useState<User>();
//   const [roles, setRoles] = React.useState<any[]>([]);
//   const listServices = new ListService();
//   const { register, handleSubmit, watch, setValue } = useForm<IFormUser>({
//     defaultValues: {
//       first_name: "",
//       last_name: "",
//       email: "",
//       contact_number: "",
//       role_id: null,
//     },
//   });
//   const { userId } = useParams();

//   const onSubmit: SubmitHandler<IFormUser> = async (data) => {
//     setLoading(true);
//     const payload = {
//       first_name: data.first_name,
//       last_name: data.last_name,
//       email: data.email,
//       contact_number: data.contact_number,
//       role_id: data.role_id,
//     };
//     try {
//       const response = await userService.update_user(Number(1), payload);
//       setUser(response);
//       enqueueSnackbar("User Successfully Created", {
//         variant: "success",
//       });
//       getUser();
//       setIsEdit(false);
//       setLoading(false);
//     } catch (e) {
//       console.log(e);
//       enqueueSnackbar("Oops something went wrong !!", {
//         variant: "error",
//       });
//       setLoading(false);
//     }
//   };
//   const getUser = async () => {
//     const response = await userService.get_user_by_id(String(userId));
//     setValue("first_name", response.first_name);
//     setValue("last_name", response.last_name);
//     setValue("email", response.email);
//     setValue("contact_number", response.contact_number);
//     setValue("role_id", response.role_id);
//     setUser(response);
//   };

//   useEffect(() => {
//     getUser();
//   }, []);
//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     event.stopPropagation();
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = (event: React.MouseEvent<HTMLElement>) => {
//     event.stopPropagation();
//     setAnchorEl(null);
//   };
//   const open = Boolean(anchorEl);

//   const canSave = !!watch("first_name");

//   const getUserRoleList = async () => {
//     try {
//       const data: any = await listServices.user_role_list();
//       setRoles(data);
//     } catch (error) {
//       logger.error(error);
//     }
//   };

//   useEffect(() => {
//     getUserRoleList();
//   }, []);

//   return (
//     <>
//       <FlexRowBox>
//         <div
//           onClick={() => {
//             navigate(`/users`);
//           }}
//           style={{
//             cursor: "pointer",
//           }}
//         >
//           <IconButton>
//             <KeyboardDoubleArrowLeftOutlinedIcon
//               style={{ color: "lightgray", fontSize: "32px" }}
//             />
//           </IconButton>
//         </div>
//         <h2>
//           {user?.first_name} {user?.last_name}
//         </h2>
//         <PrimaryBox
//           display="flex"
//           justifyContent="center"
//           sx={{
//             background: BackGroundColor(user?.user_status_id),
//             // background: "lightgreen",
//             opacity: 0.8,
//           }}
//         >
//           <ContactType
//             sx={{
//               color: "black",
//             }}
//           >
//             {user?.user_status_name && user?.user_status_name?.toUpperCase()}
//           </ContactType>
//         </PrimaryBox>
//       </FlexRowBox>
//       <Tabs
//         setValue={setValue}
//         // value={value}
//         labels={[
//           {
//             label: "Details",
//             isDisabled: false,
//             route: `/users/${user?.id}`,
//           },
//           // {
//           //   label: "Builder",
//           //   isDisabled: false,
//           //   route: `/projects/${projectId}/builder`,
//           // },
//           // {
//           //   label: "Threads",
//           //   isDisabled: false,
//           //   route: `/projects/${projectId}/threads`,
//           // },
//           // {
//           //   label: "Files",
//           //   isDisabled: true,
//           //   route: `/projects/${projectId}/files`,
//           // },
//           // {
//           //   label: "Requests",
//           //   isDisabled: true,
//           //   route: `/projects/${projectId}/requests`,
//           // },
//           // {
//           //   label: "Data",
//           //   isDisabled: true,
//           //   route: `/projects/${projectId}/data`,
//           // },
//           // {
//           //   label: "Insights",
//           //   isDisabled: true,
//           //   route: `/projects/${projectId}/insights`,
//           // },
//         ]}
//         // tabpanels={<Outlet context={{ project, get_project_byid, loading }} />}
//       />
//       <DetailsBox sx={{ padding: "2rem", display: "flex" }}>
//         {isEdit ? (
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <Grid container spacing={2} marginTop={"0.10rem"}>
//                 <Grid item xs={6}>
//                 <label style={{ marginLeft: "5px" }}>First Name*</label>
//                   <TextField
//                     {...register("first_name", { required: true })}
//                     sx={{paddingTop: "5px"}}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                 <label style={{ marginLeft: "5px" }}>Last Name*</label>
//                   <TextField
//                     {...register("last_name", { required: true })}
//                     sx={{paddingTop: "5px"}}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                 <label style={{ marginLeft: "5px" }}>Email*</label>
//                   <TextField
//                     disabled={true}
//                     {...register("email", { required: true })}
//                     sx={{paddingTop: "5px"}}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                 <label style={{ marginLeft: "5px" }}>Phone*</label>
//                   <TextField
//                     {...register("contact_number", { required: true })}
//                     sx={{paddingTop: "5px"}}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                 <label style={{ marginLeft: "5px" }}>Role*</label>
//                   <SelectComponent
//                     value={watch("role_id")?.toString() || ""}
//                     items={roles.map((role) => ({
//                       text: role.name,
//                       value: role?.id?.toString() || "",
//                     }))}
//                     name="role_id"
//                     register={register as any}
//                     isRequired={true}
//                     style={{paddingTop: "5px"}}
//                   />
//                 </Grid>
//               </Grid>
//               <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
//                 <Box sx={{ flex: "1 1 auto" }} />
//                 <Button
//                   onClick={() => {
//                     setIsEdit(false);
//                   }}
//                   sx={{ mr: 1 }}
//                   variant="outlined"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   disabled={!canSave || loading}
//                 >
//                   Save
//                 </Button>
//               </Box>
//             </form>
//         ) : (
//             <Box
//               component="div"
//               sx={{ display: "flex", gap: "60rem"}}
//             >
//               <Box component="div" sx={{ flex: 1 }}>
//                 <Grid container spacing={5} sx={{ marginBottom: "3rem" }}>
//                   <Grid item xs={12} md={6} sx={{ wordBreak: "break-word", }}>
//                     <StyledKeys>First Name</StyledKeys>
//                     <StyledValues>{user?.first_name}</StyledValues>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <StyledKeys>Last Name</StyledKeys>
//                     <StyledValues>{user?.last_name}</StyledValues>
//                   </Grid>
//                   <Grid item sm={12} md={6}>
//                     <StyledKeys>Email</StyledKeys>
//                     <StyledValues>{user?.email}</StyledValues>
//                   </Grid>
//                   <Grid item sm={12} md={6}>
//                     <StyledKeys>Phone</StyledKeys>
//                     <StyledValues>{user?.contact_number}</StyledValues>
//                   </Grid>
//                   <Grid item sm={12} md={6}>
//                     <StyledKeys>Role</StyledKeys>
//                     <StyledValues>{user?.role_name}</StyledValues>
//                   </Grid>
//                 </Grid>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "flex-top",
//                   height: "32px",
//                 }}
//               >
//                 <IconButton
//                   aria-controls="menu"
//                   aria-haspopup="true"
//                   onClick={(e) => {
//                     setIsEdit(true);
//                     handleClose(e);
//                   }}
//                   size="small"
//                   style={{ alignItems: "start" }}
//                 >
//                   {/* <DriveFileRenameOutlineOutlinedIcon
//                     fontSize="medium"
//                     style={{ color: "#5D5D5D" }}
//                   /> */}
//                   <EditIcon fontSize="medium" style={{color: "#5D5D5D"}}/>
//                 </IconButton>
//                 {/* <CardMenu
//                   anchorEl={anchorEl}
//                   open={open}
//                   onClose={handleClose}
//                   anchorOrigin={{
//                     vertical: "top",
//                     horizontal: "left",
//                   }}
//                   transformOrigin={{
//                     vertical: "top",
//                     horizontal: "right",
//                   }}
//                 >
//                   <CardSubMenu
//                     onClick={(e) => {
//                       // deleteUser();
//                       handleClose(e);
//                     }}
//                   >
//                     Delete
//                   </CardSubMenu>
//                   <CardSubMenu
//                     onClick={(e) => {
//                       setIsEdit(true);
//                       handleClose(e);
//                     }}
//                   >
//                     Edit
//                   </CardSubMenu>
//                 </CardMenu> */}
//               </Box>
//             </Box>
//         )}
//         {loading ? <LoadingSpinner /> : null}
//       </DetailsBox>
//     </>
//   );
// };

// export default ClientDetailsComponent;
