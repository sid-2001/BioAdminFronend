import * as React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import Dashboard from "@/assets/images/DashboardIcon.svg"
import Project from "@/assets/images/ProjectsIcon.svg";
import Clients from "@/assets/images/ClientsIcon.svg";
// import { LayoutIcon } from "@/assets/images"
import LayoutIcon from "@/assets/images/LayoutIcon4.svg";
import Vendors from "@/assets/images/VendorsIcon.svg";
import Admin from "@/assets/images/AdminIcon.svg";
// import Templates from "@/assets/images/TemplatesIcon.svg"
// import Requests from "@/assets/images/RequestsIcon.svg"
// import Settings from "@/assets/images/Settings2.svg"
// import { Logo, Burger} from "@/assets/images";
// import Expand from "@/assets/images/Expand.svg";
import { ArrowBackRounded } from "@mui/icons-material";
// import LogoutRoundedIcon from "@mui/icons-material/Logout";
import {
  MobileBox,
  StyledListItem,
  ListItemText,
  BurgerButton,
  // StyledCollapse,
  // SublistBtn,
  // BulletPoint,
} from './shared-layout.style'
import { Divider, Stack, Tooltip } from '@mui/material'
import Footer from '../footer/Footer'
import Header from '../header/Header'
import GroupIcon from '@mui/icons-material/Group'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { LocalStorageService } from '@/helpers/local-storage-service'
import { TenantIcon } from "@/assets/images";

const drawerWidth = 200

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  borderRight: "none",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  overflowX: 'hidden',
  borderRight: 'none',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiPaper-root': {
      ...openedMixin(theme),
      borderRight: 'none',
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiPaper-root': {
      ...closedMixin(theme),
      borderRight: 'none',
    },
  }),
}))

const ContentWrapper = styled(Box)(() => ({
  width: '92%',
  paddingLeft: '0.5rem',
  flex: 1,
  marginBottom: '1rem',
  marginLeft: '2rem',
}))

interface NavigationSubType {
  subText: string
  subpath: string
}

interface NavigationTypes {
  path: string
  text: string
  sublist?: Array<NavigationSubType>
  subItems?: boolean
}

