interface MultipleSelectCheckmarksProps {
  label: string;
  style?: React.CSSProperties;
  items?: {
    value: string | number;
    text: string;
  }[];
  handleChange?: (selected: { value: string | number; text: string }[]) => void;
  selectedOptions?: number[];
  disabled?: boolean;
  width?: string;
  previousSelected?: number[];
  openDialog: () => void
}

export type { MultipleSelectCheckmarksProps };
