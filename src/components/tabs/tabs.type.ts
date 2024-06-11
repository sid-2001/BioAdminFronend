import { ReactNode } from "react";

interface TabProps {
  labels: {
    label: string;
    isDisabled: boolean;
    route?: string;
    icon?: any;
  }[];
  tabpanels: ReactNode[] | ReactNode;
  setValue: any;
  value: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export type { TabProps, TabPanelProps };
