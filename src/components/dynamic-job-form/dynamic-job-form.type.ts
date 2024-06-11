import { InitialConfigType } from "@/types/project-data.type";

interface DynamicFormProps {
    initialConfig: InitialConfigType;
    closeDialog: () => void;
    getProjectData: () => Promise<void>;
    summary: string;
    viewMode: boolean;
    nanoId: string;
}

export type { DynamicFormProps }