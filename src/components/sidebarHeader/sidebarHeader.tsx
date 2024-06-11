import { ReactNode } from "react";
import { Header } from "./sidebarHeader.style";

export interface SidebarHeaderPropsTypes {
  children: ReactNode;
}

function SidebarHeader({ children }: SidebarHeaderPropsTypes) {
  return <Header>{children}</Header>;
}

export default SidebarHeader;
