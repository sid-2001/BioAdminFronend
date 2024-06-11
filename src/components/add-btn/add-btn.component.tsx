import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { theme } from "@/constants/theme";

interface AddBtnPropTypes {
  onClick: () => void;
  width?: string;
  disabled?: boolean;
}

function AddBtn({ onClick, width, disabled }: AddBtnPropTypes) {
  return (
    <IconButton
      disabled={disabled}
      sx={{
        width: width ? width : "25px",
        height: "25px",
        padding: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: disabled ? "#f5f5f5 !important" : "#fbf6fb",
        color: theme.palette.primary.main,
        borderRadius: "0.25rem",
      }}
      onClick={onClick}
    >
      <AddIcon width={8} height={8} />
    </IconButton>
  );
}

export default AddBtn;
