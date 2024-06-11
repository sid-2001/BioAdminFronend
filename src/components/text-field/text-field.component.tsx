import { StyledTextField } from "./text-field.style";
import { TextFieldProps } from "./text-field.type";
import { forwardRef } from "react";

const TextField = forwardRef((props: TextFieldProps, ref) => {
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

    ...rest
  } = props;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    console.log(e?.target?.value);
    if (props.autoSelectOnFocus && e?.target?.value == "0") {
      e.target.select();
    }
  };

  return (
    <StyledTextField
      fullWidth
      id={id}
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
      // onChange={props.onChange}
      style={style}
      InputLabelProps={InputLabelProps}
      placeholder={placeholder}
      InputProps={InputProps}
      error={error}
      // InputLabelProps={InputLabelProps}
      sx={sx}
      {...rest}
    />
  );
});
export default TextField;
