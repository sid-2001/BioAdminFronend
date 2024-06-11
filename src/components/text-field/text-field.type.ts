import { ReactNode, ChangeEvent } from "react";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles";
// import { InputLabelProps } from "@mui/material";
interface TextFieldProps {
  label?: string;
  name?: string;
  id?: string;
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  variant?: "standard" | "outlined" | "filled";
  disabled?: boolean;
  fullWidth?: boolean;
  defaultValue?: String;
  type?: "text" | "password" | "number" | "email" | "date" | "color";
  helperText?: ReactNode;
  size?: "small" | "medium";
  placeholder?: string;
  multiline?: boolean;
  // InputLabelProps?: Partial<InputLabelProps> | undefined;
  rows?: number;
  style?: React.CSSProperties;
  InputProps?: Record<string, any>;
  inputProps?: any;
  sx?: SxProps<Theme>;
  InputLabelProps?: {
    shrink: boolean;
  };
  onKeyPress?: any;
  autoSelectOnFocus?: boolean;
  error?: boolean;
}

export type { TextFieldProps };
