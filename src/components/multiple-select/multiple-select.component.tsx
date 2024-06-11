import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { MultipleSelectCheckmarksProps } from "./multiple-select.type";
import { StyledInputLabel, StyledListItemText } from "./multiple-select.style";
import { useTheme } from "@mui/material/styles";
import { Chip, Stack, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
      borderRadius: "8px",
      background: "#FFF",
      boxShadow:
        "0px 8px 24px -4px rgba(199, 203, 206, 0.25), 0px 0px 2px 0px rgba(145, 158, 171, 0.25)",
      overflow: "hidden",
      overflowY: "auto",
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
  },
};

const MultipleSelectCheckmarks: React.FC<MultipleSelectCheckmarksProps> = ({
  label,
  handleChange = () => { },
  selectedOptions: selectedOptionsProp = [],
  items,
  style,
  width,
  disabled,
}) => {
  const [selectedOptions, setSelectedOptions] = React.useState<
    { value: string | number; text: string }[]
  >([]);
  const [_, setIsClicked] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (items) {
      setSelectedOptions(
        selectedOptionsProp
          .map((value) => items.find((item) => item.value === value))
          .filter((item) => item !== undefined) as {
            value: string | number;
            text: string;
          }[]
      );
    }
  }, [selectedOptionsProp, items]);

  const isAllSelected = items?.length === selectedOptions.length;

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    if (value.includes("all")) {
      if (isAllSelected) {
        setSelectedOptions([]);
        handleChange([]);
      } else {
        setSelectedOptions(items || []);
        handleChange(items || []);
      }
    } else {
      const newSelectedOptions =
        items?.filter((item) => value.includes(item.value.toString())) || [];
      setSelectedOptions(newSelectedOptions);
      handleChange(newSelectedOptions);
    }
  };

  const handleClick = () => {
    setIsClicked(true);
  };

  const handleBlur = () => {
    setIsClicked(false);
  };
  const theme = useTheme();

  function truncateText(text: string, length: number) {
    if (text?.length <= length) {
      return text;
    }
    return `${text?.substr(0, length)}...`;
  }

  const handleDeleteOption = (
    event: React.MouseEvent,
    itemToDelete: { value: string | number; text: string }
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const newSelectedOptions = selectedOptions.filter(
      (option) => option.value !== itemToDelete.value
    );
    setSelectedOptions(newSelectedOptions);
    handleChange(newSelectedOptions);
  };

  return (
    <div style={style}>
      <FormControl
        sx={{
          width: "100%",
        }}
      >
        <StyledInputLabel theme={theme} id={`${label}-multiple-checkbox-label`}>
          {label}
        </StyledInputLabel>
        <Select
          labelId={`${label}-multiple-checkbox-label`}
          id={`${label}-multiple-checkbox`}
          multiple
          sx={{ borderRadius: "8px !important" }}
          value={selectedOptions.map((option) => option.value.toString())}
          onChange={handleSelectChange}
          input={
            <OutlinedInput
              label={label}
              sx={{
                maxWidth: width ? width : "100%",
                "& .MuiSelect-select": {
                  padding: selectedOptions?.length > 0 ? "12px" : "12px",
                },
              }}
            />
          }
          renderValue={(selected) => (
            <Stack
              gap={1}
              direction="row"
              flexWrap="nowrap"
              sx={{
                maxHeight: "50px",
                overflowX: "auto",
                whiteSpace: "nowrap",
                overflowY: "hidden",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {selected.map((val: string) => {
                const item = items?.find(
                  (item) => item.value.toString() === val
                );
                return item ? (
                  <Chip
                    size="small"
                    style={{ backgroundColor: theme.palette.grey[200] }}
                    key={item.value.toString()}
                    label={item.text}
                    onDelete={(event) => handleDeleteOption(event, item)}
                    deleteIcon={
                      <CloseIcon
                        sx={{ display: !disabled ? "block" : "none" }}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      />
                    }
                  />
                ) : null;
              })}
            </Stack>
          )}
          // @ts-ignore
          MenuProps={MenuProps}
          onClick={handleClick}
          onBlur={handleBlur}
        >
          <MenuItem
            value="all"
            disabled={disabled}
            sx={() => ({
              maxHeight: "40px",
              margin: "0.5rem",
              "&.Mui-selected": {
                borderRadius: "8px",
                backgroundColor: "#F5F5F5 !important",
                fontWeight: "700 !important",
                fontSize: "14px !important",
                lineHeight: "140% !important",
                color: "var(--secondary-1, #2947BB)",
                maxHeight: "40px",
              },
              "&.Mui-disabled": {
                opacity: "0.6 !important",
              },
              color: isAllSelected
                ? "var(--secondary-1, #2947BB)"
                : theme.palette.text.primary,
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: isAllSelected ? 700 : 400,
              lineHeight: "140%",
              ...(isAllSelected && {
                borderRadius: "8px",
                opacity: 0.8,
                background: "var(--grey-300, #F5F5F5)",
              }),
              "&:hover": {
                borderRadius: "8px",
                opacity: 0.8,
                background: "var(--grey-300, #F5F5F5)",
                transition: "background 0.3s",
                maxHeight: "40px",
              },
            })}
          >
            <Checkbox
              checked={isAllSelected}
              sx={{
                marginRight: 1,
                "&.MuiCheckbox-colorPrimary.Mui-checked": {
                  color: "rgba(51, 102, 255, 1)",
                },
              }}
            />
            <StyledListItemText primary="Select All" />
          </MenuItem>
          {items &&
            items.map((item) => (

              <MenuItem
                key={item.value?.toString()}
                value={item.value?.toString()}
                disabled={disabled}
                sx={() => ({
                  maxHeight: "40px",

                  margin: "0.5rem",
                  "&.Mui-selected": {
                    borderRadius: "8px",
                    backgroundColor: "#F5F5F5 !important",
                    fontWeight: "700 !important",
                    fontSize: "14px !important",
                    lineHeight: "140% !important",
                    color: "var(--secondary-1, #2947BB)",
                    maxHeight: "40px",
                  },
                  "&.Mui-disabled": {
                    opacity: "0.6 !important",
                  },
                  "&:hover": {
                    borderRadius: "8px",
                    opacity: 0.8,
                    background: "var(--grey-300, #DFE3E8)",
                    transition: "background 0.3s",
                    maxHeight: "40px",
                  },
                })}
              >
                <Checkbox
                  checked={selectedOptions.some(
                    (opt) => opt.value.toString() === item.value.toString()
                  )}
                  sx={{
                    marginRight: 1,
                    "&.MuiCheckbox-colorPrimary.Mui-checked": {
                      color: "rgba(51, 102, 255, 1)",
                    },
                  }}
                />
                <Tooltip title={item?.text?.length > 50 ? item.text : ''} placement="right">
                  <StyledListItemText primary={truncateText(item.text, 50)} />
                </Tooltip>
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div >
  );
};

export default MultipleSelectCheckmarks;