export const StyledListItemText = styled(Box)(() => ({
  // backgroundColor: "orangered",
  flex: '1',
  overflowY: 'scroll',
  scrollbarWidth: 'none' /* Firefox */,

  '&::-webkit-scrollbar': {
    display: 'none',
  },
}))

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const localstorageService = new LocalStorageService()
  const userStoredString = localstorageService.get('user')
  const [accountTypeId, setAccountTypeId] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (userStoredString) {
      const userStoredObj = JSON.parse(userStoredString)
      const typeId = userStoredObj.account_type_id
      setAccountTypeId(typeId)
    }
  }, [userStoredString])

  console.log(accountTypeId, 'acc')

  const [sublistItem, setSublistItem] = React.useState<string>('')
  const paths: Array<NavigationTypes> = [
    // {
    //   path: "",
    //   text: "Dashboard",
    // },
    {
      path: 'projects',
      text: 'Projects',
    },
    {
      path: 'clients',
      text: 'Clients',
    },
    {
      path: 'suppliers',
      text: 'Suppliers',
    },
    {
      path: 'tenants',
      text: 'Tenants',
    },
    {
      path: 'users',
      text: 'Admin',
      subItems: true,
      sublist: [
        {
          subpath: 'users',
          subText: 'Users',
        },
        // {
        //   subpath: "permissions",
        //   subText: "Permissions",
        // },
      ],
    },
    {
      path: 'layouts',
      text: 'Layouts',
    },
    // {
    //   path: "surveys",
    //   text: "Surveys",
    // },
  ]

  const toggleHandler = () => {
    setOpen((oldState) => !oldState)
  }

  const icons = [
    // Dashboard,
    Project,
    Clients,
    Vendors,
    TenantIcon,
    Admin,
    LayoutIcon,
    // Clients,
  ]

  const adminIcons = [<GroupIcon style={{ color: '#A939EA' }} />, <VerifiedUserIcon style={{ color: '#A939EA' }} />]
  // const adminIconsSelected = [<GroupIcon style={{ color: theme.palette.primary[100] }} />, <VerifiedUserIcon style={{ color: theme.palette.primary[100] }} />]

  // React.useEffect(() => {
  //   if (location.pathname.split("/")[1] === "library") {
  //     setSublistItem("Library");
  //   }
  //   if (location.pathname?.split("/")[3] == "survey-builder") {
  //     setOpen(false);
  //   } else {
  //     setOpen(true);
  //   }
  // }, [location]);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 100,
        }}
      >
        <Header />
      </Box>
      <Box sx={{ display: 'flex', paddingTop: '4.5rem', marginRight: '1.5rem' }}>
        <Drawer
          variant="permanent"
          open={open}
          sx={{ position: 'relative' }}
          PaperProps={{
            sx: {
              height: 'calc(100% - 140px)',
              top: '70px',
              left: '1%',
              borderRadius: '1rem',
              zIndex: 100,
            },
          }}
        >
          <StyledListItemText>
            <List>
              {paths.map(({ text, path, sublist, subItems }, index) => {
                const pathToMatch = location.pathname.split('/')[1]
                return (
                  <React.Fragment key={index}>
                    <Tooltip title={text} placement="right" disableHoverListener={open}>
                      <StyledListItem
                        key={text}
                        className={path === pathToMatch ? 'active' : text === sublistItem ? 'active' : ''}
                        sx={{ display: accountTypeId !== 1 && path == 'tenants' ? 'none' : 'block' }}
                        onClick={() => {
                          if (path !== "library") {
                            navigate(path);
                          }
                          if (sublistItem === "") {
                            setSublistItem(text);
                          } else {
                            setSublistItem("");
                          }
                        }}
                      >
                        <ListItemButton
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? "initial" : "center",
                            px: 2.5,
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 1,
                              justifyContent: "center",
                              // marginRight: "15px",
                            }}
                          >
                            <img
                              src={icons[index]}
                              alt="icon"
                              width={32}
                              style={{
                                color: "#a93e9a !important",
                                // filter:
                                //   path === pathToMatch
                                //     ? "invert(0%) sepia(1%) saturate(100%) hue-rotate(267deg) brightness(10%) contrast(101%)"
                                //     : text === sublistItem
                                //       ? "invert(0%) sepia(1%) saturate(100%) hue-rotate(267deg) brightness(10%) contrast(101%)"
                                //       : "",
                              }}
                              height={32}
                            />
                          </ListItemIcon>
                          {open && (
                            <ListItemText
                              alignItems="center"
                              display="flex"
                              width="100%"
                              justifyContent="space-between"
                              className={path === pathToMatch ? 'active' : text === sublistItem ? 'active' : ''}
                            >
                              {text}
                              {subItems && (text === sublistItem ? <ExpandLess /> : <ExpandMore />)}
                            </ListItemText>
                          )}
                        </ListItemButton>
                      </StyledListItem>
                    </Tooltip>

                    {text === sublistItem &&
                      sublist?.map(({ subText, subpath }, index) => {
                        const pathToMatch = location.pathname.split('/')
                        return (
                          <Tooltip title={subText} placement="right" disableHoverListener={open}>
                            <StyledListItem
                              key={text}
                              className={`${pathToMatch[1]}/${pathToMatch[2]}` === subpath ? 'active' : ''}
                              sx={{ display: 'block' }}
                              onClick={() => {
                                navigate(subpath);
                              }}
                            >
                              <ListItemButton
                                sx={{
                                  minHeight: 48,
                                  justifyContent: open ? 'initial' : 'center',
                                  px: 2.5,
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 1,
                                    justifyContent: "center",
                                  }}
                                >
                                  {/* <BulletPoint
                                    className={
                                      `${pathToMatch[1]}/${pathToMatch[2]}` ===
                                        subpath
                                        ? "isActive"
                                        : ""
                                    }
                                  /> */}
                                  {`${pathToMatch[1]}/${pathToMatch[2]}` ===
                                    subpath
                                    ? adminIcons[index]
                                    : adminIcons[index]}
                                </ListItemIcon>
                                {open ? (
                                  <ListItemText
                                    className={
                                      `${pathToMatch[1]}/${pathToMatch[2]}` ===
                                        subpath
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    {subText}
                                  </ListItemText>
                                ) : (
                                  ""
                                )}
                              </ListItemButton>
                            </StyledListItem>
                          </Tooltip>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </List>
          </StyledListItemText>

          <MobileBox sx={{ width: "100%" }}>
            <Stack alignItems="center" justifyContent="center">
              {/* <Tooltip title="Settings" placement="right" disableHoverListener={open}>
              <BurgerButton variant="text" sx={{ width: "90%" }}>
                <img src={Settings} alt="" width={28} height={28} />
                <ListItemText ml={2}> Settings</ListItemText>
              </BurgerButton>
              </Tooltip> */}
              {/* <BurgerButton
                variant="text"
                sx={{ width: "90%" }}
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
              >
                <LogoutRoundedIcon width={28} height={28} />
                <ListItemText ml={2}> Log Out</ListItemText>
              </BurgerButton> */}
              <Divider variant="middle" sx={{ width: "80%" }} />
              <BurgerButton
                variant="text"
                onClick={toggleHandler}
                sx={{
                  width: "90%",
                }}
              >
                <ArrowBackRounded
                  sx={{
                    color: "#8E27D7",
                    fontSize: "28px",
                    mr: open ? 0 : 3,
                    transform: !open ? "rotate(180deg)" : "",
                  }}
                />
                <ListItemText ml={2}> Collapsed</ListItemText>
              </BurgerButton>
            </Stack>
          </MobileBox>
        </Drawer>
        <ContentWrapper component={"main"}>
          <Outlet />
        </ContentWrapper>
      </Box>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
