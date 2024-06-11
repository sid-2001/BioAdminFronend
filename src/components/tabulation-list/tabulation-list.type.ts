import { JSONData } from "@/types/project-data.type"

interface TabulationListComponentProps {
  JSONData: JSONData;
  navigateToIndex: (tableId: number) => void;
  tabValue: number;
  fullViewMode: boolean;
}

export type { TabulationListComponentProps }
