// import { PageTitle, CenteredContainer } from "./admin-permissions.style";
// import LoadingSpinner from "@/components/loader";
// import CustomCardMenu from "@/components/card-menu";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Checkbox,
//   IconButton,
//   Box,
//   Paper,
//   Typography,
//   Button,
// } from "@mui/material";
// import { ListService } from "@/services/list.service";
// // import Button from '@/components/button';
// import { ArrowDown, ArrowUp } from "@/assets/images";
// import { TeamsService } from "@/services/teams.service";
// import {
//   ObjectType,
//   Permission,
//   PermissionType,
//   Role,
//   RolePermissionPostData,
//   RoleType,
// } from "@/types/team.type";
// import {
//   ScrollableTableContainer,
//   StyledHeadTableCell,
//   StyledRolesHeadTableCell,
// } from "./admin-permissions.style";
// import { logger } from "@/helpers/logger";
// import { useSnackbar } from "notistack";

// const PermissionsTable: React.FC = () => {
//   const [roles, setRoles] = useState<RoleType[]>([]);
//   const [objectTypes, setObjectTypes] = useState<ObjectType[]>([]);
//   const [permissionTypes, setPermissionTypes] = useState<PermissionType[]>([]);
//   const [data, setData] = useState<RolePermissionPostData[]>([]);
//   const listService = new ListService();
//   const teamService = new TeamsService();
//   const { enqueueSnackbar } = useSnackbar();

//   const [openRows, setOpenRows] = useState<Record<number, boolean>>({});
//   const [isDataFetched, setIsDataFetched] = useState(false);
//   const [edit, setEdit] = useState(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   // --

//   const handleRoleCheckboxChange = (
//     objectID: number,
//     roleID: number,
//     value: boolean
//   ) => {
//     setData((prevData) => {
//       const newData = [...prevData];
//       const objectIndex = newData.findIndex(
//         (obj) => obj.object_id === objectID
//       );
//       const roleIndex = newData[objectIndex].roles.findIndex(
//         (r) => r.role_id === roleID
//       );

//       // Set all permissions for this role and object to the given value
//       newData[objectIndex].roles[roleIndex].permissions.forEach(
//         (p) => (p.is_active = value)
//       );

//       return newData;
//     });
//   };

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };
//   const EditOpen = Boolean(anchorEl);
//   const toggleOpen = (id: number) => {
//     setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     const postData: RolePermissionPostData[] = objectTypes
//       .map((object) => {
//         const currentObject = data.find((d) => d.object_id === object.id);
//         if (!currentObject) return;

//         const rolesArray = roles
//           .map((role) => {
//             const currentRole = currentObject.roles.find(
//               (r) => r.role_id === role.id
//             );
//             if (!currentRole) return;

//             const permissionsArray = permissionTypes
//               .map((permission) => {
//                 const currentPermission = currentRole.permissions.find(
//                   (p) => p.permission_id === permission.id
//                 );
//                 if (!currentPermission) return;

//                 return {
//                   permission_id: permission.id,
//                   is_active: currentPermission.is_active,
//                 };
//               })
//               .filter(Boolean) as Permission[];

//             return {
//               role_id: role.id,
//               permissions: permissionsArray,
//             };
//           })
//           .filter(Boolean) as Role[];

//         return {
//           object_id: object.id,
//           roles: rolesArray,
//         };
//       })
//       .filter(Boolean) as RolePermissionPostData[];
//     console.log(postData, "postDatapostData", data);

//     try {
//       if (isDataFetched) {
//         await teamService.put_role_permission(postData);
//         enqueueSnackbar("Permissions set successfully!", {
//           variant: "success",
//         });
//       } else {
//         await teamService.post_role_permission(postData);
//         enqueueSnackbar("Permissions set successfully!", {
//           variant: "success",
//         });
//       }
//     } catch (error) {
//       logger.error(error);
//       if ((error as any)?.response?.status === 403) {
//         enqueueSnackbar("Access denied: Insufficient permissions.", {
//           variant: "error",
//         });
//       } else {
//         enqueueSnackbar("An error occurred. Please try again.", {
//           variant: "error",
//         });
//       }
//     }
//     setEdit(false);
//     setIsLoading(false);
//   };

