import { useState } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
// import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { useNavigate } from "react-router-dom";

import {
  StyledListItemButton,
  // StyledListItemIcon,
} from "./navigation-list.style";
import {
  NavigationListPropsTypes,
  NavigationListItemTypes,
} from "./navigation-list.types";

function NavigationListItem(props: NavigationListItemTypes) {
  const [open, setOpen] = useState(false);
  const locationArr = location.pathname.split("/");
  const navigate = useNavigate();

  if (!props?.isSublist) {
    return (
      <StyledListItemButton
        className={props.path === locationArr[1] ? "active" : ""}
        onClick={() => navigate(props.path)}
      >
        {/* <StyledListItemIcon>
          <SendIcon />
        </StyledListItemIcon> */}
        <ListItemText primary={props.text} />
      </StyledListItemButton>
    );
  }

  return (
    <>
      <StyledListItemButton
        className={props.path === locationArr[1] ? "sublistActive" : ""}
        onClick={() => setOpen((prev) => !prev)}
      >
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Inbox" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </StyledListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}

function NavigationListComponent(props: NavigationListPropsTypes) {
  const { list, subHeading } = props;

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {subHeading}
        </ListSubheader>
      }
    >
      {list.map((item, i) => (
        <NavigationListItem {...item} key={i} />
      ))}
    </List>
  );
}

export default NavigationListComponent;
