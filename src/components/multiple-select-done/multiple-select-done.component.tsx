import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { MultipleSelectCheckmarksProps } from "./multiple-select.type";
import { StyledInputLabel, StyledListItemText } from "./multiple-select.style";
import { useTheme } from "@mui/material/styles";
import { Button, Chip, ListSubheader, Stack, TextField } from "@mui/material";
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

const MultipleSelectDoneCheckmarks: React.FC<MultipleSelectCheckmarksProps> = ({
  label,
  handleChange = () => { },
  selectedOptions: selectedOptionsProp = [],
  items,
  style,
  width,
  disabled,
  openDialog,
}) => {
  const [selectedOptions, setSelectedOptions] = React.useState<
    { value: string | number; text: string }[]
  >([]);
  const [tempSelectedOptions, setTempSelectedOptions] = React.useState(selectedOptions);
  const [selectOpen, setSelectOpen] = React.useState(false);
  const theme = useTheme();

  const handleDone = () => {
    setSelectedOptions(tempSelectedOptions);
    handleChange(selectedOptions);
    openDialog();
    setSelectOpen(false);
  };

  const [searchQuery, setSearchQuery] = React.useState('');


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredItems = React.useMemo(() => {
    return items?.filter(item =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }, [items, searchQuery]);



  const handleCancel = () => {
    setTempSelectedOptions([]);
    setSelectedOptions([]);
    setSelectOpen(false);
  };

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
        setTempSelectedOptions([]);
        handleChange([]);
      } else {
        setTempSelectedOptions(items || []);
        handleChange(items || []);
      }
    } else {
      const newSelectedOptions =
        items?.filter((item) => value.includes(item.value.toString())) || [];
      setTempSelectedOptions(newSelectedOptions);
      handleChange(newSelectedOptions);
    }
  };

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

  const truncateText = React.useCallback((text: string, length: number) => {
    if (text.length <= length) {
      return text;
    }
    return `${text.substr(0, length)}...`;
  }, []);



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
          open={selectOpen}
          onOpen={() => setSelectOpen(true)}
          // onClose={() => setSelectOpen(false)}
          labelId={`${label}-multiple-checkbox-label`}
          id={`${label}-multiple-checkbox`}
          multiple
          value={selectedOptions.map((option) => option.value.toString())}
          onChange={handleSelectChange}
          input={
            <OutlinedInput
              label={label}
              sx={{
                maxWidth: width ? width : "100%",
                "& .MuiSelect-select": {
                  padding: selectedOptions?.length > 0 ? "12px" : "16px",
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
                maxHeight: "60px",
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
        // onClick={handleClick}
        // onBlur={handleBlur}
        >
          <TextField
            variant="filled"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              margin: '0.5rem',
              width: 'calc(100% - 1rem)' // Adjust width based on margin
            }}
          />
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
          {filteredItems &&
            filteredItems.map((item) => (
              <MenuItem
                key={item.value.toString()}
                value={item.value.toString()}
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
                <StyledListItemText primary={truncateText(item.text, 40)} />
              </MenuItem>
            ))}
          <ListSubheader
            style={{
              width: "100%",
              position: "sticky",
              bottom: 0,
              display: "flex",
              justifyContent: "flex-end",
              padding: "8px",
              gap: "1rem",
              backgroundColor: "#FFF",
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCancel}
              style={{ marginRight: '10px' }}
            >
              Cancel
            </Button>
            <Button
              // disabled={selectedOptions?.length <= 0 || tempSelectedOptions?.length <= 0}
              variant="contained"
              color="primary"
              onClick={handleDone}
            >
              Done
            </Button>
          </ListSubheader>

        </Select>
      </FormControl>

    </div>
  );
};

export default MultipleSelectDoneCheckmarks;