//   // console.log(data,"datadata")

//   useEffect(() => {
//     const initializedData = objectTypes.map((object) => ({
//       object_id: object.id,
//       roles: roles.map((role) => ({
//         role_id: role.id,
//         permissions: permissionTypes.map((permission) => ({
//           permission_id: permission.id,
//           is_active: false,
//         })),
//       })),
//     }));
//     if (!isDataFetched) setData(initializedData);
//   }, [roles, objectTypes, permissionTypes]);

//   const handleCheckboxChange = (
//     objectID: number,
//     roleID: number,
//     permissionID: number,
//     value: boolean
//   ) => {
//     setData((prevData) => {
//       const newData = [...prevData];
//       const objectIndex = newData.findIndex(
//         (obj) => obj.object_id === objectID
//       );
//       const roleIndex = newData[objectIndex].roles.findIndex(
//         (r) => r.role_id === roleID
//       );
//       const permissionIndex = newData[objectIndex].roles[
//         roleIndex
//       ].permissions.findIndex((p) => p.permission_id === permissionID);

//       newData[objectIndex].roles[roleIndex].permissions[
//         permissionIndex
//       ].is_active = value;

//       return newData;
//     });
//   };

//   // console.log(data, 'dataaaaaaaa', openRows)

//   const GetRolesPermissions = async () => {
//     try {
//       const rolePermissionData = await teamService.get_role_permission();
//       if (rolePermissionData && rolePermissionData.length > 0) {
//         setData(rolePermissionData);
//         setIsDataFetched(true);
//       }
//     } catch (error) {
//       logger.error(error);
//       if ((error as any)?.response?.status === 403) {
//         enqueueSnackbar("Access denied: Insufficient permissions.", {
//           variant: "error",
//         });
//       } else {
//         enqueueSnackbar("An error occurred. Please try again.", {
//           variant: "error",
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const rolesData = await listService.get_roles();
//         const objectTypesData = await listService.get_object_type_list();
//         const permissionTypesData =
//           await listService.get_permission_type_list();
//         GetRolesPermissions();
//         // const rolePermissionData = await teamService.get_role_permission();
//         // const rolePermissionData = await teamService.get_role_permission();
//         // if (rolePermissionData && rolePermissionData.length > 0) {
//         //   setData(rolePermissionData);
//         //   setIsDataFetched(true);
//         // }
//         setRoles(rolesData);
//         setObjectTypes(objectTypesData);
//         setPermissionTypes(permissionTypesData);
//         // setData(rolePermissionData);
//       } catch (error) {
//         logger.error(error);
//         if ((error as any)?.response?.status === 403) {
//           enqueueSnackbar("Access denied: Insufficient permissions.", {
//             variant: "error",
//           });
//         } else {
//           enqueueSnackbar("An error occurred. Please try again.", {
//             variant: "error",
//           });
//         }
//         // console.error("Error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   useEffect(() => {
//     GetRolesPermissions();
//   }, []);

//   return (
//     <>
//       <PageTitle variant="h6">Permissions</PageTitle>
//       <ScrollableTableContainer>
//         {isLoading ? (
//           <CenteredContainer>
//             <LoadingSpinner />
//           </CenteredContainer>
//         ) : (
//           <Box sx={{ width: "100%" }}>
//             <Paper
//               sx={{
//                 width: "100%",
//                 boxSizing: "border-box",
//                 mb: 2,
//                 boxShadow: "none",
//               }}
//             >
//               <Box
//                 display={"flex"}
//                 alignItems="flex-end"
//                 justifyContent="flex-end"
//               >
//                 <IconButton
//                   aria-controls="menu"
//                   aria-haspopup="true"
//                   onClick={handleClick}
//                   size="small"
//                   style={{ alignItems: "start" }}
//                 >
//                   <MoreVertIcon
//                     fontSize="medium"
//                     style={{ color: "#C4CDD5" }}
//                   />
//                 </IconButton>

