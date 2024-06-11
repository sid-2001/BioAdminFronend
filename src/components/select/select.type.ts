import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";
// import { SxProps } from "@mui/system";

interface SelectProps {
  name: string;
  value?: string | number;
  items: {
    value: string | number;
    text?: string;
    isDisabled?: boolean;
  }[];
  register?: UseFormRegister<FieldValues>;
  label?: string;
  // isRequired?: boolean;
  size?: "small" | "medium";
  disabled?: boolean;
  defaultValue?: unknown;
  defaultChecked?: boolean;
  style?: React.CSSProperties;
  onChange?: (event: React.ChangeEvent<{ value: unknown }>) => void;
  // style?: React.CSSProperties;
  isRequired?: boolean | string;
  // disabled?: boolean;
  // defaultValue?: unknown;
  // defaultChecked?: boolean;
  // style?: React.CSSProperties;
  sx?: any;
  noDatalabel?: string;
  className?: string;
}

export type { SelectProps };
