import { ReactNode } from "react";
import { StyledCard } from "./card.style";

interface CardComponentPropTypes {
  children: ReactNode;
  onClick?: () => void;
  disable?: boolean;
}

function CardComponent({ children, onClick, disable }: CardComponentPropTypes) {
  // @ts-ignore
  return <StyledCard sx={{ boxShadow: "none", }} disable={disable} onClick={onClick}>{children}</StyledCard>;
}

export default CardComponent;