//                 <CustomCardMenu
//                   permissions={true}
//                   anchorEl={anchorEl}
//                   open={EditOpen}
//                   setAnchorEl={setAnchorEl}
//                   onClose={handleClose}
//                   onEdit={() => {
//                     setEdit(true);
//                     setAnchorEl(null);
//                   }}
//                   onDeactivate={() => {}}
//                 />
//               </Box>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <StyledHeadTableCell style={{ paddingLeft: "3.7rem" }}>
//                       Scope
//                     </StyledHeadTableCell>
//                     {roles.map((role) => (
//                       <StyledRolesHeadTableCell key={role.id}>
//                         {role.name}
//                       </StyledRolesHeadTableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {objectTypes.map((object) => (
//                     <React.Fragment key={object.id}>
//                       <TableRow>
//                         <StyledHeadTableCell
//                           onClick={() => toggleOpen(object.id)}
//                           style={{ cursor: "pointer" }}
//                         >
//                           <IconButton size="small" style={{ padding: "1rem" }}>
//                             {openRows[object.id] ? (
//                               <img src={ArrowDown} />
//                             ) : (
//                               <img src={ArrowUp} />
//                             )}
//                           </IconButton>
//                           {object.name}
//                         </StyledHeadTableCell>
//                         {roles.map((role) => (
//                           <TableCell key={role.id}>
//                             <Checkbox
//                               style={{
//                                 color: edit ? "#852EEF" : "#B1A1EE",
//                                 // '&$checked': {
//                                 //   color: '#852EEF ',
//                                 // },
//                               }}
//                               disabled={!edit}
//                               checked={
//                                 data
//                                   ?.find((o) => o.object_id === object.id)
//                                   ?.roles.find((r) => r.role_id === role.id)
//                                   ?.permissions.every((p) => p.is_active) ||
//                                 false
//                               }
//                               onChange={(e) =>
//                                 handleRoleCheckboxChange(
//                                   object.id,
//                                   role.id,
//                                   e.target.checked
//                                 )
//                               }
//                             />
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                       {openRows[object.id] &&
//                         permissionTypes.map((permission) => (
//                           <TableRow key={permission.id}>
//                             <StyledHeadTableCell>
//                               <Typography sx={{ marginLeft: "2.8rem" }}>
//                                 {" "}
//                                 {permission.name}
//                               </Typography>
//                             </StyledHeadTableCell>
//                             {roles.map((role) => (
//                               <TableCell key={role.id}>
//                                 <Checkbox
//                                   style={{
//                                     color: edit ? "#852EEF" : "#B1A1EE",
//                                     // '&$checked': {
//                                     //   color: '#852EEF ',
//                                     // },
//                                   }}
//                                   disabled={!edit}
//                                   checked={
//                                     data
//                                       ?.find((o) => o.object_id === object.id)
//                                       ?.roles.find((r) => r.role_id === role.id)
//                                       ?.permissions.find(
//                                         (p) => p.permission_id === permission.id
//                                       )?.is_active || false
//                                   }
//                                   onChange={(e) =>
//                                     handleCheckboxChange(
//                                       object.id,
//                                       role.id,
//                                       permission.id,
//                                       e.target.checked
//                                     )
//                                   }
//                                 />
//                               </TableCell>
//                             ))}
//                           </TableRow>
//                         ))}
//                     </React.Fragment>
//                   ))}
//                 </TableBody>
//               </Table>
//               <Box
//                 style={{
//                   display: edit ? "flex" : "none",
//                   justifyContent: "flex-end",
//                   padding: "2rem",
//                   gap: "2rem",
//                 }}
//               >
//                 <Button
//                   variant="outlined"
//                   onClick={async () => {
//                     GetRolesPermissions();
//                     setEdit(false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="contained"
//                   onClick={handleSubmit}
//                   disabled={isLoading}
//                 >
//                   Save
//                 </Button>
//               </Box>
//             </Paper>
//           </Box>
//         )}
//       </ScrollableTableContainer>
//     </>
//   );
// };

// export default PermissionsTable;
