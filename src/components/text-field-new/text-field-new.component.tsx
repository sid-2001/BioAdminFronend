import { StyledTextField } from "./text-field-new.style";
import { TextFieldProps } from "./text-field-new.type";
import { forwardRef } from "react";

const TextFieldNew = forwardRef((props: TextFieldProps, ref) => {
  const {
    id,
    label,
    variant,
    defaultValue,
    type = "text",
    placeholder,
    name = undefined,
    value,
    fullWidth,
    multiline,
    rows,
    size,
    style,
    InputProps,
    sx,
    onKeyPress,
    InputLabelProps,
    error,
    maxRows,

    ...rest
  } = props;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (props.autoSelectOnFocus && e?.target?.value == "0") {
      e.target.select();
    }
  };

  return (
    <StyledTextField
      fullWidth
      id={id}
      maxRows={maxRows}
      // @ts-ignore
      onFocus={handleFocus}
      label={label}
      variant={variant}
      name={name}
      type={type}
      inputRef={ref}
      value={value}
      multiline={multiline}
      rows={rows}
      onWheel={(e: any) => e.target.blur()}
      size={size}
      onKeyPress={onKeyPress}
      // @ts-ignore
      onChange={props.onChange}
      style={style}
      InputLabelProps={InputLabelProps}
      placeholder={placeholder}
      InputProps={InputProps}
      error={error}
      // InputLabelProps={InputLabelProps}
      // @ts-ignore
      sx={sx}
      {...rest}
    />
  );
});
export default TextFieldNew;
