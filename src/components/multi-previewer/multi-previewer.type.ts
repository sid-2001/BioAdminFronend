import { Section } from "@/types/survey-builder.type";

interface MultiPreviewerComponentProps {
  sections: Section[];
  project: any;
  exportBbProjectDoc: boolean;
  setExportBbProjectDoc: React.Dispatch<React.SetStateAction<boolean>>;
}

export type { MultiPreviewerComponentProps };
