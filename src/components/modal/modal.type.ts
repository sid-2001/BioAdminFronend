import { CSSProperties, Dispatch, ReactElement, SetStateAction } from "react";
 
interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactElement;
  closeOnBackdropClick?: boolean;
  onCloseCb?: () => void;
  style?: CSSProperties;
}
 
interface SuccessContentProps {
  text: string;
  id: string;
  onClose: () => void;
  type?: string;
}
 
export type { ModalProps, SuccessContentProps };