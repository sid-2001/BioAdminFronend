import "../header/header.css";
import { Avatar, IconButton } from "@mui/material";
import SearchIcon from "@/assets/images/Search.svg";
// import NotificationIcon from "@/assets/images/ion_notifications.svg";
// import DropdownIcon from "@/assets/images/Polygon 8.svg";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
import { TenantService } from "@/services/tenant.service";
import React, { useEffect, useState } from "react";
import { LocalStorageService } from "@/helpers/local-storage-service";
import { useNavigate } from "react-router-dom";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from "@novu/notification-center";
import ENV from "@/environments/environment.development.json";
import {
  Popover,
  Typography,
  ListItem,
  ListItemText,
  List,
  ListItemIcon,
} from "@mui/material";
// import BBClientLogo from "@/assets/images/BBClientLogo.svg"

// import { Link as RouterLink } from "react-router-dom";@ts

import { Box, Button } from "@mui/material";
import { useSnackbar } from "notistack";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { ListService, SearchDataType } from "@/services/list.service";
import { Logo } from "@/assets/images";
import CreateProject from "../create-project/create-project.component";
import CircularProgress from "@mui/material/CircularProgress";
import { theme } from "@/constants/theme";

function Header() {
  const [tenantList, setTenantList] = React.useState<any>([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  //
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDrop, setOpenDrop] = useState(false);
  const [searchedValue, setSearchedValue] = useState<any>("");

  const [options, setOptions] = React.useState<Array<SearchDataType>>([]);
  const [inputValue, setInputValue] = React.useState("");
  const listService = new ListService();

  const [openModal, setOpenModal] = useState(false);
  const handleClick = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };
  const shouldOpenDropdown = options?.length > 0;

  const handleOpenDrop = () => {
    if (shouldOpenDropdown) {
      setOpenDrop(true);
    }
  };

  const handleCloseDrop = () => {
    setOpenDrop(false);
  };

  function getSubsriber(): string {
    let subscriber_id = null;
    let userStoredObj = localstorageService.get("user");
    if (userStoredObj && userStoredObj.length > 0) {
      let userObj = JSON.parse(userStoredObj);
      if (userObj && userObj.object_uid) subscriber_id = userObj.object_uid;
    }
    return subscriber_id;
  }
  // const [currentTenantId, setCurrentTenantId] = useState(null);

  // const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleAvatarClick = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleTenantSwitch = (tenantId: any) => {
    setTenant(tenantId);
    localstorageService.set(
      "selectedTenant",
      (event as any).target.value as string
    );
    handlePopoverClose();
  };

  // const renderTenantList = () => {
  //   return tenantList.map((tenant: any) => (
  //     <ListItem
  //       key={tenant.account_id}
  //       sx={{
  //         backgroundColor:
  //           tenant.account_id === user?.tenant_id ? "lightgreen" : "lightblue",
  //         cursor: tenant.account_id === user?.tenant_id ? "auto" : "pointer",
  //         mb: 1,
  //       }}
  //       // button
  //       onClick={() => {
  //         handleTenantSwitch(tenant.account_id);
  //         handleTenantPostRequest(tenant?.account_id);
  //       }}
  //     >
  //       <ListItemText primary={tenant.name} />
  //       {tenantList && tenantList?.length > 0 && (
  //         <ListItemIcon>
  //           {tenant.account_id === user?.tenant_id ? null : <SwapHorizIcon />}
  //         </ListItemIcon>
  //       )}
  //     </ListItem>
  //   ));
  // };

  const renderTenantList = () => {
    return tenantList && tenantList?.map((tenant: any) => (
      <ListItem
        key={tenant.account_id}
        sx={{
          backgroundColor:
            tenant.account_id === user?.tenant_id ? "lightgreen" : "lightblue",
          cursor: tenant.account_id === user?.tenant_id ? "auto" : "pointer",
          mb: 1,
        }}
        onClick={
          tenant.account_id !== user?.tenant_id
            ? () => {
              handleTenantSwitch(tenant.account_id);
              handleTenantPostRequest(tenant?.account_id);
            }
            : undefined // Set onClick to undefined for already selected tenant
        }
      >
        {tenant?.image ? 
        <Avatar sx={{marginRight: "5px"}} alt={tenant?.name} src={tenant?.image}/>
        : <Avatar sx={{marginRight: "5px"}}>{tenant?.name?.charAt(0)}</Avatar>
      }
        <ListItemText primary={tenant.name} />
        {tenantList && tenantList?.length > 0 && (
          <ListItemIcon>
            {tenant.account_id === user?.tenant_id ? null : <SwapHorizIcon />}
          </ListItemIcon>
        )}
      </ListItem>
    ));
  };

  const open = Boolean(anchorEl);
  const id = open ? "user-popover" : undefined;

  const localstorageService = new LocalStorageService();
  let tenantId = null;
  let userStoredObj = localstorageService.get("user");
  if (userStoredObj && userStoredObj.length > 0) {
    let userObj = JSON.parse(userStoredObj);
    if (userObj && userObj.tenant_id) tenantId = userObj.tenant_id;
  }

  let user = userStoredObj ? JSON.parse(userStoredObj) : {};
  let userEmail = localstorageService.get("userEmail");

  const [tenant, setTenant] = React.useState<any>(tenantId || 1);

  let tenant_service = new TenantService();

  // const handleChange = (event: SelectChangeEvent) => {
  //   setTenant(event.target.value as string);
  //   localstorageService.set("selectedTenant", event.target.value as string);
  // };

  useEffect(() => {
    if (!tenant) handleTenantPostRequest(tenant);
    // if (tenant !== -1) handleTenantPostRequest(tenant);
  }, [tenant]);

  useEffect(() => {
    getTenantList();
  }, []);

  const handleTenantPostRequest = (id: number) => {
    console.log(id);

    tenant_service.switch_tenant(id).then((user) => {
      console.log(user, "useruser");
      localstorageService.set("user", user);
      localstorageService.set("access_token", user.token.replaceAll(`"`, ""));
      window.location.href = "/projects";
      enqueueSnackbar("Successfully Switched Tenant", { variant: "success" });
    });
  };

  const getTenantList = async () => {
    try {
      const data = await tenant_service.get_tenant_list();

      setTenantList(data);
    } catch (error) {
      console.log(error);
    }
  };

  function CircularIndeterminate() {
    return (
      <Box sx={{ display: loading ? "flex" : "none" }}>
        <CircularProgress size="1.5rem" />
      </Box>
    );
  }

  useEffect(() => {
    setTenantList(user?.accounts);
  }, []);

  useEffect(() => {
    const defaultTenant = tenantList && tenantList?.find(
      (tenant: { is_current: any }) => tenant.is_current
    );

    if (defaultTenant) {
      setTenant(
        defaultTenant.account_id
          ? defaultTenant.account_id
          : tenantList?.[0]?.account_id
      );
    }
  }, [tenantList]);

  useEffect(() => {
    setLoading(true);
    if (inputValue)
      listService.get_search_list(inputValue).then((data) => {
        setOptions(data);
      });
    else setOptions([]);
    setLoading(false);
  }, [inputValue]);

  useEffect(() => {
    if (searchedValue) {
      navigate(`${searchedValue.path}`);

      setOptions([]);
    }
  }, [searchedValue]);

  return (
    <div className="header">
      <CreateProject
        open={openModal}
        handleClose={handleClose}
        getProjects={function (): Promise<void> {
          throw new Error("Function not implemented.");
        }} // getProjects={() => filterProjects([], [])}
      />
      {/* <h2 className='heading'>BB.Client</h2> */}
      <img
        src={Logo}
        style={{
          cursor: "pointer",
          marginLeft: "calc(0.1vw)",
          transform: "rotate(24.47deg)",
        }}
        width="60px"
        onClick={() => navigate("projects")}
      />
      {/* <img src={BBClientLogo} alt="Logo" width={42} height={42}/> */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          border: "1px solid white",
          borderRadius: "20px",
          padding: "3px 0px",
          paddingRight: "30px",
          paddingLeft: "12px",
        }}
      >
        <img src={SearchIcon} alt="" style={{ paddingRight: "10px" }} />
        <Autocomplete
          id="grouped-serach"
          options={options}
          open={openDrop}
          onOpen={handleOpenDrop}
          onClose={handleCloseDrop}
          // groupBy={(option) => option.firstLetter}
          getOptionLabel={(option) => option.title}
          groupBy={(option) => option?.resourceType}
          renderGroup={(params) => (
            <li key={params.key} style={{ backgroundColor: "inherit" }}>
              <ul style={{ padding: 0, listStyle: "none" }}>
                <li
                  style={{
                    paddingLeft: "0.5rem",
                    backgroundColor: theme.palette.primary.main,
                    color: "#ffffff",
                    borderRadius: "0.5rem",
                    margin: "0rem 0.5rem",
                  }}
                >
                  {params.group}
                </li>
                <span style={{ background: theme.palette.primary[50] }}>
                  {params.children}
                </span>
              </ul>
            </li>
          )}
          noOptionsText={options?.length <= 0 ? "No records" : ""}
          sx={{
            width: 300,
            "& .MuiInput-underline:before": {
              // Removes the default bottom border
              borderBottom: "none",
            },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              // Removes the hover effect on the bottom border
              borderBottom: "none",
            },
            "& .MuiInput-underline:after": {
              // Removes the bottom border on focus (when the input is active)
              borderBottom: "none",
            },
            // '& .MuiAutocomplete-groupLabel': {
            //   // Custom styles for group labels
            //   backgroundColor: 'lightgray', // Example: set background color
            //   color: 'black', // Example: set text color
            //   fontWeight: 'bold', // Example: set font weight
            //   // Add other styles as needed
            // },
            // '& .MuiAutocomplete-groupUl': {
            //   // Additional styles for the list within the group, if needed
            // },
          }}
          onChange={(_e, value) => {
            setSearchedValue(value);
          }}
          onInputChange={(_e: any, newInputValue: any) => {
            return setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              placeholder="search anything"
              variant="standard"
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: null,
              }}
            />
          )}
        />
        {CircularIndeterminate()}
      </Box>

      {/* <FormControl style={{ width: "30%", height: "20%" }}>
        <InputLabel id="demo-simple-select-label">Tenants</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-sim</Box>ple-select"
          value={tenant}
          label="Tenant"
          onChange={handleChange}
        >
          {tenantList && tenantList?.map((item: any) => <MenuItem value={item.accout_id}>{item.name}</MenuItem>)}
        </Select>
      </FormControl> */}

      {/* <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Button variant="contained">Create Project</Button>
        <img src={NotificationIcon} alt="" width={28} height={28} />
        <Avatar sx={{ width: 27, height: 27, fontSize: 15 }}>A</Avatar>
      </div> */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Button onClick={handleClick} variant="contained">
          Create Project
        </Button>
        {/* <img src={NotificationIcon} alt="" width={28} height={28} /> */}

        <div
          style={{
            // position: "fixed",
            // top: 0,
            // left: 0,
            // width: "100%",
            zIndex: 9999,
          }}
        >
          <NovuProvider
            subscriberId={getSubsriber() != null ? getSubsriber() : "new_sub"}
            // subscriberId='a83d7b0b-0d95-4b1b-855e-f73d6c952532'
            applicationIdentifier={ENV.NOTIFICATION_IDENTIFIER}
          >
            <PopoverNotificationCenter colorScheme="light">
              {({ unseenCount }) => (
                <IconButton
                  sx={{
                    width: "28px",
                    height: "28px",
                    padding: "0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#F0F0F0",
                    borderRadius: "0.25rem",
                  }}
                >
                  <NotificationBell unseenCount={unseenCount} />
                </IconButton>
              )}
            </PopoverNotificationCenter>
          </NovuProvider>
        </div>
        <Avatar
          sx={{ width: 27, height: 27, fontSize: 15, cursor: "pointer" }}
          onClick={handleAvatarClick}
        >
          A
        </Avatar>
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box p={2} style={{ width: "300px" }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{}}>
                {userEmail}
              </Typography>
            </Box>
            <Button
              variant="text"
              sx={{ width: "20%" }}
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              <LogoutRoundedIcon width={28} height={28} />
              {/* <ListItemText > Log Out</ListItemText> */}
            </Button>
          </Box>
          <Box
            sx={{
              maxHeight: 200,
              overflowY: "auto",
              mt: 1,
              bgcolor: "#f7f7f7",
              borderRadius: 1,
            }}
          >
            <List>{renderTenantList()}</List>
          </Box>
        </Box>
      </Popover>
    </div>
  );
}

export default Header;
