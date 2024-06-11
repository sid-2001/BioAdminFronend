import { ReactNode } from "react";
 
interface ModalContentProps {
  children: ReactNode;
  size: 'xs' | "sm" | "md" | "lg";
}
 
export type { ModalContentProps };