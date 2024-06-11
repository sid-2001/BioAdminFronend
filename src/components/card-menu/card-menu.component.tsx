
import React from "react";
import { CardMenu, CardSubMenu } from "./card-menu.style";
import { Deactivate, GreenTick } from "@/assets/images";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { CustomCardMenuProps } from "./card-menu.type";

const CustomCardMenu: React.FC<CustomCardMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onDeactivate,
  onEdit,
  status,
  surveyStatus,
  surveySupply,
  config,
  quotaCardMenu,
  isActive,
  permissions,
}) => {
  const handleDeactivate = () => {
    onClose();
    onDeactivate();
  };

  const handleEdit = () => {
    onClose();
    onEdit();
  };

  return (
    <CardMenu
      id="menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <CardSubMenu
        onClick={handleDeactivate}
        style={{
          // background: "#FFFFFF",
          display: config
            ? "none"
            : surveyStatus == 2
              ? "none"
              : status
                ? "none"
                : surveySupply
                  ? "none"
                  : permissions
                    ? "none"
                    : "default",
        }}
      >
        {quotaCardMenu && !isActive ? (
          <img
            src={GreenTick}
            alt="Activate"
            style={{ margin: "0 8px", width: "17px" }}
          />
        ) : (
          <img src={Deactivate} alt="Deactivate" style={{ margin: "0 8px",  }} />
        )}
        {quotaCardMenu && !isActive ? "Activate" : "Deactivate"}
      </CardSubMenu>
      {quotaCardMenu ? (
        isActive ? (
          <CardSubMenu onClick={handleEdit}>
            <BorderColorIcon style={{ margin: "0 4px" }} fontSize="small" />
            Edit
          </CardSubMenu>
        ) : (
          ""
        )
      ) : (
        <CardSubMenu onClick={handleEdit}>
          <BorderColorIcon style={{ margin: "0 4px" }} fontSize="small" />
          Edit
        </CardSubMenu>
      )}
    </CardMenu>
  );
};

export default CustomCardMenu;
