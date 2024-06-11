import { ReactNode } from "react";

import {  GridContainerClent } from "@/styles/grid";

interface GridListComponentPropTypes {
  children: ReactNode;
}

function GridListComponent({ children }: GridListComponentPropTypes) {
  return <GridContainerClent>{children}</GridContainerClent>;
}

export default GridListComponent;
