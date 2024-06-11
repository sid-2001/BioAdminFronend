interface AttachmentModalComponentProps {
  open: boolean;
  handleClose: any;
  get_project_byid: any;
  project: any;
  changeModal: number | null;
  setChangeModal: React.Dispatch<React.SetStateAction<number | null>>;
}

export type { AttachmentModalComponentProps };
