// import { QuestionAnsTypes } from "../questions-component/single-punch/single-punch-types";

interface UploadModalProps {
    open: boolean;
    onClose: () => void;
    // selectedFileQuestionTitle: FilesTypes | null;
    // setSelectedFileQuestionTitle: React.Dispatch<React.SetStateAction<FilesTypes | null>>;
    // selectedFileQuestionAnswer: FilesTypes | null;
    // setSelectedFileQuestionAnswer: React.Dispatch<React.SetStateAction<FilesTypes | null>>;

    uploadAnswerIndex: number | null;
    setUploadAnswerIndex: React.Dispatch<React.SetStateAction<number | null>>;

    questionAns: any[]
    setQuestionAns: React.Dispatch<React.SetStateAction<any[]>>;

    questionBase: any;
    setQuestionBase: any;
}

interface FilesTypes {
    file_url: string;
    file?: File;
    type: string;
    file_name: string;
    concept_name: string;
    id?: number;
    is_active?: boolean;
    file_size?: number;
    file_extension?: string;

}

export type { UploadModalProps, FilesTypes }