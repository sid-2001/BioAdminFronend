// import { Outlet } from "react-router-dom";
// import Drawer from "@mui/material/Drawer";
// import Typography from "@mui/material/Typography";
// import { useSelector, useDispatch } from "react-redux";
// import ClearIcon from "@mui/icons-material/Clear";
// import IconButton from "@mui/material/IconButton";

// import { RootState } from "@/store";
// import { close } from "@/slices/navigation.slice";
// import { NavSidebarContainer } from "./navigation.style";
// import SidebarHeader from "@/components/sidebarHeader";
// import NavigationListComponent from "@/components/navigation-list";
// import { NavigationListItemTypes } from "@/components/navigation-list/navigation-list.types";

// const ROUTE_LIST: Array<NavigationListItemTypes> = [
//   {
//     path: "",
//     text: "Dashboard",
//   },
//   {
//     path: "projects",
//     text: "Projects",
//   },
//   {
//     path: "clients",
//     text: "Clients",
//   },
//   {
//     path: "suppliers",
//     text: "Suppliers",
//   },
//   {
//     path: "users",
//     text: "Users",
//   },
//   {
//     path: "templates",
//     text: "Templates",
//   },
//   // {
//   //   path: "",
//   //   text: "Home",
//   //   isSublist: true,
//   //   children: [
//   //     {
//   //       subpath: "home",
//   //       text: "Home",
//   //     },
//   //   ],
//   // },
// ];

// function NavigationLayout() {
//   const dispatch = useDispatch();
//   const open = useSelector((state: RootState) => state.sidebarNavigation.open);

//   return (
//     <section>
//       <Drawer anchor={"left"} open={open} onClose={() => dispatch(close())}>
//         <NavSidebarContainer>
//           <SidebarHeader>
//             <Typography variant="h1">Bb.</Typography>
//             <IconButton
//               aria-label="Close Sidebar"
//               onClick={() => dispatch(close())}
//             >
//               <ClearIcon />
//             </IconButton>
//           </SidebarHeader>

//           <NavigationListComponent subHeading="App List" list={ROUTE_LIST} />
//         </NavSidebarContainer>
//       </Drawer>
//       <Outlet />
//     </section>
//   );
// }

// export default NavigationLayout;
