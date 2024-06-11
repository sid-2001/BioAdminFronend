import MenuItem from "@mui/material/MenuItem";

import { SelectProps } from "./select.type";
import { StyledTextField } from "@/components/text-field/text-field.style";
import { Tooltip } from "@mui/material";

const SelectComponent = (props: SelectProps) => {
  const {
    items,
    name,
    label,
    value,
    register,
    isRequired = false,
    disabled,
    defaultValue,
    style,
    onChange,
    size,
    sx,
    noDatalabel,
    className,
  } = props;

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    // Call the passed in onChange prop
    onChange && onChange(event);
    // Handle change in component here...
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const CustomMenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
        maxWidth: "100px",
      },
    },
  };

  return (
    <StyledTextField
      onChange={handleChange}
      select
      fullWidth
      label={label}
      value={value}
      inputProps={
        register &&
        register(name, {
          required: isRequired,
        })
      }
      disabled={disabled}
      defaultValue={defaultValue}
      style={style}
      size={size}
      SelectProps={{ MenuProps: CustomMenuProps }}
      sx={sx}
      className={className}
    >
      {/* {items.map((item) => (
        <MenuItem key={item.value} value={item.value}>
          {item.text.length > 60
            ? item.text.substring(0, 60) + "..."
            : item.text}
        </MenuItem>
      ))} */}
      {items.map((item) => (
        <MenuItem
          key={item?.value}
          value={item?.value}
          disabled={item?.isDisabled}
        >
          {
            <Tooltip title={(item as any)?.text?.length > 35 ? item?.text : ''} placement="left">
              <span>
                {(item as any)?.text?.length > 35 ? (item as any)?.text.substring(0, 35) + "..." : item?.text}</span>
            </Tooltip>
          }
        </MenuItem>
      ))}
      {items && items?.length === 0 ? (
        // <MenuItem style={{display: "flex",justifyContent: "center",alignItems: "center",color: "red", maxHeight: "30px", pointerEvents: "none"}}>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "red",
            maxHeight: "0px",
            pointerEvents: "none",
          }}
        >
          {noDatalabel}
        </p>
      ) : //  </MenuItem>
        null}
    </StyledTextField>
  );
};

export default SelectComponent;
