interface UploadModalProps {
    open: boolean;
    onClose: () => void;
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
    watermark_file_url?: string;

}

export type { UploadModalProps, FilesTypes }